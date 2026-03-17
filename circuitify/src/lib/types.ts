export interface Appliance {
  id: string;
  name: string;
  icon: string;
  powerKw: number;
  durationHr: number;
  deadline: string;       // "HH:00" format
  flexible: boolean;
}

export interface CarbonSlot {
  hour: string;           // "HH:00"
  intensity: number;      // gCO2/kWh
}

export interface ScheduleEntry {
  device: string;
  start_time: string;
  powerKw: number;
  durationHr: number;
  emissions: number;
}

export interface OptimizationResult {
  optimized_schedule: ScheduleEntry[];
  explanation: string;
}

export interface AgentLog {
  agent: string;
  icon: string;
  message: string;
  status: "pending" | "running" | "done";
}

export type PriorityMode = "lowest_carbon" | "fastest_completion";

export type HomePreset = "ev_owner" | "family_home" | "student_apartment" | "eco_mode";
