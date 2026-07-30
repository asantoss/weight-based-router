import { X } from "lucide-react";
import type { AgentState } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: AgentState;
  targetPercent: number;
  actualPercent: number;
  isWinner: boolean;
  maxAssignedCount: number;
  deltaLabel: string | null;
  stageLabel: string | null;
  disabled: boolean;
  onToggleOnline: (id: string) => void;
  onWeightChange: (id: string, weight: number) => void;
  onRemove: (id: string) => void;
}

export function AgentCard({
  agent,
  targetPercent,
  actualPercent,
  isWinner,
  maxAssignedCount,
  deltaLabel,
  stageLabel,
  disabled,
  onToggleOnline,
  onWeightChange,
  onRemove,
}: AgentCardProps) {
  const barWidth = maxAssignedCount > 0 ? (agent.assignedCount / maxAssignedCount) * 100 : 0;

  return (
    <Card
      className={cn(
        "relative gap-3 overflow-visible py-4 ring-1 transition-colors duration-300",
        isWinner ? "bg-indigo-50 ring-2 ring-indigo-400" : "ring-slate-200",
        !agent.online && "opacity-60"
      )}
    >
      {isWinner && (
        <Badge className="absolute -top-2 -right-2 border-none bg-indigo-600 text-white shadow">
          Latest winner
        </Badge>
      )}

      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
            {agent.id}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              Weight
              <Input
                type="number"
                min={1}
                max={99}
                value={agent.weight}
                disabled={disabled}
                onChange={(e) => {
                  const parsed = Math.round(Number(e.target.value));
                  if (!Number.isNaN(parsed)) {
                    onWeightChange(agent.id, Math.min(99, Math.max(1, parsed)));
                  }
                }}
                className="h-6 w-14 px-1.5 text-xs font-semibold"
              />
            </label>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Remove ${agent.name}`}
            disabled={disabled}
            onClick={() => onRemove(agent.id)}
            className="text-slate-400 hover:bg-rose-50 hover:text-rose-500"
          >
            <X />
          </Button>
          <Switch
            aria-label={`${agent.name} ${agent.online ? "online" : "offline"}`}
            checked={agent.online}
            disabled={disabled}
            onCheckedChange={() => onToggleOnline(agent.id)}
            className="data-checked:bg-indigo-600"
          />
        </div>
      </CardContent>

      <CardContent className="flex items-end justify-between">
        <div>
          <p className="text-xs text-slate-500">Current score</p>
          <p className="relative inline-block text-2xl font-bold tabular-nums text-slate-900">
            {agent.currentScore}
            {deltaLabel && (
              <span
                key={deltaLabel + agent.currentScore}
                className={cn(
                  "absolute -top-2 left-full ml-1 animate-[float-up_0.7s_ease-out] text-sm font-semibold whitespace-nowrap",
                  deltaLabel.startsWith("-") ? "text-rose-500" : "text-emerald-500"
                )}
              >
                {deltaLabel}
              </span>
            )}
          </p>
        </div>
        {stageLabel && (
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
            {stageLabel}
          </Badge>
        )}
      </CardContent>

      <CardContent className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-slate-400">Target %</p>
          <p className="font-semibold text-slate-800">{targetPercent.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-slate-400">Actual %</p>
          <p className="font-semibold text-slate-800">{actualPercent.toFixed(1)}%</p>
        </div>
      </CardContent>

      <CardContent>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Assigned</span>
          <span className="tabular-nums">{agent.assignedCount}</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
