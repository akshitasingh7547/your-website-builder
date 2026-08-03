import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BOOKS } from "@/lib/data";
import { useBookProgress } from "@/lib/study";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Maths Library — Arihant Skills in Mathematics for JEE" },
      {
        name: "description",
        content:
          "Read all seven Arihant Skills in Mathematics books for JEE in one place: Algebra, Calculus, Coordinate Geometry, Trigonometry, Vectors and Play with Graphs.",
      },
      { property: "og:title", content: "Maths Library — Arihant Skills in Mathematics for JEE" },
      {
        property: "og:description",
        content: "Your seven JEE maths books with per-book page progress tracking.",
      },
    ],
  }),
  component: Library,
});

function Library() {
  const { pages, setPage } = useBookProgress();

  return (
    <AppShell>
      <p className="eyebrow">Library</p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
        Seven books, one syllabus
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Open a book to read it right here, and set the page you reached so tomorrow starts without
        hunting.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {BOOKS.map((book) => {
          const page = pages[book.slug] ?? 0;
          const pct = Math.min(100, (page / book.pages) * 100);
          return (
            <article key={book.slug} className="panel flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">{book.subject}</p>
                  <h2 className="mt-1.5 font-display text-lg font-semibold">{book.title}</h2>
                </div>
                <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[11px] font-bold text-muted-foreground tabular-nums">
                  {book.pages} pp
                </span>
              </div>

              <ul className="mt-3 flex flex-wrap gap-1.5">
                {book.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground"
                  >
                    {topic}
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="bg-mint-gradient h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground tabular-nums">
                  {page > 0 ? `${Math.round(pct)}% · page ${page}` : "Not started"}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  to="/read/$slug"
                  params={{ slug: book.slug }}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <BookOpen className="h-4 w-4" /> Read
                </Link>
                <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                  On page
                  <input
                    type="number"
                    min={0}
                    max={book.pages}
                    value={page || ""}
                    onChange={(e) => setPage(book.slug, Number(e.target.value))}
                    className="w-20 rounded-md border border-input bg-background/60 px-2 py-1.5 text-sm tabular-nums text-foreground outline-none focus:border-ring"
                  />
                </label>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
