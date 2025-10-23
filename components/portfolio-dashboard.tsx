"use client";

import { useState, useEffect } from "react";

export default function PortfolioDashboard({
  portfolio,
  marketPrice,
  maxDrawdown,
  marketCrash,
  options,
}) {
  const [chartData, setChartData] = useState([
    {
      time: 0,
      value: portfolio.initialCapital,
      protected: portfolio.initialCapital,
    },
  ]);

  useEffect(() => {
    setChartData((prev) => [
      ...prev,
      {
        time: prev.length,
        value: portfolio.currentValue,
        protected: portfolio.currentValue,
      },
    ]);
  }, [portfolio.currentValue]);

  const renderChart = () => {
    if (chartData.length < 2) return null;

    const maxValue = Math.max(
      ...chartData.map((d) => d.value),
      portfolio.initialCapital * 1.1
    );
    const minValue = Math.min(
      ...chartData.map((d) => d.value),
      portfolio.initialCapital * 0.6
    );
    const range = maxValue - minValue || 1;

    const width = 600;
    const height = 300;
    const padding = 40;

    const points = chartData.map((d, i) => {
      const x =
        padding + (i / (chartData.length - 1 || 1)) * (width - 2 * padding);
      const y =
        height -
        padding -
        ((d.value - minValue) / range) * (height - 2 * padding);
      return { x, y };
    });

    const pathData = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    const crashStartIndex = Math.max(0, chartData.length - 15);
    const crashStartX =
      padding +
      (crashStartIndex / (chartData.length - 1 || 1)) * (width - 2 * padding);

    return (
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
      >
        {marketCrash > 5 && (
          <>
            <defs>
              <linearGradient
                id="crashGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <rect
              x={crashStartX}
              y={padding}
              width={width - padding - crashStartX}
              height={height - 2 * padding}
              fill="url(#crashGradient)"
            />
            <line
              x1={crashStartX}
              y1={padding}
              x2={crashStartX}
              y2={height - padding}
              stroke="#dc2626"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
          </>
        )}

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={`grid-${ratio}`}
            x1={padding}
            y1={height - padding - ratio * (height - 2 * padding)}
            x2={width - padding}
            y2={height - padding - ratio * (height - 2 * padding)}
            stroke="#475569"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
        ))}

        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#94a3b8"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#94a3b8"
          strokeWidth="2"
        />

        <path
          d={pathData}
          fill="none"
          stroke={options.putBought ? "#10b981" : "#3b82f6"}
          strokeWidth="3"
        />

        {[0, 0.5, 1].map((ratio) => (
          <text
            key={`label-${ratio}`}
            x={padding - 10}
            y={height - padding - ratio * (height - 2 * padding) + 5}
            textAnchor="end"
            fontSize="12"
            fill="#94a3b8"
          >
            ₹{((minValue + ratio * range) / 100000).toFixed(0)}L
          </text>
        ))}

        {marketCrash > 5 && (
          <g>
            <rect
              x={width / 2 - 80}
              y={padding + 5}
              width="160"
              height="30"
              fill="#dc2626"
              rx="4"
            />
            <text
              x={width / 2}
              y={padding + 25}
              textAnchor="middle"
              fontSize="14"
              fill="white"
              fontWeight="bold"
            >
              CRASH: {marketCrash.toFixed(1)}%
            </text>
          </g>
        )}
      </svg>
    );
  };

  const isProtected = options.putBought !== null;
  const netPremium = options.premiumEarned - options.premiumPaid;

  const formatINR = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 flex flex-col gap-1">
      <h2 className="text-2xl font-bold mb-6 ">Portfolio Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-20">
        <div className="bg-slate-700 rounded p-4">
          <p className="text-slate-400 text-xs uppercase tracking-wide">
            Market Index
          </p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {marketPrice.toFixed(2)}
          </p>
          <p
            className={`text-sm font-semibold mt-1 ${
              marketCrash > 0 ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {marketCrash > 0 ? "📉 -" : "📈 +"}
            {marketCrash.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-500 mt-1">Started at 100</p>
        </div>

        <div className="bg-slate-700 rounded p-4">
          <p className="text-slate-400 text-xs uppercase tracking-wide">
            Portfolio Value
          </p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {formatINR(portfolio.currentValue)}
          </p>
          <p
            className={`text-sm font-semibold mt-1 ${
              portfolio.gainPercent >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {portfolio.gainPercent >= 0 ? "+" : ""}
            {portfolio.gainPercent.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-500 mt-1">Started at ₹50L</p>
        </div>

        <div
          className={`rounded p-4 ${
            isProtected
              ? "bg-emerald-900 border border-emerald-700"
              : "bg-slate-700"
          }`}
        >
          <p className="text-slate-400 text-xs uppercase tracking-wide">
            Maximum Loss
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
              isProtected ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {maxDrawdown.toFixed(1)}%
          </p>
          <p
            className={`text-xs font-semibold mt-1 ${
              isProtected ? "text-emerald-300" : "text-slate-400"
            }`}
          >
            {isProtected ? "🛡️ Protected" : "⚠️ Unprotected"}
          </p>
        </div>

        <div className="bg-slate-700 rounded p-4">
          <p className="text-slate-400 text-xs uppercase tracking-wide">
            Net Premium
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
              netPremium >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {netPremium >= 0 ? "+" : ""}
            {formatINR(Math.abs(netPremium))}
          </p>
          <p className="text-xs text-slate-500 mt-1">Earned - Paid</p>
        </div>
      </div>

      {/* <div className="bg-slate-700 rounded p-4 mt-16 border border-red-600">
        <h3 className="font-semibold mb-4">Portfolio Value Over Time</h3>
        {renderChart()}
      </div> */}
      <div className="bg-slate-700 rounded pt-14 ">
        <h3 className="font-semibold mb-6 ">Portfolio Value Over Time</h3>
        <div className="bg-slate-800 rounded-lg p-6">{renderChart()}</div>
      </div>

      {options.putBought && (
        <div className="bg-emerald-900 border border-emerald-700 rounded p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-200 font-semibold">
                ✓ Protection Active
              </p>
              <p className="text-emerald-300 text-sm mt-1">
                PUT option at <strong>{options.putBought.strikePrice}</strong>{" "}
                protects you if market falls below this price
              </p>
              <p className="text-emerald-300 text-sm mt-1">
                Premium paid:{" "}
                <strong>{formatINR(options.putBought.premium)}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {!options.putBought && (
        <div className="bg-amber-900 border border-amber-700 rounded p-4">
          <p className="text-amber-200 font-semibold">⚠️ No Protection</p>
          <p className="text-amber-300 text-sm mt-1">
            Your portfolio is exposed to market crashes. Buy a PUT option to
            protect your gains!
          </p>
        </div>
      )}
    </div>
  );
}
