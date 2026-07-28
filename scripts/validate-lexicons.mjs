#!/usr/bin/env node
// Validates lexicons/**/*.json: well-formedness, id-matches-path, and that every
// app.holdfast.* ref / knownValues token resolves to a def that actually exists.
// External namespace refs (e.g. com.atproto.*) are reported but not resolved —
// we don't vendor those schemas.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const LEXICON_ROOT = join(import.meta.dirname, '..', 'lexicons');
const NAMESPACE_PREFIX = 'app.holdfast';

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith('.json')) out.push(full);
  }
  return out;
}

function pathToExpectedId(filePath) {
  const rel = relative(LEXICON_ROOT, filePath).replace(/\.json$/, '');
  return rel.split(sep).join('.');
}

// Split an NSID-with-optional-fragment ref into { id, defName }.
function splitRef(ref) {
  const [id, defName = 'main'] = ref.split('#');
  return { id, defName };
}

function looksLikeNsidRef(value) {
  if (typeof value !== 'string') return false;
  if (value.startsWith(NAMESPACE_PREFIX + '.')) return true;
  // external NSID-shaped ref, e.g. com.atproto.repo.strongRef
  return /^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*){2,}(#[a-zA-Z][a-zA-Z0-9]*)?$/.test(value);
}

// Recursively collect every string found under a "ref" key, and every entry of
// a "knownValues" array that looks like an NSID ref rather than a plain literal.
function collectRefs(node, refs) {
  if (Array.isArray(node)) {
    for (const item of node) collectRefs(item, refs);
    return;
  }
  if (node === null || typeof node !== 'object') return;

  if (typeof node.ref === 'string') refs.push(node.ref);

  if (Array.isArray(node.knownValues)) {
    for (const kv of node.knownValues) {
      if (looksLikeNsidRef(kv)) refs.push(kv);
    }
  }

  for (const value of Object.values(node)) collectRefs(value, refs);
}

// worker/src/lexicons.ts hand-imports each lexicon JSON so the Worker can
// serve it without filesystem access. Make sure that map hasn't drifted from
// the actual set of lexicon ids (missed on add, stale on remove/rename).
function checkWorkerLexiconsInSync(registry, errors) {
  const workerFile = join(import.meta.dirname, '..', 'worker', 'src', 'lexicons.ts');
  let source;
  try {
    source = readFileSync(workerFile, 'utf8');
  } catch {
    return; // worker not present yet — nothing to check
  }

  const declared = new Set(
    [...source.matchAll(/^\s*'(app\.holdfast\.[a-zA-Z0-9.]+)':/gm)].map((m) => m[1]),
  );

  for (const id of registry.keys()) {
    if (!declared.has(id)) {
      errors.push(`worker/src/lexicons.ts: missing entry for "${id}" (present in lexicons/, not bundled into the Worker)`);
    }
  }
  for (const id of declared) {
    if (!registry.has(id)) {
      errors.push(`worker/src/lexicons.ts: stale entry for "${id}" (no longer present in lexicons/)`);
    }
  }
}

function main() {
  const files = walk(LEXICON_ROOT).sort();
  const errors = [];
  const registry = new Map(); // id -> { defs, filePath }
  const parsed = [];

  for (const filePath of files) {
    const relPath = relative(process.cwd(), filePath);
    let json;
    try {
      json = JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (err) {
      errors.push(`${relPath}: invalid JSON — ${err.message}`);
      continue;
    }

    if (json.lexicon !== 1) {
      errors.push(`${relPath}: "lexicon" must be 1, got ${JSON.stringify(json.lexicon)}`);
    }

    const expectedId = pathToExpectedId(filePath);
    if (json.id !== expectedId) {
      errors.push(`${relPath}: id "${json.id}" does not match file path (expected "${expectedId}")`);
    }

    if (typeof json.id === 'string') {
      if (registry.has(json.id)) {
        errors.push(`${relPath}: duplicate id "${json.id}" (also in ${registry.get(json.id).filePath})`);
      } else {
        registry.set(json.id, { defs: json.defs ?? {}, filePath: relPath });
      }
    }

    parsed.push({ filePath: relPath, json });
  }

  let refsChecked = 0;
  const externalRefs = new Set();

  for (const { filePath, json } of parsed) {
    const refs = [];
    collectRefs(json.defs ?? {}, refs);

    for (const ref of refs) {
      const { id, defName } = splitRef(ref);

      if (!id.startsWith(NAMESPACE_PREFIX + '.')) {
        externalRefs.add(id);
        continue;
      }

      refsChecked++;
      const target = registry.get(id);
      if (!target) {
        errors.push(`${filePath}: ref "${ref}" points to unknown lexicon id "${id}"`);
        continue;
      }
      if (!(defName in target.defs)) {
        errors.push(`${filePath}: ref "${ref}" points to undefined def "${defName}" in ${target.filePath}`);
      }
    }
  }

  console.log(`Checked ${files.length} lexicon files, ${registry.size} ids, ${refsChecked} internal refs.`);
  if (externalRefs.size > 0) {
    console.log(`External refs (not resolved, not vendored here): ${[...externalRefs].sort().join(', ')}`);
  }

  checkWorkerLexiconsInSync(registry, errors);

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s):`);
    for (const err of errors) console.error(`  - ${err}`);
    process.exitCode = 1;
    return;
  }

  console.log('\nAll lexicons valid.');
}

main();
