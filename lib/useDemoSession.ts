"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createSession,
  forceNormal,
  forceRedFlag,
  jumpToDay,
  logCallback,
  resolveEscalation,
  selectReply,
  switchProgram,
} from "@/lib/demoEngine";
import {
  clearDemoStorage,
  readBootstrap,
  readSession,
  writeBootstrap,
  writeSession,
} from "@/lib/storage";
import { DemoBootstrap, DemoSession, QuickReply } from "@/lib/types";

const defaultBootstrap: DemoBootstrap = {
  programId: "c_section",
  scenario: "normal",
  riskTier: "Standard",
};

export const useDemoSession = () => {
  const [session, setSession] = useState<DemoSession | null>(null);

  useEffect(() => {
    const stored = readSession();
    if (stored) {
      setSession(stored);
      return;
    }

    const bootstrap = readBootstrap() ?? defaultBootstrap;
    const created = createSession(bootstrap);
    writeSession(created);
    setSession(created);
  }, []);

  const commit = useCallback((nextSession: DemoSession) => {
    setSession(nextSession);
    writeSession(nextSession);
  }, []);

  const resetWithBootstrap = useCallback((bootstrap: DemoBootstrap) => {
    writeBootstrap(bootstrap);
    const created = createSession(bootstrap);
    writeSession(created);
    setSession(created);
  }, []);

  const actions = useMemo(
    () => ({
      selectReply: (reply: QuickReply) => {
        if (!session) return;
        commit(selectReply(session, reply));
      },
      jumpToDay: (day: number) => {
        if (!session) return;
        commit(jumpToDay(session, day));
      },
      forceNormal: () => {
        if (!session) return;
        commit(forceNormal(session));
      },
      forceRedFlag: () => {
        if (!session) return;
        commit(forceRedFlag(session));
      },
      logCallback: () => {
        if (!session) return;
        commit(logCallback(session));
      },
      resolveEscalation: () => {
        if (!session) return;
        commit(resolveEscalation(session));
      },
      switchProgram: (programId: string) => {
        if (!session) return;
        commit(switchProgram(session, programId));
      },
      reset: () => {
        const bootstrap = readBootstrap() ?? defaultBootstrap;
        resetWithBootstrap(bootstrap);
      },
      resetAll: () => {
        clearDemoStorage();
        const created = createSession(defaultBootstrap);
        writeBootstrap(defaultBootstrap);
        writeSession(created);
        setSession(created);
      },
    }),
    [commit, resetWithBootstrap, session],
  );

  return { session, actions };
};
