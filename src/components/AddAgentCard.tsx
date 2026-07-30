import { useState, type FormEvent } from "react";

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
        className="flex min-h-[220px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-400 transition-colors hover:border-indigo-300 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        + Add agent
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-900">New agent</p>

      <label className="mt-3 block text-xs text-slate-500">
        Name
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Agent F"
          className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none"
        />
      </label>

      <label className="mt-3 block text-xs text-slate-500">
        Weight
        <input
          type="number"
          min={1}
          value={weight}
          onChange={(e) => setWeight(Math.max(1, Math.round(Number(e.target.value)) || 1))}
          className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none"
        />
      </label>

      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
