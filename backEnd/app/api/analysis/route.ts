import { asApiError, ApiError } from "@/lib/errors/apiError";
import { error, ok } from "@/lib/serializers/apiSerializer";
import { serializeAnalysis } from "@/lib/serializers/analysisSerializer";
import { analysisService } from "@/lib/services/analysisService";
import type { LaunchAnalysisBody } from "@/types/api";

export async function POST(request: Request) {
  try {
    let body: LaunchAnalysisBody;
    try {
      body = (await request.json()) as LaunchAnalysisBody;
    } catch {
      throw new ApiError("INVALID_REQUEST", "Request body must be valid JSON.", 400);
    }

    if (!body || typeof body !== "object") {
      throw new ApiError("INVALID_REQUEST", "Request body is required.", 400);
    }
    if (typeof body.batchId !== "string" || body.batchId.trim().length === 0) {
      throw new ApiError("INVALID_BATCH_ID", "Batch ID is required.", 400);
    }

    const result = await analysisService.run(body.batchId.trim());
    return ok(serializeAnalysis(result));
  } catch (e) {
    const apiError = asApiError(e);
    return error(apiError.code, apiError.message, apiError.status);
  }
}
