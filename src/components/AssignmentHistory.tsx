import type { AssignmentResult } from "../types";
import { HISTORY_DISPLAY_LIMIT } from "../constants";

interface AssignmentHistoryProps {
  history: AssignmentResult[];
}

export function AssignmentHistory({ history }: AssignmentHistoryProps) {
  const recent = history.slice(-HISTORY_DISPLAY_LIMIT);
  const tableRows = [...recent].reverse();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-900">Assignment history</h2>

      {history.length === 0 ? (
        <p className="mt-2 text-sm text-slate-400">No assignments yet. Click "Next Assignment" to begin.</p>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm">
            {recent.map((r, i) => (
              <span key={`${r.round}-chip`} className="flex items-center gap-1.5">
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                  {r.winnerId}
                </span>
                {i < recent.length - 1 && <span className="text-slate-300">→</span>}
              </span>
            ))}
          </div>

          <div className="mt-4 max-h-64 overflow-y-auto rounded-lg border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Round</th>
                  <th className="px-3 py-2 font-medium">Agent</th>
                  <th className="px-3 py-2 font-medium">Score before</th>
                  <th className="px-3 py-2 font-medium">Total weight</th>
                  <th className="px-3 py-2 font-medium">Final score</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr key={r.round} className="border-t border-slate-100">
                    <td className="px-3 py-1.5 text-slate-500 tabular-nums">{r.round}</td>
                    <td className="px-3 py-1.5 font-semibold text-slate-800">{r.winnerName}</td>
                    <td className="px-3 py-1.5 tabular-nums text-slate-600">{r.scoreBeforeSubtraction}</td>
                    <td className="px-3 py-1.5 tabular-nums text-slate-600">-{r.totalEligibleWeight}</td>
                    <td className="px-3 py-1.5 tabular-nums text-slate-600">{r.finalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
