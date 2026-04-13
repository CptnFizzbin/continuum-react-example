import type { FC } from "react"
import { useGameEngine } from "#lib/useGameState.ts"

export const GoldClicker: FC = () => {
  const goldCurrency = useGameEngine(engine => engine.currencies["gold"])

  return (
    <button
      className="counter"
      onClick={() => goldCurrency.incrementBy(1)}
    >
      Create Gold
    </button>
  )
}