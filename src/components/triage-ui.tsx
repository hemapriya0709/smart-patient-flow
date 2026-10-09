import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Status, Urgency } from "@/lib/triage";
import { cn } from "@/lib/utils";

const URG_CLS: Record<Urgency | "Unassessed", string> = {
  Critical: "bg-critical text-primary-foreground border-critical",
  High: "bg-high-soft text-high border-high",
  Moderate: "bg-moderate-soft text-foreground border-moderate",
  Low: "bg-low-soft text-low border-low",
  Unassessed: "bg-muted text-muted-foreground border-border border-dashed",
};

export function UrgencyBadge({ urgency }: { urgency: Urgency | null }) {
  const key = urgency ?? "Unassessed";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold", URG_CLS[key])}>
      {key === "Critical" && <span aria-hidden>▲</span>}
      {key === "Unassessed" ? "Needs triage" : key}
    </span>
  );
}

const STATUS_CLS: Record<Status, string> = {
  Waiting: "bg-secondary text-secondary-foreground",
  "In Consultation": "bg-accent text-accent-foreground",
  Completed: "bg-muted text-muted-foreground",
};
export function StatusBadge({ status }: { status: Status }) {
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_CLS[status])}>{status}</span>;
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-lg font-bold text-primary-foreground">+</span>
            <span>
              <span className="block font-semibold leading-tight">SmartTriage</span>
              <span className="block text-xs text-muted-foreground">Patient Queue & Emergency Triage</span>
            </span>
          </Link>
          <nav className="flex gap-1 text-sm">
            <Link to="/" className="rounded-md px-3 py-2 hover:bg-muted" activeProps={{ className: "bg-accent text-accent-foreground font-medium" }} activeOptions={{ exact: true }}>Dashboard</Link>
            <Link to="/register" className="rounded-md px-3 py-2 hover:bg-muted" activeProps={{ className: "bg-accent text-accent-foreground font-medium" }}>Register patient</Link>
          </nav>
        </div>
        <div className="border-t border-border bg-moderate-soft px-4 py-2 text-center text-xs text-foreground">
          <strong>Demonstration only.</strong> Fictional patients. Triage categories are recorded by staff using simulated rules — this tool does not diagnose. Real triage requires qualified clinical assessment. Data is stored <strong>locally in this browser</strong> only (no backend, no sync, no login).
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
