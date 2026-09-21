# Snacky App Design System

This repo is a single-page design system site (`index.html`) for Snacky, a snack
e-commerce app, targeting Kotlin Compose Multiplatform and React. Figma is the
source of truth (file key `9EBmWLyRsaHDIdg9N2wBAw`, under the `tresnareza@gmail.com`
account - the original copy under a different account, file key `4Uh4Y1fPQXu2hwq0vEXHXd`,
was deleted) - every documented value should
trace back to a real Figma node, not an estimate. Never guess a spec value; verify
against Figma via `use_figma`/`get_screenshot` before documenting or changing one.

## File map

- `index.html` - the entire site: foundations pages, per-component Overview/Spec/Code
  & Playground tabs, all as JS-rendered HTML in one file. All token and component data
  lives inline as JS object literals (`C` = components, `PG` = interactive playground
  config, plus per-foundation-page consts like `ramps`/`groups`/`scale`).
- `tokens.json` - **internal build intermediate, not a consumer-facing file.**
  Generated from `index.html` by `scripts/generate-agent-files.js`; read in turn
  by `scripts/generate-react-tokens.js`/`generate-compose-tokens.js` to produce
  `packages/react-ui/src/theme/tokens.css` and `packages/compose-ui`'s
  `Tokens.kt`. **Never hand-edit.** This repo used to also generate
  `components.json` and hand-maintain `llms.txt`/`AGENTS.md` as machine-readable
  "AI Agent Files" for external tools, all three were removed: audited against
  the design system's real consumption paths (npm/JitPack install, or a coding
  agent building a separate project in Cursor/Codex/an IDE/Claude Design) and
  none of them ever read repo-root files like these - only an agent working
  directly inside this repo would, and that's served by `index.html` and the
  package sources themselves. `tokens.json` survives only because it's load-bearing
  for the token-CSS/Kotlin generators above, not because anything reads it as
  documentation.
- The published `compose-v*` version string is hardcoded in TWO places that must be
  bumped together when a tag is cut: `packages/compose-ui/README.md` and root
  `README.md`. (`@snacky/ui`'s version is not hardcoded anywhere in docs - npm
  resolves `latest`.) Grep for `compose-v` before tagging. `index.html`'s
  "Compose Package" card deliberately carries no version: its button links to the
  JitPack page, which always shows the current one.
- `design-system-prompt.md` used to exist as a condensed copy-paste prompt for
  AI tools that take a text prompt but can't read files or run a package
  manager (v0, Bolt, Lovable, Claude Artifacts) - the one path that had no way
  to consume the real npm/JitPack packages. It was removed after testing it
  against several of those tools directly: a prompt-only tool has to
  reconstruct component and token values from the condensed text rather than
  read them from a verified source, and the reconstructions were measurably
  inaccurate. That is the same "AI-reconstructed guess" failure mode this repo
  already avoids for every other consumption path, so this path is now
  unsupported rather than kept as a known-unreliable option. Tools that cannot
  install a package are not a target for accurate design system consumption.
- `scripts/generate-agent-files.js` - regenerates `tokens.json` straight from
  `index.html`'s source (bracket-matched literal extraction, not a hand
  transcription). Run it after any change to a foundation page's token data:
  ```
  node scripts/generate-agent-files.js
  ```
  Treat this as a required step, not optional cleanup - if `index.html`'s token
  data changes and this isn't re-run, `tokens.json` (and everything generated
  from it) silently goes stale.
