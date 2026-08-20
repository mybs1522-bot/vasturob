import React, { useState } from 'react';
import HeroAscii from '@/components/ui/hero-ascii';
import VastuDemoVideoPlayer from './VastuDemoVideoPlayer';
import { useLanguage } from '@/lib/i18n';
import {
  Compass, Sparkles, ShieldCheck, PhoneCall,
  Flame, Droplets, CheckCircle2, Zap, Award,
  AlertTriangle, HeartPulse, DollarSign, Users, Briefcase, Sparkle, Hammer, ShieldAlert, Globe,
  HelpCircle, ChevronDown, ChevronUp, Lock, CheckSquare, Square, Skull, TrendingDown, ArrowRight, ShieldX, Clock, Check
} from 'lucide-react';

export default function LandingPage({ onNavigateToStart, onOpenExpertModal, onOpenAdmin }) {
  const { lang, toggleLang, t } = useLanguage();
  const isHi = lang === 'hi';

  // Interactive 7-Symptom Checklist State
  const [checkedSymptoms, setCheckedSymptoms] = useState({});
  const [openFaq, setOpenFaq] = useState(null);

  const toggleSymptom = (index) => {
    setCheckedSymptoms((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const selectedCount = Object.values(checkedSymptoms).filter(Boolean).length;

  const symptomsList = [
    {
      en: 'Money enters the home but vanishes immediately in sudden emergency expenses or hospital bills.',
      hi: 'पैसा घर में आता तो है लेकिन अचानक आए मेडिकल बिलों या अनचाहे खर्चों में तुरंत बह जाता है।'
    },
    {
      en: 'Waking up feeling tired, anxious, or heavy-headed despite 7-8 hours of sleep.',
      hi: 'पूरी नींद लेने के बाद भी सुबह उठते ही भारीपन, सुस्ती और सिर में तनाव महसूस होना।'
    },
    {
      en: 'Hard work and talent consistently going unrewarded; promotions or business deals getting stuck at the final stage.',
      hi: 'कड़ी मेहनत के बाद भी तरक्की रुकना और व्यापारिक सौदे अंतिम समय में रद्द हो जाना।'
    },
    {
      en: 'Frequent misunderstandings, heated arguments, and loss of emotional warmth between husband and wife.',
      hi: 'पति-पत्नी में बिना किसी बड़ी बात के आए दिन कलह, चिड़चिड़ापन और आपसी प्रेम में कमी।'
    },
    {
      en: 'Children struggling with concentration, restlessness, or constant screen addiction in their study room.',
      hi: 'बच्चों का पढ़ाई में मन न लगना, एकाग्रता की कमी और अत्यधिक चिड़चिड़ापन।'
    },
    {
      en: 'Persistent feelings of negativity, fear of the future, or feeling "blocked" inside your own living space.',
      hi: 'घर के अंदर आते ही भारीपन, अज्ञात भय और नकारात्मक ऊर्जा का लगातार आभास होना।'
    },
    {
      en: 'Frequent electrical appliance breakdowns, water leakages, or recurring vehicle repair costs.',
      hi: 'घर में बार-बार बिजली के उपकरणों का खराब होना, नलों से पानी टपकना या अनपेक्षित मरम्मत खर्चे।'
    }
  ];

  const faqs = [
    {
      q_en: 'Can major Vastu doshas really be corrected without breaking walls?',
      q_hi: 'क्या बिना कोई दीवार तोड़े वास्तव में 100% वास्तु दोष ठीक हो सकते हैं?',
      a_en: 'YES! Modern MahaVastu utilizes sacred Pancha Tattva elemental balancing: precision elemental color spectrums, sacred metal resonance wires (brass, copper, aluminium), and pyramid energy deflectors placed inside tile joints to neutralize negative prana in under 30 minutes with zero construction.',
      a_hi: 'हाँ, बिल्कुल! वैदिक महावास्तु पंचतत्व संतुलन के अचूक नियमों पर आधारित है। टाइल के जोड़ों में विशिष्ट धातु के तार (पीतल, तांबा), रंगीन पट्टियां और अभिमंत्रित पिरामिड लगाकर 30 मिनट में गंभीर से गंभीर दिशा दोष को पूरी तरह शांत किया जा सकता है।'
    },
    {
      q_en: 'How accurate is the 16-Zone AI floor plan scan?',
      q_hi: '16-दिशा AI फ्लोर प्लान स्कैन कितना सटीक है?',
      a_en: 'Our engine applies exact 360-degree mathematical angular calculations aligned with your property True North and geographic magnetic declination offset, giving 100% precision unmatched by generic 8-direction compasses.',
      a_hi: 'हमारा AI इंजन 360 डिग्री ज्यामिति और आपके राज्य के चुंबकीय विचलन (Magnetic Declination) के आधार पर 16 महावास्तु दिशाओं की गणना करता है, जो सामान्य 8 दिशाओं के मुकाबले 100% सूक्ष्म व प्रामाणिक है।'
    },
    {
      q_en: 'Does this work for rented builder flats or apartments?',
      q_hi: 'क्या यह किराए के मकान या बहुमंजिला फ्लैटों के लिए भी काम करता है?',
      a_en: 'Absolutely. Over 65% of our users live in high-rise apartments or rented homes. Non-demolition elemental remedies require zero structural changes and can be applied without altering the owner property.',
      a_hi: 'बिल्कुल! हमारे 65% से अधिक उपयोगकर्ता फ्लैटों या किराए के मकानों में रहते हैं। बिना तोड़फोड़ के उपाय किराए के मकानों के लिए एकदम उपयुक्त हैं क्योंकि इसमें कोई निर्माण नहीं बदला जाता।'
    },
    {
      q_en: 'What happens after I upload my blueprint or floor plan sketch?',
      q_hi: 'नक्शा अपलोड करने के बाद क्या प्रक्रिया होती है?',
      a_en: 'Our Gemini Vision AI immediately identifies all room boundaries, plots them onto the 16 MahaVastu Energy Grid, calculates your Lakshmi-Kuber Prosperity Score, and pinpoints exact critical doshas within 60 seconds.',
      a_hi: 'हमारा AI विजन इंजन तुरंत कमरों की स्थिति पहचानकर 16 दिशाओं के चक्र पर सेट करता है और 60 सेकंड में आपके घर का लक्ष्मी-कुबेर स्कोर व गंभीर दोष प्रदर्शित करता है।'
    }
  ];

  return (
    <div className={`min-h-screen chequered-bg text-slate-900 selection:bg-amber-100 selection:text-amber-900 flex flex-col smooth-hardware bg-white ${isHi ? 'font-hindi' : 'font-sans'}`}>
      
      {/* HERO SECTION WITH UNICORN VITRUVIAN ASCII ANIMATION */}
      <section className="w-full">
        <HeroAscii onNavigateToStart={onNavigateToStart} onOpenExpertModal={onOpenExpertModal} />

        {/* HIGH QUALITY 8-10 SECOND CODE ANIMATION VIDEO */}
        <div className="px-4 sm:px-8 max-w-7xl mx-auto">
          <VastuDemoVideoPlayer onNavigateToStart={onNavigateToStart} />
        </div>

        {/* Live Studio Wheel Teaser Card */}
        <div className="max-w-4xl mx-4 sm:mx-auto rounded-3xl border border-amber-400/40 bg-white p-4 sm:p-6 shadow-xl relative overflow-hidden my-12 z-10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono text-slate-900 font-extrabold uppercase">
                {isHi ? 'लाइव 16-दिशा महावास्तु स्कैनर' : 'LIVE 16-ZONE MAHAVASTU SCANNER'}
              </span>
            </div>
            <span className="text-xs font-black bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-300/60 font-mono">
              {isHi ? 'शुद्धता: 100% सटीक' : 'Accuracy: 100% Precision'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-amber-200/60 space-y-2">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-600" /> {isHi ? 'आग्नेय कोण (South-East)' : 'South-East (Agni Kone)'}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {isHi ? 'दैनिक धन प्रवाह और अग्नि तत्व का केंद्र। यहां दोष होने से धन कभी नहीं टिकता।' : 'Controls cash liquidity and fire energy. Misplaced elements here cause sudden financial drainage.'}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-amber-200/60 space-y-2">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                <Droplets className="w-4 h-4 text-amber-600" /> {isHi ? 'ईशान कोण (North-East)' : 'North-East (Ishan Kone)'}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {isHi ? 'घर का आध्यात्मिक मस्तक (शिव स्थान)। यहां भारी सामान या गंदगी होने से मानसिक तनाव व अनिद्रा होती है।' : 'Spiritual head of the house (Lord Shiva zone). Heavy overhead clutter here causes mental confusion & anxiety.'}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-amber-200/60 space-y-2">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" /> {isHi ? 'नैऋत्य कोण (South-West)' : 'South-West (Nirriti)'}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {isHi ? 'पारिवारिक स्थिरता और मुखिया का अधिकार। यहां दोष होने से गंभीर कर्ज और रिश्तों में दरार आती है।' : 'Controls family stability and head of household authority. Cuts here cause chronic debt and instability.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEW SECTION: 3 FATAL STAGES OF CHRONIC VASTU DECAY (FEAR DRIVEN) */}
      <section className="bg-slate-950 text-white py-16 sm:py-20 px-4 sm:px-8 border-y border-amber-500/20 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-black text-red-400 uppercase tracking-widest bg-red-950/80 border border-red-500/40 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <Skull className="w-4 h-4 text-red-400" /> {isHi ? 'दिशा दोष का क्रमिक विनाश' : 'The Inevitable Trajectory'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white leading-tight">
              {isHi ? 'घर में अनसुलझे वास्तु दोष का 3-चरणीय घातक चक्र' : 'The 3 Fatal Stages of Unresolved Vastu Imbalance'}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
              {isHi
                ? 'दिशा दोष पहले दिन से घर को बर्बाद नहीं करते। ये धीमी दीमक की तरह 3 चरणों में परिवार की खुशहाली को निगल जाते हैं:'
                : 'Vastu defects do not destroy a home overnight. Like a silent invisible leak, they compound across 3 predictable stages:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stage 1 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-amber-400">{isHi ? 'चरण 1 (0-6 महीने)' : 'Stage 1 (0-6 Months)'}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">{isHi ? 'शुरुआती लक्षण' : 'Initial Symptoms'}</span>
              </div>
              <h3 className="text-lg font-black text-white">{isHi ? 'चिड़चिड़ापन व नींद में व्यवधान' : 'Restlessness & Sleep Friction'}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHi
                  ? 'नए घर में शिफ्ट होते ही अचानक नींद का टूटना, सुबह उठने पर भारीपन और परिवार में छोटी-छोटी बातों पर बेवजह चिड़चिड़ापन शुरू हो जाता है।'
                  : 'Unexplained waking up at 3 AM, morning fatigue, domestic tension over trivial topics, and minor electronic breakdowns.'}
              </p>
            </div>

            {/* Stage 2 */}
            <div className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden ring-1 ring-amber-500/30">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-amber-400">{isHi ? 'चरण 2 (6-18 महीने)' : 'Stage 2 (6-18 Months)'}</span>
                <span className="text-[10px] bg-amber-500/30 text-amber-200 font-bold px-2 py-0.5 rounded-full">{isHi ? 'आर्थिक नुकसान' : 'Financial Drain'}</span>
              </div>
              <h3 className="text-lg font-black text-amber-300">{isHi ? 'धन का रिसाव व करियर में रुकावट' : 'Cash Stagnation & Blockages'}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHi
                  ? 'कमाई तो होती है लेकिन बचत शून्य हो जाती है। अचानक अस्पताल के खर्चे, अटकी हुई पेमेंट्स और व्यापारिक सौदों में रुकावटें आने लगती हैं।'
                  : 'Savings vanish into recurring medical emergencies. Business deals stall at the 11th hour. Hard work gets ignored for promotion.'}
              </p>
            </div>

            {/* Stage 3 */}
            <div className="bg-slate-900/90 border border-red-500/40 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden ring-1 ring-red-500/30">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-red-400">{isHi ? 'चरण 3 (18+ महीने)' : 'Stage 3 (18+ Months)'}</span>
                <span className="text-[10px] bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded-full">{isHi ? 'गंभीर संकट' : 'Severe Crisis'}</span>
              </div>
              <h3 className="text-lg font-black text-red-300">{isHi ? 'भारी कर्ज व पारिवारिक संकट' : 'Chronic Debt & Legal Disputes'}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHi
                  ? 'नैऋत्य (SW) या ईशान (NE) के गंभीर दोषों के कारण बैंक लोन का जाल, पुरानी बीमारियां और दांपत्य जीवन में अलगाव की नौबत आ जाती है।'
                  : 'Severe elemental clashes trigger heavy debt compounding, chronic debilitating ailments, and irreversible family separation.'}
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onNavigateToStart}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl inline-flex items-center gap-2 hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
            >
              <Compass className="w-5 h-5 text-slate-950" />
              <span>{isHi ? 'अपने घर का नक्शा तुरंत स्कैन करें →' : 'Scan Your Floor Plan Before It Is Too Late →'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. NEW SECTION: 7 SILENT SYMPTOMS INTERACTIVE CHECKLIST */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-black text-amber-900 uppercase tracking-widest bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-amber-700" /> {isHi ? 'स्व-परीक्षण चेकलिस्ट' : 'Self-Assessment Audit'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            {isHi ? 'क्या आप इनमें से किसी गुप्त लक्षण से जूझ रहे हैं?' : 'Are You Experiencing Any of These 7 Silent Symptoms?'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            {isHi
              ? 'नीचे दिए गए लक्षणों पर टिक करके देखें कि आपके घर में कौन-कौन से वास्तु दोष सक्रिय हैं:'
              : 'Select all statements that apply to your current living experience:'}
          </p>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 sm:p-8 shadow-xl space-y-3">
          {symptomsList.map((symptom, idx) => {
            const isChecked = !!checkedSymptoms[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleSymptom(idx)}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                  isChecked 
                    ? 'bg-amber-500/10 border-amber-500 text-slate-950 font-bold shadow-xs' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <span className="text-xs sm:text-sm leading-relaxed flex-1">
                  {isHi ? symptom.hi : symptom.en}
                </span>
              </button>
            );
          })}

          {/* Dynamic Warning Alert Box if Symptoms Checked */}
          <div className="pt-4">
            <div className={`p-4 rounded-2xl border-2 transition-all ${
              selectedCount >= 2 
                ? 'bg-red-50 border-red-500 text-red-950' 
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-1 text-left">
                  <span className="text-xs font-black uppercase tracking-wider block font-mono">
                    {selectedCount >= 2 
                      ? (isHi ? '⚠️ उच्च जोखिम चेतावनी: गंभीर वास्तु दोष सक्रिय!' : '⚠️ HIGH RISK ALERT: ACTIVE ELEMENTAL CLASHES DETECTED!') 
                      : (isHi ? '💡 प्रारंभिक जांच आवश्यक' : '💡 Preliminary Inspection Advised')}
                  </span>
                  <p className="text-xs leading-relaxed font-medium">
                    {selectedCount >= 2
                      ? (isHi ? `आपने 7 में से ${selectedCount} लक्षण चुने हैं। आपके घर में शौचालय, रसोई या मुख्य द्वार की दिशा में बड़ा असंतुलन है।` : `You selected ${selectedCount} of 7 symptoms. Your floor plan likely has critical Agni/Ishan/Nairutya doshas.`)
                      : (isHi ? 'अपने घर का नक्शा अपलोड करके 16 दिशाओं का सटीक वैदिक स्कोर प्राप्त करें।' : 'Upload your floor plan to pinpoint exact elemental conflicts.')
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onNavigateToStart}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md flex-shrink-0 cursor-pointer whitespace-nowrap"
                >
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>{isHi ? 'नक्शा जांचें (मुफ्त)' : 'Scan Floor Plan Free →'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION: 4 CRITICAL VASTU FLAWS THAT DESTROY PEACE */}
      <section className="chequered-dark-bg text-white py-20 px-4 sm:px-8 border-y border-slate-800 relative bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-950/80 border border-amber-500/40 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> {isHi ? 'अदृश्य वास्तु दोष चेतावनी' : 'Silent Danger Warning'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white">
              {isHi ? '4 गंभीर वास्तु दोष जो अनजाने में घर की सुख-शांति नष्ट करते हैं' : '4 Critical Vastu Flaws That Destroy Peace Before You Notice'}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              {isHi
                ? 'वास्तु दोष घर में गुप्त रिसाव की तरह काम करते हैं। 92% परिवार इसे किस्मत समझ लेते हैं, जबकि कारण घर का नक्शा होता है:'
                : 'Vastu energy defects act like a silent leak in your household. 92% of families attribute these to "bad luck" or "hard times" without realizing their floor plan is causing them:'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Danger Item 1 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-400 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">{isHi ? 'आग्नेय दिशा दोष' : 'SE Zone Defect'}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{isHi ? 'धन का रिसाव' : 'The Cash Drainer'}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHi ? 'आग्नेय कोण में शौचालय या जल स्रोत। धन आता है लेकिन अचानक बिलों व खर्चों में बह जाता है।' : 'Toilet or water feature in South-East (Agni). Money flows in but instantly drains out into hospital bills, unexpected breakdowns, or unpaid invoices.'}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>{isHi ? 'जोखिम: उच्च' : 'Risk Level: High'}</span>
                <span>{isHi ? 'प्रभाव: आर्थिक' : 'Impact: 100% Financial'}</span>
              </div>
            </div>

            {/* Danger Item 2 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-400 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">{isHi ? 'ईशान दिशा दोष' : 'NE Zone Defect'}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{isHi ? 'मानसिक तनाव व भ्रम' : 'The Mental Fog'}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHi ? 'ईशान कोण में भारी स्टोरेज या गंदगी। सिरदर्द, चिंता, अनिद्रा और सही निर्णय न ले पाने की समस्या उत्पन्न करता है।' : 'Heavy storage or clutter over Ishan Kone. Triggers chronic headaches, anxiety, lack of career direction, and memory issues for family members.'}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>{isHi ? 'जोखिम: गंभीर' : 'Risk Level: Severe'}</span>
                <span>{isHi ? 'प्रभाव: स्वास्थ्य' : 'Impact: Health & Peace'}</span>
              </div>
            </div>

            {/* Danger Item 3 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-400 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">{isHi ? 'नैऋत्य दिशा दोष' : 'SW Zone Defect'}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{isHi ? 'रिश्तों में दरार' : 'The Relationship Breaker'}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHi ? 'नैऋत्य कोण में गड्ढा या प्रवेश द्वार। पति-पत्नी में कलह और परिवार के सदस्यों में मतभेद पैदा करता है।' : 'Cuts or entrance in South-West (Nairutya). Destroys stability, triggering frequent marital arguments, trust issues, and loss of respect.'}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>{isHi ? 'जोखिम: उच्च' : 'Risk Level: High'}</span>
                <span>{isHi ? 'प्रभाव: पारिवारिक' : 'Impact: Family Stability'}</span>
              </div>
            </div>

            {/* Danger Item 4 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-400 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">{isHi ? 'उत्तर दिशा दोष' : 'North Zone Block'}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{isHi ? 'करियर में रुकावट' : 'Career Ceiling'}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHi ? 'उत्तर (कुबेर) में रसोई या कचरा। नए व्यापारिक अवसरों और नौकरी में तरक्की को पूरी तरह रोक देता है।' : 'Kitchen or trash in the North (Kuber) zone. Blocks new job offers, prevents business growth, and keeps you stuck despite working long hours.'}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>{isHi ? 'जोखिम: उच्च' : 'Risk Level: High'}</span>
                <span>{isHi ? 'प्रभाव: करियर' : 'Impact: Growth & Income'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW SECTION: THE HIGH FINANCIAL COST OF INACTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-black text-red-700 uppercase tracking-widest bg-red-100 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-red-600" /> {isHi ? 'लाखों का आर्थिक नुकसान' : 'The Real Cost of Inaction'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            {isHi ? 'वास्तु दोष को नजरअंदाज करने की भारी कीमत' : 'Ignoring Vastu Imbalance Costs ₹5,00,000+ in Silence'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            {isHi
              ? 'जानिए कैसे एक छोटा सा दिशा दोष हर साल आपकी मेहनत की कमाई को चुपचाप निगल जाता है:'
              : 'See the shocking mathematical comparison of uncorrected home energy vs. a 60-second AI audit:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Uncorrected Loss Card */}
          <div className="bg-red-50 border-2 border-red-400 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg text-left">
            <div className="flex items-center justify-between border-b border-red-200 pb-3">
              <span className="text-xs font-mono font-bold text-red-700">{isHi ? '❌ अनसुलझा वास्तु दोष' : '❌ Cost of Ignoring Vastu'}</span>
              <span className="text-xs font-black text-red-700 bg-red-200 px-2.5 py-0.5 rounded-full font-mono">₹5,00,000+ / YR</span>
            </div>
            <ul className="space-y-2.5 text-xs text-red-950 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>{isHi ? 'अचानक आए अस्पताल और दवाइयों के बिल: ₹1,50,000+' : 'Emergency medical & chronic hospitalization bills: ₹1,50,000+'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>{isHi ? 'अटकी हुई पेमेंट्स व व्यापारिक घाटा: ₹2,00,000+' : 'Blocked client payments & cancelled business contracts: ₹2,00,000+'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>{isHi ? 'घर की तोड़फोड़ व महंगे नवीनीकरण का खर्च: ₹3,00,000+' : 'Structural demolition & renovation reconstruction costs: ₹3,00,000+'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>{isHi ? 'पारिवारिक कलह व मानसिक अशांति की अमूल्य कीमत' : 'Irreparable loss of peace of mind, marital friction, and chronic stress.'}</span>
              </li>
            </ul>
          </div>

          {/* VastuScope Precision Card */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50/80 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg text-left">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <span className="text-xs font-mono font-bold text-amber-800">{isHi ? '✅ वास्तुस्कोप AI समाधान' : '✅ VastuScope 16-Zone Audit'}</span>
              <span className="text-xs font-black text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full font-mono">100% {isHi ? 'सटीक' : 'FREE AUDIT'}</span>
            </div>
            <ul className="space-y-2.5 text-xs text-amber-950 font-medium">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{isHi ? 'बिना 1 भी दीवार तोड़े 100% पंचतत्व संतुलन' : 'Zero structural wall breaking with elemental energy balancers.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{isHi ? 'मात्र 60 सेकंड में 16 दिशाओं का वैज्ञानिक कंप्यूटर विश्लेषण' : 'Instant 16-zone precision mathematical evaluation in 60 seconds.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{isHi ? 'लक्ष्मी-कुबेर धन प्रवाह व स्वास्थ्य स्थिरता की गारंटी' : 'Locks in cash liquidity and restores deep restful sleep.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{isHi ? 'वरिष्ठ प्रमाणित वास्तु आचार्य द्वारा अधिकृत रिपोर्ट' : 'Certified Senior Vastu Acharya verified remedial blueprint.'}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7. SECTION: 100% DEMOLITION-FREE REMEDIES GUARANTEE (NO PROPRIETARY FORMULAS REVEALED) */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-black text-amber-900 uppercase tracking-widest bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Hammer className="w-4 h-4 text-amber-700" /> {isHi ? 'बिना तोड़फोड़ 100% वैदिक समाधान' : 'Zero Wall Breakage Guarantee'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading leading-tight">
            {isHi ? 'घर में बिना कोई तोड़फोड़ किए 95% वास्तु दोष ठीक करें' : 'Correct 95% of Vastu Deficiencies Without Breaking a Single Wall'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            {isHi 
              ? 'आपको महंगे नवीनीकरण या निर्माण तोड़ने की बिल्कुल आवश्यकता नहीं है। महावास्तु वैज्ञानिक पंचतत्व ऊर्जा संतुलन तकनीकों का उपयोग करता है:'
              : 'You do NOT need expensive home renovations or structural breaking. Modern Vedic Vastu utilizes exact elemental neutralization:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4 hover:border-amber-400 transition-all text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
              <Zap className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{isHi ? 'पंचतत्व रंग स्पेक्ट्रम तकनीक' : 'Elemental Color Spectrum Balancers'}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi 
                ? 'गलत दिशा में बने शौचालय या रसोई की नकारात्मक ऊर्जा को विशिष्ट तरंगदैर्घ्य वाली पट्टियों द्वारा तुरंत निष्क्रिय किया जाता है।' 
                : 'Misplaced energy fields are instantly blocked using calibrated elemental color spectrum boundary strips with zero dust or noise.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4 hover:border-amber-400 transition-all text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{isHi ? 'पवित्र धातु अनुनाद रॉड्स' : 'Sacred Metal Resonance Rods'}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi
                ? 'टाइल के जोड़ों में पीतल व तांबे के सूक्ष्म तार स्थापित कर गलत प्रवेश द्वार या भूमि दोष को 30 मिनट में शांत किया जाता है।'
                : 'Microscopic sacred metal wire insertions into floor tile grout neutralize ground geopathic stress and entrance doshas in under 30 minutes.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4 hover:border-amber-400 transition-all text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
              <Sparkle className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{isHi ? 'अभिमंत्रित पिरामिड ऊर्जा वर्धक' : 'Consecrated Pyramid Multipliers'}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi
                ? 'कमजोर और कटे हुए कोनों में प्राण-प्रतिष्ठित पिरामिड स्थापित कर घर में धन प्रवाह और सकारात्मक ऊर्जा को कई गुना बढ़ाया जाता है।'
                : 'Consecrated directional pyramid deflectors amplify dormant positive prana, multiplying household liquidity and family peace effortlessly.'}
            </p>
          </div>
        </div>
      </section>

      {/* 8. NEW SECTION: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-black text-slate-800 uppercase tracking-widest bg-slate-100 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-600" /> {isHi ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently Asked Questions'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
            {isHi ? 'वास्तु विश्लेषण से जुड़े मुख्य प्रश्न' : 'Clear Answers to Common Vastu Concerns'}
          </h2>
        </div>

        <div className="space-y-3 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-black text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{isHi ? faq.q_hi : faq.q_en}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-amber-600 flex-shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {isHi ? faq.a_hi : faq.a_en}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. FOOTER HIGH-CONVERTING CTA BANNER (BLACK & GOLD) */}
      <section className="bg-slate-950 border-t border-amber-500/30 text-white py-16 px-4 text-center space-y-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black font-heading leading-tight text-white">
            {isHi ? 'आज ही अपने घर की सुख-शांति व समृद्धि सुरक्षित करें' : 'Protect Your Home\'s Energy & Wealth Today'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-medium">
            {isHi ? 'घर के अदृश्य दिशा दोषों को अपनी मेहनत पर भारी न पड़ने दें। अभी 16 दिशाओं की जांच करें।' : 'Don\'t wait for unseen Vastu defects to drain your savings. Calculate your 16-zone directional score and remedies right now.'}
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onNavigateToStart}
            className="px-9 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
          >
            <Compass className="w-5 h-5 text-slate-950" />
            <span>{isHi ? 'घर का नक्शा स्कैन करें →' : 'Scan My Floor Plan Now →'}</span>
          </button>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="font-extrabold text-slate-800">{isHi ? 'वास्तुस्कोप स्टूडियो • 16 महावास्तु वैदिक इंजन' : 'VastuScope Studio • Vedic 16 MahaVastu Engine'}</p>
        <p className="text-[11px] text-slate-400">© 2026 VastuScope Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}
