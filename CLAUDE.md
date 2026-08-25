# Snacky App Design System

This repo is a single-page design system site (`index.html`) for Snacky, a snack
e-commerce app, targeting Kotlin Compose Multiplatform and React. Figma is the
source of truth (file key `4Uh4Y1fPQXu2hwq0vEXHXd`) - every documented value should
trace back to a real Figma node, not an estimate. Never guess a spec value; verify
against Figma via `use_figma`/`get_screenshot` before documenting or changing one.

## File map

- `index.html` - the entire site: foundations pages, per-component Overview/Spec/Code
  & Playground tabs, all as JS-rendered HTML in one file. All token and component data
  lives inline as JS object literals (`C` = components, `PG` = interactive playground
  config, plus per-foundation-page consts like `ramps`/`groups`/`scale`).
- `tokens.json`, `components.json` - generated machine-readable exports for AI
  tools/agents (W3C Design Tokens format + full component/variant/code manifest).
  **Never hand-edit these.**
- `llms.txt` - concise root index for AI tools, pointing at the two files above.
  **Hand-maintained, unlike `tokens.json`/`components.json`**, so it goes stale
  silently: it once still claimed the icon set was "a starter subset" long after the
  real set shipped, and never mentioned `packages/compose-ui` at all. Re-read it
  whenever a package, a known gap, or the asset-licensing story changes.
- The published `compose-v*` version string is hardcoded in FOUR places that must be
  bumped together when a tag is cut: `packages/compose-ui/README.md`, `llms.txt`,
  `AGENTS.md`, and root `README.md`. (`@snacky/ui`'s version is not hardcoded anywhere
  in docs - npm resolves `latest`.) Grep for `compose-v` before tagging. `index.html`'s
  "Compose Package" card deliberately carries no version: its button links to the
  JitPack page, which always shows the current one.
- `AGENTS.md` and `design-system-prompt.md` are hand-written agent entry points and drift the
  same way `llms.txt` does - both sat at "21 components" and omitted `Header` long
  after it shipped, and `AGENTS.md` never mentioned `packages/compose-ui`. Re-read all
  three whenever the component set, a package, or the licensing story changes.
  `design-system-prompt.md` also carries the literal export names for both platforms
  (prompt-only tools guess otherwise: the docs say "Input", the code says `TextField`,
  `SearchField`, `OtpField`, `CopyField`, `ChatInput`, `AddressResult`). Re-derive them
  after any export change:
  ```
  node -e "const d=require('fs').readFileSync('packages/react-ui/dist/index.d.ts','utf8');console.log([...new Set([...d.matchAll(/declare (?:function|const) ([A-Z][A-Za-z]+)/g)].map(m=>m[1]))].join(', '))"
  grep -rhoE "^fun Snacky[A-Za-z]+" packages/compose-ui/src/commonMain/kotlin/com/snacky/ui/components | sed 's/fun //' | sort -u
  ```
- `scripts/generate-agent-files.js` - regenerates `tokens.json` and `components.json`
  straight from `index.html`'s source (bracket-matched literal extraction, not a
  hand transcription). Run it after any change to a foundation page's token data or
  to the `C` object:
  ```
  node scripts/generate-agent-files.js
  ```
  Treat this as a required step, not optional cleanup - if `index.html` changes and
  this isn't re-run, the two JSON files silently go stale.
- `assets/icons/icons.json` - the real icon geometry exported from Figma's `Icon-outline`
  (node `55:2062`) and `Icon-solid` (`8772:5851`) component sets: 42 outline + 11 solid,
  each with its own viewBox (the set is 16/20/24px, not uniform) and its SVG path data.
  **Never hand-edit.** `scripts/generate-icons.js` turns it into BOTH
  `packages/react-ui/src/icons/outline.tsx`/`solid.tsx` and compose-ui's
  `SnackyIcons.kt`, so the two platforms cannot drift from each other or from Figma:
  ```
  node scripts/generate-icons.js
  ```
  Note these are FILLED outline shapes, not stroked paths - the outline weight is baked
  into each shape, so there is no stroke width to set.
  The 11th solid icon, `star`, does NOT live in the `Icon-solid` set: it sits in Figma as
  the standalone `fi-ss-star` component (node `46:1411`) that Product Card and the review
  rows instance, bound to `icon/icon-brand`. The first export only walked the two
  component sets, so it missed the star, and both packages rendered their own documented
  rating row with no glyph at all. If another icon turns up in a component but not in a
  set, it belongs in `icons.json` the same way, not in `legacy-extras.json`.
  The generator ALSO rewrites `index.html`'s own `const ICONS={...}` registry and the
  `const ICON_SET={...}` index the Icon playground gallery enumerates, so the site renders
  the same geometry the packages ship. Playground-only glyphs that are not part of the
  Figma icon sets (timeline check/clock, deals, chat-driver) live in
  `assets/icons/legacy-extras.json` and are merged back in, and the older key names the
  playgrounds already pass to `ic()` (`fav-o`, `add-to-cart`, `dropdown`, `cod`, `saldo`,
  ...) are kept working as aliases - so never hand-edit that registry either.
