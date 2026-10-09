import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, StatusBadge, UrgencyBadge } from "@/components/triage-ui";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { store, useNow, usePatients } from "@/lib/store";
import { buildQueue, formatWait, needsEscalation, rankOf, STATUSES, URGENCIES, type Patient, type Status, type Urgency } from "@/lib/triage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartTriage — Emergency Queue Dashboard" },
      { name: "description", content: "Staff dashboard for prioritizing an emergency department waiting queue by urgency and wait time (demo)." },
      { property: "og:title", content: "SmartTriage — Emergency Queue Dashboard" },
      { property: "og:description", content: "Register patients, record triage categories and track patient flow. Demo with fictional data." },
    ],
  }),
  component: Dashboard,
});

type Pending = { p: Patient; kind: "status"; value: Status } | { p: Patient; kind: "urgency"; value: Urgency };
const sel = "rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Dashboard() {
  const { patients, ready } = usePatients();
  const now = useNow();
  const [q, setQ] = useState("");
  const [fUrg, setFUrg] = useState("all");
  const [fStatus, setFStatus] = useState("active");
  const [sort, setSort] = useState<"priority" | "wait" | "id">("priority");
  const [pending, setPending] = useState<Pending | null>(null);
  const [staff, setStaff] = useState("");

  const counts = {
    total: patients.length,
    waiting: patients.filter((p) => p.status === "Waiting").length,
    consult: patients.filter((p) => p.status === "In Consultation").length,
    done: patients.filter((p) => p.status === "Completed").length,
  };

  const rows = useMemo(() => {
    const base = fStatus === "active" ? buildQueue(patients)
      : [...patients].sort((a, b) => rankOf(a) - rankOf(b) || a.registeredAt - b.registeredAt);
    let r = base.filter((p) =>
      (fStatus === "active" || fStatus === "all" || p.status === fStatus) &&
      (fUrg === "all" || (p.urgency ?? "none") === fUrg) &&
      (!q || `${p.id} ${p.name} ${p.symptoms}`.toLowerCase().includes(q.toLowerCase())));
    if (sort === "wait") r = [...r].sort((a, b) => a.registeredAt - b.registeredAt);
    if (sort === "id") r = [...r].sort((a, b) => a.id.localeCompare(b.id));
    return r;
  }, [patients, q, fUrg, fStatus, sort]);

  const escalations = patients.filter((p) => needsEscalation(p, now)).length;

  const request = (p: Patient, kind: Pending["kind"], value: string) => {
    if (kind === "status") {
      if (value === p.status) return;
      // Moving back to waiting is low risk; others require confirmation
      if (value === "Waiting") return store.update(p.id, { status: "Waiting" });
      setPending({ p, kind, value: value as Status });
    } else {
      if (value === p.urgency) return;
      setStaff(p.assessedBy ?? "");
      setPending({ p, kind, value: value as Urgency });
    }
  };
  const confirm = () => {
    if (!pending) return;
    if (pending.kind === "status") store.update(pending.p.id, { status: pending.value });
    else store.update(pending.p.id, { urgency: pending.value, assessedBy: staff.trim() || "Staff" });
    setPending(null);
  };

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Staff dashboard</h1>
          <p className="text-sm text-muted-foreground">Queue order: Critical → High → Needs triage → Moderate → Low; longest wait first within each.</p>
        </div>
        <Button asChild><Link to="/register">+ Register patient</Link></Button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["Total registered", counts.total], ["Currently waiting", counts.waiting], ["In consultation", counts.consult], ["Completed", counts.done]].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">{l}</p>
            <p className="mt-1 text-3xl font-semibold text-primary">{ready ? v : "–"}</p>
          </div>
        ))}
      </div>

      {escalations > 0 && (
        <div role="alert" className="mt-4 rounded-lg border border-critical bg-critical-soft px-4 py-3 text-sm text-critical">
          <strong>⚠ {escalations} patient{escalations > 1 ? "s" : ""} need escalation</strong> — critical cases or waits beyond simulated thresholds (High 15 min, Needs triage 10 min, Moderate 60 min, Low 120 min).
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <input aria-label="Search patients" placeholder="Search ID, name, symptoms…" value={q} onChange={(e) => setQ(e.target.value)} className={cn(sel, "min-w-56 flex-1")} />
        <select aria-label="Filter by urgency" value={fUrg} onChange={(e) => setFUrg(e.target.value)} className={sel}>
          <option value="all">All urgencies</option>
          {URGENCIES.map((u) => <option key={u}>{u}</option>)}
          <option value="none">Needs triage</option>
        </select>
        <select aria-label="Filter by status" value={fStatus} onChange={(e) => setFStatus(e.target.value)} className={sel}>
          <option value="active">Active queue (excl. completed)</option>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={sel}>
          <option value="priority">Sort: priority</option>
          <option value="wait">Sort: longest wait</option>
          <option value="id">Sort: patient ID</option>
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>{["#", "Patient", "Urgency", "Symptoms", "Wait", "Status", "Actions"].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((p, i) => {
              const esc = needsEscalation(p, now);
              return (
                <tr key={p.id} className={cn("border-t border-border align-top", p.urgency === "Critical" && p.status !== "Completed" && "bg-critical-soft")}>
                  <td className="px-3 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-3"><div className="font-mono font-medium">{p.id}</div><div className="text-xs text-muted-foreground">{p.name}, {p.age} y</div></td>
                  <td className="px-3 py-3">
                    <UrgencyBadge urgency={p.urgency} />
                    {esc && <div className="mt-1 text-xs font-semibold text-critical">⚠ Escalate</div>}
                  </td>
                  <td className="max-w-xs px-3 py-3"><p className="line-clamp-2">{p.symptoms}</p>{p.conditions && <p className="text-xs text-muted-foreground">Hx: {p.conditions}</p>}</td>
                  <td className="whitespace-nowrap px-3 py-3">{p.status === "Completed" ? "—" : formatWait(now - p.registeredAt)}</td>
                  <td className="px-3 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1.5">
                      <select aria-label={`Set urgency for ${p.id}`} value={p.urgency ?? ""} onChange={(e) => request(p, "urgency", e.target.value)} className={sel}>
                        <option value="" disabled>Record triage…</option>
                        {URGENCIES.map((u) => <option key={u}>{u}</option>)}
                      </select>
                      <select aria-label={`Set status for ${p.id}`} value={p.status} onChange={(e) => request(p, "status", e.target.value)} className={sel}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {ready && rows.length === 0 && (
          <div className="px-6 py-14 text-center">
            <p className="font-medium">{patients.length === 0 ? "No patients registered yet" : "No patients match these filters"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{patients.length === 0 ? "Register a patient or load the fictional demo set to get started." : "Try clearing the search or changing filters."}</p>
            <div className="mt-4 flex justify-center gap-2">
              {patients.length === 0 ? <>
                <Button asChild><Link to="/register">Register patient</Link></Button>
                <Button variant="outline" onClick={() => store.reset()}>Load demo patients</Button>
              </> : <Button variant="outline" onClick={() => { setQ(""); setFUrg("all"); setFStatus("active"); }}>Clear filters</Button>}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>Storage: this browser (localStorage). Clearing browser data removes it.</span>
        <button className="underline hover:text-foreground" onClick={() => window.confirm("Replace all data with the fictional demo patients?") && store.reset()}>Reset demo data</button>
        <button className="underline hover:text-foreground" onClick={() => window.confirm("Remove all patients?") && store.clear()}>Clear all</button>
      </div>

      <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pending?.kind === "status" ? "Confirm status change" : "Confirm triage category"}</AlertDialogTitle>
            <AlertDialogDescription>
              {pending && (pending.kind === "status"
                ? `Move ${pending.p.id} from "${pending.p.status}" to "${pending.value}"?${pending.value === "Completed" ? " They will leave the waiting queue." : ""}`
                : `Record ${pending.p.id} as ${pending.value}? The queue will be re-prioritized. This must reflect a qualified clinical assessment.`)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {pending?.kind === "urgency" && (
            <label className="text-sm font-medium">Assessed by
              <input value={staff} onChange={(e) => setStaff(e.target.value)} placeholder="Staff name" className={cn(sel, "mt-1 w-full")} />
            </label>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
