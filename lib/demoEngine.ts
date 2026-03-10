import {
  ChatMessage,
  DemoBootstrap,
  DemoEvent,
  DemoEventType,
  DemoSession,
  MilestoneState,
  ProgramTemplate,
  QuickReply,
} from "@/lib/types";
import { callbackNotes, completionSummaries, escalationMessages, programTemplates, samplePatients } from "@/lib/programTemplates";

const nowIso = () => new Date().toISOString();

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const event = (type: DemoEventType, detail: string): DemoEvent => ({
  id: uid(),
  type,
  detail,
  timestamp: nowIso(),
});

const systemMessage = (content: string, milestoneId: string): ChatMessage => ({
  id: uid(),
  sender: "system",
  content,
  milestoneId,
  timestamp: nowIso(),
});

const patientMessage = (content: string, milestoneId: string): ChatMessage => ({
  id: uid(),
  sender: "patient",
  content,
  milestoneId,
  timestamp: nowIso(),
});

export const getProgram = (programId: string): ProgramTemplate =>
  programTemplates[programId] ?? programTemplates.c_section;

const buildOrientationMessages = (program: ProgramTemplate, patientName: string): ChatMessage[] => {
  const firstMilestoneId = program.milestones[0]?.id ?? "orientation";
  return [
    systemMessage(
      `Hi ${patientName}, welcome to your Vital Step ${program.displayName} program.`,
      firstMilestoneId,
    ),
    systemMessage(
      "We will support you with simple WhatsApp check-ins across your recovery timeline.",
      firstMilestoneId,
    ),
    systemMessage(
      "If you report a red-flag symptom, our care team will review quickly and arrange a callback from a clinician when needed.",
      firstMilestoneId,
    ),
    systemMessage(
      "You can also add your own comment any time so we can understand your situation better.",
      firstMilestoneId,
    ),
  ];
};

const getMilestonesWithStatus = (program: ProgramTemplate, activeMilestoneId: string): MilestoneState[] => {
  let isPast = true;
  return program.milestones.map((milestone) => {
    if (milestone.id === activeMilestoneId) {
      isPast = false;
      return { milestoneId: milestone.id, status: "active" };
    }

    if (isPast) {
      return { milestoneId: milestone.id, status: "completed" };
    }

    return { milestoneId: milestone.id, status: "upcoming" };
  });
};

const seedMilestoneMessages = (program: ProgramTemplate, milestoneId: string): ChatMessage[] => {
  const milestone = program.milestones.find((m) => m.id === milestoneId);
  if (!milestone) return [];

  // Keep opening concise to avoid repetitive sounding check-ins.
  const messages = milestone.openingMessages.slice(0, 1).map((content) => systemMessage(content, milestone.id));
  messages.push(systemMessage(milestone.question, milestone.id));
  return messages;
};

export const getDayLabel = (day: number): string => {
  if (day >= 28) {
    return `Week ${Math.round(day / 7)}`;
  }
  return `Day ${day}`;
};

export const createSession = (bootstrap: DemoBootstrap): DemoSession => {
  const program = getProgram(bootstrap.programId);
  const patient = samplePatients[program.id];
  const firstMilestone = program.milestones[0];

  const session: DemoSession = {
    episodeId: uid(),
    programId: program.id,
    scenario: bootstrap.scenario,
    riskTier: bootstrap.riskTier,
    patientName: patient.patientName,
    currentDay: 1,
    activeMilestoneId: firstMilestone.id,
    messages: [...buildOrientationMessages(program, patient.patientName), ...seedMilestoneMessages(program, firstMilestone.id)],
    milestones: program.milestones.map((m, index) => ({
      milestoneId: m.id,
      status: index === 0 ? "active" : "upcoming",
    })),
    events: [
      event("episode_created", `Episode created for ${patient.patientName}`),
      event("program_selected", `Program selected: ${program.displayName}`),
      event("milestone_activated", `Activated ${firstMilestone.label} (${firstMilestone.title})`),
    ],
    presenterLocked: true,
    completed: false,
  };

  return session;
};

