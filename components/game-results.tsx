"use client"

export default function GameResults({ portfolio, options, maxDrawdown, onRestart }) {
  const netPremium = options.premiumEarned - options.premiumPaid
  const finalGain = portfolio.gain
  const isSuccessful = maxDrawdown < 15 && finalGain > 0

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
        <h2 className="text-3xl font-bold mb-2">{isSuccessful ? "🎉 Great Strategy!" : "📊 Game Over"}</h2>
        <p className="text-slate-400 mb-8">Here's how you performed:</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-700 rounded p-4">
            <p className="text-slate-400 text-sm">Final Portfolio Value</p>
            <p className="text-2xl font-bold text-blue-400">${(portfolio.currentValue / 1000000).toFixed(2)}M</p>
            <p className={`text-sm ${finalGain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {finalGain >= 0 ? "+" : ""}${(finalGain / 1000).toFixed(0)}K
            </p>
          </div>

          <div className="bg-slate-700 rounded p-4">
            <p className="text-slate-400 text-sm">Max Drawdown</p>
            <p className={`text-2xl font-bold ${maxDrawdown < 15 ? "text-emerald-400" : "text-red-400"}`}>
              {maxDrawdown.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-400">{maxDrawdown < 15 ? "Well protected!" : "High risk"}</p>
          </div>

          <div className="bg-slate-700 rounded p-4">
            <p className="text-slate-400 text-sm">Premium Paid</p>
            <p className="text-2xl font-bold text-red-400">-${options.premiumPaid.toLocaleString()}</p>
          </div>

          <div className="bg-slate-700 rounded p-4">
            <p className="text-slate-400 text-sm">Premium Earned</p>
            <p className="text-2xl font-bold text-emerald-400">+${options.premiumEarned.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-slate-700 rounded p-4 mb-8">
          <p className="text-slate-400 text-sm">Net Premium Impact</p>
          <p className={`text-3xl font-bold ${netPremium >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {netPremium >= 0 ? "+" : ""}${netPremium.toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-900 border border-blue-700 rounded p-4 mb-8 text-left">
          <h3 className="font-semibold text-blue-200 mb-2">What You Learned</h3>
          <ul className="text-blue-100 text-sm space-y-2">
            <li>✓ PUT options provide downside protection (insurance)</li>
            <li>✓ You pay premiums for this protection</li>
            <li>✓ Selling PUT options can offset insurance costs</li>
            <li>✓ Hedging caps downside while preserving upside</li>
          </ul>
        </div>

        <button
          onClick={onRestart}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
