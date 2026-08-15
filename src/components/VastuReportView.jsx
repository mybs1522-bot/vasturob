import React, { useState, useEffect } from 'react';
import { 
  Download, Sparkles, CheckCircle2, AlertTriangle, 
  ShieldCheck, Layers, RotateCcw, Lock, Check, FileText, 
  ChevronRight, X, Eye, Flame, Droplets, Zap, Sparkle, ArrowRight, Clock
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { saveVastuReport } from '@/lib/supabase';

// Sample preview rooms to ensure a rich frosted background blur even before rooms are placed
const DEFAULT_PREVIEW_ROOMS = [
  { id: '1', name: 'Master Bedroom', zone: { id: 'SW', name: 'South-West', color: '#b45309', lord: 'Nirriti Dev' }, rating: 'ideal', description: 'South-West zone ensures stability, leadership authority, and deep restful sleep.', remedy: '' },
  { id: '2', name: 'Kitchen (Agni)', zone: { id: 'NE', name: 'North-East', color: '#38bdf8', lord: 'Lord Shiva' }, rating: 'defect', description: 'Fire element in Water zone causes cash burn, sudden expenses, and restlessness.', remedy: 'Apply 3-inch elemental green color tape and install neutralizer pyramid.' },
  { id: '3', name: 'Main Entrance', zone: { id: 'N', name: 'North', color: '#0284c7', lord: 'Lord Kuber' }, rating: 'ideal', description: 'Kuber gateway attracts new career opportunities, business wealth, and prosperity.', remedy: '' },
  { id: '4', name: 'Washroom / Toilet', zone: { id: 'SE', name: 'South-East', color: '#ef4444', lord: 'Agni Dev' }, rating: 'defect', description: 'Disposal energy in Fire zone suppresses cash liquidity and causes digestive troubles.', remedy: 'Install 3-inch copper metal strip around the commode base boundary.' },
];

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
    overallScore = 49,
    totalRooms = 0,
    doshasCount = 4,
    idealCount = 2,
    evaluatedRooms = [],
    summary = {},
    chartAngles = []
  } = vastuData || {};

  const displayRooms = evaluatedRooms.length > 0 ? evaluatedRooms : DEFAULT_PREVIEW_ROOMS;

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
    <div className={`space-y-3 max-w-4xl mx-auto ${isHi ? 'font-hindi' : 'font-sans'}`}>
      
      {/* ========================================================================= */}
      {/* PART 1: CLEAR READABLE FREE OVERVIEW SCOREBOARD                           */}
      {/* ========================================================================= */}
      <div className="clean-card p-3.5 sm:p-5 bg-white border border-amber-300 shadow-md rounded-2xl sm:rounded-3xl space-y-3">
        
        {/* Header Bar with Bigger Font */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping flex-shrink-0" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 font-heading truncate">
              {isHi ? 'वैदिक महावास्तु स्कोर रिपोर्ट' : 'Vedic Vastu Audit Report'}
            </h2>
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md hidden sm:inline">
              16-ZONES
            </span>
          </div>

          <button
            type="button"
            onClick={onRetry}
            className="px-3 py-1 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>{isHi ? 'नया स्कैन' : 'New Scan'}</span>
          </button>
        </div>

        {/* 3-Column Horizontal Grid with Bigger, Clearer Typography */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Box 1: Prosperity Score */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 sm:p-3 flex flex-col justify-center items-center">
            <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider block font-mono">
              {isHi ? 'वास्तु स्कोर' : 'PROSPERITY'}
            </span>
            <div className="text-xl sm:text-3xl font-black text-slate-950 font-mono leading-none my-1">
              {overallScore}<span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <span className={`text-[9px] sm:text-[11px] font-black px-2 py-0.5 rounded-full border ${scoreStatus.color} whitespace-nowrap shadow-xs`}>
              {scoreStatus.text}
            </span>
          </div>

          {/* Box 2: Critical Defects */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 sm:p-3 flex flex-col justify-center items-center">
            <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider block font-mono">
              {isHi ? 'गंभीर दोष' : 'DEFECTS'}
            </span>
            <div className="text-xl sm:text-3xl font-black text-red-600 font-mono leading-none my-1">
              {doshasCount}
            </div>
            <span className="text-[9px] sm:text-[11px] text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200 whitespace-nowrap shadow-xs">
              {isHi ? 'सुधार आवश्यक' : 'Urgent Fix'}
            </span>
          </div>

          {/* Box 3: Auspicious Alignments */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 sm:p-3 flex flex-col justify-center items-center">
            <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider block font-mono">
              {isHi ? 'शुभ दिशाएं' : 'AUSPICIOUS'}
            </span>
            <div className="text-xl sm:text-3xl font-black text-emerald-600 font-mono leading-none my-1">
              {idealCount}
            </div>
            <span className="text-[9px] sm:text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap shadow-xs">
              {isHi ? 'संतुलित' : 'Optimal'}
            </span>
          </div>
        </div>

        {/* 4-Pillar Metric Strip with Bigger Typography */}
        <div className="grid grid-cols-4 gap-1.5 pt-1.5 border-t border-slate-100 text-center">
          <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            <span className="text-[9px] sm:text-[11px] text-slate-500 font-bold block font-mono">{isHi ? 'धन प्रवाह' : 'CASH'}</span>
            <span className="text-xs sm:text-sm font-black text-amber-700 block">{summary.wealthScore || 47}%</span>
          </div>
          <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            <span className="text-[9px] sm:text-[11px] text-slate-500 font-bold block font-mono">{isHi ? 'स्वास्थ्य' : 'HEALTH'}</span>
            <span className="text-xs sm:text-sm font-black text-emerald-700 block">{summary.healthScore || 51}%</span>
          </div>
          <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            <span className="text-[9px] sm:text-[11px] text-slate-500 font-bold block font-mono">{isHi ? 'शांति' : 'HARMONY'}</span>
            <span className="text-xs sm:text-sm font-black text-blue-700 block">{summary.relationshipScore || 48}%</span>
          </div>
          <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            <span className="text-[9px] sm:text-[11px] text-slate-500 font-bold block font-mono">{isHi ? 'करियर' : 'CAREER'}</span>
            <span className="text-xs sm:text-sm font-black text-purple-700 block">{summary.careerScore || 50}%</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PART 2: DETAILED REPORT & REMEDIES WITH TIMER BELOW BUTTON                */}
      {/* ========================================================================= */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 font-mono truncate">
              {isHi ? 'भाग 2: विस्तृत 16-दिशा रिपोर्ट व उपाय' : 'PART 2: 16-ZONE AUDIT & REMEDIES'}
            </span>
          </div>
          
          {/* Bigger, Punchier Price Tag (₹2,499 -> ₹899) */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 px-3.5 py-1 rounded-full font-mono shadow-md border border-amber-500 flex-shrink-0">
            <span className="line-through text-xs sm:text-sm text-slate-800 font-bold">₹2,499</span>
            <span className="text-sm sm:text-base font-black tracking-tight">₹899</span>
          </div>
        </div>

        {/* Outer Container with Light Frosted Background */}
        <div className="relative rounded-2xl sm:rounded-3xl border-2 border-amber-400/80 overflow-hidden shadow-xl bg-white">
          
          {/* Light Frosted Blur Overlay (Starts directly at top with zero gap) */}
          {!isReportUnlocked && (
            <div className="absolute inset-0 z-30 bg-white/40 backdrop-blur-[5px] flex items-start justify-center p-2.5 sm:p-4 pt-2.5 sm:pt-3 animate-fadeIn select-none overflow-hidden">
              <div className="bg-white/95 backdrop-blur-xl border-2 border-amber-400 p-4 sm:p-5 rounded-2xl sm:rounded-3xl max-w-md w-full text-center shadow-2xl space-y-3 text-slate-900 animate-in zoom-in-95 duration-300">
                
                {/* Glowing Lock Badge */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-md ring-4 ring-amber-400/30">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] sm:text-[10px] font-mono font-black text-amber-800 uppercase tracking-widest bg-amber-100 px-2.5 py-0.5 rounded-full inline-block">
                    {isHi ? '🔒 16 दिशाओं के वैदिक उपाय बंद हैं' : '🔒 16-ZONE REMEDIAL BLUEPRINT LOCKED'}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-950 font-heading">
                    {isHi ? 'कमरेवार सटीक वैदिक उपाय प्राप्त करें' : 'Unlock Room-by-Room Vedic Remedies'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-600 leading-tight font-medium">
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

                {/* Single Prominent Action Button: Get Detailed Report */}
                <button
                  type="button"
                  onClick={handleUnlockClick}
                  className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>{isHi ? 'विस्तृत रिपोर्ट प्राप्त करें →' : 'Get Detailed Report →'}</span>
                </button>

                {/* Compact Timer Directly Below Get Detailed Report Button */}
                <div className="bg-amber-50 border border-amber-300/80 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1.5 shadow-xs">
                  <div className="flex items-center gap-1 min-w-0">
                    <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin-slow flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs font-black text-slate-900 truncate">
                      {isHi ? '⚡ सीमित समय विशेष छूट:' : '⚡ Special Offer Expires:'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-950 text-amber-300 px-2 py-0.5 rounded-lg font-mono font-black text-[10px] sm:text-xs shadow-xs flex-shrink-0">
                    <span>{hours}h</span>:<span>{minutes}m</span>:<span>{seconds}s</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Underneath Report Content (Blurred under Frosted Glass) */}
          <div className={`p-3 sm:p-5 space-y-3 sm:space-y-4 ${!isReportUnlocked ? 'filter blur-[3px] pointer-events-none select-none opacity-60' : ''}`}>
            
            <div className="flex items-center gap-2 text-amber-800 bg-amber-50 border border-amber-300 p-2.5 rounded-xl">
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
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('rooms')}
                className={`px-3 py-1 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'rooms' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {isHi ? `कमरेवार विश्लेषण (${displayRooms.length})` : `Room-by-Room (${displayRooms.length})`}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('remedies')}
                className={`px-3 py-1 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'remedies' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {isHi ? 'बिना तोड़फोड़ उपाय' : 'Zero-Demolition'}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('yantras')}
                className={`px-3 py-1 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'yantras' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {isHi ? 'वैदिक यंत्र' : 'Vedic Yantras'}
              </button>
            </div>

            {/* TAB 1: Room-by-Room Microscopic Audit */}
            {activeTab === 'rooms' && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  {displayRooms.map((room, idx) => (
                    <div
                      key={room.id || idx}
                      className="clean-card p-3 bg-white border border-slate-200 space-y-1 hover:border-amber-400 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: room.zone?.color || '#d97706' }} />
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">{room.name}</h4>
                          {room.zone && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded-full font-mono border border-amber-200">
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Zero Demolition Remedies */}
            {activeTab === 'remedies' && (
              <div className="space-y-2">
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 space-y-1">
                  <h4 className="font-black text-xs text-amber-950 font-heading">
                    {isHi ? 'बिना तोड़फोड़ 100% वैदिक वास्तु समाधान' : '100% Non-Demolition Elemental Balance'}
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    {isHi 
                      ? 'महावास्तु सिद्धांतों के अनुसार, दीवारों को तोड़े बिना केवल तांबे/पीतल के तार व पंचतत्व रंगों द्वारा दोष शांत किए जाते हैं।' 
                      : 'According to MahaVastu, elemental defects are neutralized using elemental color tapes and sacred rods without breaking walls.'}
                  </p>
                </div>

                {displayRooms.filter(r => r.remedy).map((r, idx) => (
                  <div key={idx} className="clean-card p-2.5 bg-white border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">{r.name} ({r.zone?.id})</span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md font-mono">{isHi ? 'सुधार' : 'Remedy'}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{r.remedy}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: Vedic Yantras & Rituals */}
            {activeTab === 'yantras' && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="clean-card p-2.5 bg-white border border-slate-200 space-y-1">
                    <span className="font-black text-xs text-slate-900 block">{isHi ? 'श्री यंत्र (Shree Yantra)' : 'Shree Yantra'}</span>
                    <span className="text-[10px] font-mono text-amber-700 block">{isHi ? 'ईशान कोण' : 'North-East'}</span>
                    <p className="text-[10px] text-slate-600">{isHi ? 'मां लक्ष्मी की कृपा, मानसिक शांति व सुख-समृद्धि लाता है।' : 'Invites Goddess Lakshmi & mental clarity.'}</p>
                  </div>

                  <div className="clean-card p-2.5 bg-white border border-slate-200 space-y-1">
                    <span className="font-black text-xs text-slate-900 block">{isHi ? 'कुबेर यंत्र (Kuber Yantra)' : 'Kuber Yantra'}</span>
                    <span className="text-[10px] font-mono text-amber-700 block">{isHi ? 'उत्तर दिशा' : 'North Wall'}</span>
                    <p className="text-[10px] text-slate-600">{isHi ? 'निरंतर धन प्रवाह व नए अवसर बढ़ाता है।' : 'Enhances continuous cash flow & business growth.'}</p>
                  </div>

                  <div className="clean-card p-2.5 bg-white border border-slate-200 space-y-1">
                    <span className="font-black text-xs text-slate-900 block">{isHi ? 'पीतल स्वास्तिक (Brass Swastika)' : 'Brass Swastika'}</span>
                    <span className="text-[10px] font-mono text-amber-700 block">{isHi ? 'मुख्य द्वार' : 'Main Entrance Door'}</span>
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
