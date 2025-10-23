"use client"

export default function EducationPanel() {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="space-y-4">
          <div className="bg-slate-700 rounded p-4 border-l-4 border-emerald-400">
            <h3 className="font-semibold text-emerald-400 mb-2">📊 Step 1: Build Your Portfolio</h3>
            <p className="text-slate-300 text-sm">
              You start with <strong>$1,000,000</strong> invested in stocks. Your portfolio is up <strong>35%</strong>{" "}
              in value. Now you're worried about a market crash and want to protect your gains.
            </p>
          </div>

          <div className="bg-slate-700 rounded p-4 border-l-4 border-blue-400">
            <h3 className="font-semibold text-blue-400 mb-2">🛡️ Step 2: Buy PUT Insurance</h3>
            <p className="text-slate-300 text-sm">
              You buy a <strong>PUT option</strong> (like insurance). If the market crashes below your chosen price, the
              PUT protects you. Cost: <strong>4.5% of portfolio</strong> (~$45,000).
            </p>
            <p className="text-slate-300 text-sm mt-2 italic">
              Think of it like car insurance - you pay a premium to protect against losses.
            </p>
          </div>

          <div className="bg-slate-700 rounded p-4 border-l-4 border-amber-400">
            <h3 className="font-semibold text-amber-400 mb-2">💰 Step 3: Sell PUT Options</h3>
            <p className="text-slate-300 text-sm">
              To offset the insurance cost, you sell PUT options on other stocks. Each sale earns you a premium. This
              reduces your net insurance cost.
            </p>
            <p className="text-slate-300 text-sm mt-2 italic">
              You can sell multiple PUT options to earn more premiums.
            </p>
          </div>

          <div className="bg-slate-700 rounded p-4 border-l-4 border-purple-400">
            <h3 className="font-semibold text-purple-400 mb-2">✨ Result: Protected Profits</h3>
            <p className="text-slate-300 text-sm">
              Your downside is capped at <strong>8% loss</strong> while you keep <strong>unlimited upside</strong>.
              You've successfully hedged your portfolio!
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-900 border border-blue-700 rounded p-4">
        <h3 className="font-semibold text-blue-200 mb-2">💡 What is Hedging?</h3>
        <p className="text-blue-100 text-sm">
          <strong>Hedging</strong> means trading some potential gains for protection against losses. It's a risk
          management strategy used by professional investors to sleep better at night while keeping their profits safe.
        </p>
      </div>

      <div className="bg-amber-900 border border-amber-700 rounded p-4">
        <h3 className="font-semibold text-amber-200 mb-2">⚠️ The Trade-off</h3>
        <p className="text-amber-100 text-sm">
          You pay premiums (insurance costs) to protect your portfolio. If the market doesn't crash, you "lose" the
          premium money. But if it does crash, you're protected!
        </p>
      </div>
    </div>
  )
}
