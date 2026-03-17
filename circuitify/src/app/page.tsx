"use client";

import { useState } from "react";
import { Appliance, AgentLog, HomePreset, PriorityMode, ScheduleEntry } from "@/lib/types";
import { CARBON_TIMELINE, PRESET_APPLIANCES, computeBaseline } from "@/lib/data";
import { getAgentLogSteps } from "@/lib/agents";
import AppliancePanel from "@/components/AppliancePanel";
import CarbonTimeline from "@/components/CarbonTimeline";
import Controls from "@/components/Controls";
import AgentLogs from "@/components/AgentLogs";
import ResultPanel from "@/components/ResultPanel";
import ImpactSummary from "@/components/ImpactSummary";

export default function Home() {
  const [preset, setPreset] = useState<HomePreset>("ev_owner");
  const [mode, setMode] = useState<PriorityMode>("lowest_carbon");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[] | null>(null);
  const [explanation, setExplanation] = useState("");
  const [baseline, setBaseline] = useState<ScheduleEntry[]>([]);

  const appliances: Appliance[] = PRESET_APPLIANCES[preset];

  const handlePresetChange = (p: HomePreset) => {
    setPreset(p);
    setSchedule(null);
    setLogs([]);
  };

  const progressLogs = async (steps: AgentLog[]) => {
    for (let i = 0; i < steps.length; i++) {
      const updated = steps.map((s, j) => ({
        ...s,
        status: (j < i ? "done" : j === i ? "running" : "pending") as AgentLog["status"],
      }));
      setLogs(updated);
      await new Promise((r) => setTimeout(r, 600));
    }
  };

  const handleOptimize = async () => {
    setLoading(true);
    setSchedule(null);
    setExplanation("");

    const steps = getAgentLogSteps();
    const animationPromise = progressLogs(steps);

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appliances,
          carbon_timeline: CARBON_TIMELINE,
          mode,
        }),
      });

      const data = await res.json();
      await animationPromise;

      setLogs(
        data.agent_logs.map((l: AgentLog) => ({ ...l, status: "done" as const }))
      );
      setSchedule(data.optimized_schedule);
      setExplanation(data.explanation);
      setBaseline(computeBaseline(appliances));
    } catch {
      await animationPromise;
      setLogs((prev) =>
        prev.map((l) => ({ ...l, status: "done" as const, message: l.message + " (fallback)" }))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Subtle grid bg */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <header className="text-center mb-2">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-brand-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              Circuitify
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            A Nemotron-powered multi-agent home energy optimizer
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700/50 text-[10px] text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
            Powered by NVIDIA Nemotron
          </div>
        </header>

        {/* Controls */}
        <Controls
          preset={preset}
          onPresetChange={handlePresetChange}
          mode={mode}
          onModeChange={setMode}
        />

        {/* Main grid: Appliances + Carbon */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppliancePanel appliances={appliances} />
          <CarbonTimeline timeline={CARBON_TIMELINE} />
        </div>

        {/* Optimize button */}
        <div className="flex justify-center">
          <button
            onClick={handleOptimize}
            disabled={loading}
            className="group relative px-8 py-3 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-emerald-500 group-hover:from-brand-400 group-hover:to-emerald-400 transition-all" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
            <span className="relative flex items-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Optimizing...
                </>
              ) : (
                <>⚡ Optimize My Home</>
              )}
            </span>
          </button>
        </div>

        {/* Agent Logs */}
        {logs.length > 0 && <AgentLogs logs={logs} />}

        {/* Results */}
        {schedule && (
          <>
            <ResultPanel schedule={schedule} explanation={explanation} />
            <ImpactSummary baseline={baseline} optimized={schedule} />
          </>
        )}
      </div>
    </main>
  );
}
