import type { AgentState, AssignmentResult } from "./types";

export function runWeightedRound(
  agents: AgentState[],
  round: number
): { agents: AgentState[]; result: AssignmentResult } {
  const eligible = agents.filter((a) => a.online);
  if (eligible.length === 0) {
    throw new Error("runWeightedRound requires at least one online agent");
  }

  const totalEligibleWeight = eligible.reduce((sum, a) => sum + a.weight, 0);

  const bumped = agents.map((a) =>
    a.online ? { ...a, currentScore: a.currentScore + a.weight } : a
  );

  const eligibleBumped = bumped.filter((a) => a.online);
  const winner = eligibleBumped.reduce((best, candidate) => {
    if (candidate.currentScore !== best.currentScore) {
      return candidate.currentScore > best.currentScore ? candidate : best;
    }
    const bestRound = best.lastAssignedRound ?? -Infinity;
    const candidateRound = candidate.lastAssignedRound ?? -Infinity;
    if (candidateRound !== bestRound) {
      return candidateRound < bestRound ? candidate : best;
    }
    return best;
  });

  const scoreBeforeSubtraction = winner.currentScore;
  const finalScore = scoreBeforeSubtraction - totalEligibleWeight;

  const updatedAgents = bumped.map((a) =>
    a.id === winner.id
      ? {
          ...a,
          currentScore: finalScore,
          assignedCount: a.assignedCount + 1,
          lastAssignedRound: round,
        }
      : a
  );

  const result: AssignmentResult = {
    round,
    winnerId: winner.id,
    winnerName: winner.name,
    scoreBeforeSubtraction,
    totalEligibleWeight,
    finalScore,
  };

  return { agents: updatedAgents, result };
}
