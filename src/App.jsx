import React, { useState, useEffect, useMemo } from 'react';
import LandingPage from './components/LandingPage';
import FloorPlanCanvas from './components/FloorPlanCanvas';
import RoomTaggingToolbar from './components/RoomTaggingToolbar';
import VastuReportView from './components/VastuReportView';
import AccuracyWizardModal from './components/AccuracyWizardModal';
import HandDrawingCanvas from './components/HandDrawingCanvas';
import VastuExpertModal from './components/VastuExpertModal';
import LeadCaptureModal from './components/LeadCaptureModal';
import AdminPanel from './components/AdminPanel';
import { saveLead } from './lib/supabase';
import { sendReportConfirmationEmail } from './lib/emailService';
import { convertPdfFileToDataUrl } from './utils/pdfHelper';
import { evaluateVastu } from './utils/vastuEngine';
import { autoDetectRoomsFromFloorPlan } from './utils/floorPlanScanner';
import { scanFloorPlanWithGeminiVision } from './utils/geminiVisionScanner';
import { Compass, HelpCircle, FileText, ArrowRight, ArrowLeft, Upload, Grid, Pencil, MessageSquare, ShieldCheck, Home, AlertCircle, Sparkles, Key, Check, RefreshCw } from 'lucide-react';

export default function App() {
  // Path Routing: '/' for Landing Page, '/start' for Studio App
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const [svgContent, setSvgContent] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [northAngle, setNorthAngle] = useState(0);
  const [placedRooms, setPlacedRooms] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [centerPos, setCenterPos] = useState({ x: 400, y: 300 });
  const [plotExtraData, setPlotExtraData] = useState({});
  const [isAccuracyModalOpen, setIsAccuracyModalOpen] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [userData, setUserData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vastu_user')) || null;
    } catch {
      return null;
    }
  });
  const [isCustomGridMode, setIsCustomGridMode] = useState(false);
  const [isHandDrawingMode, setIsHandDrawingMode] = useState(false);
  const [scanNotice, setScanNotice] = useState(null); // { type: 'success' | 'manual' | 'scanning' | 'error', message: string }

  // Gemini API Key State
  const [geminiApiKey, setGeminiApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBl4SJsKLSSFSkgoLgp_x_JqZWEHX3hwr0');
  
  // Sequential Steps inside /start: 1: 'start' | 2: 'mark_rooms' | 3: 'set_north' | 4: 'report'
  const [wizardStep, setWizardStep] = useState(1);

  // Sync browser popstate navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // UPLOAD FLOOR PLAN: REAL-TIME GEMINI 2.5 FLASH VISION AI SCANNER
  const handleImageUpload = async (dataUrl, svgText = null) => {
    // Clear all previous state for a fresh start on re-upload
    setPlacedRooms([]);
    setScanNotice(null);
    setNorthAngle(0);

    setImageUrl(dataUrl);
    setSvgContent(svgText);
    setIsCustomGridMode(true);
    setIsHandDrawingMode(false);
    setWizardStep(2);

    // 1. If SVG vector document uploaded, run SVG text scanner
    if (svgText) {
      const detected = autoDetectRoomsFromFloorPlan(svgText, dataUrl);
      if (detected && detected.length > 0) {
        setPlacedRooms(detected);
        setScanNotice({
          type: 'success',
          message: '✨ Plan processed'
        });
        return;
      }
    }

    // 2. Run Gemini Vision AI Scanner on raster PNG/JPG image
    if (dataUrl) {
      setScanNotice({
        type: 'scanning',
        message: 'Scanning your floor plan...'
      });

      try {
        const detected = await scanFloorPlanWithGeminiVision(dataUrl);
        if (detected && detected.length > 0) {
          setPlacedRooms(detected);
          setScanNotice({
            type: 'success',
            message: `✨ Scanned via Qwen3 32B Vision AI (${detected.length} rooms placed)`
          });
          return;
        }
      } catch (err) {
        console.error('Gemini Vision scan failed:', err);
        setPlacedRooms([]);
        setScanNotice({
          type: 'error',
          message: `⚠️ Could not read floor plan automatically. Please tap the room buttons below to place boxes manually.`
        });
        return;
      }
    }

    setPlacedRooms([]);
    setScanNotice({
      type: 'manual',
      message: '⚠️ Please tap the black room pills (+ Kitchen, + Bedroom, + Washroom) below to place your room boxes!'
    });
  };

  const handleSaveHandDrawing = (dataUrl) => {
    setImageUrl(dataUrl);
    setSvgContent(null);
    setIsCustomGridMode(true);
    setIsHandDrawingMode(false);
    setPlacedRooms([]);
    setScanNotice({
      type: 'manual',
      message: '✍️ Hand drawing loaded! Tap the black room pills (+ Kitchen, + Bedroom, + Washroom) below to place your room boxes.'
    });
    setWizardStep(2);
  };

  const handleStartWithoutPlan = () => {
    setSvgContent(null);
    setImageUrl(null);
    setIsCustomGridMode(true);
    setIsHandDrawingMode(false);
    setPlacedRooms([]);
    setScanNotice(null);
    setWizardStep(2);
  };

  const handleRemoveRoom = (roomId) => {
    setPlacedRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const handleClearAllRooms = () => {
    setPlacedRooms([]);
  };

  const handleCalculateReportClick = () => {
    if (userData && userData.name && userData.phone && userData.email) {
      setWizardStep(4);
    } else {
      setIsLeadModalOpen(true);
    }
  };

  const handleLeadSubmit = (leadInfo) => {
    setUserData(leadInfo);
    try {
      localStorage.setItem('vastu_user', JSON.stringify(leadInfo));
    } catch (e) {
      console.error('Could not save lead info to localStorage:', e);
    }
    saveLead({ 
      full_name: leadInfo.name, 
      phone: leadInfo.phone, 
      email: leadInfo.email, 
      vastu_score: vastuReport?.overallScore || 88 
    });
    if (leadInfo.email) {
      sendReportConfirmationEmail({ toEmail: leadInfo.email, userName: leadInfo.name });
    }
    setIsLeadModalOpen(false);
    setWizardStep(4);
  };

  const handleResetSession = () => {
    setImageUrl(null);
    setSvgContent(null);
    setPlacedRooms([]);
    setSelectedRoomType(null);
    setNorthAngle(0);
    setUserData(null);
    try {
      localStorage.removeItem('vastu_user');
    } catch (e) {}
    setWizardStep(1);
  };

  const vastuReport = useMemo(() => {
    return evaluateVastu(placedRooms, northAngle, centerPos.x, centerPos.y);
  }, [placedRooms, northAngle, centerPos]);

  const cleanPath = (currentPath || '/').split('?')[0].replace(/\/+$/, '') || '/';

  // If path is '/admin', render the Admin Panel!
  if (cleanPath === '/admin') {
    return (
      <AdminPanel onBackToApp={() => navigateTo('/')} />
    );
  }

  // If path is '/' (or not '/start'), render the Vastu Landing Page!
  if (cleanPath !== '/start') {
    return (
      <>
        <LandingPage
          onNavigateToStart={() => navigateTo('/start')}
          onOpenExpertModal={() => setIsExpertModalOpen(true)}
          onOpenAdmin={() => navigateTo('/admin')}
        />

        {/* Vastu Expert Consultation Modal */}
        <VastuExpertModal
          isOpen={isExpertModalOpen}
          onClose={() => setIsExpertModalOpen(false)}
        />
      </>
    );
  }

  // If path is '/start', render the VastuScope Studio App!
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className="w-9 h-9 rounded-xl border border-amber-400/50 shadow-sm overflow-hidden transition-all hover:scale-105 cursor-pointer"
            title="Go to Home Landing Page"
          >
            <img src="/vastu_logo.jpg" className="w-full h-full object-cover" alt="VastuScope Logo" />
          </button>
          <div>
            <button
              type="button"
              onClick={() => navigateTo('/')}
              className="font-extrabold text-base tracking-tight text-slate-900 font-heading text-left flex items-center gap-1 hover:text-amber-700 transition-colors"
            >
              Vastu<span className="text-amber-600">Scope</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() => navigateTo('/')}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
            title="Back to Landing Page"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAccuracyModalOpen(true)}
            className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">100% Accuracy</span>
          </button>
        </div>
      </header>

      {/* Sequential Mobile Step Bar (HIDDEN on Step 1 start page and Step 4 report page) */}
      {wizardStep > 1 && wizardStep < 4 && (
        <div className="bg-white border-b border-slate-200 p-2 sm:hidden">
          <div className="flex items-center justify-between px-1 text-[10px] sm:text-xs font-bold text-slate-600">
            <button type="button" onClick={() => setWizardStep(1)} className={`whitespace-nowrap ${wizardStep === 1 ? 'text-amber-600 font-extrabold' : ''}`}>1. Start</button>
            <span className="text-slate-300">→</span>
            <button type="button" onClick={() => setWizardStep(2)} className={`whitespace-nowrap ${wizardStep === 2 ? 'text-amber-600 font-extrabold' : ''}`}>2. Mark Boxes</button>
            <span className="text-slate-300">→</span>
            <button type="button" onClick={() => setWizardStep(3)} className={`whitespace-nowrap ${wizardStep === 3 ? 'text-amber-600 font-extrabold' : ''}`}>3. Set North</button>
            <span className="text-slate-300">→</span>
            <button type="button" onClick={() => setWizardStep(4)} className={`whitespace-nowrap ${wizardStep === 4 ? 'text-amber-600 font-extrabold' : ''}`}>4. Report</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4">
        {/* STEP 1: Select Choice */}
        {wizardStep === 1 && (
          <div className="max-w-xl mx-auto space-y-4">
            {isHandDrawingMode ? (
              <HandDrawingCanvas
                onSaveDrawing={handleSaveHandDrawing}
                onCancel={() => setIsHandDrawingMode(false)}
              />
            ) : (
              <div className="clean-card p-6 space-y-5 bg-white">
                <div className="text-center">
                  <h2 className="text-xl font-bold font-heading text-slate-900">How would you like to start?</h2>
                  <p className="text-xs text-slate-500 mt-1">Choose your preferred option below to calculate Vastu</p>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Option 1: Upload Floor Plan */}
                  <label className="cursor-pointer p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 flex items-center gap-3.5 transition-all group">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-amber-800 block">Upload Floor Plan</span>
                      <span className="text-xs text-slate-500 block">Upload PNG, JPG, SVG, or PDF file</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*,.svg,.pdf,application/pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
                        const isSvg = file.name.toLowerCase().endsWith('.svg');

                        if (isPdf) {
                          try {
                            const dataUrl = await convertPdfFileToDataUrl(file);
                            handleImageUpload(dataUrl, null);
                          } catch (err) {
                            alert(err.message || 'Could not parse PDF file');
                          }
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result;
                          if (isSvg) {
                            handleImageUpload(null, result);
                          } else {
                            handleImageUpload(result, null);
                          }
                        };
                        if (isSvg) {
                          reader.readAsText(file);
                        } else {
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  {/* OR Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">OR</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  {/* Option 2: Draw by Hand */}
                  <button
                    type="button"
                    onClick={() => setIsHandDrawingMode(true)}
                    className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 flex items-center gap-3.5 transition-all group text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs flex-shrink-0">
                      <Pencil className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-amber-800 block">Draw Floor Plan by Hand</span>
                      <span className="text-xs text-slate-500 block">Freehand Pen &amp; Eraser sketch canvas</span>
                    </div>
                  </button>

                  {/* OR Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-widest font-mono">OR</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  {/* Option 3: Chat with Vastu Expert (Paid ₹999) */}
                  <button
                    type="button"
                    onClick={() => setIsExpertModalOpen(true)}
                    className="w-full p-4 rounded-2xl border-2 border-amber-400 bg-amber-50/70 hover:bg-amber-100/80 flex items-center gap-3.5 transition-all group text-left shadow-2xs cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-xl bg-slate-950 text-amber-400 border border-amber-400/40 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900 group-hover:text-amber-900 block">
                          Chat with Vastu Expert
                        </span>
                        <span className="text-xs font-black text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full font-mono shadow-2xs">
                          ₹999
                        </span>
                      </div>
                      <span className="text-xs text-slate-600 mt-0.5 block">
                        No floor plan required! Our expert will chat with you on WhatsApp and resolve your queries.
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Mark Room Boxes */}
        {wizardStep === 2 && (
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                className="text-xs text-slate-600 font-bold flex items-center gap-1 whitespace-nowrap flex-shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Start
              </button>
              <span className="text-[10px] sm:text-xs font-bold text-amber-700 font-mono whitespace-nowrap truncate">Step 2: Position Room Boxes ({placedRooms.length})</span>
            </div>

            {/* Scan Notice Banner with Retry Button */}
            {scanNotice && (
              <div className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 ${
                scanNotice.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : scanNotice.type === 'scanning'
                  ? 'bg-blue-50 border-blue-200 text-blue-900 animate-pulse'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-2">
                  {scanNotice.type === 'success' ? (
                    <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : scanNotice.type === 'scanning' ? (
                    <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 animate-spin" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  )}
                  <span>{scanNotice.message}</span>
                </div>

                {/* Always offer Retry Plan Processing option */}
                <button
                  type="button"
                  onClick={() => handleImageUpload(imageUrl, svgContent)}
                  disabled={scanNotice.type === 'scanning'}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-2xs hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
                  title="Re-run floor plan AI analysis"
                >
                  <RefreshCw className={`w-3 h-3 text-slate-950 ${scanNotice.type === 'scanning' ? 'animate-spin' : ''}`} />
                  Retry Processing
                </button>
              </div>
            )}

            {/* Fallback Retry Callout Card if Plan didn't process rooms on first try */}
            {placedRooms.length === 0 && scanNotice?.type !== 'scanning' && (
              <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-400 text-center space-y-2 shadow-xs">
                <div className="flex items-center justify-center gap-2 text-slate-900 font-black text-xs sm:text-sm">
                  <AlertCircle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0" />
                  <span>Floor Plan Analysis Retry Required</span>
                </div>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
                  We could not automatically detect room boxes on the first attempt. Click <strong>Retry Plan Processing</strong> below to re-scan your image, or tap the room pills (+ Kitchen, + Bedroom) below to add boxes manually.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleImageUpload(imageUrl, svgContent)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-950" />
                    Retry Plan Processing
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Re-upload Image
                  </button>
                </div>
              </div>
            )}

            <FloorPlanCanvas
              imageUrl={imageUrl}
              svgContent={svgContent}
              northAngle={northAngle}
              setNorthAngle={setNorthAngle}
              placedRooms={placedRooms}
              setPlacedRooms={setPlacedRooms}
              selectedRoomType={selectedRoomType}
              centerPos={centerPos}
              setCenterPos={setCenterPos}
              onImageUpload={handleImageUpload}
              isCustomGridMode={true}
              showCompassBelow={true}
              isScanning={scanNotice?.type === 'scanning'}
            />

            <button
              type="button"
              onClick={handleCalculateReportClick}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              Calculate Vastu Report <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: Set North Direction */}
        {wizardStep === 3 && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                className="text-xs text-slate-600 font-bold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Room Boxes
              </button>
              <span className="text-xs font-bold text-amber-700 font-mono">Step 3: Rotate North Direction</span>
            </div>

            <FloorPlanCanvas
              imageUrl={imageUrl}
              svgContent={svgContent}
              northAngle={northAngle}
              setNorthAngle={setNorthAngle}
              placedRooms={placedRooms}
              setPlacedRooms={setPlacedRooms}
              selectedRoomType={selectedRoomType}
              centerPos={centerPos}
              setCenterPos={setCenterPos}
              onImageUpload={handleImageUpload}
              isCustomGridMode={true}
              showCompassBelow={true}
            />

            <button
              type="button"
              onClick={handleCalculateReportClick}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              Calculate Vastu Report <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: Vastu Report */}
        {wizardStep === 4 && (
          <VastuReportView vastuData={vastuReport} userData={userData} onRetry={handleResetSession} />
        )}
      </main>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSubmit={handleLeadSubmit}
      />

      {/* Vastu Expert Consultation Modal */}
      <VastuExpertModal
        isOpen={isExpertModalOpen}
        onClose={() => setIsExpertModalOpen(false)}
      />

      {/* Accuracy Modal */}
      <AccuracyWizardModal
        isOpen={isAccuracyModalOpen}
        onClose={() => setIsAccuracyModalOpen(false)}
        plotExtraData={plotExtraData}
        setPlotExtraData={setPlotExtraData}
      />

      <footer className="border-t border-slate-200 bg-white py-3 px-4 text-center text-xs text-slate-500">
        <p>VastuScope Studio • Paid Expert Consultation &amp; Floor Plan Vastu Engine</p>
      </footer>
    </div>
  );
}
