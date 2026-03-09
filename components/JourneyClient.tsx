"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MilestoneSheet } from "@/components/MilestoneSheet";
import { EscalationSheet } from "@/components/EscalationSheet";
import { PatientHeader } from "@/components/PatientHeader";
import { PresenterPanel } from "@/components/PresenterPanel";
import { ProgressTimeline } from "@/components/ProgressTimeline";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { getProgram } from "@/lib/demoEngine";
import { useDemoSession } from "@/lib/useDemoSession";

export function JourneyClient() {
  const { session, actions } = useDemoSession();
  const [mobilePresenterOpen, setMobilePresenterOpen] = useState(false);
  const [milestoneSheet, setMilestoneSheet] = useState<string | null>(null);
  const [escalationSheetOpen, setEscalationSheetOpen] = useState(false);

  const program = useMemo(() => (session ? getProgram(session.programId) : null), [session]);

  if (!session || !program) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="rounded-xl bg-white/90 px-4 py-2 text-sm text-slate-600 shadow">Loading demo session...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-[1380px] px-3 py-4 sm:px-6 sm:py-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(360px,480px)_1fr]">
        <section className="order-1 mx-auto w-full max-w-[460px] animate-fade-in-up lg:mx-0">
          <div className="overflow-hidden rounded-[2.2rem] border-8 border-slate-900 bg-slate-900 shadow-shell">
            <div className="h-6 bg-slate-900" />
            <div className="space-y-3 bg-gradient-to-b from-[#fff8f2] via-[#f7f8fd] to-[#eef4ff] p-3 sm:p-4">
              <PatientHeader session={session} />

              {session.escalation && session.escalation.status !== "resolved" && (
                <button
                  type="button"
                  onClick={() => setEscalationSheetOpen(true)}
                  className="w-full rounded-2xl border border-rose-200 bg-rose-50 p-3 text-left"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Escalation Active</p>
                  <p className="mt-1 text-sm text-rose-900">{session.escalation.reason}</p>
                </button>
              )}

              <ProgressTimeline session={session} onSelectMilestone={setMilestoneSheet} />
              <WhatsAppChat session={session} onSelectReply={actions.selectReply} />
            </div>
          </div>
        </section>

        <section className="order-2 hidden lg:block">
          <PresenterPanel
            session={session}
            onSwitchProgram={actions.switchProgram}
            onJump={actions.jumpToDay}
            onTriggerNormal={actions.forceNormal}
            onTriggerRedFlag={actions.forceRedFlag}
            onLogCallback={actions.logCallback}
            onResolve={actions.resolveEscalation}
            onReset={actions.reset}
          />
        </section>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-30 flex items-center justify-between px-4 lg:hidden">
        <Link href="/" className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-700 shadow">
          Back
        </Link>
        <button
          type="button"
          onClick={() => setMobilePresenterOpen(true)}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow"
        >
          Presenter Controls
        </button>
      </div>

      {mobilePresenterOpen && (
        <div className="fixed inset-0 z-40 flex bg-slate-900/30 lg:hidden" onClick={() => setMobilePresenterOpen(false)}>
          <div
            className="ml-auto h-full w-[90%] max-w-sm p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <PresenterPanel
              session={session}
              onSwitchProgram={actions.switchProgram}
              onJump={actions.jumpToDay}
              onTriggerNormal={actions.forceNormal}
              onTriggerRedFlag={actions.forceRedFlag}
              onLogCallback={actions.logCallback}
              onResolve={actions.resolveEscalation}
              onReset={actions.reset}
            />
          </div>
        </div>
      )}

      <MilestoneSheet session={session} milestoneId={milestoneSheet} onClose={() => setMilestoneSheet(null)} />
      <EscalationSheet
        session={session}
        open={escalationSheetOpen}
        onClose={() => setEscalationSheetOpen(false)}
      />
    </main>
  );
}
