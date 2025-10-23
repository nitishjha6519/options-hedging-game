"use client"

export default function GameGuidance({ gameState, options, marketCrash }) {
  if (gameState !== "playing") return null

  const getGuidanceMessage = () => {
    if (!options.putBought) {
      return {
        title: "📍 Step 1: Buy Protection",
        message: "The market is moving. Buy a PUT option to protect your portfolio from crashes.",
        color: "bg-blue-900 border-blue-700",
        textColor: "text-blue-200",
      }
    }

    if (options.premiumEarned === 0) {
      return {
        title: "📍 Step 2: Offset Costs",
        message: "Great! Now sell PUT options to earn premiums and reduce your insurance cost.",
        color: "bg-amber-900 border-amber-700",
        textColor: "text-amber-200",
      }
    }

    if (marketCrash > 0) {
      return {
        title: "🎯 Protection in Action!",
        message: `The market crashed ${marketCrash.toFixed(1)}%! Your PUT option is protecting you from the full loss.`,
        color: "bg-emerald-900 border-emerald-700",
        textColor: "text-emerald-200",
      }
    }

    return {
      title: "✨ Strategy Active",
      message: "Your hedging strategy is working! Watch how your portfolio performs as the market moves.",
      color: "bg-purple-900 border-purple-700",
      textColor: "text-purple-200",
    }
  }

  const guidance = getGuidanceMessage()

  return (
    <div className={`${guidance.color} border rounded-lg p-4 mb-4`}>
      <h3 className={`font-semibold ${guidance.textColor} mb-1`}>{guidance.title}</h3>
      <p className={`text-sm ${guidance.textColor}`}>{guidance.message}</p>
    </div>
  )
}
