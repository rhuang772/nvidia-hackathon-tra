"use client";

import { Appliance } from "@/lib/types";

interface Props {
  appliances: Appliance[];
}

export default function AppliancePanel({ appliances }: Props) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-brand-400 inline-block" />
        Appliance Monitoring
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {appliances.map((a) => (
          <div
            key={a.id}
            className="bg-gray-800/60 backdrop-blur border border-gray-700/50 rounded-2xl p-4 flex items-start gap-3 hover:border-brand-500/40 transition-colors"
          >
            <span className="text-2xl mt-0.5">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm">{a.name}</h3>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    a.flexible
                      ? "bg-brand-500/20 text-brand-300"
                      : "bg-gray-600/40 text-gray-400"
                  }`}
                >
                  {a.flexible ? "Flexible" : "Fixed"}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400">
                <span>{a.powerKw} kW</span>
                <span>{a.durationHr} hr</span>
                <span>Deadline {a.deadline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
