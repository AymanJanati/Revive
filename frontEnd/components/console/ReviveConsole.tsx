"use client";

import { useEffect, useState } from "react";
import { SummaryBatch, WasteBatch } from "@/types";

export function ReviveConsole() {
  const [queue, setQueue] = useState<SummaryBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<WasteBatch | null>(null);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [loadingBatch, setLoadingBatch] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/api/batches")
      .then(res => res.json())
      .then(data => {
        setQueue(data.data);
        setLoadingQueue(false);
      })
      .catch(err => {
        console.error("Queue fetch error:", err);
        setLoadingQueue(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedBatchId) return;
    setLoadingBatch(true);
    fetch(`http://localhost:3001/api/batches/${selectedBatchId}`)
      .then(res => res.json())
      .then(data => {
        setSelectedBatch(data.data);
        setLoadingBatch(false);
      })
      .catch(err => {
        console.error("Batch fetch error:", err);
        setLoadingBatch(false);
      });
  }, [selectedBatchId]);

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#0F172A] flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold flex items-center gap-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 via-teal-600 to-teal-400">
              Revive
            </span>
            <span className="text-sm font-normal text-gray-500">Autonomous routing for textile waste valorization</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Online / 4 Agents Active
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Column: Queue */}
        <aside className="w-[400px] bg-white border-r border-[#E5E7EB] overflow-y-auto flex flex-col">
          <div className="p-5 border-b border-[#E5E7EB] sticky top-0 bg-white">
            <h2 className="font-bold text-lg">Incoming Waste Queue</h2>
            <p className="text-sm text-gray-500">Pending operational batches</p>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {loadingQueue ? (
              <div className="text-center text-sm text-gray-500 p-8">Loading queue...</div>
            ) : queue.length === 0 ? (
              <div className="text-center text-sm text-gray-500 p-8">Queue is empty</div>
            ) : (
              queue.map(batch => (
                <button
                  key={batch.id}
                  onClick={() => setSelectedBatchId(batch.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selectedBatchId === batch.id
                      ? "border-emerald-500 bg-emerald-50 shadow-sm"
                      : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">{batch.batchCode}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-gray-100 text-gray-600">
                      {batch.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{batch.sourceLine}</div>
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>{batch.materialType.replace(/_/g, " ")}</span>
                    <span>{batch.quantityKg} kg</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Right Column: Detail & Analysis */}
        <div className="flex-1 overflow-y-auto bg-[#F7F9F8] p-6 lg:p-8">
          {!selectedBatchId ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="text-4xl mb-4">📦</div>
              <p>Select a batch from the queue to review and route</p>
            </div>
          ) : loadingBatch ? (
            <div className="flex justify-center p-12 text-gray-500">Loading batch details...</div>
          ) : selectedBatch ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Intake Record Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                    Waste Batch {selectedBatch.batchCode}
                  </h2>
                  <p className="text-gray-500">Intake Record & Evaluation</p>
                </div>
                <button
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  Launch Autonomous Analysis
                </button>
              </div>

              {/* Data Grid */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Profile</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Source Line</div>
                    <div className="font-semibold">{selectedBatch.sourceLine}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Material</div>
                    <div className="font-semibold">{selectedBatch.materialType.replace(/_/g, " ")}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Quantity</div>
                    <div className="font-semibold">{selectedBatch.quantityKg} kg</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Intake Date</div>
                    <div className="font-semibold">
                      {new Date(selectedBatch.intakeDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Condition</div>
                    <div className="font-semibold">{selectedBatch.conditionLevel}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Contamination</div>
                    <div className="font-semibold">{selectedBatch.contaminationLevel}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Reuse Potential</div>
                    <div className="font-semibold">{selectedBatch.reusePotential.replace(/_/g, " ")}</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">Operator Notes</div>
                  <p className="text-gray-800 bg-gray-50 p-4 rounded-lg italic text-sm">
                    "{selectedBatch.notes}"
                  </p>
                </div>
              </div>

              {/* Attachments */}
              {selectedBatch.attachments && selectedBatch.attachments.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Supporting Files</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedBatch.attachments.map(att => (
                      <div key={att.id} className="border border-gray-200 rounded-xl p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0 text-xl">
                          {att.type === "BATCH_IMAGE" ? "📸" : att.type === "INTAKE_SHEET" ? "📄" : "📝"}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-semibold text-sm truncate">{att.name}</div>
                          <div className="text-xs text-gray-500">{att.type.replace(/_/g, " ")}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
