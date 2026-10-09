import { useEffect, useState, useSyncExternalStore } from "react";
import { samplePatients, type Patient } from "./triage";

const KEY = "smarttriage.patients.v1";
let patients: Patient[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    patients = raw ? JSON.parse(raw) : samplePatients();
    if (!raw) save();
  } catch {
    patients = samplePatients();
  }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(patients)); } catch { /* storage full/blocked */ }
}
function emit() { save(); listeners.forEach((l) => l()); }

export const store = {
  get: () => patients,
  add(p: Patient) { load(); patients = [...patients, p]; emit(); },
  update(id: string, patch: Partial<Patient>) {
    load();
    patients = patients.map((p) => (p.id === id ? { ...p, ...patch } : p));
    emit();
  },
  reset() { patients = samplePatients(); emit(); },
  clear() { patients = []; emit(); },
};

const EMPTY: Patient[] = [];
export function usePatients() {
  const [ready, setReady] = useState(false);
  useEffect(() => { load(); setReady(true); listeners.forEach((l) => l()); }, []);
  const data = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => patients,
    () => EMPTY,
  );
  return { patients: data, ready };
}

export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), intervalMs); return () => clearInterval(t); }, [intervalMs]);
  return now;
}
