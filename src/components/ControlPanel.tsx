import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ControlPanelProps {
  onNext: () => void;
  onAutoPlay: () => void;
  onPause: () => void;
  onRun25: () => void;
  onReset: () => void;
  isAutoPlaying: boolean;
  isAnimating: boolean;
  hasEligibleAgents: boolean;
  hasAgents: boolean;
}

export function ControlPanel({
  onNext,
  onAutoPlay,
  onPause,
  onRun25,
  onReset,
  isAutoPlaying,
  isAnimating,
  hasEligibleAgents,
  hasAgents,
}: ControlPanelProps) {
  const actionsDisabled = isAnimating || !hasEligibleAgents || isAutoPlaying;

  return (
    <Card className="py-4">
      <CardContent className="flex flex-wrap items-center gap-2.5">
        <Button
          type="button"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          disabled={actionsDisabled}
          onClick={onNext}
        >
          Next Assignment
        </Button>
        <Button type="button" variant="secondary" disabled={actionsDisabled} onClick={onAutoPlay}>
          Auto Play
        </Button>
        <Button type="button" variant="secondary" disabled={!isAutoPlaying} onClick={onPause}>
          Pause
        </Button>
        <Button type="button" variant="secondary" disabled={actionsDisabled} onClick={onRun25}>
          Run 25 Assignments
        </Button>
        <Button type="button" variant="outline" className="sm:ml-auto" onClick={onReset}>
          Reset
        </Button>
      </CardContent>
      {!hasAgents && (
        <CardContent>
          <p className="text-sm font-medium text-rose-600">
            No agents configured — add an agent below to begin.
          </p>
        </CardContent>
      )}
      {hasAgents && !hasEligibleAgents && (
        <CardContent>
          <p className="text-sm font-medium text-rose-600">
            No agents are eligible — bring at least one agent online to continue.
          </p>
        </CardContent>
      )}
    </Card>
  );
}
