import React, { useRef, useState } from 'react';
import { Compass, RotateCcw, RotateCw, MapPin } from 'lucide-react';
import { ALL_INDIAN_STATES } from '../utils/aiVisionScanner';

export default function NorthCompassControls({ northAngle, setNorthAngle }) {
  const wheelRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [selectedStateName, setSelectedStateName] = useState('Maharashtra');

  const selectedLoc = ALL_INDIAN_STATES.find(s => s.state === selectedStateName) || ALL_INDIAN_STATES[18];

  const handleStateChange = (stateName) => {
    setSelectedStateName(stateName);
    const loc = ALL_INDIAN_STATES.find(s => s.state === stateName);
    if (loc && setNorthAngle) {
      const calibratedDeg = (Math.round(northAngle + loc.declination) + 360) % 360;
      setNorthAngle(calibratedDeg);
    }
  };

  const handleRotate = (delta) => {
    const newAngle = (northAngle + delta + 360) % 360;
    setNorthAngle(newAngle);
  };

  // Direct mouse & touch angle calculation relative to compass center
  const calculateAngleFromPointer = (clientX, clientY) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rad = Math.atan2(clientY - centerY, clientX - centerX);
    let deg = Math.round(rad * (180 / Math.PI)) + 90;
    if (deg < 0) deg += 360;
    deg = deg % 360;
    setNorthAngle(deg);
  };

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    calculateAngleFromPointer(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    calculateAngleFromPointer(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      isDraggingRef.current = true;
      calculateAngleFromPointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    if (e.touches && e.touches.length > 0) {
      calculateAngleFromPointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="bg-slate-50 border border-slate-200 p-3 sm:p-4 rounded-2xl space-y-3">
      {/* ALPHABETICAL STATE SELECTION DIRECTLY IN STEP 3 NORTH STAGE */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider block">
              1. Select Property State (Magnetic Calibration):
            </span>
            <span className="text-[11px] text-slate-500 block">
              State: <strong className="text-slate-900">{selectedLoc.state}</strong> • Declination Offset: <strong className="text-amber-800 font-mono">{selectedLoc.declination}°</strong>
            </span>
          </div>
        </div>

        {/* Dropdown with Alphabetical Indian States ONLY */}
        <select
          value={selectedStateName}
          onChange={(e) => handleStateChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-extrabold bg-slate-50 text-slate-900 focus:border-amber-500 focus:outline-none shadow-2xs cursor-pointer"
        >
          {ALL_INDIAN_STATES.map((st) => (
            <option key={st.state} value={st.state}>
              {st.state}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Single Line Degree Badge */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold shadow-2xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              2. Align North Direction:
            </span>
            <span className="text-xs font-black text-slate-900 font-mono">
              🧭 {northAngle}° North Direction
            </span>
          </div>
        </div>

        {/* Step-by-Step Rotation Quick Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleRotate(-15)}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1 shadow-2xs active:scale-95"
            title="Rotate 15° Counter-Clockwise"
          >
            <RotateCcw className="w-3 h-3 text-amber-600" /> -15°
          </button>

          <button
            type="button"
            onClick={() => handleRotate(-5)}
            className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-2xs active:scale-95"
          >
            -5°
          </button>

          <button
            type="button"
            onClick={() => setNorthAngle(0)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-extrabold shadow-2xs"
          >
            Reset 0°
          </button>

          <button
            type="button"
            onClick={() => handleRotate(5)}
            className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-2xs active:scale-95"
          >
            +5°
          </button>

          <button
            type="button"
            onClick={() => handleRotate(15)}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1 shadow-2xs active:scale-95"
            title="Rotate 15° Clockwise"
          >
            +15° <RotateCw className="w-3 h-3 text-amber-600" />
          </button>
        </div>
      </div>

      {/* Direct Touch & Mouse Rotatable Compass Wheel */}
      <div className="flex flex-col items-center justify-center pt-1 space-y-1 select-none">
        <div
          ref={wheelRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-44 h-44 rounded-full border-4 border-slate-800 bg-white shadow-md cursor-grab active:cursor-grabbing flex items-center justify-center touch-none select-none"
        >
          {/* Rotating Wheel Background */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center transition-transform duration-75 select-none pointer-events-none"
            style={{ transform: `rotate(${northAngle}deg)` }}
          >
            {/* Red North Needle Pointer */}
            <div className="absolute top-1 w-1.5 h-12 bg-red-600 rounded-t-full shadow-xs flex items-center justify-center">
              <span className="text-[10px] font-black text-white font-mono -mt-6">N</span>
            </div>

            {/* South Pointer */}
            <div className="absolute bottom-1 w-1.5 h-12 bg-slate-400 rounded-b-full">
              <span className="text-[9px] font-bold text-slate-600 font-mono translate-y-12 block">S</span>
            </div>

            {/* East / West */}
            <span className="absolute right-2 text-[9px] font-bold text-slate-600 font-mono">E</span>
            <span className="absolute left-2 text-[9px] font-bold text-slate-600 font-mono">W</span>

            {/* Compass Dial Ticks */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-2 bg-slate-300"
                style={{ transform: `rotate(${i * 30}deg) translateY(-80px)` }}
              />
            ))}
          </div>

          {/* Inner Stationary Center Hub */}
          <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-white shadow-md flex items-center justify-center text-white pointer-events-none z-10">
            <Compass className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <p className="text-[10px] text-slate-500 font-medium italic text-center">
          💡 Drag or touch the compass wheel directly to align North
        </p>
      </div>
    </div>
  );
}
