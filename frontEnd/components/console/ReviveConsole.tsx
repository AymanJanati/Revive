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
  const [loadingPhase, setLoadingPhase] = useState(0);

  useEffect(() => {
    if (!analysisLoading) {
      setLoadingPhase(0);
      return;
    }
    const t1 = setTimeout(() => setLoadingPhase(1), 1500); // Value Running
    const t2 = setTimeout(() => setLoadingPhase(2), 3000); // Impact Running
    const t3 = setTimeout(() => setLoadingPhase(3), 4500); // Conflict Detected (2 & 3 are red)
    const t4 = setTimeout(() => setLoadingPhase(4), 7000); // Arbiter Running
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-5 text-[13px] font-medium text-gray-500 border-r border-gray-200 pr-6 hidden lg:flex">
            <div className="flex items-center gap-1.5"><span className="text-gray-400">Site:</span> Casablanca Hub</div>
            <div className="flex items-center gap-1.5"><span className="text-gray-400">Shift:</span> Morning (06:00-14:00)</div>
            <div className="flex items-center gap-2.5 ml-1 pl-5 border-l border-gray-200">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Operator A. Janati" className="w-7 h-7 rounded-full border border-gray-200 shadow-sm bg-gray-100 shrink-0" />
              <span>Operator A. Janati</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">System Online</span> <span className="text-gray-400 hidden sm:inline">| 4 Agents Active</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Column: Queue */}
        <aside className="w-[400px] bg-white border-r border-[#E5E7EB] overflow-y-auto flex flex-col shrink-0">
          <div className="p-5 border-b border-[#E5E7EB] sticky top-0 bg-white flex justify-between items-center z-10">
            <div>
              <h2 className="font-bold text-lg">Incoming Waste Queue</h2>
              <p className="text-sm text-gray-500">Pending operational batches</p>
            </div>
            <button className="relative group text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:border-gray-300 transition-all cursor-not-allowed active:scale-95">
              + Register Intake
              <span className="absolute -top-2 -right-2 bg-indigo-100 text-indigo-700 text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Soon
              </span>
            </button>
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
                <div className="space-y-8 mt-12">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-blue-500 animate-pulse font-mono text-sm">[RUNNING]</span>
                    <span className="text-gray-900">Agent Orchestration</span>
                  </h2>
                  
                  <div className="flex flex-col gap-4 relative">
                    {[
                      { name: "Batch Understanding Agent", getStatus: (p: number) => p === 0 ? 'RUNNING' : p > 0 ? 'COMPLETED' : 'PENDING' },
                      { name: "Value Agent", getStatus: (p: number) => p < 1 ? 'PENDING' : p === 1 ? 'RUNNING' : p === 3 ? 'CONFLICT' : 'COMPLETED' },
                      { name: "Impact Agent", getStatus: (p: number) => p < 2 ? 'PENDING' : p === 2 ? 'RUNNING' : p === 3 ? 'CONFLICT' : 'COMPLETED' },
                      { name: "Arbiter Agent", getStatus: (p: number) => p < 4 ? 'PENDING' : p === 4 ? 'RUNNING' : 'COMPLETED' },
                    ].map((agentConfig, idx) => {
                       const status = agentConfig.getStatus(loadingPhase);
                       
                       const isRunning = status === 'RUNNING';
                       const isConflict = status === 'CONFLICT';
                       const isCompleted = status === 'COMPLETED';
                       const isPending = status === 'PENDING';

                       let containerColor = 'border-gray-100 opacity-50';
                       let badgeColor = 'bg-gray-100 text-gray-400';
                       let textObj = isPending ? 'PENDING' : isCompleted ? 'COMPLETED' : 'ANALYZING...';
                       
                       if (isRunning) {
                         containerColor = idx === 3 ? 'border-indigo-300 bg-indigo-50/20' : 'border-blue-300 bg-blue-50/20';
                         badgeColor = idx === 3 ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700';
                         textObj = idx === 3 ? 'RESOLVING CONFLICT...' : 'ANALYZING...';
                       } else if (isConflict) {
                         containerColor = 'border-red-400 bg-red-50/20 shadow-sm';
                         badgeColor = 'bg-red-100 text-red-700';
                         textObj = 'CONFLICT DETECTED';
                       } else if (isCompleted) {
                         containerColor = 'border-emerald-100 bg-white shadow-sm';
                         badgeColor = 'bg-emerald-50 text-emerald-600';
                         textObj = 'COMPLETED';
                       }

                       return (
                        <div key={idx} className={`bg-white p-5 rounded-2xl border flex flex-col gap-3 transition-all duration-300 ${containerColor}`}>
                          <div className="flex justify-between items-start">
                             <h4 className={`font-bold transition-colors ${isPending ? 'text-gray-400' : isConflict ? 'text-red-700' : 'text-gray-900'}`}>{agentConfig.name}</h4>
                             <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded flex items-center gap-1.5 transition-colors ${badgeColor}`}>
                               {(isRunning || isConflict) && <span className={`w-1.5 h-1.5 rounded-full animate-ping inline-block ${isConflict ? 'bg-red-500' : idx === 3 ? 'bg-indigo-500' : 'bg-blue-500'}`} />}
                               {textObj}
                             </span>
                          </div>
                          
                          {isConflict ? (
                             <div className="text-xs text-red-600 font-medium italic mt-1 pb-1 flex items-center gap-2 bg-red-50 p-2.5 rounded-lg border border-red-100 shadow-inner">
                               <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                               Divergent recommendations detected. Escalating to Arbiter.
                             </div>
                          ) : !isPending ? (
                             <div className={`space-y-2 mt-1 ${isRunning ? 'animate-pulse' : ''}`}>
                               <div className={`h-4 w-3/4 rounded ${isCompleted ? 'bg-gray-100' : isRunning && idx === 3 ? 'bg-indigo-100' : 'bg-blue-100'}`} />
                               <div className={`h-3 w-full rounded ${isCompleted ? 'bg-gray-50' : isRunning && idx === 3 ? 'bg-indigo-50' : 'bg-blue-50'}`} />
                               <div className={`h-3 w-5/6 rounded ${isCompleted ? 'bg-gray-50' : isRunning && idx === 3 ? 'bg-indigo-50' : 'bg-blue-50'}`} />
                             </div>
                          ) : (
                             <div className="text-xs text-gray-400 font-medium italic mt-1 pb-4">Waiting for dependent inputs...</div>
                          )}
                        </div>
                       );
                    })}
                  </div>
                </div>
              )}

              {/* Analysis Result Display */}
              {analysisResult && (
                <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* Final Routing Centerpiece */}
                  {analysisResult.finalDecision && (
                    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.5l7.5 15h-15L12 5.5zM12 10a2 2 0 100 4 2 2 0 000-4z"/></svg>
                      </div>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                        <div className="space-y-2">
                           <div className="flex items-center gap-3 mb-4">
                             <div className="bg-emerald-500 text-gray-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">Final Decision</div>
                             <div className="text-emerald-400 text-sm font-bold tracking-wide">{analysisResult.finalDecision.confidence} CONFIDENCE</div>
                           </div>
                           <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                             {analysisResult.finalDecision.routingOutcome.replace(/_/g, ' ')}
                           </h2>
                           <p className="text-gray-300 text-lg max-w-2xl mt-4 leading-relaxed font-medium">
                             {analysisResult.finalDecision.explanation}
                           </p>
                        </div>
                        <div className="bg-gray-800/80 border border-gray-700/80 p-5 rounded-2xl shrink-0 min-w-[260px] shadow-inner backdrop-blur-sm">
                           <div className="text-xs text-gray-400 uppercase font-black tracking-widest mb-2">Destination Partner</div>
                           <div className="text-xl font-bold text-white mb-1.5 truncate">{analysisResult.finalDecision.recommendedDestination}</div>
                           <div className="text-sm font-medium text-emerald-400 bg-emerald-400/10 inline-block px-2 py-0.5 rounded-md">{analysisResult.finalDecision.partnerType.replace(/_/g, ' ')}</div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-700/50">
                        <div className="flex justify-between items-center bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 transition-colors hover:bg-gray-700/50">
                          <span className="text-gray-400 font-semibold text-sm">Business Alignment</span>
                          <span className="font-black text-2xl text-emerald-400">{analysisResult.finalDecision.businessScore}<span className="text-sm text-gray-500">/100</span></span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 transition-colors hover:bg-gray-700/50">
                          <span className="text-gray-400 font-semibold text-sm">Impact Alignment</span>
                          <span className="font-black text-2xl text-emerald-400">{analysisResult.finalDecision.impactScore}<span className="text-sm text-gray-500">/100</span></span>
                        </div>
                        <div className="flex justify-between items-center bg-emerald-600 p-4 rounded-xl shadow-inner text-white transition-transform active:scale-95 cursor-pointer hover:bg-emerald-500">
                          <div className="flex flex-col">
                            <span className="text-emerald-100 font-bold text-[10px] uppercase tracking-wider mb-1">Next Action</span>
                            <span className="font-bold text-sm leading-tight pr-4">{analysisResult.finalDecision.nextAction}</span>
                          </div>
                          <svg className="w-6 h-6 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Decision Conflict Arbitrator */}
                    {analysisResult.decisionConflict && (
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:border-indigo-200 transition-colors">
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                          <h3 className="font-bold text-gray-900 flex items-center gap-2">
                             <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                             Trade-off Arbitration
                          </h3>
                          {analysisResult.decisionConflict.hasConflict ? (
                            <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wider uppercase flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>Conflict Detected</span>
                          ) : (
                            <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wider uppercase">Consensus Reached</span>
                          )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col gap-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-xl flex flex-col">
                              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>Value Agent</div>
                              <div className="font-bold text-slate-900 mb-2 truncate">{analysisResult.decisionConflict.valueAgentRecommendation.replace(/_/g, ' ')}</div>
                              <p className="text-xs font-medium text-slate-600 flex-1 leading-relaxed">{analysisResult.decisionConflict.valueAgentReasoning}</p>
                            </div>
                            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex flex-col">
                              <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Impact Agent</div>
                              <div className="font-bold text-emerald-900 mb-2 truncate">{analysisResult.decisionConflict.impactAgentRecommendation.replace(/_/g, ' ')}</div>
                              <p className="text-xs font-medium text-emerald-700 flex-1 leading-relaxed">{analysisResult.decisionConflict.impactAgentReasoning}</p>
                            </div>
                          </div>
                          
                          {/* VS Badge */}
                          {analysisResult.decisionConflict.hasConflict && (
                             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-12 bg-white rounded-full p-2 shadow-sm border border-gray-100 z-10 hidden sm:block">
                               <div className="bg-gray-100 text-gray-500 font-black text-[10px] rounded-full w-6 h-6 flex items-center justify-center">VS</div>
                             </div>
                          )}

                          <div className="mt-auto relative z-0">
                             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl blur opacity-30"></div>
                             <div className="relative bg-white border border-indigo-100/50 p-4 rounded-xl shadow-sm">
                               <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>Arbiter Resolution Focus</div>
                               <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                                 {analysisResult.decisionConflict.resolutionRationale}
                               </p>
                             </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Operational Impact Preview & Rejected */}
                    <div className="flex flex-col gap-6 h-full">
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                        <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 mb-5">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                          Operational Impact Preview
                        </h3>
                        {analysisResult.valueSnapshot && (
                          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl">
                              <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Recoverable Value</div>
                              <div className="text-xl font-black text-gray-900">${analysisResult.valueSnapshot.recoverableValueEstimate}</div>
                            </div>
                            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
                              <div className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider mb-1">Waste Diverted</div>
                              <div className="text-xl font-black text-emerald-600">{analysisResult.valueSnapshot.wasteDivertedKg} kg</div>
                            </div>
                            <div>
                              <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2">Urgency / Fit</div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-[11px] font-bold px-2 py-1 rounded uppercase ${analysisResult.valueSnapshot.urgencyLevel === 'IMMEDIATE' ? 'text-red-700 bg-red-100' : 'text-amber-700 bg-amber-100'}`}>{analysisResult.valueSnapshot.urgencyLevel}</span>
                                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded uppercase">FIT {analysisResult.valueSnapshot.destinationFitScore}/100</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2">Sustainability KPIs</div>
                              <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold text-gray-700 bg-gray-50 px-2 py-1 rounded inline-flex justify-between items-center"><span className="text-gray-400">Reuse</span> <span className="text-teal-600 font-bold">{analysisResult.valueSnapshot.socialReusePotential}</span></span>
                                <span className="text-xs font-semibold text-gray-700 bg-gray-50 px-2 py-1 rounded inline-flex justify-between items-center"><span className="text-gray-400">CSR</span> <span className="text-blue-600 font-bold">{analysisResult.valueSnapshot.sustainabilityContribution}</span></span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Why not the other routes? */}
                      {analysisResult.finalDecision && analysisResult.finalDecision.rejectedRoutes && analysisResult.finalDecision.rejectedRoutes.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex-1 flex flex-col">
                          <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Why not other routes?
                          </h3>
                          <div className="space-y-3 flex-1">
                            {analysisResult.finalDecision.rejectedRoutes.map((route: any, idx: number) => (
                              <div key={idx} className="flex gap-3 items-start bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="mt-0.5 bg-red-100 p-1 rounded-full shrink-0">
                                  <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-xs text-gray-900">{route.route.replace(/_/g, ' ')}</div>
                                  <div className="text-[11px] text-gray-600 font-medium mt-0.5 leading-relaxed">{route.reason}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compact Autonomous Log */}
                  <div className="bg-[#0F172A] rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center p-3 bg-slate-900 border-b border-slate-700/50">
                      <div className="flex items-center gap-3 text-slate-400 text-[10px] font-mono tracking-widest uppercase font-bold">
                        <div className="flex gap-1.5 ml-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                        </div>
                        <span className="ml-2">agent_execution.log // system</span>
                      </div>
                    </div>
                    <div className="p-5 font-mono text-[11px] text-slate-300 leading-relaxed max-h-[220px] overflow-y-auto w-full custom-scrollbar space-y-3">
                      {analysisResult.timeline && analysisResult.timeline.map((item: any, idx: number) => (
                        <div key={idx} className="w-full relative group">
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-700 group-hover:bg-emerald-500/50 transition-colors"></div>
                          <div className="pl-4">
                            <div className="flex items-center gap-3">
                               <span className="text-slate-500 shrink-0 select-none">[{new Date().toISOString().split('T')[1].slice(0,11)}]</span>
                               <span className="font-bold text-emerald-400 shrink-0">{item.agent}</span>
                               <span className="text-slate-600">----------------------</span>
                               <span className="text-emerald-500 font-bold shrink-0">EXEC_SUCCESS</span>
                            </div>
                            <div className="pl-[88px] text-slate-400 mt-1 mb-2 space-y-1">
                              <div><span className="text-slate-500 select-none">sys.out &gt; </span><span className="text-slate-300 font-medium">{item.message}</span></div>
                              <div><span className="text-slate-500 select-none">sys.rag &gt; </span>{item.reasoning}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="pl-4 mt-4 mb-2 animate-pulse flex items-center gap-3">
                         <span className="text-slate-500 select-none">[{new Date().toISOString().split('T')[1].slice(0,11)}]</span>
                         <span className="font-bold text-emerald-400">SYSTEM_ARBITER</span>
                         <span className="text-slate-600">-------------------</span>
                         <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 rounded">ROUTING_LOCKED</span>
                      </div>
                    </div>
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
