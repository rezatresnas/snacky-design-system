# design-sync notes

## Setup

- Package shape (no Storybook in this repo). Synced from `packages/react-ui`
  (`@snacky/ui`), built via `npm run build` (tsup) into `dist/`.
- `--node-modules ./packages/react-ui/node_modules --entry ./packages/react-ui/dist/index.js`
- `componentSrcMap: {"SnackyIcons": null}` excludes the icon-set export (`SnackyIcons`)
  from the component scan - it's an object of icon components, not a component itself,
  and tripped `[BUNDLE_EXPORT]` until excluded.
- `runtimeFontPrefixes: ["Poppins"]` - the package's CSS references Poppins by name but
  ships no `@font-face`; the host app is expected to load it via Google Fonts (as
  `index.html` does with a `<link>` tag). This suppressed `[FONT_MISSING]` correctly.
- `overrides` for 4 components flagged `[GRID_OVERFLOW]` on first full validate:
  `Button` and `Section` and `AddressResult` → `cardMode: "column"` (a wide story
  cropped in the grid), `BottomSheet` → `cardMode: "single", primaryStory: "Default"`
  (fixed/portal-positioned overlay, no grid layout can present it).

## Known render warns

- None outstanding - the final validate run was fully clean (0 errors, 0 warnings)
  after the overrides above.

## Preview-authoring rule (learned the hard way)

- **Never use emoji or hand-drawn inline SVG as a stand-in for a real icon prop.**
  `packages/react-ui`'s icon set (`SnackyIcons.outline.*` / `.solid.*`, 42+10 real
  icons) exists precisely so previews don't need placeholders - always import
  `SnackyIcons` from `@snacky/ui` and pass a real icon (e.g.
  `<SnackyIcons.outline.search width={18} height={18} />`) into any `*Icon`/`icon`
  prop. The first pass of this sync used emoji (🔍, 📍, ▾, ▶) and a hand-drawn
  star/wallet SVG in `AddressResult`, `TextField`, `SearchField`,
  `PointBalanceBanner`, `ChatInput`, and `ProductCard` - caught only after the user
  spotted it in the uploaded project screenshots. Fixed by swapping in the real
  icons (`outline.address`, `outline.home`, `outline.chevronDown`, `outline.search`,
  `solid.points`, `outline.balance`, `outline.send`, `outline.heart`,
  `outline.share`, `outline.chat`, `outline.cartAdd`). `assets/icons/icons.json`
  (or `packages/react-ui/src/icons/outline.tsx`/`solid.tsx`) is the source of truth
  for which names exist - check it before reaching for a placeholder.
  **Exception**: emoji used as a stand-in for real *product photography* inside a
  data-URI placeholder image (ProductCard/ProductImage/Illustration/Avatar's `<img
  src>`) is fine - that's not the icon set's job, and there's no real photography to
  substitute. The distinction is icon-prop vs photo-placeholder.
  Some emoji ARE genuine shipped defaults baked into the component itself
  (`ProductCard`'s `cartIcon ?? '+'`, `ChatInput`'s `sendIcon ?? '➤'`) - those are
  real product behavior when no icon is passed, not a preview mistake; still worth
  overriding with a real icon in at least one story to demonstrate intended usage.
  **Full audit (all 36 preview files) done after the user flagged this**: two more
  made-up icons found beyond the first fix - `Callout.tsx`'s hand-drawn `CheckIcon`/
  `ClockIcon` SVGs (now `SnackyIcons.outline.sent`/`.unsent`, matching the
  component's own doc comment "Sent shows a checkmark, Pending a clock") and
  `NotificationBadge.tsx`'s hand-drawn `CartIcon` SVG (now `outline.cart`). Every
  other emoji left in the preview set was verified to be inside an `imageUrl`/`src`
  data-URI (product photo or Illustration artwork placeholder) - legitimate per the
  exception above, not an icon-prop substitute.

## Preview-authoring rule #2: composed/glue text needs an explicit font token

- **The package sets NO global `font-family` anywhere** (checked: no `body`/`:root`
  reset in `dist/index.css`) - every component applies its own `font-family:
  var(--font-*-family)` internally, on its OWN text only. Any raw HTML text a
  preview composes around a component (a heading, a paragraph, a row label) that
  isn't passed through a component prop gets NO font styling at all and falls back
  to the browser/host-page default - not Poppins, and inconsistent with every other
  component. Caught by the user spotting inconsistent fonts across the uploaded
  project. Fixed in `Section.tsx` (OrderSummary/SettingsList row text),
  `Accordion.tsx` (FAQ answer paragraphs, payment card-list text),
  `BottomSheet.tsx` (title/body - it's a bare shell with no typography of its own),
  and `Toggle.tsx` (SettingsList row labels) by adding
  `fontFamily: 'var(--font-small-regular-family)'` (or `--font-h3-bold-family` for
  a heading, `--font-body-regular-family` for a body block) to the wrapping
  container so it inherits down, matching the token the real components use for
  equivalent text (checked against each component's own `.css` file, e.g.
  `Accordion.css`/`List.css` use `--font-small-regular-family` for their own body
  text). **Rule for any future preview**: any raw JSX text you author yourself
  (not passed through a component prop) needs an explicit `fontFamily: 'var(--font-
  *-family)'` - pick the token by checking the matching real component's own CSS
  for what it uses at that visual weight/size.
