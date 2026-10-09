import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
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
  return <span className={cn("whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_CLS[status])}>{status}</span>;
}

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className="flex items-center gap-2">
      <span className={cn("grid place-items-center rounded-lg bg-primary font-bold text-primary-foreground", size === "lg" ? "h-11 w-11 text-2xl" : "h-8 w-8 text-lg")}>
        <span className="text-teal">+</span>
      </span>
      <span>
        <span className={cn("block font-semibold leading-tight text-primary", size === "lg" && "text-xl")}>MediQueue</span>
        <span className="block text-xs text-muted-foreground">Patient Queue & Emergency Triage</span>
      </span>
    </span>
  );
}

const NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/register", label: "Register Patient" },
  { to: "/queue", label: "Patient Queue" },
  { to: "/about", label: "About MediQueue" },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {NAV.map((n) => (
        <Link key={n.to} to={n.to} onClick={onNavigate}
          className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
          activeProps={{ className: "bg-accent font-medium text-accent-foreground" }}>
          {n.label}
        </Link>
      ))}
    </>
  );
}

export const DEMO_NOTICE = "Demonstration only — fictional patients. Triage categories are recorded by staff; this tool does not diagnose. Data is stored locally in this browser (no backend, no sync, no login).";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="hidden w-60 shrink-0 border-r border-border p-4 md:block">
        <Link to="/" aria-label="MediQueue home"><Logo /></Link>
        <nav aria-label="Main" className="mt-8 space-y-1"><NavLinks /></nav>
      </aside>
      <header className="border-b border-border md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" aria-label="MediQueue home"><Logo /></Link>
          <button className="rounded-md border border-border px-3 py-1.5 text-sm" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
        {open && <nav id="mobile-nav" aria-label="Main" className="space-y-1 px-4 pb-3"><NavLinks onNavigate={() => setOpen(false)} /></nav>}
      </header>
      <div className="min-w-0 flex-1">
        <p className="border-b border-border bg-moderate-soft px-4 py-2 text-xs text-foreground">{DEMO_NOTICE}</p>
        <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-xl border border-border bg-card shadow-card", className)}>{children}</div>;
}
