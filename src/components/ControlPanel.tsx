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

const baseButton =
  "rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const primaryButton = `${baseButton} bg-indigo-600 text-white hover:bg-indigo-700`;
const secondaryButton = `${baseButton} bg-slate-100 text-slate-700 hover:bg-slate-200`;
const ghostButton = `${baseButton} border border-slate-200 bg-white text-slate-600 hover:bg-slate-50`;

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
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <button type="button" className={primaryButton} disabled={actionsDisabled} onClick={onNext}>
          Next Assignment
        </button>
        <button type="button" className={secondaryButton} disabled={actionsDisabled} onClick={onAutoPlay}>
          Auto Play
        </button>
        <button type="button" className={secondaryButton} disabled={!isAutoPlaying} onClick={onPause}>
          Pause
        </button>
        <button type="button" className={secondaryButton} disabled={actionsDisabled} onClick={onRun25}>
          Run 25 Assignments
        </button>
        <button type="button" className={`${ghostButton} sm:ml-auto`} onClick={onReset}>
          Reset
        </button>
      </div>
      {!hasAgents && (
        <p className="mt-3 text-sm font-medium text-rose-600">
          No agents configured — add an agent below to begin.
        </p>
      )}
      {hasAgents && !hasEligibleAgents && (
        <p className="mt-3 text-sm font-medium text-rose-600">
          No agents are eligible — bring at least one agent online to continue.
        </p>
      )}
    </div>
  );
}
