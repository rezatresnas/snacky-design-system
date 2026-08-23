# @snacky/ui

React implementation of the Snacky App design system - generated from the
source of truth at `../../index.html` (via `tokens.json` / `components.json`),
pixel-accurate to Figma (file key `4Uh4Y1fPQXu2hwq0vEXHXd`).

This exists so AI coding tools (and humans) building new Snacky features can
**import** these components directly instead of regenerating similar-looking
markup from scratch every time.

## Install

```bash
npm install @snacky/ui
```

Published at [npmjs.com/package/@snacky/ui](https://www.npmjs.com/package/@snacky/ui).
To build from source instead (e.g. to work on the components themselves), clone
[the repo](https://github.com/rezatresnas/snacky-design-system) and, from its root:

```bash
cd packages/react-ui
npm install
npm run build
```

## Usage

```tsx
import '@snacky/ui/styles.css'; // required - the compiled bundle does not inject this for you
import { Button, TextField, Checkbox } from '@snacky/ui';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  return (
    <form>
      <TextField label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Checkbox label="I agree to the terms" checked={agreed} onChange={setAgreed} />
      <Button type="submit" disabled={!agreed}>Sign up</Button>
    </form>
  );
}
```

## What's here

All 22 documented components, each matching its `code.tsx` sample's prop
shape from `components.json` (padding, colors, radius, states - all sourced
directly from the design tokens, not eyeballed):

Button, IconButton/UploadButton, Input family (TextField, SearchField,
OtpField, CopyField, ChatInput, AddressResult), Chips (ProductChip/FilterChip),
RadioOption, Checkbox, Toggle, NavBar, TabRow, Header, Banner family, Badge family,
Callout, List (OrderListItem/NotificationListItem), Accordion, BottomSheet
(the shared Modal shell), Section (the shared content-block shell), Avatar,
Illustration, ProductImage, ProductCard.

## Verification status

Every component is diffed against `index.html`'s own Live Preview
implementation - the code that actually renders the documentation site - not
just the spec values in `components.json`. Where the two disagree, the
verified implementation wins. `List`, `Header`, `BottomSheet` and `Section`
were additionally checked against their Figma component sets directly.

See [CHANGELOG.md](https://github.com/rezatresnas/snacky-design-system/blob/main/packages/react-ui/CHANGELOG.md)
for how the package got here, including the mistakes.

## Artwork credit and licensing

The code in this package is MIT. The **icon artwork is not**: it is
[UIcons by Flaticon](https://www.flaticon.com/uicons), used under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and modified
(exported from the Figma Community file and renamed to semantic English
names).

CC BY 4.0 allows redistribution, including inside this package, but the
attribution has to travel with the artwork. It is embedded in
`src/icons/*.tsx` and survives into the published bundle, and the full
statement ships as `NOTICE`. **If you redistribute these icons - vendoring
them, re-exporting them, publishing your own package built on them - keep
that credit.** Using them in an app you ship needs no visible credit beyond
what is already in the bundle.

## Known gaps - read before relying on these

- **Icons** (`SnackyIcons.outline.*` / `SnackyIcons.solid.*`): no longer a
  gap. The hand-drawn starter set has been replaced by the real thing - all
  42 Outline + 10 Solid icons exported from Figma's own `Icon-outline` (node
  `55:2062`) and `Icon-solid` (`8772:5851`) component sets. `src/icons/outline.tsx` and
  `solid.tsx` are generated from `../../assets/icons/icons.json` by
  `../../scripts/generate-icons.js` (never hand-edit them), the same source
  that generates compose-ui's `SnackyIcons.kt`.

  Two things changed versus the old hand-drawn placeholder: the icons are
  **filled outline shapes**, not stroked paths (the weight is baked into each
  shape, there is no `strokeWidth` to set), and the set is **not uniform** -
  icons are authored at 16, 20 or 24px depending on use, so each carries its
  own viewBox and defaults to that natural size.
- **Illustration** ships no artwork - you supply the image. This is
  deliberate and normal (Material, Radix and Chakra ship none either); the
  component owns the documented canvas size for each variant, which is the
  part that belongs in a design system. The Snacky artwork itself is modified
  stock and is not ours to redistribute.

  ```tsx
  import { Illustration } from '@snacky/ui';

  <Illustration variant="empty" src="/img/empty.svg" alt="No products found" />
  ```

  Variant sizes are fixed: `empty` 268x200, `createAccount` 360x240,
  `welcome` 200x200, `success` 200x200, `discountReferral` 268x200. Export
  your artwork at those ratios (SVG preferred) and host it wherever your app
  already serves static assets.

  **Where to get artwork that fits:** [Open Peeps](https://www.openpeeps.com/)
  is CC0 (public domain - no attribution, no restrictions), so it is the
  easiest drop-in. [unDraw](https://undraw.co/) needs no attribution and
  allows commercial use, but its licence forbids redistributing the assets
  "in packs", so use it in your own app rather than re-publishing it inside a
  library of your own. Either way, check the licence yourself before shipping
  - it is the one part of this that a component library cannot decide for you.

- **`NavBar` items use `flex: 1`** to fill the container, where the site's demo
  hardcodes `72x72` per item - that demo only ever renders at a fixed 360px
  frame, so this is a deliberate deviation rather than a mismatch.
- **Modal/Section**: the design system documents ~9 Modal "variants" and ~13
  Section "variants", but each is really the *same* shell component
  (`BottomSheet` / `Section`) with different `children` - so that's what's
  exported, matching every `code.tsx` sample exactly, rather than 22 near-
  duplicate components. Their spacing is variant-dependent by design - Figma
  uses different gaps per variant, so the shells ship sensible defaults and
  expect `children` to override where a composition needs it.

## Keeping this in sync

If `index.html`'s component data (the `C` object) changes:

```bash
node ../../scripts/generate-agent-files.js   # regenerates tokens.json / components.json
node ../../scripts/generate-react-tokens.js  # regenerates src/theme/tokens.css / tokens.ts
```

Then re-check any component whose spec changed against its file here -
token/color/spacing changes propagate automatically via the regenerated CSS
variables, but structural changes (new variant, new prop) need a manual edit.
