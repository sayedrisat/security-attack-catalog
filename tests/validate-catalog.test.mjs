import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const attack = () => ({ name: "Fixture weakness", desc: "A fixture description explaining the weakness clearly.", notes: "", prevention: null });
const section = () => ({ order: 1, id: "fixture", title: "Fixture section", description: "A fixture section for validator regression checks.", attacks: [attack()] });

function validate(t, data, filename = "01-fixture.json") {
  const root = mkdtempSync(join(tmpdir(), "catalog-validator-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "scripts"));
  mkdirSync(join(root, "src/data/categories"), { recursive: true });
  copyFileSync(new URL("../scripts/validate-catalog.mjs", import.meta.url), join(root, "scripts/validate-catalog.mjs"));
  writeFileSync(join(root, "src/data/categories", filename), typeof data === "string" ? data : JSON.stringify(data));
  return spawnSync(process.execPath, [join(root, "scripts/validate-catalog.mjs")], { encoding: "utf8" });
}

test("accepts an entry without prevention and reports coverage", (t) => {
  const result = validate(t, section());
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 sections, 1 entries, 0 preventions/);
});

test("counts substantive prevention guidance", (t) => {
  const data = section();
  data.attacks[0].prevention = "Validate the resource owner on the server before granting access.";
  const result = validate(t, data);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 preventions/);
});

test("rejects case-insensitive duplicate attack names", (t) => {
  const data = section();
  data.attacks.push({ ...attack(), name: "FIXTURE WEAKNESS" });
  const result = validate(t, data);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /duplicate attack name/);
});

test("requires the explicit prevention field", (t) => {
  const data = section(); delete data.attacks[0].prevention;
  const result = validate(t, data);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /add prevention as a string or null/);
});

test("rejects invalid JSON", (t) => {
  const result = validate(t, "{broken JSON");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /invalid JSON/);
});

test("rejects a filename that disagrees with section identity", (t) => {
  const result = validate(t, section(), "01-other.json");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /expected filename 01-fixture.json/);
});

test("rejects legacy rating fields", (t) => {
  const data = section(); data.attacks[0].rating = "A";
  const result = validate(t, data);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /remove source rating field rating/);
});