- `assets/icons/icons.json` - the real icon geometry exported from Figma's `Icon-outline`
  (node `55:2062`) and `Icon-solid` (`8772:5851`) component sets: 43 outline + 13 solid,
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
  That happened a second time with the small Icon-Button chevron: Figma's small
  variant (Icon-Button set `8685:6254`) carries a remote `fi-sr-angle-small-right`
  instance at the full 24x24, glyph 8x15. The packages had no such icon, so Section
  drew a stroked 16px chevron by hand and `IconButton size="small"` inset its icon to
  16px, both about 60% of Figma's size. It is now `angleSmallRight` in the solid set,
  the small variant has no padding, and Section uses the shared small IconButton.
  The design later moved on from that remote glyph: the small variant now holds an
  Icon-outline `list/right` instance (outline `chevronRight`) bound to
  `size/icon/sm`, 16px at a 4px inset, centred. Both packages follow that
  (`compose-v2.3.10` / `@snacky/ui` `0.13.6`), so nothing in the design uses
  `angleSmallRight` any more; it stays exported only so existing callers keep
  compiling.
  Code names follow the outline twin, not the Figma variant label: a solid icon
  takes the name of the outline icon with the same shape. Figma's `Icon-solid`
  variant `general/pin` (node `10437:8198`, the UIcons `fi-sr-marker`) is the
  filled form of outline `address`, so it ships as `SnackyIcons.solid.address`,
  the same way `riwayat` ships as `history` and `Fav` as `heart`. It is 16px while
  its outline twin is 24, which has a precedent (`heart` is 20 solid, 24 outline).
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
  copy and no unpkg dependency. **Re-run after any change to packages/react-ui or
  packages/compose-ui** (it also regenerates `component-sources.js`, below):
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
- `assets/ui/component-sources.js` - **the "Component Source" panel shows the real
  package files.** Generated by `scripts/build-component-sources.js` (which
  `build-docs-bundle.js` runs at the end, so the same command covers it) from
  `packages/compose-ui` and `packages/react-ui`: every file in each component's
  folder, under its real path, keyed by docs page id. `index.html` injects it the
  first time a page renders that panel. **This makes `build-docs-bundle.js` a
  required step after changes to either package, not just react-ui.** The panel
  used to read hand-written `<script type="text/plain" id="code-<id>">` listings
  for 20 components, which claimed paths like `composeApp/.../SnackyModal.kt` and
  `src/components/Modal.tsx` that never existed and drifted exactly like the old
  Live Preview did: the Modal listing defined its own `BottomSheet` plus a
  `SnackyModal`/`ModalType` API neither package exports, which then leaked into the
  page's code snippets. Those listings are deleted. The page-to-folder map lives in
  the generator's `PAGES`; it throws if a package component folder is added without
  a page (or listed in `UNPAGED`). Foundation pages and the Icon page still use
  `text/plain` blocks on purpose: foundations hold token samples, not package
  source, and the Icon block is a name/usage reference generated by
  `generate-icons.js` from the same `icons.json` the packages ship.
- `.design-sync/previews/*.tsx` - **the stories Claude Design shows, a third render
  path.** `/design-sync` renders these hand-written files, not `index.html`'s
  playgrounds, so a variant that exists on the docs site can be missing from Claude
  Design with nothing failing anywhere. That happened: Section had 8 stories against
  16 documented types (one of them, `SettingsList`, not a Section variant at all) and
  the Modal sheet had 6 of 9. Both were rewritten from the docs playgrounds, which
  are the path measured against Figma. When a docs page gains or changes a variant,
  update its preview file in the same change, then the user re-runs `/design-sync`.
- **Docs code samples must use the real export shape.** 43 React samples used
  `typography.smallRegular`-style flat names against an export that is nested
  (`typography.small.regular`), and 43 Kotlin samples did the same with
  `SnackyTypography.smallRegular`; 24 more Kotlin samples called a `toTextStyle()`
  that only existed as a paste-it-yourself helper on the Foundations page, not in
  compose-ui. The flat names could never compile, and agents copy snippets
  verbatim. All now use the nested names, compose-ui ships
  `SnackyTypographyToken.toTextStyle()` (hand-written in
  `theme/TypographyTextStyle.kt`, because `Tokens.kt` is regenerated), and the
  Input page's `<CopyField copied>` (no such prop), `TextField`-as-chat and
  hand-built address row now show `CopyField`, `ChatInput` and `AddressResult`.
  Before adding a sample, check the name against the package source.
- **Prices are Rupiah with a comma for thousands: `Rp 5,000`, never `$5.00` and
  never `Rp 5.000`.** Confirmed by the user and matching every Rupiah text in Figma.
  Two Figma texts still said dollars (Group-Products-Horizontal and the Payment
  Methods balance), and a design-sync pass once flipped the previews to period
  separators on the strength of older invented preview prices; both were wrong.
- **`ProductGroupSection` exists because Claude Design reads components, not
  compositions.** Claude Design renders the real package, but a composition like
  "Section with a banner and a product row over it" has no name in the package, so
  the only place it could see one was a hand-written preview story, and those went
  missing for months. Counting Figma instances picked which compositions earn a
  component: the three product groups had 8 instances across Home and product
  detail; order status, driver, payment and the other order-screen sections had
  none, so they stay compositions. `Section` stays a generic shell; its Compose
  header is `SnackySectionHeader` (internal) so the banner layout can reuse it.
  It is documented on the Section page, not a page of its own: in Figma it is
  three variants of the Section set, and docs pages follow Figma's structure (a
  first version got its own page and read as a second Section). The Section page's
  Component Source shows both folders; `build-component-sources.js`'s `PAGES`
  accepts a list of folders per page for exactly this.
  The Section page's code samples used to describe an API that never existed
  (`SnackySection(type = SectionType.X)`, `actionLabel`, `OrderStatusTimeline`,
  `ProductCard variant="slider"`). All 16 are real now. The 13 composed types
  were written once and proven three ways from that same text: a TSX typecheck,
  a headless render where all 13 land on their Figma heights, and a Kotlin
  compile, each with a negative control. The playground's Show Code reads the
  sample off the variant card (`sectionSample()` in index.html), so the two
  cannot drift apart.
