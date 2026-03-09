"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgramTile } from "@/components/ProgramTile";
import { programOrder, programTemplates } from "@/lib/programTemplates";
import { clearDemoStorage, writeBootstrap, writeSession } from "@/lib/storage";
import { createSession } from "@/lib/demoEngine";
import { RiskTier, ScenarioType } from "@/lib/types";

export function LandingClient() {
  const router = useRouter();
  const [programId, setProgramId] = useState<string>("c_section");
  const [scenario, setScenario] = useState<ScenarioType>("normal");
  const [riskTier, setRiskTier] = useState<RiskTier>("Standard");

  const selectedProgram = useMemo(() => programTemplates[programId], [programId]);

  const startDemo = () => {
    const bootstrap = { programId, scenario, riskTier };
    writeBootstrap(bootstrap);
    writeSession(createSession(bootstrap));
    router.push("/journey");
  };

  const resetDemo = () => {
    clearDemoStorage();
    setProgramId("c_section");
    setScenario("normal");
    setRiskTier("Standard");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-8">
      <div className="paper-panel mx-auto w-full rounded-3xl border border-white/50 p-6 shadow-xl sm:p-10">
        <div className="mb-8">
          <p className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800">
            Vital Step
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Recovery Journeys Demo
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Simulate structured post-surgical journeys with presenter controls and red-flag escalation paths.
          </p>
        </div>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Select Program</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {programOrder.map((id) => (
              <ProgramTile
                key={id}
                program={programTemplates[id]}
                selected={programId === id}
                onSelect={() => setProgramId(id)}
              />
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Scenario</p>
            <div className="mt-2 flex gap-2">
              {(["normal", "red_flag"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScenario(value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    scenario === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {value === "normal" ? "Normal" : "Red Flag"}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Risk Tier</p>
            <div className="mt-2 flex gap-2">
              {(["Standard", "High Risk"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRiskTier(value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    riskTier === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startDemo}
            className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-brand-700"
          >
            Start Demo
          </button>
          <button
            type="button"
            onClick={resetDemo}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Reset Demo
          </button>
          <p className="self-center text-xs text-slate-500">
            Current selection: {selectedProgram.displayName} · {scenario === "red_flag" ? "Red Flag" : "Normal"} · {riskTier}
          </p>
        </div>
      </div>
    </main>
  );
}
