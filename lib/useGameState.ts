import type ContinuumEngine from "#continuum/engine.js"
import { useSyncExternalStore } from "react"

import gameEngine from "./engine"

export function useGameEngine<TData> (selector: (engine: ContinuumEngine) => TData) {
  return useSyncExternalStore(gameEngine.subscribe, () => selector(gameEngine.engine))
}