- **Read Figma bindings, not PNG exports, when a value is in doubt.** The exports in
  `assets/images/variants/` can be stale or padded: `modal-reviews.png` showed empty
  stars at #cccccc after Figma had bound them to `icon/icon-disabled` (#a3a3a3), and
  `modal-driver.png` is 456 tall only because it includes the node's drop shadow
  (the node is 452). A pass that trusted those pixels shipped one wrong fix. Use
  figma-cli to read the node's size and bound variables, and re-export an image
  when it no longer matches its node.
- **Figma is the arbiter, not the Live Preview.** The preview was confirmed
  pixel-perfect and mostly was, but migrating found it wrong in several places:
  every bordered Input field measured 50 against Figma's 48, ProductCard details was
  368 against 372, the List COD chip was 122 against 120, ProductImage's variant was
  90 against 88. Figma draws strokes INSIDE the frame; CSS adds them on top unless
  the height is explicit. That single mistake accounted for seven of the bugs found
  (Button Secondary, five Input fields, the COD chip, Chips, DiscountTag,
  InfoBadge (then still called VariantBadge), PointBalanceBanner). Check it first on anything bordered.
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
- **`PageIndicator` came in through the other door: the count said no, the token
  gap said yes.** The carousel dot row had one real copy in the app page, far
  below Stepper's 19, so the counting rule above did not call for a component.
  What did was the borrowing underneath it: the dots were raw `#dadada` (a grey
  in no ramp) and raw `#f8b732`, and Stepper's own dots were painting
  `--icon-brand` (an icon token used as a shape fill) and `--bg-action-disabled`
  (a pending step is not a disabled control). Two components needing "reached"
  versus "not yet" and both lying about it is what justifies a new semantic
  role, so `bg-indicator-active`/`bg-indicator-inactive` were added in Figma
  first, then flowed out through the generators. Lesson: a missing component and
  a missing token are different findings, and the second can be the real one.
  `PageIndicator` / `SnackyPageIndicator` first shipped inside each package's
  Banner folder, on the theory that carousel chrome belongs with the carousel.
  That was wrong twice over: it reads as part of Banner when it is its own
  pattern (Figma models it as its own component set), and a component with no
  page of its own gets no playground and no Component Source panel, so the docs
  showed a screenshot and nothing else. It now has its own folder, its own
  `PAGES` entry, and its own page under Navigation. Anything with a real
  component in Figma earns a page here; a docs page is what carries a
  component's playground, so folding one into another page hides it.
- **Figma's Banner page instanced three deleted masters.** `Banner/1`, `Banner/2`
  and `Banner/3` (978x152, one carousel scroll state each) were gone from every
  page while their instances still rendered, so two of the three hand-drawn
  `Pagination` copies sat somewhere nothing could edit. They are now one
  `Banner Carousel` component set with `Property 1=page-1/2/3`, built from
  instances of the documented `Property 1=promo` banner plus a `Page Indicator`
  row. Scroll offset is a variant, not an instance override, because the plugin
  API refuses `relative-transform` overrides on instance children (`This
  property cannot be overridden in an instance`), so anything that varies by
  position has to be a variant. Visible difference from before: the three cards
  are now the same promo banner three times, since that is the only promo
  variant the Banner set actually has.
- `assets/images/` - exported PNGs, one per documented variant/state, at 2x-4x scale
  depending on the component. Re-export from the matching Figma node (`download_assets`,
  `defaultFormat:'png'`) whenever a component's real fill/state changes, rather than
  leaving a screenshot showing an old value.
- `packages/react-ui/` - installable `@snacky/ui` npm package: real React
  implementations of all 26 documented components (not just doc samples), so an AI
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
- **Semantic tokens must be emitted as references to their primitive, never
  flattened to a copy of its value.** Both generators originally resolved every
  `{color.primitive.amber.500}` alias down to a literal, so `tokens.css` shipped
  `--bg-action-primary: #f8b732` and `Tokens.kt` shipped
  `val bgActionPrimary = Color(0xFFF8B732)`. The colors were right, but it made the
  primitive/semantic split cosmetic: devtools showed no link between the two, and
  overriding `--color-amber-500` alone (a white-label re-skin, a theme block)
  changed nothing, because each semantic token carried its own frozen copy. That is
  the same "hardcoded per component" token drift this design system exists to
  prevent, reproduced one layer up. `refToCssVar()`/`refToKotlin()` now map an alias
  onto the emitted variable name (`var(--color-amber-500)`,
  `SnackyColorPrimitive.Amber.c500`); anything without a primitive behind it
  (`bgOverlayDim`, a raw rgba) still falls through to the literal. Verified at the
  time of the change: all 175 CSS custom properties resolve to byte-identical
  values, 63 of them now through a reference, and overriding one primitive cascades
  to every semantic that points at it. Do not "simplify" these back to
  `resolveRef()`.
