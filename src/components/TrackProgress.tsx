import { TRACKS, type TrackId } from "@/lib/data";
import { formatMinutes } from "@/lib/study";

export function TrackProgress({
  today,
  last7,
}: {
  today: Partial<Record<TrackId, number>>;
  last7: { key: string; label: string; total: number }[];
}) {
  const peak = Math.max(120, ...last7.map((d) => d.total));

  return (
    <section className="panel p-6">
      <p className="eyebrow">Time balance</p>
      <h2 className="mt-1 font-display text-xl font-semibold">Where your hours went</h2>

      <ul className="mt-5 space-y-4">
        {TRACKS.map((track) => {
          const minutes = today[track.id] ?? 0;
          const pct = Math.min(100, (minutes / track.target) * 100);
          return (
            <li key={track.id}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-semibold">
                  <span className={`h-2 w-2 rounded-full ${track.dot}`} />
                  {track.name}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {formatMinutes(minutes)} / {formatMinutes(track.target)}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-[width] duration-500 ${track.bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-7 border-t border-border pt-5">
        <p className="eyebrow">Last 7 days</p>
        <div className="mt-3 flex h-24 items-end gap-2">
          {last7.map((day) => (
            <div key={day.key} className="flex flex-1 flex-col items-center gap-2">
              <div
                title={formatMinutes(day.total)}
                className={
                  day.total > 0
                    ? "bg-mint-gradient w-full rounded-t-sm"
                    : "w-full rounded-t-sm bg-muted"
                }
                style={{ height: `${Math.max(3, (day.total / peak) * 100)}%` }}
              />
              <span className="text-[10px] font-bold text-muted-foreground">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
