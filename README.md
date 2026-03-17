# Circuitify ⚡

**A Nemotron-powered multi-agent home energy optimizer**

Circuitify reimagines the household breaker box as an AI-native energy operating system. It analyzes grid carbon intensity, reasons over appliance deadlines and flexibility, and generates an optimized low-emission schedule — automatically.

## The Problem

Household electricity isn't equally clean throughout the day. During evening peak hours (6–9 PM), grids rely on gas peaker plants pushing carbon intensity to ~490 gCO₂/kWh. By midnight it drops to ~160 gCO₂/kWh. Most people run appliances during peak hours, missing an easy opportunity to cut emissions without changing their lifestyle.

## The Solution

Circuitify shifts flexible appliances (EV charger, dishwasher, washer, dryer) to the cleanest time windows while respecting user deadlines. Tell it "my EV needs to be charged by 7 AM" and it figures out the optimal start time.

## Multi-Agent Pipeline

When you click **Optimize My Home**, four AI agents run in sequence:

| Agent | Role |
|-------|------|
| **Load Monitor** | Scans appliance list, identifies flexible loads, summarizes demand |
| **Grid Carbon** | Analyzes carbon intensity timeline, finds cleanest/dirtiest windows |
| **Optimization** | Calls NVIDIA Nemotron to schedule appliances minimizing emissions |
| **Explanation** | Generates plain-English reasoning for every scheduling decision |

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API route (serverless)
- **AI**: NVIDIA Nemotron 340B via NIM API
- **Data**: Mock appliance profiles + simulated grid carbon intensity

## Getting Started

### Prerequisites

- Node.js 18+
- An NVIDIA NIM API key ([get one here](https://build.nvidia.com/))

### Setup

```bash
# Clone and install
cd circuitify
npm install

# Add your API key
# Edit .env.local and set:
# NVIDIA_API_KEY=nvapi-your-key-here

# Run dev server
npm run dev
```

Open **http://localhost:3000**.

> If no API key is configured, the app falls back to a hardcoded optimized schedule so the demo always works.

## Features

### Core
- **Appliance monitoring** — cards showing power draw, duration, deadline, flexibility
- **Grid carbon timeline** — color-coded bar chart of hourly carbon intensity
- **Nemotron optimization** — AI-generated schedule minimizing emissions within constraints
- **Before vs After comparison** — baseline (all at 6 PM) vs optimized, with emissions math

### Bonus
- **Home type presets** — EV Owner, Family Home, Student Apartment, Eco Mode
- **Priority mode toggle** — Lowest Carbon vs Fastest Completion
- **AI decision trace** — animated agent pipeline showing each step
- **Impact summary** — kg saved, % reduction, peak hours avoided, deadlines met

## Project Structure

```
circuitify/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main dashboard
│   │   ├── layout.tsx                  # Root layout
│   │   └── api/optimize/route.ts       # Backend: 4-agent pipeline
│   ├── components/
│   │   ├── AppliancePanel.tsx          # Appliance cards
│   │   ├── CarbonTimeline.tsx          # Carbon intensity bar chart
│   │   ├── Controls.tsx                # Preset selector + priority toggle
│   │   ├── AgentLogs.tsx               # Animated decision trace
│   │   ├── ResultPanel.tsx             # Schedule table + explanation
│   │   └── ImpactSummary.tsx           # Before/after stats
│   └── lib/
│       ├── types.ts                    # TypeScript interfaces
│       ├── data.ts                     # Mock data, presets, emissions calc
│       ├── agents.ts                   # Load Monitor + Grid Carbon agents
│       └── nemotron.ts                 # NVIDIA Nemotron API integration
├── .env.local                          # API key (not committed)
├── package.json
└── tailwind.config.ts
```

## How the Optimization Works

1. Load Monitor and Grid Carbon agents prepare structured data
2. Data is sent to Nemotron 340B with a prompt that instructs it to:
   - Minimize total emissions (power × duration × carbon intensity)
   - Respect all appliance deadlines
   - Prefer lowest-carbon hours
   - Return strict JSON with schedule + explanation
3. The response is enriched with per-appliance emissions calculations
4. Results are displayed with a before/after comparison

If the API call fails, a hardcoded fallback schedule ensures the demo never breaks.

## Team

Built for the NVIDIA Hackathon.
