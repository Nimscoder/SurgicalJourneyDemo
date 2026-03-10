import { ProgramTemplate, SamplePatient } from "@/lib/types";

export const samplePatients: Record<string, SamplePatient> = {
  c_section: {
    patientName: "Priya Sharma",
    age: 31,
    riskTier: "Standard",
    caregiverName: "Rahul Sharma",
    program: "C-Section Recovery",
    currentDay: 1,
  },
  gallbladder: {
    patientName: "Anita Mehta",
    age: 42,
    riskTier: "Standard",
    caregiverName: "Kunal Mehta",
    program: "Gallbladder Recovery",
    currentDay: 1,
  },
  hernia: {
    patientName: "Neha Patel",
    age: 47,
    riskTier: "Standard",
    caregiverName: "Viral Patel",
    program: "Hernia Recovery",
    currentDay: 1,
  },
};

export const escalationMessages = {
  opened: [
    "Thank you for letting us know. We understand this can feel worrying.",
    "Our care team will review this and arrange a doctor callback as needed.",
  ],
  callbackLogged: [
    "A doctor callback has been completed.",
    "We'll continue to support your next recovery steps clearly and closely.",
  ],
  resolved: [
    "This concern has been reviewed and documented.",
    "We'll continue with your recovery check-ins and keep monitoring your progress.",
  ],
};

export const callbackNotes = {
  c_section:
    "Doctor spoke to patient. Mild wound concern suspected. Advised treatment review and repeat check in 48 hours.",
  gallbladder:
    "Doctor spoke to patient. Symptoms reviewed. Advised hydration, symptom watch, and surgeon follow-up if worsening continues.",
  hernia:
    "Doctor spoke to patient. Swelling reviewed. Advised local monitoring and earlier surgical review if symptoms increase.",
};

export const completionSummaries = {
  c_section:
    "6-week structured recovery journey completed with milestone check-ins, symptom review, and escalation support.",
  gallbladder:
    "6-week structured recovery journey completed with symptom prompts, recovery tracking, and escalation handling.",
  hernia:
    "6-week structured recovery journey completed with mobility checks, symptom review, and escalation support.",
};

export const jumpPoints = [
  { label: "Day 1", day: 1 },
  { label: "Day 3", day: 3 },
  { label: "Day 7", day: 7 },
  { label: "Day 14", day: 14 },
  { label: "Week 4", day: 28 },
  { label: "Week 6", day: 42 },
];

