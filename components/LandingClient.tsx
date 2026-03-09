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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-8 sm:py-12">
      <div className="glass-soft mx-auto w-full overflow-hidden rounded-[1.75rem] border border-white/60 shadow-2xl">
        <div className="border-b border-white/60 bg-gradient-to-r from-brand-100/60 via-white to-sky-100/60 px-6 py-6 sm:px-10">
          <p className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-800">
            Vital Step
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Recovery Journeys Demo
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Simulate structured post-surgical journeys with presenter controls and red-flag escalation paths.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-10">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Select Program</h2>
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

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-slate-200/80 bg-white/75 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Scenario</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["normal", "red_flag"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setScenario(value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      scenario === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {value === "normal" ? "Normal" : "Red Flag"}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200/80 bg-white/75 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Risk Tier</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["Standard", "High Risk"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRiskTier(value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      riskTier === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-200/70 pt-2">
            <button
              type="button"
              onClick={startDemo}
              className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow transition-all hover:-translate-y-0.5 hover:bg-brand-700"
            >
              Start Demo
            </button>
            <button
              type="button"
              onClick={resetDemo}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Reset Demo
            </button>
            <p className="text-xs text-slate-500">
              Current selection: {selectedProgram.displayName} · {scenario === "red_flag" ? "Red Flag" : "Normal"} · {riskTier}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
