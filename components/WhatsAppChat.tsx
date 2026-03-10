import { getProgram } from "@/lib/demoEngine";
import { useEffect, useRef, useState } from "react";
import { DemoSession, QuickReply } from "@/lib/types";

type WhatsAppChatProps = {
  session: DemoSession;
  onSelectReply: (reply: QuickReply, comment: string) => void;
};

export function WhatsAppChat({ session, onSelectReply }: WhatsAppChatProps) {
  const program = getProgram(session.programId);
  const activeMilestone = program.milestones.find((m) => m.id === session.activeMilestoneId);
  const activeMilestoneIndex = program.milestones.findIndex((m) => m.id === session.activeMilestoneId);
  const isFinalMilestone = activeMilestoneIndex === program.milestones.length - 1;
  const milestoneLabelById = new Map(program.milestones.map((m) => [m.id, m.label] as const));
  const [comment, setComment] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!threadRef.current) return;
    threadRef.current.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [session.messages.length]);

  return (
    <section className="flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-white/60 bg-[#efeae2] shadow-sm">
      <div className="flex items-center gap-3 border-b border-emerald-800/20 bg-[#075e54] px-4 py-2.5 text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-300/30 text-xs font-semibold">
          VS
        </span>
        <div>
          <p className="text-sm font-semibold">Vital Step Care Team</p>
          <p className="text-[11px] text-emerald-100">Online support</p>
        </div>
      </div>
      <div
        ref={threadRef}
        className="scroll-clean flex-1 space-y-2 overflow-y-auto bg-soft-grid bg-[size:20px_20px] p-4"
        style={{ backgroundColor: "#ece5dd" }}
      >
        {session.messages.map((message, index) => {
          const previous = session.messages[index - 1];
          const showMilestoneDivider = !previous || previous.milestoneId !== message.milestoneId;
          const isPatient = message.sender === "patient";
          const timeLabel = new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <div key={message.id} className="animate-fade-in-up">
              {showMilestoneDivider && (
                <div className="my-2 flex justify-center">
                  <span className="rounded-full bg-slate-200/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                    {milestoneLabelById.get(message.milestoneId) ?? "Check-in"} · Scheduled Check-in
                  </span>
                </div>
              )}
              <div className={`flex ${isPatient ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] px-3 py-2 text-sm shadow ${
                    isPatient
                      ? "message-out rounded-2xl bg-[#dcf8c6] text-slate-800"
                      : "message-in rounded-2xl bg-white text-slate-700"
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  <p className="mt-1 text-right text-[10px] text-slate-500">{timeLabel}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-b-2xl border-t border-slate-200/60 bg-white p-3">
        {activeMilestone ? (
          <>
            {isFinalMilestone ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                <label className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Final Feedback Survey
                </label>
                <p className="mt-1 text-[11px] text-slate-500">
                  How likely are you to recommend this recovery support journey? (0-10)
                </p>
                <div className="mt-2 grid grid-cols-6 gap-1">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const targetReply =
                          i >= 9
                            ? activeMilestone.quickReplies[0]
                            : i >= 7
                              ? activeMilestone.quickReplies[1] ?? activeMilestone.quickReplies[0]
                              : activeMilestone.quickReplies.find((r) => r.type === "red_flag") ?? activeMilestone.quickReplies[2] ?? activeMilestone.quickReplies[0];
                        onSelectReply(targetReply, `Final rating: ${i}/10`);
                      }}
                      className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <label className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Optional Detail
                  </label>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Add context if needed, then tap one quick reply below. The selected reply and detail are sent together.
                  </p>
                  <div className="mt-1">
                    <input
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="Type a concern or context..."
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-300"
                    />
                  </div>
                </div>

                <p className="mb-2 mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Quick Replies</p>
                <div className="flex flex-wrap gap-2">
                  {activeMilestone.quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      type="button"
                      onClick={() => {
                        onSelectReply(reply, comment);
                        setComment("");
                      }}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.98] ${
                        reply.type === "red_flag"
                          ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {reply.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <p className="text-sm text-slate-500">Journey complete.</p>
        )}
      </div>
    </section>
  );
}
