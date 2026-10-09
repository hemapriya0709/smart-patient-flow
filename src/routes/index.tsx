import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, DEMO_NOTICE, Logo } from "@/components/triage-ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediQueue — Smarter Queues. Faster Care." },
      { name: "description", content: "MediQueue helps emergency staff register patients, record triage categories and prioritize the waiting queue." },
      { property: "og:title", content: "MediQueue — Smarter Queues. Faster Care." },
      { property: "og:description", content: "Smart patient queue and emergency triage dashboard for hospital staff (demo)." },
    ],
  }),
  component: Home,
});

const POINTS = [
  ["Register", "Capture patient details with an auto-generated ID."],
  ["Prioritize", "Staff-recorded urgency first, then longest wait."],
  ["Track", "Follow each patient from waiting to consultation to completion."],
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Logo />
        <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-12 md:pt-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Emergency department queue management</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-primary md:text-5xl">Smarter Queues. Faster Care.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            MediQueue gives emergency staff one clear view of every waiting patient — registered, triaged by qualified staff, and ordered so the most urgent cases are seen first.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/dashboard">Open Staff Dashboard</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/register">Register Patient</Link></Button>
          </div>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {POINTS.map(([t, d]) => (
            <Card key={t} className="p-5">
              <h2 className="font-semibold text-primary">{t}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </Card>
          ))}
        </div>
        <p className="mt-10 rounded-lg bg-moderate-soft px-4 py-3 text-xs text-foreground">{DEMO_NOTICE}</p>
      </main>
    </div>
  );
}
