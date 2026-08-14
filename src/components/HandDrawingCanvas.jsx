import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Eraser, RotateCcw } from 'lucide-react';

export default function HandDrawingCanvas({ onSaveDrawing, onCancel }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const activeToolRef = useRef('pencil');
  
  const [activeTool, setActiveTool] = useState('pencil'); // 'pencil' | 'eraser'

  // Sync activeTool state to ref for native event listeners
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  // Set 1:1 full canvas pixel size on mount & resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const setupCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.max(380, Math.floor(rect.width * 0.75));

      // Save content before resize if any
      const ctx = canvas.getContext('2d');
      let tempImage = null;
      if (canvas.width > 0 && canvas.height > 0) {
        try {
          tempImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch (e) {}
      }

      canvas.width = width;
      canvas.height = height;

      // Draw fresh white background & grid guide
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      if (tempImage) {
        ctx.putImageData(tempImage, 0, 0);
      } else {
        // Draw grid guide
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }
    };

    setupCanvasSize();

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => setupCanvasSize());
      ro.observe(container);
    }

    return () => {
      if (ro) ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Exact 1:1 mouse/touch coordinate mapping
    const getCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    // Touch event handlers for 100% smooth edge-to-edge drawing
    const handleTouchStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDrawingRef.current = true;

      const coords = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.strokeStyle = activeToolRef.current === 'eraser' ? '#ffffff' : '#0f172a';
      ctx.lineWidth = activeToolRef.current === 'eraser' ? 26 : 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    const handleTouchMove = (e) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      const coords = getCoords(e);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDrawingRef.current = false;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const getCanvasCoords = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    isDrawingRef.current = true;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : '#0f172a';
    ctx.lineWidth = activeTool === 'eraser' ? 26 : 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return;
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Light grid guide
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const handleNext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSaveDrawing(dataUrl);
  };

  return (
    <div className="clean-card p-3 sm:p-5 space-y-4 bg-white max-w-4xl mx-auto shadow-md rounded-2xl border border-slate-200 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm font-heading flex items-center gap-1.5">
            <Pencil className="w-4 h-4 text-amber-600" /> Draw Your Floor Plan
          </h3>
          <p className="text-xs text-slate-500">Draw house walls across full canvas edge-to-edge</p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1"
        >
          Cancel
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTool('pencil')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTool === 'pencil' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" /> Pen
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('eraser')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTool === 'eraser' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" /> Eraser
          </button>
        </div>

        <button
          type="button"
          onClick={handleClearCanvas}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-red-600 text-xs font-bold flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Full Width Dynamic Canvas Box with 1:1 Pixel Mapping */}
      <div
        ref={containerRef}
        className="w-full border-2 border-slate-300 rounded-xl overflow-hidden bg-white shadow-inner flex items-center justify-center select-none"
        style={{ touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="block w-full h-auto cursor-crosshair bg-white select-none"
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Next Step Button */}
      <div className="flex justify-end pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          Next: Mark Room Boxes →
        </button>
      </div>
    </div>
  );
}
