#!/usr/bin/env node
// Generates tokens.json and components.json from index.html.
// These are the machine-readable companions to the human-facing site - AI tools
// should read these instead of scraping the rendered HTML.
//
// Run after any change to a foundation page's token data or to the C component object:
//   node scripts/generate-agent-files.js
//
// Do not hand-edit tokens.json or components.json - they are overwritten on every run.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// ── Shared string/comment-aware bracket-matched literal extraction ──

function getFunctionBody(name) {
  const marker = `function ${name}(`;
  const start = html.indexOf(marker);
  if (start === -1) throw new Error('function not found: ' + name);
  const braceStart = html.indexOf('{', start);
  let i = braceStart + 1;
  let depth = 1;
  let inStr = null;
  let inLineComment = false;
  let inBlockComment = false;
  while (depth > 0) {
    const c = html[i];
    const prev = html[i - 1];
    if (inLineComment) {
      if (c === '\n') inLineComment = false;
    } else if (inBlockComment) {
      if (prev === '*' && c === '/') inBlockComment = false;
    } else if (inStr) {
      if (c === '\\') { i++; }
      else if (c === inStr) inStr = null;
    } else {
      if (c === '/' && html[i + 1] === '/') inLineComment = true;
      else if (c === '/' && html[i + 1] === '*') inBlockComment = true;
      else if (c === '"' || c === "'" || c === '`') inStr = c;
      else if (c === '{') depth++;
      else if (c === '}') depth--;
    }
    i++;
  }
  return html.slice(braceStart, i);
}

