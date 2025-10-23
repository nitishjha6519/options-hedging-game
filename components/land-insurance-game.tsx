"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LandInsuranceGameProps {
  onBack: () => void;
}

export default function LandInsuranceGame({ onBack }: LandInsuranceGameProps) {
  const [stage, setStage] = useState(1);
  const [landValue, setLandValue] = useState(5000000);
  const [hasBoughtInsurance, setHasBoughtInsurance] = useState(false);
  const [hasSoldInsurance, setHasSoldInsurance] = useState(false);
  const [insurancePremiumPaid, setInsurancePremiumPaid] = useState(0);
  const [insurancePremiumEarned, setInsurancePremiumEarned] = useState(0);
  const [marketCrashed, setMarketCrashed] = useState(false);

  const handleBuyInsurance = () => {
    setHasBoughtInsurance(true);
    setInsurancePremiumPaid(250000);
  };

  const handleSellInsurance = () => {
    setHasSoldInsurance(true);
    setInsurancePremiumEarned(250000);
  };

  const handleMarketCrash = () => {
    setMarketCrashed(true);
    setLandValue(3000000);
  };

  const calculateFinalValue = () => {
    let finalValue = landValue;
    if (hasBoughtInsurance && marketCrashed) {
      finalValue = 5000000;
    }
    finalValue -= insurancePremiumPaid;
    finalValue += insurancePremiumEarned;
    return finalValue;
  };

  const formatINR = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)} Lakhs`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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
        <h1 className="text-4xl font-bold mb-2">Land Insurance Game</h1>
        <p className="text-slate-400">
          Learn PUT options through a simple land ownership example
        </p>
      </header>

      {/* Stage 1: Introduction */}
      {stage === 1 && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">Stage 1: You Own Land</h2>
            <div className="space-y-4">
              <p className="text-lg">
                You own a piece of land in Mumbai worth {formatINR(landValue)}.
              </p>
              <div className="bg-slate-900 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-5xl mb-2">🏞️</div>
                  <p className="text-3xl font-bold text-emerald-400">
                    {formatINR(landValue)}
                  </p>
                  <p className="text-slate-400 mt-2">Current Land Value</p>
                </div>
              </div>
              <p className="text-slate-300">
                You're worried: What if the land value drops? What if there's a
                real estate crash and your land is only worth{" "}
                {formatINR(3000000)}?
              </p>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-500 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-2 text-blue-300">
              What is a PUT Option?
            </h3>
            <p className="text-slate-300">
              A PUT option is like{" "}
              <span className="font-bold text-white">
                insurance for your land
              </span>
              . You pay a premium (like insurance), and if the land value drops,
              the insurance pays you the difference.
            </p>
            <p className="text-slate-300 mt-2">
              <span className="font-bold text-white">Real example:</span> Just
              like you buy home insurance to protect against fire or theft, you
              buy a PUT option to protect against value dropping.
            </p>
          </div>

          <Button
            onClick={() => setStage(2)}
            className="w-full bg-blue-500 hover:bg-blue-600 py-6 text-lg"
          >
            Continue to Stage 2
          </Button>
        </div>
      )}

      {/* Stage 2: Buy Insurance (PUT Option) */}
      {stage === 2 && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">
              Stage 2: Buy Insurance (PUT Option)
            </h2>
            <div className="space-y-4">
              <p className="text-lg">
                You can buy insurance to protect your land value.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-lg p-6">
                  <p className="text-slate-400 mb-2">Land Value</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {formatINR(landValue)}
                  </p>
                </div>
                <div className="bg-slate-900 rounded-lg p-6">
                  <p className="text-slate-400 mb-2">Insurance Cost</p>
                  <p className="text-3xl font-bold text-red-400">
                    {formatINR(250000)}
                  </p>
                </div>
              </div>

              {!hasBoughtInsurance ? (
                <>
                  <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                    <p className="text-slate-300">
                      <span className="font-bold text-white">
                        How it works:
                      </span>{" "}
                      You pay {formatINR(250000)} for insurance. If land value
                      drops below {formatINR(5000000)}, insurance pays you the
                      difference.
                    </p>
                    <p className="text-slate-300 mt-2">
                      <span className="font-bold text-white">Example:</span> If
                      land drops to {formatINR(3000000)}, insurance pays you{" "}
                      {formatINR(2000000)} to cover your loss.
                    </p>
                  </div>
                  <Button
                    onClick={handleBuyInsurance}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 py-6 text-lg"
                  >
                    Buy Insurance for {formatINR(250000)}
                  </Button>
                </>
              ) : (
                <>
                  <div className="bg-emerald-900/30 border border-emerald-500 rounded-lg p-4">
                    <p className="text-emerald-300 font-bold">
                      Insurance Purchased!
                    </p>
                    <p className="text-slate-300 mt-2">
                      Your land is now protected. If value drops, you'll be
                      compensated.
                    </p>
                  </div>
                  <Button
                    onClick={() => setStage(3)}
                    className="w-full bg-blue-500 hover:bg-blue-600 py-6 text-lg"
                  >
                    Continue to Stage 3
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stage 3: Sell Insurance to Offset Cost */}
      {stage === 3 && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">
              Stage 3: Offset the Cost
            </h2>
            <div className="space-y-4">
              <p className="text-lg">
                Problem: You paid {formatINR(250000)} for insurance. That's
                expensive!
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Land Value</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatINR(landValue)}
                  </p>
                </div>
                <div className="bg-slate-900 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Insurance Paid</p>
                  <p className="text-2xl font-bold text-red-400">
                    -{formatINR(insurancePremiumPaid)}
                  </p>
                </div>
                <div className="bg-slate-900 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Net Value</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {formatINR(landValue - insurancePremiumPaid)}
                  </p>
                </div>
              </div>

              {!hasSoldInsurance ? (
                <>
                  <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                    <p className="text-slate-300">
                      <span className="font-bold text-white">Solution:</span>{" "}
                      Sell insurance on someone else's land in Pune! You earn{" "}
                      {formatINR(250000)} premium, which offsets your insurance
                      cost.
                    </p>
                    <p className="text-slate-300 mt-2">
                      <span className="font-bold text-white">
                        How it works:
                      </span>{" "}
                      Someone else is worried about their Pune land. They pay
                      you {formatINR(250000)} for insurance. If their land
                      crashes, you have to pay them.
                    </p>
                    <p className="text-slate-300 mt-2">
                      <span className="font-bold text-white">
                        Why you're okay with this:
                      </span>{" "}
                      You wanted to buy land in Pune anyway. If it crashes, you
                      get to buy it at a lower price. You can hold it long-term.
                    </p>
                  </div>
                  <Button
                    onClick={handleSellInsurance}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 py-6 text-lg"
                  >
                    Sell Insurance on Pune Land for {formatINR(250000)}
                  </Button>
                </>
              ) : (
                <>
                  <div className="bg-emerald-900/30 border border-emerald-500 rounded-lg p-4">
                    <p className="text-emerald-300 font-bold">
                      Insurance Sold!
                    </p>
                    <p className="text-slate-300 mt-2">
                      You earned {formatINR(250000)}, which offsets your
                      insurance cost. Net cost: ₹0
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">
                        Insurance Paid
                      </p>
                      <p className="text-xl font-bold text-red-400">
                        -{formatINR(insurancePremiumPaid)}
                      </p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">
                        Insurance Earned
                      </p>
                      <p className="text-xl font-bold text-emerald-400">
                        +{formatINR(insurancePremiumEarned)}
                      </p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">Net Cost</p>
                      <p className="text-xl font-bold text-white">₹0</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setStage(4)}
                    className="w-full bg-blue-500 hover:bg-blue-600 py-6 text-lg"
                  >
                    Continue to Stage 4
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stage 4: Market Crash - See Protection Work */}
      {stage === 4 && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">
              Stage 4: Real Estate Market Crash!
            </h2>
            <div className="space-y-4">
              {!marketCrashed ? (
                <>
                  <p className="text-lg">
                    Let's see what happens when the real estate market
                    crashes...
                  </p>
                  <div className="bg-slate-900 rounded-lg p-6 text-center">
                    <div className="text-5xl mb-2">🏞️</div>
                    <p className="text-3xl font-bold text-emerald-400">
                      {formatINR(landValue)}
                    </p>
                    <p className="text-slate-400 mt-2">
                      Current Land Value (Mumbai)
                    </p>
                  </div>
                  <Button
                    onClick={handleMarketCrash}
                    className="w-full bg-red-500 hover:bg-red-600 py-6 text-lg"
                  >
                    Simulate Market Crash
                  </Button>
                </>
              ) : (
                <>
                  <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
                    <p className="text-red-300 font-bold text-lg">
                      Market Crashed! Land value dropped 40%
                    </p>
                    <p className="text-slate-300 mt-1">
                      Mumbai real estate prices fell sharply
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 rounded-lg p-6 border-2 border-red-500">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">❌</span>
                        <p className="text-slate-400 font-bold">
                          WITHOUT Insurance
                        </p>
                      </div>
                      <p className="text-3xl font-bold text-red-400">
                        {formatINR(landValue)}
                      </p>
                      <p className="text-sm text-red-300 mt-2">
                        You lost {formatINR(2000000)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Your land is now worth only 60% of original value
                      </p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-6 border-2 border-emerald-500">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">✅</span>
                        <p className="text-slate-400 font-bold">
                          WITH Insurance (Protected)
                        </p>
                      </div>
                      <p className="text-3xl font-bold text-emerald-400">
                        {formatINR(calculateFinalValue())}
                      </p>
                      <p className="text-sm text-emerald-400 mt-2">
                        Insurance paid you {formatINR(2000000)}!
                      </p>
                      <p className="text-xs text-emerald-300 mt-1">
                        Your value is fully protected
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-900/30 border border-emerald-500 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-3 text-emerald-300">
                      What You Learned:
                    </h3>
                    <div className="space-y-2 text-slate-300">
                      <p>
                        <span className="font-bold text-white">
                          1. Buying PUT =
                        </span>{" "}
                        Insurance that protects you when value drops
                      </p>
                      <p>
                        <span className="font-bold text-white">
                          2. Selling PUT =
                        </span>{" "}
                        Earning premium to offset insurance cost (you're okay
                        buying that asset later)
                      </p>
                      <p>
                        <span className="font-bold text-white">
                          3. Net Result =
                        </span>{" "}
                        Free protection (₹0 cost)
                      </p>
                      <p>
                        <span className="font-bold text-white">4. Risk =</span>{" "}
                        If the Pune land crashes too, you have to buy it (but
                        you wanted it anyway)
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      onClick={onBack}
                      variant="outline"
                      className="py-6 text-lg bg-transparent"
                    >
                      Back to Games
                    </Button>
                    <Button
                      onClick={() => {
                        setStage(1);
                        setLandValue(5000000);
                        setHasBoughtInsurance(false);
                        setHasSoldInsurance(false);
                        setInsurancePremiumPaid(0);
                        setInsurancePremiumEarned(0);
                        setMarketCrashed(false);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 py-6 text-lg"
                    >
                      Play Again
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mt-8 flex justify-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full ${
              s <= stage ? "bg-blue-500" : "bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