- `assets/ui/snacky-ui.js` + `.css` - **the Live Preview renders the real package now.**
  Generated by `scripts/build-docs-bundle.js` from `packages/react-ui/src`, committed
  because `packages/react-ui/dist` is gitignored and GitHub Pages could not serve it.
  React is bundled in and re-exposed as a global, so the preview iframe has one React
  copy and no unpkg dependency. **Re-run after any change to packages/react-ui:**
  ```
  node scripts/build-docs-bundle.js
  ```
  Before this, every `PG[id].impl` was a second hand-written implementation of the
  same Figma spec, and the two drifted constantly: Sold Out in the wrong corner, both
  Point/Balance gaps wrong, emoji icon fallbacks, a missing ratings star, none of it
  visible on the docs site because the docs site was not rendering the package. Each
  `impl` is now a thin adapter that maps the playground's props onto the real
  component. Only the impl string was replaced - `component`, `initialProps`,
  `controls`, `getReact`/`getKotlin`, the postMessage plumbing and the resize
  handshake are untouched, which is why every playground control still works.
  The shared `Btn`/`Chip`/`IconBtn`/`Inp`/`Acc` helpers in `compHelper` (the third
  parallel implementation this file used to warn about) delegate to the package too,
  so Section and Modal's composition code renders real components without being
  rewritten.
- **Figma is the arbiter, not the Live Preview.** The preview was confirmed
  pixel-perfect and mostly was, but migrating found it wrong in several places:
  every bordered Input field measured 50 against Figma's 48, ProductCard details was
  368 against 372, the List COD chip was 122 against 120, ProductImage's variant was
  90 against 88. Figma draws strokes INSIDE the frame; CSS adds them on top unless
  the height is explicit. That single mistake accounted for seven of the bugs found
  (Button Secondary, five Input fields, the COD chip, Chips, DiscountTag,
  VariantBadge, PointBalanceBanner). Check it first on anything bordered.
- **`Stepper` and `Calendar` were missing components, not app composition.** Both
  were added after the question "why isn't this a component?" turned out to have
  a better answer than the one this file used to imply. Stepper had 19 hand-drawn
  copies in Figma across 5 documented variants, under two different frame names
  (`Order status step` in Section, `Driver Order Status Item` in Modal), with the
  dot already named like a component variant (`Progress dot/active`). Calendar was
  already a COMPONENT in Figma (360x505) and the Input family already shipped a
  Date Picker *field* - so the field existed while the panel it opens did not.
  General lesson: "the package has no component for this" is evidence the design
  system may be missing one, not proof the pattern is app-level. Count the
  copies in Figma before concluding.
- `assets/images/` - exported PNGs, one per documented variant/state, at 2x-4x scale
  depending on the component. Re-export from the matching Figma node (`download_assets`,
  `defaultFormat:'png'`) whenever a component's real fill/state changes, rather than
  leaving a screenshot showing an old value.
- `packages/react-ui/` - installable `@snacky/ui` npm package: real React
  implementations of all 24 documented components (not just doc samples), so an AI
  tool building a new feature can `import` them instead of regenerating similar
  markup. `src/theme/tokens.css`/`tokens.ts` are generated from `tokens.json` by
  `scripts/generate-react-tokens.js` - run it after `generate-agent-files.js`
  whenever token values change:
  ```
  node scripts/generate-react-tokens.js
  ```
  Component files under `src/components/` are hand-written (structural/prop changes
  need a manual edit), but their colors/spacing/radius/shadow all resolve through the
  generated CSS custom properties, so token-only changes propagate automatically.
  See `packages/react-ui/README.md` for known gaps (Illustration ships no artwork, etc).
