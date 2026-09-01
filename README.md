# Snacky App Design System

Design system for **Snacky**, a snack e-commerce mobile app - targeting Kotlin
Compose Multiplatform and React.

**Live site:** https://rezatresnas.github.io/snacky-design-system/

![Snacky app screens](assets/images/showcase-mockup.png)

## What's in this repo

| Path | What it is |
|---|---|
| [`index.html`](index.html) | The interactive doc site itself - visual specs with measurement overlays, live Figma embeds, and an editable React playground per component. 24 components across Actions, Forms, Navigation, Content, and Assets, plus foundation tokens (color, typography, spacing, radius, sizing, shadow). |
| [`packages/react-ui`](packages/react-ui) | `@snacky/ui` on npm - a real, installable React implementation of all 24 components, styled entirely from the design tokens. |
| [`packages/compose-ui`](packages/compose-ui) | The Kotlin Multiplatform / Compose Multiplatform counterpart, all 24 components, published via JitPack. Generated from the same source as the React package, so the two cannot drift apart. |
| [`design-system-prompt.md`](design-system-prompt.md) | Condensed copy-paste prompt for AI tools that take a text prompt instead of reading files or running npm (v0, Bolt, Lovable, Claude Artifacts). |

`tokens.json` also lives at the repo root, but it's an internal build
intermediate (`scripts/generate-agent-files.js` produces it from `index.html`,
and the token-CSS/Kotlin generators for both packages read it in turn) rather
than a file meant to be read directly - see `CLAUDE.md` if you're touching the
generator pipeline itself.

## Using the components

**React** - published at [npmjs.com/package/@snacky/ui](https://www.npmjs.com/package/@snacky/ui):

```bash
npm install @snacky/ui
```

```tsx
import '@snacky/ui/styles.css';
import { Button, TextField, Checkbox } from '@snacky/ui';
```

**Compose Multiplatform** - published via [JitPack](https://jitpack.io/#rezatresnas/snacky-design-system):

```kotlin
// settings.gradle.kts -> repositories
maven("https://jitpack.io")

// build.gradle.kts
implementation("com.github.rezatresnas:snacky-design-system:compose-v1.2.2")
```

See [`packages/react-ui/README.md`](packages/react-ui/README.md) for the full
component list, verification status, and known gaps.

## Using this with an AI tool

- **A coding agent building a separate project** (Claude Code, Cursor, Codex,
  an IDE's built-in agent, or "Create using Claude Code" in Claude Design):
  just tell it to install the real package - `npm install @snacky/ui` or the
  JitPack coordinate above. That's the whole integration; the agent gets real,
  verified components plus their README/type-level docs, not an
  AI-reconstructed guess at this design system's values. There's no need to
  point it at this repo at all unless it's specifically working *on* the
  design system itself, not just using it.
- **Takes a prompt but can't read files or run a package manager** (v0, Bolt,
  Lovable's chat box, Claude Artifacts): paste
  [`design-system-prompt.md`](design-system-prompt.md) into its prompt/system-
  context box instead - the one path here that still needs a repo file, since
  these tools have no other way to receive the design system's values.

## Roadmap

- [x] Publish `@snacky/ui` to npm
- [x] Kotlin Compose Multiplatform component package, published via JitPack
- [x] Full icon set - all 42 Outline + 11 Solid, exported from Figma's real
      icon components (CC BY 4.0, see [NOTICE](NOTICE))

## License

[MIT](LICENSE) (c) rezatresnas
