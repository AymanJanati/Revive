import { NextResponse } from "next/server";
import { seedBatches } from "../../../../data/seed";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const batch = seedBatches.find(b => b.id === id);

  if (!batch) {
    return NextResponse.json(
      {
        error: {
          code: "BATCH_NOT_FOUND",
          message: "The requested batch could not be found."
        }
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: batch });
}
