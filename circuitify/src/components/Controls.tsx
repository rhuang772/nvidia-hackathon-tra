"use client";

import { HomePreset, PriorityMode } from "@/lib/types";

interface Props {
  preset: HomePreset;
  onPresetChange: (p: HomePreset) => void;
  mode: PriorityMode;
  onModeChange: (m: PriorityMode) => void;
}

const PRESETS: { value: HomePreset; label: string; icon: string }[] = [
  { value: "ev_owner", label: "EV Owner", icon: "🔌" },
  { value: "family_home", label: "Family Home", icon: "🏠" },
  { value: "student_apartment", label: "Student Apt", icon: "🎓" },
  { value: "eco_mode", label: "Eco Mode", icon: "🌿" },
];

export default function Controls({ preset, onPresetChange, mode, onModeChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Home preset */}
      <div className="flex-1 bg-gray-800/60 backdrop-blur border border-gray-700/50 rounded-2xl p-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
          Home Type
        </label>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => onPresetChange(p.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                preset === p.value
                  ? "bg-brand-500/20 text-brand-300 border border-brand-500/40"
                  : "bg-gray-700/40 text-gray-400 border border-transparent hover:border-gray-600"
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority mode */}
      <div className="sm:w-72 bg-gray-800/60 backdrop-blur border border-gray-700/50 rounded-2xl p-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
          Priority
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onModeChange("lowest_carbon")}
            className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              mode === "lowest_carbon"
                ? "bg-brand-500/20 text-brand-300 border border-brand-500/40"
                : "bg-gray-700/40 text-gray-400 border border-transparent hover:border-gray-600"
            }`}
          >
            🌱 Lowest Carbon
          </button>
          <button
            onClick={() => onModeChange("fastest_completion")}
            className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              mode === "fastest_completion"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                : "bg-gray-700/40 text-gray-400 border border-transparent hover:border-gray-600"
            }`}
          >
            ⚡ Fastest
          </button>
        </div>
      </div>
    </div>
  );
}