- `packages/compose-ui/` - Kotlin Multiplatform / Compose Multiplatform counterpart
  to `packages/react-ui`, targeting `androidTarget` + iOS. ALL 26 of 26 components ported
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
- **Every `compose-v*` tag through `compose-v2.3.0` compiled clean and published with
  no usable Android artifact at all**, found only when a real Android Studio app tried
  to depend on it. `kotlin { androidTarget { ... } }` in `packages/compose-ui/build.gradle.kts`
  never called `publishLibraryVariants("release")`, which Kotlin Multiplatform's
  Android target needs to register a Maven publication (the iOS targets publish
  without it, which is why this went unnoticed). `compileDebugKotlinAndroid` succeeding
  on every JitPack build made the tag look healthy; the published `.module` actually had
  a `metadataApiElements` variant and three `iosXxxApiElements` variants and nothing
  for `androidJvm`, so any real Android app got "No matching variant ... needed a
  component for use during runtime ... androidJvm" and could not build at all. Fixed in
  `compose-v2.3.1`, confirmed by running `./gradlew publishToMavenLocal` and checking the
  actual `.module` file for a `releaseRuntimeElements-published` variant redirecting
  (`available-at`) to a real `compose-ui-android` artifact. General lesson: a KMP target
  compiling is not proof it publishes; check the `.module` (or the publish task list),
  not just the compile task, when trusting a new platform target.
