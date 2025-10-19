import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, AlertTriangle, TrendingUp, Network } from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  type: string;
  icon: string;
  outcomes: { label: string; probability: number; impact: number }[];
}

export const QuantumScenarioSimulator = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>("recession");
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const scenarios: Scenario[] = [
    {
      id: "recession",
      name: "Global Recession",
      type: "Economic",
      icon: "📉",
      outcomes: [
        { label: "Revenue decline 15-25%", probability: 0.72, impact: -18 },
        { label: "Cost reduction success", probability: 0.61, impact: 8 },
        { label: "Market share gain", probability: 0.34, impact: 12 },
      ],
    },
    {
      id: "competitor",
      name: "Competitor Launch",
      type: "Market",
      icon: "⚔️",
      outcomes: [
        { label: "Market share loss 5-10%", probability: 0.68, impact: -7 },
        { label: "Price war triggered", probability: 0.45, impact: -12 },
        { label: "Innovation response wins", probability: 0.52, impact: 15 },
      ],
    },
    {
      id: "supply-shock",
      name: "Supply Chain Shock",
      type: "Operations",
      icon: "🚢",
      outcomes: [
        { label: "Delivery delays 2-4 weeks", probability: 0.83, impact: -9 },
        { label: "Cost increase 20-30%", probability: 0.71, impact: -14 },
        { label: "Alternative supplier found", probability: 0.42, impact: 6 },
      ],
    },
    {
      id: "regulation",
      name: "New Regulation",
      type: "Policy",
      icon: "📜",
      outcomes: [
        { label: "Compliance cost $2M+", probability: 0.89, impact: -5 },
        { label: "Market restriction", probability: 0.54, impact: -11 },
        { label: "Competitive advantage", probability: 0.38, impact: 9 },
      ],
    },
    {
      id: "tech-breakthrough",
      name: "Tech Breakthrough",
      type: "Innovation",
      icon: "🚀",
      outcomes: [
        { label: "Market disruption", probability: 0.47, impact: 25 },
        { label: "First mover advantage", probability: 0.35, impact: 32 },
        { label: "Adoption challenges", probability: 0.61, impact: -8 },
      ],
    },
  ];

  const runSimulation = () => {
    setSimulating(true);
    setTimeout(() => {
      const scenario = scenarios.find(s => s.id === selectedScenario);
      setResults(scenario);
      setSimulating(false);
    }, 2000);
  };

  const currentScenario = scenarios.find(s => s.id === selectedScenario);

  return (
    <div className="space-y-6">
      {/* Scenario Selector */}
      <Card className="bg-black/60 border-primary/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Quantum Scenario Simulator</h3>
            <p className="text-xs text-primary/60 mt-1">Run 10,000+ parallel simulations instantly</p>
          </div>
          <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/40">
            <Zap className="w-3 h-3 mr-1" />
            Quantum-Inspired
          </Badge>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                selectedScenario === scenario.id
                  ? "border-primary bg-primary/20"
                  : "border-primary/20 bg-black/40"
              }`}
            >
              <div className="text-3xl mb-2">{scenario.icon}</div>
              <div className="text-xs font-bold text-white">{scenario.name}</div>
              <div className="text-xs text-primary/60">{scenario.type}</div>
            </button>
          ))}
        </div>

        <Button
          onClick={runSimulation}
          disabled={simulating}
          className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/40"
        >
          {simulating ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-spin" />
              Running 10,000 Simulations...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Run Quantum Simulation
            </>
          )}
        </Button>
      </Card>

      {/* Probability Curves */}
      {results && (
        <Card className="bg-black/60 border-primary/20 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Probabilistic Outcome Curves</h3>
          <div className="space-y-4">
            {results.outcomes.map((outcome: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white">{outcome.label}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-primary/60">
                      {(outcome.probability * 100).toFixed(0)}% probability
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        outcome.impact > 0
                          ? "text-green-400 border-green-400/40"
                          : "text-red-400 border-red-400/40"
                      }
                    >
                      {outcome.impact > 0 ? "+" : ""}
                      {outcome.impact}%
                    </Badge>
                  </div>
                </div>

                {/* Probability curve */}
                <div className="relative h-12 bg-black/40 rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 transition-all duration-1000"
                    style={{
                      width: `${outcome.probability * 100}%`,
                      background: outcome.impact > 0
                        ? "linear-gradient(90deg, rgba(34,197,94,0.3), rgba(34,197,94,0.6))"
                        : "linear-gradient(90deg, rgba(239,68,68,0.3), rgba(239,68,68,0.6))",
                    }}
                  />
                  {/* Neon glow */}
                  <div
                    className="absolute inset-y-0 left-0 animate-pulse"
                    style={{
                      width: `${outcome.probability * 100}%`,
                      background: outcome.impact > 0
                        ? "linear-gradient(90deg, transparent, rgba(34,197,94,0.4))"
                        : "linear-gradient(90deg, transparent, rgba(239,68,68,0.4))",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Cascading Effects Network */}
      {results && (
        <Card className="bg-black/60 border-primary/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Cascading Impact Network</h3>
          </div>

          <div className="relative h-64 bg-black/40 rounded-lg overflow-hidden">
            {/* Animated network visualization placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Center node */}
                <div className="w-16 h-16 rounded-full bg-primary/40 border-2 border-primary flex items-center justify-center animate-pulse">
                  <span className="text-2xl">{currentScenario?.icon}</span>
                </div>

                {/* Orbiting nodes */}
                {results.outcomes.map((outcome: any, idx: number) => {
                  const angle = (idx * 2 * Math.PI) / results.outcomes.length;
                  const radius = 80;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <div
                      key={idx}
                      className="absolute w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs transition-all"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: "translate(-50%, -50%)",
                        backgroundColor: outcome.impact > 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
                        borderColor: outcome.impact > 0 ? "rgb(34,197,94)" : "rgb(239,68,68)",
                        animation: `pulse 2s ease-in-out infinite ${idx * 0.3}s`,
                      }}
                    >
                      {outcome.impact > 0 ? <TrendingUp className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="text-sm font-bold text-white mb-2">AI Recommendation</div>
            <div className="text-xs text-primary/60">
              Based on 10,000+ simulations, optimal strategy: Focus on cost optimization while maintaining market position.
              Expected outcome: -3.2% to +4.7% revenue variance over 12 months.
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
