## Building with @snacky/ui

**Setup.** Import the stylesheet once at the app root, then import components by name:

```tsx
import '@snacky/ui/styles.css'; // required - the compiled bundle does not inject this for you
import { Button, TextField, Checkbox } from '@snacky/ui';
```

No provider or context wrapper is needed. Every component reads its styling from CSS
custom properties on `:root` (set by the stylesheet above) - there is no `ThemeProvider`,
no context, no runtime theme object to pass in. If a component renders unstyled, the
stylesheet import is missing, not a missing wrapper.

**Styling idiom: CSS custom properties, not utility classes or style props.** Every
component's colors, spacing, radius, and typography resolve through `var(--*)` tokens
defined once in the stylesheet - never pass raw hex/px values or Tailwind-style classes.
Real token families (184 defined total):

| Family | Examples |
|---|---|
| Color | `--color-primary-500`, `--color-neutral-0`..`950`, `--color-red-50`..`900` |
| Surface/text roles | `--bg-app`, `--bg-surface`, `--bg-surface-primary`, `--bg-surface-accent` |
| Spacing (primitive) | `--spacing-2`, `--spacing-4`, `--spacing-8`, `--spacing-12`, `--spacing-16`, `--spacing-24`, `--spacing-32` |
| Radius | `--radius-field`, `--radius-tag`, `--radius-bubble`, `--radius-card`, `--radius-sheet-top`, `--radius-full` |
| Type | `--font-h1-bold-family/size/weight`, `--font-body-regular-*`, `--font-small-*`, `--font-caption-*` |

Component internals already consume these - you only need them when composing custom
layout glue around the library components (gaps, custom containers). Components size
from their content by design (buttons/cards/inputs are not force-fit to a sizing
token); only genuinely fixed-size elements (icons, avatars, navbar height) have a
dedicated sizing token.

**Brand font.** All type tokens point at `"Poppins"`. The font is self-hosted and ships
with this bundle (`fonts/` - 6 weights + italic, OFL-licensed) and is already wired
into `styles.css`, so it just works with the `styles.css` import above - no separate
font link or host-app setup needed.

**Where the truth lives.** Read `_ds/styles.css` (and its `@import` of
`_ds_bundle.css`) for the full token list before styling custom layout. Each
component's `<Name>.d.ts` is its real prop contract (extracted from the shipped
TypeScript types) and `<Name>.prompt.md` has real composed usage - both are more
reliable than guessing from the preview card alone.

**Composition patterns worth knowing:**
- `Danger` is not a fourth button hierarchy - it's a boolean intent (`danger`) that
  layers onto `variant="primary"|"secondary"|"tertiary"`.
- `Section` and `Accordion` are generic content shells: they render sensible default
  spacing but expect real `children` (a product grid, a settings list, an FAQ item) -
  never render them empty.
- `ProductCard` is one component with two shapes via `variant`: `"list"` (compact,
  carousel/grid) and `"details"` (product detail page, with favorite/share/chat
  actions) - not two separate components.
- `Stepper` renders an order-status/progress timeline (dot + label + timestamp per
  step, dashed connector) - use it for any "order processing -> delivered" or
  driver-tracking sequence rather than hand-drawing one.
- `Calendar` is the real date-picker panel (header nav, weekday row, month grid,
  single or range selection, Select Date button) that the `TextField` date-picker
  field opens - use it whenever a design needs an actual calendar surface, not just
  the field that triggers one.

**Idiomatic example** (from a verified preview, `Section` composed with real children):

```tsx
import '@snacky/ui/styles.css';
import { Section, ProductCard } from '@snacky/ui';

function PopularSnacks() {
  return (
    <Section title="Popular snacks" onAction={() => {}}>
      <div style={{ display: 'flex', gap: 'var(--spacing-12)' }}>
        <ProductCard
          variant="list"
          productName="Choco Chip Cookies 200g"
          imageUrl="/cookies.jpg"
          price="Rp 24.000"
          rating={4.8}
          onAddToCart={() => {}}
        />
      </div>
    </Section>
  );
}
```
