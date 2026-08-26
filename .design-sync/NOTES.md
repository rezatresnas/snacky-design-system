# design-sync notes

## Setup

- Package shape (no Storybook in this repo). Synced from `packages/react-ui`
  (`@snacky/ui`), built via `npm run build` (tsup) into `dist/`.
- `--node-modules ./packages/react-ui/node_modules --entry ./packages/react-ui/dist/index.js`
- `componentSrcMap: {"SnackyIcons": null}` excludes the icon-set export (`SnackyIcons`)
  from the component scan - it's an object of icon components, not a component itself,
  and tripped `[BUNDLE_EXPORT]` until excluded.
- **Poppins is now self-hosted, not runtime-loaded.** Originally `runtimeFontPrefixes:
  ["Poppins"]` suppressed `[FONT_MISSING]` on the assumption the host app loads Google
  Fonts itself. On the 2026-08-24 re-sync, the actual Poppins `.ttf` files (400/500/
  600/700/800 + italic, OFL-licensed) turned up already uploaded in the claude.ai/design
  project under `fonts/` - real files, not something this sync produced - but `styles.css`
  never `@import`ed them, so they were dead weight in the project the whole time. Pulled
  them into the repo at `packages/react-ui/src/fonts/` (`fonts.css` + the 6 `.ttf` files +
  `OFL.txt`), replaced `runtimeFontPrefixes` with
  `"extraFonts": ["src/fonts/fonts.css"]`, rebuilt - `styles.css` now correctly emits
  `@import "./fonts/fonts.css";` ahead of `_ds_bundle.css`, and `[FONT_MISSING]` no longer
  fires at all (not suppressed - genuinely resolved). Every design built with this system
  now gets real Poppins with zero network dependency. **If `packages/react-ui/src/fonts/`
  goes missing on a fresh clone**, re-fetch the 6 `.ttf` files from the live project
  (`fonts/Poppins-*.ttf`) via `DesignSync(get_file)` before rebuilding, or the build falls
  back to `[FONT_MISSING]` again.
- `overrides` (current, as of the 2026-08-25 Stepper/Calendar re-sync): `Button`,
  `Section`, `AddressResult`, `BottomSheet`, `ProductCard`, `Stepper` all use
  `cardMode: "column"` (their stories render wider than a grid cell, so each gets
  the full card width, one story per row). `BottomSheet` was originally
  `cardMode: "single", primaryStory: "Default"` when it only had one story - once
  its preview grew to 6 distinct documented Modal variants (Welcome/Success/
  Confirmation/VariantSelector/PaymentMethods/WithHandle), `single` would have
  hidden 5 of them, so it moved to `column` like the others. If a component's
  preview grows past one meaningfully-different story, re-check whether `single`
  is still the right override.

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

## Re-sync log

