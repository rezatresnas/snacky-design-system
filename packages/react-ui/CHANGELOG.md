# Changelog

How `@snacky/ui` got to its current state. The README documents what the
package *is*; this documents how it got there, including the mistakes, so the
verification claims in the README can be taken at face value.

## PointBalanceBanner's two halves now share the row equally (0.8.1)

`.snacky-banner-point-balance__item` (the Points group and the Balance group
either side of the hairline divider) never had a `flex` value, so each one
just hugged its own content width and both packed against the left edge.
That was invisible in the docs site's own Live Preview, which always renders
this component inside a hardcoded `width: 312` wrapper matching Figma's exact
frame size - the one width where there's barely any slack to expose the bug.
It showed up once the component was dropped into a genuinely wider container
(the Claude Design gallery's story card, auto-sized well past 312px): the
divider landed right after the first group instead of at the midpoint, and
the row's tinted, bordered background kept stretching to `width: 100%` with
nothing in the empty half but its own surface colour.

Figma's own auto-layout already has both item columns set to fill-container,
splitting the row 50/50 around the divider - confirmed directly in Figma's
dev-mode inspect view, not inferred. Added `flex: 1` to both items (`weight
(1f)` in compose-ui), so each column now grows to take an equal share of
whatever width the row fills, with its icon/label/value left-aligned inside
that half. Verified by rendering the real package at 312px (Figma spec, where
nothing changes visually - the two halves were already close to equal there),
and at 400px (matching the gallery card's rough width): the divider sits at
49.8-49.9% of the row's width in both cases, and a "LowBalance" sibling
("0" / "Rp 0") now measures pixel-identical to "Default" at the same
container width, which is exactly the sibling-mismatch problem `width: 100%`
was introduced to solve in 0.7.1 in the first place.

## VariantBadge renamed to InfoBadge, with an icon slot (0.8.0)

The badge that renders `Variant: 75 Grams` turned out to have a second use in
Figma: `Points: 20,000` in the Home header. Identical in every respect -
32 tall, 8px padding, `bg-surface-highlight` on a `primary-500` stroke,
`radius/field` - except for a leading icon.

Two things came out of that. First, the name was wrong: `variant` described
one use of the pattern, not the pattern, and a third use (`Berat: 500g`,
`Stok: 12`) would have had nowhere to go. It is now `InfoBadge`, named for the
shape of the information - a static, non-interactive `Label: Value` chip.
Second, the icon is a slot rather than a second component, because nothing
else differs between the two; Figma models them as `Property 2=variant` /
`Property 2=points`, which is a naming axis, not a structural one.

Worth recording as evidence, since "is this really a component?" keeps coming
up in this repo: the points version was **not** a one-off. Searching the
`Customer App - English` page's full node dump turned up seven copies of the
same 116x32 structure - one named `Points info`, six named `Frame 1064` -
hand-copied across different screens rather than instanced. That is the same
shape as the `Stepper` case (19 hand-drawn copies under two frame names), and
the same conclusion: a repeated hand-drawn pattern is a missing component, not
app composition.

`VariantBadge` and `VariantBadgeProps` still export as `@deprecated` aliases,
so existing code keeps working.

One inconsistency was caught while verifying: compose-ui tinted the icon slot
`icon-brand` (per Figma) but react-ui did not, so anyone copying the
documented snippet would have got `#333`. The playground was hiding it by
passing an explicit colour that the docs never mention. The tint now lives in
`.snacky-info-badge__icon` itself, and the playground passes no colour, so it
exercises the same path a consumer gets.

The 12x12 icon sits below the icon sizing scale (`size/icon/sm` is 16), so it
stays a raw value on both platforms, with a comment saying why.

## ImagePlaceholder added, a non-Figma utility (0.7.0)

Every image prop (`ProductCard.imageUrl`, `ProductImage.src`, `Avatar.src`,
the Banner family's `imageUrl`) has always been required, deliberately - this
package ships no photography, so there was never anything to default to.
That was correct as far as it went, but it left a real gap: a consumer with a
genuinely empty state (a new product with no photo yet) had no sanctioned way
to say so, and either left `src` empty (silently falling through to the
browser's own broken-image icon) or invented their own placeholder, which is
exactly the kind of gap that produced emoji fallbacks elsewhere in this
project's history.

`ImagePlaceholder` closes it: a neutral `bg-surface-variant` box with a
generic "no image" glyph in `icon-disabled`. The glyph is hand-drawn
(frame/circle/mountain outline), not one of `SnackyIcons` - it is decorative
placeholder artwork, not a real icon prop, and the first instinct (reuse the
package's own `camera` icon, reasoning "at least it's a real glyph") read as
"take a photo" rather than "no image here" once someone actually looked at
it. This is a standalone utility, not the 25th documented component - there
is no Figma node for it, and the README says so explicitly rather than
letting the count quietly drift.

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
Figma component sets. `Header` agreed. `List` agreed on everything except its
thumbnail background, which turned out to be invented - see below.

`BottomSheet` and `Section` were checked later, while porting them to the
Compose package, and both turned up real bugs: `BottomSheet` defaulted to
showing a drag handle that none of the nine documented Figma variants actually
have (the prop was inverted to `showHandle`, defaulting to `false`), and
`Section`'s "see more" chevron was using the wrong color. That check also
established that their spacing is variant-dependent by design rather than
unverified - see the README's Verification status.

## Other fixes worth recording

- **ProductImage sizing (0.3.1).** The component builds its class name as
  `--${usage}`, but the stylesheet spelled the first two rules `--card` and
  `--details` instead of `--product-card` and `--product-details`. Those two
  usages - the 128px card image and the 200px detail image, the two most common
  ones - matched no rule at all and rendered completely unsized.
- **List thumbnail background (0.3.6).** The 56x56 frame behind an order's
  product photo was filled `#f4f4f5`, and both the README and this file claimed
  Figma agreed with it. It does not: Figma's `Image` component set has no fill
  and no stroke on the `usage=list` variant, only the 48x48 photo inside. The
  value was invented somewhere between the site's Live Preview and the
  component, is 1-2 values off `--bg-surface-variant` (suggesting it was
  eyeballed rather than read), and contradicted `ProductImage`'s own
  `usage="list"`, which correctly had no background. Removed from all three
  places that carried it.
- **Unstyled-components trap (0.3.3).** The README's usage snippet said
  `import '@snacky/ui'` would pull in the stylesheet "as a side effect". It does
  not: tsup extracts the CSS to a standalone `dist/index.css` and never
  re-injects it into the JS entry, so anyone following the snippet verbatim got
  unstyled components. The correct import is `@snacky/ui/styles.css`.
- **PointBalanceBanner stretched to fill its container (0.6.2).** Figma's frame
  hugs its content at 312px, it was never meant to fill full-bleed, but the
  component set `width: 100%` plus `justify-content: space-between` anyway.
  Inside any container wider than 312px (which is most of them), the Points and
  Balance groups spread apart across the extra width instead of staying grouped
  on the left like Figma. Switched to `display: inline-flex` (hugs by default)
  with an explicit `gap`, matching the value already recorded in
  `components.json`'s spec for this variant.
- **AlertBanner clipped a long message (0.6.2).** The row had a fixed
  `height: 40px`, Figma's single-line sample height, not a cap. A message long
  enough to wrap onto a second line got clipped instead of growing the banner.
  Changed to `min-height: 40px` and let the message text take `flex: 1` so it
  shrinks and wraps within the row instead of overflowing sideways.
- **PointBalanceBanner's 0.6.2 fix corrected again (0.7.1).** Hugging content
  was a correct read of Figma's own frame in isolation, but wrong once placed
  next to a sibling with different content: the docs gallery's "Default" and
  "LowBalance" stories sit side by side, and a low "0" / "Rp 0" collapsed to a
  fraction of the other's width, visibly stranded inside its card. Back to
  `width: 100%`, but `justify-content` stays at its flex-start default (not
  `space-between`) - the original 0.6.2 bug was the groups spreading apart,
  not the fill-width itself, so this keeps that part of the fix while
  dropping the part that looked wrong once seen with real sibling content.
- **Button's icon slot was disproportionate at Small size (0.7.2).** The slot
  is documented generically as 24x24, and that was applied uniformly
  regardless of `size` - reasonable for Default (48px tall, 12px label), but
  oversized next to Small's 40px height and 12px label. Added a `.snacky-btn--
  small .snacky-btn__icon` override at 20x20; Default stays 24x24. Ported the
  same conditional to compose-ui's `SnackyButton`, and to the docs site's own
  Button playground (previously hardcoded to 24 regardless of the size
  control). Confirmed via computed styles in the Live Preview iframe, not
  just visually: the icon span and its inner SVG both resolve to exactly
  20x20 with Size=Small selected.
- **That same fix used raw pixel values instead of the existing semantic
  size tokens (0.7.3).** `tokens.json` already has `size.icon.md` (20px) and
  `size.icon.lg` (24px), generated as `--size-icon-md`/`--size-icon-lg` in
  react-ui and `SnackySize.Icon.md`/`.lg` in compose-ui - 0.7.2 hardcoded
  `20px`/`24px` and `20.dp`/`24.dp` instead of reaching for them, caught right
  after shipping. Swapped both platforms over to the token references; the
  computed pixel values are unchanged (re-verified: still exactly 20px at
  Small, now genuinely resolving through `--size-icon-md` rather than a
  literal that happens to match it).
- **Button's icon slot overlapped the label on any hug-width button (0.7.4).**
  The icon is absolutely positioned (out of flow, per Figma's own "Slot Usage"
  guideline), so it never reserved space for itself - the button's auto width
  came from the label alone, and the icon rendered on top of it (`Add to cart`
  read as the cart icon glyph covering the `A`, `dd to cart` visible after it).
  Never caught before because no preview or story had ever passed an `icon`
  prop to a real, narrow (hug-width) `Button` instance - confirmed directly
  against Figma's "With Icon" example, which shows icon and label side by
  side with a clear gap, never overlapping. Fixed by adding a
  `.snacky-btn--with-icon` modifier that reserves exactly the icon's own
  space (its `spacing-8` start inset + its size + a `gap-text-icon` gap) as
  left padding, so the (still centered) label starts right after the icon
  instead of on top of it. Ported the same fix to compose-ui's `SnackyButton`
  (via `contentPadding`'s `start` value). Verified visually at both sizes: a
  clean gap between icon and label, no overlap, `Add to cart` fully legible.
