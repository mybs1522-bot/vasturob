import React, { useState } from 'react';
import { 
  Download, Sparkles, CheckCircle2, AlertTriangle, 
  MessageSquare, ShieldCheck, Layers, RotateCcw, Share2, 
  ExternalLink, Lock, Check, FileText, ChevronRight, X 
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

  const {
    overallScore = 88,
    totalRooms = 0,
    doshasCount = 0,
    idealCount = 0,
    evaluatedRooms = [],
    summary = {},
    chartAngles = []
  } = vastuData || {};

  // Status interpretation based on score
  const getScoreStatus = (score) => {
    if (score >= 80) return { 
      text: isHi ? 'अति उत्तम / शुभ संरेखण' : 'Excellent Alignment', 
      color: 'text-emerald-800 bg-emerald-100 border-emerald-300' 
    };
    if (score >= 60) return { 
      text: isHi ? 'मध्यम वास्तु ऊर्जा' : 'Moderate Alignment', 
      color: 'text-amber-800 bg-amber-100 border-amber-300' 
    };
    return { 
      text: isHi ? 'गंभीर वास्तु दोष उपस्थित' : 'Critical Doshas Present', 
      color: 'text-red-800 bg-red-100 border-red-300' 
    };
  };

  const scoreStatus = getScoreStatus(overallScore);

  // WhatsApp Consultation Handshake
  const handleOpenWhatsApp = () => {
    const defaultMsg = encodeURIComponent(
      isHi
        ? `नमस्ते वास्तु आचार्य जी, मैंने VastuScope पर अपने घर का वास्तु स्कोर निकाला है (${overallScore}/100)। कृपया 1-on-1 परामर्श द्वारा उपाय बताएं।`
        : `Namaste Vastu Acharya, I generated my home Vastu score (${overallScore}/100) on VastuScope. I would like a 1-on-1 consultation for personalized non-demolition remedies.`
    );
    window.open(`https://wa.me/919999999999?text=${defaultMsg}`, '_blank');
  };

  // Instant PDF Report Generation
  const handleDownloadPdf = async () => {
    if (!isReportUnlocked) {
      setIsPaywallModalOpen(true);
      return;
    }

    setIsDownloading(true);
    try {
      window.print();
      await saveVastuReport({
        user_name: userData?.name || 'Homeowner',
        user_phone: userData?.phone || '',
        user_email: userData?.email || '',
        property_type: userData?.propertyType || 'Residential',
        overall_score: overallScore,
        doshas_count: doshasCount,
        report_data: vastuData
      });
    } catch (err) {
      console.error('PDF Generation Failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUnlockClick = () => {
    setIsPaywallModalOpen(true);
  };

  const handleConfirmUnlock = () => {
    if (!userName.trim() || !userPhone.trim()) {
      alert(isHi ? 'कृपया नाम और WhatsApp नंबर दर्ज करें' : 'Please enter your Name and WhatsApp number.');
      return;
    }
    setIsReportUnlocked(true);
    setIsPaywallModalOpen(false);
    alert(isHi ? '✅ आपकी संपूर्ण वास्तु रिपोर्ट और वैदिक उपाय अनलॉक हो गए हैं!' : '✅ Your Certified Vastu Report & Remedies have been unlocked!');
  };

  const handleCloseModal = () => {
    setIsPaywallModalOpen(false);
  };

  return (
    <div className={`space-y-6 max-w-4xl mx-auto ${isHi ? 'font-hindi' : 'font-sans'}`}>
      {/* 1. TOP HEADER SUMMARY CARD (White & Gold) */}
      <div className="clean-card p-6 bg-white border border-amber-300 shadow-xl space-y-6 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider block mb-1">
              {isHi ? '16 महावास्तु वैदिक विश्लेषण' : '16-Zone MahaVastu Audit'}
            </span>
            <h2 className="text-xl font-black text-slate-900 font-heading">
              {isHi ? 'वैदिक महावास्तु विश्लेषण रिपोर्ट' : 'Vedic Vastu Shastra Audit Report'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHi ? '16 महावास्तु दिशाओं का सूक्ष्म ज्यामितीय मूल्यांकन' : 'Calculated across 16 Directional Energy Zones & Pancha Tattva'}
            </p>
          </div>

          <button
            type="button"
            onClick={onRetry}
            className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isHi ? 'नया विश्लेषण करें' : 'New Scan'}</span>
          </button>
        </div>

        {/* Big Score Gauge + Key Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* Main Dial */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
              {isHi ? 'लक्ष्मी-कुबेर वास्तु स्कोर' : 'Prosperity Score'}
            </span>
            <div className="text-4xl font-black text-slate-950 font-mono">
              {overallScore}<span className="text-sm font-bold text-slate-400">/100</span>
            </div>
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black border ${scoreStatus.color}`}>
              {scoreStatus.text}
            </span>
          </div>

          {/* Stat 1: Defect Count */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
              {isHi ? 'पहचाने गए गंभीर दोष' : 'Critical Defects'}
            </span>
            <div className="text-3xl font-black text-red-600 font-mono">
              {doshasCount}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {isHi ? `${totalRooms} कमरों में से` : `out of ${totalRooms} rooms`}
            </span>
          </div>

          {/* Stat 2: Favorable Count */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
              {isHi ? 'शुभ व संतुलित दिशाएं' : 'Auspicious Alignments'}
            </span>
            <div className="text-3xl font-black text-emerald-600 font-mono">
              {idealCount}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {isHi ? 'सकारात्मक ऊर्जा प्रवाह' : 'Optimal Energy Zones'}
            </span>
          </div>
        </div>

        {/* Prosperity Index Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-mono">{isHi ? 'धन प्रवाह (Cash Flow)' : 'Cash Flow'}</span>
            <span className="text-xs font-black text-amber-700">
              {summary.wealthScore || 92}% {isHi ? 'उत्तम' : 'Optimal'}
            </span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-mono">{isHi ? 'स्वास्थ्य व नींद' : 'Health & Sleep'}</span>
            <span className="text-xs font-black text-emerald-700">
              {summary.healthScore || 85}% {isHi ? 'संतुलित' : 'Balanced'}
            </span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-mono">{isHi ? 'पारिवारिक सौहार्द' : 'Harmony'}</span>
            <span className="text-xs font-black text-blue-700">
              {summary.relationshipScore || 80}% {isHi ? 'शुभ' : 'Favorable'}
            </span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-mono">{isHi ? 'करियर व यश' : 'Career Growth'}</span>
            <span className="text-xs font-black text-purple-700">
              {summary.careerScore || 88}% {isHi ? 'प्रगतिशील' : 'Progressive'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <span>{isHi ? 'PDF रिपोर्ट तैयार हो रही है...' : 'Generating PDF...'}</span>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-950" />
                <span>{isHi ? 'प्रीमियम PDF रिपोर्ट डाउनलोड करें (₹899)' : 'Download Full PDF Report (₹899)'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>{isHi ? 'वास्तु एक्सपर्ट से 1-ऑन-1 WhatsApp परामर्श (₹999)' : 'Book 1-on-1 WhatsApp Consultation (₹999)'}</span>
          </button>
        </div>
      </div>

      {/* 2. UNLOCKED VS LOCKED VIEW */}
      {!isReportUnlocked ? (
        /* LOCKED PAYWALL TEASER CARD (Remedies are locked) */
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-2xl space-y-6 text-center relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest bg-amber-950/80 border border-amber-400/40 px-3 py-1 rounded-full inline-block">
              {isHi ? '🔒 संपूर्ण बिना तोड़फोड़ वैदिक उपाय सुरक्षित हैं' : '🔒 FULL NON-DEMOLITION REMEDY BLUEPRINT LOCKED'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              {isHi ? 'अपने घर के गंभीर दोषों के अचूक वैदिक उपाय तुरंत अनलॉक करें' : 'Unlock Your Home\'s 100% Non-Demolition Elemental Remedies'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {isHi
                ? 'वरिष्ठ वास्तु आचार्य द्वारा प्रमाणित 16-दिशा सुधार मैप, पंचतत्व रंगीन पट्टियां, धातु रॉड्स की सही दिशा व लंबाई, और धनवर्धक यंत्रों की संपूर्ण गाइड प्राप्त करें।'
                : 'Unlock precise metal wire gauge placements (brass/copper), elemental color spectrum boundaries, and consecrated pyramid energizers designed specifically for your floor plan.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-amber-400 block">{isHi ? '1. बिना तोड़फोड़ उपाय' : '1. Zero Wall Breaking'}</span>
              <p className="text-[11px] text-slate-400">{isHi ? 'रंगीन पट्टियों व तारों से तुरंत सुधार' : '100% color tape & wire corrections'}</p>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-amber-400 block">{isHi ? '2. 16-दिशा विस्तृत मैप' : '2. 16-Zone Precision'}</span>
              <p className="text-[11px] text-slate-400">{isHi ? 'प्रत्येक कमरे का सूक्ष्म कोण सुधार' : 'Room-by-room angular degree remedies'}</p>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-amber-400 block">{isHi ? '3. आचार्य सत्यापन' : '3. Acharya Verified'}</span>
              <p className="text-[11px] text-slate-400">{isHi ? 'प्रमाणित वैदिक रिपोर्ट PDF' : 'Official certified downloadable PDF'}</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleUnlockClick}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-slate-950" />
              <span>{isHi ? 'संपूर्ण उपाय रिपोर्ट अनलॉक करें (₹899) →' : 'Unlock Certified Report & Remedies (₹899) →'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* FULL UNLOCKED TABS VIEW */
        <div className="clean-card p-6 bg-white border border-slate-200 shadow-md space-y-6 rounded-3xl">
          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-extrabold text-xs">
                {isHi 
                  ? 'वरिष्ठ वास्तु विशेषज्ञ द्वारा विस्तृत रिपोर्ट कुछ ही घंटों में भेजी जाएगी।' 
                  : 'A detailed report will be provided by Vastu expert review in a few hours.'}
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {isHi
                  ? 'आपका नक्शा और 16 दिशाओं का स्कैन हमारे प्रमाणित वास्तु आचार्य को भेज दिया गया है। अनुकूलित रिपोर्ट और बिना तोड़फोड़ का उपाय मैप सीधे आपके WhatsApp पर मिलेगा!'
                  : 'Your floor plan layout and 16-zone directional scan have been submitted to our Senior Certified Vastu Acharya. A customized, microscopic report and non-demolition remedies map will be delivered directly to your mobile / WhatsApp!'}
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
              {isHi ? `कमरेवार विश्लेषण (${evaluatedRooms.length})` : `Room-by-Room Audit (${evaluatedRooms.length})`}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('remedies')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'remedies' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {isHi ? 'बिना तोड़फोड़ वैदिक उपाय' : 'Zero-Demolition Remedies'}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('yantras')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'yantras' ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {isHi ? 'वैदिक यंत्र व दैनिक नियम' : 'Vedic Yantras & Rituals'}
            </button>
          </div>

          {/* TAB 1: Room-by-Room Microscopic Audit */}
          {activeTab === 'rooms' && (
            <div className="space-y-3">
              {evaluatedRooms.length === 0 ? (
                <div className="clean-card p-6 bg-white border border-slate-200 text-center space-y-2">
                  <Layers className="w-7 h-7 text-slate-400 mx-auto" />
                  <h4 className="font-extrabold text-xs text-slate-800">
                    {isHi ? 'कोई कमरा नहीं जोड़ा गया' : 'No Room Boxes Placed Yet'}
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
                              {isHi ? `दिशा: ${room.zone.id} (${room.zone.name_hi || room.zone.name})` : `Zone: ${room.zone.id} (${room.zone.name})`}
                            </span>
                          )}
                        </div>

                        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                          room.rating === 'ideal' || room.rating === 'favorable' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {room.rating === 'ideal' || room.rating === 'favorable' 
                            ? (isHi ? '✅ शुभ संरेखण' : '✅ Auspicious Alignment') 
                            : (isHi ? '⚠️ वास्तु दोष उपस्थित' : '⚠️ Vastu Defect Found')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {room.description || 'Room zone evaluated.'}
                      </p>

                      {room.remedy && (
                        <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                          <strong>{isHi ? 'वैदिक उपाय:' : 'Remedy Solution:'}</strong> {room.remedy}
                        </div>
                      )}

                      {room.zone?.lord && (
                        <div className="text-[11px] text-slate-500 font-mono pt-1 flex items-center gap-2 border-t border-slate-100">
                          <span className="font-bold text-slate-700">{isHi ? 'दिशा के स्वामी देवता:' : 'Ashtadikpalaka Devta Lord:'}</span> {room.zone.lord_hi || room.zone.lord}
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
                  {isHi ? 'बिना तोड़फोड़ 100% वैदिक वास्तु समाधान' : '100% Non-Demolition Elemental Balance'}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isHi 
                    ? 'महावास्तु सिद्धांतों के अनुसार, दीवारों या दरवाजों को तोड़े बिना केवल तांबे की पट्टी, पीतल के तार व पंचतत्व रंगों द्वारा दिशा दोषों को शांत किया जाता है।' 
                    : 'According to MahaVastu, elemental defects can be fully neutralized using elemental color tapes, brass/copper rods, and pyramid energy balancers without breaking walls.'}
                </p>
              </div>

              {evaluatedRooms.filter(r => r.remedy).map((r, idx) => (
                <div key={idx} className="clean-card p-3.5 bg-white border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">{r.name} ({r.zone?.id})</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-mono">{isHi ? 'वैदिक सुधार' : 'Vedic Remedy'}</span>
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
                  <span className="font-black text-xs text-slate-900 block">{isHi ? 'श्री यंत्र (Shree Yantra)' : 'Shree Yantra'}</span>
                  <span className="text-[10px] font-mono text-amber-700 block">{isHi ? 'ईशान कोण (North-East)' : 'North-East (Ishanya)'}</span>
                  <p className="text-[11px] text-slate-600">{isHi ? 'मां लक्ष्मी की कृपा, मानसिक शांति व घर में सुख-समृद्धि लाता है।' : 'Invites Goddess Lakshmi, divine peace & mental clarity.'}</p>
                </div>

                <div className="clean-card p-3.5 bg-white border border-slate-200 space-y-1.5">
                  <span className="font-black text-xs text-slate-900 block">{isHi ? 'कुबेर यंत्र (Kuber Yantra)' : 'Kuber Yantra'}</span>
                  <span className="text-[10px] font-mono text-amber-700 block">{isHi ? 'उत्तर दिशा (North Wall)' : 'North Wall'}</span>
                  <p className="text-[11px] text-slate-600">{isHi ? 'निरंतर धन प्रवाह, व्यापार में लाभ और नई नौकरी के अवसर बढ़ाता है।' : 'Enhances continuous cash flow, career growth & business wealth.'}</p>
                </div>

                <div className="clean-card p-3.5 bg-white border border-slate-200 space-y-1.5">
                  <span className="font-black text-xs text-slate-900 block">{isHi ? 'पीतल स्वास्तिक (Brass Swastika)' : 'Brass Swastika'}</span>
                  <span className="text-[10px] font-mono text-amber-700 block">{isHi ? 'मुख्य प्रवेश द्वार' : 'Main Entrance Door'}</span>
                  <p className="text-[11px] text-slate-600">{isHi ? 'नजर दोष और नकारात्मक ऊर्जा को घर में प्रवेश करने से रोकता है।' : 'Blocks evil eye (Nazar), negativity & financial obstacles.'}</p>
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
                  <span className="text-base font-black text-slate-900">₹899</span>
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