const setMilestoneStatusAtDay = (session: DemoSession, day: number): DemoSession => {
  const program = getProgram(session.programId);
  const fallback = program.milestones[0];
  const activeMilestone =
    [...program.milestones].reverse().find((m) => day >= m.dayOffset) ?? fallback;

  const existingReplies = new Map(
    session.milestones.map((milestone) => [milestone.milestoneId, milestone] as const),
  );

  const milestones = getMilestonesWithStatus(program, activeMilestone.id).map((milestone) => ({
    ...milestone,
    selectedReplyId: existingReplies.get(milestone.milestoneId)?.selectedReplyId,
    selectedReplyLabel: existingReplies.get(milestone.milestoneId)?.selectedReplyLabel,
    caseManagerNote: existingReplies.get(milestone.milestoneId)?.caseManagerNote,
  }));

  const newMessages = [
    ...session.messages,
    ...seedMilestoneMessages(program, activeMilestone.id),
  ];

  return {
    ...session,
    pendingPatientReply: undefined,
    currentDay: day,
    activeMilestoneId: activeMilestone.id,
    milestones,
    messages: newMessages,
    events: [
      event("milestone_activated", `Jumped to ${activeMilestone.label} (${activeMilestone.title})`),
      ...session.events,
    ],
  };
};

export const jumpToDay = (session: DemoSession, day: number): DemoSession => {
  return setMilestoneStatusAtDay(session, day);
};

const markMilestoneEscalated = (session: DemoSession, milestoneId: string, note: string): MilestoneState[] => {
  return session.milestones.map((milestone) => {
    if (milestone.milestoneId === milestoneId) {
      return {
        ...milestone,
        status: "escalated",
        caseManagerNote: note,
      };
    }
    return milestone;
  });
};

const markMilestoneCompleted = (session: DemoSession, milestoneId: string): MilestoneState[] => {
  return session.milestones.map((milestone) => {
    if (milestone.milestoneId === milestoneId) {
      return { ...milestone, status: "completed" };
    }
    return milestone;
  });
};

const activateNextMilestone = (session: DemoSession): DemoSession => {
  const program = getProgram(session.programId);
  const currentMilestoneIndex = program.milestones.findIndex((m) => m.id === session.activeMilestoneId);
  const isLast = currentMilestoneIndex === program.milestones.length - 1;
  if (isLast) {
    return {
      ...session,
      completed: true,
      messages: [
        ...session.messages,
        systemMessage(program.completionMessage, session.activeMilestoneId),
      ],
      events: [
        event("episode_completed", completionSummaries[session.programId as keyof typeof completionSummaries]),
        ...session.events,
      ],
    };
  }

  const nextMilestone = program.milestones[currentMilestoneIndex + 1];
  return {
    ...session,
    pendingPatientReply: undefined,
    activeMilestoneId: nextMilestone.id,
    currentDay: nextMilestone.dayOffset,
    milestones: session.milestones.map((milestone) => {
      if (milestone.milestoneId === nextMilestone.id) {
        return { ...milestone, status: "active" };
      }
      return milestone;
    }),
    messages: [
      ...session.messages,
      ...seedMilestoneMessages(program, nextMilestone.id),
    ],
    events: [
      event("milestone_activated", `Activated ${nextMilestone.label} (${nextMilestone.title})`),
      ...session.events,
    ],
  };
};

