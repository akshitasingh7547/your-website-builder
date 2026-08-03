import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Today" },
  { to: "/library", label: "Library" },
  { to: "/skills", label: "Skills" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="bg-mint-gradient grid h-7 w-7 place-items-center rounded-md font-display text-sm font-bold text-primary-foreground">
              F
            </span>
            <span className="font-display text-base font-semibold">Focus Deck</span>
          </Link>
          <nav className="ml-auto flex items-center gap-1 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground font-semibold" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      <footer className="mx-auto max-w-6xl px-5 pb-10 pt-4 text-xs text-muted-foreground">
        Everything you log stays on this device.
      </footer>
    </div>
  );
}
