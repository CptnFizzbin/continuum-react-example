/// <reference types="../vendor/continuum-engine.d.ts" />

import ContinuumEngine from "#continuum/engine.js"
import type { Subscription } from "#continuum/eventemitter.js"

const engine = new ContinuumEngine()
const listeners: Set<(engine: ContinuumEngine) => void> = new Set()

engine.createCurrency("gold", 0)

function onTick () {
  engine.onTick(new Date())

  engine.currencies["gold"].incrementBy(1)

  listeners.forEach(listener => listener(engine))
}

function subscribe (listener: (engine: ContinuumEngine) => void): Subscription {
  listeners.add(listener)
  return () => unsubscribe(listener)
}

function unsubscribe (listener: (engine: ContinuumEngine) => void) {
  listeners.delete(listener)
}

setInterval(onTick, 250)

export default {
  subscribe,
  unsubscribe,
  engine,
}