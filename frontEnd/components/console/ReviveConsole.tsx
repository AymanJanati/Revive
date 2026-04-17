"use client";

import { useEffect, useState } from "react";
import { SummaryBatch, WasteBatch } from "@/types";

export function ReviveConsole() {
  const [queue, setQueue] = useState<SummaryBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<WasteBatch | null>(null);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [loadingBatch, setLoadingBatch] = useState(false);
  
  // Analysis state
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [runningAgentIndex, setRunningAgentIndex] = useState(0);

  useEffect(() => {
    if (!analysisLoading) {
      setRunningAgentIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setRunningAgentIndex(prev => (prev < 3 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(timer);
  }, [analysisLoading]);

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
    setAnalysisResult(null); // Reset analysis on batch change
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

  const handleLaunchAnalysis = async () => {
    if (!selectedBatchId) return;
    setAnalysisResult(null);
    setAnalysisLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId: selectedBatchId })
      });
      const data = await res.json();
      
      if (data.data) {
        setAnalysisResult(data.data);
        
        // Synchronize the queue array to show the new status badge
        setQueue(prevQueue => prevQueue.map(batch => 
          batch.id === selectedBatchId 
            ? { ...batch, status: "ROUTING_RECOMMENDED" } 
            : batch
        ));
        
        // Synchronize the currently viewing batch's status
        setSelectedBatch(prev => prev ? { ...prev, status: "ROUTING_RECOMMENDED" } : null);
      }
    } catch (err) {
      console.error("Analysis fetch error:", err);
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#0F172A] flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold flex items-center gap-3">
            <img src="/logo.png" alt="Revive Logo" className="h-8 w-auto" />
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
        <aside className="w-[400px] bg-white border-r border-[#E5E7EB] overflow-y-auto flex flex-col shrink-0">
          <div className="p-5 border-b border-[#E5E7EB] sticky top-0 bg-white">
            <h2 className="font-bold text-lg">Incoming Waste Queue</h2>
            <p className="text-sm text-gray-500">Pending operational batches</p>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {loadingQueue ? (
              <div className="text-center text-sm text-gray-500 p-8">Loading queue...</div>
            ) : queue && queue.length === 0 ? (
              <div className="text-center text-sm text-gray-500 p-8">Queue is empty</div>
            ) : (
              queue && queue.map(batch => (
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
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
                      batch.status === "ROUTING_RECOMMENDED" 
                        ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
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
                  onClick={handleLaunchAnalysis}
                  disabled={analysisLoading || selectedBatch.status === "ROUTING_RECOMMENDED"}
                  className={`px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-all ${
                    analysisLoading
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : selectedBatch.status === "ROUTING_RECOMMENDED"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:shadow-md active:scale-95"
                  }`}
                >
                  {analysisLoading ? "Running Agents..." : 
                   selectedBatch.status === "ROUTING_RECOMMENDED" ? "Analysis Completed ✓" : 
                   "Launch Autonomous Analysis"}
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
                    {selectedBatch.attachments.map(att => {
                      const isImage = att.type === "BATCH_IMAGE";
                      const isPDF = att.type === "INTAKE_SHEET" || att.name.endsWith('.pdf');
                      const isDoc = !isImage && !isPDF;
                      
                      return (
                        <div key={att.id} className="group border border-gray-100 rounded-xl p-3 flex flex-col gap-3 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer bg-gray-50/50 hover:bg-white relative overflow-hidden">
                          {/* File Thumbnail Area */}
                          <div className={`w-full h-24 rounded-lg flex items-center justify-center overflow-hidden border relative ${
                            isImage ? 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100/50' :
                            isPDF ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100/50' :
                            'bg-gradient-to-br from-slate-50 to-gray-100 border-gray-200/50'
                          }`}>
                            {isImage && (
                              <svg className="w-8 h-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            )}
                            {isPDF && (
                              <div className="flex flex-col items-center gap-1 mt-1">
                                <svg className="w-8 h-8 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">PDF</span>
                              </div>
                            )}
                            {isDoc && (
                              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            )}
                          </div>
                          
                          {/* File Meta */}
                          <div className="w-full">
                            <div className="font-semibold text-[13px] text-gray-800 truncate group-hover:text-emerald-700 transition-colors" title={att.name}>{att.name}</div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{att.type.replace(/_/g, " ")}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Simulated Loading State */}
              {analysisLoading && !analysisResult && (
                <div className="space-y-6 mt-8">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-blue-500 animate-pulse font-mono text-sm">[RUNNING]</span>
                    <span className="text-gray-900">Agent Orchestration</span>
                  </h2>
                  
                  <div className="grid gap-4">
                    {[
                      { name: "Batch Understanding Agent" },
                      { name: "Value Agent" },
                      { name: "Impact Agent" },
                      { name: "Arbiter Agent" }
                    ].map((agent, idx) => {
                      const isCompleted = idx < runningAgentIndex;
                      const isRunning = idx === runningAgentIndex;
                      const isPending = idx > runningAgentIndex;

                      return (
                        <div key={idx} className={`bg-white p-5 rounded-2xl border shadow-sm flex flex-col gap-3 transition-colors ${isRunning ? 'border-blue-300 bg-blue-50/20' : 'border-gray-100'}`}>
                          <div className="flex justify-between items-start">
                            <h4 className={`font-bold ${isPending ? 'text-gray-400' : 'text-gray-900'}`}>{agent.name}</h4>
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded flex items-center gap-1.5 ${
                              isCompleted ? 'bg-emerald-50 text-emerald-600' :
                              isRunning ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping inline-block" />}
                              {isCompleted ? 'COMPLETED' : isRunning ? 'ANALYZING...' : 'PENDING'}
                            </span>
                          </div>
                          
                          {!isPending ? (
                            <div className={`space-y-2 mt-1 ${isRunning ? 'animate-pulse' : ''}`}>
                              <div className={`h-4 w-3/4 rounded ${isCompleted ? 'bg-gray-100' : 'bg-blue-100'}`} />
                              <div className={`h-3 w-full rounded ${isCompleted ? 'bg-gray-50' : 'bg-blue-50'}`} />
                              <div className={`h-3 w-5/6 rounded ${isCompleted ? 'bg-gray-50' : 'bg-blue-50'}`} />
                            </div>
                          ) : (
                            <div className="text-xs text-gray-300 font-medium italic mt-1 pb-4">Waiting for dependent inputs...</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm mt-6 opacity-70">
                     <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 border-b border-gray-200 pb-2">Final Routing Decision</h3>
                    <div className="grid md:grid-cols-2 gap-8 animate-pulse">
                      <div>
                        <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
                        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-5/6 bg-gray-200 rounded mb-6" />
                        <div className="h-24 w-full bg-gray-200 rounded-xl" />
                      </div>
                      <div className="space-y-4">
                        <div className="h-12 w-full bg-gray-200 rounded-xl" />
                        <div className="h-12 w-full bg-gray-200 rounded-xl" />
                        <div className="h-12 w-full bg-gray-200 rounded-xl" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 opacity-70">
                    {[1, 2, 3, 4].map(idx => (
                      <div key={idx} className="bg-white p-4 justify-between flex flex-col rounded-xl border border-gray-100 h-24 animate-pulse">
                        <div className="h-3 w-1/2 bg-gray-200 rounded mb-2" />
                        <div className="h-6 w-3/4 bg-gray-300 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis Result Display */}
              {analysisResult && (
                <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-emerald-600">⚡</span> Agent Execution Timeline
                  </h2>
                  
                  <div className="grid gap-4">
                    {analysisResult.timeline && analysisResult.timeline.map((item: any, idx: number) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900">{item.agent.replace(/_/g, ' ')}</h4>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-emerald-50 text-emerald-600">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2 font-medium">{item.message}</p>
                        <p className="text-gray-500 text-sm italic border-l-2 border-gray-200 pl-3">
                          {item.reasoning}
                        </p>
                      </div>
                    ))}
                  </div>

                  {analysisResult.finalDecision && (
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 shadow-md">
                      <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 border-b border-emerald-200 pb-2">Final Routing Decision</h3>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <div className="text-3xl font-extrabold text-gray-900 mb-2">
                            {analysisResult.finalDecision.routingOutcome.replace(/_/g, ' ')}
                          </div>
                          <p className="text-gray-700 mt-2 mb-4 leading-relaxed">
                            {analysisResult.finalDecision.explanation}
                          </p>
                          
                          <div className="mt-4 p-4 bg-white rounded-xl border border-emerald-100 shadow-sm">
                            <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Recommended Partner</div>
                            <div className="font-bold text-emerald-700">{analysisResult.finalDecision.recommendedDestination}</div>
                            <div className="text-sm text-gray-500">{analysisResult.finalDecision.partnerType.replace(/_/g, ' ')}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                            <span className="text-gray-600 font-medium">Business Score</span>
                            <span className="font-bold text-lg">{analysisResult.finalDecision.businessScore}/100</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                            <span className="text-gray-600 font-medium">Impact Score</span>
                            <span className="font-bold text-lg">{analysisResult.finalDecision.impactScore}/100</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                            <span className="text-gray-600 font-medium">Confidence Phase</span>
                            <span className="font-bold text-lg text-emerald-600">{analysisResult.finalDecision.confidence}</span>
                          </div>
                          <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-sm mt-4">
                            <div className="text-xs text-emerald-100 uppercase tracking-wider font-bold mb-1">Next Operator Action</div>
                            <div className="font-medium">{analysisResult.finalDecision.nextAction}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Value Snapshot */}
                  {analysisResult.valueSnapshot && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-white p-4 justify-between flex flex-col rounded-xl border border-gray-200">
                        <span className="text-xs text-gray-500 uppercase font-bold">Recoverable Value</span>
                        <span className="font-bold text-xl">${analysisResult.valueSnapshot.recoverableValueEstimate}</span>
                      </div>
                      <div className="bg-white p-4 justify-between flex flex-col rounded-xl border border-gray-200">
                        <span className="text-xs text-gray-500 uppercase font-bold">Waste Diverted</span>
                        <span className="font-bold text-xl text-emerald-600">{analysisResult.valueSnapshot.wasteDivertedKg} kg</span>
                      </div>
                      <div className="bg-white p-4 justify-between flex flex-col rounded-xl border border-gray-200">
                        <span className="text-xs text-gray-500 uppercase font-bold">Social Reuse</span>
                        <span className="font-bold text-xl">{analysisResult.valueSnapshot.socialReusePotential}</span>
                      </div>
                      <div className="bg-white p-4 justify-between flex flex-col rounded-xl border border-gray-200">
                        <span className="text-xs text-gray-500 uppercase font-bold">Sustainability</span>
                        <span className="font-bold text-xl text-teal-600">{analysisResult.valueSnapshot.sustainabilityContribution}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
