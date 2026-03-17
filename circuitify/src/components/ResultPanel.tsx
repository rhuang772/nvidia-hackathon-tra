"use client";

import { ScheduleEntry } from "@/lib/types";

interface Props {
  schedule: ScheduleEntry[];
  explanation: string;
}

export default function ResultPanel({ schedule, explanation }: Props) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-brand-400 inline-block" />
        Optimized Schedule
      </h2>

      <div className="bg-gray-800/60 backdrop-blur border border-gray-700/50 rounded-2xl p-5 space-y-4">
        {/* Schedule table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left pb-2">Appliance</th>
                <th className="text-left pb-2">Start</th>
                <th className="text-right pb-2">Power</th>
                <th className="text-right pb-2">Duration</th>
                <th className="text-right pb-2">Emissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/40">
              {schedule.map((entry) => (
                <tr key={entry.device} className="text-gray-300">
                  <td className="py-2.5 font-medium text-white">{entry.device}</td>
                  <td className="py-2.5">
                    <span className="bg-brand-500/15 text-brand-300 text-xs font-mono px-2 py-0.5 rounded-md">
                      {entry.start_time}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-gray-400">{entry.powerKw} kW</td>
                  <td className="py-2.5 text-right text-gray-400">{entry.durationHr} hr</td>
                  <td className="py-2.5 text-right font-mono text-gray-400">
                    {entry.emissions} g
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Explanation */}
        <div className="mt-4 border-t border-gray-700/40 pt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            AI Explanation
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">{explanation}</p>
        </div>
      </div>
    </section>
  );
}
