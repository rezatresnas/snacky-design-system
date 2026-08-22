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

const o = byStyle('outline').length;
const s = byStyle('solid').length;
console.log(`Wrote react-ui outline.tsx (${o}) + solid.tsx (${s}) and compose SnackyIcons.kt (${o + s} icons)`);
