import React, { useState, useEffect } from 'react';
import { 
  Download, Sparkles, CheckCircle2, AlertTriangle, 
  ShieldCheck, Layers, RotateCcw, Lock, Check, FileText, 
  ChevronRight, X, Eye, Flame, Droplets, Zap, Sparkle, ArrowRight, Clock
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { saveVastuReport } from '@/lib/supabase';

export default function VastuReportView({ vastuData, userData, onRetry }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'remedies' | 'yantras'
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReportUnlocked, setIsReportUnlocked] = useState(false);
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);
  const [userName, setUserName] = useState(userData?.name || '');
  const [userPhone, setUserPhone] = useState(userData?.phone || '');
  const isHi = lang === 'hi';

  // 2 hours 37 minutes Evergreen Countdown Timer
  const [timeLeft, setTimeLeft] = useState(() => {
    try {
      const savedExpiry = localStorage.getItem('vastu_countdown_expiry');
      const now = Date.now();
      if (savedExpiry && parseInt(savedExpiry, 10) > now) {
        return Math.floor((parseInt(savedExpiry, 10) - now) / 1000);
      }
      const newExpiry = now + (2 * 3600 + 37 * 60) * 1000;
      localStorage.setItem('vastu_countdown_expiry', newExpiry.toString());
      return 2 * 3600 + 37 * 60;
    } catch {
      return 2 * 3600 + 37 * 60;
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const newExpiry = Date.now() + (2 * 3600 + 37 * 60) * 1000;
          try {
            localStorage.setItem('vastu_countdown_expiry', newExpiry.toString());
          } catch {}
          return 2 * 3600 + 37 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  const {
    overallScore = 52,
    totalRooms = 0,
    doshasCount = 4,
    idealCount = 1,
    evaluatedRooms = [],
    summary = {},
    chartAngles = []
  } = vastuData || {};

  // Status interpretation based on score
  const getScoreStatus = (score) => {
    if (score >= 75) return { 
      text: isHi ? 'उत्तम संतुलन' : 'Good Alignment', 
      color: 'text-emerald-800 bg-emerald-100 border-emerald-300' 
    };
    if (score >= 55) return { 
      text: isHi ? 'मध्यम दोष' : 'Moderate Dosha', 
      color: 'text-amber-800 bg-amber-100 border-amber-300' 
    };
    return { 
      text: isHi ? 'गंभीर दोष' : 'Critical Defects', 
      color: 'text-red-800 bg-red-100 border-red-300' 
    };
  };

  const scoreStatus = getScoreStatus(overallScore);

  const handleUnlockClick = () => {
    setIsPaywallModalOpen(true);
  };

  const handleConfirmUnlock = async () => {
    if (!userName.trim() || !userPhone.trim()) {
      alert(isHi ? 'कृपया नाम और WhatsApp नंबर दर्ज करें' : 'Please enter your Name and WhatsApp number.');
      return;
    }
    setIsReportUnlocked(true);
    setIsPaywallModalOpen(false);
    setIsDownloading(true);
    try {
      await saveVastuReport({
        user_name: userName,
        user_phone: userPhone,
        user_email: userData?.email || '',
        property_type: userData?.propertyType || 'Residential',
        overall_score: overallScore,
        doshas_count: doshasCount,
        report_data: vastuData
      });
      alert(isHi ? '✅ आपकी संपूर्ण विस्तृत वास्तु रिपोर्ट और वैदिक उपाय अनलॉक हो गए हैं!' : '✅ Your Certified Detailed Report & Remedies have been unlocked!');
    } catch (err) {
      console.error('Save Failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCloseModal = () => {
    setIsPaywallModalOpen(false);
  };

  return (
    <div className={`space-y-3.5 sm:space-y-5 max-w-4xl mx-auto ${isHi ? 'font-hindi' : 'font-sans'}`}>
      
      {/* ========================================================================= */}
      {/* PART 1: ULTRA-COMPACT FREE OVERVIEW (LESS THAN 30% MOBILE SCREEN)         */}
      {/* ========================================================================= */}
      <div className="clean-card p-2.5 sm:p-4 bg-white border border-amber-300 shadow-md rounded-2xl space-y-2 sm:space-y-3">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping flex-shrink-0" />
            <h2 className="text-xs sm:text-sm font-black text-slate-900 font-heading truncate">
              {isHi ? 'वैदिक महावास्तु स्कोर रिपोर्ट' : 'Vedic Vastu Audit Report'}
            </h2>
            <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md hidden sm:inline">
              16-ZONES
            </span>
          </div>

          <button
            type="button"
            onClick={onRetry}
            className="px-2 py-0.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 flex items-center gap-1 transition-all cursor-pointer flex-shrink-0"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>{isHi ? 'नया स्कैन' : 'New Scan'}</span>
          </button>
        </div>

        {/* 3-Column Horizontal Grid (Fits in 1 single row on ALL mobile screens) */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          {/* Box 1: Prosperity Score */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-1 sm:p-2.5 flex flex-col justify-center items-center">
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
              {isHi ? 'वास्तु स्कोर' : 'PROSPERITY'}
            </span>
            <div className="text-base sm:text-2xl font-black text-slate-950 font-mono leading-tight my-0.5">
              {overallScore}<span className="text-[8px] sm:text-[10px] font-normal text-slate-400">/100</span>
            </div>
            <span className={`text-[7px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-full border ${scoreStatus.color} whitespace-nowrap`}>
              {scoreStatus.text}
            </span>
          </div>

          {/* Box 2: Critical Defects */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-1 sm:p-2.5 flex flex-col justify-center items-center">
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
              {isHi ? 'गंभीर दोष' : 'DEFECTS'}
            </span>
            <div className="text-base sm:text-2xl font-black text-red-600 font-mono leading-tight my-0.5">
              {doshasCount}
            </div>
            <span className="text-[7px] sm:text-[9px] text-red-700 font-bold whitespace-nowrap">
              {isHi ? 'सुधार आवश्यक' : 'Urgent Fix'}
            </span>
          </div>

          {/* Box 3: Auspicious Alignments */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-1 sm:p-2.5 flex flex-col justify-center items-center">
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
              {isHi ? 'शुभ दिशाएं' : 'AUSPICIOUS'}
            </span>
            <div className="text-base sm:text-2xl font-black text-emerald-600 font-mono leading-tight my-0.5">
              {idealCount}
            </div>
            <span className="text-[7px] sm:text-[9px] text-slate-500 font-medium whitespace-nowrap">
              {isHi ? 'संतुलित क्षेत्र' : 'Optimal'}
            </span>
          </div>
        </div>

        {/* 4-Pillar Compact Strip */}
        <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-100 text-center">
          <div className="bg-slate-50 p-1 rounded-lg border border-slate-100">
            <span className="text-[7px] sm:text-[8px] text-slate-400 block font-mono">{isHi ? 'धन' : 'CASH'}</span>
            <span className="text-[8px] sm:text-[11px] font-black text-amber-700 block">{summary.wealthScore || 48}%</span>
          </div>
          <div className="bg-slate-50 p-1 rounded-lg border border-slate-100">
            <span className="text-[7px] sm:text-[8px] text-slate-400 block font-mono">{isHi ? 'स्वास्थ्य' : 'HEALTH'}</span>
            <span className="text-[8px] sm:text-[11px] font-black text-emerald-700 block">{summary.healthScore || 54}%</span>
          </div>
          <div className="bg-slate-50 p-1 rounded-lg border border-slate-100">
            <span className="text-[7px] sm:text-[8px] text-slate-400 block font-mono">{isHi ? 'शांति' : 'HARMONY'}</span>
            <span className="text-[8px] sm:text-[11px] font-black text-blue-700 block">{summary.relationshipScore || 50}%</span>
          </div>
          <div className="bg-slate-50 p-1 rounded-lg border border-slate-100">
            <span className="text-[7px] sm:text-[8px] text-slate-400 block font-mono">{isHi ? 'करियर' : 'CAREER'}</span>
            <span className="text-[8px] sm:text-[11px] font-black text-purple-700 block">{summary.careerScore || 52}%</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SLIM EVERGREEN COUNTDOWN TIMER (2 Hours 37 Minutes)                      */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/25 to-yellow-500/15 border border-amber-400/60 rounded-xl px-3 py-2 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-1.5 truncate">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin-slow flex-shrink-0" />
          <span className="text-[10px] sm:text-xs font-black text-slate-900 truncate">
            {isHi ? '⚡ सीमित समय विशेष छूट:' : '⚡ Limited Time Offer:'}{' '}
            <span className="line-through text-slate-400 font-normal">₹2,499</span>{' '}
            <span className="text-amber-700 font-mono font-black">₹899</span>{' '}
            <span className="text-emerald-700 text-[9px] bg-emerald-100 px-1 rounded-md font-extrabold hidden sm:inline">(64% OFF)</span>
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 text-amber-300 px-2 py-0.5 rounded-lg font-mono font-black text-[10px] sm:text-xs shadow-xs flex-shrink-0">
          <span>{hours}h</span>:<span>{minutes}m</span>:<span>{seconds}s</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PART 2: DETAILED REPORT & REMEDIES (BEHIND GLASSMORPHISM EFFECT)           */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-900 font-mono truncate">
              {isHi ? 'भाग 2: विस्तृत 16-दिशा रिपोर्ट व उपाय' : 'PART 2: 16-ZONE AUDIT & REMEDIES'}
            </span>
          </div>
          
          {/* Price Tag with Cut Price ₹2,499 -> ₹899 */}
          <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-mono shadow-xs flex-shrink-0">
            <span className="line-through text-[9px] text-slate-700 font-normal">₹2,499</span>
            <span className="text-[10px] font-black">₹899</span>
          </div>
        </div>

        {/* Outer Container with Glassmorphism Effect */}
        <div className="relative rounded-2xl sm:rounded-3xl border-2 border-amber-400/80 overflow-hidden shadow-xl bg-white">
          
          {/* Glassmorphism Frosted Blur Overlay (Shown when Report is Locked) */}
          {!isReportUnlocked && (
            <div className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn select-none">
              <div className="bg-white/95 backdrop-blur-xl border-2 border-amber-400 p-4 sm:p-6 rounded-2xl sm:rounded-3xl max-w-md w-full text-center shadow-2xl space-y-3 sm:space-y-4 text-slate-900 animate-in zoom-in-95 duration-300">
                
                {/* Glowing Lock Badge */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-md ring-2 ring-amber-400/30">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-black text-amber-800 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded-full inline-block">
                    {isHi ? '🔒 संपूर्ण बिना तोड़फोड़ उपाय सुरक्षित हैं' : '🔒 FULL REMEDY BLUEPRINT LOCKED'}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-950 font-heading">
                    {isHi ? 'कमरेवार सटीक वैदिक उपाय अनलॉक करें' : 'Unlock Room-by-Room Vedic Remedies'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed font-medium">
                    {isHi 
                      ? 'अपने घर के 16 दिशाओं के रंगीन टेप, धातु रॉड्स की लंबाई व अचूक उपाय तुरंत प्राप्त करें।'
                      : 'Unlock precision elemental color tapes, brass/copper wire rods, and consecrated remedies.'}
                  </p>
                </div>

                {/* Micro 4-Bullet Grid */}
                <div className="grid grid-cols-2 gap-1.5 text-left pt-0.5">
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{isHi ? 'बिना तोड़फोड़' : 'Zero Demolition'}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{isHi ? '16 दिशा मैप' : '16-Zone Map'}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{isHi ? 'आचार्य रिपोर्ट' : 'Acharya PDF'}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{isHi ? 'धन सुरक्षा' : 'Wealth Guard'}</span>
                  </div>
                </div>

                {/* CTA Button without Price inside text */}
                <button
                  type="button"
                  onClick={handleUnlockClick}
                  className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-950" />
                  <span>{isHi ? 'संपूर्ण विस्तृत रिपोर्ट अनलॉक करें →' : 'Unlock Full 16-Zone Detailed Report →'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Underneath Content (Blurred when Locked, Crystal-Clear when Unlocked) */}
          <div className={`p-4 sm:p-6 space-y-4 sm:space-y-6 ${!isReportUnlocked ? 'filter blur-[4px] pointer-events-none select-none opacity-50' : ''}`}>
            
            <div className="flex items-center gap-2 text-amber-800 bg-amber-50 border border-amber-300 p-3 rounded-xl">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-extrabold text-[11px] sm:text-xs">
                  {isHi 
                    ? 'वरिष्ठ वास्तु विशेषज्ञ द्वारा विस्तृत रिपोर्ट तैयार की गई है।' 
                    : 'A detailed report is verified by Senior Vastu Acharya.'}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-600 leading-relaxed">
                  {isHi
                    ? '16 दिशाओं का स्कैन और बिना तोड़फोड़ का उपाय मैप नीचे उपलब्ध है।'
                    : '16-Zone directional scan and non-demolition remedies map are detailed below.'}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('rooms')}
                className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'rooms' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {isHi ? `कमरेवार विश्लेषण (${evaluatedRooms.length})` : `Room-by-Room (${evaluatedRooms.length})`}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('remedies')}
                className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'remedies' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {isHi ? 'बिना तोड़फोड़ उपाय' : 'Zero-Demolition'}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('yantras')}
                className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'yantras' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {isHi ? 'वैदिक यंत्र' : 'Vedic Yantras'}
              </button>
            </div>

            {/* TAB 1: Room-by-Room Microscopic Audit */}
            {activeTab === 'rooms' && (
              <div className="space-y-2.5">
                {evaluatedRooms.length === 0 ? (
                  <div className="clean-card p-4 bg-white border border-slate-200 text-center space-y-1">
                    <Layers className="w-5 h-5 text-slate-400 mx-auto" />
                    <h4 className="font-extrabold text-xs text-slate-800">
                      {isHi ? 'कोई कमरा नहीं जोड़ा गया' : 'No Room Boxes Placed Yet'}
                    </h4>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {evaluatedRooms.map((room, idx) => (
                      <div
                        key={room.id || idx}
                        className="clean-card p-3.5 bg-white border border-slate-200 space-y-1.5 hover:border-amber-400 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: room.zone?.color || '#d97706' }} />
                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">{room.name}</h4>
                            {room.zone && (
                              <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded-full font-mono border border-amber-200">
                                {isHi ? `${room.zone.id} (${room.zone.name_hi || room.zone.name})` : `${room.zone.id}`}
                              </span>
                            )}
                          </div>

                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            room.rating === 'ideal' || room.rating === 'favorable' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {room.rating === 'ideal' || room.rating === 'favorable' 
                              ? (isHi ? '✅ शुभ' : '✅ Auspicious') 
                              : (isHi ? '⚠️ दोष' : '⚠️ Defect')}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {room.description || 'Room zone evaluated.'}
                        </p>

                        {room.remedy && (
                          <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-medium">
                            <strong>{isHi ? 'वैदिक उपाय:' : 'Remedy:'}</strong> {room.remedy}
                          </div>
                        )}

                        {room.zone?.lord && (
                          <div className="text-[10px] text-slate-500 font-mono pt-1 flex items-center gap-1.5 border-t border-slate-100">
                            <span className="font-bold text-slate-700">{isHi ? 'देवता:' : 'Devta Lord:'}</span> {room.zone.lord_hi || room.zone.lord}
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
              <div className="space-y-2.5">
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
                  <h4 className="font-black text-xs text-amber-950 font-heading">
                    {isHi ? 'बिना तोड़फोड़ 100% वैदिक वास्तु समाधान' : '100% Non-Demolition Elemental Balance'}
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    {isHi 
                      ? 'महावास्तु सिद्धांतों के अनुसार, दीवारों को तोड़े बिना केवल तांबे/पीतल के तार व पंचतत्व रंगों द्वारा दोष शांत किए जाते हैं।' 
                      : 'According to MahaVastu, elemental defects are neutralized using elemental color tapes and sacred rods without breaking walls.'}
                  </p>
                </div>

                {evaluatedRooms.filter(r => r.remedy).map((r, idx) => (
                  <div key={idx} className="clean-card p-3 bg-white border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">{r.name} ({r.zone?.id})</span>
                      <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md font-mono">{isHi ? 'सुधार' : 'Remedy'}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{r.remedy}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: Vedic Yantras & Rituals */}
            {activeTab === 'yantras' && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="clean-card p-3 bg-white border border-slate-200 space-y-1">
                    <span className="font-black text-xs text-slate-900 block">{isHi ? 'श्री यंत्र (Shree Yantra)' : 'Shree Yantra'}</span>
                    <span className="text-[9px] font-mono text-amber-700 block">{isHi ? 'ईशान कोण' : 'North-East'}</span>
                    <p className="text-[10px] text-slate-600">{isHi ? 'मां लक्ष्मी की कृपा, मानसिक शांति व सुख-समृद्धि लाता है।' : 'Invites Goddess Lakshmi & mental clarity.'}</p>
                  </div>

                  <div className="clean-card p-3 bg-white border border-slate-200 space-y-1">
                    <span className="font-black text-xs text-slate-900 block">{isHi ? 'कुबेर यंत्र (Kuber Yantra)' : 'Kuber Yantra'}</span>
                    <span className="text-[9px] font-mono text-amber-700 block">{isHi ? 'उत्तर दिशा' : 'North Wall'}</span>
                    <p className="text-[10px] text-slate-600">{isHi ? 'निरंतर धन प्रवाह व नए अवसर बढ़ाता है।' : 'Enhances continuous cash flow & business growth.'}</p>
                  </div>

                  <div className="clean-card p-3 bg-white border border-slate-200 space-y-1">
                    <span className="font-black text-xs text-slate-900 block">{isHi ? 'पीतल स्वास्तिक (Brass Swastika)' : 'Brass Swastika'}</span>
                    <span className="text-[9px] font-mono text-amber-700 block">{isHi ? 'मुख्य द्वार' : 'Main Entrance Door'}</span>
                    <p className="text-[10px] text-slate-600">{isHi ? 'नजर दोष और नकारात्मक ऊर्जा को रोकता है।' : 'Blocks evil eye (Nazar) & negativity.'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Paywall Unlock Modal (₹899) */}
      {isPaywallModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-900 border-2 border-amber-400">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-base font-heading">
                  {isHi ? 'संपूर्ण वास्तु रिपोर्ट अनलॉक करें' : 'Unlock Full Vastu Report'}
                </h3>
              </div>
              <button type="button" onClick={handleCloseModal} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>{isHi ? 'रिपोर्ट शुल्क:' : 'Report Fee:'}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="line-through text-slate-400 font-normal">₹2,499</span>
                    <span className="text-base font-black text-slate-900">₹899</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600">
                  {isHi 
                    ? '16 दिशाओं का विस्तृत विश्लेषण, वरिष्ठ वास्तु आचार्य समीक्षा व बिना तोड़फोड़ वैदिक उपाय।' 
                    : '16-Zone defect audit, Vastu Acharya manual verification & non-demolition remedies.'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">{isHi ? 'आपका नाम' : 'Your Name'}</label>
                <input
                  type="text"
                  required
                  placeholder={isHi ? 'पूरा नाम दर्ज करें' : 'Enter full name'}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">{isHi ? 'WhatsApp नंबर' : 'WhatsApp Number'}</label>
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
                <span>{isHi ? '₹899 का सुरक्षित भुगतान करें →' : 'Pay ₹899 Securely & Unlock →'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