export const programTemplates: Record<string, ProgramTemplate> = {
  c_section: {
    id: "c_section",
    displayName: "C-Section Recovery",
    shortLabel: "C-Section",
    durationLabel: "6 weeks",
    accent: "rose",
    completionMessage:
      "Your structured recovery journey is now complete. If you still have concerns, please continue follow-up with your treating doctor.",
    milestones: [
      {
        id: "cs_day_1",
        label: "Day 1",
        title: "Welcome + Recovery Basics",
        dayOffset: 1,
        objective:
          "Orient the patient and caregiver to the first stage of recovery.",
        openingMessages: [
          "Hi Priya, welcome to your Vital Step C-Section Recovery journey.",
          "We will support you through the next few weeks with simple check-ins and guidance.",
          "Today, we are sharing a few basics to help you get started.",
        ],
        question: "How are you feeling today overall?",
        quickReplies: [
          { id: "doing_ok", label: "Doing okay", type: "normal" },
          {
            id: "a_bit_uncomfortable",
            label: "A bit uncomfortable",
            type: "normal",
          },
          { id: "need_support", label: "Need support", type: "red_flag" },
        ],
        followUpByReply: {
          doing_ok: [
            "That is good to hear.",
            "Please continue to rest, stay hydrated, and follow your discharge advice.",
          ],
          a_bit_uncomfortable: [
            "That can be common early on.",
            "We will continue to check in with you over the next few days.",
          ],
          need_support: [
            "Thanks for letting us know.",
            "A member of our care team will review this and reach out.",
          ],
        },
        escalationTriggerReplyIds: ["need_support"],
      },
      {
        id: "cs_day_3",
        label: "Day 3",
        title: "Pain + Wound Check",
        dayOffset: 3,
        objective: "Check incision symptoms and pain progression.",
        openingMessages: [
          "Hi Priya, checking in on Day 3 after your C-section.",
          "We would like to understand how your incision site is doing.",
        ],
        question: "How does the incision site look today?",
        quickReplies: [
          { id: "no_redness", label: "No redness", type: "normal" },
          {
            id: "slight_redness",
            label: "Slight redness",
            type: "normal",
          },
          {
            id: "redness_discharge",
            label: "Redness or discharge",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          no_redness: [
            "That is reassuring.",
            "Please continue keeping the area clean and dry as advised.",
          ],
          slight_redness: [
            "Thanks for sharing that.",
            "We will keep a closer watch and check in again.",
          ],
          redness_discharge: [
            "Thanks for letting us know.",
            "Our care team will review this and arrange a doctor callback.",
          ],
        },
        escalationTriggerReplyIds: ["redness_discharge"],
        redFlagReason: "Possible wound concern after C-section",
      },
      {
        id: "cs_day_7",
        label: "Day 7",
        title: "Mobility + Bleeding Check",
        dayOffset: 7,
        objective: "Check early movement and postpartum bleeding pattern.",
        openingMessages: [
          "Hi Priya, this is your Day 7 recovery check-in.",
          "We would like to see how your movement and bleeding are progressing.",
        ],
        question: "How is your movement today?",
        quickReplies: [
          {
            id: "walking_comfortably",
            label: "Walking comfortably",
            type: "normal",
          },
          {
            id: "moving_slowly",
            label: "Moving slowly",
            type: "normal",
          },
          {
            id: "movement_difficult",
            label: "Movement is difficult",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          walking_comfortably: [
            "Good progress.",
            "Please continue gradual movement as advised.",
          ],
          moving_slowly: [
            "That can still be part of recovery.",
            "Take it gradually and follow your doctor instructions.",
          ],
          movement_difficult: [
            "Thanks for sharing that.",
            "Our team will review this and contact you.",
          ],
        },
        escalationTriggerReplyIds: ["movement_difficult"],
      },
      {
        id: "cs_day_14",
        label: "Day 14",
        title: "Activity Recovery",
        dayOffset: 14,
        objective: "Assess return to light routine activity.",
        openingMessages: [
          "Hi Priya, this is your 2-week recovery check-in.",
          "We would like to understand how your daily activity is going.",
        ],
        question: "How are you managing light daily activity?",
        quickReplies: [
          { id: "managing_well", label: "Managing well", type: "normal" },
          {
            id: "still_tiring",
            label: "Still tiring easily",
            type: "normal",
          },
          {
            id: "struggling_daily_activity",
            label: "Struggling with daily activity",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          managing_well: ["That is encouraging.", "Please continue pacing your recovery."],
          still_tiring: [
            "That can happen during recovery.",
            "We will continue to support you through the next stage.",
          ],
          struggling_daily_activity: [
            "Thanks for telling us.",
            "Our care team will review this and get in touch.",
          ],
        },
        escalationTriggerReplyIds: ["struggling_daily_activity"],
      },
      {
        id: "cs_week_4",
        label: "Week 4",
        title: "Mood + Fatigue Check",
        dayOffset: 28,
        objective: "Check fatigue burden and emotional wellbeing.",
        openingMessages: [
          "Hi Priya, this is your Week 4 check-in.",
          "Recovery also includes energy levels and emotional wellbeing.",
        ],
        question: "How have you been feeling emotionally this week?",
        quickReplies: [
          { id: "coping_well", label: "Coping well", type: "normal" },
          { id: "up_and_down", label: "A bit up and down", type: "normal" },
          {
            id: "feeling_overwhelmed",
            label: "Feeling overwhelmed",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          coping_well: [
            "That is good to hear.",
            "We will continue with your final recovery stages.",
          ],
          up_and_down: [
            "Thanks for sharing honestly.",
            "Recovery can have emotional ups and downs.",
          ],
          feeling_overwhelmed: [
            "Thank you for letting us know.",
            "A member of our care team will review this and support you.",
          ],
        },
        escalationTriggerReplyIds: ["feeling_overwhelmed"],
      },
      {
        id: "cs_week_6",
        label: "Week 6",
        title: "Final Recovery Review",
        dayOffset: 42,
        objective: "Close the structured journey and reinforce follow-up.",
        openingMessages: [
          "Hi Priya, this is your final structured recovery check-in.",
          "You have reached the end of your Vital Step C-Section Recovery journey.",
        ],
        question: "How would you describe your recovery overall?",
        quickReplies: [
          {
            id: "recovering_well",
            label: "Recovering well",
            type: "normal",
          },
          { id: "mostly_better", label: "Mostly better", type: "normal" },
          {
            id: "still_have_concerns",
            label: "Still have concerns",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          recovering_well: [
            "That is great to hear.",
            "Your structured recovery journey is now complete.",
          ],
          mostly_better: [
            "Glad to hear recovery is moving forward.",
            "Please continue any follow-up advised by your doctor.",
          ],
          still_have_concerns: [
            "Thanks for sharing that.",
            "Our team will review this and guide the next step.",
          ],
        },
        escalationTriggerReplyIds: ["still_have_concerns"],
      },
    ],
  },
  gallbladder: {
    id: "gallbladder",
    displayName: "Gallbladder Recovery",
    shortLabel: "Gallbladder",
    durationLabel: "6 weeks",
    accent: "amber",
    completionMessage:
      "Your structured recovery journey is now complete. Please continue follow-up with your treating doctor if symptoms persist.",
    milestones: [
      {
        id: "gb_day_1",
        label: "Day 1",
        title: "Welcome + Post-op Basics",
        dayOffset: 1,
        objective: "Orient the patient to early recovery after gallbladder surgery.",
        openingMessages: [
          "Hi Anita, welcome to your Vital Step Gallbladder Recovery journey.",
          "We will check in with you over the next few weeks with simple recovery prompts.",
        ],
        question: "How are you feeling today overall?",
        quickReplies: [
          { id: "settling_in", label: "Settling in okay", type: "normal" },
          {
            id: "some_discomfort",
            label: "Some discomfort",
            type: "normal",
          },
          { id: "need_support", label: "Need support", type: "red_flag" },
        ],
        followUpByReply: {
          settling_in: ["That is good to hear."],
          some_discomfort: ["Some discomfort can happen early after surgery."],
          need_support: ["Thanks for letting us know.", "Our care team will review this."],
        },
        escalationTriggerReplyIds: ["need_support"],
      },
      {
        id: "gb_day_3",
        label: "Day 3",
        title: "Pain + Nausea Check",
        dayOffset: 3,
        objective: "Check symptom burden in early recovery.",
        openingMessages: ["Hi Anita, checking in on Day 3 after your procedure."],
        question: "How are your pain and nausea today?",
        quickReplies: [
          { id: "comfortable", label: "Comfortable", type: "normal" },
          {
            id: "mild_symptoms",
            label: "Mild symptoms",
            type: "normal",
          },
          {
            id: "vomiting_or_worse",
            label: "Vomiting or getting worse",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          comfortable: ["That is reassuring."],
          mild_symptoms: ["Thanks for sharing. We will continue to monitor."],
          vomiting_or_worse: [
            "Thanks for letting us know.",
            "Our care team will review this and arrange a callback.",
          ],
        },
        escalationTriggerReplyIds: ["vomiting_or_worse"],
        redFlagReason:
          "Possible early post-op symptom concern after gallbladder surgery",
      },
      {
        id: "gb_day_7",
        label: "Day 7",
        title: "Wound + Eating Tolerance",
        dayOffset: 7,
        objective: "Check wound healing and oral intake progression.",
        openingMessages: ["Hi Anita, this is your Day 7 recovery check-in."],
        question: "How are you tolerating food and fluids?",
        quickReplies: [
          { id: "eating_well", label: "Eating well", type: "normal" },
          {
            id: "slowly_improving",
            label: "Slowly improving",
            type: "normal",
          },
          {
            id: "poor_intake",
            label: "Poor intake / unable to tolerate",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          eating_well: ["Good progress."],
          slowly_improving: ["Thanks for sharing. Recovery can still take time."],
          poor_intake: [
            "Thanks for sharing that.",
            "Our care team will review this and contact you.",
          ],
        },
        escalationTriggerReplyIds: ["poor_intake"],
      },
      {
        id: "gb_day_14",
        label: "Day 14",
        title: "Activity Recovery",
        dayOffset: 14,
        objective: "Assess return to light routine activity.",
        openingMessages: ["Hi Anita, this is your 2-week check-in."],
        question: "How are you managing your daily activity?",
        quickReplies: [
          {
            id: "back_to_light_activity",
            label: "Back to light activity",
            type: "normal",
          },
          {
            id: "still_limited",
            label: "Still somewhat limited",
            type: "normal",
          },
          {
            id: "struggling_activity",
            label: "Struggling significantly",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          back_to_light_activity: ["That is encouraging."],
          still_limited: ["Thanks for sharing. We will continue to monitor."],
          struggling_activity: ["Our care team will review this and get in touch."],
        },
        escalationTriggerReplyIds: ["struggling_activity"],
      },
      {
        id: "gb_week_4",
        label: "Week 4",
        title: "Digestive Comfort Review",
        dayOffset: 28,
        objective: "Check digestive adjustment and symptom persistence.",
        openingMessages: ["Hi Anita, this is your Week 4 recovery check-in."],
        question: "How is your digestive comfort now?",
        quickReplies: [
          {
            id: "comfortable_now",
            label: "Comfortable now",
            type: "normal",
          },
          {
            id: "occasional_discomfort",
            label: "Occasional discomfort",
            type: "normal",
          },
          {
            id: "persistent_symptoms",
            label: "Persistent symptoms",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          comfortable_now: ["That is good to hear."],
          occasional_discomfort: [
            "Thanks for sharing. We will continue through the journey.",
          ],
          persistent_symptoms: [
            "Thanks for sharing that. Our care team will review this.",
          ],
        },
        escalationTriggerReplyIds: ["persistent_symptoms"],
      },
      {
        id: "gb_week_6",
        label: "Week 6",
        title: "Final Recovery Review",
        dayOffset: 42,
        objective: "Close the structured journey.",
        openingMessages: ["Hi Anita, this is your final structured recovery check-in."],
        question: "How would you describe your recovery overall?",
        quickReplies: [
          { id: "doing_well", label: "Doing well", type: "normal" },
          {
            id: "mostly_recovered",
            label: "Mostly recovered",
            type: "normal",
          },
          {
            id: "still_symptomatic",
            label: "Still having symptoms",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          doing_well: [
            "That is great to hear.",
            "Your structured recovery journey is now complete.",
          ],
          mostly_recovered: [
            "Glad to hear you are improving.",
            "Please continue any doctor-advised follow-up.",
          ],
          still_symptomatic: [
            "Thanks for letting us know.",
            "Our team will review this and guide the next step.",
          ],
        },
        escalationTriggerReplyIds: ["still_symptomatic"],
      },
    ],
  },
  hernia: {
    id: "hernia",
    displayName: "Hernia Recovery",
    shortLabel: "Hernia",
    durationLabel: "6 weeks",
    accent: "sky",
    completionMessage:
      "Your structured recovery journey is now complete. Please continue follow-up with your treating doctor if you still have concerns.",
    milestones: [
      {
        id: "hr_day_1",
        label: "Day 1",
        title: "Welcome + Post-op Basics",
        dayOffset: 1,
        objective: "Orient the patient to early hernia recovery.",
        openingMessages: [
          "Hi Neha, welcome to your Vital Step Hernia Recovery journey.",
          "We will support you with simple check-ins as you recover.",
        ],
        question: "How are you feeling today overall?",
        quickReplies: [
          { id: "doing_fine", label: "Doing fine", type: "normal" },
          { id: "some_pain", label: "Some pain", type: "normal" },
          { id: "need_support", label: "Need support", type: "red_flag" },
        ],
        followUpByReply: {
          doing_fine: ["That is good to hear."],
          some_pain: ["Some pain can happen early after surgery."],
          need_support: ["Thanks for letting us know.", "Our care team will review this."],
        },
        escalationTriggerReplyIds: ["need_support"],
      },
      {
        id: "hr_day_3",
        label: "Day 3",
        title: "Pain + Swelling Check",
        dayOffset: 3,
        objective: "Check pain and localized swelling.",
        openingMessages: ["Hi Neha, checking in on Day 3 after your hernia procedure."],
        question: "How is the operated area today?",
        quickReplies: [
          { id: "improving", label: "Improving", type: "normal" },
          { id: "still_tender", label: "Still tender", type: "normal" },
          {
            id: "more_swelling",
            label: "More swelling or concern",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          improving: ["That is reassuring."],
          still_tender: ["Thanks for sharing. We will continue to monitor."],
          more_swelling: [
            "Thanks for letting us know.",
            "Our care team will review this and arrange follow-up.",
          ],
        },
        escalationTriggerReplyIds: ["more_swelling"],
        redFlagReason: "Possible swelling-related concern after hernia surgery",
      },
      {
        id: "hr_day_7",
        label: "Day 7",
        title: "Wound + Mobility",
        dayOffset: 7,
        objective: "Check wound status and walking comfort.",
        openingMessages: ["Hi Neha, this is your Day 7 recovery check-in."],
        question: "How is your movement today?",
        quickReplies: [
          { id: "moving_well", label: "Moving well", type: "normal" },
          {
            id: "moving_carefully",
            label: "Moving carefully",
            type: "normal",
          },
          {
            id: "movement_difficult",
            label: "Movement is difficult",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          moving_well: ["Good progress."],
          moving_carefully: ["That can still be part of recovery."],
          movement_difficult: [
            "Thanks for sharing that.",
            "Our care team will review this.",
          ],
        },
        escalationTriggerReplyIds: ["movement_difficult"],
      },
      {
        id: "hr_day_14",
        label: "Day 14",
        title: "Activity Progression",
        dayOffset: 14,
        objective: "Assess return to light daily activity.",
        openingMessages: ["Hi Neha, this is your 2-week check-in."],
        question: "How are you managing light daily activity?",
        quickReplies: [
          {
            id: "doing_light_tasks",
            label: "Doing light tasks",
            type: "normal",
          },
          { id: "still_limited", label: "Still limited", type: "normal" },
          {
            id: "activity_problem",
            label: "Having significant difficulty",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          doing_light_tasks: ["That is encouraging."],
          still_limited: ["Thanks for sharing. Recovery can still be in progress."],
          activity_problem: [
            "Thanks for letting us know.",
            "Our team will review this and contact you.",
          ],
        },
        escalationTriggerReplyIds: ["activity_problem"],
      },
      {
        id: "hr_week_4",
        label: "Week 4",
        title: "Functional Recovery Review",
        dayOffset: 28,
        objective: "Check ongoing pain and function.",
        openingMessages: ["Hi Neha, this is your Week 4 recovery check-in."],
        question: "How is your recovery feeling now?",
        quickReplies: [
          { id: "much_better", label: "Much better", type: "normal" },
          {
            id: "improving_slowly",
            label: "Improving slowly",
            type: "normal",
          },
          {
            id: "still_concerned",
            label: "Still concerned",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          much_better: ["That is good progress."],
          improving_slowly: [
            "Thanks for sharing. We will continue through the final stage.",
          ],
          still_concerned: [
            "Thanks for letting us know.",
            "Our care team will review this.",
          ],
        },
        escalationTriggerReplyIds: ["still_concerned"],
      },
      {
        id: "hr_week_6",
        label: "Week 6",
        title: "Final Recovery Review",
        dayOffset: 42,
        objective: "Close the structured journey.",
        openingMessages: ["Hi Neha, this is your final structured recovery check-in."],
        question: "How would you describe your recovery overall?",
        quickReplies: [
          { id: "recovered_well", label: "Recovered well", type: "normal" },
          {
            id: "mostly_recovered",
            label: "Mostly recovered",
            type: "normal",
          },
          {
            id: "ongoing_concern",
            label: "I still have concerns",
            type: "red_flag",
          },
        ],
        followUpByReply: {
          recovered_well: [
            "That is great to hear.",
            "Your structured recovery journey is now complete.",
          ],
          mostly_recovered: [
            "Glad to hear recovery is progressing.",
            "Please continue any doctor-advised follow-up.",
          ],
          ongoing_concern: [
            "Thanks for sharing that.",
            "Our team will review this and guide the next step.",
          ],
        },
        escalationTriggerReplyIds: ["ongoing_concern"],
      },
    ],
  },
};

export const programOrder = ["c_section", "gallbladder", "hernia"] as const;
