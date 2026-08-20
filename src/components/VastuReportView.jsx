import React, { useState, useEffect } from 'react';
import { 
  Download, Sparkles, CheckCircle2, AlertTriangle, 
  ShieldCheck, Layers, RotateCcw, Lock, Check, FileText, 
  ChevronRight, X, Eye, Flame, Droplets, Zap, Sparkle, ArrowRight, Clock, Compass
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { saveVastuReport } from '@/lib/supabase';
import { openRazorpayCheckout } from '@/lib/razorpay';
import ProductPacks from '@/components/ui/product-packs';

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
  
  // Basic Plan (₹299) vs Full Plan (₹899) unlock states
  const [isBasicUnlocked, setIsBasicUnlocked] = useState(() => {
    try {
      return localStorage.getItem('vastu_report_basic_unlocked') === 'true' || 
             localStorage.getItem('vastu_report_under_review') === 'true';
    } catch {
      return false;
    }
  });

  const [isUnderReview, setIsUnderReview] = useState(() => {
    try {
      return localStorage.getItem('vastu_report_under_review') === 'true';
    } catch {
      return false;
    }
  });

  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedPlanAmount, setSelectedPlanAmount] = useState(899);
  const [paymentDetails, setPaymentDetails] = useState(null);
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

  // Instant scroll to top when report view opens
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

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

  // Trigger Plan Selection (₹299 or ₹899)
  const handleSelectPlan = (amount) => {
    setSelectedPlanAmount(amount);
    setIsPaywallModalOpen(true);
  };

  const handleConfirmUnlock = async () => {
    if (!userName.trim() || !userPhone.trim()) {
      alert(isHi ? 'कृपया नाम और WhatsApp नंबर दर्ज करें' : 'Please enter your Name and WhatsApp number.');
      return;
    }

    setIsDownloading(true);
    const amount = selectedPlanAmount || 899;

    openRazorpayCheckout({
      amount: amount,
      name: 'VastuScope Studio',
      description: amount === 299 
        ? 'Basic Vastu Prosperity Score & Risk Audit' 
        : 'Senior Vastu Acharya Manual Audit & Zero-Demolition Remedies',
      prefillName: userName,
      prefillPhone: userPhone,
      prefillEmail: userData?.email || '',
      onSuccess: async (payDetails) => {
        try {
          await saveVastuReport({
            user_name: userName,
            user_phone: userPhone,
            user_email: userData?.email || '',
            property_type: userData?.propertyType || 'Residential',
            overall_score: overallScore,
            doshas_count: doshasCount,
            is_paid: true,
            plan_type: amount === 299 ? 'basic_299' : 'full_899',
            status: amount === 299 ? 'completed' : 'under_expert_review',
            payment_id: payDetails.paymentId,
            report_data: vastuData
          });
        } catch (err) {
          console.error('Report save failed:', err);
        }

        setPaymentDetails(payDetails);
        setIsDownloading(false);
        setIsPaywallModalOpen(false);

        if (amount === 299) {
          // Unlock Basic Macro Scoreboard
          setIsBasicUnlocked(true);
          try {
            localStorage.setItem('vastu_report_basic_unlocked', 'true');
          } catch {}
          alert(isHi ? '✅ भुगतान सफल! आपका मूल वास्तु स्कोर व जोखिम विश्लेषण अनलॉक हो गया है।' : '✅ Payment Successful! Your Basic Vastu Score & Risk Audit are unlocked.');
        } else {
          // ₹899 Full Plan: Unlock Scoreboard + Trigger Review In Progress Modal
          setIsBasicUnlocked(true);
          setIsUnderReview(true);
          try {
            localStorage.setItem('vastu_report_basic_unlocked', 'true');
            localStorage.setItem('vastu_report_under_review', 'true');
          } catch {}
          setIsReviewModalOpen(true);
        }
      },
      onFailure: (err) => {
        setIsDownloading(false);
        console.warn('Payment failed or cancelled:', err);
        if (err !== 'Payment dismissed by user') {
          alert(isHi ? 'भुगतान प्रक्रिया पूरी नहीं हो सकी। कृपया पुनः प्रयास करें।' : 'Payment could not be completed. Please try again.');
        }
      }
    });
  };

  const handleCloseModal = () => {
    setIsPaywallModalOpen(false);
  };

  return (
    <div className={`space-y-4 max-w-4xl mx-auto ${isHi ? 'font-hindi' : 'font-sans'}`}>
      
      {/* ========================================================================= */}
      {/* 1. TOP PRICING PRODUCT PACKS (NO FREE REPORT: ₹299 vs ₹899)                */}
      {/* ========================================================================= */}
      {!isBasicUnlocked && !isUnderReview && (
        <div className="clean-card bg-gradient-to-b from-amber-500/10 via-white to-white border-2 border-amber-400/80 shadow-xl rounded-3xl overflow-hidden p-2 sm:p-4">
          <ProductPacks
            onSelectPlan={handleSelectPlan}
            isHi={isHi}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* PART 1: SCOREBOARD (LOCKED BEFORE PAYMENT, UNLOCKED AFTER ₹299 or ₹899)     */}
      {/* ========================================================================= */}
      <div className={`clean-card p-3.5 sm:p-5 bg-white border border-amber-300 shadow-md rounded-2xl sm:rounded-3xl space-y-3 relative overflow-hidden transition-all ${
        !isBasicUnlocked ? 'filter blur-[4px] pointer-events-none select-none opacity-60' : ''
      }`}>
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping flex-shrink-0" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 font-heading truncate">
              {isHi ? 'भाग 1: वैदिक महावास्तु स्कोर रिपोर्ट' : 'PART 1: VEDIC VASTU MACRO AUDIT'}
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

        {/* 3-Column Horizontal Grid */}
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

        {/* 4-Pillar Metric Strip */}
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
      {/* PART 2: DETAILED REPORT & ZERO-DEMOLITION REMEDIES (₹899 ONLY)             */}
      {/* ========================================================================= */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 font-mono truncate">
              {isHi ? 'भाग 2: विस्तृत 16-दिशा रिपोर्ट व उपाय' : 'PART 2: 16-ZONE AUDIT & REMEDIES'}
            </span>
          </div>
          
          {/* Price Tag (₹2,499 -> ₹899) */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 px-3.5 py-1 rounded-full font-mono shadow-md border border-amber-500 flex-shrink-0">
            <span className="line-through text-xs sm:text-sm text-slate-800 font-bold">₹2,499</span>
            <span className="text-sm sm:text-base font-black tracking-tight">₹899</span>
          </div>
        </div>

        {/* Outer Container with Light Frosted Background */}
        <div className="relative rounded-2xl sm:rounded-3xl border-2 border-amber-400/80 overflow-hidden shadow-xl bg-white">
          
          {/* Light Frosted Blur Overlay */}
          <div className="absolute inset-0 z-30 bg-white/40 backdrop-blur-[5px] flex items-start justify-center p-2.5 sm:p-4 pt-2.5 sm:pt-3 animate-fadeIn select-none overflow-hidden">
            <div className="bg-white/95 backdrop-blur-xl border-2 border-amber-400 p-4 sm:p-5 rounded-2xl sm:rounded-3xl max-w-md w-full text-center shadow-2xl space-y-3 text-slate-900 animate-in zoom-in-95 duration-300">
              
              {isUnderReview ? (
                <>
                  {/* Glowing Clock Icon */}
                  <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center mx-auto shadow-md ring-4 ring-amber-400/30">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] sm:text-[10px] font-mono font-black text-emerald-800 uppercase tracking-widest bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full inline-block">
                      {isHi ? '⏳ समीक्षा जारी है • 2 से 4 घंटे' : '⏳ EXPERT REVIEW IN PROGRESS'}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-950 font-heading">
                      {isHi ? 'वास्तु विशेषज्ञ आपकी रिपोर्ट तैयार कर रहे हैं' : 'Vastu Experts Are Reviewing Your Report'}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-600 leading-tight font-medium">
                      {isHi 
                        ? `भुगतान सत्यापित (₹899)। वरिष्ठ आचार्य आपके 16 दिशाओं के सटीक उपाय तैयार कर रहे हैं। रिपोर्ट कुछ ही घंटों में आपके WhatsApp (${userPhone || 'नंबर'}) पर प्राप्त होगी।`
                        : `Payment verified (₹899). Senior Acharyas are finalizing your certified non-demolition remedies. You will receive your complete report on WhatsApp (${userPhone || 'number'}) within a few hours.`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>{isHi ? 'समीक्षा विवरण व WhatsApp सहायता →' : 'View Review Details & Support →'}</span>
                  </button>
                </>
              ) : (
                <>
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

                  {/* Action Button: Get Detailed Report */}
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(899)}
                    className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-4 h-4 text-slate-950" />
                    <span>{isHi ? 'विस्तृत रिपोर्ट प्राप्त करें (₹899) →' : 'Unlock Full Report (₹899) →'}</span>
                  </button>

                  {/* Compact Timer Directly Below Button */}
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
                </>
              )}
            </div>
          </div>

          {/* Underneath Report Content (Blurred under Frosted Glass) */}
          <div className="p-3 sm:p-5 space-y-3 sm:space-y-4 filter blur-[3px] pointer-events-none select-none opacity-60">
            
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
                    ? '16 दिशाओं के अनुसार रंगीन पट्टियों, तांबे/पीतल के तारों तथा पिरामिडों के सटीक माप।' 
                    : 'Exact placement coordinates of elemental color tapes, copper/brass rods, and consecrated yantras.'}
                </p>
              </div>
            </div>

            {/* 3 Tabs */}
            <div className="flex border-b border-slate-200 gap-4 text-xs font-black font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('rooms')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'rooms' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-400'
                }`}
              >
                {isHi ? 'कमरेवार विश्लेषण' : 'Room-by-Room Audit'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('remedies')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'remedies' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-400'
                }`}
              >
                {isHi ? 'बिना तोड़फोड़ उपाय' : 'Zero-Demolition Remedies'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('yantras')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'yantras' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-400'
                }`}
              >
                {isHi ? 'वैदिक यंत्र व पिरामिड' : 'Vedic Yantras'}
              </button>
            </div>

            {/* Tab 1: Room-by-Room Audit */}
            {activeTab === 'rooms' && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {displayRooms.map((room, idx) => {
                    const isDefect = room.rating === 'defect';
                    return (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-2xl border transition-all text-left space-y-1.5 ${
                          isDefect ? 'bg-red-50/50 border-red-200' : 'bg-emerald-50/40 border-emerald-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900">{room.name}</span>
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                            isDefect ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {room.zone?.id || 'SW'} • {isDefect ? (isHi ? 'दोष' : 'Defect') : (isHi ? 'शुभ' : 'Optimal')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          {room.description || 'Calculated directional zone impact on household energy.'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Remedies */}
            {activeTab === 'remedies' && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {displayRooms.filter(r => r.rating === 'defect').map((room, idx) => (
                    <div key={idx} className="p-3 bg-amber-50/50 border border-amber-200 rounded-2xl text-left space-y-1">
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-slate-900">{room.name}</span>
                        <span className="text-[10px] font-mono text-amber-900 bg-amber-200/60 px-2 py-0.2 rounded">
                          {room.zone?.id} Neutralizer
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-snug">
                        {room.remedy || 'Apply 3-inch elemental tape around perimeter.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Yantras */}
            {activeTab === 'yantras' && (
              <div className="space-y-2 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="clean-card p-2.5 bg-white border border-slate-200 space-y-1">
                    <span className="font-black text-xs text-slate-900 block">{isHi ? 'श्री सम्पूर्ण वास्तु दोष निवारण यंत्र' : 'Shree Sampoorna Vastu Yantra'}</span>
                    <span className="text-[10px] font-mono text-amber-700 block">{isHi ? 'उत्तर-पूर्व (ईशान)' : 'North-East Zone'}</span>
                    <p className="text-[10px] text-slate-600">{isHi ? 'घर की सकारात्मक ऊर्जा को आकर्षित करता है।' : 'Attracts positive cosmic prana.'}</p>
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

      {/* ========================================================================= */}
      {/* CHECKOUT MODAL (₹299 or ₹899)                                             */}
      {/* ========================================================================= */}
      {isPaywallModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-900 border-2 border-amber-400">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-base font-heading">
                  {selectedPlanAmount === 299 
                    ? (isHi ? 'मूल स्कोर रिपोर्ट अनलॉक करें' : 'Unlock Basic Score Report')
                    : (isHi ? 'संपूर्ण वास्तु रिपोर्ट अनलॉक करें' : 'Unlock Full Vastu Report')}
                </h3>
              </div>
              <button type="button" onClick={handleCloseModal} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>{isHi ? 'योजना शुल्क:' : 'Plan Fee:'}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="line-through text-slate-400 font-normal">
                      {selectedPlanAmount === 299 ? '₹799' : '₹2,499'}
                    </span>
                    <span className="text-base font-black text-slate-950">
                      ₹{selectedPlanAmount}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600">
                  {selectedPlanAmount === 299
                    ? (isHi ? '16 दिशाओं का समग्र वास्तु स्कोर व 4 मुख्य स्तंभ जोखिम विश्लेषण।' : 'Overall 16-zone prosperity score and 4-pillar risk analysis.')
                    : (isHi ? '16 दिशाओं का विस्तृत विश्लेषण, वरिष्ठ वास्तु आचार्य समीक्षा व बिना तोड़फोड़ वैदिक उपाय।' : '16-Zone defect audit, Vastu Acharya manual verification & non-demolition remedies.')}
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
                <span>
                  {selectedPlanAmount === 299
                    ? (isHi ? 'मूल स्कोर अनलॉक करें (₹299) →' : 'Unlock Basic Score (₹299) →')
                    : (isHi ? 'संपूर्ण रिपोर्ट अनलॉक करें (₹899) →' : 'Unlock Full Report (₹899) →')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP MODAL: VASTU EXPERTS ARE REVIEWING THE REPORT                       */}
      {/* ========================================================================= */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 text-slate-900 border-2 border-amber-400 text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Top glowing animated badge */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl ring-8 ring-amber-400/20">
              <Compass className="w-8 h-8 text-slate-950 animate-spin-slow" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-0.5 rounded-full inline-block">
                {isHi ? '✅ भुगतान सत्यापित (₹899)' : '✅ Payment Verified (₹899)'}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-950 font-heading">
                {isHi ? 'वास्तु विशेषज्ञ आपकी रिपोर्ट की समीक्षा कर रहे हैं' : 'Vastu Experts Are Reviewing Your Report'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {isHi 
                  ? 'वरिष्ठ वास्तु आचार्य आपके घर के 16 दिशाओं के नक्शे की गहन समीक्षा कर रहे हैं और 100% सटीक बिना तोड़फोड़ के वैदिक उपाय तैयार कर रहे हैं। आपकी संपूर्ण विस्तृत रिपोर्ट कुछ ही घंटों में आपके WhatsApp व ईमेल पर भेज दी जाएगी।'
                  : 'Our senior certified Vastu Acharyas are manually auditing your 16-zone floor plan and finalizing high-precision non-demolition remedies. You will receive your complete certified report on WhatsApp and Email in a few hours.'}
              </p>
            </div>

            {/* Delivery Details Card */}
            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5 font-bold">
                <span className="text-slate-600">{isHi ? 'डिलीवरी का समय:' : 'Estimated Delivery:'}</span>
                <span className="text-amber-900 font-black font-mono">
                  {isHi ? '2 से 4 घंटे के भीतर' : 'Within a few hours (2-4 hrs)'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5">
                <span className="text-slate-600">{isHi ? 'WhatsApp नंबर:' : 'WhatsApp Delivery:'}</span>
                <span className="text-emerald-700 font-bold font-mono">{userPhone || userData?.phone || 'Your Number'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{isHi ? 'प्रमाणित रिपोर्ट:' : 'Report Type:'}</span>
                <span className="text-slate-900 font-bold">{isHi ? 'वैदिक 16-दिशा उपाय PDF' : 'Certified 16-Zone PDF'}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-101 transition-all cursor-pointer"
              >
                {isHi ? 'समझ गया / डैशबोर्ड देखें →' : 'Got It / View Dashboard →'}
              </button>

              <button
                type="button"
                onClick={() => {
                  const phoneClean = (userPhone || '').replace(/[^0-9]/g, '');
                  const formatted = phoneClean.length === 10 ? `91${phoneClean}` : phoneClean;
                  const msg = encodeURIComponent(`Namaste Acharya Ji, I have completed the ₹899 payment for my Vastu audit. Name: ${userName}`);
                  window.open(`https://wa.me/918299584008?text=${msg}`, '_blank');
                }}
                className="w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>{isHi ? '💬 WhatsApp पर वास्तु टीम से बात करें' : '💬 Message Vastu Team on WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
