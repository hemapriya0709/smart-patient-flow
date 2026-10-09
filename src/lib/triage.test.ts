import { describe, it, expect } from "vitest";
import { buildQueue, type Patient } from "./triage";

const p = (id: string, urgency: Patient["urgency"], registeredAt: number, status: Patient["status"] = "Waiting"): Patient => ({
  id, name: id, age: 30, symptoms: "x", conditions: "", registeredAt, urgency, status,
});

describe("buildQueue", () => {
  it("puts higher urgency first", () => {
    const q = buildQueue([p("low", "Low", 1), p("crit", "Critical", 5), p("high", "High", 2)]);
    expect(q.map((x) => x.id)).toEqual(["crit", "high", "low"]);
  });
  it("within same urgency, longer wait first", () => {
    const q = buildQueue([p("new", "High", 200), p("old", "High", 100)]);
    expect(q.map((x) => x.id)).toEqual(["old", "new"]);
  });
  it("excludes completed patients", () => {
    const q = buildQueue([p("a", "Critical", 1, "Completed"), p("b", "Low", 2)]);
    expect(q.map((x) => x.id)).toEqual(["b"]);
  });
});
