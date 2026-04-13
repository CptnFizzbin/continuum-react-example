# Incremental Game

A browser-based incremental/idle game built with **React 19**, **Vite**, and **TypeScript**, powered by
the [Continuum Engine](vendor/continuum-engine/README.md).

---

## Prerequisites

| Tool    | Version                                              |
|---------|------------------------------------------------------|
| Node.js | `^25.0.0`                                            |
| Yarn    | `4.x` (via [Corepack](https://yarnpkg.com/corepack)) |

> **New to Yarn 4?** It ships via Corepack. Enable it once:
> ```sh
> npm install -g corepack
> corepack enable
> ```

---

## Getting Started

```sh
# 1. Install dependencies
yarn install

# 2. Start the dev server (hot-reload included)
yarn dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Command        | Description                                            |
|----------------|--------------------------------------------------------|
| `yarn dev`     | Start the Vite dev server with HMR                     |
| `yarn build`   | Type-check then produce a production bundle in `dist/` |
| `yarn preview` | Serve the production build locally for testing         |
| `yarn lint`    | Run ESLint across the whole project                    |

---

## Project Structure

```
incremental-game/
├── index.html          # HTML entry point (Vite uses this)
├── lib/                # Non-UI logic (game engine, hooks, utilities)
├── ui/                 # React components and styles
├── vendor/             # Third-party code that isn't on npm
│   ├── continuum-engine/         # The game engine source
│   └── continuum-engine.d.ts    # TypeScript type declarations for the engine
├── public/             # Static assets served as-is
└── docs/               # Extended documentation
```

See [docs/project-structure.md](docs/project-structure.md) for a deeper breakdown,
and [docs/game-engine.md](docs/game-engine.md) for how the engine and React integration work.

---

## Tech Stack Quick Links

- [React](https://react.dev/) — UI library
- [Vite](https://vite.dev/) — Dev server and bundler
- [TypeScript](https://www.typescriptlang.org/docs/) — Type-safe JavaScript
- [Yarn](https://yarnpkg.com/) — Package manager

