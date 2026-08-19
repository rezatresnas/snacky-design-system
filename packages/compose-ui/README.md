# compose-ui

Kotlin Multiplatform / Compose Multiplatform implementation of the Snacky App
design system, the Compose counterpart to `@snacky/ui`
([packages/react-ui](../react-ui)). Sourced from the same
`../../tokens.json` / `../../components.json` that trace back to Figma
(file key `4Uh4Y1fPQXu2hwq0vEXHXd`).

## Status: theme tokens only

This module currently ships **design tokens, no components yet**. It is a
Kotlin Multiplatform library targeting `androidTarget` and iOS
(`iosX64`, `iosArm64`, `iosSimulatorArm64`), with Compose Multiplatform wired
in as a dependency, ready for component work to start.

Not published yet. Once it is, the coordinates will be:

```kotlin
implementation("io.github.rezatresnas:snacky-ui:0.1.0")
```

### Publishing to Maven Central, what's left

The `io.github.rezatresnas` Central Portal namespace is verified (GitHub
sign-in, no domain needed) and `build.gradle.kts` already has the
`com.vanniktech.maven.publish` plugin + full POM wired in. Still needed
before [.github/workflows/publish-compose-ui.yml](../../.github/workflows/publish-compose-ui.yml)
can actually publish:

1. A GPG key pair for artifact signing (Maven Central requires every artifact
   signed - npm has no equivalent requirement), public key uploaded to
   `keys.openpgp.org`.
2. A Central Portal User Token (account settings, not your login password).
3. Four repo secrets from the above: `MAVEN_CENTRAL_USERNAME`,
   `MAVEN_CENTRAL_PASSWORD`, `SIGNING_IN_MEMORY_KEY` (armored private key),
   `SIGNING_IN_MEMORY_KEY_PASSWORD`.

To cut a release once that's done: bump `version` in `gradle.properties`,
commit, `git tag compose-v0.1.0 && git push --tags` (note the `compose-v`
prefix, not `v`, so it doesn't collide with `packages/react-ui`'s npm-release
tags on the same repo).

## What's here

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
is also no Gradle wrapper checked in: open the module in Android Studio (it
will generate one), or run `gradle wrapper --gradle-version 8.9` yourself if
you have Gradle installed.

## Keeping this in sync

If `tokens.json` changes (after running
`node ../../scripts/generate-agent-files.js`):

```bash
node ../../scripts/generate-compose-tokens.js
```
