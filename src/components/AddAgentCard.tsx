import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddAgentCardProps {
  disabled: boolean;
  onAdd: (name: string, weight: number) => void;
}

export function AddAgentCard({ disabled, onAdd }: AddAgentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState(1);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onAdd(name.trim(), weight);
    setName("");
    setWeight(1);
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className="flex min-h-55 items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-400 transition-colors hover:border-indigo-300 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="size-4" />
        Add agent
      </button>
    );
  }

  return (
    <Card className="py-4">
      <CardContent>
        <form onSubmit={handleSubmit}>
          <p className="text-sm font-semibold text-slate-900">New agent</p>

          <label className="mt-3 block text-xs text-slate-500">
            Name
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Agent C"
              className="mt-1"
            />
          </label>

          <label className="mt-3 block text-xs text-slate-500">
            Weight
            <Input
              type="number"
              min={1}
              value={weight}
              onChange={(e) => setWeight(Math.max(1, Math.round(Number(e.target.value)) || 1))}
              className="mt-1"
            />
          </label>

          <div className="mt-3 flex gap-2">
            <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
              Add
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
