import { useState } from "react";
import { Plus, X } from "lucide-react";
import { TRACKS, trackById, type TrackId } from "@/lib/data";
import type { Task } from "@/lib/study";

export function TaskList({
  tasks,
  onAdd,
  onToggle,
  onRemove,
}: {
  tasks: Task[];
  onAdd: (text: string, track: TrackId) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [text, setText] = useState("");
  const [track, setTrack] = useState<TrackId>("jee");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, track);
    setText("");
  };

  return (
    <section className="panel p-6">
      <p className="eyebrow">Catch list</p>
      <h2 className="mt-1 font-display text-xl font-semibold">Doubts &amp; loose ends</h2>

      <form onSubmit={submit} className="mt-5 flex flex-wrap gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Revisit inverse trig doubts"
          className="min-w-0 flex-1 rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
        />
        <select
          value={track}
          onChange={(e) => setTrack(e.target.value as TrackId)}
          className="rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-ring"
        >
          {TRACKS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">
          Nothing pending. Add a doubt the moment it appears so it does not break your flow.
        </p>
      ) : (
        <ul className="mt-5 space-y-1.5">
          {tasks.map((task) => {
            const t = trackById(task.track);
            return (
              <li key={task.id} className="group flex items-center gap-3 rounded-lg px-1 py-1.5">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => onToggle(task.id)}
                  className="h-4 w-4 shrink-0 accent-[var(--mint)]"
                />
                <span className={`h-2 w-2 shrink-0 rounded-full ${t.dot}`} />
                <span
                  className={
                    task.done
                      ? "min-w-0 flex-1 truncate text-sm text-muted-foreground line-through"
                      : "min-w-0 flex-1 truncate text-sm"
                  }
                >
                  {task.text}
                </span>
                <button
                  onClick={() => onRemove(task.id)}
                  aria-label="Remove"
                  className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
