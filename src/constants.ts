import type { Agent, AgentState } from "./types";

export const INITIAL_AGENTS: Agent[] = [
  { id: "A", name: "Agent A", weight: 3 },
  { id: "B", name: "Agent B", weight: 1 },
];

export function createInitialAgentState(): AgentState[] {
  return INITIAL_AGENTS.map((agent) => ({
    ...agent,
    currentScore: 0,
    assignedCount: 0,
    lastAssignedRound: null,
    online: true,
  }));
}

export const AUTO_PLAY_INTERVAL_MS = 900;
export const ANIMATION_DURATION_MS = 800;
export const HISTORY_DISPLAY_LIMIT = 50;
