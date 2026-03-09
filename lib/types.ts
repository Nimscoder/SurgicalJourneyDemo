export type QuickReplyType = "normal" | "red_flag";

export type QuickReply = {
  id: string;
  label: string;
  type: QuickReplyType;
};

export type MilestoneStatus = "completed" | "active" | "upcoming" | "escalated";
export type EscalationStatus = "open" | "in_review" | "callback_logged" | "resolved";

export type MilestoneTemplate = {
  id: string;
  label: string;
  title: string;
  dayOffset: number;
  objective: string;
  openingMessages: string[];
  question: string;
  quickReplies: QuickReply[];
  followUpByReply: Record<string, string[]>;
  escalationTriggerReplyIds: string[];
  redFlagReason?: string;
};

export type ProgramTemplate = {
  id: string;
  displayName: string;
  shortLabel: string;
  durationLabel: string;
  accent: "rose" | "amber" | "sky";
  completionMessage: string;
  milestones: MilestoneTemplate[];
};

export type SamplePatient = {
  patientName: string;
  age: number;
  riskTier: "Standard" | "High Risk";
  caregiverName: string;
  program: string;
  currentDay: number;
};

export type ScenarioType = "normal" | "red_flag";
export type RiskTier = "Standard" | "High Risk";

export type DemoEventType =
  | "episode_created"
  | "program_selected"
  | "milestone_activated"
  | "message_sent"
  | "reply_selected"
  | "escalation_opened"
  | "callback_logged"
  | "escalation_resolved"
  | "milestone_completed"
  | "episode_completed";

export type DemoEvent = {
  id: string;
  type: DemoEventType;
  timestamp: string;
  detail: string;
};

export type ChatMessage = {
  id: string;
  sender: "system" | "patient";
  content: string;
  timestamp: string;
  milestoneId: string;
};

export type MilestoneState = {
  milestoneId: string;
  status: MilestoneStatus;
  selectedReplyId?: string;
  selectedReplyLabel?: string;
  caseManagerNote?: string;
};

export type EscalationState = {
  status: EscalationStatus;
  reason: string;
  triggerTime: string;
  assignedClinician: string;
  callbackNote?: string;
  resolvedAt?: string;
};

export type DemoSession = {
  episodeId: string;
  programId: string;
  scenario: ScenarioType;
  riskTier: RiskTier;
  patientName: string;
  currentDay: number;
  activeMilestoneId: string;
  milestones: MilestoneState[];
  messages: ChatMessage[];
  events: DemoEvent[];
  escalation?: EscalationState;
  completed: boolean;
};

export type DemoBootstrap = {
  programId: string;
  scenario: ScenarioType;
  riskTier: RiskTier;
};
