"use client";
import React from "react";
import { Zap, Clock, Sparkles, Compass } from "lucide-react";
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
    <section className={`py-1 px-1 sm:px-3 text-slate-900 ${className}`}>
      <div className="max-w-xl mx-auto space-y-2">
        
        {/* Compact Header */}
        <div className="text-center space-y-0.5">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-mono font-black uppercase">
            <Compass className="w-3 h-3 text-amber-700 animate-spin-slow" />
            <span>{isHi ? "वास्तु रिपोर्ट योजनाएं" : "Vastu Audit Plans"}</span>
          </div>
          <h2 className="text-sm sm:text-lg font-black text-slate-950 font-heading tracking-tight">
            {isHi ? "अपनी वास्तु रिपोर्ट चुनें" : "Select Your Vastu Report"}
          </h2>
        </div>

        {/* Up-Down Stacked Container: Both Cards Fit in Viewport */}
        <div className="space-y-2">
          
          {/* OPTION 1 (TOP): ₹299 BASIC SCORE REPORT */}
          <div className="bg-white border-2 border-slate-200 hover:border-amber-400 rounded-2xl p-2.5 sm:p-3.5 shadow-sm transition-all text-left space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 font-heading truncate">
                    {isHi ? "1. मूल स्कोर रिपोर्ट" : "1. Basic Score Report"}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                    {isHi ? "16-दिशा स्कोर, धन व स्वास्थ्य विश्लेषण" : "16-Zone Score, Cash & Health Bars"}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-xl font-black text-slate-950 font-mono">₹299</span>
                  <span className="text-[10px] text-slate-400 line-through">₹799</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              type="button"
              onClick={() => onSelectPlan && onSelectPlan(299)}
              className="w-full h-8 sm:h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-sm hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <span>{isHi ? "मूल रिपोर्ट अनलॉक करें (₹299) →" : "Unlock Basic Score (₹299) →"}</span>
            </Button>
          </div>


          {/* OPTION 2 (BOTTOM): ₹899 FULL VASTU REMEDY AUDIT */}
          <div className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white border-2 border-amber-400 rounded-2xl p-2.5 sm:p-3.5 shadow-md text-left space-y-2 relative ring-1 ring-amber-400/30 overflow-hidden">
            
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-black text-slate-950 font-heading truncate">
                      {isHi ? "2. संपूर्ण वैदिक उपाय रिपोर्ट" : "2. Full Remedy Audit"}
                    </h3>
                    <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-mono font-black text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded shadow-2xs">
                      {isHi ? "सर्वश्रेष्ठ" : "BEST VALUE"}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-amber-900 font-semibold truncate">
                    {isHi ? "बिना तोड़फोड़ उपाय + आचार्य PDF (WhatsApp)" : "Zero-Demolition Remedies + Acharya PDF"}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-xl font-black text-slate-950 font-mono">₹899</span>
                  <span className="text-[10px] text-slate-400 line-through">₹2,499</span>
                </div>
              </div>
            </div>

            {/* Compact Timer Row */}
            <div className="bg-amber-50 border border-amber-300/80 rounded-lg px-2 py-0.5 flex items-center justify-between gap-1 text-[10px]">
              <div className="flex items-center gap-1 min-w-0">
                <Clock className="w-3 h-3 text-amber-700 animate-spin-slow flex-shrink-0" />
                <span className="font-bold text-slate-800 truncate">
                  {isHi ? "⚡ विशेष छूट समाप्त:" : "⚡ Special Offer Ends:"}
                </span>
              </div>
              <div className="flex items-center gap-0.5 bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded font-mono font-black text-[9px] flex-shrink-0">
                <span>{hours}h</span>:<span>{minutes}m</span>:<span>{seconds}s</span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              type="button"
              onClick={() => onSelectPlan && onSelectPlan(899)}
              className="w-full h-9 sm:h-10 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>{isHi ? "संपूर्ण रिपोर्ट अनलॉक करें (₹899) →" : "Unlock Full Report (₹899) →"}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPacks;
