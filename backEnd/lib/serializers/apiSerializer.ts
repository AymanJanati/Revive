import { NextResponse } from "next/server";
import type { ApiErrorCode } from "@/types/revive";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function error(code: ApiErrorCode, message: string, status: number) {
  return NextResponse.json(
    {
      error: {
        code,
        message
      }
    },
    { status }
  );
}

