# compose-ui

Kotlin Multiplatform / Compose Multiplatform implementation of the Snacky App
design system, the Compose counterpart to `@snacky/ui`
([packages/react-ui](../react-ui)). Sourced from the same
`../../tokens.json` / `../../components.json` that trace back to Figma
(file key `4Uh4Y1fPQXu2hwq0vEXHXd`).

## Status: 13 of 22 components

Design tokens, plus `Button`, `IconButton`, `Checkbox`, `RadioButton`,
`Toggle`, `Avatar`, the `Badge` family, `Callout`, `Chips`, `NavBar`, `Tab`,
`Accordion`, and `Header` (see below).
Kotlin
Multiplatform library targeting `androidTarget` and iOS (`iosX64`,
`iosArm64`, `iosSimulatorArm64`), with Compose Multiplatform wired in as a
dependency. Confirmed to actually compile locally (`Build > Rebuild Project`
in Android Studio), not just written and assumed correct, and a real
JitPack build attempt (`compose-v0.1.1`) already got as far as real Kotlin
compilation before hitting the two bugs described below, `compose-v0.1.2`
has those fixed but its own JitPack build result isn't confirmed yet.

Published via [JitPack](https://jitpack.io) (builds straight from this Git
repo on a tag, no registry account or publish step on our side):

```kotlin
// settings.gradle.kts
dependencyResolutionManagement {
    repositories {
        maven("https://jitpack.io")
    }
}

// build.gradle.kts
implementation("com.github.rezatresnas:snacky-design-system:compose-v0.1.2")
```

