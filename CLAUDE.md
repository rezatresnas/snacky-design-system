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
  (node `55:2062`) and `Icon-solid` (`8772:5851`) component sets: 42 outline + 10 solid,
  each with its own viewBox (the set is 16/20/24px, not uniform) and its SVG path data.
  **Never hand-edit.** `scripts/generate-icons.js` turns it into BOTH
  `packages/react-ui/src/icons/outline.tsx`/`solid.tsx` and compose-ui's
  `SnackyIcons.kt`, so the two platforms cannot drift from each other or from Figma:
  ```
  node scripts/generate-icons.js
  ```
  Note these are FILLED outline shapes, not stroked paths - the outline weight is baked
  into each shape, so there is no stroke width to set.
  The generator ALSO rewrites `index.html`'s own `const ICONS={...}` registry and the
  `const ICON_SET={...}` index the Icon playground gallery enumerates, so the site renders
  the same geometry the packages ship. Playground-only glyphs that are not part of the
  Figma icon sets (ratings star, timeline check/clock, deals, chat-driver) live in
  `assets/icons/legacy-extras.json` and are merged back in, and the older key names the
  playgrounds already pass to `ic()` (`fav-o`, `add-to-cart`, `dropdown`, `cod`, `saldo`,
  ...) are kept working as aliases - so never hand-edit that registry either.
- `assets/images/` - exported PNGs, one per documented variant/state, at 2x-4x scale
  depending on the component. Re-export from the matching Figma node (`download_assets`,
  `defaultFormat:'png'`) whenever a component's real fill/state changes, rather than
  leaving a screenshot showing an old value.
- `packages/react-ui/` - installable `@snacky/ui` npm package: real React
  implementations of all 22 documented components (not just doc samples), so an AI
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
  to `packages/react-ui`, targeting `androidTarget` + iOS. ALL 22 of 22 components ported
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
