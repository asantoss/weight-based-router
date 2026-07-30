export function ExplanationPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-900">How scoring works</h2>
      <p className="mt-1 text-xs text-slate-500">For each assignment:</p>
      <ol className="mt-2 list-inside list-decimal space-y-1.5 text-sm text-slate-600">
        <li>Every online agent adds their weight to their score.</li>
        <li>The agent with the highest score receives the assignment.</li>
        <li>The total active weight is subtracted from the winner.</li>
        <li>Scores carry forward into the next assignment.</li>
      </ol>

      <div className="mt-3 space-y-1 rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-700">
        <p>newScore = currentScore + weight</p>
        <p>winnerScore = winnerScore - totalActiveWeight</p>
      </div>

      <h3 className="mt-4 text-xs font-semibold tracking-wide text-slate-400 uppercase">Legend</h3>
      <ul className="mt-1.5 space-y-1 text-sm text-slate-600">
        <li>
          <span className="font-semibold text-slate-800">Weight</span> — long-term share
        </li>
        <li>
          <span className="font-semibold text-slate-800">Current Score</span> — temporary routing position
        </li>
        <li>
          <span className="font-semibold text-slate-800">Assigned</span> — actual records received
        </li>
      </ul>
    </div>
  );
}
