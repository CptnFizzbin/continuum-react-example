import "./App.css"
import { CurrentGold } from "#ui/CurrentGold.tsx"
import { GoldClicker } from "#ui/GoldClicker.tsx"
import { CurrentTrees } from "#ui/CurrentTrees.tsx"

function App () {
  return (
    <div>
      <GoldClicker />
      <CurrentGold />
      <CurrentTrees />
    </div>
  )
}

export default App
