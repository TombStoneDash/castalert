import test from "node:test";
import assert from "node:assert/strict";
import { buildCastingNotification, matchesPreferences, groupNotifications } from "./push";
import type { CastingNotification, NotificationPreferences } from "@/types/notifications";

function casting(overrides: Partial<CastingNotification> = {}): CastingNotification {
  return {
    id: "c1",
    roleName: "Lead Detective",
    productionTitle: "Midnight City",
    productionType: "TV",
    roleType: "Lead",
    unionStatus: "SAG-AFTRA",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    saved: false,
    receivedAt: new Date().toISOString(),
    ...overrides,
  };
}

function prefs(overrides: Partial<NotificationPreferences> = {}): NotificationPreferences {
  return {
    roleTypes: ["Lead", "Supporting", "Background", "Voice", "Stunt", "Stand-In"],
    productionTypes: ["Film", "TV", "Commercial", "Theater", "Voice", "Music Video", "New Media"],
    unionStatus: ["SAG-AFTRA", "Non-Union", "Both"],
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    ...overrides,
  };
}

// ─── buildCastingNotification: urgency labeling ────────────────────

test("buildCastingNotification: deadline within 1 day is URGENT", () => {
  const n = buildCastingNotification(casting({
    roleName: "Stunt Double",
    deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12h out
  }));
  assert.equal(n.title, "[URGENT] Stunt Double");
});

test("buildCastingNotification: deadline within 3 days is Soon", () => {
  const n = buildCastingNotification(casting({
    roleName: "Background Extra",
    deadline: new Date(Date.now() + 2.5 * 24 * 60 * 60 * 1000).toISOString(), // 2.5 days out
  }));
  assert.equal(n.title, "[Soon] Background Extra");
});

test("buildCastingNotification: deadline further out has no urgency prefix", () => {
  const n = buildCastingNotification(casting({
    roleName: "Voice Actor",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  }));
  assert.equal(n.title, "Voice Actor");
});

test("buildCastingNotification: carries casting id and category for routing", () => {
  const c = casting({ id: "abc123" });
  const n = buildCastingNotification(c);
  assert.deepEqual(n.data, { castingId: "abc123", type: "casting_alert" });
  assert.equal(n.categoryIdentifier, "casting_alert");
  assert.equal(n.badge, 1);
});

// ─── matchesPreferences: filters ───────────────────────────────────

test("matchesPreferences: role type filter excludes non-matching roles", () => {
  const c = casting({ roleType: "Stunt" });
  assert.equal(matchesPreferences(c, prefs({ roleTypes: ["Lead"] })), false);
  assert.equal(matchesPreferences(c, prefs({ roleTypes: ["Stunt"] })), true);
});

test("matchesPreferences: production type filter excludes non-matching productions", () => {
  const c = casting({ productionType: "Commercial" });
  assert.equal(matchesPreferences(c, prefs({ productionTypes: ["Film"] })), false);
  assert.equal(matchesPreferences(c, prefs({ productionTypes: ["Commercial"] })), true);
});

test("matchesPreferences: SAG-AFTRA castings respect the union filter", () => {
  const c = casting({ unionStatus: "SAG-AFTRA" });
  assert.equal(matchesPreferences(c, prefs({ unionStatus: ["Non-Union"] })), false);
  assert.equal(matchesPreferences(c, prefs({ unionStatus: ["SAG-AFTRA"] })), true);
});

test("matchesPreferences: Non-Union castings respect the union filter", () => {
  const c = casting({ unionStatus: "Non-Union" });
  assert.equal(matchesPreferences(c, prefs({ unionStatus: ["SAG-AFTRA"] })), false);
  assert.equal(matchesPreferences(c, prefs({ unionStatus: ["Non-Union"] })), true);
});

test("matchesPreferences: a 'Both' union casting is never filtered out by unionStatus prefs", () => {
  // Documents existing behavior: the guard clauses only check for the
  // "SAG-AFTRA" and "Non-Union" literals, so "Both" always passes through
  // regardless of what the user's unionStatus prefs contain.
  const c = casting({ unionStatus: "Both" });
  assert.equal(matchesPreferences(c, prefs({ unionStatus: [] })), true);
});

