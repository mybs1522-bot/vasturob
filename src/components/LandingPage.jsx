import React, { useState } from 'react';
import HeroAscii from '@/components/ui/hero-ascii';
import VastuDemoVideoPlayer from './VastuDemoVideoPlayer';
import { useLanguage } from '@/lib/i18n';
import {
  Compass, Sparkles, ShieldCheck, PhoneCall,
  Flame, Droplets, CheckCircle2, Zap, Award,
  AlertTriangle, HeartPulse, DollarSign, Users, Briefcase, Sparkle, Hammer, ShieldAlert, Globe
} from 'lucide-react';

export default function LandingPage({ onNavigateToStart, onOpenExpertModal, onOpenAdmin }) {
  const [activeTab, setActiveTab] = useState('wealth');
  const { lang, toggleLang, t } = useLanguage();

  return (
    <div className="min-h-screen chequered-bg text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col smooth-hardware bg-white">
      {/* Subtle Fear Emergency Warning Top Bar (Black & Gold Theme) */}
      <div className="bg-slate-950 text-amber-300 border-b border-amber-500/30 px-4 py-2.5 text-center text-xs font-extrabold flex items-center justify-between sm:justify-center gap-2 shadow-sm relative z-50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce flex-shrink-0" />
          <span>
            {lang === 'hi' ? (
              <>
                <strong className="text-white">सावधानी:</strong> 85% भारतीय घरों में दिशा दोष होते हैं, जो धन और स्वास्थ्य को प्रभावित करते हैं।
              </>
            ) : (
              <>
                <strong className="text-white">WARNING:</strong> 85% of Modern Indian Homes Suffer from Silent Vastu Defects That Drain Wealth &amp; Health.
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateToStart}
            className="bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full font-black text-[11px] hover:bg-yellow-300 transition-all hidden sm:inline shadow-sm cursor-pointer whitespace-nowrap"
          >
            {lang === 'hi' ? 'दोष जांचें →' : 'Check Your Risk Now →'}
          </button>
          <button
            type="button"
            onClick={toggleLang}
            className="px-2 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3 h-3 text-amber-400" />
            <span>{lang === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* HERO SECTION WITH UNICORN VITRUVIAN ASCII ANIMATION (FULL WIDTH & GOLD THEME) */}
      <section className="w-full">
        <HeroAscii onNavigateToStart={onNavigateToStart} onOpenExpertModal={onOpenExpertModal} />

        {/* HIGH QUALITY 8-10 SECOND CODE ANIMATION VIDEO (BELOW HERO SECTION) */}
        <div className="px-4 sm:px-8 max-w-7xl mx-auto">
          <VastuDemoVideoPlayer onNavigateToStart={onNavigateToStart} />
        </div>

        {/* Live Studio Wheel Teaser Card (White, Black & Gold) */}
        <div className="max-w-4xl mx-4 sm:mx-auto rounded-3xl border border-amber-400/40 bg-white p-4 sm:p-6 shadow-xl relative overflow-hidden my-12 z-10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono text-slate-900 font-extrabold uppercase">
                {lang === 'hi' ? 'लाइव 16-दिशा महावास्तु स्कैनर' : 'LIVE 16-ZONE MAHAVASTU SCANNER'}
              </span>
            </div>
            <span className="text-xs font-black bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-300/60 font-mono">
              {lang === 'hi' ? 'शुद्धता: 100% सटीक' : 'Accuracy: 100% Precision'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-amber-200/60 space-y-2">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-600" /> {lang === 'hi' ? 'आग्नेय कोण (South-East)' : 'South-East (Agni Kone)'}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {lang === 'hi' ? 'दैनिक धन प्रवाह और अग्नि तत्व का केंद्र। यहां दोष होने से धन व्यर्थ बहता है।' : 'Controls cash liquidity and fire energy. Misplaced elements here cause sudden financial drainage.'}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-amber-200/60 space-y-2">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                <Droplets className="w-4 h-4 text-amber-600" /> {lang === 'hi' ? 'ईशान कोण (North-East)' : 'North-East (Ishan Kone)'}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {lang === 'hi' ? 'घर का आध्यात्मिक शीर्ष (शिव स्थान)। यहां भारी सामान या गंदगी होने से मानसिक अशांति होती है।' : 'Spiritual head of the house (Lord Shiva zone). Heavy overhead clutter here causes mental confusion & anxiety.'}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-amber-200/60 space-y-2">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" /> {lang === 'hi' ? 'नैऋत्य कोण (South-West)' : 'South-West (Nirriti)'}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {lang === 'hi' ? 'पारिवारिक स्थिरता और मुखिया का अधिकार क्षेत्र। यहां दोष से रिश्ते कमजोर होते हैं।' : 'Controls family stability and head of household authority. Cuts here cause chronic debt and instability.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE SILENT DANGER MATRIX (BLACK & GOLD SILENT DANGER) */}
      <section className="chequered-dark-bg text-white py-20 px-4 sm:px-8 border-y border-slate-800 relative bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-950/80 border border-amber-500/40 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> {lang === 'hi' ? 'अदृश्य वास्तु दोष चेतावनी' : 'Silent Danger Warning'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white">
              {lang === 'hi' ? '4 गंभीर वास्तु दोष जो अनजाने में घर की शांति नष्ट करते हैं' : '4 Critical Vastu Flaws That Destroy Peace Before You Notice'}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              {lang === 'hi'
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">{lang === 'hi' ? 'आग्नेय दिशा दोष' : 'SE Zone Defect'}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{lang === 'hi' ? 'धन का रिसाव' : 'The Cash Drainer'}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'hi' ? 'आग्नेय कोण में शौचालय या जल स्रोत। धन आता है लेकिन अचानक बिलों व खर्चों में बह जाता है।' : 'Toilet or water feature in South-East (Agni). Money flows in but instantly drains out into hospital bills, unexpected breakdowns, or unpaid invoices.'}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>{lang === 'hi' ? 'जोखिम: उच्च' : 'Risk Level: High'}</span>
                <span>{lang === 'hi' ? 'प्रभाव: आर्थिक' : 'Impact: 100% Financial'}</span>
              </div>
            </div>

            {/* Danger Item 2 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-400 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">{lang === 'hi' ? 'ईशान दिशा दोष' : 'NE Zone Defect'}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{lang === 'hi' ? 'मानसिक तनाव व भ्रम' : 'The Mental Fog'}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'hi' ? 'ईशान कोण में भारी स्टोरेज या गंदगी। सिरदर्द, चिंता, अनिद्रा और सही निर्णय न ले पाने की समस्या उत्पन्न करता है।' : 'Heavy storage or clutter over Ishan Kone. Triggers chronic headaches, anxiety, lack of career direction, and memory issues for family members.'}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>{lang === 'hi' ? 'जोखिम: गंभीर' : 'Risk Level: Severe'}</span>
                <span>{lang === 'hi' ? 'प्रभाव: स्वास्थ्य' : 'Impact: Health & Peace'}</span>
              </div>
            </div>

            {/* Danger Item 3 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-400 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">{lang === 'hi' ? 'नैऋत्य दिशा दोष' : 'SW Zone Defect'}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{lang === 'hi' ? 'रिश्तों में दरार' : 'The Relationship Breaker'}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'hi' ? 'नैऋत्य कोण में गड्ढा या प्रवेश द्वार। पति-पत्नी में कलह और परिवार के सदस्यों में मतभेद पैदा करता है।' : 'Cuts or entrance in South-West (Nairutya). Destroys stability, triggering frequent marital arguments, trust issues, and loss of respect.'}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>{lang === 'hi' ? 'जोखिम: उच्च' : 'Risk Level: High'}</span>
                <span>{lang === 'hi' ? 'प्रभाव: पारिवारिक' : 'Impact: Family Stability'}</span>
              </div>
            </div>

            {/* Danger Item 4 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-400 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">{lang === 'hi' ? 'उत्तर दिशा दोष' : 'North Zone Block'}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{lang === 'hi' ? 'करियर में रुकावट' : 'Career Ceiling'}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'hi' ? 'उत्तर (कुबेर) में रसोई या लाल रंग। नए व्यापारिक अवसरों और नौकरी में तरक्की को पूरी तरह रोक देता है।' : 'Kitchen or trash in the North (Kuber) zone. Blocks new job offers, prevents business growth, and keeps you stuck despite working long hours.'}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>{lang === 'hi' ? 'जोखिम: उच्च' : 'Risk Level: High'}</span>
                <span>{lang === 'hi' ? 'प्रभाव: करियर' : 'Impact: Growth & Income'}</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={onNavigateToStart}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl inline-flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5 text-slate-950" />
              <span>{lang === 'hi' ? 'अपने घर का नक्शा जांचें →' : 'Diagnose Your Floor Plan Now →'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: 100% DEMOLITION-FREE REMEDIES GUARANTEE */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-black text-amber-900 uppercase tracking-widest bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Hammer className="w-4 h-4 text-amber-700" /> {t('remedy_badge')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading leading-tight">
            {t('remedy_title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            {t('remedy_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4 hover:border-amber-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
              <Zap className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{t('rem1_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('rem1_desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4 hover:border-amber-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{t('rem2_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('rem2_desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4 hover:border-amber-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
              <Sparkle className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{t('rem3_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('rem3_desc')}</p>
          </div>
        </div>
      </section>

      {/* FOOTER HIGH-CONVERTING CTA BANNER (BLACK & GOLD) */}
      <section className="bg-slate-950 border-t border-amber-500/30 text-white py-16 px-4 text-center space-y-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black font-heading leading-tight text-white">
            {lang === 'hi' ? 'आज ही अपने घर की सुख-शांति व समृद्धि सुरक्षित करें' : 'Protect Your Home\'s Energy & Wealth Today'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-medium">
            {lang === 'hi' ? 'घर के अदृश्य दिशा दोषों को अपनी मेहनत पर भारी न पड़ने दें। अभी 16 दिशाओं की जांच करें।' : 'Don\'t wait for unseen Vastu defects to drain your savings. Calculate your 16-zone directional score and remedies right now.'}
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onNavigateToStart}
            className="px-9 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-105 cursor-pointer"
          >
            {lang === 'hi' ? 'घर का नक्शा स्कैन करें →' : 'Scan My Floor Plan Now →'}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="font-extrabold text-slate-800">{lang === 'hi' ? 'वास्तुस्कोप स्टूडियो • 16 महावास्तु वैदिक इंजन' : 'VastuScope Studio • Vedic 16 MahaVastu Engine'}</p>
        <p className="text-[11px] text-slate-400">© 2026 VastuScope Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}
