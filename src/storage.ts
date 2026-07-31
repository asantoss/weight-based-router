import type { AgentState, AssignmentResult } from "./types";

const STORAGE_KEY = "weighted-router-session";

export interface StoredSession {
  agents: AgentState[];
  round: number;
  history: AssignmentResult[];
  lastWinnerId: string | null;
}

let cached: StoredSession | null | undefined;

export function loadSession(): StoredSession | null {
  if (cached !== undefined) return cached;
  let result: StoredSession | null = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && Array.isArray(parsed.agents) && Array.isArray(parsed.history)) {
      result = parsed;
    }
  } catch {
    result = null;
  }
  cached = result;
  return result;
}

export function saveSession(session: StoredSession): void {
  cached = session;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage unavailable (private mode, quota exceeded) — session just won't persist.
  }
}

export function clearSession(): void {
  cached = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