Confirmed coordinate format (`com.github.User:Repo:Tag`, the repo-level
form, not the module-qualified `User.Repo:Module` form) via JitPack's own
generated snippet. Check [jitpack.io/#rezatresnas/snacky-design-system](https://jitpack.io/#rezatresnas/snacky-design-system)
for the latest tag's actual build status.

### Publishing to JitPack

No account, no signing, no repo secrets: it builds directly from the
tagged commit the first time someone requests that version (click "Get it"
on the JitPack page, or just have a real build resolve the dependency). To
cut a release: bump `version` in `gradle.properties`, commit,
`git tag compose-v0.1.X && git push --tags` (the `compose-v` prefix, not
`v`, is so it doesn't collide with `packages/react-ui`'s npm-release tags
on the same repo). See [../../jitpack.yml](../../jitpack.yml) for the build
command JitPack runs (it points at this subfolder, since the buildable
Gradle project isn't at the repo root).

The first real attempt (`compose-v0.1.0`) surfaced two real bugs since
this had never actually been built before: `gradlew` was committed without
its Unix executable bit (Windows/NTFS has no such concept, `git
update-index --chmod=+x` fixed it), and `Button.kt` was missing `import
androidx.compose.runtime.getValue` needed for a `by` delegate on
`State<Boolean>` to resolve, plus a JVM-target mismatch between Kotlin (11)
and AGP's own javac step (still defaulting to 1.8). Both fixed in
`compose-v0.1.2`.

## What's here

### Components

- `SnackyButton` (`src/commonMain/kotlin/com/snacky/ui/components/button/Button.kt`),
  Primary/Secondary/Tertiary hierarchy, each with an optional Danger intent,
  Default/Small sizes, an optional 24x24 leading icon slot. Ported from
  `packages/react-ui`'s verified `Button.tsx`/`Button.css`, matches the
  `SnackyButton(text = ..., variant = ButtonVariant.X, ...)` shape already
  documented in the site's own Kotlin code samples (`index.html`'s
  `PG.button.getKotlin`).

  One deliberate deviation from the web version: mobile has no hover, only a
  press. This maps `Button.css`'s `:active` (pressed) colors and drops
  `:hover` entirely rather than trying to simulate it on a touch target.

  Not yet given a `FontFamily` (Poppins isn't bundled, see the Typography
  note below), it renders in the ambient/system default font until this
  package grows a `SnackyTheme` that can supply one globally.

- `SnackyIconButton` (`src/commonMain/kotlin/com/snacky/ui/components/iconbutton/IconButton.kt`),
  a compact circular touch target for a single icon. Primary (32dp default /
  24dp small, the icon glyph itself always stays 16dp), Secondary (40dp,
  shadowed, doubles as a toggle via `selected`), Tertiary (40dp, no resting
  fill). Ported from `packages/react-ui`'s verified `IconButton.tsx`/
  `IconButton.css`, not the site's illustrative Kotlin sample (that sample's
  `tint`/upload-variant params aren't in react-ui's real, verified prop
  shape, so weren't carried over here either).

  Caught one stale doc comment in `IconButton.tsx` while porting: it claims
  Primary is "24px (default) or 16px (small)", the CSS (32px/24px) is what
  actually ships and is what this Compose port matches, same "verified
  implementation wins" rule the rest of this repo already follows.

  Secondary's elevation uses Compose's own `Modifier.shadow`, an
  approximation, not a literal replication of the CSS `box-shadow` blur
  (see `SnackyShadow`'s doc comment in Tokens.kt).

- `SnackyCheckbox` (`src/commonMain/kotlin/com/snacky/ui/components/checkbox/Checkbox.kt`),
  binary on/off selection with a label. Off is a white field (`bgSurfaceField`)
  with a `borderInputDefault` outline, checked is a solid `bgActionPrimary`
  fill with a white (`iconOnAccent`) checkmark. The checkmark is drawn with a
  `Canvas`/`Path`, not an icon font or vector asset, scaled proportionally
  from the same polyline Checkbox.css masks in (points `(20,6)-(9,17)-(4,12)`
  in a 24x24 space, stroke width 2.5). Figma defines no distinct disabled
  visual (only On/Off), so `enabled` only gates interactivity here, it
  doesn't dim or recolor anything.

  Ported and verified against Figma (node `444:11084`) twice in the same
  session: first caught two real color bugs in `packages/react-ui`'s
  `Checkbox.css` and `index.html`'s Live Preview (off-state fill bound to
  `icon-secondary` instead of the correct value, checkmark using
  `text-primary` instead of white), fixed both; then the user updated the Off
  state in Figma itself mid-session (solid gray fill -> white field + outline),
  and all four surfaces (react-ui, index.html's Live Preview, its Spec-tab
  data, its Kotlin illustrative sample) plus this Compose port were updated to
  match.

- `SnackyRadioOption` (`src/commonMain/kotlin/com/snacky/ui/components/radiobutton/RadioButton.kt`),
  single-selection control for a group of 2+ mutually exclusive options. A
  24dp ring (1px `borderMain`, or `primitive.primary.500` when selected) with
  a 12dp center dot when selected. Disabled is a solid `bgSurfaceVariant`
  (#f3f3f3) fill and suppresses the dot entirely even if selected (no
  disabled+selected variant exists in Figma to contradict that).

  Found and fixed two real bugs in `packages/react-ui`'s `RadioButton.css`
  and all of `index.html`'s surfaces (Live Preview, Spec-tab) while porting,
  confirmed against Figma (node `366:9683`, page "Radio Button", both raw
  node data and a screenshot): the ring was `1.5px` (Figma's `strokeWeight`
  is `1` on every variant), and Disabled's fill was plain white/`bgSurface`
  instead of `bgSurfaceVariant`. Spec-tab text also had the selected dot
  documented as "6x6px" (the real Ellipse is 12x12) and Disabled described as
  an opacity effect (it's a solid fill, not opacity) - both corrected.

- `SnackyToggle` (`src/commonMain/kotlin/com/snacky/ui/components/toggle/Toggle.kt`),
  switch for settings that take effect immediately. A 56x24dp pill track
  (vertically centered in a 56x32dp hit target) with a 32dp thumb that
  slides between the two ends, animated with `animateDpAsState`/
  `animateColorAsState` (needs the `compose.animation` dependency, added
  alongside this component). Disabled dims the whole control to 50% opacity
  - the one component so far with an actual Figma-defined disabled
  treatment, unlike Checkbox/RadioButton where it's left unspecified.

  Found and fixed one real color bug in `packages/react-ui`'s `Toggle.css`
  and `index.html`'s Live Preview while porting, confirmed against Figma
  (node `441:14339`, page "Toggle") via its bound variables, not just raw
  hex: the off-thumb is bound to the `icon-disabled` variable (#a3a3a3),
  react-ui had `neutral-500` (#7a7a7a). Also noted, but left alone: the
  on-track's paint (#fffbe9) isn't bound to any Figma variable and differs
  by a few values per channel from `bgSurfaceHighlight`/primary-50
  (#fef8eb), close enough that introducing a new one-off raw token for what
  reads as untokenized Figma drift wasn't worth it.

- `SnackyAvatar` (`src/commonMain/kotlin/com/snacky/ui/components/avatar/Avatar.kt`),
  circular profile photo in three fixed sizes (32/56/72dp,
  `SnackySize.Avatar`). Confirmed against Figma (node `8807:6467`, page
  "Avatar"): a plain circle, image fill, no border/ring at any size, exactly
  matching `packages/react-ui`'s `Avatar.tsx`/`Avatar.css` already, no bugs
  found this time. Ships no image loader (no network/bitmap-loading
  dependency in this package, the same gap `Illustration` already has in
  `packages/react-ui`), `content` is whatever image composable you already
  use (Coil's `AsyncImage`, a raw `Image(bitmap = ...)`, etc.), this just
  handles the fixed size and circular clip.

- `SnackyBadge`/`SnackyDiscountTag`/`SnackySoldOutBadge`/`SnackyVariantBadge`
  (`src/commonMain/kotlin/com/snacky/ui/components/badge/Badge.kt`), the
  Badge family, four small independent composables mirroring
  `packages/react-ui`'s four-export `Badge.tsx`/`Badge.css` split exactly.
  `SnackyBadge` is a numeric count overlay (wraps a `content` slot, e.g. a
  cart icon) that hides entirely when `count <= 0`. Confirmed against Figma
  (node `8792:6172`, page "Badge") - all four variants matched already, no
  color/token bugs this time, `SnackySoldOutBadge`'s dim overlay uses
  `bgOverlayDim` (the token already carries the exact `rgba(51,51,51,0.8)`
  react-ui hardcodes as a raw value). One likely-inconsequential note, not
  acted on: Figma's Sold variant measures 7dp horizontal padding, not the
  spacing-8 token react-ui/this port both use, reads like an auto-layout
  hug-content rounding artifact rather than an intentional value.

- `SnackyCallout` (`src/commonMain/kotlin/com/snacky/ui/components/callout/Callout.kt`),
  chat message bubble. Received aligns left/white, Sent/Pending align
  right/accent, text stays `textPrimary` (#333333) on every variant
  including Sent/Pending's yellow fill, confirmed against Figma, not
  inverted to white. `statusIcon` is an optional composable slot (a
  consumer-supplied check/clock icon), shown only when not Received.

  Found and fixed one real bug in `packages/react-ui`'s `Callout.css` and
  `index.html`'s Live Preview while porting, confirmed against Figma (node
  `8690:7426`, page "Callout") via both raw node data and a screenshot:
  both had an invented `box-shadow` on the Received variant that doesn't
  exist in Figma (its `effects` array is empty, flat like Sent/Pending,
  visually confirmed with no shadow under the white bubble in the
  screenshot). Component Source's Kotlin sample already had no shadow, so
  it needed no fix.

- `SnackyFilterChip`/`SnackyProductChip` (`src/commonMain/kotlin/com/snacky/ui/components/chips/Chips.kt`),
  two independent pill-toggle components mirroring `packages/react-ui`'s
  `FilterChip.tsx`/`ProductChip.tsx`/`Chips.css` split exactly.
  `SnackyFilterChip` is text-only, `SnackyProductChip` adds a 24x24
  `thumbnail` composable slot. Confirmed against Figma (node `351:6731`,
  page "Chips"): both variants x both states matched already, no
  color/token bugs this time.

- `SnackyNavBar` (`src/commonMain/kotlin/com/snacky/ui/components/navbar/Navbar.kt`),
  bottom navigation, 5 tabs for the customer flow. Mirrors
  `packages/react-ui`'s `Navbar.tsx`/`Navbar.css`, including its documented
  deliberate deviation: items use `Modifier.weight(1f)` to fill the
  container width, where Figma's frame hardcodes 72x72 per item (shown at a
  fixed 360dp width there). Confirmed against Figma (node `441:13155`, page
  "Navbar"): no bugs, including the already-noted detail that icon and
  label use different inactive colors (`iconSecondary` #525252 vs
  `textSecondary` #7a7a7a) and the active icon color (`primitive.primary.500`)
  - all re-verified directly rather than assumed correct because a comment
  said so. The outer shadow matches `shadowTop` exactly (offsetY -4, blur
  10, alpha 0.08), approximated with a plain `Modifier.shadow` since Compose
  has no directional offset control for an upward-cast shadow.

- `SnackyTabRow` (`src/commonMain/kotlin/com/snacky/ui/components/tab/Tab.kt`),
  inline tab selector with a 2dp accent underline on the active tab. Mirrors
  `packages/react-ui`'s `Tab.tsx`/`Tab.css`.

  Found and fixed one real bug in react-ui's `Tab.css` and both of
  `index.html`'s surfaces (Live Preview, Spec-tab) while porting, confirmed
  against Figma (node `386:10909`, page "Tab") via a screenshot and the
  label/underline's separate node fills: the active label is
  `primitive.primary.700` (#b08224), a distinct darker value from the
  `primitive.primary.500` (#f8b732) underline - all three had the same
  color repeated for both instead of two different ones. Also nudged
  Component Source's Kotlin sample (uses Material3's own `TabRow`, a
  different visual paradigm) toward the same distinction, lower confidence
  since it's illustrative-only.

- `SnackyAccordion` (`src/commonMain/kotlin/com/snacky/ui/components/accordion/Accordion.kt`),
  expandable panel for FAQs and collapsible details. Header and (when
  expanded) panel render as two separate elevated cards with a small gap
  between them, not one continuous card. Title size responds to whether
  `leadingIcon` is passed. Supports both self-managed (`expanded`/`onToggle`
  omitted) and controlled usage.

  This one turned up the biggest find of the Figma audit so far. Confirmed
  against Figma (node `8696:6572`, page "Accordion") via a screenshot and
  raw node data, `packages/react-ui`'s `Accordion.tsx`/`Accordion.css` and
  every surface in `index.html` (Live Preview, Spec-tab, both Kotlin and
  React Component Source samples) had: an invented `borderMain` outline on
  the no-icon header that doesn't exist in Figma at all (neither variant, in
  either state, has a border, elevation only), the chevron using
  `textPrimary`/`iconPrimary` instead of `iconSecondary`, and (in
  `react-ui`/the React Component Source sample specifically) the expanded
  panel modeled as a padding-only section of the same card instead of its
  own separate elevated card. Fixed all of it. The shared `Acc` helper
  index.html injects into several other components' Playground iframes had
  already gotten the card structure right, only its chevron color needed
  fixing. A prior session had actually already caught the border
  inconsistency (a Spec-tab note said "flagged rather than silently
  assumed" after finding Figma's Expanded node had no border while Default
  claimed one) but couldn't resolve which was correct without deeper
  inspection - this session's direct node/variable access resolved it.

- `SnackyHeader` (`src/commonMain/kotlin/com/snacky/ui/components/header/Header.kt`),
  page header bar. Title always centers in the remaining space - when a
  leading icon is present but there's no trailing action, the title row
  gets matching right padding so it stays optically centered against the
  whole bar, not just the leftover space next to the icon. Mirrors
  `packages/react-ui`'s `Header.tsx`/`Header.css`.

  Confirmed against Figma (node `9617:5808`, page "Header"): padding,
  40dp icon-button sizing, and title typography (Poppins Bold 16sp/36sp
  line height/0.01em) all matched exactly, no bugs this time - this
  component was already carefully verified when first built earlier in
  this project's history, and re-checking it now confirms that held up.

  The back/close glyphs are hand-drawn `Canvas`/`Path` shapes matching
  `packages/react-ui`'s own starter icon set exactly (`M15 6l-6 6 6 6` /
  `M6 6l12 12M18 6L6 18`, 1.5 stroke in a 24x24 space). That set is itself
  documented as generic, not pixel-verified against Figma, so this port
  carries the same known gap rather than inventing a new one.

### Theme tokens

`src/commonMain/kotlin/com/snacky/ui/theme/Tokens.kt` is generated from
`tokens.json` by `../../scripts/generate-compose-tokens.js` (never hand-edit
it):

- `SnackyColorPrimitive` / `SnackyColor`, raw ramps and semantic colors as
  `androidx.compose.ui.graphics.Color`
- `SnackySpacingPrimitive`, `SnackyGap`, `SnackyLayout`, `SnackyMargin`, all
  `Dp`
- `SnackyRadiusPrimitive` / `SnackyRadius`, `Dp`
- `SnackySize.Icon` / `SnackySize.Avatar`, `Dp`
- `SnackyShadow`, raw `SnackyShadowToken(offsetX, offsetY, blurRadius, color)`
  values. Compose Multiplatform has no direct box-shadow primitive, so these
  are not a ready-to-apply `Modifier`, map them onto whatever shadow API the
  target platform uses.
- `SnackyTypography`, raw `SnackyTypographyToken(fontSize, fontWeight,
  lineHeight, letterSpacing)` values, grouped the same way as
  `tokens.json` (`SnackyTypography.H1.bold`, `SnackyTypography.Body.regular`,
  etc). Not a Compose `TextStyle`, this package ships no Poppins font
  resource, so build the `TextStyle` yourself with a `FontFamily` you supply:
  ```kotlin
  TextStyle(
      fontFamily = poppins,
      fontSize = SnackyTypography.H1.bold.fontSize,
      fontWeight = SnackyTypography.H1.bold.fontWeight,
      lineHeight = SnackyTypography.H1.bold.lineHeight,
      letterSpacing = SnackyTypography.H1.bold.letterSpacing,
  )
  ```

Every value is fully resolved to a literal (colors, dp, sp), the same
flattening approach `generate-react-tokens.js` uses for `tokens.css`, there
are no cross-references between generated Kotlin objects.

## Building

Open this folder directly in Android Studio (File > Open >
`packages/compose-ui`). The Gradle wrapper is committed (pinned to Gradle
8.7, matching AGP 8.5.2, see `gradle/wrapper/gradle-wrapper.properties`),
so sync should just work, `Build > Rebuild Project` has been confirmed
green for `Button` + `IconButton`. iOS targets show as disabled on a
non-macOS machine ("The following Kotlin/Native targets cannot be built on
this machine"), that's expected, iOS compilation needs Xcode.

## Keeping this in sync

If `tokens.json` changes (after running
`node ../../scripts/generate-agent-files.js`):

```bash
node ../../scripts/generate-compose-tokens.js
```
