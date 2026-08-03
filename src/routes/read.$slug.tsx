import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { bookBySlug } from "@/lib/data";
import { useBookProgress, useMinuteLog } from "@/lib/study";

export const Route = createFileRoute("/read/$slug")({
  loader: ({ params }) => {
    const book = bookBySlug(params.slug);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Book unavailable — Focus Deck" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.book.title} — Read for JEE`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Read ${loaderData.book.title} from the Arihant Skills in Mathematics series and log the page you reached.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: `Read ${loaderData.book.title} and track your page progress.`,
        },
      ],
    };
  },
  component: Reader,
  notFoundComponent: BookNotFound,
});

function Reader() {
  const { book } = Route.useLoaderData();
  const { pages, setPage } = useBookProgress();
  const { addMinutes } = useMinuteLog();
  const page = pages[book.slug] ?? 0;

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/library"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Library
          </Link>
          <h1 className="mt-2 font-display text-3xl font-semibold">{book.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {book.subject} · {book.pages} pages
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
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
          <button
            onClick={() => addMinutes("jee", 30)}
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            +30m reading
          </button>
          <a
            href={book.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open full screen <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="panel mt-6 overflow-hidden p-1.5">
        <object
          data={`${book.url}#page=${page > 0 ? page : 1}`}
          type="application/pdf"
          className="h-[78vh] w-full rounded-lg bg-muted"
          aria-label={`${book.title} PDF reader`}
        >
          <div className="grid h-[78vh] place-items-center px-6 text-center">
            <p className="text-sm text-muted-foreground">
              Your browser can&apos;t display this PDF inline.{" "}
              <a href={book.url} target="_blank" rel="noreferrer" className="text-primary underline">
                Open {book.title} in a new tab
              </a>
              .
            </p>
          </div>
        </object>
      </div>
    </AppShell>
  );
}

function BookNotFound() {
  return (
    <AppShell>
      <h1 className="font-display text-3xl font-semibold">Book not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That book isn&apos;t in your library yet.
      </p>
      <Link
        to="/library"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
      >
        Back to library
      </Link>
    </AppShell>
  );
}