// ─── matchesPreferences: quiet hours (relative to real "now" so this
// never depends on what wall-clock time the suite happens to run at) ───

function hhmm(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
const HOUR = 60 * 60 * 1000;

test("matchesPreferences: quiet hours suppresses a same-day window containing now", () => {
  const now = new Date();
  const c = casting();
  const p = prefs({
    quietHoursEnabled: true,
    quietHoursStart: hhmm(new Date(now.getTime() - HOUR)),
    quietHoursEnd: hhmm(new Date(now.getTime() + HOUR)),
  });
  assert.equal(matchesPreferences(c, p), false);
});

test("matchesPreferences: quiet hours allows a same-day window not containing now", () => {
  const now = new Date();
  const c = casting();
  const p = prefs({
    quietHoursEnabled: true,
    quietHoursStart: hhmm(new Date(now.getTime() + HOUR)),
    quietHoursEnd: hhmm(new Date(now.getTime() + 2 * HOUR)),
  });
  assert.equal(matchesPreferences(c, p), true);
});

test("matchesPreferences: quiet hours suppresses a midnight-spanning window containing now", () => {
  const now = new Date();
  const c = casting();
  // start is "later" in the day than end (e.g. 22:00 -> 07:00): spans midnight.
  // now sits at-or-after start, so it falls inside the wrapped window.
  const p = prefs({
    quietHoursEnabled: true,
    quietHoursStart: hhmm(new Date(now.getTime() - 30 * 60 * 1000)),
    quietHoursEnd: hhmm(new Date(now.getTime() - 90 * 60 * 1000)),
  });
  assert.equal(matchesPreferences(c, p), false);
});

test("matchesPreferences: quiet hours allows outside a midnight-spanning window", () => {
  const now = new Date();
  const c = casting();
  const p = prefs({
    quietHoursEnabled: true,
    quietHoursStart: hhmm(new Date(now.getTime() + HOUR)),
    quietHoursEnd: hhmm(new Date(now.getTime() - HOUR)),
  });
  assert.equal(matchesPreferences(c, p), true);
});

// ─── groupNotifications: grouping, ordering, collapsing ────────────

test("groupNotifications: groups by castingDirector, falls back to productionTitle", () => {
  const t0 = new Date("2026-01-01T00:00:00Z").toISOString();
  const t1 = new Date("2026-01-01T01:00:00Z").toISOString();
  const t2 = new Date("2026-01-01T02:00:00Z").toISOString();

  const dirAOld = casting({ id: "a1", castingDirector: "Dir A", receivedAt: t0 });
  const dirANew = casting({ id: "a2", castingDirector: "Dir A", receivedAt: t2 });
  const dirBOnly = casting({ id: "b1", castingDirector: "Dir B", receivedAt: t1 });
  const noDirector = casting({ id: "n1", castingDirector: undefined, productionTitle: "Indie Film", receivedAt: t0 });

  const groups = groupNotifications([dirAOld, dirANew, dirBOnly, noDirector]);
  const keys = groups.map(g => g.key);

  assert.ok(keys.includes("Indie Film"), "falls back to productionTitle when castingDirector is absent");

  const dirAGroup = groups.find(g => g.key === "Dir A")!;
  // newest-first within a group
  assert.deepEqual(dirAGroup.notifications.map(n => n.id), ["a2", "a1"]);

  // groups ordered by their own latest notification, newest first
  const order = groups.map(g => g.key);
  assert.ok(order.indexOf("Dir A") < order.indexOf("Dir B"), "Dir A (latest at t2) sorts before Dir B (latest at t1)");
});

test("groupNotifications: collapsed is true only once a group exceeds 3 notifications", () => {
  const many = [0, 1, 2, 3].map(i => casting({
    id: `m${i}`,
    castingDirector: "Busy Director",
    receivedAt: new Date(2026, 0, 1, i).toISOString(),
  }));
  const few = [0, 1].map(i => casting({
    id: `f${i}`,
    castingDirector: "Quiet Director",
    receivedAt: new Date(2026, 0, 1, i).toISOString(),
  }));

  const groups = groupNotifications([...many, ...few]);
  assert.equal(groups.find(g => g.key === "Busy Director")!.collapsed, true);
  assert.equal(groups.find(g => g.key === "Quiet Director")!.collapsed, false);
});
