import React, { useState, useMemo } from 'react';
import {
  Compass, CheckCircle2, AlertTriangle, ShieldCheck, Flame, Droplets, Sofa, DoorOpen,
  Sparkles, TrendingUp, Download, RefreshCw, Layers, MapPin, Zap, Brain, ChevronRight, BookOpen, Sun, Award,
  Lock, CreditCard, QrCode, X, Check, Clock, PhoneCall, FileText, Globe
} from 'lucide-react';
import { ALL_INDIAN_STATES, analyzeFloorPlanWithAI } from '../utils/aiVisionScanner';
import { saveLead, saveVastuReport } from '@/lib/supabase';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { sendReportConfirmationEmail } from '@/lib/emailService';
import { useLanguage } from '@/lib/i18n';

export default function VastuReportView({ vastuData = {}, userData = null, onRetry }) {
  const { lang, t } = useLanguage();
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
                {lang === 'hi' ? 'वैदिक महावास्तु विश्लेषण रिपोर्ट' : 'Vedic Vastu Audit Report'}
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">
                {lang === 'hi' ? '16 महावास्तु दिशाओं का सूक्ष्म मूल्यांकन' : '16 Directional Zones Evaluated'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrintReport}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer ${
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
              <RefreshCw className="w-3 h-3" /> {lang === 'hi' ? 'पुनः जांचें' : 'Retry'}
            </button>
          </div>
        </div>
      </div>

      {/* Brief Report Free Section Header */}
      <div className="flex items-center justify-between pt-1 border-b border-slate-200/80 pb-1.5">
        <h2 className="text-xs font-black text-slate-900 tracking-wider font-heading uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          {lang === 'hi' ? 'प्रारंभिक सारांश रिपोर्ट' : 'Brief Report'}
        </h2>
        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
          {lang === 'hi' ? 'निःशुल्क मूल्यांकन सारांश' : 'Free Evaluation Summary'}
        </span>
      </div>

      {/* 2. ULTRA-COMPACT 4-TILE SUMMARY GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Tile 1: Vastu Score */}
        <div className="clean-card p-2.5 bg-white border border-slate-200 flex flex-col justify-between space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
              {lang === 'hi' ? 'वास्तु स्कोर' : 'Vastu Score'}
            </span>
            <Compass className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 font-mono">{score}</span>
            <span className="text-[10px] text-slate-400 font-bold">/100</span>
          </div>
          <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md border truncate ${scoreColor}`}>
            {score >= 80 
              ? (lang === 'hi' ? 'अति उत्तम' : 'Auspicious') 
              : score >= 65 
              ? (lang === 'hi' ? 'मध्यम' : 'Moderate') 
              : (lang === 'hi' ? 'गंभीर दोष' : 'Critical')}
          </span>
        </div>

        {/* Tile 2: Cash Flow */}
        <div className="clean-card p-2.5 bg-white border border-slate-200 flex flex-col justify-between space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider">
              {lang === 'hi' ? 'धन प्रवाह' : 'Cash Flow'}
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-base font-black text-slate-900 font-mono truncate">
            {score >= 75 ? (lang === 'hi' ? '92% उत्तम' : '92% High') : (lang === 'hi' ? '64% मध्यम' : '64% Flow')}
          </p>
          <span className="text-[9.5px] text-slate-500 font-medium truncate">
            {lang === 'hi' ? 'आग्नेय (Agni) व उत्तर' : 'SE (Agni) & North'}
          </span>
        </div>

        {/* Tile 3: Devta Lords */}
        <div className="clean-card p-2.5 bg-white border border-slate-200 flex flex-col justify-between space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider">
              {lang === 'hi' ? 'दिशा देवता' : 'Devta Lords'}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-base font-black text-slate-900 font-mono truncate">
            {lang === 'hi' ? '8 अष्टदिक्पालक' : '8 Ashtadikpalaka'}
          </p>
          <span className="text-[9.5px] text-slate-500 font-medium truncate">
            {lang === 'hi' ? 'शिव व कुबेर चक्र' : 'Shiva & Kuber Grid'}
          </span>
        </div>

        {/* Tile 4: Remedy Type */}
        <div className="clean-card p-2.5 bg-white border border-slate-200 flex flex-col justify-between space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider">
              {lang === 'hi' ? 'वैदिक उपाय' : 'Remedy'}
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-base font-black text-emerald-700 font-mono truncate">
            {lang === 'hi' ? 'बिना तोड़फोड़' : 'Zero Demolition'}
          </p>
          <span className="text-[9.5px] text-slate-500 font-medium truncate">
            {lang === 'hi' ? 'रंगीन पट्टियां व रॉड्स' : 'Color Strips & Studs'}
          </span>
        </div>
      </div>

      {/* 3. PROMINENT UNLOCK FULL REPORT PAYWALL CARD (₹899) */}
      {!isReportUnlocked ? (
        <div className="space-y-2 pt-2">
          {/* Minimal Professional Callout Title */}
          <div className="text-center space-y-0.5">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-wider font-heading uppercase">
              {lang === 'hi' ? 'विस्तृत उपाय एवं संपूर्ण रिपोर्ट चाहिए? पूरी रिपोर्ट अनलॉक करें' : 'Need More Details and Remedies? Unlock Full Report'}
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
                  <span>⚡ 70% OFF • {lang === 'hi' ? `ऑफर समाप्त होने में ${formatTimer(timeLeft)} शेष` : `Offer Expires in ${formatTimer(timeLeft)}`}</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 font-heading">
                  {lang === 'hi' ? 'संपूर्ण वास्तु विशेषज्ञ रिपोर्ट प्राप्त करें' : 'Unlock Full Expert Vastu Audit Report'}
                </h3>
                <p className="text-[11px] text-slate-600 font-medium">
                  {lang === 'hi' 
                    ? '16 दिशाओं का सूक्ष्म दोष विश्लेषण, वरिष्ठ वास्तु आचार्य समीक्षा व बिना तोड़फोड़ वैदिक उपाय शामिल हैं।' 
                    : 'Includes 16-Zone microscopic defect audit, expert Vastu Acharya review & remedies.'
                  }
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
              <span>
                {lang === 'hi' ? 'पूरी रिपोर्ट अनलॉक करें ' : 'Unlock Full Report for '}
                <span className="line-through text-slate-700/70 font-normal mr-0.5">₹2,999</span> 
                <span className="text-sm sm:text-base font-black text-slate-950">₹899</span> &rarr;
              </span>
            </button>
          </div>

          {/* Feature Badges Grid inside Viewport */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10.5px] font-bold text-slate-800 bg-white/90 p-2 rounded-lg border border-amber-200">
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-amber-700 flex-shrink-0" />
              <span>{lang === 'hi' ? '16 दिशा दोष जांच' : '16-Zone Defect Audit'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-amber-700 flex-shrink-0" />
              <span>{lang === 'hi' ? 'वास्तु एक्सपर्ट समीक्षा' : 'Vastu Expert Review'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-amber-700 flex-shrink-0" />
              <span>{lang === 'hi' ? 'बिना तोड़फोड़ उपाय' : 'Zero-Demolition Fix'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-amber-700 flex-shrink-0" />
              <span>{lang === 'hi' ? 'प्रीमियम PDF रिपोर्ट' : 'Download PDF Report'}</span>
            </div>
          </div>
        </div>
      </div>
      ) : (
        /* 4. UNLOCKED FULL DETAILED REPORT TABS */
        <div className="space-y-4 animate-fade-in">
          {/* Post-Payment Expert Review Notice */}
          <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="font-extrabold text-xs text-amber-950 font-mono">
                  {lang === 'hi' ? 'भुगतान सफल • ₹899 प्राप्त हुआ' : 'Payment Successful • ₹899 Received'}
                </span>
              </div>
              <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full font-mono">
                ORDER VERIFIED
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
              <p className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                {lang === 'hi' 
                  ? 'वरिष्ठ वास्तु विशेषज्ञ द्वारा विस्तृत रिपोर्ट कुछ ही घंटों में भेजी जाएगी।' 
                  : 'A detailed report will be provided by Vastu expert review in a few hours.'
                }
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {lang === 'hi'
                  ? 'आपका नक्शा और 16 दिशाओं का स्कैन हमारे प्रमाणित वास्तु आचार्य को भेज दिया गया है। अनुकूलित रिपोर्ट और बिना तोड़फोड़ का उपाय मैप सीधे आपके WhatsApp पर मिलेगा!'
                  : 'Your floor plan layout and 16-zone directional scan have been submitted to our Senior Certified Vastu Acharya. A customized, microscopic report and non-demolition remedies map will be delivered directly to your mobile / WhatsApp!'
                }
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('rooms')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'rooms' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {lang === 'hi' ? `कमरेवार विश्लेषण (${evaluatedRooms.length})` : `Room-by-Room Audit (${evaluatedRooms.length})`}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('remedies')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'remedies' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {lang === 'hi' ? 'बिना तोड़फोड़ वैदिक उपाय' : 'Zero-Demolition Remedies'}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('yantras')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'yantras' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {lang === 'hi' ? 'वैदिक यंत्र व दैनिक नियम' : 'Vedic Yantras & Rituals'}
            </button>
          </div>

          {/* TAB 1: Room-by-Room Microscopic Audit */}
          {activeTab === 'rooms' && (
            <div className="space-y-3">
              {evaluatedRooms.length === 0 ? (
                <div className="clean-card p-6 bg-white border border-slate-200 text-center space-y-2">
                  <Layers className="w-7 h-7 text-slate-400 mx-auto" />
                  <h4 className="font-extrabold text-xs text-slate-800">
                    {lang === 'hi' ? 'कोई कमरा नहीं जोड़ा गया' : 'No Room Boxes Placed Yet'}
                  </h4>
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
                              {lang === 'hi' ? `दिशा: ${room.zone.id} (${room.zone.name_hi || room.zone.name})` : `Zone: ${room.zone.id} (${room.zone.name})`}
                            </span>
                          )}
                        </div>

                        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                          room.rating === 'ideal' || room.rating === 'favorable' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {room.rating === 'ideal' || room.rating === 'favorable' 
                            ? (lang === 'hi' ? '✅ शुभ संरेखण' : '✅ Auspicious Alignment') 
                            : (lang === 'hi' ? '⚠️ वास्तु दोष उपस्थित' : '⚠️ Vastu Defect Found')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {room.description || 'Room zone evaluated.'}
                      </p>

                      {room.remedy && (
                        <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                          <strong>{lang === 'hi' ? 'वैदिक उपाय:' : 'Remedy Solution:'}</strong> {room.remedy}
                        </div>
                      )}

                      {room.zone?.lord && (
                        <div className="text-[11px] text-slate-500 font-mono pt-1 flex items-center gap-2 border-t border-slate-100">
                          <span className="font-bold text-slate-700">{lang === 'hi' ? 'दिशा के स्वामी देवता:' : 'Ashtadikpalaka Devta Lord:'}</span> {room.zone.lord_hi || room.zone.lord}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Zero Demolition Remedies */}
          {activeTab === 'remedies' && (
            <div className="space-y-3">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-1">
                <h4 className="font-black text-xs text-amber-950 font-heading">
                  {lang === 'hi' ? 'बिना तोड़फोड़ 100% वैदिक वास्तु समाधान' : '100% Non-Demolition Elemental Balance'}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {lang === 'hi' 
                    ? 'महावास्तु सिद्धांतों के अनुसार, दीवारों या दरवाजों को तोड़े बिना केवल तांबे की पट्टी, पीतल के तार व पंचतत्व रंगों द्वारा दिशा दोषों को शांत किया जाता है।' 
                    : 'According to MahaVastu, elemental defects can be fully neutralized using elemental color tapes, brass/copper rods, and pyramid energy balancers without breaking walls.'}
                </p>
              </div>

              {evaluatedRooms.filter(r => r.remedy).map((r, idx) => (
                <div key={idx} className="clean-card p-3.5 bg-white border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">{r.name} ({r.zone?.id})</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-mono">{lang === 'hi' ? 'वैदिक सुधार' : 'Vedic Remedy'}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{r.remedy}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Vedic Yantras & Rituals */}
          {activeTab === 'yantras' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="clean-card p-3.5 bg-white border border-slate-200 space-y-1.5">
                  <span className="font-black text-xs text-slate-900 block">{lang === 'hi' ? 'श्री यंत्र (Shree Yantra)' : 'Shree Yantra'}</span>
                  <span className="text-[10px] font-mono text-amber-700 block">{lang === 'hi' ? 'ईशान कोण (North-East)' : 'North-East (Ishanya)'}</span>
                  <p className="text-[11px] text-slate-600">{lang === 'hi' ? 'मां लक्ष्मी की कृपा, मानसिक शांति व घर में सुख-समृद्धि लाता है।' : 'Invites Goddess Lakshmi, divine peace & mental clarity.'}</p>
                </div>

                <div className="clean-card p-3.5 bg-white border border-slate-200 space-y-1.5">
                  <span className="font-black text-xs text-slate-900 block">{lang === 'hi' ? 'कुबेर यंत्र (Kuber Yantra)' : 'Kuber Yantra'}</span>
                  <span className="text-[10px] font-mono text-amber-700 block">{lang === 'hi' ? 'उत्तर दिशा (North Wall)' : 'North Wall'}</span>
                  <p className="text-[11px] text-slate-600">{lang === 'hi' ? 'निरंतर धन प्रवाह, व्यापार में लाभ और नई नौकरी के अवसर बढ़ाता है।' : 'Enhances continuous cash flow, career growth & business wealth.'}</p>
                </div>

                <div className="clean-card p-3.5 bg-white border border-slate-200 space-y-1.5">
                  <span className="font-black text-xs text-slate-900 block">{lang === 'hi' ? 'पीतल स्वास्तिक (Brass Swastika)' : 'Brass Swastika'}</span>
                  <span className="text-[10px] font-mono text-amber-700 block">{lang === 'hi' ? 'मुख्य प्रवेश द्वार' : 'Main Entrance Door'}</span>
                  <p className="text-[11px] text-slate-600">{lang === 'hi' ? 'नजर दोष और नकारात्मक ऊर्जा को घर में प्रवेश करने से रोकता है।' : 'Blocks evil eye (Nazar), negativity & financial obstacles.'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Paywall Unlock Modal (₹899) */}
      {isPaywallModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-900 border-2 border-amber-400">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-base font-heading">
                  {lang === 'hi' ? 'संपूर्ण वास्तु रिपोर्ट अनलॉक करें' : 'Unlock Full Vastu Report'}
                </h3>
              </div>
              <button type="button" onClick={handleCloseModal} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>{lang === 'hi' ? 'रिपोर्ट शुल्क:' : 'Report Fee:'}</span>
                  <span className="text-base font-black text-slate-900">₹899</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {lang === 'hi' 
                    ? '16 दिशाओं का विस्तृत विश्लेषण, वरिष्ठ वास्तु आचार्य समीक्षा व बिना तोड़फोड़ वैदिक उपाय।' 
                    : '16-Zone defect audit, Vastu Acharya manual verification & non-demolition remedies.'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">{lang === 'hi' ? 'आपका नाम' : 'Your Name'}</label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'hi' ? 'पूरा नाम दर्ज करें' : 'Enter full name'}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">{lang === 'hi' ? 'WhatsApp नंबर' : 'WhatsApp Number'}</label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleConfirmUnlock}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>{lang === 'hi' ? '₹899 का सुरक्षित भुगतान करें →' : 'Pay ₹899 Securely & Unlock →'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
