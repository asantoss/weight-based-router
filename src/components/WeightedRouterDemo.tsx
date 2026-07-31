import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentState, AssignmentResult } from "../types";
import { AUTO_PLAY_INTERVAL_MS, createInitialAgentState } from "../constants";
import { runWeightedRound } from "../scoring";
import { loadSession, saveSession, clearSession } from "../storage";
import { AgentCard } from "./AgentCard";
import { AddAgentCard } from "./AddAgentCard";
import { ControlPanel } from "./ControlPanel";
import { AssignmentHistory } from "./AssignmentHistory";
import { ExplanationPanel } from "./ExplanationPanel";
import { Card, CardContent } from "@/components/ui/card";

const AGENT_ID_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function nextAgentId(existing: AgentState[]): string {
  const used = new Set(existing.map((a) => a.id));
  for (const letter of AGENT_ID_LETTERS) {
    if (!used.has(letter)) return letter;
  }
  let n = existing.length + 1;
  while (used.has(`Agent-${n}`)) n += 1;
  return `Agent-${n}`;
}

type AnimationStage = "idle" | "adding" | "selecting" | "subtracting";

const ADD_STAGE_MS = 320;
const SELECT_STAGE_MS = 240;
const SUBTRACT_STAGE_MS = 240;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="py-4">
      <CardContent>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}