export const selectReply = (
  session: DemoSession,
  quickReply: QuickReply,
  source: "patient" | "presenter" = "patient",
  patientComment?: string,
): DemoSession => {
  const program = getProgram(session.programId);
  const activeMilestone = program.milestones.find((milestone) => milestone.id === session.activeMilestoneId);
  if (!activeMilestone) return session;

  const comment = patientComment?.trim();
  const combinedPatientText = comment ? `${quickReply.label} — ${comment}` : quickReply.label;

  if (source === "patient" && session.presenterLocked) {
    const pendingDetail = comment ? `${quickReply.label} — ${comment}` : quickReply.label;
    return {
      ...session,
      pendingPatientReply: {
        milestoneId: activeMilestone.id,
        replyId: quickReply.id,
        replyLabel: quickReply.label,
        comment,
      },
      milestones: session.milestones.map((milestone) =>
        milestone.milestoneId === activeMilestone.id
          ? {
              ...milestone,
              selectedReplyId: quickReply.id,
              selectedReplyLabel: quickReply.label,
              caseManagerNote: comment || milestone.caseManagerNote,
            }
          : milestone,
      ),
      messages: [...session.messages, patientMessage(combinedPatientText, activeMilestone.id)],
      events: [event("reply_selected", `Patient selected: ${pendingDetail}`), ...session.events],
    };
  }

  const shouldEscalate =
    activeMilestone.escalationTriggerReplyIds.includes(quickReply.id) || quickReply.type === "red_flag";
  const firstName = session.patientName.split(" ")[0] ?? session.patientName;
  const isRedPath = quickReply.type === "red_flag" || shouldEscalate;
  const empathyMessage =
    isRedPath
      ? `Thank you for sharing this, ${firstName}. You did the right thing by flagging this.`
      : `Thanks for the update, ${firstName}. You are doing the right things for your recovery.`;

  const followUps = activeMilestone.followUpByReply[quickReply.id] ?? [];
  const nextMessages: ChatMessage[] = [
    ...session.messages,
    ...(source === "patient" ? [patientMessage(combinedPatientText, activeMilestone.id)] : []),
    systemMessage(empathyMessage, activeMilestone.id),
    ...(isRedPath
      ? []
      : followUps.slice(0, 1).map((message) => systemMessage(message, activeMilestone.id))),
  ];

  let updatedSession: DemoSession = {
    ...session,
    pendingPatientReply: undefined,
    milestones: session.milestones.map((milestone) =>
      milestone.milestoneId === activeMilestone.id
        ? {
            ...milestone,
            selectedReplyId: quickReply.id,
            selectedReplyLabel: quickReply.label,
            caseManagerNote: comment || milestone.caseManagerNote,
          }
        : milestone,
    ),
    messages: nextMessages,
    events: [
      event(
        "reply_selected",
        `${source === "presenter" ? "Presenter triggered" : "Patient selected"}: ${comment ? `${quickReply.label} — ${comment}` : quickReply.label}`,
      ),
      ...followUps.map((message) => event("message_sent", message)),
      ...session.events,
    ],
  };

  if (shouldEscalate) {
    const reason = activeMilestone.redFlagReason ?? `Escalation triggered at ${activeMilestone.label}`;
    updatedSession = {
      ...updatedSession,
      milestones: markMilestoneEscalated(updatedSession, activeMilestone.id, reason),
      escalation: {
        status: "open",
        reason,
        triggerTime: nowIso(),
        assignedClinician: "Dr. Elena Rao",
      },
      messages: [
        ...updatedSession.messages,
        systemMessage(`Escalation opened for clinician review: ${reason}.`, activeMilestone.id),
        systemMessage(escalationMessages.opened[1] ?? "Our care team will review this and arrange a doctor callback as needed.", activeMilestone.id),
      ],
      events: [event("escalation_opened", reason), ...updatedSession.events],
    };
  } else {
    updatedSession = {
      ...updatedSession,
      milestones: markMilestoneCompleted(updatedSession, activeMilestone.id),
      events: [
        event("milestone_completed", `${activeMilestone.label} completed`),
        ...updatedSession.events,
      ],
    };
  }

  const hasActiveEscalation = Boolean(
    updatedSession.escalation && updatedSession.escalation.status !== "resolved",
  );
  if (!hasActiveEscalation) {
    return activateNextMilestone(updatedSession);
  }

  return updatedSession;
};

