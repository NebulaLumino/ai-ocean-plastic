"use client";

import { useState } from "react";

const INPUTS_3875 = [
  { id: "ocean_region", label: "Target Ocean Region", placeholder: "e.g., Great Pacific Garbage Patch, Mediterranean Sea", type: "text" },
  { id: "cleanup_phase", label: "Cleanup Phase / Scale", placeholder: "e.g., Pilot, Phase 1, Full-scale operation", type: "text" },
  { id: "vessel_count", label: "Number of Vessels Available", placeholder: "e.g., 3", type: "text" },
  { id: "vessel_type", label: "Vessel Type", placeholder: "e.g., Fishing boat, Research vessel, Cleanup ship", type: "text" },
  { id: "budget", label: "Operation Budget ($)", placeholder: "e.g., 500000", type: "text" },
  { id: "crew_size", label: "Total Crew Members", placeholder: "e.g., 20", type: "text" },
  { id: "season", label: "Target Season", placeholder: "e.g., Summer, Monsoon season, Year-round", type: "text" },
  { id: "plastic_type", label: "Predominant Plastic Type", placeholder: "e.g., Microplastics, Fishing gear, Mixed debris", type: "text" },
  { id: "sensitive_areas", label: "Nearby Sensitive Marine Areas", placeholder: "e.g., Coral reef 5km south, Marine sanctuary", type: "text" },
  { id: "weather_window", label: "Available Weather Window (days)", placeholder: "e.g., 30", type: "text" },
];

export default function OceanPlasticPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (id: string, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult("");
    const inputsStr = INPUTS_3875.map((f) => `${f.label}: ${form[f.id] || "Not provided"}`).join("\n");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: inputsStr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100 flex flex-col">
      <header className="border-b border-cyan-900/50 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl">
            🌊
          </div>
          <div>
            <h1 className="text-xl font-bold text-cyan-400">AI Ocean Plastic Cleanup Router</h1>
            <p className="text-xs text-gray-400">Optimize cleanup routes for maximum plastic removal</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 grid md:grid-cols-2 gap-8">
        <section>
          <div className="bg-gray-900/60 border border-cyan-900/40 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
              🚤 Operation Parameters
            </h2>
            <div className="space-y-4">
              {INPUTS_3875.map((field) => (
                <div key={field.id} className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400 font-medium" htmlFor={field.id}>
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="bg-gray-800/80 border border-cyan-900/50 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                  />
                </div>
              ))}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:text-cyan-200 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-cyan-900/30"
              >
                {loading ? "⏳ Optimizing Routes..." : "🌊 Optimize Cleanup Routes"}
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-gray-900/60 border border-cyan-900/40 rounded-2xl p-6 h-full flex flex-col">
            <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
              🗺️ Route Plan
            </h2>
            <div className="flex-1 overflow-auto">
              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-lg p-4">
                  ❌ {error}
                </div>
              )}
              {loading && !result && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm">Calculating optimal routes...</p>
                </div>
              )}
              {!loading && !result && !error && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                  <span className="text-4xl mb-3">🐠</span>
                  <p className="text-sm text-center">Fill in the operation parameters<br />and click &ldquo;Optimize Cleanup Routes&rdquo;</p>
                </div>
              )}
              {result && (
                <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-cyan-900/30 px-6 py-4 text-center text-xs text-gray-600">
        Powered by DeepSeek AI · Cycle 127 Environmental AI
      </footer>
    </div>
  );
}
