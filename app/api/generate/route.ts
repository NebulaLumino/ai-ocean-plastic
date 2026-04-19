import OpenAI from 'openai';

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
  });
}

export async function POST(request: Request) {
  try {
    const { inputs } = await request.json();

    const prompt = `You are a world-class marine conservation scientist and ocean cleanup operations planner. Based on the following inputs, generate a comprehensive ocean plastic cleanup route optimization plan.

INPUTS:
${inputs}

Please provide your response in this exact format:

## 🌊 Ocean Plastic Cleanup Route Optimizer

### Ocean Zone Analysis
[Overview of the target zone and its plastic pollution profile]

### 🗺️ Pollution Hotspot Map
[Identified hotspots, concentrations, and flow patterns]

### 🚤 Optimal Cleanup Route

#### Primary Route (Week 1-2)
[Optimized route with waypoints, distances, and time estimates]

#### Secondary Route (Week 3-4)
[Backup routes based on current patterns]

#### Seasonal Adjustments
[How routes should change with seasons, currents, and weather]

### 📊 Collection Targets

#### Plastic Tonnage Goals
[Estimated collection targets per zone]

#### Species Risk Zones
[Areas to avoid or use extreme caution to protect marine life]

### 🛠️ Equipment Recommendations

#### Vessel Requirements
[Recommended vessel types and equipment]

#### Technology Stack
[AI monitoring, nets, collection devices, and tracking systems]

### 👥 Crew & Logistics Plan
[Required crew, shifts, fueling, and support logistics]

### 💰 Cost Efficiency Analysis
[Cost per ton of plastic removed, grant opportunities, ROI]

### 📅 90-Day Action Plan
[Day-by-day or week-by-week implementation schedule]

### 🌊 Marine Ecosystem Co-Benefits
[How cleanup activities will benefit marine biodiversity]

Be specific with coordinates, distances, tonnage estimates, and operational details.`;

    const client = getClient();
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a world-class marine conservation scientist and ocean plastic cleanup operations planner.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const result = completion.choices[0]?.message?.content || 'No response generated.';
    return Response.json({ result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
