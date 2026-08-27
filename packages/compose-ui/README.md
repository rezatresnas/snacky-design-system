# compose-ui

Kotlin Multiplatform / Compose Multiplatform implementation of the Snacky App
design system, the Compose counterpart to `@snacky/ui`
([packages/react-ui](../react-ui)). Sourced from the same
`../../tokens.json` / `../../components.json`.

## Status: 24 of 24 components - complete

Every documented component is ported: design tokens, plus `Button`,
`IconButton`, `Checkbox`, `RadioButton`, `Toggle`, `Avatar`, the `Badge`
family, `Callout`, `Chips`, `NavBar`, `Tab`, `Accordion`, `Header`, `List`,
`BottomSheet`, `Section`, the `Input` family, the `Banner` family, the `Icon`
set, `Illustration`, `ProductImage`, and `ProductCard` (see below).

Known gaps that are deliberate, not unfinished work: this package ships no
image loader and no bundled artwork, so `Avatar`, the image banners,
`Illustration`, `ProductImage` and `ProductCard` all take the image as a
`content` slot; and no `FontFamily` is supplied (Poppins is not bundled), so
text renders in the ambient font until a `SnackyTheme` provides one.
Kotlin
Multiplatform library targeting `androidTarget` and iOS (`iosX64`,
`iosArm64`, `iosSimulatorArm64`), with Compose Multiplatform wired in as a
dependency. Every component is confirmed to actually compile before being
committed, not written and assumed correct: `gradlew compileDebugKotlinAndroid
compileCommonMainKotlinMetadata`, run with `JAVA_HOME` pointed at Android
Studio's bundled JBR.

Note on release cadence: `compose-v0.1.2` shipped when only `Button` existed,
and the 15 components added after it sat on `main` unreleased for a while.
`compose-v0.2.0` is the first tag carrying the full set, hence the minor
bump rather than a patch. If you consumed `compose-v0.1.2`, you effectively
had a one-component library.

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
implementation("com.github.rezatresnas:snacky-design-system:compose-v1.1.2")
```

### Using the icons

**Never substitute an emoji or a hand-drawn shape for an icon.** The real set
ships as `SnackyIcons.Outline.*` (42) and `SnackyIcons.Solid.*` (11), rendered
through `SnackyIcon`:

```kotlin
SnackyIcon(SnackyIcons.Outline.Search, contentDescription = "Search")

// tint defaults to LocalContentColor, so an icon dropped into a component's
// slot picks up that component's own resolved colour
SnackyTextField(
    value = query,
    onValueChange = { query = it },
    leadingIcon = { SnackyIcon(SnackyIcons.Outline.Search) },
)

