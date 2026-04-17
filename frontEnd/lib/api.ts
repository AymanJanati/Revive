import type {
  AnalysisResult,
  ApiErrorResponse,
  ApiSuccess,
  LaunchAnalysisRequest,
  WasteBatch,
  WasteBatchQueueItem
} from "../../types/revive";
import { getSeededAnalysis, getSeededBatchDetails, seededQueue } from "@/lib/mock";

type Json = unknown;

class ReviveApiError extends Error {
  readonly kind = "ReviveApiError";
  readonly code?: string;
  readonly httpStatus?: number;

  constructor(message: string, opts?: { code?: string; httpStatus?: number }) {
    super(message);
    this.code = opts?.code;
    this.httpStatus = opts?.httpStatus;
  }
}

function isApiErrorResponse(value: Json): value is ApiErrorResponse {
  if (!value || typeof value !== "object") return false;
  const v = value as { error?: unknown };
  if (!v.error || typeof v.error !== "object") return false;
  const e = v.error as { code?: unknown; message?: unknown };
  return typeof e.code === "string" && typeof e.message === "string";
}

function isApiSuccess<T>(value: Json): value is ApiSuccess<T> {
  if (!value || typeof value !== "object") return false;
  return "data" in (value as Record<string, unknown>);
}

function apiBase() {
  // Optional: point the frontend at an external backend service.
  return (process.env.NEXT_PUBLIC_REVIVE_API_BASE_URL ?? "").replace(/\/$/, "");
}

function url(path: string) {
  const base = apiBase();
  return base ? `${base}${path}` : path;
}

async function readJsonSafe(resp: Response): Promise<Json> {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const resp = await fetch(url(path), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const payload = await readJsonSafe(resp);

  if (!resp.ok) {
    if (isApiErrorResponse(payload)) {
      throw new ReviveApiError(payload.error.message, { code: payload.error.code, httpStatus: resp.status });
    }
    throw new ReviveApiError(`Request failed (${resp.status})`, { httpStatus: resp.status });
  }

  if (isApiErrorResponse(payload)) {
    throw new ReviveApiError(payload.error.message, { code: payload.error.code, httpStatus: resp.status });
  }

  if (!isApiSuccess<T>(payload)) {
    throw new ReviveApiError("Invalid response shape from API.", { httpStatus: resp.status });
  }

  return payload.data as T;
}

function shouldUseSeededFallback(e: unknown) {
  // Only fall back when the frontend is running without an external API base configured.
  // If the team sets `NEXT_PUBLIC_REVIVE_API_BASE_URL`, errors should surface instead of silently masking issues.
  if (apiBase()) return false;

  if (e instanceof ReviveApiError) {
    // Common case when API routes are not present yet in early development.
    return e.httpStatus === 404;
  }
  return e instanceof TypeError; // fetch/network errors
}

export const api = {
  async getBatches(): Promise<WasteBatchQueueItem[]> {
    try {
      return await requestJson<WasteBatchQueueItem[]>("/api/batches");
    } catch (e) {
      if (shouldUseSeededFallback(e)) return seededQueue;
      throw e;
    }
  },

  async getBatchById(id: string): Promise<WasteBatch> {
    try {
      return await requestJson<WasteBatch>(`/api/batches/${encodeURIComponent(id)}`);
    } catch (e) {
      if (shouldUseSeededFallback(e)) {
        const seeded = getSeededBatchDetails(id);
        if (!seeded) throw new ReviveApiError("The requested batch could not be found.", { code: "BATCH_NOT_FOUND" });
        return seeded;
      }
      throw e;
    }
  },

  async launchAnalysis(req: LaunchAnalysisRequest): Promise<AnalysisResult> {
    try {
      return await requestJson<AnalysisResult>("/api/analysis", {
        method: "POST",
        body: JSON.stringify(req)
      });
    } catch (e) {
      if (shouldUseSeededFallback(e)) {
        const seeded = getSeededAnalysis(req.batchId);
        if (!seeded) throw new ReviveApiError("Analysis failed for the requested batch.", { code: "ANALYSIS_FAILED" });
        return seeded;
      }
      throw e;
    }
  },

  humanizeError(e: unknown) {
    if (e instanceof ReviveApiError) return e.message;
    if (e instanceof Error) return e.message;
    return "Unexpected error.";
  }
};
