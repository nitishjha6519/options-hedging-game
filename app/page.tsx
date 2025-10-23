"use client"

import { useState } from "react"
import GameSelection from "@/components/game-selection"
import LandInsuranceGame from "@/components/land-insurance-game"
import PortfolioHedgingGame from "@/components/portfolio-hedging-game"

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<"selection" | "land" | "portfolio">("selection")

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {selectedGame === "selection" && <GameSelection onSelectGame={setSelectedGame} />}

      {selectedGame === "land" && <LandInsuranceGame onBack={() => setSelectedGame("selection")} />}

      {selectedGame === "portfolio" && <PortfolioHedgingGame onBack={() => setSelectedGame("selection")} />}
    </main>
  )
}
