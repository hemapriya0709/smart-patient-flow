import { createFileRoute } from "@tanstack/react-router";
import { QueueView } from "@/components/queue-table";
import { AppShell } from "@/components/triage-ui";

export const Route = createFileRoute("/queue")({
  head: () => ({
    meta: [
      { title: "Patient Queue — MediQueue" },
      { name: "description", content: "Priority-ordered emergency waiting queue with search, filters and status updates." },
      { property: "og:title", content: "Patient Queue — MediQueue" },
      { property: "og:description", content: "Priority queue: higher urgency first, then longest wait." },
    ],
  }),
  component: () => (
    <AppShell>
      <QueueView title="Patient queue" subtitle="Order: Critical → High → Needs triage → Moderate → Low; longest wait first within each." />
    </AppShell>
  ),
});
