import { getProgram } from "@/lib/demoEngine";
import { DemoSession, QuickReply } from "@/lib/types";

type WhatsAppChatProps = {
  session: DemoSession;
  onSelectReply: (reply: QuickReply) => void;
};

export function WhatsAppChat({ session, onSelectReply }: WhatsAppChatProps) {
  const program = getProgram(session.programId);
  const activeMilestone = program.milestones.find((m) => m.id === session.activeMilestoneId);

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
        className="scroll-clean flex-1 space-y-2 overflow-y-auto bg-soft-grid bg-[size:20px_20px] p-4"
        style={{ backgroundColor: "#ece5dd" }}
      >
        {session.messages.map((message) => {
          const isPatient = message.sender === "patient";
          const timeLabel = new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <div
              key={message.id}
              className={`flex ${isPatient ? "justify-end" : "justify-start"} animate-fade-in-up`}
            >
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
          );
        })}
      </div>

      <div className="rounded-b-2xl border-t border-slate-200/60 bg-white p-3">
        {activeMilestone ? (
          <>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Quick Replies</p>
            <div className="flex flex-wrap gap-2">
              {activeMilestone.quickReplies.map((reply) => (
                <button
                  key={reply.id}
                  type="button"
                  onClick={() => onSelectReply(reply)}
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
        ) : (
          <p className="text-sm text-slate-500">Journey complete.</p>
        )}
      </div>
    </section>
  );
}
