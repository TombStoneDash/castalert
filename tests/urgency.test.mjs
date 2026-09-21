import { test } from "node:test";
import assert from "node:assert/strict";
import { getUrgencyLabel } from "../services/urgency.ts";

const NOW = Date.parse("2026-01-15T12:00:00Z");
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const at = (offsetMs) => new Date(NOW + offsetMs).toISOString();

test("expired deadline is Closed, not URGENT", () => {
  assert.equal(getUrgencyLabel(at(-2 * DAY), NOW), "Closed");
  assert.equal(getUrgencyLabel(at(-1000), NOW), "Closed");
});

test("12 hours left is URGENT", () => {
  assert.equal(getUrgencyLabel(at(12 * HOUR), NOW), "URGENT");
});

test("2 days left is Soon", () => {
  assert.equal(getUrgencyLabel(at(2 * DAY), NOW), "Soon");
});

test("10 days left has no label", () => {
  assert.equal(getUrgencyLabel(at(10 * DAY), NOW), "");
});

test("invalid date string has no label", () => {
  assert.equal(getUrgencyLabel("not-a-date", NOW), "");
  assert.equal(getUrgencyLabel("", NOW), "");
});