export const forceRedFlag = (session: DemoSession): DemoSession => {
  const program = getProgram(session.programId);
  const activeMilestone = program.milestones.find((m) => m.id === session.activeMilestoneId);
  if (!activeMilestone) return session;

  const redFlagReply =
    (session.pendingPatientReply &&
      session.pendingPatientReply.milestoneId === activeMilestone.id &&
      activeMilestone.quickReplies.find((reply) => reply.id === session.pendingPatientReply?.replyId)) ||
    activeMilestone.quickReplies.find((reply) => reply.type === "red_flag");
  if (!redFlagReply) return session;

  return selectReply(
    { ...session, scenario: "red_flag" },
    redFlagReply,
    "presenter",
    session.pendingPatientReply?.comment,
  );
};

export const forceNormal = (session: DemoSession): DemoSession => {
  const program = getProgram(session.programId);
  const activeMilestone = program.milestones.find((m) => m.id === session.activeMilestoneId);
  if (!activeMilestone) return session;

  const normalReply =
    (session.pendingPatientReply &&
      session.pendingPatientReply.milestoneId === activeMilestone.id &&
      activeMilestone.quickReplies.find((reply) => reply.id === session.pendingPatientReply?.replyId && reply.type === "normal")) ||
    activeMilestone.quickReplies.find((reply) => reply.type === "normal");
  if (!normalReply) return session;

  return selectReply(
    { ...session, scenario: "normal" },
    normalReply,
    "presenter",
    session.pendingPatientReply?.comment,
  );
};

export const logCallback = (session: DemoSession): DemoSession => {
  if (!session.escalation || session.escalation.status === "resolved") return session;
  const note = callbackNotes[session.programId as keyof typeof callbackNotes] ?? "Doctor callback completed.";
  const callbackTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return {
    ...session,
    escalation: {
      ...session.escalation,
      status: "callback_logged",
      callbackNote: note,
    },
    messages: [
      ...session.messages,
      systemMessage(`Callback completed at ${callbackTime} by ${session.escalation.assignedClinician}.`, session.activeMilestoneId),
      systemMessage(`Doctor update: ${note}`, session.activeMilestoneId),
    ],
    events: [event("callback_logged", note), ...session.events],
  };
};

export const resolveEscalation = (session: DemoSession): DemoSession => {
  if (!session.escalation) return session;
  const resolvedSession: DemoSession = {
    ...session,
    escalation: undefined,
    pendingPatientReply: undefined,
    milestones: session.milestones.map((milestone) =>
      milestone.milestoneId === session.activeMilestoneId
        ? { ...milestone, status: "completed" }
        : milestone,
    ),
    messages: [
      ...session.messages,
      systemMessage(escalationMessages.resolved[0] ?? "This concern has been reviewed and documented.", session.activeMilestoneId),
      systemMessage("We are now continuing to your next scheduled check-in.", session.activeMilestoneId),
    ],
    events: [event("escalation_resolved", "Escalation was resolved by the care team."), ...session.events],
  };
  return activateNextMilestone(resolvedSession);
};

export const switchProgram = (session: DemoSession, programId: string): DemoSession => {
  const next = createSession({
    programId,
    scenario: session.scenario,
    riskTier: session.riskTier,
  });
  return { ...next, presenterLocked: session.presenterLocked };
};

export const setPresenterLock = (session: DemoSession, locked: boolean): DemoSession => ({
  ...session,
  presenterLocked: locked,
});

export const addPatientComment = (session: DemoSession, comment: string): DemoSession => {
  const trimmed = comment.trim();
  if (!trimmed) return session;
  return {
    ...session,
    messages: [...session.messages, patientMessage(trimmed, session.activeMilestoneId)],
    events: [event("message_sent", `Patient comment: ${trimmed}`), ...session.events],
  };
};
