import { createFileRoute } from "@tanstack/react-router";
import { Check, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TRACKS, type TrackId } from "@/lib/data";
import { useLocalState } from "@/lib/local-store";
import { dateKey, formatMinutes, useMinuteLog } from "@/lib/study";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skill Tracks — Coding, English & Share Market Habits" },
      {
        name: "description",
        content:
          "Daily habit checklist and time logging for coding practice, fluent English, share market study and personal time alongside JEE prep.",
      },
      { property: "og:title", content: "Skill Tracks — Coding, English & Share Market Habits" },
      {
        property: "og:description",
        content: "Keep coding, English, market study and personal time moving every single day.",
      },
    ],
  }),
  component: Skills,
});

const HABITS: Record<TrackId, string[]> = {
  jee: ["20 problems solved", "Error log updated", "Formula sheet revised"],
  code: ["One DSA problem", "30 min project work", "Read documentation"],
  english: ["Read aloud 15 min", "10 new words", "Speak 5 min on one topic"],
  market: ["Watch market open/close", "Study one chart", "Journal one trade idea"],
  personal: ["Watch something useful", "Competition practice", "Sleep before 12"],
};

const QUICK = [15, 30, 60];

function Skills() {
  const { today, addMinutes } = useMinuteLog();
  const [checks, setChecks] = useLocalState<Record<string, string[]>>("fd:habits", {});
  const day = dateKey();
  const doneToday = checks[day] ?? [];

  const toggle = (habit: string) =>
    setChecks((prev) => {
      const current = prev[day] ?? [];
      return {
        ...prev,
        [day]: current.includes(habit)
          ? current.filter((h) => h !== habit)
          : [...current, habit],
      };
    });

  return (
    <AppShell>
      <p className="eyebrow">Skill tracks</p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
        JEE is the priority. These keep compounding.
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Small daily reps beat long weekend bursts. Tick a habit, or log the time straight into
        today&apos;s balance.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {TRACKS.map((track) => {
          const minutes = today[track.id] ?? 0;
          const habits = HABITS[track.id];
          return (
            <article key={track.id} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                    <span className={`h-2.5 w-2.5 rounded-full ${track.dot}`} />
                    {track.name}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">{track.blurb}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums ${track.soft} ${track.text}`}>
                  {formatMinutes(minutes)} today
                </span>
              </div>

              <ul className="mt-4 space-y-1.5">
                {habits.map((habit) => {
                  const id = `${track.id}:${habit}`;
                  const done = doneToday.includes(id);
                  return (
                    <li key={id}>
                      <button
                        onClick={() => toggle(id)}
                        className="flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left"
                      >
                        <span
                          className={
                            done
                              ? `grid h-4.5 w-4.5 shrink-0 place-items-center rounded ${track.bar}`
                              : "grid h-4.5 w-4.5 shrink-0 place-items-center rounded border border-border"
                          }
                        >
                          {done && <Check className="h-3 w-3 text-primary-foreground" />}
                        </span>
                        <span
                          className={
                            done ? "text-sm text-muted-foreground line-through" : "text-sm"
                          }
                        >
                          {habit}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-4">
                <span className="mr-auto text-xs text-muted-foreground">Log time</span>
                {QUICK.map((m) => (
                  <button
                    key={m}
                    onClick={() => addMinutes(track.id, m)}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
                  >
                    <Plus className="h-3 w-3" />
                    {m}m
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
