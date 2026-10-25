import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('../src/data/categories/', import.meta.url));
const filenames = readdirSync(directory).filter((name) => name.endsWith('.json')).sort();
const errors = [];
const seenIds = new Set();
let entryCount = 0;
let preventionCount = 0;

function validText(value, minLength = 1) {
  return typeof value === 'string' && value.trim().length >= minLength && value === value.trim();
}

for (const filename of filenames) {
  let category;
  try {
    category = JSON.parse(readFileSync(join(directory, filename), 'utf8'));
  } catch (error) {
    errors.push(`${filename}: invalid JSON (${error.message})`);
    continue;
  }

  if (!Number.isInteger(category.order) || category.order < 1) errors.push(`${filename}: order must be a positive integer`);
  if (!/^[a-z][a-z0-9_]*$/.test(category.id || '')) errors.push(`${filename}: id must be a lowercase slug`);
  if (seenIds.has(category.id)) errors.push(`${filename}: duplicate section id ${category.id}`);
  seenIds.add(category.id);
  if (!validText(category.title, 3) || !validText(category.description, 20)) errors.push(`${filename}: section title or description is missing`);
  if (!Array.isArray(category.attacks) || !category.attacks.length) {
    errors.push(`${filename}: attacks must be a nonempty array`);
    continue;
  }
  const expectedFilename = `${String(category.order).padStart(2, '0')}-${category.id}.json`;
  if (filename !== expectedFilename) errors.push(`${filename}: expected filename ${expectedFilename}`);

  const seenNames = new Set();
  for (const [index, attack] of category.attacks.entries()) {
    const location = `${filename} entry ${index + 1}`;
    entryCount++;
    if (!validText(attack.name, 3)) errors.push(`${location}: name is missing`);
    if (seenNames.has(attack.name?.toLocaleLowerCase())) errors.push(`${location}: duplicate attack name in this section`);
    seenNames.add(attack.name?.toLocaleLowerCase());
    if (!validText(attack.desc, 25)) errors.push(`${location}: description must explain the entry in at least 25 characters`);
    if (typeof attack.notes !== 'string') errors.push(`${location}: notes must be a string, even when empty`);
    if (!Object.hasOwn(attack, 'prevention')) errors.push(`${location}: add prevention as a string or null`);
    if (attack.prevention !== null) {
      if (!validText(attack.prevention, 45)) errors.push(`${location}: prevention must be at least 45 characters or null`);
      else preventionCount++;
    }
    for (const forbidden of ['rating', 'level', 'difficulty']) {
      if (Object.hasOwn(attack, forbidden)) errors.push(`${location}: remove source rating field ${forbidden}`);
    }
  }
}

const orders = filenames.map((name) => Number(name.split('-')[0])).sort((a, b) => a - b);
if (orders.some((order, index) => order !== index + 1)) errors.push('Section orders must be consecutive, starting at 1');

if (errors.length) {
  for (const error of errors) console.error(`✗ ${error}`);
  process.exitCode = 1;
} else {
  const percent = Math.round(preventionCount / entryCount * 1000) / 10;
  console.log(`✓ ${filenames.length} sections, ${entryCount} entries, ${preventionCount} preventions (${percent}% coverage)`);
}
