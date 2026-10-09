import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/triage-ui";
import { Button } from "@/components/ui/button";
import { store, usePatients } from "@/lib/store";
import { generateId, URGENCIES, type Urgency } from "@/lib/triage";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register Patient — SmartTriage" },
      { name: "description", content: "Register a fictional demo patient into the SmartTriage emergency queue." },
      { property: "og:title", content: "Register Patient — SmartTriage" },
      { property: "og:description", content: "Register a demo patient and record a staff triage category." },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name or demo identifier is required").max(80, "Max 80 characters"),
  age: z.coerce.number({ invalid_type_error: "Age must be a number" }).int("Age must be a whole number").min(0, "Age must be 0 or more").max(120, "Age must be 120 or less"),
  symptoms: z.string().trim().min(3, "Describe the symptoms (at least 3 characters)").max(500, "Max 500 characters"),
  conditions: z.string().trim().max(300, "Max 300 characters"),
});

const field = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function RegisterPage() {
  const { patients } = usePatients();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", age: "", symptoms: "", conditions: "" });
  const [urgency, setUrgency] = useState<Urgency | "">("");
  const [staff, setStaff] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const id = generateId(patients);
  const now = new Date();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    const errs: Record<string, string> = {};
    if (!r.success) r.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
    if (form.age.trim() === "") errs.age = "Age is required";
    if (urgency && !staff.trim()) errs.staff = "Enter the assessing staff member's name";
    setErrors(errs);
    if (Object.keys(errs).length || !r.success) return;
    store.add({
      id, ...r.data, registeredAt: Date.now(), urgency: urgency || null,
      status: "Waiting", assessedBy: urgency ? staff.trim() : undefined,
    });
    nav({ to: "/", search: { registered: id } as never });
  };

  const err = (k: string) => errors[k] && <p id={`${k}-err`} className="mt-1 text-sm text-critical">{errors[k]}</p>;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Register patient</h1>
      <p className="mt-1 text-sm text-muted-foreground">Use fictional names or demo identifiers only. Do not enter real patient information.</p>
      <form onSubmit={submit} noValidate className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 rounded-lg border border-border p-5 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><span className="text-sm font-medium">Patient ID</span><p className="mt-1 rounded-md bg-muted px-3 py-2 font-mono text-sm">{id}</p></div>
            <div><span className="text-sm font-medium">Registration time</span><p className="mt-1 rounded-md bg-muted px-3 py-2 text-sm">{now.toLocaleString()} (set on submit)</p></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block sm:col-span-2 text-sm font-medium">Name or demo identifier *
              <input className={field} value={form.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby="name-err" placeholder="e.g. Demo Patient Hotel" />{err("name")}
            </label>
            <label className="block text-sm font-medium">Age *
              <input className={field} inputMode="numeric" value={form.age} onChange={set("age")} aria-invalid={!!errors.age} aria-describedby="age-err" />{err("age")}
            </label>
          </div>
          <label className="block text-sm font-medium">Symptoms *
            <textarea className={field} rows={3} value={form.symptoms} onChange={set("symptoms")} aria-invalid={!!errors.symptoms} aria-describedby="symptoms-err" />{err("symptoms")}
          </label>
          <label className="block text-sm font-medium">Relevant medical conditions
            <textarea className={field} rows={2} value={form.conditions} onChange={set("conditions")} placeholder="Optional" />{err("conditions")}
          </label>
        </section>
        <section className="space-y-4 rounded-lg border border-border p-5">
          <h2 className="font-semibold">Triage category (staff)</h2>
          <p className="text-xs text-muted-foreground">Recorded by authorized staff using the department protocol. Optional now — unassessed patients are flagged "Needs triage".</p>
          <fieldset className="space-y-2">
            <legend className="sr-only">Urgency</legend>
            {(["", ...URGENCIES] as const).map((u) => (
              <label key={u || "none"} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-accent">
                <input type="radio" name="urgency" checked={urgency === u} onChange={() => setUrgency(u)} />
                {u || "Not yet assessed"}
              </label>
            ))}
          </fieldset>
          {urgency && (
            <label className="block text-sm font-medium">Assessed by *
              <input className={field} value={staff} onChange={(e) => setStaff(e.target.value)} aria-describedby="staff-err" placeholder="Staff name" />{err("staff")}
            </label>
          )}
          <Button type="submit" className="w-full">Register patient</Button>
        </section>
      </form>
    </AppShell>
  );
}
