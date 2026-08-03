import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Flame } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { FocusTimer } from "@/components/FocusTimer";
import { TodayBlocks } from "@/components/TodayBlocks";
import { TrackProgress } from "@/components/TrackProgress";
import { TaskList } from "@/components/TaskList";
import { BOOKS } from "@/lib/data";
import { formatMinutes, useBookProgress, useMinuteLog, useTasks, useTodayBlocks } from "@/lib/study";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Focus Deck — Your JEE & Skills Study Dashboard" },
      {
        name: "description",
        content:
          "A daily study dashboard for JEE preparation: focus timer, today's plan, Arihant maths library, and trackers for coding, English and share market skills.",
      },
      { property: "og:title", content: "Focus Deck — Your JEE & Skills Study Dashboard" },
      {
        property: "og:description",
        content:
          "Plan today, run focus sessions, read your JEE maths books and keep your coding, English and market habits on track.",
      },
    ],
  }),
  component: Today,
});

function Today() {
  const { today, totalToday, streak, last7, addMinutes } = useMinuteLog();
  const { blocks, doneToday, toggle } = useTodayBlocks();
  const { tasks, add, toggle: toggleTask, remove } = useTasks();
  const { pages } = useBookProgress();

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 5 ? "Still up" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const reading = BOOKS.map((b) => ({ ...b, page: pages[b.slug] ?? 0 }))
    .sort((a, b) => b.page - a.page)
    .slice(0, 3);

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            {now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            {greeting}. Let&apos;s put in the hours.
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="panel-raised px-4 py-3">
            <p className="eyebrow">Logged today</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
              {formatMinutes(totalToday)}
            </p>
          </div>
          <div className="panel-raised px-4 py-3">
            <p className="eyebrow">Streak</p>
            <p className="mt-1 flex items-center gap-1.5 font-display text-2xl font-semibold tabular-nums">
              <Flame className="h-5 w-5 text-primary" />
              {streak}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <FocusTimer onLog={addMinutes} />
          <TodayBlocks blocks={blocks} doneToday={doneToday} onToggle={toggle} />
          <TaskList tasks={tasks} onAdd={add} onToggle={toggleTask} onRemove={remove} />
        </div>

        <div className="space-y-5 lg:col-span-2">
          <TrackProgress today={today} last7={last7} />

          <section className="panel p-6">
            <p className="eyebrow">Pick up where you left</p>
            <h2 className="mt-1 font-display text-xl font-semibold">Continue reading</h2>
            <ul className="mt-5 space-y-2">
              {reading.map((book) => (
                <li key={book.slug}>
                  <Link
                    to="/read/$slug"
                    params={{ slug: book.slug }}
                    className="panel-raised flex items-center gap-3 px-4 py-3 transition-colors hover:border-ring"
                  >
                    <BookOpen className="h-4 w-4 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{book.title}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {book.page > 0
                          ? `Page ${book.page} of ${book.pages}`
                          : `${book.pages} pages · not started`}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/library"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
            >
              Open full library <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
