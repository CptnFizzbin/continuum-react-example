# Project Structure

This document walks through every directory in the project and explains what belongs where.

---

## Directory overview

```
incremental-game/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
│
├── lib/            ← non-UI logic
├── ui/             ← React components & styles
├── vendor/         ← third-party code not on npm
├── public/         ← static assets served as-is
└── docs/           ← you are here
```

---

## `lib/` — non-UI logic

Everything that isn't a React component lives here: the game engine singleton,
custom hooks, utilities, data helpers, etc.

The rule of thumb is: **if you could run it in Node.js without a DOM, it probably belongs in `lib/`.**

| File              | Purpose                                                                                                       |
|-------------------|---------------------------------------------------------------------------------------------------------------|
| `engine.ts`       | Creates and owns the `ContinuumEngine` singleton, runs the game tick, and exposes a subscribe/unsubscribe API |
| `useGameState.ts` | The `useGameEngine` React hook — bridges the engine to React's rendering cycle                                |

> **Path alias:** import from `#lib/` instead of writing relative paths.
> ```ts
> import { useGameEngine } from "#lib/useGameState.ts"
> ```

---

## `ui/` — React components and styles

All React components (`.tsx`) and their associated styles live here.

| File                    | Purpose                                                                                              |
|-------------------------|------------------------------------------------------------------------------------------------------|
| `main.tsx`              | App entry point — mounts `<App />` into the DOM                                                      |
| `App.tsx`               | Root component                                                                                       |
| `CurrentGold.tsx`       | Displays the current gold value; reads a primitive from the engine via `useGameEngine`               |
| `CurrentTrees.tsx`      | Displays the current tree count (floored); another primitive selector example                        |
| `GoldClicker.tsx`       | Button that manually increments gold; reads the `Currency` object (a stable reference) via `useGameEngine` |
| `App.css` / `index.css` | Global and component-level styles                                                                    |
| `assets/`               | Images and SVGs imported directly by components                                                      |

> **Path alias:** import from `#ui/` instead of writing relative paths.
> ```ts
> import { CurrentGold } from "#ui/CurrentGold.tsx"
> ```

---

## `vendor/` — third-party code not on npm

The [Continuum Engine](../vendor/continuum-engine/README.md) isn't published to npm, so its source lives here directly.

| Path                    | Purpose                                                     |
|-------------------------|-------------------------------------------------------------|
| `continuum-engine/`     | Engine source code (JavaScript)                             |
| `continuum-engine.d.ts` | **TypeScript type declarations for the engine** — see below |

### `continuum-engine.d.ts` — type declarations

The engine is written in plain JavaScript, which means TypeScript has no idea what
types its classes and methods use. `continuum-engine.d.ts` is a **declaration file**
that fills that gap: it describes the shape of every class, method, and event the
engine exposes without containing any runtime code.

You'll see it referenced at the top of `lib/engine.ts`:

```ts
/// <reference types="../vendor/continuum-engine.d.ts" />
```

Think of it as a TypeScript-readable README for the engine's public API. If you add a
new engine feature or change a method signature, update this file so the rest of the
codebase stays in sync.

> **Path alias:** engine modules are imported via `#continuum/`.
> ```ts
> import ContinuumEngine from "#continuum/engine.js"
> ```

---

## `public/` — static assets

Files here are served directly at the root URL with no processing by Vite.
Use this for things like favicons (`/favicon.svg`) or sprite sheets (`/icons.svg`)
that are referenced by URL rather than imported in code.

---

## Path aliases

Rather than writing fragile relative paths (`../../lib/whatever`), the project defines
three short aliases. They're configured in both `vite.config.ts` (for the dev server
and bundler) and `tsconfig.app.json` (for the TypeScript compiler).

| Alias          | Resolves to                        |
|----------------|------------------------------------|
| `#lib/*`       | `lib/*`                            |
| `#ui/*`        | `ui/*`                             |
| `#continuum/*` | `vendor/continuum-engine/src/js/*` |


