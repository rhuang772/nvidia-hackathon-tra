"use client";

import { CarbonSlot } from "@/lib/types";

interface Props {
  timeline: CarbonSlot[];
}

export default function CarbonTimeline({ timeline }: Props) {
  const maxIntensity = Math.max(...timeline.map((s) => s.intensity));

  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-yellow-400 inline-block" />
        Grid Carbon Intensity
      </h2>
      <div className="bg-gray-800/60 backdrop-blur border border-gray-700/50 rounded-2xl p-5">
        <div className="flex items-end gap-2 h-36">
          {timeline.map((slot) => {
            const pct = (slot.intensity / maxIntensity) * 100;
            const isClean = slot.intensity <= 200;
            return (
              <div key={slot.hour} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-gray-400 font-medium">
                  {slot.intensity}
                </span>
                <div
                  className={`w-full rounded-lg transition-all ${
                    isClean
                      ? "bg-gradient-to-t from-brand-500 to-brand-400"
                      : "bg-gradient-to-t from-orange-500/80 to-yellow-500/80"
                  }`}
                  style={{ height: `${pct}%` }}
                />
                <span className="text-[10px] text-gray-500">{slot.hour}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-orange-500 inline-block" /> High carbon
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-brand-400 inline-block" /> Low carbon
          </span>
        </div>
      </div>
    </section>
  );
}
