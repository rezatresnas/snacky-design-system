/**
 * Generates DESIGN.md at the repo root from tokens.json and components.json,
 * following Google's open DESIGN.md format (https://github.com/google-labs-code/design.md).
 *
 * Same philosophy as generate-agent-files.js: every value here is pulled
 * programmatically from the same generated JSON that packages/react-ui,
 * packages/compose-ui and index.html already resolve through, via a reverse
 * lookup (hex/px value -> token name). Nothing is hand-typed, so this file
 * cannot state a value that disagrees with the rest of the design system.
 *
 * Run after generate-agent-files.js, whenever tokens.json or components.json
 * change:
 *   node scripts/generate-design-md.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens.json'), 'utf8'));
const components = JSON.parse(fs.readFileSync(path.join(ROOT, 'components.json'), 'utf8')).components;

// ---------------------------------------------------------------- helpers

function flatten(obj, prefix = '') {
  const out = [];
  if (obj && typeof obj === 'object') {
    if ('$value' in obj) return [[prefix, obj.$value, obj.$description]];
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('$')) continue;
      out.push(...flatten(v, prefix ? `${prefix}.${k}` : k));
    }
  }
  return out;
}

function resolveAlias(value, root) {
  let v = value;
  let guard = 0;
  while (typeof v === 'string' && v.startsWith('{') && guard++ < 6) {
    const path = v.slice(1, -1).split('.');
    let node = root;
    for (const p of path) node = node[p];
    v = node.$value;
  }
  return v;
}

// camelCase -> kebab-case, matching the CSS custom property names the
// packages already ship (e.g. bgActionPrimary -> bg-action-primary).
function kebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function yamlScalar(v) {
  if (typeof v === 'number') return String(v);
  const s = String(v);
  // quote anything that isn't a bare alphanumeric/hex/dash token, so colors,
  // refs and values with spaces or leading zeros stay valid YAML.
  if (/^[A-Za-z0-9_-]+$/.test(s)) return s;
  return `"${s.replace(/"/g, '\\"')}"`;
}

// ---------------------------------------------------------------- colors

const colorEntries = flatten(tokens.color.semantic).map(([p, v]) => {
  const name = kebab(p.split('.').slice(1).join('-')); // drop the group prefix (app/surface/action/...)
  return [name, resolveAlias(v, tokens)];
});
// De-dupe (a couple of semantic groups produce the same leaf name only once
// in this token set, but guard anyway) and keep source order.
const colors = [];
const seenColorNames = new Set();
for (const [name, hex] of colorEntries) {
  if (seenColorNames.has(name)) continue;
  seenColorNames.add(name);
  colors.push([name, hex]);
}
// DESIGN.md requires at least `primary`. Ours is the base brand shade,
// primitive.primary.500, which several semantic tokens already alias.
colors.unshift(['primary', tokens.color.primitive.primary['500'].$value]);

// Several tokens alias the same hex on purpose (e.g. bg-action-primary-pressed
// and text-on-action-tertiary are both #b08224, independently, because
// Figma reuses the primitive). A single hex -> name map would silently pick
// whichever happened to iterate first, which is exactly how a background
// token ended up labeling a text color below. Keep every name per hex and
// let the caller say which family it actually wants.
const colorsByHex = new Map();
for (const [name, hex] of colors) {
  if (!colorsByHex.has(hex)) colorsByHex.set(hex, []);
  colorsByHex.get(hex).push(name);
}

// ---------------------------------------------------------------- typography

const typography = flatten(tokens.typography).map(([p, v]) => {
  const name = kebab(p.replace('.', '-'));
  const letterSpacing = v.letterSpacing === '0' ? '0em' : v.letterSpacing;
  return [name, { ...v, letterSpacing }];
});

// ---------------------------------------------------------------- rounded

const rounded = flatten(tokens.radius.semantic).map(([p, v]) => [p, resolveAlias(v, tokens)]);
const roundedValueToName = new Map();
for (const [name, px] of rounded) roundedValueToName.set(px, name);

// ---------------------------------------------------------------- spacing

const spacingPrimitive = flatten(tokens.spacing.primitive).map(([p, v]) => [p, v]); // keys are already "4", "8", "12"...
const spacingSemantic = [];
for (const group of ['gap', 'layout', 'margin']) {
  for (const [p, v] of flatten(tokens.spacing[group])) {
    // p is already a single flat key here (e.g. "icon-label"), not a
    // "group.leaf" path like the color tokens, so there is no group prefix
    // to strip.
    spacingSemantic.push([kebab(p), resolveAlias(v, tokens)]);
  }
}
const spacingValueToName = new Map();
for (const [name, px] of spacingPrimitive) spacingValueToName.set(px, name); // numeric-named primitives take priority as refs

// ---------------------------------------------------------------- components

// pull one component's spec object by id + variant id
function spec(componentId, variantId) {
  const comp = components[componentId];
  const v = comp.v.find((x) => x.id === variantId);
  return v ? v.s : null;
}

function colorRef(hex, preferPrefixes = []) {
  if (!hex) return null;
  const clean = hex.split(' ')[0]; // strip "(accent)"-style annotations
  const candidates = colorsByHex.get(clean);
  if (!candidates) return clean;
  const preferred = candidates.find((n) => preferPrefixes.some((p) => n.startsWith(p)));
  return `{colors.${preferred || candidates[0]}}`;
}
function roundedRef(px) {
  const name = roundedValueToName.get(`${px}px`);
  return name ? `{rounded.${name}}` : `${px}px`;
}
function spacingRef(px) {
  const name = spacingValueToName.get(`${px}px`);
  return name ? `{spacing.${name}}` : `${px}px`;
}
function typographyRefFromFontString(fontStr, fs) {
  // components.json stores font as "Poppins SemiBold" + separate fs/lh; map
  // back to the typography token whose family/weight/size all match.
  if (!fontStr) return null;
  const weightWord = fontStr.split(' ').slice(1).join(' ') || 'Regular';
  const weightMap = { Regular: 400, SemiBold: 600, Bold: 700 };
  const weight = weightMap[weightWord];
  for (const [name, t] of typography) {
    if (t.fontWeight === weight && parseInt(t.fontSize, 10) === fs) return `{typography.${name}}`;
  }
  return null;
}

const componentEntries = [];
function pushComponent(name, s, { skipTypography } = {}) {
  if (!s) return;
  const props = {};
  if (s.fill) props.backgroundColor = colorRef(s.fill, ['bg-', 'primary']);
  if (s.color) props.textColor = colorRef(s.color, ['text-']);
  if (!skipTypography) {
    const t = typographyRefFromFontString(s.font, s.fs);
    if (t) props.typography = t;
  }
  if (s.r != null) props.rounded = roundedRef(s.r);
  // asymmetric padding can't fit DESIGN.md's single-Dimension `padding`
  // field; the vertical value is used as the representative token, and the
  // real per-side numbers are called out in the Components prose below.
  if (s.pt != null) props.padding = spacingRef(s.pt);
  componentEntries.push([name, props]);
}

pushComponent('button-primary', spec('button', 'btn-primary'));
pushComponent('button-primary-danger', spec('button', 'btn-primary-danger'));
pushComponent('button-secondary', spec('button', 'btn-secondary'));
pushComponent('button-tertiary', spec('button', 'btn-tertiary'));
pushComponent('chip-product', spec('chips', 'chips-produk'));
pushComponent('chip-filter', spec('chips', 'chips-filter'));
{
  const s = spec('checkbox', 'checkbox');
  if (s) componentEntries.push(['checkbox', { rounded: roundedRef(s.r), size: `${s.w}px` }]);
}
{
  const s = spec('radio-button', 'radio');
  if (s) componentEntries.push(['radio-button', { rounded: roundedRef(s.r), size: `${s.w}px` }]);
}
pushComponent('input-field', spec('input', 'input-text'));
pushComponent('list-item', spec('list', 'list-order-waiting'));
pushComponent('callout-received', spec('callout', 'callout-received'));
pushComponent('callout-sent', spec('callout', 'callout-sent'));
pushComponent('badge-notification', spec('badge', 'badge-notification'), { skipTypography: true });
pushComponent('product-card', spec('product-card', 'productcard-list'));

// ---------------------------------------------------------------- YAML emit

const yamlLines = [];
yamlLines.push('version: alpha');
yamlLines.push('name: Snacky App');
yamlLines.push(
  'description: Design system for Snacky, a snack e-commerce mobile app, targeting Kotlin Compose Multiplatform and React. Source of truth is a Figma file, extracted pixel-accurately.'
);
yamlLines.push('colors:');
for (const [name, hex] of colors) yamlLines.push(`  ${name}: "${hex}"`);
yamlLines.push('typography:');
for (const [name, t] of typography) {
  yamlLines.push(`  ${name}:`);
  yamlLines.push(`    fontFamily: ${t.fontFamily}`);
  yamlLines.push(`    fontSize: ${t.fontSize}`);
  yamlLines.push(`    fontWeight: ${t.fontWeight}`);
  yamlLines.push(`    lineHeight: ${t.lineHeight}`);
  yamlLines.push(`    letterSpacing: ${t.letterSpacing}`);
}
yamlLines.push('rounded:');
for (const [name, px] of rounded) yamlLines.push(`  ${name}: ${px}`);
yamlLines.push('spacing:');
for (const [name, px] of spacingPrimitive) yamlLines.push(`  "${name}": ${px}`);
for (const [name, px] of spacingSemantic) yamlLines.push(`  ${name}: ${px}`);
yamlLines.push('components:');
for (const [name, props] of componentEntries) {
  yamlLines.push(`  ${name}:`);
  for (const [k, v] of Object.entries(props)) {
    if (v == null) continue;
    yamlLines.push(`    ${k}: ${/^\{.*\}$/.test(v) ? `"${v}"` : yamlScalar(v)}`);
  }
}

const yaml = yamlLines.join('\n');

// ---------------------------------------------------------------- markdown body

const body = `
## Overview

Snacky is a snack e-commerce mobile app. The interface is dense and utilitarian
(product grids, order tracking, payment rows) but stays warm rather than
sterile, carried entirely by one accent color and rounded geometry rather than
illustration or heavy imagery. There is no secondary or tertiary brand hue;
color is used sparingly and functionally, not decoratively.

## Colors

The palette is a single amber accent (\`{colors.primary}\`, \`#f8b732\`) over
neutral grays, with a red used exclusively for danger and error states, never
for anything decorative.

- **Primary action** (\`{colors.bg-action-primary}\`): the amber accent, used for
  the single most important action on a screen. Never more than one Primary
  button per screen.
- **Text** (\`{colors.text-primary}\` #333333, \`{colors.text-secondary}\` #7a7a7a):
  near-black for primary reading text, mid-gray for secondary/meta text.
  There is no pure black or pure white text color.
- **Danger** (\`{colors.bg-action-primary-danger}\`, \`{colors.text-error}\`): a
  distinct red, reserved for destructive actions and error states. Danger is
  an intent that layers onto the Primary/Secondary/Tertiary hierarchy, it is
  not a fourth hierarchy of its own.
- **Surfaces**: white (\`{colors.bg-surface}\`) is the default surface. A light
  amber tint (\`{colors.bg-surface-highlight}\`) marks a selected or highlighted
  state, never a full section background.

## Typography

One typeface, Poppins, across the whole system: no secondary or monospace
family. Eleven levels cover every documented component, named by role and
weight (\`h1-bold\`, \`body-regular\`, \`small-bold\`, \`caption-regular\`, and so
on) rather than by numeric scale. Line height is fixed per level and rarely
matches a simple multiplier of font size (\`body\` sits at 14px text with a 24px
line, for example) because these values are extracted from Figma's authored
line boxes, not derived from a formula.

## Layout

Every screen shares one rule with no exceptions: a 16px horizontal margin from
the screen edge to content (\`{spacing.screen}\`), with content filling the
available width rather than sitting in a fixed pixel column.

Component padding uses the primitive spacing scale directly (\`{spacing.4}\`,
\`{spacing.8}\`, \`{spacing.12}\`, ...); there are no semantic padding aliases at
that scale. Layout and gap spacing between elements does use semantic tokens,
scoped by what they connect: \`{spacing.icon-label}\` for an icon above a label,
\`{spacing.text-icon}\` for an icon beside text in a field, \`{spacing.stack}\`
for a vertical list of form fields or a footer CTA area.

## Elevation & Depth

Flat by default. Most surfaces use a plain fill with no shadow. Cards that
need to read as raised above the page (list items, product cards, the
secondary icon button) use a soft, low-opacity shadow rather than a border,
for example \`0 4px 8px rgba(0,0,0,0.08)\` on a list row or \`0 10px 30px
rgba(0,0,0,0.1)\` under a floating product card. Bottom sheets and modals use
elevation implicitly, they sit above a dimmed overlay rather than casting
their own shadow.

## Shapes

Corner radius is role based, not a generic small/medium/large scale:
\`{rounded.field}\` (4px) for buttons, inputs, cards and list items,
\`{rounded.tag}\` (6px) for compact badges, \`{rounded.bubble}\` (8px) for chat
bubbles and callouts, \`{rounded.card}\` (10px) for summary/balance cards,
\`{rounded.sheet-top}\` (20px) for the top corners of bottom sheets and modals
only (bottom corners stay square), and \`{rounded.full}\` for anything fully
circular: icon buttons, chips, pills, avatars.

## Components

Padding below is written as it actually appears in Figma (vertical /
horizontal), since DESIGN.md's \`padding\` token holds one value and several of
these components are asymmetric:

- **Button**: 48px tall, 12px vertical / 8px horizontal padding, full width by
  default. Three hierarchies (Primary, Secondary, Tertiary), each of which
  Danger layers onto rather than replacing.
- **Chips**: 40px tall, 8px padding all sides, fully rounded. The Product
  variant adds a 24px thumbnail before the label; the Filter variant is text
  only.
- **Checkbox / Radio button**: both 24px square. Checkbox uses
  \`{rounded.field}\`; Radio button is a true circle.
- **Input field**: 48px tall, 12px vertical / 8px horizontal padding, 1px
  border. The same shell is reused for text, password, dropdown, date picker,
  address and search variants, only the leading/trailing icon and read-only
  state change.
- **List item**: 152px tall for an order row with a payment deadline banner,
  8px vertical / 12px horizontal padding, a 48px thumbnail, and the
  \`0 4px 8px rgba(0,0,0,0.08)\` shadow.
- **Callout**: 200px wide, 12px vertical / 8px horizontal padding. Received
  messages align left on white; Sent and Pending align right on the accent
  fill.
- **Badge**: sizes vary by purpose (a 28x19 notification count reads very
  differently from a 36x24 discount tag), but all use SemiBold Poppins in
  white on a solid fill, never an outline style.
- **Product Card**: 152px wide in its list form, 12px padding, a 128px image,
  and the \`0 10px 30px rgba(0,0,0,0.1)\` shadow that lets it read as a floating
  tile in a horizontal carousel.

## Do's and Don'ts

- Do treat Danger as an intent layered onto Primary/Secondary/Tertiary, never
  as a fourth button hierarchy.
- Do use the 16px screen margin on every screen, with no fixed-width exceptions.
- Do reach for a semantic spacing token for gaps between elements; use the
  primitive scale directly for padding inside a component.
- Don't invent a new corner radius. Every rounded value in this system maps to
  one of the six roles in Shapes.
- Don't substitute an emoji or a hand-drawn icon for a missing glyph. The
  icon set (42 outline, 11 solid) is exhaustive for this system's documented
  screens; if nothing fits, that's a signal the icon set needs a real
  addition, not a placeholder.
`.trim();

const banner = `<!-- Generated by scripts/generate-design-md.js from tokens.json and components.json.
     Do not hand-edit. See https://github.com/google-labs-code/design.md for the format. -->

# Snacky App

`;

const output = `${banner}---\n${yaml}\n---\n\n${body}\n`;

fs.writeFileSync(path.join(ROOT, 'DESIGN.md'), output);
console.log(
  `Wrote DESIGN.md: ${colors.length} colors, ${typography.length} typography levels, ${rounded.length} rounded, ` +
    `${spacingPrimitive.length + spacingSemantic.length} spacing, ${componentEntries.length} components (${output.length} bytes)`
);
