# Snacky App Design System

Design system for **Snacky**, a snack e-commerce mobile app - targeting Kotlin
Compose Multiplatform and React. Every documented value traces back to a real
Figma node (file key `4Uh4Y1fPQXu2hwq0vEXHXd`), extracted and verified rather
than estimated.

**Live site:** https://rezatresnas.github.io/snacky-design-system/

![Snacky app screens](assets/images/showcase-mockup.png)

## What's in this repo

| Path | What it is |
|---|---|
| [`index.html`](index.html) | The interactive doc site itself - visual specs with measurement overlays, live Figma embeds, and an editable React playground per component. 22 components across Actions, Forms, Navigation, Content, and Assets, plus foundation tokens (color, typography, spacing, radius, sizing, shadow). |
| [`tokens.json`](tokens.json) | All design tokens in [W3C Design Tokens](https://design-tokens.github.io/community-group/format/) format. |
| [`components.json`](components.json) | Every component's variants/states with real spec values and working Kotlin (Compose Multiplatform) + React (TSX) code samples. |
| [`packages/react-ui`](packages/react-ui) | `@snacky/ui` on npm - a real, installable React implementation of all 22 components, styled entirely from the tokens above. |
| [`packages/compose-ui`](packages/compose-ui) | The Kotlin Multiplatform / Compose Multiplatform counterpart, all 22 components, published via JitPack. Generated from the same source as the React package, so the two cannot drift apart. |
| [`llms.txt`](llms.txt) / [`AGENTS.md`](AGENTS.md) | Entry points for AI coding tools - point an agent here instead of scraping the HTML. |

`tokens.json` and `components.json` are generated from `index.html` by
[`scripts/generate-agent-files.js`](scripts/generate-agent-files.js) - never
hand-edited, always in sync with what a human sees on the site.

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
implementation("com.github.rezatresnas:snacky-design-system:compose-v1.0.1")
```

See [`packages/react-ui/README.md`](packages/react-ui/README.md) for the full
component list, verification status, and known gaps.

## Using this with an AI tool

Point it at [`llms.txt`](llms.txt) (or [`AGENTS.md`](AGENTS.md), same index in
the convention some agents look for by default) - it lists the
machine-readable token/component data and the installable package, so the
agent can build real UI instead of re-deriving values from screenshots.

## Roadmap

- [x] Publish `@snacky/ui` to npm
- [ ] Kotlin Compose Multiplatform component package
- [ ] Full icon set (currently a ~30-icon starter subset)

## License

[MIT](LICENSE) (c) rezatresnas
