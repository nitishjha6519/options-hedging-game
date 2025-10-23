"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PortfolioDashboard from "@/components/portfolio-dashboard";
import OptionsTrading from "@/components/options-trading";

interface PortfolioHedgingGameProps {
  onBack: () => void;
}

export default function PortfolioHedgingGame({
  onBack,
}: PortfolioHedgingGameProps) {
  const [stage, setStage] = useState(1);
  const [gameState, setGameState] = useState("intro");
  const [portfolio, setPortfolio] = useState({
    initialCapital: 5000000,
    currentValue: 5000000,
    gain: 0,
    gainPercent: 0,
  });
  const [marketPrice, setMarketPrice] = useState(100);
  const [options, setOptions] = useState({
    putBought: null,
    putSold: [],
    premiumPaid: 0,
    premiumEarned: 0,
  });
  const [maxDrawdown, setMaxDrawdown] = useState(0);
  const [marketCrash, setMarketCrash] = useState(0);
  const [riskWarnings, setRiskWarnings] = useState([]);

  const formatINR = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const crashTimer = setTimeout(() => {
      // Trigger crash after 5 seconds
      setMarketPrice(70); // 30% crash
    }, 5000);

    return () => clearTimeout(crashTimer);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setMarketPrice((prev) => {
        // If already crashed, continue with smaller movements
        if (prev <= 70) {
          const change = (Math.random() - 0.5) * 1;
          return Math.max(50, prev + change);
        }
        // Before crash, random normal movements
        const change = (Math.random() - 0.48) * 2;
        return Math.max(50, prev + change);
      });
    }, 300);

    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const priceChange = ((marketPrice - 100) / 100) * 100;
    const newValue = portfolio.initialCapital * (1 + priceChange / 100);

    let protectedValue = newValue;

    if (options.putBought) {
      const strikePrice = options.putBought.strikePrice;
      if (marketPrice < strikePrice) {
        // Accurate payoff: (Strike - Market) × (Portfolio / 100)
        const payoff =
          (strikePrice - marketPrice) * (portfolio.initialCapital / 100);
        protectedValue = newValue + payoff;
      }
    }

    protectedValue -= options.premiumPaid;
    protectedValue += options.premiumEarned;

    setPortfolio({
      ...portfolio,
      currentValue: protectedValue,
      gain: protectedValue - portfolio.initialCapital,
      gainPercent:
        ((protectedValue - portfolio.initialCapital) /
          portfolio.initialCapital) *
        100,
    });

    const drawdown = ((100 - marketPrice) / 100) * 100;
    const maxLoss = Math.max(0, drawdown - (options.putBought ? 10 : 0));
    setMaxDrawdown(maxLoss);
    setMarketCrash(drawdown);
  }, [marketPrice, gameState]);

  const handleBuyPut = (strikePrice, premium) => {
    setOptions({
      ...options,
      putBought: { strikePrice, premium },
      premiumPaid: options.premiumPaid + premium,
    });
  };

  const handleSellPut = (strikePrice, premium) => {
    const newPutsSold = [...options.putSold, { strikePrice, premium }];
    const newPremiumEarned = options.premiumEarned + premium;

    const totalRisk = newPutsSold.length * 500000;
    const potentialLoss = totalRisk - newPremiumEarned;

    if (newPutsSold.length > 1) {
      setRiskWarnings([
        ...riskWarnings,
        {
          id: Date.now(),
          message: `You've sold ${
            newPutsSold.length
          } PUT options. If market crashes 50%, you could lose ${formatINR(
            potentialLoss
          )}!`,
          severity: newPutsSold.length > 2 ? "high" : "medium",
        },
      ]);
    }

    setOptions({
      ...options,
      putSold: newPutsSold,
      premiumEarned: newPremiumEarned,
    });
  };

  const handleStartStage = (stageNum) => {
    setStage(stageNum);
    setGameState("playing");
    setMarketPrice(100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 text-slate-400 hover:text-black"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Games
      </Button>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Portfolio Hedging Strategy</h1>
        <p className="text-slate-400">
          Protect your Indian stock portfolio using PUT options
        </p>
      </header>

      {/* Stage 1: See the Problem */}
      {stage === 1 && gameState === "intro" && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">Stage 1: The Problem</h2>
            <div className="space-y-4">
              <p className="text-lg">
                You have a portfolio worth {formatINR(5000000)} (Reliance, TCS,
                Infosys) that's up 35% this year. Great job!
              </p>
              <div className="bg-slate-900 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 mb-2">Portfolio Value</p>
                    <p className="text-4xl font-bold text-emerald-400">
                      {formatINR(5000000)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-2">Gain This Year</p>
                    <p className="text-4xl font-bold text-emerald-400">+35%</p>
                  </div>
                </div>
              </div>
              <p className="text-slate-300">
                But what if Nifty 50 crashes? Let's see what happens to an
                unprotected portfolio...
              </p>
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3">
                <p className="text-blue-200 text-sm">
                  Watch the graph for 5 seconds. After that, the market will
                  crash 30%. See how your portfolio drops!
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleStartStage(1)}
            className="w-full bg-red-500 hover:bg-red-600 py-6 text-lg"
          >
            Simulate Market Crash
          </Button>
        </div>
      )}

      {stage === 1 && gameState === "playing" && (
        <div className="space-y-6">
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
            <p className="text-red-300 font-bold">
              WARNING: Portfolio is unprotected! Watch what happens...
            </p>
            <p className="text-red-200 text-sm mt-2">
              Market will crash in a few seconds...
            </p>
          </div>

          <PortfolioDashboard
            portfolio={portfolio}
            marketPrice={marketPrice}
            maxDrawdown={maxDrawdown}
            marketCrash={marketCrash}
            options={options}
          />

          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">What You're Seeing:</h3>
            <p className="text-slate-300 mb-2">
              <span className="font-bold text-white">
                Maximum Loss (Drawdown):
              </span>{" "}
              This is the biggest loss from your highest point. If your
              portfolio was {formatINR(5000000)} and drops to{" "}
              {formatINR(3500000)}, your maximum loss is {formatINR(1500000)}{" "}
              (30%).
            </p>
            <p className="text-slate-300 mb-4">
              As Nifty 50 drops, your portfolio value drops with it. Without
              protection, you could lose all your gains!
            </p>
            {marketCrash > 5 && (
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-4">
                <p className="text-red-300 font-bold">CRASH HAPPENING NOW!</p>
                <p className="text-red-200 text-sm mt-2">
                  Your portfolio dropped from {formatINR(5000000)} to{" "}
                  {formatINR(portfolio.currentValue)}
                </p>
                <p className="text-red-200 text-sm mt-1">
                  Loss: {formatINR(5000000 - portfolio.currentValue)} (
                  {marketCrash.toFixed(1)}%)
                </p>
              </div>
            )}
            <Button
              onClick={() => {
                setGameState("intro");
                setStage(2);
                setMarketPrice(100);
                setPortfolio({
                  initialCapital: 5000000,
                  currentValue: 5000000,
                  gain: 0,
                  gainPercent: 0,
                });
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 py-4"
            >
              Continue to Stage 2: Buy Protection
            </Button>
          </div>
        </div>
      )}

      {/* Stage 2: Buy PUT (ONLY buying, no selling) */}
      {stage === 2 && gameState === "intro" && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">Stage 2: Buy Protection</h2>
            <div className="space-y-4">
              <p className="text-lg">
                Now let's protect your portfolio with a PUT option on Nifty 50
                (insurance).
              </p>
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                <p className="text-slate-300">
                  <span className="font-bold text-white">How it works:</span>{" "}
                  You pay a premium (around {formatINR(225000)}) to buy a PUT
                  option on Nifty 50. If Nifty crashes below your strike price,
                  the PUT option pays you the difference.
                </p>
                <p className="text-slate-300 mt-2">
                  <span className="font-bold text-white">Example:</span> If you
                  buy a PUT at 95 strike and Nifty drops to 70, you get paid for
                  the 25-point difference.
                </p>
              </div>
              <p className="text-slate-300">
                This caps your maximum loss while keeping unlimited upside
                potential.
              </p>
            </div>
          </div>

          <Button
            onClick={() => handleStartStage(2)}
            className="w-full bg-blue-500 hover:bg-blue-600 py-6 text-lg"
          >
            Start Trading
          </Button>
        </div>
      )}

      {stage === 2 && gameState === "playing" && (
        <div className="space-y-6">
          <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
            <p className="text-blue-300 font-bold">
              STAGE 2: Buy PUT Option to Protect Your Portfolio
            </p>
            <p className="text-blue-200 text-sm mt-1">
              Choose your protection level
            </p>
          </div>

          <PortfolioDashboard
            portfolio={portfolio}
            marketPrice={marketPrice}
            maxDrawdown={maxDrawdown}
            marketCrash={marketCrash}
            options={options}
          />

          <OptionsTrading
            onBuyPut={handleBuyPut}
            onSellPut={handleSellPut}
            marketPrice={marketPrice}
            options={options}
            mode="buy"
          />

          {options.putBought && (
            <Button
              onClick={() => {
                setGameState("intro");
                setStage(3);
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 py-4"
            >
              Continue to Stage 3: Why Sell PUTs?
            </Button>
          )}
        </div>
      )}

      {/* Stage 3: Explainer (NEW STAGE) */}
      {stage === 3 && gameState === "intro" && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">
              Stage 3: Why Sell PUT Options?
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                <p className="text-slate-300 mb-3">
                  <span className="font-bold text-white">The Problem:</span> You
                  paid {formatINR(options.premiumPaid)} for insurance. That
                  reduces your profits!
                </p>
              </div>

              <div className="bg-amber-900/30 border border-amber-500 rounded-lg p-4">
                <p className="text-slate-300 mb-3">
                  <span className="font-bold text-white">The Solution:</span>{" "}
                  Sell PUT options on stocks like HDFC Bank or Infosys to earn
                  premiums back. This offsets your insurance cost.
                </p>
                <p className="text-slate-300 mb-3">
                  <span className="font-bold text-white">
                    Why you're okay with this:
                  </span>{" "}
                  If HDFC Bank crashes and you have to buy it, you wanted to own
                  HDFC Bank anyway. You can hold it long-term and benefit from
                  the lower price.
                </p>
              </div>

              <div className="bg-emerald-900/30 border border-emerald-500 rounded-lg p-4">
                <p className="text-slate-300 mb-2">
                  <span className="font-bold text-white">Example:</span>
                </p>
                <ul className="text-slate-300 space-y-1 text-sm">
                  <li>• You sell a PUT on HDFC Bank at ₹1,500 strike price</li>
                  <li>• You earn ₹50,000 premium (money in your pocket)</li>
                  <li>• If HDFC crashes to ₹1,200, you buy it at ₹1,500</li>
                  <li>
                    • Your effective cost = ₹1,500 - ₹500 (premium per share) =
                    ₹1,000
                  </li>
                  <li>• You got it cheaper than the original ₹1,600!</li>
                </ul>
              </div>

              <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
                <p className="text-slate-300 mb-2">
                  <span className="font-bold text-white">The Risk:</span> If you
                  sell too many PUTs and the market crashes heavily, you might
                  have to buy multiple stocks at high prices.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleStartStage(4)}
            className="w-full bg-amber-500 hover:bg-amber-600 py-6 text-lg"
          >
            Continue to Stage 4: Sell PUTs
          </Button>
        </div>
      )}

      {/* Stage 4: Sell PUT (ONLY selling, no buying) */}
      {stage === 4 && gameState === "intro" && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">
              Stage 4: Sell PUT Options
            </h2>
            <div className="space-y-4">
              <p className="text-lg">
                Now let's sell PUT options to earn premiums and offset your
                insurance cost.
              </p>
              <div className="bg-amber-900/30 border border-amber-500 rounded-lg p-4">
                <p className="text-slate-300">
                  <span className="font-bold text-white">How it works:</span>{" "}
                  You sell PUT options on stocks you want to own. If those
                  stocks crash, you get paid the difference.
                </p>
                <p className="text-slate-300 mt-2">
                  <span className="font-bold text-white">Example:</span> If you
                  sell a PUT on HDFC Bank at ₹1,500 strike and it crashes to
                  ₹1,200, you get paid ₹300 per share.
                </p>
              </div>
              <p className="text-slate-300">
                This reduces your effective purchase price and offsets your
                insurance cost.
              </p>
            </div>
          </div>

          <Button
            onClick={() => handleStartStage(4)}
            className="w-full bg-amber-500 hover:bg-amber-600 py-6 text-lg"
          >
            Start Selling PUTs
          </Button>
        </div>
      )}

      {stage === 4 && gameState === "playing" && (
        <div className="space-y-6">
          <div className="bg-amber-900/30 border border-amber-500 rounded-lg p-4">
            <p className="text-amber-300 font-bold">
              STAGE 4: Sell PUT Options to Offset Your Insurance Cost
            </p>
            <p className="text-amber-200 text-sm mt-1">
              You can sell multiple times, but each sale increases your risk!
            </p>
          </div>

          {riskWarnings.length > 0 && (
            <div className="space-y-2">
              {riskWarnings.map((warning) => (
                <div
                  key={warning.id}
                  className={`rounded-lg p-4 border-2 ${
                    warning.severity === "high"
                      ? "bg-red-900/50 border-red-500"
                      : "bg-orange-900/50 border-orange-500"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        warning.severity === "high"
                          ? "text-red-400"
                          : "text-orange-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div>
                      <p
                        className={`font-bold ${
                          warning.severity === "high"
                            ? "text-red-300"
                            : "text-orange-300"
                        }`}
                      >
                        {warning.severity === "high"
                          ? "HIGH RISK WARNING"
                          : "RISK WARNING"}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          warning.severity === "high"
                            ? "text-red-200"
                            : "text-orange-200"
                        }`}
                      >
                        {warning.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <PortfolioDashboard
            portfolio={portfolio}
            marketPrice={marketPrice}
            maxDrawdown={maxDrawdown}
            marketCrash={marketCrash}
            options={options}
          />

          <OptionsTrading
            onBuyPut={handleBuyPut}
            onSellPut={handleSellPut}
            marketPrice={marketPrice}
            options={options}
            mode="sell"
          />

          <Button
            onClick={() => {
              setGameState("intro");
              setStage(5);
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 py-4"
          >
            Continue to Stage 5: See Protection Work
          </Button>
        </div>
      )}

      {/* Stage 5: See Protection Work (renamed from Stage 4) */}
      {stage === 5 && gameState === "intro" && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">
              Stage 5: Watch Your Protection Work
            </h2>
            <div className="space-y-4">
              <p className="text-lg">
                Now let's see how your hedging strategy performs during a market
                crash.
              </p>
              <div className="bg-emerald-900/30 border border-emerald-500 rounded-lg p-4">
                <p className="text-slate-300 mb-2">
                  <span className="font-bold text-white">What you'll see:</span>
                </p>
                <p className="text-slate-300">
                  <span className="font-bold text-white">
                    WITHOUT Protection:
                  </span>{" "}
                  Portfolio drops from {formatINR(5000000)} to{" "}
                  {formatINR(3500000)} (30% loss)
                </p>
                <p className="text-slate-300 mt-2">
                  <span className="font-bold text-white">WITH Protection:</span>{" "}
                  Your PUT option kicks in and saves you! Maximum loss is capped
                  at around 10%.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleStartStage(5)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 py-6 text-lg"
          >
            Start Final Simulation
          </Button>
        </div>
      )}

      {stage === 5 && gameState === "playing" && (
        <div className="space-y-6">
          <div className="bg-emerald-900/30 border border-emerald-500 rounded-lg p-4">
            <p className="text-emerald-300 font-bold">
              FINAL STAGE: Watch your protection work as market moves
            </p>
            <p className="text-emerald-200 text-sm mt-1">
              Notice how your Maximum Loss is capped even when market crashes!
            </p>
            <p className="text-emerald-200 text-sm mt-2">
              Watch for 5 seconds. The market will crash 30%, but your PUT
              option will protect you!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-lg p-6 border-2 border-red-500">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">❌</span>
                <h3 className="font-bold text-lg">WITHOUT Protection</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">
                    If Market Crashes 30%
                  </p>
                  <p className="text-3xl font-bold text-red-400">
                    {formatINR(3500000)}
                  </p>
                  <p className="text-sm text-red-300 mt-1">
                    Lost {formatINR(1500000)}
                  </p>
                </div>
                <div className="bg-red-900/30 rounded p-3">
                  <p className="text-xs text-red-200">
                    <span className="font-bold">Maximum Loss:</span> 30% (
                    {formatINR(1500000)})
                  </p>
                  <p className="text-xs text-red-200 mt-1">
                    All your yearly gains wiped out!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border-2 border-emerald-500">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✅</span>
                <h3 className="font-bold text-lg">WITH Protection</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">
                    If Market Crashes 30%
                  </p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {formatINR(portfolio.currentValue)}
                  </p>
                  <p className="text-sm text-emerald-300 mt-1">
                    Lost only {formatINR(5000000 - portfolio.currentValue)}
                  </p>
                </div>
                <div className="bg-emerald-900/30 rounded p-3">
                  <p className="text-xs text-emerald-200">
                    <span className="font-bold">Maximum Loss:</span>{" "}
                    {maxDrawdown.toFixed(1)}% (
                    {formatINR(5000000 - portfolio.currentValue)})
                  </p>
                  <p className="text-xs text-emerald-200 mt-1">
                    PUT option saved you{" "}
                    {formatINR(Math.abs(3500000 - portfolio.currentValue))}!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {options.putBought && marketCrash > 5 && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="font-bold text-lg mb-4 text-emerald-300">
                Calculation Breakdown
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                  <span className="text-slate-300">
                    Initial Portfolio Value
                  </span>
                  <span className="font-bold text-white">
                    {formatINR(5000000)}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                  <span className="text-slate-300">
                    Market Crash Effect (30%)
                  </span>
                  <span className="font-bold text-red-400">
                    -{formatINR(1500000)}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                  <span className="text-slate-300">Portfolio After Crash</span>
                  <span className="font-bold text-white">
                    {formatINR(3500000)}
                  </span>
                </div>

                <div className="border-t border-slate-600 pt-3 mt-3">
                  <p className="text-slate-400 mb-2 font-semibold">
                    PUT Option Protection:
                  </p>
                  <div className="flex justify-between items-center bg-emerald-900/30 p-3 rounded mb-2">
                    <span className="text-slate-300">Strike Price</span>
                    <span className="font-bold text-emerald-300">
                      {options.putBought.strikePrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-emerald-900/30 p-3 rounded mb-2">
                    <span className="text-slate-300">Market Price</span>
                    <span className="font-bold text-emerald-300">
                      {marketPrice.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-emerald-900/30 p-3 rounded mb-2">
                    <span className="text-slate-300">
                      PUT Payoff ({options.putBought.strikePrice} -{" "}
                      {marketPrice.toFixed(0)}) × (₹50L / 100)
                    </span>
                    <span className="font-bold text-emerald-400">
                      +
                      {formatINR(
                        (options.putBought.strikePrice - marketPrice) * 50000
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-600 pt-3 mt-3">
                  <p className="text-slate-400 mb-2 font-semibold">
                    Premium Adjustments:
                  </p>
                  <div className="flex justify-between items-center bg-slate-700 p-3 rounded mb-2">
                    <span className="text-slate-300">
                      Premium Paid (Insurance Cost)
                    </span>
                    <span className="font-bold text-red-400">
                      -{formatINR(options.premiumPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                    <span className="text-slate-300">
                      Premium Earned (Selling PUTs)
                    </span>
                    <span className="font-bold text-emerald-400">
                      +{formatINR(options.premiumEarned)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-emerald-600 pt-3 mt-3 bg-emerald-900/20 p-4 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-300 font-bold">
                      Final Portfolio Value
                    </span>
                    <span className="font-bold text-emerald-400 text-lg">
                      {formatINR(portfolio.currentValue)}
                    </span>
                  </div>
                  <p className="text-emerald-300 text-xs mt-2">
                    Savings vs Unprotected:{" "}
                    {formatINR(portfolio.currentValue - 3500000)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <PortfolioDashboard
            portfolio={portfolio}
            marketPrice={marketPrice}
            maxDrawdown={maxDrawdown}
            marketCrash={marketCrash}
            options={options}
          />

          {marketCrash > 5 && (
            <div className="bg-emerald-900/30 border border-emerald-500 rounded-lg p-4">
              <p className="text-emerald-300 font-bold">PROTECTION WORKING!</p>
              <p className="text-emerald-200 text-sm mt-2">
                Market crashed {marketCrash.toFixed(1)}%, but your portfolio is
                protected!
              </p>
              <p className="text-emerald-200 text-sm mt-1">
                Current value: {formatINR(portfolio.currentValue)} (Maximum
                loss: {maxDrawdown.toFixed(1)}%)
              </p>
              <p className="text-emerald-200 text-sm mt-1 font-bold">
                Your PUT option saved you{" "}
                {formatINR(Math.abs(3500000 - portfolio.currentValue))}!
              </p>
            </div>
          )}

          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4">Strategy Summary:</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-700 rounded p-4">
                <p className="text-slate-400 text-sm">Protection Bought</p>
                <p className="text-xl font-bold text-blue-400">
                  {options.putBought
                    ? `Strike: ${options.putBought.strikePrice}`
                    : "None"}
                </p>
              </div>
              <div className="bg-slate-700 rounded p-4">
                <p className="text-slate-400 text-sm">PUTs Sold</p>
                <p className="text-xl font-bold text-amber-400">
                  {options.putSold.length}
                </p>
              </div>
              <div className="bg-slate-700 rounded p-4">
                <p className="text-slate-400 text-sm">Net Cost</p>
                <p className="text-xl font-bold text-emerald-400">
                  {formatINR(options.premiumPaid - options.premiumEarned)}
                </p>
              </div>
            </div>

            <div className="bg-emerald-900/30 border border-emerald-500 rounded-lg p-4">
              <h4 className="font-bold text-emerald-300 mb-2">
                What You Learned:
              </h4>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>
                  1. Unprotected portfolios can lose all gains in a market crash
                </li>
                <li>
                  2. PUT options cap your maximum loss while keeping upside
                  potential
                </li>
                <li>
                  3. Selling PUTs on stocks you want to own offsets insurance
                  costs
                </li>
                <li>4. Selling too many PUTs increases risk significantly</li>
                <li>
                  5. The premium you earn reduces your effective purchase price
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="py-4 bg-transparent"
              >
                Back to Games
              </Button>
              <Button
                onClick={() => {
                  setStage(1);
                  setGameState("intro");
                  setMarketPrice(100);
                  setPortfolio({
                    initialCapital: 5000000,
                    currentValue: 5000000,
                    gain: 0,
                    gainPercent: 0,
                  });
                  setOptions({
                    putBought: null,
                    putSold: [],
                    premiumPaid: 0,
                    premiumEarned: 0,
                  });
                  setRiskWarnings([]);
                }}
                className="bg-blue-500 hover:bg-blue-600 py-4"
              >
                Play Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mt-8 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full ${
              s <= stage ? "bg-emerald-500" : "bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
