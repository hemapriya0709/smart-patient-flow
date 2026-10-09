import { createFileRoute } from "@tanstack/react-router";
import { QueueView } from "@/components/queue-table";
import { AppShell } from "@/components/triage-ui";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Staff Dashboard — MediQueue" },
      { name: "description", content: "Summary of total, waiting, in-consultation and completed patients with the live priority queue." },
      { property: "og:title", content: "Staff Dashboard — MediQueue" },
      { property: "og:description", content: "Emergency department staff dashboard (demo, fictional data)." },
    ],
  }),
  component: () => (
    <AppShell>
      <QueueView showSummary title="Staff dashboard" subtitle="Overview of today's emergency department flow." />
    </AppShell>
  ),
});