- **`compose-v2.3.1`'s Android artifact crashed on launch with `NoSuchMethodError:
  FlowRow(...)`**, in any host app whose own Compose BOM resolved a newer
  `androidx.compose.foundation:foundation-layout` than this package links against
  (Compose Multiplatform 1.7.0). `SnackyProductGroupSection`'s grid layout called
  `FlowRow`, which is `@ExperimentalLayoutApi`: Compose gives no binary-compatibility
  guarantee on experimental APIs, and Foundation 1.11.0 inserted a new
  `Alignment.Vertical` parameter into `FlowRow`'s signature that Foundation 1.7.1 (what
  this package compiled against) does not have. Both sides compile clean; the mismatch
  only shows up at runtime, in whichever Foundation version Gradle's normal
  highest-version-wins resolution actually picks for the app. Confirmed by disassembling
  the actual `.aar` with `javap`: the compiled call site's descriptor matched Foundation
  1.7.1's `FlowRow` overload exactly and did not exist in 1.11.0's. Fixed in
  `compose-v2.3.2` by replacing it with a hand-rolled two-column grid built on the
  stable `androidx.compose.ui.layout.Layout` API, confirmed by disassembling the
  rebuilt `.aar` and finding zero references to `FlowRow`/`FlowLayoutKt`. Lesson: a
  published binary library cannot control which Compose version the host app resolves,
  so avoid experimental Compose APIs in it even when they compile fine locally; when a
  runtime crash like this is reported, get the exact required method descriptor from the
  stack trace or `javap` rather than guessing which BOM might be "close enough".
- **No component ever picked up a host app's font, found the same way as the two bugs
  above: a real Android app (`SnackyApp`) actually using the package.** Every one of the
  26 components builds its own `TextStyle` by hand with size/weight/line-height/letter-
  spacing but never `fontFamily`, so text rendered in the platform default even after the
  host app loaded Poppins and passed it into its own hand-written screen text.
  `SnackyButton`'s own doc comment admitted this was expected, in exactly these words:
  "it renders in whatever `fontFamily` is ambient/default until this package grows a
  SnackyTheme that can supply one globally." Fixed in `compose-v2.3.3` by adding exactly
  that: `theme/SnackyTheme.kt` exposes `LocalSnackyFontFamily` (a `CompositionLocal
  <FontFamily?>`, default null) and `SnackyTheme(fontFamily) { content() }`; every
  component's hand-built `TextStyle` and the docs' `toTextStyle()` helper now read
  `LocalSnackyFontFamily.current` as their default. A host wraps its content once
  (`SnackyTheme(fontFamily = PoppinsFamily) { HomeScreen() }`) instead of threading a
  `fontFamily` parameter through every component call. General lesson: a component doc
  comment describing a known gap as "until this package grows X" is a standing TODO, not
  a closed decision, worth grepping for when related work touches that area.
- **The same real-app build also found the Grid layout's two product cards pinned to
  the screen's left edge on any device wider than Figma's 360dp reference canvas**, with
  the leftover width dumped entirely on the right rather than split evenly (not a value
  bug: the two 152dp cards plus their 8dp gap sum to exactly Figma's 312dp content
  width and matched perfectly at that width); the mismatch only showed up on a real
  device's wider viewport (e.g. a Pixel 8's ~412dp), which the docs site's fixed-width
  preview frame never exercises. `SnackySection`'s content sits in a plain `Column`
  (default `Start` alignment) with no reason to center a fixed-width child, so
  `SnackyProductGroupSection`'s Grid branch now wraps its `TwoColumnGrid` in a
  `Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center)`, matching how a
  real e-commerce layout should behave once the screen is wider than the design canvas.
- **`SnackyHeroBanner` used `SnackyRadius.field` (4dp) for its shadow and clip shape on
  both platforms, when the master `Banner` component's own `Card Background` (Figma node
  `10136:5912`, `Property 1=promo`) is `SnackyRadius.bubble` (8dp), confirmed directly
  against that node rather than assumed.** Found by placing real banner artwork inside
  the component in a real app (`SnackyApp`): at 4dp the shadow's own silhouette is close
  enough to straight-edged that it visibly peeked past the artwork's more rounded 8dp
  corner, reading as a squared-off shadow sitting behind a rounded card. `packages/
  react-ui`'s `Banner.css` had the identical bug (`var(--radius-field)` on
  `.snacky-banner-hero`); both fixed in the same pass (`compose-v2.3.4`, `@snacky/ui`
  `0.13.1`) to `SnackyRadius.bubble` / `var(--radius-bubble)`. Lesson: a radius token
  being *a* valid, real token elsewhere in the system does not mean it is the *right*
  one for a given component; check against that component's own master node rather than
  assuming the nearest small value.
- **`NavBar` shipped 72 tall on both platforms against Figma's 88, missing the bar's own
  16dp bottom padding** (`spacing-16`, a primitive, per the component-padding rule
  below). The variant (`Property 1=Customer`, node `55:2100`) is 360x88: an auto-layout
  row of five 72x72 items, `paddingBottom: 16`. The item math was already exactly right
  (12 + 20 icon + 4 gap + 24 line-height + 12 = 72), so only the bar's own padding was
  missing. Root cause is the same shape as the HeroBanner radius bug above, and worth
  internalising as one rule: **an earlier pass read the component SET node (441:13155)
  instead of the variant inside it.** A set's own width/height/padding is Figma's
  gutter around the variant grid, never a spec value, so reading it silently yields
  plausible-but-wrong numbers. Always resolve to the variant (or non-variant component)
  before reading any measurement. `assets/images/variants/navbar-customer.png` was
  exported from that same wrong height, so it was re-exported from `55:2100` and
  `index.html`'s spec entry moved 72 -> 88 with `pb:16`; its `gapTopPct`/`gapHeightPct`
  were re-based onto the taller image (the annotated band's absolute pixel position is
  unchanged, since only padding below the items was added). Verified in a real browser
  against the built bundle: `.snacky-navbar` measures 88 with `padding-bottom: 16px`,
  items still 72.
- **`SearchField` rendered no magnifier at all unless the caller passed one, on both
  platforms, and react-ui's clear button drew a literal `✕` character.** This is the
  "give every icon slot a real default" rule three paragraphs up, violated by the one
  component whose icon is least optional: compose-ui guarded the slot with
  `if (searchIcon != null)` and react-ui with `{searchIcon && ...}`, so a caller who
  followed the docs and omitted the prop got a bare pill with a placeholder and nothing
  else. Fixed in `compose-v2.3.5` / `@snacky/ui` `0.13.2`: both default to the real set
  (`SnackyIcons.Outline.Search` / `outline.search`, and `CloseInput` / `outline.closeInput`
  for the clear button, which `icons.json` authors at 16px, exactly the size both slots
  render at). The distinction worth carrying forward: an image slot (`SnackyProductCard`,
  the Banner family) is genuinely caller-owned and stays required with no default,
  because the package ships no photography; an ICON slot is part of the component's own
  spec and must always fall back to the set. Verified on a real device by publishing to
  Maven Local first and pointing the app at it, so the fix was proven before a public
  tag was cut rather than after.
- **`SnackyNavBar`'s icon slot was `Box(Modifier.size(...))`, which clipped a badge
  wrapped around a nav icon to a single character** (`SnackyBadge(count = 120)` rendered
  "9" instead of "99+"), fixed in `compose-v2.3.6` with `.wrapContentSize(unbounded =
  true)` so the slot keeps its 20dp footprint but stops capping its content's width.
  Two things worth carrying forward. First, **`Modifier.size()` is a constraint, not a
  hint**: anything handed to a slot sized that way is measured at exactly that width, so
  a slot meant to accept arbitrary caller content should not use it without
  `wrapContentSize(unbounded = true)`. Second, **react-ui has the identical 20px box and
  is NOT affected**, because a CSS `width` does not clip an overflowing child the way
  Compose's measurement constraints do. The two ports being pixel-identical in the
  normal case says nothing about how they behave at the edges, so a bug found on one
  platform needs checking on the other rather than assuming it mirrors, in either
  direction. The giveaway here was that the same `SnackyBadge(count = 120)` rendered
  "99+" correctly in the header (unconstrained parent) and "9" in the nav bar, and that
  it had previously shown "99" and only degraded to "9" once Poppins made the glyphs
  wider, which is the signature of clipping rather than a counting bug.
- **Four more spec'd icons were still caller-supplied, found by rendering every
  component at once in a real app** (`SnackyApp`'s `ComponentGallery.kt`, a screen
  per component built straight from the docs). The SearchField magnifier fix two
  entries up closed one instance of this and the rule was already written down;
  these four were simply never audited against it. Fixed together in
  `compose-v2.3.7` / `@snacky/ui` `0.13.3`, each against its own Figma-exported
  variant PNG: `SnackyPasswordField` rendered no eye at all (`Outline.EyeOff`
  masked, `Outline.Eye` revealed, per `input-texticon-default.png`),
  `AddressResult` no map pin (`Outline.Address` at 20dp, per
  `input-address-search-selected.png`), and `PointBalanceBanner` neither of its
  two glyphs (`Solid.Points` and `Solid.Balance` at 16dp, per
  `banner-point-balance.png`). The password field is the sharpest case: it is a
  named component whose entire job is masking, and it shipped the mask with no
  way to undo it, so `visible` is now optional (null means the component owns the
  reveal state and the toggle just works) rather than a flag only a caller with
  their own icon could reach.
  The fourth is the same rule applied to behaviour rather than artwork:
  SearchField's clear button was gated on `value.isNotEmpty() && onClear != null`
  on both platforms, so a caller who wired up nothing but value and onChange got a
  filled field with no clear button, which matches no documented state (Figma's
  filled/active variant always draws it). It is driven by the text alone now and
  falls back to emptying the field itself; `onClear` is only for callers who need
  to hear about it. Worth generalising: **an optional prop that gates a piece of
  the spec is the same bug as a missing default**, whether the prop carries an
  icon or a callback.
- **Two whole docs pages described APIs neither package has ever exported**, found
  in the same pass because the real app could not be written from them. Every one
  of the Banner page's 28 code samples (7 variants plus 7 playground types, both
  languages) called `SnackyBanner(imageUrl = ..., variant = BannerVariant.X)` and
  `<Banner variant="..." />`; the real exports are `SnackyHeroBanner`,
  `SnackySquareBanner`, `SnackyFullWidthBanner`, `SnackyPointBalanceBanner` and
  `SnackyAlertBanner` (`HeroBanner`, `SquareBanner`, ... in react), the three image
  banners take a content slot rather than a URL because the package ships no image
  loader, and none of them has an `onClick` parameter. The Input page's four
  password samples passed `isPassword = true`, a parameter that has never existed.
  Note what did NOT catch this: the Banner playground's `impl` already rendered the
  correct components (`U.HeroBanner`, `U.AlertBanner`), so the Live Preview was
  right while the Show Code panel beside it was fiction. **A page rendering
  correctly is not evidence its code samples compile**, and the
  `build-docs-bundle.js` migration only replaced `impl`, never the sample strings.
  The whole file was then swept rather than just those two pages, which turned up
  six more components documented against an API they never had: `CopyField` took a
  `copied` flag, `ProductChip` an `icon` instead of `thumbnail`, `OrderListItem`
  `price`/`quantity`/`productCount`/`onDetailClick` instead of
  `itemsSummary`/`total`/`onAction`, `NotificationListItem` `highlighted` instead of
  `unread`, and `Avatar`, `ProductImage` and `ProductCard` all took a URL where the
  Kotlin side has a content slot (`ProductImage` also named a nonexistent
  `ImageUsage` enum and a `sold` flag, `ProductCard` a nonexistent
  `ProductCardVariant.Details` in place of `SnackyProductCardDetails`, and a
  `Double` rating where the parameter is a `String`).
  How the sweep was done, since eyeballing 174 samples does not work: parse every
  `fun Snacky*` signature out of compose-ui and every props interface out of
  react-ui's source (unions included), pull every sample string out of
  `index.html`, and diff the named arguments and JSX props against them. That
  found all 17 bad Kotlin arguments and every bad prop mechanically. The samples
  were then compiled for real, in a throwaway `DocsSampleCheck.kt` under
  `commonMain` with stub painters, with a negative control (one old-form
  `SnackyAvatar(imageUrl = ...)` call, which failed exactly as it should) to prove
  the check had teeth; the file was deleted once green. Both audit scripts and that
  pattern are worth rebuilding rather than trusting a read-through if samples
  drift again.

- **An icon audit, prompted by the user finding two Figma nodes that were not
  instances of the icon component.** Two separate questions, worth keeping
  separate. **Colour: clean.** The `SnackyIcon` primitive carries no colour of
  its own (it defaults to `LocalContentColor`, and react's generated icons to
  `currentColor`), so an icon is always painted by whatever host renders it, and
  all 12 compose tint providers plus every react `__icon` rule resolve to a
  semantic token. The `text/*` tokens some field icons use are Figma's own
  binding, not an invention. No icon anywhere carries a raw hex.
  **Geometry: three real defects**, all the same shape as the Section chevron
  already recorded above. `SnackyAccordion` stroked its own chevron polyline on
  both platforms, and compose-ui's `SnackyHeader` hand-drew Back and Close while
  react-ui had always taken both from the set. The accordion chevron was measured
  rather than eyeballed: against `accordion-withicon-default.png` (a 2.1x export,
  so the card's own 312 width calibrates the scale), Figma's chevron is 11.41 x
  5.71, the set's `chevronDown` at 20dp is 11.67 x 5.98, and the hand-drawn
  polyline was 11.50 x 6.50, about 14% too tall. All three now come from the set.
  What is left hand-drawn is legitimate and worth not "fixing" later: Checkbox's
  tick and ImagePlaceholder's photo glyph have no equivalent in `icons.json` at
  all (`check` lives in `legacy-extras.json` precisely because it is not in either
  Figma set, and Figma draws the tick inside the Checkbox component itself), and
  Stepper's connector and Tab's underline are not icons.
  The lesson is about the direction of trust: a wrong binding or a non-instance
  icon *inside a component* flows into the packages, because the packages mirror
  component bindings; the same mistake on a loose icon in a screen frame does not,
  because the packages contain no screens. So a Figma slip matters here exactly to
  the extent that it lives inside a component.
- **The docs site had the same icon question asked of it, and answered
  differently.** Three parts, and only one of them was wrong. The `ICONS`
  registry `index.html` renders from is generated from `icons.json` by
  `generate-icons.js`, confirmed by re-running the generator and diffing (no
  change), so the site draws exactly the geometry the packages ship. The Live
  Preview renders the real package, so the slot-centring and chevron fixes reach
  it without the docs being touched at all. What was wrong is the playgrounds'
  own `ic()` calls: eleven passed a raw hex (`#333333`, `#525252`, `#f8b732`) and
  the helper itself fell back to a raw `#525252`, all now semantic tokens.
  Verified inside the preview iframe rather than assumed: `--icon-primary`,
  `--icon-secondary`, `--icon-brand` and `--icon-disabled` all resolve there to
  the same hex values that were replaced, so nothing moved visually. The one
  inline SVG left in a playground is the Google "G" in the Button page, a brand
  logo, which is caller artwork exactly like a payment logo and correctly not in
  the icon set.
  Worth stating the limit plainly, because it is easy to over-read a green
  audit: `assets/images/variants/*.png` are exports FROM Figma, so they show
  Figma's state, not the packages'. A wrong icon or binding still sitting in the
  Figma file shows up in those images no matter how clean the packages are, and
  no amount of package auditing fixes it.
- **The Figma icon audit, then the fixes, then a set change from the user.** A
  read-only figma-cli pass over all 27 pages found the component pages far cleaner
  than feared, and every finding already correct in the packages, so none of it
  reached a user; the point of fixing them is that Figma stops disagreeing with
  itself. Fixed in the file: 13 rating stars painted with
  `background/action/bg-action-primary` or `border/input/border-input-active`
  (right hex, wrong role) now bound to `icon/icon-brand`; the one Accordion chevron
  of four bound to `text/text-placeholder` now `icon/icon-secondary` like its
  siblings; and seven icons living outside the two sets swapped to real set
  instances (Section's destination pin and two small down chevrons, Input's search
  glyph and its send glyph, which was a raw vector). Two more wrong roles surfaced
  inside those swaps and were fixed in the same pass: the pin painted with
  `bg-action-primary` and the active send glyph with `background/surface/bg-surface`
  (now `icon/icon-on-accent`, which is what the package already used). Every rebind
  was checked to keep the same hex before and after, except the Accordion chevron,
  which is the only visible change and the whole point of it.
  **Always dry-run a rebind against the whole page.** The first star pass matched 37
  nodes, not 12: the other 25 were Icon-Button background circles, which correctly
  use `bg-action-primary`. Applying it would have produced the mirror image of the
  bug being fixed, an icon token painting a background. Scoping by the glyph's own
  node name (`Star icon`) brought it to exactly the 12 the audit had counted.
  Also worth recording, since the report said otherwise at first:
  `fi-rr-angle-small-down` was NOT a missing icon. Measured against the set it is
  `chevronDown` (9.33 x 4.78 against a measured 9 x 5), and the destination pin is
  `address` (13.41 x 16 against 13 x 16).
  The user then added `Property 2=list, Property 3=left` (node 10564:7674) to
  Icon-outline and renamed `list/right`'s own Property 3, so the Calendar could
  instance the set instead of drawing loose arrows. **A variant rename moves no code
  name here**: `icons.json` names are semantic and were mapped by hand, and this
  repo has no automatic exporter, so the new glyph was matched by geometry, not
  label. The export transform was recovered rather than guessed: Figma's current
  `list/right` path scaled per axis by 24/29.14 and 24/30 reproduces all 106
  coordinates of the shipped `chevronRight` within 0.0001, so the same transform
  applied to `list/left` yields `chevronLeft`, occupying the identical box pointing
  the other way. The variant frames are 29.14 x 30 while `icons.json` normalises to
  24, which is why a naive export would have come out stretched.
  **Both packages had been drawing the wrong glyph in Calendar all along.** They
  used `outline.back`, a shafted arrow, turned round for "next" by `rotate(180f)` in
  compose and `scaleX(-1)` in react, two different operations on an asymmetric
  glyph. Figma's month navigation was a plain chevron even before this change, so
  the fix was a glyph swap, not just a rename: `chevronLeft` / `chevronRight`, no
  flip. One inconsistency left in Figma for the user: the two Calendar arrow
  instances sit at the master's raw 29.14 x 30 while every other use of the same
  chevron is resized to 24. The packages keep 24.
- **All 43 Icon-outline masters once grew to 29.14 x 30, and every outline instance
  without a size override grew with them.** The cause was an auto-layout added to a
  component frame while building the left chevron; the outline set is not
  uniform (29 icons at 24, 8 at 20, 2 at 16), and the auto-layout flattened all of
  them to one size. The symptom that surfaced first was the small Icon-Button's
  chevron hanging off the circle, but the real damage was quieter: Input's
  Text+Icon field went 312x48 to 321x54, and Navbar, Modal and Calendar icons all
  inflated. Restoring was done by geometry, not by assumption, and the order
  matters as a lesson because the first attempt got it wrong. Every master was
  first set to 24x24 on the theory that the set was uniform; checking a 24, a 20
  and a 16 icon afterwards showed the 24s exact and the rest 1.2x and 1.5x too big.
  The fix was to export every master's SVG and match its full path against
  `icons.json` at each candidate size (current coordinates times s/24 must equal a
  real entry): 39 of 43 matched exactly to a unique name, the other four resolved
  by point sets and elimination, giving each master's true size. After restoring,
  the 16 and 20 icons reproduce `icons.json` at 1:1 within 0.0001, the fields are
  back to 312x48, and no icon instance on any component page is larger than its
  container. **Verify a sample from every size class before applying a bulk fix,
  not after**; one chevron proving exact said nothing about the icons that were
  not 24.
- **Caller icon slots were pinned to the top of their box, found from a payment
  logo in the Accordion playground.** A slot that fixes its own size and then does
  not centre its content only looks right while the content is square and fills
  it, which every icon in the set is, so the bug hid until a 3.19:1 bank logo went
  in: at 24 wide the BCA mark is 7.5 tall and sat 8.2px above the title it was
  supposed to line up with. Measured, not eyeballed, by rendering every
  caller-owned slot with that same wide logo and comparing centres: Accordion
  (-8.2), ProductChip (-8.2), PointBalanceBanner (-5.5) and Button (-2) were all
  off, AddressResult, NavBar, InfoBadge and IconButton were already right. Compose
  has the same trap with a different spelling, since a fixed-size `Box` defaults to
  `Alignment.TopStart`, so nine slot boxes there got `contentAlignment =
  Alignment.Center`. Note `PointBalanceBanner` was broken in react and already
  correct in compose, one more case of the two ports diverging exactly where
  nothing renders both. Adding centring is a no-op for content that already fills
  the box, which is why this is safe to apply across every slot rather than only
  the four that were measurably wrong.
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
