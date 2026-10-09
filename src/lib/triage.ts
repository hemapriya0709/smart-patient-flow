export type Urgency = "Critical" | "High" | "Moderate" | "Low";
export type Status = "Waiting" | "In Consultation" | "Completed";

export interface Patient {
  id: string;
  name: string;
  age: number;
  symptoms: string;
  conditions: string;
  registeredAt: number;
  urgency: Urgency | null; // null = awaiting staff assessment
  status: Status;
  assessedBy?: string;
}

export const URGENCIES: Urgency[] = ["Critical", "High", "Moderate", "Low"];
export const STATUSES: Status[] = ["Waiting", "In Consultation", "Completed"];

// Lower rank = seen first. Unassessed patients sit between High and Moderate
// so they get prompt staff assessment without outranking confirmed emergencies.
const RANK: Record<Urgency | "Unassessed", number> = { Critical: 0, High: 1, Unassessed: 2, Moderate: 3, Low: 4 };

export function rankOf(p: Patient) {
  return RANK[p.urgency ?? "Unassessed"];
}

/** Waiting queue: excludes Completed, higher urgency first, then longest wait. */
export function buildQueue(patients: Patient[]): Patient[] {
  return patients
    .filter((p) => p.status !== "Completed")
    .sort((a, b) => rankOf(a) - rankOf(b) || a.registeredAt - b.registeredAt);
}

/** Simulated escalation thresholds (minutes) — demo only, not a clinical protocol. */
export const ESCALATE_AFTER_MIN: Record<Urgency, number> = {
  Critical: 0,
  High: 15,
  Moderate: 60,
  Low: 120,
};

export function needsEscalation(p: Patient, now: number) {
  if (p.status !== "Waiting") return false;
  if (p.urgency === "Critical") return true;
  const mins = (now - p.registeredAt) / 60000;
  if (!p.urgency) return mins >= 10;
  return mins >= ESCALATE_AFTER_MIN[p.urgency];
}

export function formatWait(ms: number) {
  const m = Math.max(0, Math.floor(ms / 60000));
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

export function generateId(existing: Patient[]) {
  const nums = existing.map((p) => parseInt(p.id.replace(/\D/g, ""), 10) || 0);
  const next = (nums.length ? Math.max(...nums) : 1000) + 1;
  return `ST-${next}`;
}

export function samplePatients(now = Date.now()): Patient[] {
  const min = 60000;
  return [
    { id: "ST-1001", name: "Demo Patient Alpha", age: 67, symptoms: "Chest pain radiating to left arm, shortness of breath", conditions: "Hypertension", registeredAt: now - 6 * min, urgency: "Critical", status: "Waiting", assessedBy: "Demo Nurse" },
    { id: "ST-1002", name: "Demo Patient Bravo", age: 34, symptoms: "Deep laceration on forearm, bleeding controlled", conditions: "None", registeredAt: now - 42 * min, urgency: "High", status: "Waiting", assessedBy: "Demo Nurse" },
    { id: "ST-1003", name: "Demo Patient Charlie", age: 8, symptoms: "Fever 39°C, sore throat for 2 days", conditions: "Asthma", registeredAt: now - 75 * min, urgency: "Moderate", status: "Waiting", assessedBy: "Demo Nurse" },
    { id: "ST-1004", name: "Demo Patient Delta", age: 45, symptoms: "Mild ankle sprain, able to walk", conditions: "None", registeredAt: now - 130 * min, urgency: "Low", status: "Waiting", assessedBy: "Demo Nurse" },
    { id: "ST-1005", name: "Demo Patient Echo", age: 52, symptoms: "Severe abdominal pain, vomiting", conditions: "Type 2 diabetes", registeredAt: now - 25 * min, urgency: "High", status: "In Consultation", assessedBy: "Demo Nurse" },
    { id: "ST-1006", name: "Demo Patient Foxtrot", age: 29, symptoms: "Headache and dizziness", conditions: "Migraine history", registeredAt: now - 4 * min, urgency: null, status: "Waiting" },
    { id: "ST-1007", name: "Demo Patient Golf", age: 71, symptoms: "Medication refill question, no acute symptoms", conditions: "COPD", registeredAt: now - 190 * min, urgency: "Low", status: "Completed", assessedBy: "Demo Nurse" },
  ];
}
