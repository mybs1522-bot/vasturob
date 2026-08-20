"use client";
import React, { useRef } from "react";
import { Box, Zap, Clock, ShieldCheck, Check, Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimelineAnimation } from "@/components/ui/product-packs-utils/timeline-animation";

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
  const timelineRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={timelineRef}
      className={`py-8 px-3 sm:px-6 bg-transparent text-slate-900 ${className}`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <TimelineAnimation
          animationNum={1}
          timelineRef={timelineRef}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-black uppercase">
            <Compass className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
            <span>{isHi ? "वास्तु विश्लेषण योजनाएं" : "Vastu Audit Plans"}</span>
          </div>

          <TimelineAnimation
            animationNum={2}
            timelineRef={timelineRef}
            as="h2"
            className="text-2xl sm:text-4xl font-black text-slate-950 font-heading tracking-tight"
          >
            {isHi ? "अपने घर के लिए सही रिपोर्ट चुनें" : "Select Your Vastu Audit Report"}
          </TimelineAnimation>
          
          <TimelineAnimation
            animationNum={3}
            timelineRef={timelineRef}
            as="p"
            className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto font-medium"
          >
            {isHi 
              ? "100% सटीक वैदिक महावास्तु गणना। अपनी आवश्यकतानुसार उपयुक्त रिपोर्ट अनलॉक करें।"
              : "100% precision 16-zone MahaVastu analytics. Unlock your certified report to protect your wealth & health."}
          </TimelineAnimation>
        </TimelineAnimation>

        {/* 2 Plans Grid */}
        <TimelineAnimation
          animationNum={4}
          timelineRef={timelineRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch"
        >
          
          {/* OPTION 1: ₹299 BASIC MACRO SCORE & RISK REPORT */}
          <TimelineAnimation
            animationNum={5}
            timelineRef={timelineRef}
            className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-7 flex flex-col justify-between shadow-md space-y-5 hover:border-amber-400 transition-all text-left relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 font-heading flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-600" />
                    <span>{isHi ? "मूल स्कोर रिपोर्ट" : "Basic Score Report"}</span>
                  </h3>
                  <p className="text-slate-500 text-xs font-medium">
                    {isHi ? "घर का मुख्य वास्तु स्कोर व दोष जांच" : "Macro prosperity score & defect count"}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase border border-slate-200">
                  {isHi ? "डिजिटल" : "Instant"}
                </span>
              </div>

              {/* Price Tag */}
              <div className="flex items-baseline gap-2 py-1 border-y border-slate-100">
                <span className="text-3xl sm:text-4xl font-black text-slate-950 font-mono">₹299</span>
                <span className="text-xs font-bold text-slate-400 line-through">₹799</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  {isHi ? "एकमुश्त" : "One-time"}
                </span>
              </div>

              {/* Features List */}
              <div className="space-y-2.5 pt-1 text-xs">
                {[
                  { text: isHi ? "16 दिशाओं का समग्र वास्तु स्कोर (100 में से)" : "Overall 16-Zone Vastu Score (/100)", ok: true },
                  { text: isHi ? "4 मुख्य ऊर्जा स्तंभ (धन, स्वास्थ्य, सामंजस्य, करियर)" : "4 Core Metrics (Cash, Health, Harmony, Career)", ok: true },
                  { text: isHi ? "गंभीर वास्तु दोषों की पहचान व गणना" : "Major Directional Dosha Count & Risk Levels", ok: true },
                  { text: isHi ? "कमरेवार रंगीन टेप व धातु रॉड्स उपाय" : "Room-by-Room Elemental Color Tapes & Rods", ok: false },
                  { text: isHi ? "वरिष्ठ वास्तु आचार्य द्वारा प्रमाणित PDF" : "Senior Vastu Acharya Certified PDF Report", ok: false },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-slate-700 font-medium">
                    {feat.ok ? (
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-black flex-shrink-0">✕</span>
                    )}
                    <span className={feat.ok ? "text-slate-800 font-semibold" : "text-slate-400 line-through"}>
                      {feat.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Button
                type="button"
                onClick={() => onSelectPlan && onSelectPlan(299)}
                className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isHi ? "मूल स्कोर अनलॉक करें (₹299) →" : "Unlock Basic Score (₹299) →"}</span>
              </Button>
            </div>
          </TimelineAnimation>


          {/* OPTION 2: ₹899 FULL VASTU REMEDY AUDIT (RECOMMENDED) */}
          <TimelineAnimation
            animationNum={6}
            timelineRef={timelineRef}
            className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white border-2 border-amber-400 rounded-3xl p-5 sm:p-7 flex flex-col justify-between shadow-xl space-y-5 text-left relative overflow-hidden ring-2 ring-amber-400/20"
          >
            {/* Top Recommended Tag */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-mono font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
              {isHi ? "⭐ सबसे लोकप्रिय" : "⭐ BEST VALUE / RECOMMENDED"}
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-950 font-heading flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>{isHi ? "संपूर्ण वैदिक उपाय रिपोर्ट" : "Full Remedy Audit"}</span>
                </h3>
                <p className="text-amber-900 text-xs font-semibold">
                  {isHi ? "बिना तोड़फोड़ 16 दिशाओं के अचूक वैदिक उपाय" : "Zero-demolition remedies & certified Acharya PDF"}
                </p>
              </div>

              {/* Price Tag with Evergreen Timer */}
              <div className="space-y-2 py-1 border-y border-amber-200/80">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950 font-mono">₹899</span>
                  <span className="text-xs font-bold text-slate-400 line-through">₹2,499</span>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                    {isHi ? "64% छूट" : "SAVE 64%"}
                  </span>
                </div>

                {/* Evergreen Countdown Timer */}
                <div className="bg-white/80 border border-amber-300 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin-slow flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs font-black text-slate-900 truncate">
                      {isHi ? "⚡ विशेष छूट समाप्त:" : "⚡ Special Offer Ends:"}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md font-mono font-black text-[10px] sm:text-xs shadow-2xs flex-shrink-0">
                    <span>{hours}h</span>:<span>{minutes}m</span>:<span>{seconds}s</span>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2.5 pt-1 text-xs">
                {[
                  { text: isHi ? "मूल रिपोर्ट की सभी सुविधाएं शामिल" : "Everything in Basic Plan Included" },
                  { text: isHi ? "कमरेवार रंगीन टेप व धातु रॉड्स की सटीक लंबाई" : "Exact Color Tape & Metal Wire Rod Measurements" },
                  { text: isHi ? "अष्टदिक्पालक 16 दिशा देवता ऊर्जा ग्रिड मैप" : "16-Zone Ashtadikpalaka Devta Energy Grid Map" },
                  { text: isHi ? "अभिमंत्रित यंत्र व पिरामिड ऊर्जा वर्धक दिशानिर्देश" : "Consecrated Yantra & Pyramid Alignment Guidelines" },
                  { text: isHi ? "वरिष्ठ वास्तु आचार्य द्वारा हस्तनिर्मित प्रमाणित PDF" : "Certified PDF Verified by Senior Vastu Acharya" },
                  { text: isHi ? "2-4 घंटे में WhatsApp व ईमेल पर डिलीवरी" : "Delivered to WhatsApp & Email in 2–4 Hours" },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{feat.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Button
                type="button"
                onClick={() => onSelectPlan && onSelectPlan(899)}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{isHi ? "संपूर्ण रिपोर्ट अनलॉक करें (₹899) →" : "Unlock Full Report (₹899) →"}</span>
              </Button>
            </div>
          </TimelineAnimation>
        </TimelineAnimation>
      </div>
    </section>
  );
};

export default ProductPacks;
