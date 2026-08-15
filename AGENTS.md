# AGENTS.md

Snacky App Design System - a single-page site (`index.html`) documenting a
snack e-commerce app's UI, sourced pixel-accurately from Figma (file key
`4Uh4Y1fPQXu2hwq0vEXHXd`). Never guess a spec value - verify against Figma
before documenting or changing one.

## Start here

Read [llms.txt](llms.txt) first. It indexes:

- `tokens.json` / `components.json` - every design token and component spec,
  machine-readable, generated from `index.html` (never hand-edit these).
- `packages/react-ui` - `@snacky/ui`, a real React implementation of all 21
  components.

## Building a feature

Import from `@snacky/ui` instead of regenerating markup from the code samples
in `components.json` - those are illustrative, the package is the real thing:

```bash
npm install @snacky/ui
```

```tsx
import '@snacky/ui';
import { Button, TextField, Checkbox } from '@snacky/ui';
```

See [packages/react-ui/README.md](packages/react-ui/README.md) for the full
component list, known gaps, and verification status.

## Rules that apply everywhere in this repo

- Screen margin is 16px on every screen; content is Fill container, not a
  fixed width.
- Danger is an intent that layers onto Primary/Secondary/Tertiary hierarchy -
  not a fourth hierarchy of its own.
- Component padding uses primitive spacing tokens directly; gap/layout
  spacing uses semantic tokens.
- Only genuinely fixed-size elements (icons, avatars, navbar height) get a
  sizing token; buttons/cards/inputs size from content.
- No em dashes in any authored text (descriptions, usage copy, code
  comments, generated files) - use a comma, colon, or parentheses instead.

## Keeping generated files in sync

After changing `index.html`'s token or component data:

```bash
node scripts/generate-agent-files.js    # tokens.json / components.json
node scripts/generate-react-tokens.js   # packages/react-ui token CSS/TS
```

Full project history, working-style notes, and file map:
[CLAUDE.md](CLAUDE.md).
