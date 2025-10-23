"use client"

import { Button } from "@/components/ui/button"

interface GameSelectionProps {
  onSelectGame: (game: "land" | "portfolio") => void
}

export default function GameSelection({ onSelectGame }: GameSelectionProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 text-balance">Options Trading Learning Center</h1>
        <p className="text-xl text-slate-400 text-balance">Master options strategies through interactive games</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Game 1: Land Insurance (Basics) */}
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-blue-500 transition">
          <div className="mb-6">
            <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
              BEGINNER - START HERE
            </div>
            <h2 className="text-3xl font-bold mb-3">Land Insurance Game</h2>
            <p className="text-slate-400 mb-4">
              Learn PUT options basics through a simple land buying and selling game
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">1</span>
              </div>
              <p className="text-slate-300">What is a PUT option? (Insurance analogy)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">2</span>
              </div>
              <p className="text-slate-300">Buying PUT options (Protection)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">3</span>
              </div>
              <p className="text-slate-300">Selling PUT options (Earning premiums)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">4</span>
              </div>
              <p className="text-slate-300">Understanding risks and rewards</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-white">Duration:</span> 5-10 minutes
            </p>
            <p className="text-sm text-slate-400 mt-1">
              <span className="font-semibold text-white">Best for:</span> Complete beginners
            </p>
          </div>

          <Button
            onClick={() => onSelectGame("land")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 text-lg"
          >
            Start Learning
          </Button>
        </div>

        {/* Game 2: Portfolio Hedging (Advanced) */}
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-emerald-500 transition">
          <div className="mb-6">
            <div className="inline-block bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
              INTERMEDIATE
            </div>
            <h2 className="text-3xl font-bold mb-3">Portfolio Hedging Game</h2>
            <p className="text-slate-400 mb-4">Apply PUT options to protect a profitable stock portfolio</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">1</span>
              </div>
              <p className="text-slate-300">See unprotected portfolio crash</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">2</span>
              </div>
              <p className="text-slate-300">Buy PUT options for protection</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">3</span>
              </div>
              <p className="text-slate-300">Sell PUT options to offset costs</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">4</span>
              </div>
              <p className="text-slate-300">Watch protection work in market crash</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-white">Duration:</span> 10-15 minutes
            </p>
            <p className="text-sm text-slate-400 mt-1">
              <span className="font-semibold text-white">Best for:</span> After completing basics
            </p>
          </div>

          <Button
            onClick={() => onSelectGame("portfolio")}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 text-lg"
          >
            Start Strategy Game
          </Button>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-400 text-sm">
          Recommended: Complete the Land Insurance Game first to understand the basics
        </p>
      </div>
    </div>
  )
}
