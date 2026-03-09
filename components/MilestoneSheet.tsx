import { getProgram } from "@/lib/demoEngine";
import { DemoSession } from "@/lib/types";

type MilestoneSheetProps = {
  session: DemoSession;
  milestoneId: string | null;
  onClose: () => void;
};

export function MilestoneSheet({ session, milestoneId, onClose }: MilestoneSheetProps) {
  if (!milestoneId) return null;

  const program = getProgram(session.programId);
  const milestone = program.milestones.find((m) => m.id === milestoneId);
  const state = session.milestones.find((m) => m.milestoneId === milestoneId);
  if (!milestone) return null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/30 p-4" onClick={onClose}>
      <div
        className="mx-auto mt-12 w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Milestone Detail</p>
            <h3 className="text-lg font-semibold text-slate-900">{milestone.title}</h3>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500">Close</button>
        </div>

        <div className="space-y-3 text-sm text-slate-700">
          <p><strong>Questions asked:</strong> {milestone.question}</p>
          <p><strong>Selected response:</strong> {state?.selectedReplyLabel ?? "Not answered"}</p>
          <p><strong>Status:</strong> {state?.status ?? "upcoming"}</p>
          <p><strong>Case manager note:</strong> {state?.caseManagerNote ?? "No note yet"}</p>
          <p><strong>Escalation state:</strong> {session.escalation?.status ?? "none"}</p>
        </div>
      </div>
    </div>
  );
}
