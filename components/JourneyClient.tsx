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
      <div className="grid gap-5 lg:grid-cols-[minmax(390px,500px)_1fr]">
        <section className="order-1 mx-auto w-full max-w-[460px] animate-fade-in-up lg:mx-0">
          <div className="overflow-hidden rounded-[2.2rem] border-8 border-slate-900 bg-slate-900 shadow-shell transition-shadow duration-300">
            <div className="h-6 bg-slate-900">
              <div className="mx-auto mt-2 h-1.5 w-20 rounded-full bg-slate-700" />
            </div>
            <div className="space-y-3 bg-gradient-to-b from-[#fff8f2] via-[#f7f8fd] to-[#eef4ff] p-3 sm:p-4">
              <PatientHeader session={session} />

              {session.escalation && session.escalation.status !== "resolved" && (
                <button
                  type="button"
                  onClick={() => setEscalationSheetOpen(true)}
                  className="w-full rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-rose-100/70 p-3 text-left transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">Escalation Active</p>
                  </div>
                  <p className="mt-1 text-sm font-medium text-rose-900">{session.escalation.reason}</p>
                </button>
              )}

              <ProgressTimeline session={session} onSelectMilestone={setMilestoneSheet} />
              <WhatsAppChat
                session={session}
                onSelectReply={actions.submitReplyWithComment}
              />
            </div>
          </div>
        </section>

        <section className="order-2 hidden lg:block">
          <div className="sticky top-6">
            <PresenterPanel
              session={session}
              onSwitchProgram={actions.switchProgram}
              onJump={actions.jumpToDay}
              onTriggerNormal={actions.forceNormal}
              onTriggerRedFlag={actions.forceRedFlag}
              onLogCallback={actions.logCallback}
              onResolve={actions.resolveEscalation}
              onReset={actions.reset}
              onTogglePresenterLock={actions.setPresenterLock}
            />
          </div>
        </section>
      </div>

      <div className="safe-bottom fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between bg-gradient-to-t from-white/85 to-transparent px-4 pt-8 lg:hidden">
        <Link href="/" className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-700 shadow">
          Back
        </Link>
        <button
          type="button"
          onClick={() => setMobilePresenterOpen(true)}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow transition-transform active:scale-[0.98]"
        >
          Presenter Controls
        </button>
      </div>

      {mobilePresenterOpen && (
        <div className="fixed inset-0 z-40 flex bg-slate-900/30 backdrop-blur-[2px] lg:hidden" onClick={() => setMobilePresenterOpen(false)}>
          <div
            className="ml-auto h-full w-[92%] max-w-sm p-3 animate-fade-in-up"
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
              onTogglePresenterLock={actions.setPresenterLock}
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