// tint deliberately when you need to
SnackyIcon(SnackyIcons.Solid.Heart, tint = SnackyColor.iconActive)
```

Each icon carries its own viewBox (16, 20 or 24), and `size` defaults to that
natural size. If no name fits what you need, check
`../../assets/icons/icons.json` before drawing anything - inventing a glyph is
never the right fallback.

### Supplying the font

The package bundles no font, so text renders in the ambient one until you give
it Poppins. Build the `TextStyle` with a `FontFamily` you supply (see the
Typography note further down), and apply it to any text you author around the
components too, not just to the components themselves.

Confirmed coordinate format (`com.github.User:Repo:Tag`, the repo-level
form, not the module-qualified `User.Repo:Module` form) via JitPack's own
generated snippet. Check [jitpack.io/#rezatresnas/snacky-design-system](https://jitpack.io/#rezatresnas/snacky-design-system)
for the latest tag's actual build status.

### Publishing to JitPack

No account, no signing, no repo secrets: it builds directly from the
tagged commit the first time someone requests that version (click "Get it"
on the JitPack page, or just have a real build resolve the dependency). To
cut a release: bump `version` in `gradle.properties`, commit,
`git tag compose-v0.X.Y && git push origin compose-v0.X.Y` (the `compose-v`
prefix, not `v`, is so it doesn't collide with `packages/react-ui`'s
npm-release tags on the same repo). See [../../jitpack.yml](../../jitpack.yml)
for the build command JitPack runs (it points at this subfolder, since the
buildable Gradle project isn't at the repo root).

Unlike `@snacky/ui`, this has no CI publish step, so pushing to `main` does
NOT release anything - a tag has to be cut explicitly. Cut one whenever a
component is added or a real fix lands, otherwise consumers stay pinned to
whatever the last tag happened to contain.

The first real attempt (`compose-v0.1.0`) surfaced two real bugs since
this had never actually been built before: `gradlew` was committed without
its Unix executable bit (Windows/NTFS has no such concept, `git
update-index --chmod=+x` fixed it), and `Button.kt` was missing `import
androidx.compose.runtime.getValue` needed for a `by` delegate on
`State<Boolean>` to resolve, plus a JVM-target mismatch between Kotlin (11)
and AGP's own javac step (still defaulting to 1.8). All fixed in
`compose-v0.1.2`.

## Artwork credit and licensing

The code in this package is MIT. The **icon artwork is not**: it is
[UIcons by Flaticon](https://www.flaticon.com/uicons), used under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and modified
(exported from the Figma Community file and renamed to semantic English
names). The attribution is embedded in the generated `SnackyIcons.kt` and
the full statement ships as `NOTICE`. If you redistribute the icons, keep
that credit with them.

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
  against Figma (node `386:10909`, page "Tab") via a screenshot: the active
  label is a distinct, darker value (#b08224) from the underline (#f8b732)
  - all three had the same color repeated for both instead of two
  different ones. Also nudged Component Source's Kotlin sample (uses
  Material3's own `TabRow`, a different visual paradigm) toward the same
  distinction, lower confidence since it's illustrative-only.

  Re-verified in a later pass, prompted by the same kind of Figma misread
  the Section component had: the active label's real bound variable is
  `text/on-action/text-on-action-tertiary` (`--text-on-action-tertiary` in
  react-ui, `SnackyColor.textOnActionTertiary` here), not the raw
  `primary-700` primitive first assumed - same #b08224 value, but the
  correct semantic token, the same one Tertiary buttons use for their
  default label. The underline's own bound variable turned out to be
  `border/input/border-input-active` (an input-focus token, same #f8b732
  value) - read as incidental Figma variable reuse rather than an
  intentional shared role, so it stays on the primitive `color-primary-500`
  /`Primary.c500` rather than adopting a misleading semantic name.

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

- `SnackyOrderListItem`/`SnackyNotificationListItem` (`src/commonMain/kotlin/com/snacky/ui/components/list/List.kt`),
  mirroring `packages/react-ui`'s `List.tsx`/`List.css` (`OrderListItem`/
  `NotificationListItem`). `SnackyOrderListItem`'s layout, CTA (reuses
  `SnackyButton`, matching react-ui reusing its own `Button`), and the COD
  chip / payment-deadline banner are all driven by `status`
  (Waiting/Process/ProcessCod/Shipped/Received/Cancelled).
  `SnackyNotificationListItem` gets an accent-tinted background when
  `unread`.

  Spot-checked against Figma (node `8695:6485`, page "List") during this
  port: card shadow/radius and the notification border/unread-highlight
  colors all matched exactly, no bugs this time - react-ui's own README
  already documents this component as cross-checked directly against its
  Figma component set in an earlier session, and this re-check confirms
  that held up.

- `SnackyBottomSheet` (`src/commonMain/kotlin/com/snacky/ui/components/modal/BottomSheet.kt`),
  the shared modal shell every documented Modal "variant" (Welcome,
  Success, Confirmation, Calendar, Variants Selector, Payment Methods,
  Buyer Reviews, Driver Tracking) composes from. 20dp radius on top
  corners only, dim overlay backdrop (`bgOverlayDim`), dismiss on backdrop
  click. Built on `androidx.compose.ui.window.Dialog`. Mirrors
  `packages/react-ui`'s `BottomSheet.tsx`/`BottomSheet.css`.

  Found and fixed a real bug in react-ui's `BottomSheet.tsx` while porting:
  confirmed against Figma (node `8681:8211`, page "Modal") by checking all
  9 documented variants' node trees plus a screenshot, none of them ever
  show a drag-handle bar - react-ui defaulted to showing one (`hideHandle
  = false`). Renamed to `showHandle`, defaulting to `false`, so a future
  variant can opt in rather than every existing one opting out (no other
  file in the repo referenced the old prop name).

  Also confirmed, but not something to "fix": the padding-bottom/gap-
  between-blocks values genuinely differ per real variant (Welcome's gap
  is 32dp, Calendar's is 24dp, others 16dp; several variants get their
  trailing 24dp spacing from their own button-row's own padding rather
  than the shell), so no single shell default reproduces all of them -
  `content`'s own spacing is expected to override the shell's default
  `SnackyLayout.block` gap when a composition needs something else,
  matching how react-ui already treats it.

- `SnackySection` (`src/commonMain/kotlin/com/snacky/ui/components/section/Section.kt`),
  the shared shell wrapping the app's composite content blocks (variant
  selector, product description, buyer reviews, horizontal/vertical product
  groups, order summary, etc). Mirrors `packages/react-ui`'s
  `Section.tsx`/`Section.css`.

  The "see more" action button's chevron icon is `textPrimary` (#333333),
  confirmed against Figma (node `8877:8885`, page "Section", component set
  `351:7830`) by reading the chevron vector's own bound variable
  (`text/text-primary`) directly. An earlier pass of this port misread the
  icon *instance's* separate, unrelated white frame fill as the icon color
  and briefly "fixed" `react-ui`'s originally-correct `textOnActionPrimary`
  (same #333333 value, different token name) to white across `Section.css`,
  `index.html`'s Live Preview, and this file - caught from a phone
  screenshot of the real rendered dark chevron and reverted everywhere.
  Landed on `--text-primary` rather than restoring the original
  `--text-on-action-primary` string, since that's the variable Figma
  actually binds here, even though both resolve to the same hex value. This
  button is bespoke to `Section` (a hand-rolled inline SVG/`Canvas` shape,
  like react-ui's own), not the shared `IconButton` component.

  Also confirmed, but not something to "fix": shell padding is
  content-dependent in some real variants (Figma's "Variant" variant has 0
  horizontal padding at the shell level, with the header itself owning the
  24dp instead) - a content-composition pattern like `BottomSheet`'s
  per-variant spacing, not a shell bug.

  `index.html`'s Spec-tab and Component Source panels for Section describe
  an older/fictional API (`actionLabel` text-link buttons, no circular
  chevron affordance) that predates the real `Section.tsx` and doesn't
  match it at all - flagged here rather than silently rewritten, since
  fixing it means redoing all 16 documented variants' code samples, out of
  scope for this specific color-bug pass.

- The `Input` family (`src/commonMain/kotlin/com/snacky/ui/components/input/`),
  six composables mirroring `packages/react-ui`'s six-file `Input/` split
  exactly: `SnackyTextField` + `SnackyPasswordField` (`TextField.kt`),
  `SnackySearchField`, `SnackyOtpField`, `SnackyChatInput`,
  `SnackyCopyField`, `SnackyAddressResult`.

  `SnackyTextField` is the shared 48dp field behind the Text, Password,
  Dropdown, Date Picker and Address variants - the variant is expressed
  through slots and flags rather than an enum, the same way react-ui's
  `TextField.tsx` does it (Dropdown/Date Picker pass a `trailingIcon` plus
  `readOnly = true`, Address passes a `leadingIcon`).

  This is the first component ported under the workflow change from
  re-verifying each one against Figma to porting directly from
  `index.html`/`react-ui`, which are already confirmed pixel-perfect. All
  values come from react-ui's verified CSS, including the details its own
  comments flag as deliberate: `SearchField`'s fixed 260dp -> 312dp width
  animation on focus (not a fluid field), `OtpField`'s hand-tuned 46sp line
  height rather than the h3Bold token's 36sp, and `ChatInput`'s send button
  staying fully transparent with a muted icon when empty instead of
  rendering as a greyed-out disabled circle.

  Four deliberate deviations from the web version, all forced by platform
  differences rather than chosen:
  - react-ui gets its focus ring from CSS `:focus-within`, which has no
    Compose equivalent, so focus is tracked via each field's own
    `MutableInteractionSource`.
  - `error` there is `boolean | string`; Kotlin has no union type, so it
    splits into `isError` and `errorMessage`, a non-null message implying
    the error state.
  - `SnackyCopyField` cannot write to the clipboard itself (Compose
    Multiplatform has no common clipboard API), so the copy is delegated to
    an `onCopy` callback - wire it to `LocalClipboardManager` on Android or
    `UIPasteboard` on iOS. The "Copied" label feedback is still owned by the
    component, so it behaves identically either way.
  - Icons are caller-supplied composable slots throughout (eye toggle,
    chevron, calendar, marker, search, clear, send), since this package
    ships no icon set, the same gap `Avatar` and `Illustration` already have.

- The `Banner` family (`src/commonMain/kotlin/com/snacky/ui/components/banner/Banner.kt`),
  five composables mirroring `packages/react-ui`'s five-export `Banner.tsx`
  exactly: `SnackyHeroBanner`, `SnackySquareBanner`, `SnackyFullWidthBanner`,
  `SnackyPointBalanceBanner`, `SnackyAlertBanner`.

  The three image banners ship no image loader (same gap `Avatar` has), so
  `content` is whatever image composable you already use - they own the frame
  only: Hero gets `radius-field` + elevation, Square pins the documented
  360:334 ratio at `radius-bubble`, Full-width pins 360:176 with no radius or
  elevation since it runs edge to edge. Hero's height stays caller-owned
  because react-ui sets only `width: 100%` on it with no aspect ratio, unlike
  the other two.

  `SnackyPointBalanceBanner`'s border and divider use the raw `primary-500`
  primitive rather than a semantic token, matching react-ui exactly - there is
  no semantic "accent outline" token in this system, and inventing a binding
  Figma does not carry is what produced the mislabels fixed earlier in this
  package. Its divider uses `IntrinsicSize.Min` + `fillMaxHeight()`, the
  Compose equivalent of the CSS `align-self: stretch` it replaces, rather than
  a hardcoded height.

  One small addition over react-ui: the "Points"/"Balance" captions are
  parameters instead of hardcoded English strings, so the component stays
  usable in a localised app.

- The `Icon` set (`src/commonMain/kotlin/com/snacky/ui/components/icon/`),
  `SnackyIcon` plus a `SnackyIcons.Outline` / `SnackyIcons.Solid` namespace:
  **42 Outline + 11 Solid, exported from the real Figma icon components**
  (`Icon-outline` node `55:2062`, `Icon-solid` node `8772:5851`).

  `SnackyIcons.kt` is generated from `../../assets/icons/icons.json` by
  `../../scripts/generate-icons.js` (never hand-edit it), the same source and
  the same script that generate `packages/react-ui`'s `outline.tsx`/`solid.tsx`
  - so the two platforms cannot drift from each other or from Figma. Parity was
  verified by diffing every path and viewBox in both generated outputs against
  the source: 52/52 exact on both sides.

  Two things worth knowing about the real set, both different from what the
  earlier hand-drawn placeholder assumed:
  - **Both styles are filled.** Outline icons are filled outline shapes with
    the weight baked into the path, not stroked paths, so there is no stroke
    width to configure.
  - **The set is not uniform.** Icons are authored at 16, 20 or 24 units
    depending on where they are used (navbar at 20, buttons and general UI at
    24, compact input affordances at 16), so each icon carries its own
    viewBox and `size` defaults to that natural size.

  Rendering uses Compose's own `PathParser` on the SVG path strings, with
  `PathFillType.EvenOdd` where Figma set `fill-rule="evenodd"` (Help and
  Logout rely on it to knock holes out of their shapes). `tint` defaults to
  the ambient `LocalContentColor`, so an icon dropped into a slot on
  `SnackyIconButton`, `SnackyTextField`, `SnackyChatInput` etc. picks up that
  component's own resolved icon color automatically.

  Three icons are named for what they actually draw rather than their Figma
  property value, confirmed by rendering the exported geometry: Figma's `cod`
  is a delivery truck (`truck`, not a banknote), `list` is a right chevron
  (`chevronRight`), and the two `password` states are a crossed-out and an
  open eye (`eyeOff`/`eye`). Indonesian property values are translated
  (`riwayat` -> `history`, `akun` -> `account`, `Saldo` -> `balance`,
  `poin` -> `points`, `NoHP` -> `smartphone`, `Ganti pass` -> `key`).

- `SnackyIllustration` (`src/commonMain/kotlin/com/snacky/ui/components/illustration/Illustration.kt`),
  the five documented spot illustrations for empty states, onboarding and
  confirmations, each an `IllustrationVariant` carrying the fixed canvas size
  Figma authors it at (268x200, 360x240, 200x200, 200x200, 268x200). Mirrors
  `packages/react-ui`'s `Illustration.tsx`.

  Ships NO artwork, deliberately: `content` is whatever image composable you
  already use, and this owns only the variant's footprint. That is the normal
  split (Material, Radix and Chakra ship none either) - the documented canvas
  size is the part that belongs in a design system, and the Snacky artwork
  itself is modified stock that is not ours to redistribute.

  ```kotlin
  SnackyIllustration(IllustrationVariant.Empty) {
      Image(
          painter = painterResource(Res.drawable.illus_empty),
          contentDescription = "No products found",
      )
  }
  ```

  Any image composable works - `painterResource` from Compose Multiplatform
  resources, Coil's `AsyncImage` for a remote URL, a raw `Image(bitmap = ...)`.
  For bundled artwork, `composeResources/drawable/` is the idiomatic home: it
  works on Android and iOS, and unlike generated `ImageVector` Kotlin it does
  not compile a large illustration into code (the Snacky `create-account`
  artwork alone is 376 vector paths, which would make for a punishing source
  file and a slow build).

  **Where to get artwork that fits:** [Open Peeps](https://www.openpeeps.com/)
  is CC0 (public domain - no attribution, no restrictions), the easiest
  drop-in. [unDraw](https://undraw.co/) needs no attribution and allows
  commercial use, but its licence forbids redistributing the assets "in
  packs", so use it inside your own app rather than re-publishing it in a
  library of your own. Check the licence yourself before shipping either way.

- `SnackyProductImage` (`src/commonMain/kotlin/com/snacky/ui/components/productimage/ProductImage.kt`),
  a product photo frame that adapts to where it appears (`ProductCard` 128dp,
  `ProductDetails` 200dp, `List` 56dp, `Review` 48dp, `Variant` 88dp,
  `AccordionModal` 24dp for a payment-method logo), with an optional centred
  "Sold Out" scrim. Mirrors `packages/react-ui`'s
  `ProductImage.tsx`/`ProductImage.css`. Image loading is a `content` slot,
  same as `Avatar`/`Banner`/`Illustration`.

  Found and fixed a real bug in react-ui's `ProductImage.css` while porting:
  the component builds its class name as `--${usage}`, but the stylesheet
  spelled the first two rules `--card`/`--details` instead of
  `--product-card`/`--product-details`. Those two usages, the 128px card
  image and the 200px detail image (the two most common ones), therefore
  matched no rule at all and rendered completely unsized. Fixed by renaming
  the selectors, which leaves the public `usage` API unchanged.

  One value stays raw on purpose: the sold-out scrim is a literal white-at-46%
  in the source CSS with no token behind it, so it is not mapped onto a token
  that would not actually describe it. The label's own background does have
  one (`bgOverlayDim`).

- `SnackyProductCard` / `SnackyProductCardDetails`
  (`src/commonMain/kotlin/com/snacky/ui/components/productcard/ProductCard.kt`),
  the 152dp card used in carousels and 2-column grids, and the product detail
  page header with its rating count and Favorite/Share/Chat actions. Composes
  `SnackyDiscountTag`, `SnackySoldOutBadge` and `SnackyIconButton`, mirroring
  react-ui reusing its own `DiscountTag`/`SoldOutBadge`/`IconButton`.

  One structural deviation: react-ui models the two variants as a
  discriminated union on a single component, because their prop sets genuinely
  differ (list has `onAddToCart`, details has `ratingCount` and three social
  actions). Kotlin has no equivalent, and collapsing them into one composable
  with nullable parameters would let callers construct states that cannot
  exist, so this splits into two composables. The rendered output matches
  react-ui's two branches exactly.

  Two smaller notes: the rating star is tinted by the component
  (`primary-500`, matching react-ui's `.snacky-product-card__rating-icon`)
  rather than left to the caller, even though the icon itself is a slot; and
  the details variant's three action buttons use `SnackyIconButton`'s own
  Secondary elevation, since react-ui's slightly softer `0 4px 4px` shadow has
  no equivalent in Compose's blur-less `Modifier.shadow`.

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
