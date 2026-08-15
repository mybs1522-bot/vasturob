import React, { useRef, useState, useEffect } from 'react';
import { VASTU_ZONES_16, ROOM_TYPES } from '../utils/vastuEngine';
import NorthCompassControls from './NorthCompassControls';
import { convertPdfFileToDataUrl } from '../utils/pdfHelper';
import { useLanguage } from '@/lib/i18n';
import {
  ZoomIn, ZoomOut, Upload, Eye, EyeOff, Compass, Plus, Trash2, Layers,
  Flame, BedDouble, Droplets, Sofa, DoorOpen, Sparkles, Utensils, TrendingUp, Waves, Box, Sun
} from 'lucide-react';

export function getRoomIcon(typeId, className = "w-4 h-4") {
  switch (typeId) {
    case 'kitchen':
      return <Flame className={`${className} text-red-500`} />;
    case 'master_bedroom':
    case 'kids_bedroom':
      return <BedDouble className={`${className} text-amber-500`} />;
    case 'toilet':
      return <Droplets className={`${className} text-purple-500`} />;
    case 'living_room':
      return <Sofa className={`${className} text-emerald-500`} />;
    case 'entrance':
      return <DoorOpen className={`${className} text-amber-600`} />;
    case 'puja_room':
      return <Sparkles className={`${className} text-blue-500`} />;
    case 'dining':
      return <Utensils className={`${className} text-lime-500`} />;
    case 'staircase':
      return <TrendingUp className={`${className} text-slate-600`} />;
    case 'underground_tank':
    case 'overhead_tank':
      return <Waves className={`${className} text-cyan-500`} />;
    case 'store_room':
      return <Box className={`${className} text-amber-700`} />;
    case 'balcony':
      return <Sun className={`${className} text-yellow-500`} />;
    default:
      return <Compass className={`${className} text-amber-500`} />;
  }
}

