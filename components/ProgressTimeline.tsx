import clsx from "clsx";
import { getProgram } from "@/lib/demoEngine";
import { DemoSession } from "@/lib/types";

type ProgressTimelineProps = {
  session: DemoSession;
  onSelectMilestone: (milestoneId: string) => void;
};

const statusStyle: Record<string, string> = {
  completed: "border-emerald-200 bg-emerald-50/80 text-emerald-800",
  active: "border-brand-300 bg-brand-50 text-brand-800 shadow-sm",
  upcoming: "border-slate-200 bg-white text-slate-600",
  escalated: "border-rose-300 bg-rose-50/90 text-rose-800 shadow-sm",
};

const dotStyle: Record<string, string> = {
  completed: "bg-emerald-500 ring-emerald-100",
  active: "bg-brand-500 ring-brand-100",
  upcoming: "bg-slate-300 ring-slate-100",
  escalated: "bg-rose-500 ring-rose-100",
};

export function ProgressTimeline({ session, onSelectMilestone }: ProgressTimelineProps) {
  const program = getProgram(session.programId);
  const milestoneStateMap = new Map(session.milestones.map((m) => [m.milestoneId, m]));

  return (
    <section className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Milestones</p>
      <div className="space-y-2">
        {program.milestones.map((milestone, idx) => {
          const state = milestoneStateMap.get(milestone.id);
          const status = state?.status ?? "upcoming";
          const isLast = idx === program.milestones.length - 1;

          return (
            <button
              key={milestone.id}
              type="button"
              onClick={() => onSelectMilestone(milestone.id)}
              className={clsx(
                "relative w-full rounded-xl border px-3 py-3 text-left transition-all duration-200 hover:shadow-sm",
                statusStyle[status],
              )}
            >
              <span
                className={clsx(
                  "absolute left-3 top-4 h-2.5 w-2.5 rounded-full ring-4",
                  dotStyle[status],
                )}
              />
              {!isLast && <span className="absolute bottom-[-10px] left-[18px] top-7 w-px bg-slate-200" />}
              <div className="ml-5 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{milestone.label}</p>
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                  {status.replace("_", " ")}
                </span>
              </div>
              <p className="ml-5 mt-1 text-xs leading-relaxed">{milestone.title}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
