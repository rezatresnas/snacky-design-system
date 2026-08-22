#!/usr/bin/env node
/**
 * Generates the React and Compose icon sets from assets/icons/icons.json,
 * which holds geometry exported straight from Figma's Icon-outline /
 * Icon-solid component sets.
 *
 * Same idea as generate-react-tokens.js / generate-compose-tokens.js: one
 * committed source of truth, two generated outputs, so the two platforms
 * cannot drift from each other or from Figma.
 *
 *   node scripts/generate-icons.js
 *
 * Outputs (never hand-edit):
 *   packages/react-ui/src/icons/outline.tsx
 *   packages/react-ui/src/icons/solid.tsx
 *   packages/compose-ui/src/commonMain/kotlin/com/snacky/ui/components/icon/SnackyIcons.kt
 *   index.html's `const ICONS=...` registry + `const ICON_SET=...` index
 *
 * index.html's registry is rebuilt in place (bracket-matched, the same way
 * generate-agent-files.js reads it) so the site's playgrounds render the same
 * geometry the two packages ship. Icons the playgrounds need that are NOT part
 * of Figma's icon component sets (ratings star, timeline check/clock, etc.)
 * live in assets/icons/legacy-extras.json and are merged back in, and the
 * legacy key names the playgrounds already call `ic()` with are kept working
 * as aliases so no other component's playground breaks.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'assets', 'icons', 'icons.json');

const { icons } = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const byStyle = (style) => icons.filter((i) => i.style === style).sort((a, b) => a.name.localeCompare(b.name));

const HEADER_TS = `// Generated from assets/icons/icons.json by scripts/generate-icons.js - do not hand-edit.
import type { IconProps } from './types.js';
`;

function tsxFile(style, docComment) {
  const list = byStyle(style);
  const body = list
    .map((icon) => {
      const paths = icon.paths
        .map((p) => `[${JSON.stringify(p.d)}, ${JSON.stringify(p.fillRule)}]`)
        .join(',\n    ');
      return `export const ${icon.name} = icon(${icon.size}, [\n    ${paths},\n]);`;
    })
    .join('\n\n');

  return `${HEADER_TS}
${docComment}
function icon(viewBox: number, paths: Array<[string, string]>) {
  return function SnackyIcon({ width = viewBox, height = viewBox, color = 'currentColor', ...rest }: IconProps) {
    return (
      <svg width={width} height={height} viewBox={\`0 0 \${viewBox} \${viewBox}\`} fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
        {paths.map(([d, fillRule], i) => (
          <path
            key={i}
            d={d}
            fill={color}
            fillRule={fillRule as 'nonzero' | 'evenodd'}
            clipRule={fillRule as 'nonzero' | 'evenodd'}
          />
        ))}
      </svg>
    );
  };
}

${body}
`;
}

const OUTLINE_DOC = `/**
 * Outline icon set, exported from Figma's \`Icon-outline\` component set
 * (node 55:2062). These are filled outline shapes, NOT stroked paths: the
 * outline weight is baked into each shape, so they render with \`fill\` and
 * have no stroke width to set.
 *
 * Each icon keeps the viewBox Figma authored it at (16, 20 or 24 - the set
 * is not uniform) and defaults to rendering at that natural size.
 */`;

const SOLID_DOC = `/**
 * Solid icon set, exported from Figma's \`Icon-solid\` component set
 * (node 8772:5851) - the filled counterparts used for active/selected
 * Navbar items and the clicked Favourite state.
 */`;

fs.writeFileSync(path.join(ROOT, 'packages/react-ui/src/icons/outline.tsx'), tsxFile('outline', OUTLINE_DOC));
fs.writeFileSync(path.join(ROOT, 'packages/react-ui/src/icons/solid.tsx'), tsxFile('solid', SOLID_DOC));

// ── Compose ───────────────────────────────────────────────────────────────
function ktEntries(style) {
  return byStyle(style)
    .map((icon) => {
      const paths = icon.paths
        .map((p) => `            SnackyIconPath(${JSON.stringify(p.d)}${p.fillRule === 'evenodd' ? ', evenOdd = true' : ''}),`)
        .join('\n');
      const capitalised = icon.name.charAt(0).toUpperCase() + icon.name.slice(1);
      return `        val ${capitalised} = SnackyIconSpec(\n            viewBox = ${icon.size}f,\n            paths = listOf(\n${paths}\n            ),\n        )`;
    })
    .join('\n\n');
}

const kt = `// Generated from assets/icons/icons.json by scripts/generate-icons.js - do not hand-edit.
package com.snacky.ui.components.icon

