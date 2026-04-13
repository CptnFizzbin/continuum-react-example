import type { FC } from "react"
import { useGameEngine } from "#lib/useGameState.ts"

export const CurrentTrees: FC = () => {
  const trees = useGameEngine(engine => {
    return Math.floor(engine.currencies["trees"].value)
  })

  return (
    <div>
      <h2>Current Trees: {trees}</h2>
    </div>
  )
}