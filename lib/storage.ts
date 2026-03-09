import { DemoBootstrap, DemoSession } from "@/lib/types";

const SESSION_KEY = "vital-step-demo-session";
const BOOTSTRAP_KEY = "vital-step-demo-bootstrap";

export const storageKeys = {
  session: SESSION_KEY,
  bootstrap: BOOTSTRAP_KEY,
};

export const readJson = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const writeJson = (key: string, value: unknown): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const clearDemoStorage = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(BOOTSTRAP_KEY);
};

export const readSession = (): DemoSession | null => readJson<DemoSession>(SESSION_KEY);
export const writeSession = (session: DemoSession): void => writeJson(SESSION_KEY, session);

export const readBootstrap = (): DemoBootstrap | null => readJson<DemoBootstrap>(BOOTSTRAP_KEY);
export const writeBootstrap = (bootstrap: DemoBootstrap): void => writeJson(BOOTSTRAP_KEY, bootstrap);
