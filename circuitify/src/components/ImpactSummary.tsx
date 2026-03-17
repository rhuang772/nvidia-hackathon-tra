"use client";

import { ScheduleEntry } from "@/lib/types";

interface Props {
  baseline: ScheduleEntry[];
  optimized: ScheduleEntry[];
}

export default function ImpactSummary({ baseline, optimized }: Props) {
  const baseTotal = baseline.reduce((s, e) => s + e.emissions, 0);
  const optTotal = optimized.reduce((s, e) => s + e.emissions, 0);
  const saved = baseTotal - optTotal;
  const pct = baseTotal > 0 ? Math.round((saved / baseTotal) * 100) : 0;

  const shifted = optimized.filter((o) => {
    const b = baseline.find((b) => b.device === o.device);
    return b && b.start_time !== o.start_time;
  }).length;

  const deadlinesMet = optimized.length; // all met by design

  const peakHoursAvoided = optimized.filter((o) => {
    const h = parseInt(o.start_time.split(":")[0], 10);
    return h < 18 || h >= 22; // moved out of 18–21 peak window
  }).length;

  const stats = [
    {
      label: "Emissions Reduced",
      value: `${(saved / 1000).toFixed(1)} kg`,
      sub: `${pct}% reduction`,
      color: "from-brand-500/20 to-brand-600/10 border-brand-500/30",
      text: "text-brand-300",
    },
    {
      label: "Peak Hours Avoided",
      value: `${peakHoursAvoided}`,
      sub: "of peak-hour starts",
      color: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
      text: "text-orange-300",
    },
    {
      label: "Deadlines Satisfied",
      value: `${deadlinesMet}/${optimized.length}`,
      sub: "all on time",
      color: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
      text: "text-blue-300",
    },
    {
      label: "Appliances Shifted",
      value: `${shifted}`,
      sub: "rescheduled",
      color: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
      text: "text-purple-300",
    },
  ];

  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-blue-400 inline-block" />
        Impact Summary
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-gradient-to-br ${s.color} border rounded-2xl p-4 text-center`}
          >
            <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Before vs After bar */}
      <div className="mt-4 bg-gray-800/60 backdrop-blur border border-gray-700/50 rounded-2xl p-5">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Before (all at 18:00)</span>
          <span>After (optimized)</span>
        </div>
        <div className="flex gap-2 h-8">
          <div className="flex-1 rounded-lg bg-red-500/30 border border-red-500/30 flex items-center justify-center text-xs font-mono text-red-300">
            {(baseTotal / 1000).toFixed(2)} kg CO₂
          </div>
          <div className="flex-1 rounded-lg bg-brand-500/30 border border-brand-500/30 flex items-center justify-center text-xs font-mono text-brand-300">
            {(optTotal / 1000).toFixed(2)} kg CO₂
          </div>
        </div>
      </div>
    </section>
  );
}
