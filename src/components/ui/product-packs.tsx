"use client";
import React, { useRef } from "react";
import { Clock, Check } from "lucide-react";
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
    <section className={`py-3 px-2 sm:px-4 text-black ${className}`}>
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Top Header: "Your Report is Ready!" (Black & White) */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-neutral-900 text-[11px] font-mono font-black uppercase">
            <span>{isHi ? "वास्तु विश्लेषण पूर्ण" : "VASTU AUDIT COMPLETE"}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-black font-heading">
            {isHi ? "आपकी वास्तु रिपोर्ट तैयार है!" : "Your Report is Ready!"}
          </h1>
          <p className="text-neutral-600 text-xs sm:text-sm font-medium leading-tight max-w-md mx-auto">
            {isHi 
              ? "16 दिशाओं की ऊर्जा संतुलन रिपोर्ट। अनलॉक करने के लिए सही योजना चुनें।" 
              : "16-zone precision analytics. Choose a plan to unlock your report."}
          </p>
        </div>

        {/* 1:1 Black and White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch max-w-3xl mx-auto">
          
          {/* ======================================================== */}
          {/* OPTION 1: ₹299 BASIC VASTU REPORT (Clean White Card)     */}
          {/* ======================================================== */}
          <div className="bg-white border-2 border-black rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-left space-y-3 min-h-[260px]">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h3 className="text-lg sm:text-xl font-black text-black font-heading leading-tight">
                    {isHi ? "1. मूल वास्तु रिपोर्ट" : "1. Basic Vastu Report"}
                  </h3>
                  <p className="text-xs text-neutral-600 font-medium leading-snug">
                    {isHi ? "घर का मुख्य वास्तु स्कोर व 4 मुख्य स्तंभ" : "Macro prosperity score & defect count"}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-black">₹299</span>
                    <span className="text-xs font-bold text-neutral-400 line-through">₹799</span>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-500">
                    {isHi ? "एकमुश्त" : "One-time"}
                  </span>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 pt-2 border-t border-neutral-200 text-xs">
                {[
                  { label: isHi ? "16 दिशा समग्र वास्तु स्कोर" : "16-Zone Overall Score", val: "/100" },
                  { label: isHi ? "4 मुख्य ऊर्जा स्तंभ (धन, स्वास्थ्य)" : "4 Core Energy Pillars", val: "Cash & Health" },
                  { label: isHi ? "गंभीर वास्तु दोषों की गणना" : "Defect Count & Risk", val: "Instant" },
                  { label: isHi ? "तत्काल डिजिटल स्कोरकार्ड" : "Digital Scorecard", val: "Immediate" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-0.5">
                    <div className="flex items-center gap-2 font-bold text-black text-xs">
                      <span className="text-black font-black text-sm">✓</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="font-extrabold font-mono text-black text-xs">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Stack: Timer Directly Above CTA Button */}
            <div className="space-y-2 pt-1">
              {/* Countdown Timer */}
              <div className="bg-yellow-400/15 border-2 border-yellow-500 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1 text-[11px] text-slate-950 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600 animate-spin-slow" />
                  <span className="font-bold text-slate-950">{isHi ? "विशेष छूट समाप्त:" : "Special Offer Ends:"}</span>
                </div>
                <span className="font-mono font-black bg-yellow-400 text-black px-2 py-0.5 rounded text-xs shadow-xs">
                  {hours}h : {minutes}m : {seconds}s
                </span>
              </div>

              {/* Action Button (Solid Black) */}
              <Button
                type="button"
                variant="outline"
                onClick={() => onSelectPlan && onSelectPlan(299)}
                className="group relative inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-xl bg-black text-white border-2 border-black px-4 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-neutral-800 cursor-pointer"
              >
                <span>{isHi ? "मूल रिपोर्ट अनलॉक करें →" : "Unlock Basic Report →"}</span>
              </Button>
            </div>
          </div>


          {/* ======================================================== */}
          {/* OPTION 2: ₹899 DETAILED VASTU REPORT (Solid Black Card)  */}
          {/* ======================================================== */}
          <div className="bg-black text-white border-2 border-neutral-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-2xl text-left space-y-3 relative overflow-hidden min-h-[260px]">
            
            {/* Top Ribbon (Black & White) */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="bg-white text-black font-mono font-black text-[9px] sm:text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-sm">
                {isHi ? "⭐ सर्वश्रेष्ठ / अनुशंसित" : "⭐ BEST VALUE / RECOMMENDED"}
              </span>
              <span className="text-[10px] font-bold text-neutral-300 bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded-full">
                {isHi ? "64% छूट" : "SAVE 64%"}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h3 className="text-lg sm:text-xl font-black text-white font-heading leading-tight">
                    {isHi ? "2. विस्तृत वास्तु रिपोर्ट" : "2. Detailed Vastu Report"}
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium leading-snug">
                    {isHi ? "बिना तोड़फोड़ 16-दिशा उपाय + आचार्य PDF" : "Zero-demolition remedies & certified PDF"}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">₹899</span>
                    <span className="text-xs font-bold text-neutral-500 line-through">₹2,499</span>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400">
                    {isHi ? "संपूर्ण रिपोर्ट" : "Complete Audit"}
                  </span>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 pt-1 border-t border-neutral-800 text-xs">
                {[
                  { label: isHi ? "मूल रिपोर्ट की सभी सुविधाएं शामिल" : "All Basic Features Included", val: "Yes" },
                  { label: isHi ? "रंगीन टेप व धातु रॉड्स के सटीक माप" : "Color Tape & Rod Sizes", val: "Custom" },
                  { label: isHi ? "16 दिशा देवता ऊर्जा ग्रिड मैप" : "16-Zone Devta Grid Map", val: "Included" },
                  { label: isHi ? "आचार्य द्वारा प्रमाणित PDF (WhatsApp)" : "Acharya Certified PDF", val: "WhatsApp & Mail" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-0.5">
                    <div className="flex items-center gap-2 text-neutral-200 font-medium text-xs">
                      <span className="text-white font-black text-sm">✓</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="font-bold font-mono text-neutral-400 text-xs">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Stack: Timer Directly Above CTA Button */}
            <div className="space-y-2 pt-1">
              {/* Countdown Timer */}
              <div className="bg-yellow-400/10 border-2 border-yellow-400 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1 text-[11px] text-yellow-400 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-yellow-400 animate-spin-slow" />
                  <span className="font-bold text-yellow-400">{isHi ? "विशेष छूट समाप्त:" : "Special Offer Ends:"}</span>
                </div>
                <span className="font-mono font-black bg-yellow-400 text-black px-2 py-0.5 rounded text-xs shadow-xs">
                  {hours}h : {minutes}m : {seconds}s
                </span>
              </div>

              {/* Action Button (Solid White with Black Text) */}
              <Button
                type="button"
                variant="outline"
                onClick={() => onSelectPlan && onSelectPlan(899)}
                className="group relative inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-xl bg-white hover:bg-neutral-200 border-2 border-white text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-100 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
              >
                <span>{isHi ? "संपूर्ण रिपोर्ट अनलॉक करें →" : "Unlock Full Report →"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPacks;