export function WeightedRouterDemo() {
  const [agents, setAgents] = useState<AgentState[]>(
    () => loadSession()?.agents ?? createInitialAgentState()
  );
  const [displayAgents, setDisplayAgents] = useState<AgentState[]>(
    () => loadSession()?.agents ?? createInitialAgentState()
  );
  const [round, setRound] = useState(() => loadSession()?.round ?? 0);
  const [history, setHistory] = useState<AssignmentResult[]>(() => loadSession()?.history ?? []);
  const [lastWinnerId, setLastWinnerId] = useState<string | null>(
    () => loadSession()?.lastWinnerId ?? null
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [animationStage, setAnimationStage] = useState<AnimationStage>("idle");
  const [pendingResult, setPendingResult] = useState<AssignmentResult | null>(null);

  const agentsRef = useRef(agents);
  const roundRef = useRef(round);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    agentsRef.current = agents;
  }, [agents]);

  useEffect(() => {
    roundRef.current = round;
  }, [round]);

  useEffect(() => {
    saveSession({ agents, round, history, lastWinnerId });
  }, [agents, round, history, lastWinnerId]);

  const runSingleRoundAnimated = useCallback(async () => {
    if (isAnimatingRef.current) return;
    const prevAgents = agentsRef.current;
    if (!prevAgents.some((a) => a.online)) {
      setIsAutoPlaying(false);
      return;
    }

    isAnimatingRef.current = true;
    setIsAnimating(true);

    const nextRound = roundRef.current + 1;
    const { agents: nextAgents, result } = runWeightedRound(prevAgents, nextRound);
    setPendingResult(result);

    const bumped = prevAgents.map((a) =>
      a.online ? { ...a, currentScore: a.currentScore + a.weight } : a
    );
    setDisplayAgents(bumped);
    setAnimationStage("adding");
    await wait(ADD_STAGE_MS);

    setAnimationStage("selecting");
    await wait(SELECT_STAGE_MS);

    setDisplayAgents(nextAgents);
    setAnimationStage("subtracting");
    await wait(SUBTRACT_STAGE_MS);

    setAgents(nextAgents);
    setRound(nextRound);
    setHistory((h) => [...h, result]);
    setLastWinnerId(result.winnerId);
    setPendingResult(null);
    setAnimationStage("idle");
    setIsAnimating(false);
    isAnimatingRef.current = false;
  }, []);

  const runBatch = useCallback((count: number) => {
    if (isAnimatingRef.current) return;
    let currentAgents = agentsRef.current;
    let currentRound = roundRef.current;
    if (!currentAgents.some((a) => a.online)) return;

    const newResults: AssignmentResult[] = [];
    for (let i = 0; i < count; i++) {
      if (!currentAgents.some((a) => a.online)) break;
      currentRound += 1;
      const { agents: nextAgents, result } = runWeightedRound(currentAgents, currentRound);
      currentAgents = nextAgents;
      newResults.push(result);
    }

    setAgents(currentAgents);
    setRound(currentRound);
    if (newResults.length > 0) {
      setHistory((h) => [...h, ...newResults]);
      setLastWinnerId(newResults[newResults.length - 1].winnerId);
    }
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const id = setInterval(() => {
      runSingleRoundAnimated();
    }, AUTO_PLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isAutoPlaying, runSingleRoundAnimated]);

  const handleToggleOnline = useCallback((id: string) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, online: !a.online } : a)));
  }, []);

  const handleWeightChange = useCallback((id: string, weight: number) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, weight } : a)));
  }, []);

  const handleAddAgent = useCallback((name: string, weight: number) => {
    setAgents((prev) => {
      const id = nextAgentId(prev);
      const newAgent: AgentState = {
        id,
        name: name || `Agent ${id}`,
        weight: Math.min(99, Math.max(1, Math.round(weight) || 1)),
        currentScore: 0,
        assignedCount: 0,
        lastAssignedRound: null,
        online: true,
      };
      return [...prev, newAgent];
    });
  }, []);

  const handleRemoveAgent = useCallback((id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    setLastWinnerId((prev) => (prev === id ? null : prev));
  }, []);

  const handleReset = useCallback(() => {
    setIsAutoPlaying(false);
    isAnimatingRef.current = false;
    setIsAnimating(false);
    setAnimationStage("idle");
    setPendingResult(null);
    clearSession();
    const initial = createInitialAgentState();
    setAgents(initial);
    setDisplayAgents(initial);
    setRound(0);
    setHistory([]);
    setLastWinnerId(null);
  }, []);

  const hasEligibleAgents = agents.some((a) => a.online);
  const totalEligibleWeight = agents.filter((a) => a.online).reduce((sum, a) => sum + a.weight, 0);
  const totalAssignments = history.length;
  const maxAssignedCount = Math.max(1, ...agents.map((a) => a.assignedCount));
  const mostRecentWinnerName =
    history.length > 0 ? history[history.length - 1].winnerName : "—";

  const visibleAgents = isAnimating ? displayAgents : agents;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Weighted Round-Robin Demo</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
          Higher-weight agents accumulate score faster and receive a larger share of assignments over
          time.
        </p>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Current round" value={round} />
        <SummaryCard label="Total assignments" value={totalAssignments} />
        <SummaryCard label="Total active weight" value={totalEligibleWeight} />
        <SummaryCard label="Most recent winner" value={mostRecentWinnerName} />
      </section>

      <section className="mt-4">
        <ControlPanel
          onNext={runSingleRoundAnimated}
          onAutoPlay={() => setIsAutoPlaying(true)}
          onPause={() => setIsAutoPlaying(false)}
          onRun25={() => runBatch(25)}
          onReset={handleReset}
          isAutoPlaying={isAutoPlaying}
          isAnimating={isAnimating}
          hasEligibleAgents={hasEligibleAgents}
          hasAgents={agents.length > 0}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleAgents.map((agent) => {
          const isWinner = isAnimating
            ? animationStage !== "adding" && agent.id === pendingResult?.winnerId
            : agent.id === lastWinnerId;

          const deltaLabel =
            animationStage === "adding" && agent.online
              ? `+${agent.weight}`
              : animationStage === "subtracting" && agent.id === pendingResult?.winnerId
                ? `-${pendingResult.totalEligibleWeight}`
                : null;

          const stageLabel =
            animationStage === "selecting" && agent.id === pendingResult?.winnerId
              ? "Highest Score"
              : null;

          return (
            <AgentCard
              key={agent.id}
              agent={agent}
              targetPercent={totalEligibleWeight > 0 ? (agent.weight / totalEligibleWeight) * 100 : 0}
              actualPercent={totalAssignments > 0 ? (agent.assignedCount / totalAssignments) * 100 : 0}
              isWinner={isWinner}
              maxAssignedCount={maxAssignedCount}
              deltaLabel={deltaLabel}
              stageLabel={stageLabel}
              disabled={isAnimating}
              onToggleOnline={handleToggleOnline}
              onWeightChange={handleWeightChange}
              onRemove={handleRemoveAgent}
            />
          );
        })}
        <AddAgentCard disabled={isAnimating} onAdd={handleAddAgent} />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AssignmentHistory history={history} />
        </div>
        <ExplanationPanel />
      </section>
    </div>
  );
}
