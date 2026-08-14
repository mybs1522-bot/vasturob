import React from 'react';
import { ROOM_TYPES } from '../utils/vastuEngine';
import { getRoomIcon } from './FloorPlanCanvas';
import { Tag, Trash2, MousePointerClick } from 'lucide-react';

export default function RoomTaggingToolbar({
  selectedRoomType,
  setSelectedRoomType,
  placedRooms,
  onRemoveRoom,
  onClearAll,
}) {
  return (
    <div className="clean-card p-4 space-y-3 bg-white">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-xs font-heading">Add / Position Rooms</h3>
            <p className="text-[11px] text-slate-500">Tap black pills to add boxes onto slate</p>
          </div>
        </div>

        {placedRooms.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg border border-red-200 transition-all font-semibold"
          >
            Clear All ({placedRooms.length})
          </button>
        )}
      </div>

      {/* Uniform Black Pill Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ROOM_TYPES.map((room) => {
          const isSelected = selectedRoomType?.id === room.id;
          const count = placedRooms.filter((r) => r.typeId === room.id).length;

          return (
            <button
              key={room.id}
              type="button"
              onClick={() => setSelectedRoomType(isSelected ? null : room)}
              className={`p-2 rounded-full border text-left flex items-center justify-between gap-1.5 transition-all ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-sm'
                  : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 px-1">
                {getRoomIcon(room.id, "w-3.5 h-3.5 text-white")}
                <span className="text-xs font-bold truncate">{room.name}</span>
              </div>
              {count > 0 && (
                <span className="text-[10px] font-bold bg-white text-slate-900 px-1.5 py-0.5 rounded-full font-mono mr-1">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Placed Room Badges */}
      {placedRooms.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Placed Slate Room Boxes ({placedRooms.length})
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {placedRooms.map((room) => (
              <span
                key={room.id}
                className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-900 text-xs px-2.5 py-1 rounded-full font-bold shadow-2xs"
              >
                {getRoomIcon(room.typeId, "w-3.5 h-3.5")}
                <span>{room.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveRoom(room.id)}
                  className="text-slate-400 hover:text-red-600 font-bold ml-0.5"
                  title="Remove room"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