- **2026-08-25**: `@snacky/ui` 0.4.6. Upstream fixed the last two icon-default gaps
  at the source: `ChatInput`'s `sendIcon` and `ProductCard`'s `cartIcon`/
  `favoriteIcon`/`shareIcon`/`chatIcon` now default to real `SnackyIcons` instead
  of emoji/text glyphs when the prop is omitted (previously `'➤'`/`'♥'`/`'⤴'`/
  `'💬'`/`'+'`). `IconButton`'s glyph color was also fixed against Figma. Spot-
  checked all three - `ChatInput`'s `Empty`/`Disabled`/`CustomPlaceholder` cells
  (which don't pass an icon prop) now show the real send icon instead of the old
  text arrow. `ProductCard`'s own preview stories already passed explicit icons
  from an earlier fix, so no visible change there, just confirms the safer
  default now exists for other consumers. Bundle-only diff (component prop
  contracts unchanged, so `sourceKeys` stayed the same) - pushed just
  `_ds_bundle.js`/`_ds_bundle.css`, not a full re-upload.

- **2026-08-25 (later same day)**: `@snacky/ui` 0.4.7. Fixed a real "overlapping
  product cards" bug reported from the live claude.ai/design project - two causes,
  both real: (1) the package set `box-sizing: border-box` on only 18 of 30 selectors
  and shipped no reset, so every fixed-size padded component (ProductCard's list
  variant, IconButton, Toggle, UploadButton, NotificationBadge, Header/Section icon
  buttons) rendered oversized on a host page without its own reset - fixed via a new
  scoped `theme/base.css` (`[class^='snacky-']` etc., never `*`) plus
  `flex-shrink: 0` on the list card so a flex parent can't squeeze it below spec;
  (2) `.design-sync/previews/Section.tsx`'s `ProductGrid` story wrapped each card in
  a 140px div, narrower than the card's own 152px spec width - real cause of the
  visible overlap, wrapper removed (the card sizes itself). Spot-checked all 6
  box-sizing-affected components plus `Section` itself; all render correctly at
  spec size now.

- **2026-08-25 (later still)**: `@snacky/ui` 0.4.8. Fixed "missing rating star" -
  `ProductCard`'s rating row had never had a real default icon (`{ratingIcon &&
  ...}`, no fallback), because the star glyph (`fi-ss-star`, Figma node 46:1411)
  was never filed inside the `Icon-solid` component set the original icon export
  walked - it only existed as a hand-kept copy in `legacy-extras.json` that never
  reached the packages. Now shipped as real `solid.star` (53 icons total: 42
  outline + 11 solid), and `ratingIcon` defaults to it (matching the emoji-default
  pattern already used for cart/favorite/share/chat). Spot-checked `ProductCard` -
  the star now renders next to every rating in all three story variants, where it
  previously rendered nothing at all. Bundle-only diff (prop contract unchanged).

- **2026-08-25 (large migration)**: `@snacky/ui` 0.5.7. The docs site
  (`index.html`) migrated its Live Preview playgrounds to render every component
  from the real package instead of parallel hand-rolled markup, which surfaced a
  broad sweep of real Figma-verification fixes across nearly every component's
  CSS (typography, INSIDE-vs-CENTER stroke handling, spacing) plus a structural
  fix to `ProductCard`'s details variant (Figma is two stacked frames with their
  own padding, not one flattened column - the flattened version was 29px short).
  All 36 components' prop contracts stayed stable (`sourceKeys` unchanged), so
  this was a bundle/CSS-only push, not a component re-author.
  **Preview bug found and fixed during review**: `ProductCard`'s `DetailsVariant`/
  `SoldOut` stories wrapped the card in an arbitrary 260px box. With the now-
  correct 24px padding and 20px price font, the price row ("Rp 24.000 Rp 30.000
  20%") no longer fit and wrapped onto two lines with the discount badge
  orphaned - NOT a component bug, a preview-width artifact. Fixed by widening
  both stories to 343px (a realistic mobile content width - 375px screen minus
  the documented 16px margins - matching CLAUDE.md's "content is Fill container,
  not a fixed width" convention). Always sanity-check an arbitrary preview
  wrapper width against the component's real Figma-accurate content size before
  assuming a layout glitch is a component bug.

## Re-sync log (continued)

- **2026-08-25 (Stepper & Calendar)**: `@snacky/ui` 0.6.0 → 0.6.1. Two entirely new
  components shipped - `Stepper` (order-status/progress timeline: dot + label +
  timestamp per step, dashed connector, done/pending/cancelled states) and
  `Calendar` (the real date-picker panel the Input family's date field opens:
  header nav, weekday row, month grid with single/range selection, Select Date
  button). Both were previously "app composition" (19 hand-drawn Stepper copies
  across 5 Figma variants, Calendar drawn fresh by every screen that needed one)
  until counting the Figma copies showed they were real extracted components the
  design system had just never shipped. `.design-sync/config.json`'s
  `componentSrcMap`/`overrides` needed no changes for the new components
  themselves (auto-discovered from the package's exports) - only `overrides` grew
  by two entries (`ProductCard`, `Stepper` → `cardMode: "column"`) for
  `[GRID_OVERFLOW]`. Someone (not this agent) had already authored full previews
  for both (`.design-sync/previews/Stepper.tsx`, `Calendar.tsx`) plus
  significantly expanded `Section.tsx` (8 documented Section variants, up from 3)
  and rewrote `BottomSheet.tsx` from a single generic story into all 6 documented
  Modal variants using real package components throughout - all graded good on
  first read, no fixes needed. Also verified and updated two stale claims in
  `.design-sync/conventions.md`: the token count (180 → 184, new tokens shipped
  with Stepper/Calendar) and the font-loading instructions (still described the
  old "host app loads Google Fonts" setup, superseded by the self-hosted-font fix
  from the previous re-sync) - also added a one-line mention of both new
  components to the composition-patterns list.
- Also folded in from the same period: `Banner.css`/`AddressResult.css`/`Tab.css`
  fixes (icon colors bound to `text/text-placeholder` not `icon-secondary` in the
  Input family; `Tab`'s padding token corrected from `--spacing-12` to the real
  `gap.text-underline`, with the accent line painted via `box-shadow: inset` so it
  doesn't add to the box) - all CSS-only, no prop contracts changed, verified via
  the driver's `unchanged` list (sourceKeys stable) plus a visual scan of the
  contact sheets.

## Component-level gaps found (not preview-authoring bugs, real component issues)

- **OtpField's `disabled` prop has no distinct visual treatment** -
  `packages/react-ui/src/components/Input/OtpField.css` has no `:disabled` rule, so a
  disabled OTP field renders identical to a filled one. Confirmed via screenshot
  during preview authoring/grading (graded "good" anyway since this is a component
  CSS gap, not a preview-composition problem). Worth fixing in
  `packages/react-ui/src/components/Input/OtpField.css` separately.

## Files in the project this sync does not own - never delete them

- `support.js` at the project root is the claude.ai/design platform's own runtime
  helper (its header says "GENERATED from dc-runtime/src/*.ts"). Not produced by this
  sync, not related to it. Never touch it, never include it in a delete pass.
- `components/tokens/Typography/Typography.html` is a token-showcase card, also not
  produced by this sync's build (the package shape has no `tokens/**` output). Left
  alone on the 2026-08-24 re-sync's reconciliation pass rather than deleted, since it
  isn't an orphan from a prior run of this same sync - its origin is unknown but it
  isn't ours to remove.
- **On any future re-sync's reconciliation-delete step**: before deleting anything
  under `fonts/`, `tokens/`, or the project root that this build doesn't produce,
  check whether it's actually orphaned output from a PRIOR run of this same sync
  (safe to delete) versus something else added it (not safe - ask the user or skip
  the delete). The default delete-everything-not-in-this-build assumption only holds
  when the project's entire history is this sync's own uploads, which stopped being
  true once real Poppins fonts and other content showed up from elsewhere.

## Re-sync risks

- **HeroBanner/SquareBanner/FullWidthBanner placeholder text still renders in a serif
  font, and that's fine.** This is unrelated to the Poppins fix above: that text is
  baked into an `<svg><text>` inside a data-URI `<img>` placeholder, which has its own
  SVG-default font and never participates in the page's CSS/font-family cascade at
  all. Now that Poppins is genuinely self-hosted, every REAL component text element
  (button labels, field text, headings) renders true Poppins even in this sandbox's
  offline headless Chromium - only the fake placeholder-image text stays serif, by
  construction. Don't chase it.
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
