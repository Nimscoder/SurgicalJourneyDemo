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
    <section className="flex min-h-[26rem] flex-col rounded-2xl border border-white/60 bg-[#efeae2] shadow-sm">
      <div
        className="scroll-clean flex-1 space-y-2 overflow-y-auto rounded-t-2xl bg-soft-grid bg-[size:20px_20px] p-4"
        style={{ backgroundColor: "#ece5dd" }}
      >
        {session.messages.map((message) => {
          const isPatient = message.sender === "patient";
          return (
            <div key={message.id} className={`flex ${isPatient ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow ${
                  isPatient ? "rounded-br-md bg-[#dcf8c6] text-slate-800" : "rounded-bl-md bg-white text-slate-700"
                }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-b-2xl border-t border-slate-200/60 bg-white p-3">
        {activeMilestone ? (
          <>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Quick Replies</p>
            <div className="flex flex-wrap gap-2">
              {activeMilestone.quickReplies.map((reply) => (
                <button
                  key={reply.id}
                  type="button"
                  onClick={() => onSelectReply(reply)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
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
