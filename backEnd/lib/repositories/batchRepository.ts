import fs from "fs";
import path from "path";
import { seededBatches } from "@/lib/seed/batches";
import type { BatchStatus, WasteBatch, WasteBatchQueueItem } from "@/types/revive";

const DB_FILE = path.join(process.cwd(), "dev.db.json");

function ensureDb() {
  if (!fs.existsSync(DB_FILE)) {
    // Seed initial local DB file
    fs.writeFileSync(DB_FILE, JSON.stringify(seededBatches, null, 2), "utf8");
  }
}

export class BatchRepository {
  private readDb(): WasteBatch[] {
    ensureDb();
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  }

  private writeDb(data: WasteBatch[]): void {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  }

  listQueueItems(): WasteBatchQueueItem[] {
    const batches = this.readDb();
    return batches.map((batch) => ({
      id: batch.id,
      batchCode: batch.batchCode,
      sourceLine: batch.sourceLine,
      materialType: batch.materialType,
      quantityKg: batch.quantityKg,
      intakeDate: batch.intakeDate,
      status: batch.status
    }));
  }

  getById(id: string): WasteBatch | null {
    const batches = this.readDb();
    return batches.find(b => b.id === id) || null;
  }

  setStatus(id: string, status: BatchStatus): boolean {
    const batches = this.readDb();
    const batchIndex = batches.findIndex(b => b.id === id);
    if (batchIndex === -1) return false;
    
    batches[batchIndex].status = status;
    this.writeDb(batches);
    return true;
  }
}

export const batchRepository = new BatchRepository();
