import { getProgram } from "@/lib/demoEngine";
import { jumpPoints, programOrder, programTemplates } from "@/lib/programTemplates";
import { DemoSession } from "@/lib/types";

type PresenterPanelProps = {
  session: DemoSession;
  onSwitchProgram: (programId: string) => void;
  onJump: (day: number) => void;
  onTriggerNormal: () => void;
  onTriggerRedFlag: () => void;
  onLogCallback: () => void;
  onResolve: () => void;
  onReset: () => void;
};

export function PresenterPanel({
  session,
  onSwitchProgram,
  onJump,
  onTriggerNormal,
  onTriggerRedFlag,
  onLogCallback,
  onResolve,
  onReset,
}: PresenterPanelProps) {
  const program = getProgram(session.programId);

  return (
    <aside className="paper-panel h-full rounded-2xl border border-white/50 p-4 shadow-md">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">Presenter Controls</h3>

      <div className="mt-4 space-y-4 text-xs">
        <div>
          <p className="mb-2 font-semibold text-slate-500">Switch Program</p>
          <div className="grid grid-cols-1 gap-2">
            {programOrder.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onSwitchProgram(id)}
                className={`rounded-lg px-2 py-1.5 text-left ${
                  session.programId === id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {programTemplates[id].displayName}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold text-slate-500">Jump To</p>
          <div className="grid grid-cols-2 gap-2">
            {jumpPoints.map((point) => (
              <button
                key={point.label}
                type="button"
                onClick={() => onJump(point.day)}
                className="rounded-lg bg-slate-100 px-2 py-1.5 text-slate-700 hover:bg-slate-200"
              >
                {point.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold text-slate-500">Actions</p>
          <div className="grid gap-2">
            <button type="button" onClick={onTriggerNormal} className="rounded-lg bg-emerald-100 px-2 py-1.5 text-emerald-800">
              Trigger Normal Response
            </button>
            <button type="button" onClick={onTriggerRedFlag} className="rounded-lg bg-rose-100 px-2 py-1.5 text-rose-800">
              Trigger Red-Flag Response
            </button>
            <button type="button" onClick={onLogCallback} className="rounded-lg bg-amber-100 px-2 py-1.5 text-amber-800">
              Log Doctor Callback
            </button>
            <button type="button" onClick={onResolve} className="rounded-lg bg-sky-100 px-2 py-1.5 text-sky-800">
              Resolve Escalation
            </button>
            <button type="button" onClick={onReset} className="rounded-lg bg-slate-200 px-2 py-1.5 text-slate-800">
              Reset Demo
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold text-slate-500">Event Log</p>
          <div className="scroll-clean max-h-56 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2">
            {session.events.slice(0, 14).map((entry) => (
              <div key={entry.id} className="rounded-md border border-slate-100 bg-slate-50 p-2">
                <p className="font-medium text-slate-700">{entry.type}</p>
                <p className="text-slate-600">{entry.detail}</p>
              </div>
            ))}
            {session.events.length === 0 && <p className="text-slate-500">No events yet.</p>}
          </div>
        </div>

        <p className="rounded-lg bg-slate-100 p-2 text-slate-600">
          Active: {program.milestones.find((m) => m.id === session.activeMilestoneId)?.label}
        </p>
      </div>
    </aside>
  );
}
