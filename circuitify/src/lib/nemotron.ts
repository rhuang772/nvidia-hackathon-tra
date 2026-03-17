import { PriorityMode } from "./types";

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "nvidia/nvidia-nemotron-nano-9b-v2";

function buildSystemPrompt(mode: PriorityMode): string {
  const modeInstruction =
    mode === "lowest_carbon"
      ? "Your TOP priority is minimizing total carbon emissions. Shift every flexible appliance to the lowest-carbon hours possible while still meeting deadlines."
      : "Your TOP priority is completing all appliances as soon as possible. Start appliances at the earliest feasible time, only shifting to lower-carbon windows when it doesn't delay completion.";

  return `You are Circuitify's Optimization Agent — an expert energy scheduling AI.

${modeInstruction}

Rules:
- Each appliance has a power draw (kW), duration (hr), and a deadline by which it must FINISH.
- An appliance that starts at hour H and lasts D hours finishes at H+D. It must finish at or before its deadline.
- Hours wrap around midnight: starting at 23:00 with duration 3 hr finishes at 02:00, which counts as before a 07:00 deadline.
- Non-flexible appliances cannot be moved.
- Minimize total emissions = sum of (power_kw × duration_hr × carbon_intensity at start hour) for each appliance.
- Never double-book the same hour for appliances that would exceed safe home amperage; prefer staggering.

Return ONLY valid JSON with this exact structure (no markdown, no backticks):
{
  "optimized_schedule": [
    { "device": "Name", "start_time": "HH:00" }
  ],
  "explanation": "Brief 2-3 sentence explanation of the schedule."
}`;
}

function buildUserPrompt(appliancesJson: string, carbonJson: string): string {
  return `Here is the current household data:

APPLIANCES:
${appliancesJson}

GRID CARBON INTENSITY (gCO2/kWh by hour):
${carbonJson}

Generate the optimal schedule now.`;
}

export async function callNemotron(
  appliancesJson: string,
  carbonJson: string,
  mode: PriorityMode,
  apiKey: string
): Promise<{ optimized_schedule: { device: string; start_time: string }[]; explanation: string }> {
  const response = await fetch(NVIDIA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: "/no_think\n\n" + buildSystemPrompt(mode) },
        { role: "user", content: buildUserPrompt(appliancesJson, carbonJson) },
      ],
      temperature: 0.6,
      top_p: 0.95,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Nemotron API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";

  console.log("=== Nemotron raw response ===");
  console.log(JSON.stringify(data.choices?.[0]?.message, null, 2));
  console.log("=== End response ===");

  // Strip <think>...</think> blocks if present
  const cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  // Extract JSON from response (handle possible markdown wrapping)
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in Nemotron response");
  }

  return JSON.parse(jsonMatch[0]);
}