export default function FloorPlanCanvas({
  imageUrl,
  svgContent,
  northAngle,
  setNorthAngle,
  placedRooms,
  setPlacedRooms,
  selectedRoomType,
  centerPos,
  setCenterPos,
  onImageUpload,
  isCustomGridMode,
  showCompassBelow = true,
  isScanning = false,
}) {
  const { lang, t } = useLanguage();
  const isHi = lang === 'hi';

  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [showZonesOverlay, setShowZonesOverlay] = useState(true);
  const [draggingRoomId, setDraggingRoomId] = useState(null);
  const [draggingCenter, setDraggingCenter] = useState(false);

  // Dynamic Opacity during rotation state
  const [isRotating, setIsRotating] = useState(false);
  const rotationTimeoutRef = useRef(null);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  const [mobileScale, setMobileScale] = useState(1);

  // Detect active rotation to increase opacity & font visibility while turning
  useEffect(() => {
    setIsRotating(true);
    if (rotationTimeoutRef.current) clearTimeout(rotationTimeoutRef.current);
    rotationTimeoutRef.current = setTimeout(() => {
      setIsRotating(false);
    }, 700);

    return () => {
      if (rotationTimeoutRef.current) clearTimeout(rotationTimeoutRef.current);
    };
  }, [northAngle]);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth - 24;
        if (availableWidth > 0 && availableWidth < CANVAS_WIDTH) {
          setMobileScale(availableWidth / CANVAS_WIDTH);
          return;
        }
      }
      const winW = window.innerWidth - 48;
      if (winW < CANVAS_WIDTH) {
        setMobileScale(Math.max(0.3, winW / CANVAS_WIDTH));
      } else {
        setMobileScale(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => updateScale());
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateScale);
      if (ro) ro.disconnect();
    };
  }, []);

  const totalScale = Math.max(0.1, mobileScale * zoom);
  const scaledWidth = CANVAS_WIDTH * totalScale;
  const scaledHeight = CANVAS_HEIGHT * totalScale;

  const getCanvasCoords = (e) => {
    if (!wrapperRef.current) return { x: 400, y: 300 };
    const rect = wrapperRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const clickX = (clientX - rect.left) / totalScale;
    const clickY = (clientY - rect.top) / totalScale;

    return {
      x: Math.min(Math.max(40, Math.round(clickX)), CANVAS_WIDTH - 40),
      y: Math.min(Math.max(40, Math.round(clickY)), CANVAS_HEIGHT - 40),
    };
  };

  const handleStartDragPin = (e, roomId) => {
    e.stopPropagation();
    setDraggingRoomId(roomId);
  };

  const handleStartDragCenter = (e) => {
    e.stopPropagation();
    setDraggingCenter(true);
  };

  const handleMove = (e) => {
    if (!draggingRoomId && !draggingCenter) return;
    const coords = getCanvasCoords(e);
    if (draggingRoomId) {
      setPlacedRooms((prev) =>
        prev.map((r) => (r.id === draggingRoomId ? { ...r, x: coords.x, y: coords.y } : r))
      );
    } else if (draggingCenter) {
      setCenterPos({ x: coords.x, y: coords.y });
    }
  };

  const handleEndDrag = () => {
    setDraggingRoomId(null);
    setDraggingCenter(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
      try {
        const dataUrl = await convertPdfFileToDataUrl(file);
        onImageUpload(dataUrl);
      } catch (err) {
        alert(err.message || 'Failed to read PDF floor plan');
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="clean-card p-3 sm:p-4 space-y-3 bg-white">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        {!isCustomGridMode ? (
          <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-full font-semibold text-[10px] flex items-center gap-1 shadow-2xs">
            <Upload className="w-3 h-3 text-amber-400" /> {t('upload_new_plan')}
            <input type="file" accept="image/*,.svg,.pdf,application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div />
        )}

        {/* View toggles */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowZonesOverlay(!showZonesOverlay)}
            className={`p-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              showZonesOverlay ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
            }`}
            title={t('toggle_zones')}
          >
            {showZonesOverlay ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-0.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
              className="p-1 text-slate-600 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[9px] font-mono font-bold text-slate-700">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              className="p-1 text-slate-600 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Viewport Canvas Box */}
      <div
        ref={containerRef}
        className="relative overflow-hidden border border-slate-200 rounded-xl bg-white flex items-center justify-center p-2 min-h-[300px] touch-none select-none"
      >
        <div
          ref={wrapperRef}
          onMouseMove={handleMove}
          onMouseUp={handleEndDrag}
          onMouseLeave={handleEndDrag}
          onTouchMove={handleMove}
          onTouchEnd={handleEndDrag}
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
          }}
          className="relative bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden flex-shrink-0"
        >
          {/* Internal 800x600 canvas coordinate space */}
          <div
            style={{
              width: `${CANVAS_WIDTH}px`,
              height: `${CANVAS_HEIGHT}px`,
              transform: `scale(${totalScale})`,
              transformOrigin: 'top left',
            }}
            className="absolute top-0 left-0"
          >
            {/* Background Blueprint Image or SVG */}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Floor Plan"
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            ) : svgContent ? (
              <div
                dangerouslySetInnerHTML={{ __html: svgContent }}
                className="w-full h-full pointer-events-none select-none"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg">
                <span className="text-xs text-slate-400 font-medium">
                  {isHi ? 'घर का नक्शा अपलोड करें' : 'Upload floor plan blueprint'}
                </span>
              </div>
            )}

            {/* 16 MahaVastu Zones Overlay */}
            {showZonesOverlay && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none select-none">
                {/* Central Brahmasthan circle */}
                <circle
                  cx={centerPos.x}
                  cy={centerPos.y}
                  r="60"
                  fill="#fef3c7"
                  fillOpacity={isRotating ? '0.5' : '0.2'}
                  stroke="#d97706"
                  strokeDasharray="4,4"
                  strokeWidth={isRotating ? '2' : '1.5'}
                />

                {VASTU_ZONES_16.map((zone) => {
                  const rayAngle = (zone.minDeg + northAngle - 90) * (Math.PI / 180);
                  const rayLength = 450;
                  const rx = centerPos.x + rayLength * Math.cos(rayAngle);
                  const ry = centerPos.y + rayLength * Math.sin(rayAngle);

                  const midAngle = (zone.degree + northAngle - 90) * (Math.PI / 180);
                  const labelRadius = 235;
                  const lx = centerPos.x + labelRadius * Math.cos(midAngle);
                  const ly = centerPos.y + labelRadius * Math.sin(midAngle);

                  return (
                    <g key={zone.id}>
                      <line
                        x1={centerPos.x}
                        y1={centerPos.y}
                        x2={rx}
                        y2={ry}
                        stroke="#94a3b8"
                        strokeWidth={isRotating ? '1.5' : '1'}
                        strokeDasharray="4,4"
                      />
                      <g transform={`translate(${lx}, ${ly})`}>
                        <rect
                          x="-24"
                          y="-11"
                          width="48"
                          height="22"
                          rx="6"
                          fill="#ffffff"
                          stroke={zone.color}
                          strokeWidth={isRotating ? '2.5' : '1.5'}
                          className="shadow-sm"
                        />
                        <text
                          x="0"
                          y="5"
                          fill="#0f172a"
                          fontSize={isRotating ? '13' : '11'}
                          fontWeight="900"
                          fontFamily="sans-serif"
                          textAnchor="middle"
                        >
                          {zone.id}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* BIG ROTATING NORTH "N" POINTER */}
                {(() => {
                  const northRad = (northAngle - 90) * (Math.PI / 180);
                  const nLen = 270;
                  const nx = centerPos.x + nLen * Math.cos(northRad);
                  const ny = centerPos.y + nLen * Math.sin(northRad);
                  return (
                    <g key="big-north-pointer">
                      <line
                        x1={centerPos.x}
                        y1={centerPos.y}
                        x2={nx}
                        y2={ny}
                        stroke="#dc2626"
                        strokeWidth={isRotating ? '4' : '3'}
                      />
                      <g transform={`translate(${nx}, ${ny})`}>
                        <circle r="18" fill="#dc2626" stroke="#ffffff" strokeWidth="2.5" className="shadow-md" />
                        <text
                          x="0"
                          y="6.5"
                          fill="#ffffff"
                          fontSize="20"
                          fontWeight="900"
                          fontFamily="sans-serif"
                          textAnchor="middle"
                        >
                          N
                        </text>
                      </g>
                    </g>
                  );
                })()}
              </svg>
            )}

            {/* Draggable House Center */}
            <div
              onMouseDown={handleStartDragCenter}
              onTouchStart={handleStartDragCenter}
              className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
              style={{ left: `${centerPos.x}px`, top: `${centerPos.y}px` }}
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-[10px]">
                <Compass className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            {/* Placed Room Badges */}
            {placedRooms.map((room) => {
              const matchedRoom = ROOM_TYPES.find(r => r.id === room.typeId);
              const displayName = isHi ? (matchedRoom?.name_hi || room.name) : room.name;

              return (
                <div
                  key={room.id}
                  onMouseDown={(e) => handleStartDragPin(e, room.id)}
                  onTouchStart={(e) => handleStartDragPin(e, room.id)}
                  className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing group select-none"
                  style={{
                    left: `${room.x}px`,
                    top: `${room.y}px`,
                  }}
                >
                  <div className="flex flex-col items-center">
                    {/* Compact Sleek Room Pill Badge */}
                    <div className="px-3 py-1.5 rounded-full bg-slate-950/95 text-white border-2 border-amber-400/90 shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 whitespace-nowrap">
                      {getRoomIcon(room.typeId, "w-3.5 h-3.5 flex-shrink-0 text-amber-400")}
                      <span className="text-[11px] sm:text-xs font-black tracking-tight text-white">
                        {displayName}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlacedRooms((prev) => prev.filter((r) => r.id !== room.id));
                        }}
                        className="w-4 h-4 rounded-full bg-slate-800 hover:bg-red-600 text-white font-black text-[10px] flex items-center justify-center transition-colors ml-0.5 cursor-pointer"
                        title="Delete room"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Anchor Target Pin Dot */}
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-slate-950 shadow-xs -mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Set North Controls directly below canvas */}
      {showCompassBelow && setNorthAngle && (
        <div className="pt-2 border-t border-slate-100">
          <NorthCompassControls northAngle={northAngle} setNorthAngle={setNorthAngle} />
        </div>
      )}
    </div>
  );
}