- `packages/compose-ui/` - Kotlin Multiplatform / Compose Multiplatform counterpart
  to `packages/react-ui`, targeting `androidTarget` + iOS. ALL 24 of 24 components ported
  so far (`SnackyButton`, `SnackyIconButton`, `SnackyCheckbox`, `SnackyRadioOption`,
  `SnackyToggle`, `SnackyAvatar`, the Badge family, `SnackyCallout`, Chips, `SnackyNavBar`,
  `SnackyTabRow`, `SnackyAccordion`, `SnackyHeader`, List, `SnackyBottomSheet`,
  `SnackySection`, the Input family, the Banner family, the Icon set, `SnackyIllustration`,
  `SnackyProductImage`, `SnackyProductCard`). Compiles are
  self-verified via `gradlew
  compileDebugKotlinAndroid compileCommonMainKotlinMetadata`, run directly with
  `JAVA_HOME` pointed at Android Studio's bundled JBR
  (`C:\Program Files\Android\Android Studio\jbr`), no need to drive the IDE UI.
  `src/commonMain/kotlin/com/snacky/ui/theme/Tokens.kt`
  is generated from `tokens.json` by `scripts/generate-compose-tokens.js` - run it after
  `generate-agent-files.js` whenever token values change:
  ```
  node scripts/generate-compose-tokens.js
  ```
  Published via JitPack (not Maven Central, simpler for a portfolio project, no
  account/signing/secrets, builds straight from a git tag), see `jitpack.yml` at the
  repo root and `packages/compose-ui/README.md`. Unlike `@snacky/ui`, there is NO CI
  publish step here: pushing to `main` releases nothing, a `compose-v*` tag has to be
  cut explicitly (bump `version` in `packages/compose-ui/gradle.properties` first).
  This was missed for 15 consecutive components once already: `compose-v0.1.2` shipped
  with only `Button` while everything after it sat unreleased on `main`, so cut a tag
  whenever a component lands or a real fix goes in, not just at the end. Gradle wrapper is committed and
  confirmed working (`Build > Rebuild Project` green in Android Studio); the module
  had never actually been compiled before `compose-v0.1.1`'s JitPack attempt, which
  surfaced (and are now fixed): `gradlew` missing its Unix executable bit (git on
  Windows doesn't preserve it, `git update-index --chmod=+x` fixes it), a missing
  `import androidx.compose.runtime.getValue` for a `by` delegate on `State<T>`, and
  a Kotlin/AGP JVM-target mismatch (11 vs default 1.8).

- `packages/react-ui/src/fonts/` - real Poppins `.ttf` (OFL-1.1, `OFL.txt` alongside),
  added by a `/design-sync` run. These exist for the **Claude Design bundle only**,
  wired in through `.design-sync/config.json`'s `extraFonts`. They are NOT published:
  `package.json`'s `files` is `["dist", "NOTICE", "CHANGELOG.md"]`, and `dist/styles.css`
  carries zero `@font-face` rules. The "neither package bundles a font" rule below
  still holds for everything an integrator installs, so don't read that folder as a
  reversal of it, and don't wire it into the package build without deciding that
  deliberately (it would add ~960KB to every consumer).

## Asset licensing (important, do not regress this)

The repo's MIT `LICENSE` covers CODE ONLY. The icon artwork is UIcons by Flaticon,
used under **CC BY 4.0** and modified. CC BY permits bundling it in the published
packages, but attribution must travel with the artwork, so it is emitted into every
generated icon file (`/*! ... */` so minifiers keep it), survives into `@snacky/ui`'s
`dist/`, ships as `NOTICE` in both packages, and is credited on the site's Icon page.
`scripts/generate-icons.js` owns that header - never strip it, and never move the icon
artwork into a file that lacks it. The illustrations and favicon are also
stock-derived; confirm their licence before bundling either into a package (the
`Illustration` component deliberately ships no artwork today).

## Two gaps that make AI agents improvise (found in a real import)

A Claude Design sync produced emoji icons and unstyled text. Neither was the
agent being careless; both were doc gaps, now closed - keep them closed:

- **Neither package bundles a font.** Type resolves through
  `var(--font-*-family)` / a caller-supplied `FontFamily`, so the host must load
  Poppins. `packages/react-ui/README.md` never said so at all (zero mentions
  before this), and the bundle has zero `@font-face` rules, so an integrator had
  no way to know. It is now documented as step 1 of Usage, including the point
  that text authored AROUND a component needs the token too - that is what
  actually broke, in hand-written glue text next to Section/Accordion/
  BottomSheet/Toggle.
- **No copy-paste icon example existed.** The icon set was well documented as a
  list of names, but the Usage sample used `TextField`/`Checkbox`/`Button` with
  no icon prop, so there was no canonical "here is how you pass an icon"
  snippet. An agent with no pattern to copy reaches for emoji. Both package
  READMEs, `AGENTS.md` and `design-system-prompt.md` now carry a real example
  plus an explicit "never substitute emoji or a hand-drawn SVG; if no name fits,
  say so rather than inventing one".

A third gap sat one level deeper and outlasted both fixes above: **the packages
themselves defaulted to emoji.** `ProductCard` fell back to `'♥'`/`'⤴'`/`'💬'`/`'+'`
and `ChatInput` to `'➤'` whenever an icon prop was omitted, so an agent that
followed the docs perfectly still got emoji, and `AGENTS.md` was telling
integrators "never substitute an emoji" while the code did exactly that. The
compose-ui side had the quieter version of the same bug: `icon = { cartIcon?.invoke() }`
rendered an empty slot. Both now default to the real `SnackyIcons` geometry
(sizes from `index.html`'s verified preview: 20px for the details actions and the
chat send button, 16px for the list card's cart). When adding a component with an
icon slot, give it a real default, never a glyph and never nothing.

**The typography completion has since been checked, component by component.**
Filling in the partially-applied typography tokens (33 of 47 CSS rules pulled only
some of a token's five properties, so weight/line-height/letter-spacing fell back
to the browser default) was right everywhere except two, both now carrying
explicit overrides with comments: ProductCard's `original-price` (Figma uses AUTO,
not 24) and PointBalanceBanner's label (Figma's node is 20 tall, and 20 + the
value's 24 is exactly what makes that banner 60).

That audit found three more real bugs along the way, none of them actually a
line-height problem. `AddressResult` was the first: no playground exercises it at
all (the Input playground's "address" type is a `TextField` with a leading icon,
not this component), and without a pinned height its border pushed it to 74
against Figma's declared 72. Fixed by pinning `height: 72px` - with
`box-sizing: border-box` already on the rule, that absorbs a plain 1px border
into the 72 total.

**Reach for `box-shadow: inset` only when there is no explicit height to absorb
the border.** An earlier pass over-applied it: `AddressResult` and
`PointBalanceBanner` both got inset shadows on the theory that a real border
always adds 2px, but that is only true without a fixed height. AddressResult has
one, so a plain border there is both correct and more portable - the shadow
version rendered as a black border in Claude Design, because tools that read
computed styles look at `border-color` and find the unset default (`#000`) when
the line is actually painted by a shadow. AddressResult is back on a real border;
PointBalanceBanner keeps the shadow because it genuinely has no explicit height,
and so does Tab. If a component has a pinned height, use `border`.

The other two bugs are the same "nothing ever rendered this" shape:

- **Tab's padding used `--spacing-12` where Figma's own token for this is
  `gap.text-underline` (16px, documented for exactly this: "Text -> underline
  indicator gap (Tab)").** A real 2px border-bottom then added its own height on
  top of that wrong padding, so the tab measured 38 against Figma's declared 40.
  Fixed on both platforms by painting the accent line without adding to the box
  (`box-shadow: inset` in CSS, `drawBehind` in Compose) so the 16px gap plus text
  lands exactly on 40, matching the row's own border-main line, which already used
  the same "drawn behind" technique.
- **`Section`'s own shell (`.snacky-section`, `.snacky-section__title`,
  h3-bold, the chevron `__action` button) was never rendered by any preview at
  all.** The Section playground's `SectionDemo` built its own literal-styled
  `grpHeader` instead of calling the real `Section` component, for all three
  "Group-Products-*" types. Measuring `.snacky-section__title` in isolation
  showed h3-bold itself was already correct (36/16/700, no bug), so this wasn't a
  value problem - just the same "package's own component, never in the render
  path" gap as AddressResult. Wired `SnackyUI.Section` into those three types in
  place of `grpHeader`; total heights were unchanged (`.snacky-section`'s own
  padding/gap already matched what the hand-rolled wrapper was doing by
  coincidence), and `grpHeader` was deleted rather than left as dead code.

Everywhere else the token-driven line-height either drives a component total that
was measured against its Figma node and matched (ProductCard's name/price, the
Accordion title/panel, Callout's meta, Header's title, and now Tab and Section's
title) - which could not happen with a wrong value - or sits in a box whose height
is pinned regardless of the text inside it (Button, Chips, the badges, every Input
field, the Navbar item), where the value cannot move the layout at all.

Note the shape of that argument: a wrong line-height is only ever a metrics bug -
elements come out slightly too tall - never a font that fails to render. The two
real bugs this pass found were a wrong padding token and an unexercised component,
not a line-height at all - worth remembering that "check the line-heights" and
"the bugs are in the line-heights" are not the same claim.

**Artwork that does not match its documented canvas.** Two illustration PNGs are
exported at the wrong aspect - `illus-discount-referral.png` is 1076x892 (1.206)
against a 268x200 canvas (1.340), and `illus-empty.png` is a hair off - and no
banner artwork matches HeroBanner's 312x128. The components now pin their canvas
and crop with `object-fit`, so nothing renders wrong, but re-exporting those three
would remove the cropping.

General lesson for this repo: documenting that something EXISTS is not the same
as showing how to USE it. A list of icon names reads as reference material; a
snippet reads as an instruction. Agents copy snippets. And a rule the code itself
violates will lose to the code every time.

## Key rules (don't relitigate these, they're already decided)

- Screen margin is 16px on every screen (`spacing.margin.screen`), content is Fill
  container, not a fixed width.
- Danger is an *intent* that layers onto Primary/Secondary/Tertiary hierarchy - it is
  not a fourth hierarchy of its own.
- Component padding uses primitive spacing tokens directly (`spacing-N`); no semantic
  padding aliases at this scale. Gap/layout spacing does use semantic tokens.
- Only genuinely fixed-size elements (icons, avatars, navbar height) get a sizing
  token; buttons/cards/inputs size from content, documented per-component instead.
- No em dashes in any authored text on this site (descriptions, usage copy, code
  comments, generated files) - use a comma, colon, or parentheses instead. This
  covers a spaced hyphen used AS a dash (`... this page - they carry ...`), not
  just the U+2014 character: the site's own home-page cards drifted into that
  and had to be rewritten. En dashes in numeric ranges (`16-20px`) are fine.
- When a Figma component-set variant's `Property 2` value is inconsistent/mislabeled
  (e.g. still says "Default" for what is structurally a new "Active" state), verify by
  inspecting actual fills/strokes/rotation, don't trust the property name alone.

## Working style established this session

- Prefer fixing a discovered inaccuracy over documenting it as-is, but call it out
  explicitly rather than silently changing scope.
- Verify Playground interactivity claims with real browser input (`computer` tool
  hover/click/drag), not synthetic `dispatchEvent` calls - focus and hover events in
  particular don't fire reliably when synthesized in this sandbox; click generally
  does. When `computer` screenshots aren't available, a `requestAnimationFrame`-based
  color-trace polling loop combined with a real drag is the fallback that's actually
  caught state changes here.
- The Playground's shared `Btn`/`IconBtn` helper functions (used by Modal, List,
  Section, Product Card) are a separate code path from the standalone Button/Icon
  Button pages' own implementations - a fix to one does not propagate to the other.
- For the remaining `packages/compose-ui` ports: stop re-verifying against Figma per
  component. `index.html`'s Live Preview and `packages/react-ui`'s implementation are
  already pixel-perfect (confirmed by the user directly), so port from that code
  as source of truth instead. Reason: the Section component's manual Figma re-check
  actually introduced a wrong "fix" (misread an unrelated instance fill as the
  rendered icon color) that a working, already-verified implementation wouldn't have
  had - re-deriving from Figma each time adds transcription risk without adding
  accuracy once a surface is already confirmed pixel-perfect. Still fine to check
  Figma if something in the existing code looks actually wrong/inconsistent on its
  own terms, just not as a routine per-component step anymore.
