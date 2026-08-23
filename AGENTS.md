# AGENTS.md

Snacky App Design System - a single-page site (`index.html`) documenting a
snack e-commerce app's UI, sourced pixel-accurately from Figma (file key
`4Uh4Y1fPQXu2hwq0vEXHXd`). Never guess a spec value - verify against Figma
before documenting or changing one.

## Start here

Read [llms.txt](llms.txt) first. It indexes:

- `tokens.json` / `components.json` - every design token and component spec,
  machine-readable, generated from `index.html` (never hand-edit these).
- `packages/react-ui` - `@snacky/ui` on npm, a real React implementation of all
  22 components.
- `packages/compose-ui` - the Kotlin Multiplatform / Compose Multiplatform
  counterpart, all 22 components, published via JitPack
  (`com.github.rezatresnas:snacky-design-system:compose-v1.0.1`). Generated from
  the same source as the React package, so the two do not drift.

Asset licensing: the repo's MIT LICENSE covers CODE ONLY. The bundled icon set is
UIcons by Flaticon under CC BY 4.0 (modified). The attribution is embedded as a
comment header in the generated icon sources and must not be stripped - see
`NOTICE`. The illustrations are also modified stock and are deliberately NOT
bundled; `Illustration` ships only the documented canvas size.

## Building a feature

Import from `@snacky/ui` instead of regenerating markup from the code samples
in `components.json` - those are illustrative, the package is the real thing.

```bash
npm install @snacky/ui
```

```tsx
import '@snacky/ui';
import { Button, TextField, Checkbox } from '@snacky/ui';
```

See that same README for the full component list, known gaps, and
verification status.

## Worked example

Task: "add a promo code field to checkout." The flow an agent should follow:

1. Check `components.json` first - does an existing component already cover
   this (a `TextField` variant, an error/invalid state), or does it need new
   markup? Prefer the existing variant.
2. Import the real components, don't hand-roll the markup:

   ```tsx
   import { TextField, Button } from '@snacky/ui';

   function PromoCodeField() {
     const [code, setCode] = useState('');
     return (
       <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-layout-stack)' }}>
         <TextField label="Promo code" value={code} onChange={setCode} placeholder="Enter code" />
         <Button variant="secondary" onClick={() => applyPromo(code)}>Apply</Button>
       </div>
     );
   }
   ```

3. Colors, padding, and radius come for free - they resolve through the
   package's bundled `tokens.css`. The only thing to decide by hand is
   *layout* spacing (the gap between the field and the button here), and
   that should be a real semantic token from `tokens.json`, not a guessed
   pixel value - `spacing.semantic.layout.stack` (`var(--gap-layout-stack)`,
   24px) is documented for exactly this: "form field list, footer/CTA
   button area." Check `tokens.json`'s `$description` before picking one;
   don't assume a token name matches your use case.
4. If this sits inside a full screen (not a sub-block), wrap it with the
   16px screen margin (`spacing.margin.screen`) per the rule below - every
   screen uses it, no exceptions.

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
