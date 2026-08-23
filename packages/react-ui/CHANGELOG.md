# Changelog

How `@snacky/ui` got to its current state. The README documents what the
package *is*; this documents how it got there, including the mistakes, so the
verification claims in the README can be taken at face value.

## Icon set replaced with the real Figma artwork (0.3.0)

The package originally shipped a hand-drawn "starter" icon set: roughly 30
generic 24x24 glyphs with a 1.5px stroke, written from memory and explicitly
documented as not pixel-faithful to Figma.

That was replaced by all 42 Outline + 10 Solid icons exported from Figma's own
`Icon-outline` (node `55:2062`) and `Icon-solid` (`8772:5851`) component sets.
Two structural surprises came out of it:

- The icons are **filled outline shapes**, not stroked paths. The weight is
  baked into each shape, so there is no `strokeWidth` to set.
- The set is **not uniform**. Icons are authored at 16, 20 or 24 units
  depending on where they are used, so each carries its own viewBox instead of
  being scaled from a single size.

Three icons are named for what they actually draw rather than their Figma
property value, confirmed by rendering the exported geometry: Figma's `cod` is
a delivery truck (`truck`), `list` is a right chevron (`chevronRight`), and the
two `password` states are a crossed-out and an open eye (`eyeOff` / `eye`).

`src/icons/outline.tsx` and `solid.tsx` are now generated from
`assets/icons/icons.json` by `scripts/generate-icons.js`, the same source that
generates the Compose package's `SnackyIcons.kt`, so the two platforms cannot
drift apart. Parity was verified by diffing every path, viewBox and fill-rule
in both generated outputs against the source: 52/52 exact on each side.

### Attribution gap (0.3.0 and 0.3.1, both unpublished)

Those two versions shipped the Flaticon artwork with no attribution at all,
inside an MIT package. CC BY 4.0 permits the redistribution but requires the
credit to travel with the work. Both versions were unpublished from npm and
0.3.2 shipped the attribution embedded in the generated icon sources (using
`/*!` so minifiers keep it), verified to survive the bundler into
`dist/index.js`, plus a `NOTICE` file in the published tarball.

## Component verification pass

The first pass of every component was built from `components.json`'s spec
values and `code.tsx` samples alone. Those are real token values, but
`code.tsx` is an *illustrative* usage sample, not the site's actual rendered
implementation - and that first pass was never checked against how the site
really renders each component.

Real mismatches slipped through as a result: Button's icon slot, Toggle's true
dimensions, Checkbox's checkmark color, Radio's dot size, Tab's gap,
ProductCard's cart-button size, and List's status colors, among others.

Every component was then diffed against `index.html`'s own `PG[id].impl`
strings - the React-createElement code that powers the site's Live Preview
panels - field by field: padding, colors, font, line-height, and
hover/pressed/disabled states. That implementation is treated as authoritative
where `components.json`'s prose spec disagrees with it.

`List` and `Header` were additionally cross-checked directly against their
Figma component sets, and both agreed with the verified implementation.

`BottomSheet` and `Section` have not had this treatment yet.

## Other fixes worth recording

- **ProductImage sizing (0.3.1).** The component builds its class name as
  `--${usage}`, but the stylesheet spelled the first two rules `--card` and
  `--details` instead of `--product-card` and `--product-details`. Those two
  usages - the 128px card image and the 200px detail image, the two most common
  ones - matched no rule at all and rendered completely unsized.
- **Unstyled-components trap (0.3.3).** The README's usage snippet said
  `import '@snacky/ui'` would pull in the stylesheet "as a side effect". It does
  not: tsup extracts the CSS to a standalone `dist/index.css` and never
  re-injects it into the JS entry, so anyone following the snippet verbatim got
  unstyled components. The correct import is `@snacky/ui/styles.css`.
