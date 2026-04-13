/// <reference types="../vendor/continuum-engine.d.ts" />

import ContinuumEngine from "#continuum/engine.js"
import type { Subscription } from "#continuum/eventemitter.js"

const engine = new ContinuumEngine()
const listeners: Set<(engine: ContinuumEngine) => void> = new Set()

engine.createCurrency("trees", 0)
engine.createCurrency("gold", 0)

function onTick () {
  engine.onTick(new Date())
  listeners.forEach(listener => listener(engine))
}

function subscribe (listener: (engine: ContinuumEngine) => void): Subscription {
  listeners.add(listener)
  return () => unsubscribe(listener)
}

function unsubscribe (listener: (engine: ContinuumEngine) => void) {
  listeners.delete(listener)
}

setInterval(onTick, 0) // process ticks as fast as possible

setInterval(() => {
  engine.currencies["trees"].incrementBy(0.1)
}, 250)

export default {
  subscribe,
  unsubscribe,
  engine,
}