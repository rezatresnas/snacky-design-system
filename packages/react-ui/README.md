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
To build from source instead (e.g. to work on the components themselves):

```bash
cd packages/react-ui
npm install
npm run build
```

## Usage

```tsx
import '@snacky/ui'; // pulls in theme/tokens.css as a side effect
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

The first pass of every component was built from `components.json`'s `s`
(spec) values and `code.tsx` samples alone - those are real token values, but
`code.tsx` is an *illustrative* usage sample, not the site's actual rendered
implementation. That first pass was **not** checked against how the site
itself actually renders each component, and several real mismatches slipped
through as a result (Button's icon slot, Toggle's true dimensions, Checkbox's
checkmark color, Radio's dot size, Tab's gap, ProductCard's cart-button size,
List's status colors, and more).

Every component has since been diffed against `index.html`'s own `PG[id].impl`
strings - the actual React-createElement code that powers the site's "Live
Preview" panels, extracted and compared field-by-field (padding, colors,
font, line-height, hover/pressed/disabled states) - and corrected to match.
This is the authoritative source in this repo; `components.json`'s prose spec
text occasionally disagrees with it (e.g. Checkbox's checkmark is documented
as "white" but the verified implementation uses `#333333`) and the verified
implementation wins in every such case.

`List`'s `OrderListItem`/`NotificationListItem` were additionally cross-checked
directly against their Figma component set (page "List", component `List`,
`Property 1=order|notification` x `Property 2=<status>`) - the node tree
(fills, strokes, padding, gap, type styles) matches the verified `PG.list.impl`
implementation exactly, so both sources agree: 56x56 thumbnail frame (`#f4f4f5`
background, not a token - a literal value distinct from any generated surface
color), a per-status summary card (`itemsSummary` + bold `total`, a bordered
COD chip on `processCod`, a `paymentDeadline` banner on `waiting`, a right-
aligned primary Button - "Track Shipment" / "Buy Again" - on
shipped/received/cancelled), and a title+message notification row with a
`1px solid var(--border-main)` border on every state, not just unread.

`Header` was added later, directly from Figma rather than retrofitted from
an existing implementation: inspected the `Header` component set (page
"Header", variants `Icon=Back|Close|None` x `Right Action=True|False`) node
tree for exact spec values (16px/8px padding, 40x40px circular icon buttons,
Poppins Bold 16px/36px title), verified against a live smoke-test render for
all 4 variants (structure, computed styles, click handlers), and confirmed
the `PG.header.impl` string added to the site itself matches the same spec.

**One deliberate deviation, not an oversight:** `NavBar` items use `flex:1`
to fill the container width, where the site's own demo hardcodes `72x72`
per item - because that demo is only ever shown at a fixed 360px frame. A
production nav bar needs to fill whatever width the real device is, so the
flexible layout was kept on purpose.

## Known gaps - read before relying on these

- **Icons** (`SnackyIcons.outline.*` / `SnackyIcons.solid.*`): only a starter
  set is included (~30 outline, 3 solid), covering what's needed for a typical
  form. The full documented set (41 outline + 10 solid) needs to be exported
  from Figma's real icon components - the same way this whole design system
  was built (`get_screenshot`/`download_assets` via the `figma-use` skill) -
  and dropped into `src/icons/`. The starter set was hand-drawn as generic,
  conventional UI glyphs; it does **not** claim pixel-fidelity to Figma.
- **Illustration** ships no artwork - pass your own hosted `src`.
- **Modal/Section**: the design system documents ~9 Modal "variants" and ~13
  Section "variants", but each is really the *same* shell component
  (`BottomSheet` / `Section`) with different `children` - so that's what's
  exported, matching every `code.tsx` sample exactly, rather than 22 near-
  duplicate components. These two shells have not yet been diffed field-by-
  field against `PG.modal`/`PG.section` the way the rest of the package has -
  treat their exact padding/gap values as reasonable-but-unverified.

## Keeping this in sync

If `index.html`'s component data (the `C` object) changes:

```bash
node ../../scripts/generate-agent-files.js   # regenerates tokens.json / components.json
node ../../scripts/generate-react-tokens.js  # regenerates src/theme/tokens.css / tokens.ts
```

Then re-check any component whose spec changed against its file here -
token/color/spacing changes propagate automatically via the regenerated CSS
variables, but structural changes (new variant, new prop) need a manual edit.
