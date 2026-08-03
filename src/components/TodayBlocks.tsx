import { Check } from "lucide-react";
import { trackById, type TrackId } from "@/lib/data";
import { formatMinutes } from "@/lib/study";

export function TodayBlocks({
  blocks,
  doneToday,
  onToggle,
}: {
  blocks: { track: TrackId; label: string; minutes: number }[];
  doneToday: number[];
  onToggle: (index: number) => void;
}) {
  return (
    <section className="panel p-6">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Today&apos;s plan</p>
          <h2 className="mt-1 font-display text-xl font-semibold">
            {new Date().toLocaleDateString(undefined, { weekday: "long" })} blocks
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {doneToday.length}/{blocks.length} done
        </p>
      </div>

      <ul className="mt-5 space-y-2">
        {blocks.map((block, i) => {
          const track = trackById(block.track);
          const done = doneToday.includes(i);
          return (
            <li key={`${block.label}-${i}`}>
              <button
                onClick={() => onToggle(i)}
                className="panel-raised flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:border-ring"
              >
                <span
                  className={
                    done
                      ? `grid h-5 w-5 shrink-0 place-items-center rounded-md ${track.bar}`
                      : "grid h-5 w-5 shrink-0 place-items-center rounded-md border border-border"
                  }
                >
                  {done && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={
                      done
                        ? "block truncate text-sm text-muted-foreground line-through"
                        : "block truncate text-sm font-semibold"
                    }
                  >
                    {block.label}
                  </span>
                  <span className={`mt-0.5 block text-xs font-semibold ${track.text}`}>
                    {track.name}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-bold text-muted-foreground tabular-nums">
                  {formatMinutes(block.minutes)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
