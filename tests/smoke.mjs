#!/usr/bin/env node
/**
 * Lancoli Code smoke tests: verify the app starts and serves its main page.
 * Usage: node tests/smoke.mjs
 *
 * Tests:
 * - Main page exists and serves valid HTML
 * - Critical resources (CSS, JS) are present
 * - Language switching works (fr/en keys match)
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Test configuration
const PAGES = [
  { file: 'index.html', name: 'Home', mustContain: ['<title', 'Lancoli Code', 'class="page"'] }
];

const RESOURCES = [
  { type: 'CSS', paths: ['css/code.css'] },
  { type: 'JS', paths: ['js/code.js', 'js/journey.js', 'js/i18n.js'] },
  { type: 'i18n', paths: ['i18n/fr.json', 'i18n/en.json'] }
];

// Test results
let passed = 0;
let failed = 0;
const errors = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`✓ ${name}`);
  } catch (err) {
    failed++;
    errors.push({ test: name, error: err.message });
    console.error(`✗ ${name}: ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Test 1: Main page exists and is valid HTML
console.log('\n1. Main page structure');
for (const page of PAGES) {
  test(`${page.name} (${page.file})`, () => {
    const path = join(ROOT, page.file);
    assert(existsSync(path), `File ${page.file} not found`);

    const content = readFileSync(path, 'utf-8');
    assert(content.toLowerCase().includes('<!doctype html>'), 'Missing DOCTYPE');
    assert(content.includes('<html'), 'Missing <html> tag');
    assert(content.includes('</html>'), 'Missing closing </html> tag');

    for (const text of page.mustContain) {
      assert(content.includes(text), `Missing expected content: ${text}`);
    }
  });
}

// Test 2: Critical resources exist
console.log('\n2. Critical resources');
for (const resource of RESOURCES) {
  for (const path of resource.paths) {
    test(`${resource.type}: ${path}`, () => {
      const fullPath = join(ROOT, path);
      assert(existsSync(fullPath), `Resource not found: ${path}`);

      const content = readFileSync(fullPath, 'utf-8');
      assert(content.length > 0, `Resource is empty: ${path}`);
    });
  }
}

// Test 3: Language dictionaries have matching keys
console.log('\n3. i18n integrity');
test('French/English dictionaries match', () => {
  const frPath = join(ROOT, 'i18n/fr.json');
  const enPath = join(ROOT, 'i18n/en.json');

  const frContent = readFileSync(frPath, 'utf-8');
  const enContent = readFileSync(enPath, 'utf-8');

  const frData = JSON.parse(frContent);
  const enData = JSON.parse(enContent);

  const frKeys = Object.keys(frData).sort();
  const enKeys = Object.keys(enData).sort();

  assert(frKeys.length > 0, 'No keys found in French dictionary');
  assert(enKeys.length > 0, 'No keys found in English dictionary');
  assert(frKeys.length === enKeys.length,
    `Key count mismatch: fr=${frKeys.length}, en=${enKeys.length}`);

  // Check for missing keys
  const missingInEn = frKeys.filter(k => !enKeys.includes(k));
  const missingInFr = enKeys.filter(k => !frKeys.includes(k));

  assert(missingInEn.length === 0,
    `Keys in fr.json but not en.json: ${missingInEn.slice(0, 5).join(', ')}${missingInEn.length > 5 ? '...' : ''}`);
  assert(missingInFr.length === 0,
    `Keys in en.json but not fr.json: ${missingInFr.slice(0, 5).join(', ')}${missingInFr.length > 5 ? '...' : ''}`);
});

// Test 4: Journey data structure
console.log('\n4. Content integrity');
test('Journey data exists', () => {
  const journeyPath = join(ROOT, 'js/journey.js');
  assert(existsSync(journeyPath), 'journey.js not found');

  const content = readFileSync(journeyPath, 'utf-8');
  assert(content.includes('window.JOURNEY'), 'Missing JOURNEY object');
  assert(content.includes('projects:'), 'Missing projects data');
});

// Summary
console.log('\n' + '─'.repeat(50));
console.log(`Tests: ${passed + failed} total, ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log('\nFailed tests:');
  errors.forEach(({ test, error }) => {
    console.log(`  • ${test}: ${error}`);
  });
  process.exit(1);
} else {
  console.log('\n✓ All smoke tests passed');
  process.exit(0);
}
