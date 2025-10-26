import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Play, TrendingUp, TrendingDown, DollarSign, Users, Target, Zap } from "lucide-react";
import { toast } from "sonner";

export function DecisionSimulator() {
  const [scenario, setScenario] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runSimulation = () => {
    if (!scenario.trim()) {
      toast.error("Please enter a decision scenario");
      return;
    }

    setIsSimulating(true);
    
    // Simulate API call
    setTimeout(() => {
      setResults({
        scenarios: [
          {
            name: "Base Case",
            probability: 45,
            revenue: "+$1.8M",
            costs: "-$640K",
            margin: "+1.2%",
            risk: "Medium",
            timeline: "3-4 months"
          },
          {
            name: "Best Case",
            probability: 25,
            revenue: "+$3.4M",
            costs: "-$580K",
            margin: "+2.8%",
            risk: "Low",
            timeline: "2-3 months"
          },
          {
            name: "Worst Case",
            probability: 30,
            revenue: "+$420K",
            costs: "-$780K",
            margin: "-0.4%",
            risk: "High",
            timeline: "5-6 months"
          }
        ],
        impacts: {
          financial: 87,
          operational: 72,
          strategic: 94,
          reputational: 68
        },
        recommendation: "Proceed with caution. Base case shows positive ROI with acceptable risk profile. Consider implementing risk mitigation strategies from Best Case scenario.",
        confidence: 91
      });
      setIsSimulating(false);
      toast.success("Simulation complete");
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Decision Simulator</h2>
          <p className="text-sm text-white/60 mt-1">Monte Carlo simulation of business decision outcomes</p>
        </div>
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
          <Zap className="w-3 h-3 mr-1" />
          1,000 iterations per run
        </Badge>
      </div>

      {/* Input Section */}
      <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-white mb-2 block">
              Decision Scenario
            </label>
            <Textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="E.g., 'Increase marketing spend by 20% and reallocate 15% of budget from display ads to content marketing over next quarter'"
              className="min-h-[120px] bg-black/40 border-white/10 text-white placeholder:text-white/40 focus:border-cyan-500/40"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={runSimulation}
              disabled={isSimulating}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
            >
              <Play className="w-4 h-4 mr-2" />
              {isSimulating ? "Simulating..." : "Run Simulation"}
            </Button>
            <Button
              variant="outline"
              className="bg-black/40 hover:bg-black/60 text-white border-white/10"
            >
              Load Template
            </Button>
            <Button
              variant="ghost"
              className="text-white/60 hover:text-white"
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {results && (
        <>
          {/* Scenario Outcomes */}
          <div className="grid grid-cols-3 gap-6">
            {results.scenarios.map((scenario: any, idx: number) => (
              <Card key={idx} className={`bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-6 ${
                scenario.name === "Base Case" ? "ring-2 ring-cyan-500/50" : ""
              }`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{scenario.name}</h3>
                    <Badge className={`text-xs ${
                      scenario.name === "Best Case" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                      scenario.name === "Worst Case" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                      "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                    }`}>
                      {scenario.probability}% likely
                    </Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Revenue Impact</span>
                      <span className="font-semibold text-emerald-400">{scenario.revenue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Cost Impact</span>
                      <span className="font-semibold text-yellow-400">{scenario.costs}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Margin Change</span>
                      <span className={`font-semibold ${
                        scenario.margin.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                      }`}>{scenario.margin}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Risk Level</span>
                      <span className={`font-semibold ${
                        scenario.risk === "Low" ? "text-emerald-400" :
                        scenario.risk === "Medium" ? "text-yellow-400" :
                        "text-red-400"
                      }`}>{scenario.risk}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Timeline</span>
                      <span className="font-semibold text-cyan-400">{scenario.timeline}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Impact Analysis */}
          <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Multi-Dimensional Impact</h3>
            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-white/60">Financial</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400">{results.impacts.financial}%</div>
                <div className="w-full bg-black/40 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full"
                    style={{ width: `${results.impacts.financial}%` }}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-white/60">Operational</span>
                </div>
                <div className="text-3xl font-bold text-cyan-400">{results.impacts.operational}%</div>
                <div className="w-full bg-black/40 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full"
                    style={{ width: `${results.impacts.operational}%` }}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-white/60">Strategic</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400">{results.impacts.strategic}%</div>
                <div className="w-full bg-black/40 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full"
                    style={{ width: `${results.impacts.strategic}%` }}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white/60">Reputational</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400">{results.impacts.reputational}%</div>
                <div className="w-full bg-black/40 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full"
                    style={{ width: `${results.impacts.reputational}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* AI Recommendation */}
          <Card className="bg-gradient-to-br from-cyan-950/20 to-[#111111] border-cyan-500/30 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">AI Recommendation</h3>
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    {results.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-white/90 leading-relaxed">{results.recommendation}</p>
                <div className="flex items-center gap-3 pt-2">
                  <Button className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
                    Execute Decision
                  </Button>
                  <Button variant="outline" className="bg-black/40 hover:bg-black/60 text-white border-white/10">
                    Export Report
                  </Button>
                  <Button variant="ghost" className="text-white/60 hover:text-white">
                    Run Alternative Scenario
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
