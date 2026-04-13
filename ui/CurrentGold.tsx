import type { FC } from "react"
import { useGameEngine } from "#lib/useGameState.ts"

export const CurrentGold: FC = () => {
  const gold = useGameEngine(engine => engine.currencies["gold"].value)

  return (
    <div>
      <h2>Current Gold: {gold}</h2>
    </div>
  )
}