- Not a bug in this: `HeroBanner`/`SquareBanner`/`FullWidthBanner`'s placeholder
  text renders inside an `<svg><text>` inside a data-URI `<img>` - that's raster/
  vector image content with its own SVG-default font, entirely unrelated to the
  package's CSS or the Poppins question. Nothing to fix there.

## Final audit pass (minor, non-visual-severity findings)

- `Section.tsx` SettingsList row divider used a hardcoded `#eee` instead of the
  real `var(--border-main)` (#cccccc) token - fixed.
- `SoldOutBadge.tsx`'s placeholder product-image wrapper used a hand-picked
  `borderRadius: 12` instead of `var(--radius-field)` (4px, matching
  `ProductCard.css`'s real image-wrap radius) - fixed.
- `ProductImage.tsx`'s `AccordionModalUsage` (payment-method logo) placeholder
  used a ₿ (Bitcoin) symbol for an alt text of "Pay with Bank Transfer" -
  semantically wrong emoji choice, not an icon-prop issue. Swapped for 🏦.
- Checked all `gap`/`padding` numeric literals used as flex layout glue (13
  files, ~30 occurrences) against the real primitive spacing scale
  (2/4/8/12/16/24/32px) - every value used already lands exactly on the scale,
  so nothing renders wrong. Semantic `--gap-layout-*` tokens exist and would be
  more "correct" to reference by name, but since the pixel values already match
  and there is zero visual difference, this was left as-is rather than doing a
  cosmetic mechanical rewrite across every preview.

## Component-level gaps found (not preview-authoring bugs, real component issues)

- **OtpField's `disabled` prop has no distinct visual treatment** -
  `packages/react-ui/src/components/Input/OtpField.css` has no `:disabled` rule, so a
  disabled OTP field renders identical to a filled one. Confirmed via screenshot
  during preview authoring/grading (graded "good" anyway since this is a component
  CSS gap, not a preview-composition problem). Worth fixing in
  `packages/react-ui/src/components/Input/OtpField.css` separately.

## Re-sync risks

- **HeroBanner/SquareBanner/FullWidthBanner text renders in a serif fallback font
  locally.** Headless Chromium in this sandbox has no network access to Google Fonts,
  so `Poppins` (declared via `runtimeFontPrefixes`, not shipped) falls back to the
  browser's serif default rather than a sans-serif system font in the local
  `.review.html`/screenshots. This is expected and not a bug - claude.ai/design's
  actual rendering environment has network access and/or its own font substitution.
  Don't chase this on a re-sync; only investigate if it also renders wrong in the
  live claude.ai/design project itself.
- All 36 previews are authored (no floor cards remain). A re-sync only needs to
  re-verify components whose source or preview `.tsx` actually changed - the anchor
  (`_ds_sync.json`) carries the rest forward automatically.
- The build assumed a locally-installed Playwright + Chromium
  (`C:\Users\tresn\AppData\Local\ms-playwright`) - a fresh clone/machine needs
  `npm i -D playwright && npx playwright install chromium` in `.ds-sync/` again
  before the render check can run.
- Windows-specific: `package-build.mjs`'s `rm` of `ds-bundle/` intermittently threw
  `EPERM` on this machine (transient file-lock, likely AV/indexing) - a short retry
  after a couple seconds resolved it every time. Not a real bug, just a Windows
  quirk to expect on re-sync.
