import React, { useRef, useState, useEffect } from 'react';
import { VASTU_ZONES_16, ROOM_TYPES } from '../utils/vastuEngine';
import NorthCompassControls from './NorthCompassControls';
import { convertPdfFileToDataUrl } from '../utils/pdfHelper';
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

  const handleCanvasClick = (e) => {
    if (draggingRoomId || draggingCenter) return;
    if (!selectedRoomType) return;

    const coords = getCanvasCoords(e);
    const newRoomBox = {
      id: `room_${Date.now()}`,
      typeId: selectedRoomType.id,
      name: selectedRoomType.name,
      color: selectedRoomType.color,
      x: coords.x,
      y: coords.y,
    };
    setPlacedRooms((prev) => [...prev, newRoomBox]);
  };

  const handleAddRoomBox = (roomTypeId) => {
    const rType = ROOM_TYPES.find((r) => r.id === roomTypeId) || ROOM_TYPES[0];
    const count = placedRooms.length;
    const spawnPositions = [
      { x: 580, y: 420 },
      { x: 220, y: 430 },
      { x: 400, y: 520 },
      { x: 220, y: 180 },
      { x: 400, y: 300 },
      { x: 580, y: 180 },
    ];
    const pos = spawnPositions[count % spawnPositions.length] || { x: 300 + count * 20, y: 250 + count * 20 };

    const newRoomBox = {
      id: `room_${Date.now()}`,
      typeId: rType.id,
      name: rType.name,
      color: rType.color,
      x: pos.x,
      y: pos.y,
    };
    setPlacedRooms((prev) => [...prev, newRoomBox]);
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

  const blackPillsList = [
    { id: 'kitchen', label: '+ Kitchen' },
    { id: 'master_bedroom', label: '+ Bedroom' },
    { id: 'toilet', label: '+ Washroom' },
    { id: 'living_room', label: '+ Living' },
    { id: 'entrance', label: '+ Main Door' },
    { id: 'puja_room', label: '+ Puja' },
  ];

  return (
    <div className="clean-card p-3 sm:p-4 space-y-3 bg-white">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        {!isCustomGridMode ? (
          <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-full font-semibold text-[10px] flex items-center gap-1 shadow-2xs">
            <Upload className="w-3 h-3 text-amber-400" /> Upload Plan
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
            className={`p-1.5 rounded-full text-xs font-semibold border transition-all ${
              showZonesOverlay ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
            }`}
            title="Toggle 16 Zones Grid"
          >
            {showZonesOverlay ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-0.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
              className="p-1 text-slate-600"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[9px] font-mono font-bold text-slate-700">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              className="p-1 text-slate-600"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Black Pills for Adding Room Boxes */}
      {isCustomGridMode && (
        <div className="space-y-1">
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">
            Tap to Add Room Boxes on Floor Plan:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {blackPillsList.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => handleAddRoomBox(pill.id)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-2 py-1.5 rounded-full text-[9px] sm:text-[9.5px] font-bold tracking-wide flex items-center justify-center shadow-2xs transition-all hover:scale-102 active:scale-95 text-center whitespace-nowrap cursor-pointer"
              >
                <span>{pill.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Viewport Canvas Box */}
      <div
        ref={containerRef}
        className="relative overflow-hidden border border-slate-200 rounded-xl bg-white flex items-center justify-center p-2 min-h-[300px] touch-none select-none"
      >
        <div
          ref={wrapperRef}
          onClick={handleCanvasClick}
          onMouseMove={handleMove}
          onMouseUp={handleEndDrag}
          onTouchMove={handleMove}
          onTouchEnd={handleEndDrag}
          className="relative rounded-xl overflow-hidden shadow-sm bg-white"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
          }}
        >
          <div
            className="absolute top-0 left-0 cursor-crosshair origin-top-left bg-white"
            style={{
              width: `${CANVAS_WIDTH}px`,
              height: `${CANVAS_HEIGHT}px`,
              transform: `scale(${totalScale})`,
              transformOrigin: '0 0',
            }}
          >
            {svgContent ? (
              <div
                className="absolute inset-0 pointer-events-none bg-white [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : imageUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={imageUrl}
                  alt="Uploaded Floor Plan"
                  className={`w-full h-full object-contain pointer-events-none bg-white transition-all duration-500 ${isScanning ? 'opacity-60' : 'opacity-100'}`}
                />
                {isScanning && (
                  <>
                    {/* Scanning laser line animation */}
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_15px_rgba(245,158,11,0.7)]"
                      style={{
                        animation: 'scanLine 2s ease-in-out infinite',
                      }}
                    />
                    {/* Scanning shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-amber-500/5 animate-pulse" />
                    {/* Corner scan markers */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-500 animate-pulse" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500 animate-pulse" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500 animate-pulse" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-500 animate-pulse" />
                    {/* Center scanning text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="px-4 py-2 bg-black/70 rounded-lg backdrop-blur-sm">
                        <span className="text-amber-400 text-xs font-bold tracking-widest uppercase animate-pulse">Scanning...</span>
                      </div>
                    </div>
                    <style>{`
                      @keyframes scanLine {
                        0% { top: 5%; }
                        50% { top: 90%; }
                        100% { top: 5%; }
                      }
                    `}</style>
                  </>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 bg-white">
                <svg className="absolute inset-0 w-full h-full opacity-15" width="100%" height="100%">
                  <defs>
                    <pattern id="slateGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#slateGrid)" />
                </svg>

                {placedRooms.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-2 pointer-events-none">
                    <Layers className="w-10 h-10 text-slate-800 stroke-1" />
                    <h3 className="font-bold text-slate-800 text-sm">Pure White Slate</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Tap black pills above to add <strong>Kitchen, Bedroom, Washroom, Living, Main Door</strong> boxes onto your slate!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 16 Vastu Zones Overlay */}
            {showZonesOverlay && (
              <svg
                className={`absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-500 ${
                  isRotating ? 'opacity-100' : 'opacity-35 hover:opacity-100'
                }`}
                viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
              >
                <circle
                  cx={centerPos.x}
                  cy={centerPos.y}
                  r="65"
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
                          x="-22"
                          y="-11"
                          width="44"
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

            {/* Placed Room Boxes: BIGGER & BOLDER TEXT FOR MOBILE DEVICES */}
            {isCustomGridMode ? (
              placedRooms.map((room) => {
                const boxWidth = room.typeId === 'living_room' ? 150 : 130;
                const boxHeight = room.typeId === 'living_room' ? 95 : 80;

                return (
                  <div
                    key={room.id}
                    onMouseDown={(e) => handleStartDragPin(e, room.id)}
                    onTouchStart={(e) => handleStartDragPin(e, room.id)}
                    className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing group shadow-lg hover:shadow-xl transition-shadow"
                    style={{
                      left: `${room.x}px`,
                      top: `${room.y}px`,
                      width: `${boxWidth}px`,
                      height: `${boxHeight}px`,
                    }}
                  >
                    <div
                      className="w-full h-full rounded-2xl border-3 bg-white p-2.5 flex flex-col justify-between select-none relative shadow-sm"
                      style={{
                        borderColor: '#0f172a',
                      }}
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <div className="flex items-center gap-1.5 truncate">
                          {getRoomIcon(room.typeId, "w-4 h-4 flex-shrink-0")}
                          {/* BIGGER, BOLDER ROOM TEXT FOR EASY READING ON PHONE */}
                          <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
                            {room.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlacedRooms((prev) => prev.filter((r) => r.id !== room.id));
                          }}
                          className="text-slate-400 hover:text-red-600 font-extrabold text-sm px-1"
                          title="Delete box"
                        >
                          &times;
                        </button>
                      </div>

                      <div className="text-[10px] font-bold text-slate-500 text-center font-mono uppercase tracking-wider">
                        Drag Box
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              placedRooms.map((room) => (
                <div
                  key={room.id}
                  onMouseDown={(e) => handleStartDragPin(e, room.id)}
                  onTouchStart={(e) => handleStartDragPin(e, room.id)}
                  className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                  style={{ left: `${room.x}px`, top: `${room.y}px` }}
                >
                  <div className="px-2.5 py-1 rounded-full border-2 text-xs font-black shadow-md bg-white/95 backdrop-blur-xs flex items-center gap-1.5 border-slate-900 text-slate-900">
                    {getRoomIcon(room.typeId, "w-3.5 h-3.5")}
                    <span className="whitespace-nowrap">{room.name}</span>
                  </div>
                </div>
              ))
            )}
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
