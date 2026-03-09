import clsx from "clsx";
import { getProgram } from "@/lib/demoEngine";
import { DemoSession } from "@/lib/types";

type ProgressTimelineProps = {
  session: DemoSession;
  onSelectMilestone: (milestoneId: string) => void;
};

const statusStyle: Record<string, string> = {
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  active: "border-brand-300 bg-brand-50 text-brand-800",
  upcoming: "border-slate-200 bg-white text-slate-600",
  escalated: "border-rose-300 bg-rose-50 text-rose-800",
};

export function ProgressTimeline({ session, onSelectMilestone }: ProgressTimelineProps) {
  const program = getProgram(session.programId);
  const milestoneStateMap = new Map(session.milestones.map((m) => [m.milestoneId, m]));

  return (
    <section className="rounded-2xl border border-white/60 bg-white/90 p-3 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Milestones</p>
      <div className="space-y-2">
        {program.milestones.map((milestone) => {
          const state = milestoneStateMap.get(milestone.id);
          const status = state?.status ?? "upcoming";

          return (
            <button
              key={milestone.id}
              type="button"
              onClick={() => onSelectMilestone(milestone.id)}
              className={clsx(
                "w-full rounded-xl border p-3 text-left transition-all hover:shadow-sm",
                statusStyle[status],
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{milestone.label}</p>
                <span className="text-[10px] uppercase tracking-wide">{status.replace("_", " ")}</span>
              </div>
              <p className="mt-1 text-xs">{milestone.title}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
