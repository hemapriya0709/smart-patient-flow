import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card } from "@/components/triage-ui";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MediQueue" },
      { name: "description", content: "How MediQueue prioritizes the emergency queue, and the limits of this demonstration." },
      { property: "og:title", content: "About MediQueue" },
      { property: "og:description", content: "Purpose, queue rules and demo limitations of MediQueue." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold text-primary">About MediQueue</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-semibold">Purpose</h2>
          <p className="mt-2 text-sm text-muted-foreground">A hackathon demo of a smart patient queue for emergency departments: register patients, let authorized staff record a triage category, and keep the waiting queue in priority order.</p>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">How the queue is ordered</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Critical → High → Needs triage → Moderate → Low.</li>
            <li>Within a category, the patient waiting longest comes first.</li>
            <li>Completed patients leave the waiting queue.</li>
            <li>Escalation flags use simulated wait thresholds.</li>
          </ul>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-semibold">Important limitations</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>MediQueue does not diagnose. Triage categories must come from a qualified clinical assessment.</li>
            <li>All patients are fictional. Never enter real patient information.</li>
            <li>Data is stored only in this browser. There is no backend, login, or real-time sync.</li>
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
