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

  const messages = milestone.openingMessages.map((content) => systemMessage(content, milestone.id));
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
    messages: seedMilestoneMessages(program, firstMilestone.id),
    milestones: program.milestones.map((m, index) => ({
      milestoneId: m.id,
      status: index === 0 ? "active" : "upcoming",
    })),
    events: [
      event("episode_created", `Episode created for ${patient.patientName}`),
      event("program_selected", `Program selected: ${program.displayName}`),
      event("milestone_activated", `Activated ${firstMilestone.label} (${firstMilestone.title})`),
    ],
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

export const selectReply = (session: DemoSession, quickReply: QuickReply): DemoSession => {
  const program = getProgram(session.programId);
  const activeMilestone = program.milestones.find((milestone) => milestone.id === session.activeMilestoneId);
  if (!activeMilestone) return session;

  const followUps = activeMilestone.followUpByReply[quickReply.id] ?? [];
  const nextMessages: ChatMessage[] = [
    ...session.messages,
    patientMessage(quickReply.label, activeMilestone.id),
    ...followUps.map((message) => systemMessage(message, activeMilestone.id)),
  ];

  let updatedSession: DemoSession = {
    ...session,
    milestones: session.milestones.map((milestone) =>
      milestone.milestoneId === activeMilestone.id
        ? {
            ...milestone,
            selectedReplyId: quickReply.id,
            selectedReplyLabel: quickReply.label,
          }
        : milestone,
    ),
    messages: nextMessages,
    events: [
      event("reply_selected", `Patient selected: ${quickReply.label}`),
      ...followUps.map((message) => event("message_sent", message)),
      ...session.events,
    ],
  };

  const shouldEscalate =
    session.scenario === "red_flag" && activeMilestone.escalationTriggerReplyIds.includes(quickReply.id);

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
        ...escalationMessages.opened.map((message) => systemMessage(message, activeMilestone.id)),
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

  const currentMilestoneIndex = program.milestones.findIndex((m) => m.id === activeMilestone.id);
  const isLast = currentMilestoneIndex === program.milestones.length - 1;

  if (!isLast && !updatedSession.escalation) {
    const nextMilestone = program.milestones[currentMilestoneIndex + 1];
    updatedSession = {
      ...updatedSession,
      activeMilestoneId: nextMilestone.id,
      currentDay: nextMilestone.dayOffset,
      milestones: updatedSession.milestones.map((milestone) => {
        if (milestone.milestoneId === nextMilestone.id) {
          return { ...milestone, status: "active" };
        }
        return milestone;
      }),
      messages: [
        ...updatedSession.messages,
        ...seedMilestoneMessages(program, nextMilestone.id),
      ],
      events: [
        event("milestone_activated", `Activated ${nextMilestone.label} (${nextMilestone.title})`),
        ...updatedSession.events,
      ],
    };
  }

  if (isLast && !updatedSession.escalation) {
    updatedSession = {
      ...updatedSession,
      completed: true,
      messages: [
        ...updatedSession.messages,
        systemMessage(program.completionMessage, activeMilestone.id),
      ],
      events: [
        event("episode_completed", completionSummaries[session.programId as keyof typeof completionSummaries]),
        ...updatedSession.events,
      ],
    };
  }

  return updatedSession;
};

export const forceRedFlag = (session: DemoSession): DemoSession => {
  const program = getProgram(session.programId);
  const activeMilestone = program.milestones.find((m) => m.id === session.activeMilestoneId);
  if (!activeMilestone) return session;

  const redFlagReply = activeMilestone.quickReplies.find((reply) => reply.type === "red_flag");
  if (!redFlagReply) return session;

  return selectReply({ ...session, scenario: "red_flag" }, redFlagReply);
};

export const forceNormal = (session: DemoSession): DemoSession => {
  const program = getProgram(session.programId);
  const activeMilestone = program.milestones.find((m) => m.id === session.activeMilestoneId);
  if (!activeMilestone) return session;

  const normalReply = activeMilestone.quickReplies.find((reply) => reply.type === "normal");
  if (!normalReply) return session;

  return selectReply({ ...session, scenario: "normal" }, normalReply);
};

export const logCallback = (session: DemoSession): DemoSession => {
  if (!session.escalation) return session;
  const note = callbackNotes[session.programId as keyof typeof callbackNotes] ?? "Doctor callback completed.";
  return {
    ...session,
    escalation: {
      ...session.escalation,
      status: "callback_logged",
      callbackNote: note,
    },
    messages: [
      ...session.messages,
      ...escalationMessages.callbackLogged.map((message) => systemMessage(message, session.activeMilestoneId)),
    ],
    events: [event("callback_logged", note), ...session.events],
  };
};

export const resolveEscalation = (session: DemoSession): DemoSession => {
  if (!session.escalation) return session;
  return {
    ...session,
    escalation: {
      ...session.escalation,
      status: "resolved",
      resolvedAt: nowIso(),
    },
    milestones: session.milestones.map((milestone) =>
      milestone.milestoneId === session.activeMilestoneId
        ? { ...milestone, status: "completed" }
        : milestone,
    ),
    messages: [
      ...session.messages,
      ...escalationMessages.resolved.map((message) => systemMessage(message, session.activeMilestoneId)),
    ],
    events: [event("escalation_resolved", "Escalation was resolved by the care team."), ...session.events],
  };
};

export const switchProgram = (session: DemoSession, programId: string): DemoSession => {
  return createSession({
    programId,
    scenario: session.scenario,
    riskTier: session.riskTier,
  });
};