/**
 * Snacky icon set, exported from Figma's \`Icon-outline\` (node 55:2062) and
 * \`Icon-solid\` (node 8772:5851) component sets, and generated from the same
 * \`assets/icons/icons.json\` that produces \`packages/react-ui\`'s
 * \`outline.tsx\`/\`solid.tsx\` - so the two platforms cannot drift apart.
 *
 * These are filled outline shapes, NOT stroked paths: the outline weight is
 * baked into each shape, so every icon renders with a fill and there is no
 * stroke width to set. Each icon carries the viewBox Figma authored it at
 * (16, 20 or 24 - the set is deliberately not uniform).
 *
 * Usage:
 * \`\`\`
 * SnackyIcon(SnackyIcons.Outline.Home, contentDescription = "Home")
 * SnackyIcon(SnackyIcons.Solid.Home, tint = SnackyColor.iconBrand)
 * \`\`\`
 */
object SnackyIcons {

    object Outline {
${ktEntries('outline')}
    }

    object Solid {
${ktEntries('solid')}
    }
}
`;

fs.writeFileSync(
  path.join(ROOT, 'packages/compose-ui/src/commonMain/kotlin/com/snacky/ui/components/icon/SnackyIcons.kt'),
  kt
);

// ── index.html registry ───────────────────────────────────────────────────
// Legacy key -> real icon key. These are the names index.html's playgrounds
// already pass to `ic()`, kept working as aliases so replacing the registry
// does not break every other component's Live Preview.
const ALIASES = {
  'home-o': 'home', 'category-o': 'category', 'cart-o': 'cart', 'history-o': 'history',
  'account-o': 'account', 'notification-o': 'bell', 'fav-o': 'heart',
  'home-s': 'home-solid', 'category-s': 'category-solid', 'cart-s': 'cart-solid',
  'history-s': 'history-solid', 'account-s': 'account-solid',
  'notification-s': 'bell-solid', 'fav-s': 'heart-solid', 'poin': 'points-solid',
  'add-to-cart': 'cartAdd', 'dropdown': 'chevronDown', 'picture': 'camera',
  'password-o': 'eyeOff', 'password-active': 'eye', 'close-input': 'closeInput',
  'call': 'phone', 'credit': 'creditCard', 'cod': 'truck', 'saldo': 'balance',
};

const legacyExtras = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets', 'icons', 'legacy-extras.json'), 'utf8')
).icons;

const registry = {};
for (const icon of icons) {
  const key = icon.style === 'solid' ? `${icon.name}-solid` : icon.name;
  // `!` prefix is index.html's own marker for an evenodd sub-path
  registry[key] = {
    vb: `0 0 ${icon.size} ${icon.size}`,
    d: icon.paths.map((p) => (p.fillRule === 'evenodd' ? '!' : '') + p.d),
  };
}
Object.assign(registry, legacyExtras);

const iconSet = {
  outline: byStyle('outline').map((i) => i.name),
  solid: byStyle('solid').map((i) => `${i.name}-solid`),
};

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const start = html.indexOf('const ICONS={');
if (start === -1) throw new Error('index.html: const ICONS={ not found');
let open = html.indexOf('{', start);
let depth = 0;
let end = open;
for (;;) {
  if (html[end] === '{') depth++;
  else if (html[end] === '}') {
    depth--;
    if (depth === 0) break;
  }
  end++;
}
// consume the trailing `;` and any existing generated ICON_SET line
let tail = end + 1;
if (html[tail] === ';') tail++;
const existingSet = /^\s*const ICON_SET=[^\n]*;/.exec(html.slice(tail));
if (existingSet) tail += existingSet[0].length;

const replacement =
  `const ICONS=${JSON.stringify(registry)};\n` +
  `// Generated by scripts/generate-icons.js from assets/icons/icons.json - do not hand-edit.\n` +
  `// ICON_SET indexes only the real Figma icon sets (the registry also carries\n` +
  `// playground-only glyphs and legacy aliases, which the Icon gallery must not list).\n` +
  `const ICON_SET=${JSON.stringify(iconSet)};\n` +
  Object.entries(ALIASES)
    .map(([from, to]) => `ICONS[${JSON.stringify(from)}]=ICONS[${JSON.stringify(to)}];`)
    .join('');

html = html.slice(0, start) + replacement + html.slice(tail);
fs.writeFileSync(path.join(ROOT, 'index.html'), html);

const o = byStyle('outline').length;
const s = byStyle('solid').length;
console.log(`Wrote react-ui outline.tsx (${o}) + solid.tsx (${s}) and compose SnackyIcons.kt (${o + s} icons)`);
console.log(
  `Rebuilt index.html ICONS registry: ${Object.keys(registry).length} entries ` +
    `(${o + s} Figma + ${Object.keys(legacyExtras).length} playground-only) ` +
    `+ ${Object.keys(ALIASES).length} legacy aliases`
);
