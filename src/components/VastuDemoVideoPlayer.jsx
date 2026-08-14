import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Compass, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export default function VastuDemoVideoPlayer({ onNavigateToStart }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100 (%)
  const [activeStep, setActiveStep] = useState(1); // 1: Upload | 2: Scan & Align | 3: Calculate Score | 4: Generate Report

  // 10-second animation loop (10,000 ms)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          return 0; // Loop back to start
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Determine current step based on progress % (10s total duration)
  useEffect(() => {
    if (progress < 25) {
      setActiveStep(1); // 0s - 2.5s: Floor plan upload
    } else if (progress < 50) {
      setActiveStep(2); // 2.5s - 5s: 16-Zone scanning & room placement
    } else if (progress < 75) {
      setActiveStep(3); // 5s - 7.5s: Calculating score (88/100)
    } else {
      setActiveStep(4); // 7.5s - 10s: Report generated
    }
  }, [progress]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const restartVideo = () => {
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-5xl mx-auto rounded-3xl border border-amber-400/40 bg-slate-950 text-white shadow-2xl overflow-hidden relative my-12 backdrop-blur-md">
      {/* Screen Canvas (Animated Simulation Window) */}
      <div className="relative w-full aspect-[16/9] min-h-[360px] bg-slate-950 overflow-hidden flex items-center justify-center select-none pt-8 pb-4">
        
        {/* Step Overlay Watermark Label Top Center */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-slate-950/95 border border-amber-400/50 text-amber-300 px-3.5 py-1 rounded-full text-[9px] sm:text-xs font-mono font-extrabold shadow-xl tracking-wider uppercase flex items-center gap-1.5 whitespace-nowrap max-w-[92%]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
          <span>
            {activeStep === 1 && 'Step 1: Upload Floor Plan'}
            {activeStep === 2 && 'Step 2: Auto 16-Zone Scan'}
            {activeStep === 3 && 'Step 3: Instant Vastu Score'}
            {activeStep === 4 && 'Step 4: Generate Vedic Report'}
          </span>
        </div>

        {/* Animated Blueprint Grid Background */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* --- STEP 1: UPLOADING FLOOR PLAN (0s - 2.5s) --- */}
        {activeStep === 1 && (
          <div className="relative z-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300 w-full h-full flex flex-col items-center justify-center p-4">
            <div className="relative max-w-xl rounded-2xl overflow-hidden border-2 border-amber-400/60 bg-white p-2 shadow-2xl">
              <img 
                src="/demo_floorplan.png" 
                alt="Main Floor Plan" 
                className="w-full max-h-[240px] object-contain rounded-lg filter contrast-105"
              />
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center">
                <div className="bg-slate-950/95 border border-amber-400 px-5 py-2.5 rounded-xl text-amber-300 text-xs font-mono font-bold flex items-center gap-2 shadow-2xl">
                  <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
                  <span>Processing Floor Plan Architectural Vector...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: 16-ZONE SCANNING & ROOM ALIGNMENT (2.5s - 5s) --- */}
        {activeStep === 2 && (
          <div className="relative w-full h-full p-4 flex items-center justify-center animate-in fade-in duration-300">
            {/* Real Architectural Floor Plan Image with Vector Highlights */}
            <div className="relative max-w-xl rounded-2xl border-2 border-amber-400/80 bg-white p-2 shadow-2xl overflow-hidden">
              <img 
                src="/demo_floorplan.png" 
                alt="Main Floor Plan" 
                className="w-full max-h-[240px] object-contain rounded-lg"
              />

              {/* Scanning Laser Sweep Beam */}
              <div 
                className="absolute top-0 bottom-0 w-1.5 bg-gradient-to-b from-transparent via-amber-400 to-transparent shadow-[0_0_20px_#f59e0b] z-20"
                style={{ left: `${((progress - 25) / 25) * 100}%` }}
              />

              {/* Positioned Room Pills overlaying the floor plan */}
              <div className="absolute top-4 right-16 bg-slate-950/95 border border-emerald-400 text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> KITCHEN (SE)
              </div>

              <div className="absolute top-4 left-8 bg-slate-950/95 border border-amber-400 text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> MASTER BDR (NE)
              </div>

              <div className="absolute bottom-12 left-8 bg-slate-950/95 border border-amber-400 text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> BEDROOM 2 (NW)
              </div>

              <div className="absolute bottom-12 right-12 bg-slate-950/95 border border-amber-400 text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> GARAGE (SE)
              </div>

              {/* Rotating Compass Wheel Center */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-amber-400 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center shadow-2xl">
                <Compass className="w-10 h-10 text-amber-400 animate-spin-slow" />
                <span className="absolute top-1 text-[8px] font-mono text-amber-300 font-extrabold">N 0°</span>
              </div>
            </div>

            {/* Floating Banner */}
            <div className="absolute bottom-3 bg-slate-950/90 border border-amber-400/50 text-amber-300 px-4 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 shadow-xl">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Scanning 16 MahaVastu Energy Zones...</span>
            </div>
          </div>
        )}

        {/* --- STEP 3: CALCULATE VAASTU SCORE (5s - 7.5s) --- */}
        {activeStep === 3 && (
          <div className="relative z-10 text-center space-y-4 animate-in zoom-in-95 duration-300">
            {/* Animated Circular Score Dial */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke="url(#goldGradient)" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeDasharray="264" 
                  strokeDashoffset={264 - (264 * 0.88)} 
                  strokeLinecap="round" 
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-amber-400 font-mono">88</span>
                <span className="text-[9px] font-bold text-slate-400">/ 100 SCORE</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Prosperity &amp; Harmony Index
              </div>
              <h4 className="text-base font-extrabold text-white">Vastu Score Calculated Successfully</h4>
            </div>

            <button
              type="button"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg inline-flex items-center gap-2 animate-pulse"
            >
              <span>CHECK VAASTU REPORT NOW &rarr;</span>
            </button>
          </div>
        )}

        {/* --- STEP 4: GENERATED REPORT CARD PREVIEW (7.5s - 10s) --- */}
        {activeStep === 4 && (
          <div className="relative w-full max-w-lg mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-slate-900/95 border-2 border-amber-400/60 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">OFFICIAL 16-ZONE VASTU AUDIT</h4>
                    <p className="text-[10px] text-amber-300/80 font-mono">ID: VS-2026-8890 • Certified Report</p>
                  </div>
                </div>
                <span className="text-xs font-black bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg font-mono">
                  88/100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">LAKSHMI CASH FLOW</span>
                  <span className="text-xs font-extrabold text-amber-400">92% Optimal</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">HEALTH &amp; PEACE</span>
                  <span className="text-xs font-extrabold text-emerald-400">85% Balanced</span>
                </div>
              </div>

              <div className="bg-amber-400/10 border border-amber-400/30 p-2.5 rounded-xl text-left">
                <span className="text-[10px] font-bold text-amber-300 block mb-0.5">✅ Demolition-Free Remedy:</span>
                <p className="text-[11px] text-slate-300">Apply 3-inch elemental brass strip in South-West corner to lock cash flow.</p>
              </div>

              <button
                type="button"
                onClick={onNavigateToStart}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-102 transition-all cursor-pointer"
              >
                <span>GENERATE YOUR REPORT FREE &rarr;</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Video Player Bottom Controls */}
      <div className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold hover:bg-yellow-300 transition-all cursor-pointer"
            title={isPlaying ? 'Pause Demo' : 'Play Demo'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={restartVideo}
            className="text-slate-400 hover:text-white transition-colors p-1"
            title="Restart Demo Video"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <span className="font-mono text-[11px] text-amber-300/90 font-bold hidden sm:inline">
            Step {activeStep} of 4 • {Math.min(Math.floor((progress / 100) * 10), 10)}s / 10s
          </span>
        </div>

        <button
          type="button"
          onClick={onNavigateToStart}
          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-md hover:scale-102 transition-all cursor-pointer"
        >
          <span>Check Vaastu</span>
          <ArrowRight className="w-3 h-3 text-slate-950" />
        </button>
      </div>
    </div>
  );
}
