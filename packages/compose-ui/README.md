# compose-ui

Kotlin Multiplatform / Compose Multiplatform implementation of the Snacky App
design system, the Compose counterpart to `@snacky/ui`
([packages/react-ui](../react-ui)). Sourced from the same
`../../tokens.json` / `../../components.json` that trace back to Figma
(file key `4Uh4Y1fPQXu2hwq0vEXHXd`).

## Status: 1 of 22 components

Design tokens, plus `Button` (see below). Kotlin Multiplatform library
targeting `androidTarget` and iOS (`iosX64`, `iosArm64`,
`iosSimulatorArm64`), with Compose Multiplatform wired in as a dependency.

Not published yet. Once it is, published via [JitPack](https://jitpack.io)
(builds straight from this Git repo on a tag, no registry account or
publish step on our side), the coordinates will be something like:

```kotlin
// settings.gradle.kts
dependencyResolutionManagement {
    repositories {
        maven("https://jitpack.io")
    }
}

// build.gradle.kts
implementation("com.github.rezatresnas:snacky-design-system:compose-v0.1.0")
```

The exact artifact coordinate (whether it resolves at the repo level like
above, or needs the module-qualified form
`com.github.rezatresnas.snacky-design-system:compose-ui:compose-v0.1.0`)
isn't confirmed yet, this repo has never actually been built by JitPack.
Check [jitpack.io/#rezatresnas/snacky-design-system](https://jitpack.io/#rezatresnas/snacky-design-system)
after the first tag to see the coordinate it actually generated.

### Publishing to JitPack, what's left

Unlike Maven Central, JitPack needs no account, no signing, no secrets: it
builds directly from the tagged commit the first time someone requests that
version. What's still needed:

1. A Gradle wrapper committed at `packages/compose-ui/gradlew` (see
   "Building" below), JitPack's default fallback without one is a very old
   Gradle version that can't build a modern Compose Multiplatform project.
2. A tag: bump `version` in `gradle.properties`, commit,
   `git tag compose-v0.1.0 && git push --tags` (the `compose-v` prefix, not
   `v`, is so it doesn't collide with `packages/react-ui`'s npm-release
   tags on the same repo).

That's it, no repo secrets to configure. See [../../jitpack.yml](../../jitpack.yml)
for the build command JitPack runs (it points at this subfolder, since the
buildable Gradle project isn't at the repo root).

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
  package grows a `SnackyTheme` that can supply one globally, that's the
  next piece of shared infrastructure worth building once a second component
  needs it too.

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

This module has not been compiled or opened in Android Studio yet (no
JDK/Gradle/Android SDK was available in the environment it was scaffolded
in), so treat the Gradle setup as unverified until you build it once. There
is also no Gradle wrapper checked in: open this folder directly in Android
Studio (File > Open > `packages/compose-ui`), it will generate `gradlew`,
`gradlew.bat`, and `gradle/wrapper/` on first sync, commit those once they
appear. Or run `gradle wrapper --gradle-version 8.9` yourself if you already
have Gradle installed. Either way, this same wrapper is what JitPack's build
uses (see `install:` in [../../jitpack.yml](../../jitpack.yml)).

## Keeping this in sync

If `tokens.json` changes (after running
`node ../../scripts/generate-agent-files.js`):

```bash
node ../../scripts/generate-compose-tokens.js
```
