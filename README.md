# Vital Step Recovery Journeys Demo

Mobile-first PWA demo built with Next.js, TypeScript, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Demo flow

- `/` Landing screen
  - Program selection (C-Section, Gallbladder, Hernia)
  - Scenario selection (Normal / Red Flag)
  - Risk tier selection (Standard / High Risk)
  - Start Demo and Reset Demo
- `/journey` Journey screen
  - Patient header with progress
  - Milestone timeline/cards
  - Fake WhatsApp-style chat with quick replies
  - Escalation banner and escalation details
  - Presenter controls (desktop panel, mobile drawer)

## Key architecture

- Reusable program templates: `lib/programTemplates.ts`
- Domain types: `lib/types.ts`
- Event-driven state engine: `lib/demoEngine.ts`
- Local storage state persistence: `lib/storage.ts`, `lib/useDemoSession.ts`
- Reusable UI components: `components/*`
- PWA manifest and icons: `app/manifest.ts`, `public/icons/*`

## Notes

- This is intentionally a demo-only app (no backend/auth/analytics/export).
- State is in-memory + localStorage for easy reset and time-travel style presentation.
