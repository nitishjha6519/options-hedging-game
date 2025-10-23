"use client"

import { useState } from "react"

export default function OptionsTrading({ onBuyPut, onSellPut, marketPrice, options, mode = "buy" }) {
  const [selectedSellStrike, setSelectedSellStrike] = useState(1500)

  const calculatePremium = (strikePrice) => {
    const distance = ((marketPrice - strikePrice) / marketPrice) * 100
    // Premium decreases as strike gets further OTM (more distance)
    // Base premium 225000, minus 15000 per percentage point OTM
    return Math.max(50000, Math.round(225000 - Math.abs(distance) * 15000))
  }

  const formatINR = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${(amount / 1000).toFixed(0)}K`
  }

  const strikeOptions = [
    { strike: 95, label: "5% OTM (Cheaper, Less Protection)" },
    { strike: 90, label: "10% OTM (Balanced)" },
    { strike: 85, label: "15% OTM (Expensive, More Protection)" },
  ]

  const sellStrikeOptions = [
    { strike: 1500, label: "₹1,500 (5% OTM)" },
    { strike: 1450, label: "₹1,450 (10% OTM)" },
    { strike: 1400, label: "₹1,400 (15% OTM)" },
  ]

  const handleBuyPut = (strike) => {
    const premium = calculatePremium(strike)
    onBuyPut(strike, premium)
  }

  const handleSellPut = () => {
    const premium = calculatePremium(selectedSellStrike)
    onSellPut(selectedSellStrike, premium)
  }

  if (mode === "buy") {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold mb-2">Buy PUT Option (Insurance)</h2>
        <p className="text-slate-400 mb-6">Choose how much protection you want for your portfolio</p>

        {!options.putBought ? (
          <div className="space-y-3">
            {strikeOptions.map((option) => (
              <button
                key={option.strike}
                onClick={() => handleBuyPut(option.strike)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded transition text-sm font-semibold"
              >
                <div className="flex justify-between items-center">
                  <span>Strike Price: {option.strike}</span>
                  <span className="text-blue-200">Premium: {formatINR(calculatePremium(option.strike))}</span>
                </div>
                <div className="text-xs text-blue-200 mt-2">{option.label}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-900 border border-emerald-700 rounded p-4">
            <p className="text-emerald-200 font-semibold">✅ PUT Option Purchased!</p>
            <p className="text-emerald-300 text-sm mt-2">Strike Price: {options.putBought.strikePrice}</p>
            <p className="text-emerald-300 text-sm">Premium Paid: {formatINR(options.putBought.premium)}</p>
            <p className="text-emerald-300 text-xs mt-2 italic">
              Your portfolio is now protected below {options.putBought.strikePrice}
            </p>
          </div>
        )}
      </div>
    )
  }

  if (mode === "sell") {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold mb-2">Sell PUT Options (Earn Premium)</h2>
        <p className="text-slate-400 mb-6">Sell PUT options on HDFC Bank to offset your insurance cost</p>

        <div className="space-y-4">
          <div className="space-y-2 mb-4">
            <p className="text-slate-300 text-sm font-semibold">Select Strike Price for HDFC Bank:</p>
            {sellStrikeOptions.map((option) => (
              <button
                key={option.strike}
                onClick={() => setSelectedSellStrike(option.strike)}
                className={`w-full py-2 px-3 rounded text-sm transition ${
                  selectedSellStrike === option.strike
                    ? "bg-amber-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{option.label}</span>
                  <span className="text-amber-200">Premium: {formatINR(calculatePremium(option.strike))}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleSellPut}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 px-4 rounded transition font-semibold"
          >
            Sell PUT at ₹{selectedSellStrike} (Earn {formatINR(calculatePremium(selectedSellStrike))})
          </button>

          {options.putSold.length > 0 && (
            <div className="bg-slate-700 rounded p-4">
              <p className="text-amber-300 font-semibold text-sm mb-3">Sold Options:</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {options.putSold.map((put, idx) => (
                  <div key={idx} className="text-amber-200 text-sm bg-slate-600 rounded p-2">
                    Option #{idx + 1}: Strike ₹{put.strikePrice} → +{formatINR(put.premium)}
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-500 mt-3 pt-3">
                <p className="text-amber-300 font-semibold text-sm">Total Earned: {formatINR(options.premiumEarned)}</p>
                <p className="text-amber-200 text-xs mt-2">
                  Net Cost: {formatINR(options.premiumPaid - options.premiumEarned)}
                </p>
              </div>
            </div>
          )}

          {options.putSold.length > 0 && (
            <div
              className={`rounded p-3 ${options.putSold.length > 2 ? "bg-red-900 border border-red-700" : "bg-orange-900 border border-orange-700"}`}
            >
              <p className={`text-sm font-semibold ${options.putSold.length > 2 ? "text-red-200" : "text-orange-200"}`}>
                {options.putSold.length > 2 ? "⚠️ HIGH RISK" : "⚠️ MEDIUM RISK"}
              </p>
              <p className={`text-xs mt-1 ${options.putSold.length > 2 ? "text-red-300" : "text-orange-300"}`}>
                You've sold {options.putSold.length} PUT options. If HDFC crashes 50%, you could lose{" "}
                {formatINR(options.putSold.length * 2500000 - options.premiumEarned)}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
