import React, { useState, useMemo } from 'react';
import {
  Compass, CheckCircle2, AlertTriangle, ShieldCheck, Flame, Droplets, Sofa, DoorOpen,
  Sparkles, TrendingUp, Download, RefreshCw, Layers, MapPin, Zap, Brain, ChevronRight, BookOpen, Sun, Award,
  Lock, CreditCard, QrCode, X, Check, Clock, PhoneCall, FileText
} from 'lucide-react';
import { ALL_INDIAN_STATES, analyzeFloorPlanWithAI } from '../utils/aiVisionScanner';
import { saveLead, saveVastuReport } from '@/lib/supabase';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { sendReportConfirmationEmail } from '@/lib/emailService';

export default function VastuReportView({ vastuData = {}, userData = null, onRetry }) {
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'ai_scan' | 'remedies' | 'yantras'
  const [isReportUnlocked, setIsReportUnlocked] = useState(false);
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);

  // Auto-fetch user details already provided for free report
  const getInitialUser = () => {
    if (userData && (userData.name || userData.full_name)) return userData;
    try {
      const u = localStorage.getItem('vastu_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  };

  const initialUser = getInitialUser();
  const [userName, setUserName] = useState(() => initialUser?.name || initialUser?.full_name || '');
  const [userPhone, setUserPhone] = useState(() => initialUser?.phone || '');
  const [payStep, setPayStep] = useState(1); // 1: details | 2: payment checkout | 3: success notice

  React.useEffect(() => {
    const currUser = getInitialUser();
    if (currUser) {
      if (currUser.name || currUser.full_name) setUserName(currUser.name || currUser.full_name);
      if (currUser.phone) setUserPhone(currUser.phone);
    }
  }, [userData, isPaywallModalOpen]);

  // Evergreen 15-Minute Countdown Timer (14m 59s)
  const [timeLeft, setTimeLeft] = useState(899);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 899));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const evaluatedRooms = useMemo(() => {
    return vastuData.roomResults || vastuData.evaluatedRooms || [];
  }, [vastuData]);

  // Run Neural Vision Scan
  const aiVisionResult = useMemo(() => {
    return analyzeFloorPlanWithAI(null, evaluatedRooms, vastuData.northAngle || 0, ALL_INDIAN_STATES[0]);
  }, [evaluatedRooms, vastuData.northAngle]);

  const score = vastuData.score ?? 68;

  const scoreColor =
    score >= 80 ? 'text-emerald-700 bg-emerald-100 border-emerald-300' :
    score >= 65 ? 'text-amber-800 bg-amber-100 border-amber-300' :
    'text-red-700 bg-red-100 border-red-300';

  const handleUnlockPayment = (e) => {
    e.preventDefault();
    if (!userName || !userPhone) return;

    openRazorpayCheckout({
      amount: 899,
      description: 'Full 16-Zone Vastu Audit Report Unlock',
      prefillName: userName,
      prefillPhone: userPhone,
      onSuccess: (paymentDetails) => {
        setIsReportUnlocked(true);
        const userEmail = userData?.email || initialUser?.email || '';
        saveLead({ full_name: userName, phone: userPhone, email: userEmail, vastu_score: score, status: 'converted' });
        saveVastuReport({ 
          user_name: userName, 
          user_phone: userPhone, 
          user_email: userEmail,
          overall_score: score, 
          placed_rooms: evaluatedRooms,
          payment_id: paymentDetails.paymentId 
        });
        if (userEmail) {
          sendReportConfirmationEmail({ toEmail: userEmail, userName: userName, isPaid: true });
        }
        setPayStep(3);
      },
      onFailure: (err) => {
        console.warn('Razorpay payment cancelled or failed:', err);
      }
    });
  };

  const handleConfirmUnlock = () => {
    handleUnlockPayment({ preventDefault: () => {} });
  };

  const handleCloseModal = () => {
    setIsPaywallModalOpen(false);
    setPayStep(1);
  };

  const handlePrintReport = () => {
    if (!isReportUnlocked) {
      setIsPaywallModalOpen(true);
      return;
    }
    window.print();
  };

  return (
    <div className="space-y-3 max-w-5xl mx-auto pb-6">
      {/* 1. TOP COMPACT HEADER BANNER */}
      <div className="clean-card p-3 bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-950 text-amber-400 border border-amber-400/40 flex items-center justify-center font-bold text-xs">
              <Brain className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 font-heading leading-tight">
                Vedic Vastu Audit Report
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">16 Directional Zones Evaluated</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrintReport}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-2xs ${
                isReportUnlocked ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {!isReportUnlocked && <Lock className="w-3 h-3 text-amber-600" />}
              <Download className="w-3 h-3" /> PDF
            </button>

            <button
              type="button"
              onClick={onRetry}
              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center gap-1 hover:bg-slate-200 cursor-pointer"
              title="Start fresh from beginning"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        </div>
      </div>

      {/* Brief Report Free Section Header */}
      <div className="flex items-center justify-between pt-1 border-b border-slate-200/80 pb-1.5">
        <h2 className="text-xs font-black text-slate-900 tracking-wider font-heading uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Brief Report
        </h2>
        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
          Free Evaluation Summary
        </span>
      </div>

      {/* 2. ULTRA-COMPACT 4-TILE SUMMARY GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Tile 1: Vastu Score */}
        <div className="clean-card p-2.5 bg-white border border-slate-200 flex flex-col justify-between space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Vastu Score</span>
            <Compass className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 font-mono">{score}</span>
            <span className="text-[10px] text-slate-400 font-bold">/100</span>
          </div>
          <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md border truncate ${scoreColor}`}>
            {score >= 80 ? 'Auspicious' : score >= 65 ? 'Moderate' : 'Critical'}
          </span>
        </div>

        {/* Tile 2: Cash Flow */}
        <div className="clean-card p-2.5 bg-white border border-slate-200 flex flex-col justify-between space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider">Cash Flow</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-base font-black text-slate-900 font-mono truncate">
            {score >= 75 ? '92% High' : '64% Flow'}
          </p>
          <span className="text-[9.5px] text-slate-500 font-medium truncate">SE (Agni) &amp; North</span>
        </div>

        {/* Tile 3: Devta Lords */}
        <div className="clean-card p-2.5 bg-white border border-slate-200 flex flex-col justify-between space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider">Devta Lords</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-base font-black text-slate-900 font-mono truncate">
            8 Ashtadikpalaka
          </p>
          <span className="text-[9.5px] text-slate-500 font-medium truncate">Shiva &amp; Kuber Grid</span>
        </div>

        {/* Tile 4: Remedy Type */}
        <div className="clean-card p-2.5 bg-white border border-slate-200 flex flex-col justify-between space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider">Remedy</span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-base font-black text-emerald-700 font-mono truncate">
            Zero Demolition
          </p>
          <span className="text-[9.5px] text-slate-500 font-medium truncate">Color Strips &amp; Studs</span>
        </div>
      </div>

      {/* 3. PROMINENT UNLOCK FULL REPORT PAYWALL CARD (₹899) */}
      {!isReportUnlocked ? (
        <div className="space-y-2 pt-2">
          {/* Minimal Professional Callout Title */}
          <div className="text-center space-y-0.5">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-wider font-heading uppercase">
              Need More Details and Remedies? Unlock Full Report
            </h3>
          </div>

          <div className="rounded-2xl border-2 border-amber-400/80 bg-amber-50/90 p-3.5 sm:p-5 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 border border-amber-400/40 flex items-center justify-center shadow-md flex-shrink-0">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 text-[9.5px] font-black text-amber-950 uppercase tracking-widest bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-400 px-2.5 py-0.5 rounded-full font-mono shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                  <span>⚡ 70% OFF • Offer Expires in {formatTimer(timeLeft)}</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 font-heading">
                  Unlock Full Expert Vastu Audit Report
                </h3>
                <p className="text-[11px] text-slate-600 font-medium">
                  Includes 16-Zone microscopic defect audit, expert Vastu Acharya review &amp; remedies.
                </p>
              </div>
            </div>

            {/* Viewport Action Button */}
            <button
              type="button"
              onClick={() => setIsPaywallModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
            >
              <Lock className="w-4 h-4 text-slate-950" />
              <span>Unlock Full Report for <span className="line-through text-slate-700/70 font-normal mr-0.5">₹2,999</span> <span className="text-sm sm:text-base font-black text-slate-950">₹899</span> &rarr;</span>
            </button>
          </div>

          {/* Feature Badges Grid inside Viewport */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10.5px] font-bold text-slate-800 bg-white/90 p-2 rounded-lg border border-amber-200">
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-amber-700 flex-shrink-0" />
              <span>16-Zone Defect Audit</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-amber-700 flex-shrink-0" />
              <span>Vastu Expert Review</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-amber-700 flex-shrink-0" />
              <span>Zero-Demolition Fix</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-amber-700 flex-shrink-0" />
              <span>Download PDF Report</span>
            </div>
          </div>
        </div>
      </div>
      ) : (
        /* 4. UNLOCKED FULL DETAILED REPORT TABS & POST-PAYMENT EXPERT REVIEW NOTICE */
        <div className="space-y-4 animate-fade-in">
          {/* Post-Payment Expert Review Notice */}
          <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="font-extrabold text-xs text-amber-950 font-mono">
                  Payment Successful • ₹899 Received
                </span>
              </div>
              <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full font-mono">
                ORDER VERIFIED
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
              <p className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                A detailed report will be provided by Vastu expert review in a few hours.
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Your floor plan layout and 16-zone directional scan have been submitted to our Senior Certified Vastu Acharya. A customized, microscopic report and non-demolition remedies map will be delivered directly to your mobile / WhatsApp!
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('rooms')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'rooms' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Room-by-Room Audit ({evaluatedRooms.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai_scan')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                activeTab === 'ai_scan' ? 'bg-slate-950 text-amber-400 border border-amber-400/40 shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-amber-400" /> Neural Vision Scan Report
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('remedies')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'remedies' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Zero-Demolition Remedies
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('yantras')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'yantras' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Vedic Yantras &amp; Rituals
            </button>
          </div>

          {/* TAB 1: Room-by-Room Microscopic Audit */}
          {activeTab === 'rooms' && (
            <div className="space-y-3">
              {evaluatedRooms.length === 0 ? (
                <div className="clean-card p-6 bg-white border border-slate-200 text-center space-y-2">
                  <Layers className="w-7 h-7 text-slate-400 mx-auto" />
                  <h4 className="font-extrabold text-xs text-slate-800">No Room Boxes Placed Yet</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Go back to Step 2 and tap room pills (+ Kitchen, + Bedroom, + Washroom) to audit your property zones.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {evaluatedRooms.map((room, idx) => (
                    <div
                      key={room.id || idx}
                      className="clean-card p-4 bg-white border border-slate-200 space-y-2 hover:border-amber-400 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: room.zone?.color || '#d97706' }} />
                          <h4 className="font-extrabold text-sm text-slate-900">{room.name}</h4>
                          {room.zone && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-mono border border-amber-200">
                              Zone: {room.zone.id} ({room.zone.name})
                            </span>
                          )}
                        </div>

                        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                          room.rating === 'ideal' || room.rating === 'favorable' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {room.rating === 'ideal' || room.rating === 'favorable' ? '✅ Auspicious Alignment' : '⚠️ Vastu Defect Found'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {room.description || 'Room zone evaluated.'}
                      </p>

                      {room.remedy && (
                        <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                          <strong>Remedy Solution:</strong> {room.remedy}
                        </div>
                      )}

                      {room.zone?.lord && (
                        <div className="text-[11px] text-slate-500 font-mono pt-1 flex items-center gap-2 border-t border-slate-100">
                          <span className="font-bold text-slate-700">Ashtadikpalaka Devta Lord:</span> {room.zone.lord}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Neural Vision Scanner Technical Audit */}
          {activeTab === 'ai_scan' && (
            <div className="clean-card p-4 bg-white border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-slate-900 text-sm font-heading flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-amber-600" /> Neural Vision Computer Floor Plan Audit
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">Neural Model: {aiVisionResult.neuralModel}</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Status: {aiVisionResult.aiStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Structural Wall Load Distribution</span>
                  <p className="text-xs font-bold text-slate-900">{aiVisionResult.structuralScan.wallLoadDistribution}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Brahmasthan Clearance Index</span>
                  <p className="text-xs font-bold text-slate-900">{aiVisionResult.structuralScan.brahmasthanClearance}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Neural Room Detection Confidence:
                </span>
                <div className="space-y-2">
                  {aiVisionResult.aiRoomsAudit.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No room boxes detected on canvas to calculate confidence.</p>
                  ) : (
                    aiVisionResult.aiRoomsAudit.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <span>{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({item.detectedBoundary})</span>
                        </div>
                        <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {item.aiConfidence}% Neural Accuracy
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Zero-Demolition Remedies */}
          {activeTab === 'remedies' && (
            <div className="clean-card p-4 bg-white border border-slate-200 space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="font-black text-slate-900 text-sm font-heading flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Non-Demolition Elemental Remedies Map
                </h3>
                <p className="text-xs text-slate-500">Correct Vastu defects without breaking any walls or structural pillars</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 space-y-1">
                  <span className="text-xs font-extrabold text-red-800 uppercase tracking-wider block">South-East (Agni) Defects Fix</span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Apply a 4-inch wide Red Color Elemental Strip under the toilet door frame or place a Copper Pyramid Stud to balance fire energy.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 space-y-1">
                  <span className="text-xs font-extrabold text-cyan-900 uppercase tracking-wider block">North-East (Ishan) Defects Fix</span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Place a pure Brass Bowl filled with sacred Vastu rock salt in the NE corner and burn pure camphor for 10 minutes daily.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                  <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider block">South-West (Nirriti) Defects Fix</span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Apply a Yellow Brass Elemental Strip along the wall threshold and place lead helix pyramids to enhance stability.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 space-y-1">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">North-West (Vayu) Defects Fix</span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Hang a 5-rod Silver/White Wind Chime in the NW zone to speed up blocked payment recovery and smooth travel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Vedic Yantras & Rituals */}
          {activeTab === 'yantras' && (
            <div className="clean-card p-4 bg-white border border-slate-200 space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="font-black text-slate-900 text-sm font-heading flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Sacred Yantras &amp; Household Rituals
                </h3>
                <p className="text-xs text-slate-500">Energize your house space with ancient geometric yantras</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Shree Yantra (North-East / Puja Zone)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Place an energized 3D Sphatik or Copper Shree Yantra facing East in your Puja room to attract continuous Lakshmi grace.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Kuber Yantra (North Zone)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mount a Kuber Yantra on the North wall of your living room or safe to safeguard wealth and expand business opportunities.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAYWALL UNLOCK MODAL (₹899) */}
      {isPaywallModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative border border-amber-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {payStep === 1 && (
              <form onSubmit={handleUnlockPayment} className="space-y-4">
                <div className="text-center space-y-1 pt-1">
                  <div className="w-12 h-12 rounded-2xl border-2 border-amber-400/60 overflow-hidden mx-auto shadow-md">
                    <img src="/vastu_logo.jpg" className="w-full h-full object-cover" alt="VastuScope Logo" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 font-heading">Unlock Full Vastu Report</h3>
                  <p className="text-xs text-slate-500">Enter your details to request expert Vastu review</p>

                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-400 text-slate-950 px-3.5 py-1 rounded-full text-xs font-mono font-black border border-amber-400/60 shadow-2xs mt-1">
                    <span>Special Price: <span className="line-through text-slate-700/70 font-normal mr-0.5">₹2,999</span> ₹899</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Mobile Number (For Detailed PDF Report Delivery)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none bg-slate-50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-102 transition-all cursor-pointer"
                >
                  <span>Proceed to Pay <span className="line-through text-slate-700/70 font-normal mr-0.5">₹2,999</span> <span className="text-base font-black">₹899</span> &rarr;</span>
                </button>
              </form>
            )}

            {payStep === 2 && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-mono">
                    Instant Unlock Checkout
                  </span>
                  <h3 className="text-lg font-black text-slate-900">Pay ₹899 &amp; Unlock Report</h3>
                  <p className="text-xs text-slate-500">Unlocking for {userName} ({userPhone})</p>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">Vastu Expert Review &amp; Audit</p>
                    <p className="text-xs font-bold text-slate-200">Instant PDF Download Access</p>
                  </div>
                  <p className="text-xl font-black text-amber-400 font-mono">₹899</p>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmUnlock}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-102 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-slate-950" /> Pay <span className="line-through text-slate-700/70 font-normal mr-0.5">₹2,999</span> <span className="text-base font-black">₹899</span> &amp; Unlock Report
                </button>
              </div>
            )}

            {payStep === 3 && (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono">
                    Payment Successful • ₹899 Received
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">Vastu Expert Review Submitted!</h3>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    Thank you <strong>{userName}</strong>! Your payment of <strong>₹899</strong> has been confirmed.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1 text-left">
                  <p className="font-extrabold flex items-center gap-1.5 text-amber-950">
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" /> A detailed report will be provided by Vastu expert review in a few hours.
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Our Senior Certified Vastu Acharya is reviewing your floor plan layout. The complete microscopic audit and custom non-demolition remedies will be sent to your WhatsApp ({userPhone}).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  View Preview Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
