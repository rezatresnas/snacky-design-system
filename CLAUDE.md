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
- `scripts/generate-agent-files.js` - regenerates `tokens.json` and `components.json`
  straight from `index.html`'s source (bracket-matched literal extraction, not a
  hand transcription). Run it after any change to a foundation page's token data or
  to the `C` object:
  ```
  node scripts/generate-agent-files.js
  ```
  Treat this as a required step, not optional cleanup - if `index.html` changes and
  this isn't re-run, the two JSON files silently go stale.
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
  See `packages/react-ui/README.md` for known gaps (icon set is a starter subset,
  Illustration ships no artwork, etc).
- `packages/compose-ui/` - Kotlin Multiplatform / Compose Multiplatform counterpart
  to `packages/react-ui`, targeting `androidTarget` + iOS. Currently theme tokens
  only, no components yet. `src/commonMain/kotlin/com/snacky/ui/theme/Tokens.kt` is
  generated from `tokens.json` by `scripts/generate-compose-tokens.js` - run it after
  `generate-agent-files.js` whenever token values change:
  ```
  node scripts/generate-compose-tokens.js
  ```
  Not yet published: targeting Maven Central under the verified `io.github.rezatresnas`
  namespace, `.github/workflows/publish-compose-ui.yml` triggers on `compose-v*.*.*`
  tags but needs a GPG key + Central Portal token added as repo secrets first (see
  `packages/compose-ui/README.md`). Gradle setup is unverified end-to-end (no
  JDK/Gradle/Android SDK in the environment it was scaffolded in, no wrapper checked
  in - CI installs Gradle directly instead of via `./gradlew`).

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
  comments, generated files) - use a comma, colon, or parentheses instead.
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
