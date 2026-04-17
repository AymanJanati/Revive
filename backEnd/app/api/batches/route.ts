import { NextResponse } from "next/server";
import { seedBatches } from "../../../data/seed";

export async function GET() {
  // Return summary records only per the contract
  const summaryBatches = seedBatches.map(batch => ({
    id: batch.id,
    batchCode: batch.batchCode,
    sourceLine: batch.sourceLine,
    materialType: batch.materialType,
    quantityKg: batch.quantityKg,
    intakeDate: batch.intakeDate,
    status: batch.status
  }));

  return NextResponse.json({ data: summaryBatches });
}
