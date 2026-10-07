const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
// Compile the small, pure date module in memory without creating build artifacts.
const source = fs.readFileSync(path.join(__dirname, "../src/app/lib/event-dates.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const result = { exports: {} };
new Function("exports", "module", compiled)(result.exports, result);
const { parseEventDates, japanToday, isUpcoming, sortEvents } = result.exports;
const iso = (text) => parseEventDates(text).map((date) => date.toISOString().slice(0, 10));
const event = (date) => ({ title: date, date, description: "", tags: [] });

test("multiple dates inherit the explicit year across months", () => {
  assert.deepEqual(iso("2025年7月27日, 8月1日, 8月2日"), [
    "2025-07-27",
    "2025-08-01",
    "2025-08-02",
  ]);
});
test("Japanese ranges and ISO dates remain intact", () => {
  assert.deepEqual(iso("2024年10月13日-10月14日"), ["2024-10-13", "2024-10-14"]);
  assert.deepEqual(iso("2024-12-21"), ["2024-12-21"]);
});
test("invalid and yearless dates do not become new events", () => {
  assert.deepEqual(iso("2025年2月30日"), []);
  assert.deepEqual(iso("5月2日"), []);
  assert.equal(isUpcoming(event("未定"), new Date("2026-01-01")), false);
});
test("Japan calendar rolls over at 15:00 UTC", () => {
  assert.equal(
    japanToday(new Date("2026-10-06T15:00:00Z")).toISOString().slice(0, 10),
    "2026-10-07"
  );
});
test("multi-day events stay upcoming until the last day", () => {
  assert.equal(isUpcoming(event("2026年5月2日, 5月3日, 5月4日"), new Date("2026-05-04")), true);
  assert.equal(isUpcoming(event("2026年5月2日, 5月3日, 5月4日"), new Date("2026-05-05")), false);
});
test("month-only events remain current through the end of the month", () => {
  assert.equal(isUpcoming(event("2025年10月"), new Date("2025-10-31")), true);
  assert.equal(isUpcoming(event("2025年10月"), new Date("2025-11-01")), false);
});
test("sorting does not mutate the source array", () => {
  const items = [event("2023年12月16日"), event("2024年12月21日")];
  assert.equal(sortEvents(items)[0].date, "2024年12月21日");
  assert.equal(items[0].date, "2023年12月16日");
});
