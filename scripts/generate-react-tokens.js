#!/usr/bin/env node
// Generates packages/react-ui/src/theme/tokens.css and tokens.ts from tokens.json.
// Variable names match the var(--...) references already used throughout the
// code samples in components.json (e.g. var(--bg-action-primary-hover)).
//
// Run after any change to tokens.json (i.e. after scripts/generate-agent-files.js):
//   node scripts/generate-react-tokens.js

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens.json'), 'utf8'));
const OUT_DIR = path.join(ROOT, 'packages/react-ui/src/theme');

function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function resolveRef(value, root) {
  if (typeof value !== 'string') return value;
  const m = /^\{([^}]+)\}$/.exec(value);
  if (!m) return value;
  const parts = m[1].split('.');
  let node = root;
  for (const p of parts) node = node[p];
  return resolveRef(node.$value, root);
}

const lines = [];
lines.push('/* Generated from tokens.json by scripts/generate-react-tokens.js - do not hand-edit. */');
lines.push(':root {');

// Color primitives (rarely used directly, but kept for completeness/escape hatches)
for (const [ramp, steps] of Object.entries(tokens.color.primitive)) {
  for (const [step, node] of Object.entries(steps)) {
    lines.push(`  --color-${ramp}-${step}: ${node.$value};`);
  }
}
// Color semantic
for (const group of Object.values(tokens.color.semantic)) {
  for (const [name, node] of Object.entries(group)) {
    lines.push(`  --${camelToKebab(name)}: ${resolveRef(node.$value, tokens)};`);
  }
}
// Spacing primitives
for (const [step, node] of Object.entries(tokens.spacing.primitive)) {
  lines.push(`  --spacing-${step}: ${node.$value};`);
}
// Spacing gap
for (const [name, node] of Object.entries(tokens.spacing.gap)) {
  lines.push(`  --gap-${name}: ${resolveRef(node.$value, tokens)};`);
}
// Spacing layout (prefixed "gap-layout-" to match existing var(--gap-layout-block) references)
for (const [name, node] of Object.entries(tokens.spacing.layout)) {
  lines.push(`  --gap-layout-${name}: ${resolveRef(node.$value, tokens)};`);
}
// Spacing margin
for (const [name, node] of Object.entries(tokens.spacing.margin)) {
  lines.push(`  --margin-${name}: ${resolveRef(node.$value, tokens)};`);
}
// Radius primitives + semantic
for (const [step, node] of Object.entries(tokens.radius.primitive)) {
  lines.push(`  --radius-${step}: ${node.$value};`);
}
for (const [name, node] of Object.entries(tokens.radius.semantic)) {
  lines.push(`  --radius-${camelToKebab(name)}: ${resolveRef(node.$value, tokens)};`);
}
// Size
for (const [cat, sizes] of Object.entries(tokens.size)) {
  for (const [name, node] of Object.entries(sizes)) {
    lines.push(`  --size-${cat}-${name}: ${node.$value};`);
  }
}
// Shadow
for (const [name, node] of Object.entries(tokens.shadow)) {
  lines.push(`  --shadow-${name}: ${node.$value};`);
}
// Typography (as individual custom properties too, for CSS-only consumers)
for (const [group, variants] of Object.entries(tokens.typography)) {
  for (const [variant, node] of Object.entries(variants)) {
    const v = node.$value;
    const prefix = `--font-${group}-${variant}`;
    lines.push(`  ${prefix}-family: '${v.fontFamily}', sans-serif;`);
    lines.push(`  ${prefix}-size: ${v.fontSize};`);
    lines.push(`  ${prefix}-weight: ${v.fontWeight};`);
    lines.push(`  ${prefix}-line-height: ${v.lineHeight};`);
    lines.push(`  ${prefix}-letter-spacing: ${v.letterSpacing === '0' ? 'normal' : v.letterSpacing};`);
  }
}
lines.push('}');
lines.push('');

fs.writeFileSync(path.join(OUT_DIR, 'tokens.css'), lines.join('\n'), 'utf8');

// tokens.ts - typography as spreadable style objects (style={{...typography.h1.bold}})
const tsLines = [];
tsLines.push("// Generated from tokens.json by scripts/generate-react-tokens.js - do not hand-edit.");
tsLines.push("import type { CSSProperties } from 'react';");
tsLines.push('');
tsLines.push('export const typography: Record<string, Record<string, CSSProperties>> = {');
for (const [group, variants] of Object.entries(tokens.typography)) {
  tsLines.push(`  ${group}: {`);
  for (const [variant, node] of Object.entries(variants)) {
    const v = node.$value;
    tsLines.push(`    ${variant}: { fontFamily: '${v.fontFamily}, sans-serif', fontSize: '${v.fontSize}', fontWeight: ${v.fontWeight}, lineHeight: '${v.lineHeight}', letterSpacing: ${v.letterSpacing === '0' ? "'normal'" : `'${v.letterSpacing}'`} },`);
  }
  tsLines.push('  },');
}
tsLines.push('};');
tsLines.push('');

fs.writeFileSync(path.join(OUT_DIR, 'tokens.ts'), tsLines.join('\n'), 'utf8');

console.log('Wrote packages/react-ui/src/theme/tokens.css and tokens.ts');
