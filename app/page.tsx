"use client";

import { useState } from "react";
import GameSelection from "@/components/game-selection";
import LandInsuranceGame from "@/components/land-insurance-game";
import PortfolioHedgingGame from "@/components/portfolio-hedging-game";
import { FaTelegramPlane } from "react-icons/fa";

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<
    "selection" | "land" | "portfolio"
  >("selection");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <a
        href="https://t.me/+73VqStzLLPZiZWY1"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 right-4 text-blue-400 hover:text-blue-500 transition-colors z-50"
      >
        <FaTelegramPlane size={30} />
      </a>

      {selectedGame === "selection" && (
        <GameSelection onSelectGame={setSelectedGame} />
      )}
      {selectedGame === "land" && (
        <LandInsuranceGame onBack={() => setSelectedGame("selection")} />
      )}
      {selectedGame === "portfolio" && (
        <PortfolioHedgingGame onBack={() => setSelectedGame("selection")} />
      )}
    </main>
  );
}