function extractConst(source, varName) {
  const marker = `const ${varName}=`;
  const start = source.indexOf(marker);
  if (start === -1) throw new Error('const not found: ' + varName);
  let i = start + marker.length;
  const openChar = source[i];
  const closeChar = openChar === '[' ? ']' : openChar === '{' ? '}' : null;
  if (!closeChar) throw new Error('unexpected literal start for ' + varName + ': ' + openChar);
  let depth = 0;
  let inStr = null;
  let j = i;
  for (; j < source.length; j++) {
    const c = source[j];
    if (inStr) {
      if (c === '\\') { j++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === openChar) depth++;
    else if (c === closeChar) { depth--; if (depth === 0) { j++; break; } }
  }
  const literalText = source.slice(i, j);
  // eslint-disable-next-line no-new-func
  return Function('return (' + literalText + ')')();
}

// ── Pull raw data straight out of the foundation render functions ──

const raw = {};
raw.typography = extractConst(getFunctionBody('renderTypography'), 'scale');
raw.primitiveColorRamps = extractConst(getFunctionBody('renderPrimitiveColors'), 'ramps');
raw.semanticColorGroups = extractConst(getFunctionBody('renderSemanticColors'), 'groups');
{
  const body = getFunctionBody('renderSpacing');
  raw.spacing = {
    primitives: extractConst(body, 'primitives'),
    gap: extractConst(body, 'gapTokens'),
    layout: extractConst(body, 'layoutTokens'),
    margin: extractConst(body, 'marginTokens'),
  };
}
{
  const body = getFunctionBody('renderBorderRadius');
  raw.radius = {
    primitives: extractConst(body, 'primitives'),
    semantic: extractConst(body, 'semanticTokens'),
  };
}
{
  const body = getFunctionBody('renderSizing');
  raw.sizing = {
    icon: extractConst(body, 'iconTokens'),
    avatar: extractConst(body, 'avatarTokens'),
  };
}
raw.shadow = extractConst(getFunctionBody('renderShadow'), 'tokens');

// ── Transform into W3C Design Tokens format (https://design-tokens.github.io/community-group/format/) ──

const tokens = { color: { primitive: {}, semantic: {} } };

for (const ramp of raw.primitiveColorRamps) {
  const key = ramp.label.toLowerCase();
  tokens.color.primitive[key] = {};
  for (const [step, hex] of ramp.items) {
    tokens.color.primitive[key][step] = { $value: hex, $type: 'color' };
  }
}

function aliasRef(alias) {
  const m = /^([a-z]+)-(\d+)$/.exec(alias || '');
  if (!m) return null;
  const [, ramp, step] = m;
  if (!tokens.color.primitive[ramp] || !tokens.color.primitive[ramp][step]) return null;
  return `{color.primitive.${ramp}.${step}}`;
}

const groupKeyMap = {
  'App': 'app', 'Surface': 'surface', 'Action': 'action', 'Overlay': 'overlay',
  'Border': 'border', 'Text': 'text', 'Text / On Action': 'textOnAction', 'Icon': 'icon',
};
for (const group of raw.semanticColorGroups) {
  const gk = groupKeyMap[group.label] || group.label.toLowerCase().replace(/[^a-z0-9]+/g, '');
  tokens.color.semantic[gk] = {};
  for (const item of group.items) {
    const ref = aliasRef(item.alias);
    tokens.color.semantic[gk][item.name] = {
      $value: ref || item.hex,
      $type: 'color',
      $description: item.use + (ref ? '' : ` (raw value - source alias "${item.alias}" is not a plain primitive step)`),
    };
  }
}

tokens.spacing = { primitive: {}, gap: {}, layout: {}, margin: {} };
for (const p of raw.spacing.primitives) {
  tokens.spacing.primitive[p.name.replace('spacing-', '')] = { $value: `${p.px}px`, $type: 'dimension' };
}
function spacingRef(px) {
  const match = raw.spacing.primitives.find(p => p.px === px);
  return match ? `{spacing.primitive.${match.name.replace('spacing-', '')}}` : `${px}px`;
}
for (const t of raw.spacing.gap) {
  tokens.spacing.gap[t.name.replace('gap/', '')] = { $value: spacingRef(t.px), $type: 'dimension', $description: t.use };
}
for (const t of raw.spacing.layout) {
  tokens.spacing.layout[t.name.replace('gap/layout/', '')] = { $value: spacingRef(t.px), $type: 'dimension', $description: t.use };
}
for (const t of raw.spacing.margin) {
  tokens.spacing.margin[t.name.replace('margin/', '')] = { $value: spacingRef(t.px), $type: 'dimension', $description: t.use };
}

tokens.radius = { primitive: {}, semantic: {} };
for (const p of raw.radius.primitives) {
  const step = p.name.replace('radius-', '');
  tokens.radius.primitive[step] = { $value: `${p.px}px`, $type: 'dimension' };
  if (p.legacy) tokens.radius.primitive[step].$description = 'Legacy - avoid in new work';
}
function radiusRef(px) {
  const match = raw.radius.primitives.find(p => p.px === px);
  return match ? `{radius.primitive.${match.name.replace('radius-', '')}}` : `${px}px`;
}
for (const t of raw.radius.semantic) {
  const key = t.name.replace('radius/', '');
  tokens.radius.semantic[key] = { $value: radiusRef(t.px), $type: 'dimension', $description: t.use };
  if (t.corners) tokens.radius.semantic[key].$extensions = { corners: t.corners };
}

tokens.size = { icon: {}, avatar: {} };
for (const t of raw.sizing.icon) {
  tokens.size.icon[t.name.replace('size/icon/', '')] = { $value: `${t.px}px`, $type: 'dimension', $description: t.use };
}
for (const t of raw.sizing.avatar) {
  tokens.size.avatar[t.name.replace('size/avatar/', '')] = { $value: `${t.px}px`, $type: 'dimension', $description: t.use };
}

tokens.shadow = {};
for (const t of raw.shadow) {
  tokens.shadow[t.name.replace('shadow/', '')] = { $value: t.css, $type: 'shadow', $description: t.use };
}

tokens.typography = {};
for (const t of raw.typography) {
  const [group, variant] = t.token.split('/');
  tokens.typography[group] = tokens.typography[group] || {};
  tokens.typography[group][variant] = {
    $type: 'typography',
    $value: {
      fontFamily: 'Poppins',
      fontSize: `${t.size}px`,
      fontWeight: t.weight,
      lineHeight: `${t.lh}px`,
      letterSpacing: t.ls === '0' ? '0' : t.ls,
    },
    $description: t.use,
  };
}

const tokensOut = {
  $description: 'Snacky App design tokens. Generated from index.html by scripts/generate-agent-files.js - do not hand-edit.',
  ...tokens,
};

fs.writeFileSync(path.join(ROOT, 'tokens.json'), JSON.stringify(tokensOut, null, 2), 'utf8');

// ── Component manifest: the full C object, as-is (already clean, serializable data:
//    id, name, category, description, usage, and every variant/state with its real
//    spec values and Kotlin + React code sample) ──

const components = extractConst(html, 'C');
const componentsOut = {
  $description: 'Snacky App component manifest. Generated from index.html by scripts/generate-agent-files.js - do not hand-edit. Each top-level key is a component id; "v" lists its variants, each with spec values ("s") and real Kotlin/React code samples ("code").',
  components,
};
fs.writeFileSync(path.join(ROOT, 'components.json'), JSON.stringify(componentsOut, null, 2), 'utf8');

console.log('Wrote tokens.json and components.json');
console.log('Token groups:', Object.keys(tokens).join(', '));
console.log('Components:', Object.keys(components).length);
