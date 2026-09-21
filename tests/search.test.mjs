import { test } from "node:test";
import assert from "node:assert/strict";
import { filterNotifications } from "../services/search.ts";

const notifications = [
  {
    id: "1",
    roleName: "Background Barista",
    productionTitle: "Netflix Drama Pilot",
    castingDirector: "Sande Alessi",
  },
  {
    id: "2",
    roleName: "Featured Detective",
    productionTitle: "Untitled HBO Series",
  },
];

const ids = (list) => list.map((n) => n.id);

test("trailing-space query still matches", () => {
  assert.deepEqual(ids(filterNotifications(notifications, "Netflix ")), ["1"]);
});

test("whitespace-only query returns everything", () => {
  assert.equal(filterNotifications(notifications, "   "), notifications);
  assert.equal(filterNotifications(notifications, ""), notifications);
});

test("case-insensitive match on roleName", () => {
  assert.deepEqual(ids(filterNotifications(notifications, "bArIsTa")), ["1"]);
});

test("case-insensitive match on productionTitle", () => {
  assert.deepEqual(ids(filterNotifications(notifications, "hbo")), ["2"]);
});

test("case-insensitive match on castingDirector", () => {
  assert.deepEqual(ids(filterNotifications(notifications, "SANDE ALESSI")), ["1"]);
});

test("notification without castingDirector does not throw", () => {
  assert.doesNotThrow(() => filterNotifications(notifications, "alessi"));
  assert.deepEqual(ids(filterNotifications([notifications[1]], "alessi")), []);
});

test("non-matching query returns an empty array", () => {
  assert.deepEqual(filterNotifications(notifications, "zzz-no-match"), []);
});
