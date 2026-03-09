import { DemoSession } from "@/lib/types";

type EscalationSheetProps = {
  session: DemoSession;
  open: boolean;
  onClose: () => void;
};

export function EscalationSheet({ session, open, onClose }: EscalationSheetProps) {
  if (!open || !session.escalation) return null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/30 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="mx-auto mt-16 w-full max-w-md animate-fade-in-up rounded-2xl border border-rose-100 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-rose-600">Escalation Detail</p>
            <h3 className="text-lg font-semibold text-slate-900">Active Escalation</h3>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 transition-colors hover:text-slate-700">Close</button>
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p><strong>Escalation reason:</strong> {session.escalation.reason}</p>
          <p><strong>Trigger time:</strong> {new Date(session.escalation.triggerTime).toLocaleString()}</p>
          <p><strong>Assigned clinician:</strong> {session.escalation.assignedClinician}</p>
          <p><strong>Callback note:</strong> {session.escalation.callbackNote ?? "Not logged"}</p>
          <p><strong>Resolution status:</strong> {session.escalation.status}</p>
        </div>
      </div>
    </div>
  );
}
