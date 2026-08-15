import React, { useState } from 'react';
import { useLanguage, translations } from '../lib/i18n';
import { Sparkles, Globe, Check, Compass } from 'lucide-react';

export default function LanguageSelectorModal({ isOpen, onClose }) {
  const { lang, setLang, t } = useLanguage();
  const [selected, setSelected] = useState(lang || 'en');

  if (!isOpen) return null;

  const handleConfirm = () => {
    setLang(selected);
    try {
      localStorage.setItem('vastuscope_lang_chosen', 'true');
    } catch {}
    onClose();
  };

  const enDesc = translations?.en?.lang_en_desc || 'Standard Architectural & MahaVastu terms';
  const hiDesc = translations?.hi?.lang_hi_desc || '16 महावास्तु दिशाएं, वैदिक उपाय व संपूर्ण विश्लेषण';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-white text-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Vedic Logo & Header */}
        <div className="space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-yellow-500/20 to-amber-500/40 border border-amber-400/50 flex items-center justify-center shadow-lg">
            <Compass className="w-8 h-8 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
            {t('select_language')}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {t('select_language_sub')}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3 text-left">
          {/* English Option */}
          <button
            type="button"
            onClick={() => setSelected('en')}
            className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
              selected === 'en'
                ? 'bg-amber-500/10 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl flex-shrink-0">🇬🇧</span>
              <div>
                <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>English</span>
                  {selected === 'en' && <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded font-mono">SELECTED</span>}
                </div>
                <span className="text-xs text-slate-400">{enDesc}</span>
              </div>
            </div>
            {selected === 'en' && <Check className="w-5 h-5 text-amber-400 flex-shrink-0" />}
          </button>

          {/* Hindi Option */}
          <button
            type="button"
            onClick={() => setSelected('hi')}
            className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
              selected === 'hi'
                ? 'bg-amber-500/10 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl flex-shrink-0">🇮🇳</span>
              <div>
                <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>हिन्दी (Hindi)</span>
                  {selected === 'hi' && <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded font-mono">चयनित</span>}
                </div>
                <span className="text-xs text-amber-200/80">{hiDesc}</span>
              </div>
            </div>
            {selected === 'hi' && <Check className="w-5 h-5 text-amber-400 flex-shrink-0" />}
          </button>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{t('continue_btn')}</span>
        </button>
      </div>
    </div>
  );
}

// Ultra-smooth loading screen during language switch / initial load
export function SmoothLanguageLoader({ isVisible }) {
  const { lang, t } = useLanguage();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 space-y-6 text-center animate-in fade-in duration-200">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="w-24 h-24 rounded-full border-2 border-amber-400/30 animate-ping absolute" style={{ animationDuration: '2s' }} />
        {/* Rotating Vastu Chakra */}
        <div className="w-20 h-20 rounded-full border-2 border-amber-400 border-t-transparent animate-spin flex items-center justify-center shadow-xl shadow-amber-500/20">
          <Compass className="w-10 h-10 text-amber-400 animate-pulse" />
        </div>
      </div>

      <div className="space-y-1.5 max-w-xs">
        <h3 className="text-base font-extrabold text-white font-heading tracking-wide">
          {t('loading_vastu_engine')}
        </h3>
        <p className="text-xs text-amber-300/80 font-medium">
          {t('loading_vastu_sub')}
        </p>
      </div>
    </div>
  );
}
