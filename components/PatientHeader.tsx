import { getDayLabel, getProgram } from "@/lib/demoEngine";
import { DemoSession } from "@/lib/types";
import { accentClasses } from "@/lib/theme";

type PatientHeaderProps = {
  session: DemoSession;
};

export function PatientHeader({ session }: PatientHeaderProps) {
  const program = getProgram(session.programId);
  const accent = accentClasses(program.accent);
  const completed = session.milestones.filter((m) => m.status === "completed").length;
  const progress = Math.round((completed / program.milestones.length) * 100);

  return (
    <header className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Patient</p>
          <h2 className="text-lg font-semibold text-slate-900">{session.patientName}</h2>
          <p className="text-sm text-slate-600">{program.displayName}</p>
        </div>
        <div className="text-right">
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${accent.soft}`}>
            {session.riskTier}
          </span>
          <p className="mt-2 text-sm font-medium text-slate-700">{getDayLabel(session.currentDay)}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Journey progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div className={`h-2 rounded-full ${accent.progress}`} style={{ width: `${Math.max(progress, 5)}%` }} />
        </div>
      </div>
    </header>
  );
}
