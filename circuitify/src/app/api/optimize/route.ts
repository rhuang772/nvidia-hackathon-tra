import { NextRequest, NextResponse } from "next/server";
import { Appliance, CarbonSlot, PriorityMode, ScheduleEntry } from "@/lib/types";
import { runLoadMonitor, runGridCarbonAgent } from "@/lib/agents";
import { callNemotron } from "@/lib/nemotron";
import { computeEmissions, parseHour, getFallbackSchedule } from "@/lib/data";

interface RequestBody {
  appliances: Appliance[];
  carbon_timeline: CarbonSlot[];
  mode: PriorityMode;
}

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const { appliances, carbon_timeline, mode } = body;
  const apiKey = process.env.NVIDIA_API_KEY ?? "";

  // ── Agent 1: Load Monitor ──
  const loadResult = runLoadMonitor(appliances);

  // ── Agent 2: Grid Carbon ──
  const gridResult = runGridCarbonAgent(carbon_timeline);

  // ── Agent 3: Optimization (Nemotron) ──
  let nemotronResult: { optimized_schedule: { device: string; start_time: string }[]; explanation: string };

  try {
    if (!apiKey || apiKey === "your-nvidia-api-key-here") {
      throw new Error("No API key configured");
    }
    nemotronResult = await callNemotron(loadResult.payload, gridResult.payload, mode, apiKey);
  } catch (err) {
    console.warn("Nemotron call failed, using fallback:", (err as Error).message);
    nemotronResult = getFallbackSchedule(appliances);
  }

  // ── Enrich schedule with emissions ──
  const optimized_schedule: ScheduleEntry[] = nemotronResult.optimized_schedule.map((entry) => {
    const appliance = appliances.find((a) => a.name === entry.device);
    const powerKw = appliance?.powerKw ?? 1;
    const durationHr = appliance?.durationHr ?? 1;
    const startHour = parseHour(entry.start_time);
    return {
      device: entry.device,
      start_time: entry.start_time,
      powerKw,
      durationHr,
      emissions: computeEmissions(powerKw, durationHr, startHour),
    };
  });

  // ── Agent 4: Explanation (already from Nemotron) ──

  return NextResponse.json({
    optimized_schedule,
    explanation: nemotronResult.explanation,
    agent_logs: [
      { ...loadResult, payload: undefined },
      { ...gridResult, payload: undefined },
      { agent: "Optimization Agent", icon: "⚡", message: `Scheduled ${optimized_schedule.length} appliances using Nemotron (${mode} mode).`, status: "done" },
      { agent: "Explanation Agent", icon: "💬", message: "Generated recommendation summary.", status: "done" },
    ],
  });
}
