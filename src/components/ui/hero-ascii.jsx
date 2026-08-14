'use client';

import React, { useEffect, useRef } from 'react';
import { Compass, ArrowRight } from 'lucide-react';

export default function HeroAscii({ onNavigateToStart }) {
  const canvasRef = useRef(null);

  // Pure HTML5 Vastu Chakra & Directional Degrees Animation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 16 Vastu Direction Names
    const directions = [
      'N', 'NNE', 'NE', 'ENE', 
      'E', 'ESE', 'SE', 'SSE', 
      'S', 'SSW', 'SW', 'WSW', 
      'W', 'WNW', 'NW', 'NNW'
    ];

    // Floating Vastu Particle Elements (Degrees & Direction Labels)
    const floatingElements = Array.from({ length: 48 }, () => {
      const isDir = Math.random() > 0.4;
      return {
        x: Math.random() * (canvas.width || 800),
        y: Math.random() * (canvas.height || 600),
        alpha: Math.random() * 0.6 + 0.25,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35,
        text: isDir 
          ? ['NE', 'SE', 'SW', 'NW', 'N', 'E', 'S', 'W', 'NNE', 'ENE', 'SSE', 'SSW'][Math.floor(Math.random() * 12)]
          : [`${Math.floor(Math.random() * 360)}°`, '16-ZONES', '360°', 'MAHAVASTU', '0°', '90°', '180°', '270°'][Math.floor(Math.random() * 8)],
        isGold: Math.random() > 0.3
      };
    });

    let rotationAngle = 0;

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rotationAngle += 0.0025; // Gentle smooth compass rotation

      // Centered background canvas
      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;
      const baseRadius = Math.min(canvas.width, canvas.height) * (canvas.width < 768 ? 0.38 : 0.32);

      // 1. Draw 16 MahaVastu Directional Rays
      ctx.save();
      ctx.translate(centerX, centerY);
      for (let i = 0; i < 16; i++) {
        const rayAngle = (i * (360 / 16) * Math.PI) / 180 + rotationAngle;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const rayLen = baseRadius * 1.3;
        ctx.lineTo(Math.cos(rayAngle) * rayLen, Math.sin(rayAngle) * rayLen);
        ctx.strokeStyle = i % 4 === 0 ? 'rgba(250, 204, 21, 0.35)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = i % 4 === 0 ? 1.5 : 0.8;
        ctx.setLineDash(i % 2 === 0 ? [] : [4, 4]);
        ctx.stroke();

        // Direction Labels along outer edge
        const labelX = Math.cos(rayAngle) * (baseRadius * 1.38);
        const labelY = Math.sin(rayAngle) * (baseRadius * 1.38);
        ctx.font = i % 4 === 0 ? 'bold 11px monospace' : '9px monospace';
        ctx.fillStyle = i % 4 === 0 ? '#facc15' : 'rgba(255, 255, 255, 0.45)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(directions[i], labelX, labelY);
      }
      ctx.restore();

      // 2. Draw Concentric Vastu Chakra Rings & Degree Ticks
      ctx.save();
      ctx.translate(centerX, centerY);

      // Outer Degree Ring (360° Compass Wheel)
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 1.2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner Chakra Ring 1
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.9, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.stroke();

      // Inner Chakra Ring 2 (Golden Center Core)
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([]);
      ctx.stroke();

      // Degree Ticks along Outer Ring (Every 10°)
      for (let d = 0; d < 360; d += 10) {
        const rad = (d * Math.PI) / 180 + rotationAngle;
        const innerR = d % 30 === 0 ? baseRadius * 1.15 : baseRadius * 1.18;
        const outerR = baseRadius * 1.22;
        ctx.beginPath();
        ctx.moveTo(Math.cos(rad) * innerR, Math.sin(rad) * innerR);
        ctx.lineTo(Math.cos(rad) * outerR, Math.sin(rad) * outerR);
        ctx.strokeStyle = d % 30 === 0 ? 'rgba(250, 204, 21, 0.6)' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = d % 30 === 0 ? 1.5 : 0.8;
        ctx.stroke();
      }

      ctx.restore();

      // 3. Render Floating Directions & Degrees Particle Matrix
      floatingElements.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = p.isGold 
          ? `rgba(250, 204, 21, ${p.alpha * 0.7})` 
          : `rgba(255, 255, 255, ${p.alpha * 0.5})`;
        ctx.fillText(p.text, p.x, p.y);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-white shadow-2xl flex flex-col justify-between aspect-[16/9] min-h-[460px] sm:aspect-auto sm:min-h-[85vh] lg:min-h-screen">
      {/* 60-120fps Pure HTML5 Vastu Chakra Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0 opacity-90 pointer-events-none"
      />

      {/* Top Header Bar inside Hero */}
      <div className="relative z-20 border-b border-white/15 bg-black/40 backdrop-blur-xs">
        <div className="w-full px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 mx-auto sm:mx-0">
            <div className="font-mono text-amber-400 text-base sm:text-xl font-bold tracking-widest flex items-center gap-2 cursor-pointer">
              <img src="/vastu_logo.jpg" className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg border border-amber-400/40 object-cover shadow-sm" alt="VastuScope Logo" />
              <span>VASTUSCOPE</span>
            </div>
            <div className="h-4 w-px bg-white/30"></div>
            <span className="text-amber-300/80 text-[10px] sm:text-xs font-mono tracking-wider">16-ZONE ENGINE</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-amber-200/70">
            <span>LAT: 28.6139° N</span>
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></div>
            <span>LONG: 77.2090° E</span>
          </div>
        </div>
      </div>

      {/* Main Content Area (Center Aligned) */}
      <div className="relative z-10 my-auto py-6 sm:py-16 px-4 sm:px-8 container mx-auto text-center">
        <div className="max-w-2xl mx-auto space-y-3 sm:space-y-5 flex flex-col items-center">
          {/* Top decorative line */}
          <div className="flex items-center justify-center gap-2 opacity-80 w-full max-w-md mx-auto">
            <div className="w-8 sm:w-12 h-px bg-amber-500"></div>
            <span className="text-amber-400 text-[9px] sm:text-xs font-mono tracking-widest uppercase font-bold whitespace-nowrap">
              100% VASTU PRECISION ENGINE
            </span>
            <div className="w-8 sm:w-12 h-px bg-amber-500"></div>
          </div>

          {/* Title */}
          <div className="relative text-center">
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight font-heading tracking-tight">
              PERFECT VASTU
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 mt-1 sm:mt-2">
                ALIGNMENT &amp; WEALTH
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-base lg:text-lg text-slate-300 leading-relaxed font-sans opacity-95 max-w-lg mx-auto text-center">
            Where ancient Vedic geometry meets modern floor plan AI. Discover your home&apos;s 16 directional energy zones and unlock 100% wealth &amp; peace.
          </p>

          {/* CTA Button */}
          <div className="pt-2 sm:pt-4 flex justify-center w-full">
            <button 
              type="button"
              onClick={onNavigateToStart}
              className="px-6 py-3.5 sm:px-9 sm:py-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black font-sans text-xs sm:text-base rounded-xl transition-all duration-200 shadow-2xl shadow-amber-400/30 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Compass className="w-5 h-5 text-slate-950" />
              <span>SCAN FLOOR PLAN NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer bar inside Hero */}
      <div className="relative z-20 border-t border-white/15 bg-black/60 backdrop-blur-xs">
        <div className="w-full px-4 sm:px-8 lg:px-12 py-2 sm:py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-6 text-[9px] sm:text-[11px] font-mono text-amber-200/70">
            <span className="text-emerald-400">● MAHAVASTU.ACTIVE</span>
            <span className="hidden sm:inline">ACCURACY: 100%</span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-4 text-[9px] sm:text-[11px] font-mono text-amber-200/70">
            <span>16 ZONES MATRIX</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-amber-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-amber-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
