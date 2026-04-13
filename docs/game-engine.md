# Game Engine & React Integration

This document explains how the Continuum Engine is wired up and how React components
read live engine state without reinventing a state management system.

---

## How the engine works

The Continuum Engine is a tick-based game engine. Once per tick (every 250 ms by default)
it processes producers, updates currencies, and fires events.

The engine singleton lives in `lib/engine.ts`. It:

1. Creates the engine and sets up any currencies/producers the game needs.
2. Runs `engine.onTick()` on a fixed interval.
3. Maintains a set of **listeners** — functions that are called after every tick.

```ts
// lib/engine.ts (simplified)
const engine = new ContinuumEngine()
engine.createCurrency("gold", 0)

function onTick() {
  engine.onTick(new Date())
  engine.currencies["gold"].incrementBy(1)
  listeners.forEach(listener => listener(engine))
}

setInterval(onTick, 250)
```

The exported `subscribe` / `unsubscribe` functions let anything outside `engine.ts`
register as a listener.

---

## Connecting the engine to React — `useGameEngine`

React needs to know *when* to re-render. The engine doesn't know anything about React,
so `lib/useGameState.ts` acts as the bridge using React's built-in
[`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore) hook.

```ts
// lib/useGameState.ts
import { useSyncExternalStore } from "react"
import gameEngine from "./engine"

export function useGameEngine<TData>(selector: (engine: ContinuumEngine) => TData) {
  return useSyncExternalStore(gameEngine.subscribe, () => selector(gameEngine.engine))
}
```

`useSyncExternalStore` takes two things:
- **`subscribe`** — how to register/unregister for updates (the engine's subscriber API).
- **a snapshot function** — what value to read right now.

React calls the snapshot function after every tick and compares the result to the
previous value. If they're different, the component re-renders.

---

## Writing a selector

The selector is the function you pass to `useGameEngine`. It receives the full engine
and returns the specific piece of data the component cares about.

```ts
const gold = useGameEngine(engine => engine.currencies["gold"].value)
```

### ⚠️ Selectors must return primitives or stable references

React uses **referential equality** (`===`) to decide whether to re-render. This means:

| Return type                   | Safe? | Why                                        |
|-------------------------------|-------|--------------------------------------------|
| `number`, `string`, `boolean` | ✅     | Same value = no re-render                  |
| `null`, `undefined`           | ✅     | Same value = no re-render                  |
| A new `{}` or `[]` every call | ❌     | Always a new reference → always re-renders |
| A cached / immutable object   | ✅     | Same reference = no re-render              |

**Don't do this** — returns a new object every tick, causing the component to
re-render 4 times per second even if the values haven't changed:

```ts
// ❌ new object reference every tick
const stats = useGameEngine(engine => ({
  gold: engine.currencies["gold"].value,
  wood: engine.currencies["wood"].value,
}))
```

**Do this instead** — use one hook call per value, or memoize the object outside the selector:

```ts
// ✅ primitives — safe
const gold = useGameEngine(engine => engine.currencies["gold"].value)
const wood = useGameEngine(engine => engine.currencies["wood"].value)
```

---

## Examples

### `ui/CurrentGold.tsx` — primitive selector

```tsx
export const CurrentGold: FC = () => {
  const gold = useGameEngine(engine => engine.currencies["gold"].value)

  return <div><h2>Current Gold: {gold}</h2></div>
}
```

The selector returns a **number**, so React only re-renders when the gold value changes.

---

### `ui/CurrentTrees.tsx` — primitive selector with transformation

```tsx
export const CurrentTrees: FC = () => {
  const trees = useGameEngine(engine => Math.floor(engine.currencies["trees"].value))

  return <div><h2>Current Trees: {trees}</h2></div>
}
```

Flooring the value inside the selector is fine — it still returns a primitive. As a
bonus, React won't re-render for sub-integer changes (e.g. 1.1 → 1.7 both floor to 1).

---

### `ui/GoldClicker.tsx` — stable object reference

```tsx
export const GoldClicker: FC = () => {
  const goldCurrency = useGameEngine(engine => engine.currencies["gold"])

  return (
    <button className="counter" onClick={() => goldCurrency.incrementBy(1)}>
      Create Gold
    </button>
  )
}
```

Here the selector returns a `Currency` **object** rather than a primitive. This is safe
because the engine stores currencies in a plain record and never replaces the object —
every call to the selector returns the *same* reference. React sees `===` equality and
skips the re-render.

> **The gotcha:** if you did `engine => ({ ...engine.currencies["gold"] })` you'd get a
> *new* object on every tick and the component would re-render 4× per second. Always
> make sure an object selector returns a reference that's stable across ticks.

---

## Adding a new currency or producer

1. **Register it in `lib/engine.ts`** inside the setup block:
   ```ts
   engine.createCurrency("wood", 0)
   ```
   The project already has `gold` and `trees` set up as examples.

2. **Add its types to `vendor/continuum-engine.d.ts`** if you're using a feature the
   declaration file doesn't cover yet.

3. **Read it in a component** using `useGameEngine`:
   ```ts
   const wood = useGameEngine(engine => engine.currencies["wood"].value)
   ```

---

## Further reading

- [`useSyncExternalStore` — React docs](https://react.dev/reference/react/useSyncExternalStore)
- [Continuum Engine README](../vendor/continuum-engine/README.md)
- [Project Structure](./project-structure.md)



