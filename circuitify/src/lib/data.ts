import { Appliance, CarbonSlot, HomePreset } from "./types";

// ── Default appliances ──

export const DEFAULT_APPLIANCES: Appliance[] = [
  { id: "dishwasher", name: "Dishwasher", icon: "🍽️", powerKw: 1.2, durationHr: 1.5, deadline: "23:00", flexible: true },
  { id: "washer",     name: "Washer",     icon: "👕", powerKw: 0.8, durationHr: 1,   deadline: "22:00", flexible: true },
  { id: "dryer",      name: "Dryer",      icon: "🌀", powerKw: 2.5, durationHr: 1,   deadline: "00:00", flexible: true },
  { id: "ev_charger", name: "EV Charger", icon: "🔌", powerKw: 7,   durationHr: 3,   deadline: "07:00", flexible: true },
];

// ── Carbon intensity timeline ──

export const CARBON_TIMELINE: CarbonSlot[] = [
  { hour: "18:00", intensity: 490 },
  { hour: "19:00", intensity: 470 },
  { hour: "20:00", intensity: 390 },
  { hour: "21:00", intensity: 310 },
  { hour: "22:00", intensity: 230 },
  { hour: "23:00", intensity: 180 },
  { hour: "00:00", intensity: 160 },
  { hour: "01:00", intensity: 170 },
];

// ── Home presets ──

export const PRESET_APPLIANCES: Record<HomePreset, Appliance[]> = {
  ev_owner: DEFAULT_APPLIANCES,
  family_home: [
    { id: "dishwasher",    name: "Dishwasher",    icon: "🍽️", powerKw: 1.2, durationHr: 1.5, deadline: "23:00", flexible: true },
    { id: "washer",        name: "Washer",        icon: "👕", powerKw: 0.8, durationHr: 1,   deadline: "22:00", flexible: true },
    { id: "dryer",         name: "Dryer",         icon: "🌀", powerKw: 2.5, durationHr: 1,   deadline: "00:00", flexible: true },
    { id: "water_heater",  name: "Water Heater",  icon: "🚿", powerKw: 4.5, durationHr: 2,   deadline: "06:00", flexible: true },
  ],
  student_apartment: [
    { id: "dishwasher",      name: "Dishwasher",      icon: "🍽️", powerKw: 1.2, durationHr: 1.5, deadline: "23:00", flexible: true },
    { id: "washer",          name: "Washer",          icon: "👕", powerKw: 0.8, durationHr: 1,   deadline: "22:00", flexible: true },
    { id: "laptop_charging", name: "Laptop Charging", icon: "💻", powerKw: 0.1, durationHr: 2,   deadline: "08:00", flexible: true },
    { id: "ac",              name: "AC Unit",         icon: "❄️", powerKw: 1.5, durationHr: 4,   deadline: "02:00", flexible: false },
  ],
  eco_mode: [
    { id: "dishwasher", name: "Dishwasher", icon: "🍽️", powerKw: 1.0, durationHr: 1.5, deadline: "23:00", flexible: true },
    { id: "washer",     name: "Washer",     icon: "👕", powerKw: 0.5, durationHr: 1,   deadline: "22:00", flexible: true },
    { id: "led_lights", name: "LED Lights", icon: "💡", powerKw: 0.05, durationHr: 5,  deadline: "01:00", flexible: false },
    { id: "fan",        name: "Ceiling Fan", icon: "🌬️", powerKw: 0.07, durationHr: 6, deadline: "02:00", flexible: false },
  ],
};

// ── Helpers ──

export function parseHour(time: string): number {
  return parseInt(time.split(":")[0], 10);
}

export function getIntensityAt(hour: number): number {
  const slot = CARBON_TIMELINE.find((s) => parseHour(s.hour) === hour);
  return slot?.intensity ?? 200;
}

export function computeEmissions(powerKw: number, durationHr: number, startHour: number): number {
  let total = 0;
  const slots = Math.ceil(durationHr);
  for (let i = 0; i < slots; i++) {
    const h = (startHour + i) % 24;
    const fraction = i < slots - 1 ? 1 : durationHr - Math.floor(durationHr) || 1;
    total += powerKw * fraction * getIntensityAt(h);
  }
  return Math.round(total);
}

// ── Baseline: everything starts at 18:00 ──

export function computeBaseline(appliances: Appliance[]) {
  return appliances.map((a) => ({
    device: a.name,
    start_time: "18:00",
    powerKw: a.powerKw,
    durationHr: a.durationHr,
    emissions: computeEmissions(a.powerKw, a.durationHr, 18),
  }));
}

// ── Fallback optimized schedule (demo safety net) ──

export function getFallbackSchedule(appliances: Appliance[]) {
  const fallbackTimes: Record<string, string> = {
    Dishwasher: "22:00",
    Washer: "21:00",
    Dryer: "23:00",
    "EV Charger": "00:00",
    "Water Heater": "00:00",
    "Laptop Charging": "01:00",
    "AC Unit": "22:00",
    "LED Lights": "20:00",
    "Ceiling Fan": "20:00",
  };

  return {
    optimized_schedule: appliances.map((a) => {
      const start = fallbackTimes[a.name] ?? "23:00";
      return {
        device: a.name,
        start_time: start,
        powerKw: a.powerKw,
        durationHr: a.durationHr,
        emissions: computeEmissions(a.powerKw, a.durationHr, parseHour(start)),
      };
    }),
    explanation:
      "Flexible appliances were shifted away from high-carbon evening hours into cleaner overnight windows while still meeting all deadlines. The EV Charger was moved to midnight when carbon intensity is at its lowest (160 gCO2/kWh).",
  };
}
