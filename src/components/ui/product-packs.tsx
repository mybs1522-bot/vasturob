"use client";
import React from "react";
import { Zap, Clock, Check, Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProductPacksProps {
  onSelectPlan?: (amount: number) => void;
  isHi?: boolean;
  hours?: string;
  minutes?: string;
  seconds?: string;
  className?: string;
}

export const ProductPacks: React.FC<ProductPacksProps> = ({
  onSelectPlan,
  isHi = false,
  hours = "02",
  minutes = "37",
  seconds = "00",
  className = ""
}) => {
  return (
    <section className={`py-2 px-1 sm:px-3 text-slate-900 ${className}`}>
      <div className="max-w-4xl mx-auto space-y-2.5">
        
        {/* Compact Header */}
        <div className="text-center space-y-0.5">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-mono font-black uppercase">
            <Compass className="w-3 h-3 text-amber-700 animate-spin-slow" />
            <span>{isHi ? "वास्तु रिपोर्ट योजनाएं" : "Vastu Audit Plans"}</span>
          </div>
          <h2 className="text-base sm:text-2xl font-black text-slate-950 font-heading tracking-tight">
            {isHi ? "अपनी वास्तु रिपोर्ट चुनें" : "Select Your Vastu Report"}
          </h2>
        </div>

        {/* 2 Plans Grid: Side-by-side on all screens (mobile & desktop) to fit in 1 viewport */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 items-stretch">
          
          {/* ======================================================== */}
          {/* OPTION 1: ₹299 BASIC SCORE REPORT                        */}
          {/* ======================================================== */}
          <div className="bg-white border-2 border-slate-200 hover:border-amber-400 rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between shadow-sm transition-all text-left relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-xs sm:text-base font-black text-slate-900 font-heading flex items-center gap-1 truncate">
                  <Zap className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span className="truncate">{isHi ? "मूल स्कोर" : "Basic Score"}</span>
                </h3>
                <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[9px] font-bold uppercase border border-slate-200 flex-shrink-0">
                  {isHi ? "डिजिटल" : "Instant"}
                </span>
              </div>

              {/* Price Tag */}
              <div className="flex items-baseline gap-1 py-0.5 border-y border-slate-100">
                <span className="text-xl sm:text-3xl font-black text-slate-950 font-mono">₹299</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 line-through">₹799</span>
              </div>

              {/* Short Bullets */}
              <div className="space-y-1.5 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="leading-tight">{isHi ? "16-दिशा वास्तु स्कोर (/100)" : "16-Zone Score (/100)"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="leading-tight">{isHi ? "धन, स्वास्थ्य, करियर स्तंभ" : "Cash, Health & Career"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="leading-tight">{isHi ? "गंभीर वास्तु दोष गणना" : "Defect Count & Risk"}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2.5">
              <Button
                type="button"
                onClick={() => onSelectPlan && onSelectPlan(299)}
                className="w-full h-9 sm:h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-sm hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-1 p-1"
              >
                <span>{isHi ? "अनलॉक (₹299) →" : "Unlock (₹299) →"}</span>
              </Button>
            </div>
          </div>


          {/* ======================================================== */}
          {/* OPTION 2: ₹899 FULL REMEDY AUDIT (RECOMMENDED)           */}
          {/* ======================================================== */}
          <div className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white border-2 border-amber-400 rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between shadow-md text-left relative ring-1 ring-amber-400/30">
            
            {/* Top Recommended Tag */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-mono font-black text-[8px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-bl-lg shadow-2xs">
              {isHi ? "⭐ सर्वश्रेष्ठ" : "⭐ BEST VALUE"}
            </div>

            <div className="space-y-2">
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-base font-black text-slate-950 font-heading flex items-center gap-1 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span className="truncate">{isHi ? "वैदिक उपाय" : "Full Remedies"}</span>
                </h3>
              </div>

              {/* Price Tag with Evergreen Timer */}
              <div className="space-y-1 py-0.5 border-y border-amber-200/80">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-3xl font-black text-slate-950 font-mono">₹899</span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 line-through">₹2,499</span>
                  <span className="text-[8px] sm:text-[9px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-1 rounded">
                    {isHi ? "-64%" : "64% OFF"}
                  </span>
                </div>

                {/* Compact Timer */}
                <div className="bg-white/90 border border-amber-300 rounded-lg px-1.5 py-0.5 flex items-center justify-between gap-1 shadow-2xs">
                  <div className="flex items-center gap-1 min-w-0">
                    <Clock className="w-3 h-3 text-amber-700 animate-spin-slow flex-shrink-0" />
                    <span className="text-[8px] sm:text-[10px] font-black text-slate-900 truncate">
                      {isHi ? "⚡ छूट:" : "⚡ Ends:"}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 bg-slate-950 text-amber-300 px-1 rounded font-mono font-black text-[8px] sm:text-[10px] flex-shrink-0">
                    <span>{hours}h</span>:<span>{minutes}m</span>:<span>{seconds}s</span>
                  </div>
                </div>
              </div>

              {/* Short Bullets */}
              <div className="space-y-1.5 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="leading-tight">{isHi ? "मूल रिपोर्ट की सभी सुविधाएं" : "All Basic Features"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="leading-tight">{isHi ? "रंगीन टेप व धातु रॉड माप" : "Color Tape & Metal Rods"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="leading-tight">{isHi ? "आचार्य PDF (WhatsApp/Email)" : "Acharya PDF on WhatsApp"}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2.5">
              <Button
                type="button"
                onClick={() => onSelectPlan && onSelectPlan(899)}
                className="w-full h-9 sm:h-10 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-md hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-1 p-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>{isHi ? "संपूर्ण अनलॉक (₹899) →" : "Unlock Full (₹899) →"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPacks;
