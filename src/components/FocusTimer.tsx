import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { TRACKS, type TrackId } from "@/lib/data";
import { formatMinutes } from "@/lib/study";

const PRESETS = [25, 50, 90];

export function FocusTimer({
  onLog,
}: {
  onLog: (track: TrackId, minutes: number) => void;
}) {
  const [track, setTrack] = useState<TrackId>("jee");
  const [length, setLength] = useState(50);
  const [secondsLeft, setSecondsLeft] = useState(50 * 60);
  const [running, setRunning] = useState(false);
  const loggedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (secondsLeft === 0 && running && !loggedRef.current) {
      loggedRef.current = true;
      setRunning(false);
      onLog(track, length);
    }
  }, [secondsLeft, running, length, track, onLog]);

  const pick = (minutes: number) => {
    setLength(minutes);
    setSecondsLeft(minutes * 60);
    setRunning(false);
    loggedRef.current = false;
  };

  const reset = () => {
    setSecondsLeft(length * 60);
    setRunning(false);
    loggedRef.current = false;
  };

  const stopAndLog = () => {
    const elapsed = Math.round((length * 60 - secondsLeft) / 60);
    if (elapsed > 0) onLog(track, elapsed);
    reset();
  };

  const progress = 1 - secondsLeft / (length * 60);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const active = TRACKS.find((t) => t.id === track)!;

  return (
    <section className="bg-focus-gradient panel relative overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Focus session</p>
          <h2 className="mt-1 font-display text-xl font-semibold">Deep work timer</h2>
        </div>
        <div className="flex gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => pick(p)}
              className={
                p === length
                  ? "rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                  : "rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {p}m
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-6">
        <p className="font-display text-6xl font-semibold tabular-nums leading-none">
          {mm}
          <span className="text-muted-foreground">:</span>
          {ss}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : "Start"}
          </button>
          <button
            onClick={stopAndLog}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Log &amp; end
          </button>
          <button
            onClick={reset}
            aria-label="Reset timer"
            className="grid h-10 w-10 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-background/50">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${active.bar}`}
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {TRACKS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTrack(t.id)}
            className={
              t.id === track
                ? `flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-bold ${t.soft} ${t.text}`
                : "flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
            {t.name}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Finishing the session adds {formatMinutes(length)} to {active.name}.
      </p>
    </section>
  );
}
