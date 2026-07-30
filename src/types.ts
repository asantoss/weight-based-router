export interface Agent {
  id: string;
  name: string;
  weight: number;
}

export interface AgentState extends Agent {
  currentScore: number;
  assignedCount: number;
  lastAssignedRound: number | null;
  online: boolean;
}

export interface AssignmentResult {
  round: number;
  winnerId: string;
  winnerName: string;
  scoreBeforeSubtraction: number;
  totalEligibleWeight: number;
  finalScore: number;
}
