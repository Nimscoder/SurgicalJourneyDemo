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
  onTogglePresenterLock: (locked: boolean) => void;
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
  onTogglePresenterLock,
}: PresenterPanelProps) {
  const program = getProgram(session.programId);
  const escalationOpen = Boolean(session.escalation && session.escalation.status !== "resolved");
  const callbackLogged = session.escalation?.status === "callback_logged";

  return (
    <aside className="glass-soft h-full rounded-2xl border border-white/50 p-4 shadow-md">
      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">Presenter Controls</h3>
      <p className="mt-1 text-xs text-slate-500">Use these controls to drive the live demo flow.</p>

      <div className="mt-4 space-y-4 text-xs">
        <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3">
          <p className="mb-2 font-semibold uppercase tracking-wide text-slate-500">Demo Flow</p>
          <button
            type="button"
            onClick={() => onTogglePresenterLock(!session.presenterLocked)}
            className={`w-full rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
              session.presenterLocked
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {session.presenterLocked ? "Presenter Lock: ON" : "Presenter Lock: OFF"}
          </button>
          {session.pendingPatientReply && (
            <p className="mt-2 text-[11px] text-slate-600">
              Pending patient input: {session.pendingPatientReply.replyLabel}
              {session.pendingPatientReply.comment ? ` — ${session.pendingPatientReply.comment}` : ""}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3">
          <p className="mb-2 font-semibold uppercase tracking-wide text-slate-500">Switch Program</p>
          <div className="grid grid-cols-1 gap-2">
            {programOrder.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onSwitchProgram(id)}
                className={`rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                  session.programId === id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {programTemplates[id].displayName}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3">
          <p className="mb-2 font-semibold uppercase tracking-wide text-slate-500">Jump To</p>
          <div className="grid grid-cols-2 gap-2">
            {jumpPoints.map((point) => (
              <button
                key={point.label}
                type="button"
                onClick={() => onJump(point.day)}
                className="rounded-lg bg-slate-100 px-2 py-1.5 text-slate-700 transition-colors hover:bg-slate-200"
              >
                {point.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3">
          <p className="mb-2 font-semibold uppercase tracking-wide text-slate-500">Actions</p>
          {session.escalation && (
            <p className="mb-2 text-[11px] text-slate-500">
              Escalation status: <span className="font-semibold text-slate-700">{session.escalation.status}</span>
            </p>
          )}
          <div className="grid gap-2">
            <button
              type="button"
              onClick={onTriggerNormal}
              className="rounded-lg bg-emerald-100 px-2 py-1.5 text-emerald-800 transition-colors hover:bg-emerald-200"
            >
              Trigger Normal Response
            </button>
            <button
              type="button"
              onClick={onTriggerRedFlag}
              className="rounded-lg bg-rose-100 px-2 py-1.5 text-rose-800 transition-colors hover:bg-rose-200"
            >
              Trigger Red-Flag Response
            </button>
            <button
              type="button"
              onClick={onLogCallback}
              disabled={!escalationOpen || callbackLogged}
              className="rounded-lg bg-amber-100 px-2 py-1.5 text-amber-800 transition-colors hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {callbackLogged ? "Callback Logged" : "Log Doctor Callback"}
            </button>
            <button
              type="button"
              onClick={onResolve}
              disabled={!escalationOpen}
              className="rounded-lg bg-sky-100 px-2 py-1.5 text-sky-800 transition-colors hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Resolve Escalation
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg bg-slate-200 px-2 py-1.5 text-slate-800 transition-colors hover:bg-slate-300"
            >
              Reset Demo
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3">
          <p className="mb-2 font-semibold uppercase tracking-wide text-slate-500">Event Log</p>
          <div className="scroll-clean max-h-56 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2">
            {session.events.slice(0, 14).map((entry) => (
              <div key={entry.id} className="rounded-md border border-slate-100 bg-slate-50 p-2">
                <p className="mb-1 font-mono text-[10px] uppercase text-slate-500">
                  {entry.detail.match(/(Day\\s+\\d+|Week\\s+\\d+)/i)?.[1] ?? "Current check-in"} ·{" "}
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="font-mono text-[10px] uppercase text-slate-500">{entry.type}</p>
                <p className="mt-1 text-slate-700">{entry.detail}</p>
              </div>
            ))}
            {session.events.length === 0 && <p className="text-slate-500">No events yet.</p>}
          </div>
        </div>

        <p className="rounded-lg border border-slate-200 bg-slate-100 p-2 text-slate-600">
          Active: {program.milestones.find((m) => m.id === session.activeMilestoneId)?.label}
        </p>
      </div>
    </aside>
  );
}
