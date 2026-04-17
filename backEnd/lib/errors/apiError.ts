import type { ApiErrorCode } from "@/types/revive";

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;

  constructor(code: ApiErrorCode, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function asApiError(e: unknown): ApiError {
  if (e instanceof ApiError) return e;
  if (e instanceof Error) {
    return new ApiError("INTERNAL_SERVER_ERROR", e.message, 500);
  }
  return new ApiError("INTERNAL_SERVER_ERROR", "Unexpected server error.", 500);
}

