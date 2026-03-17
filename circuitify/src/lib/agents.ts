import { Appliance, CarbonSlot, AgentLog } from "./types";

export function runLoadMonitor(appliances: Appliance[]): AgentLog & { payload: string } {
  const flexCount = appliances.filter((a) => a.flexible).length;
  const totalKw = appliances.reduce((s, a) => s + a.powerKw, 0).toFixed(1);
  const summary = `Detected ${appliances.length} appliances (${flexCount} flexible). Total demand: ${totalKw} kW.`;

  return {
    agent: "Load Monitor Agent",
    icon: "📊",
    message: summary,
    status: "done",
    payload: JSON.stringify(
      appliances.map((a) => ({
        device: a.name,
        power_kw: a.powerKw,
        duration_hr: a.durationHr,
        deadline: a.deadline,
        flexible: a.flexible,
      }))
    ),
  };
}

export function runGridCarbonAgent(timeline: CarbonSlot[]): AgentLog & { payload: string } {
  const sorted = [...timeline].sort((a, b) => a.intensity - b.intensity);
  const cleanest = sorted[0];
  const dirtiest = sorted[sorted.length - 1];

  const summary = `Cleanest window: ${cleanest.hour} (${cleanest.intensity} gCO2/kWh). Peak carbon: ${dirtiest.hour} (${dirtiest.intensity} gCO2/kWh).`;

  return {
    agent: "Grid Carbon Agent",
    icon: "🌱",
    message: summary,
    status: "done",
    payload: JSON.stringify(
      timeline.map((s) => ({ hour: s.hour, carbon_intensity: s.intensity }))
    ),
  };
}

export function getAgentLogSteps(): AgentLog[] {
  return [
    { agent: "Load Monitor Agent", icon: "📊", message: "Reading appliance loads...", status: "pending" },
    { agent: "Grid Carbon Agent", icon: "🌱", message: "Checking grid carbon intensity...", status: "pending" },
    { agent: "Optimization Agent", icon: "⚡", message: "Comparing feasible schedules...", status: "pending" },
    { agent: "Explanation Agent", icon: "💬", message: "Generating user-friendly explanation...", status: "pending" },
  ];
}
