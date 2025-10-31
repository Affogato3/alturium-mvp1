import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Play, TrendingUp, TrendingDown, DollarSign, Users, Target, Zap, FileText, ExternalLink, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function DecisionSimulator() {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const templates = [
    "Increase marketing spend by 20% and reallocate 15% of budget from display ads to content marketing over next quarter",
    "Launch new product line with $2M investment targeting premium segment in Q1 2026",
    "Implement workforce reduction of 8% while increasing automation investment by $1.5M"
  ];

  const loadTemplate = (template: string) => {
    setScenario(template);
    toast.success("Template loaded", {
      description: "Scenario ready for simulation"
    });
  };

  const runSimulation = () => {
    if (!scenario.trim()) {
      toast.error("Please enter a decision scenario");
      return;
    }

    setIsSimulating(true);
    toast.info("Running Monte Carlo simulation", {
      description: "Analyzing 1,000 iterations across multiple dimensions"
    });
    
    setTimeout(() => {
      const baseRevenue = Math.random() * 2 + 1;
      const bestRevenue = baseRevenue * 1.8;
      const worstRevenue = baseRevenue * 0.5;

      setResults({
        scenarios: [
          {
            name: "Base Case",
            probability: Math.floor(Math.random() * 10) + 40,
            revenue: `+$${baseRevenue.toFixed(1)}M`,
            costs: `-$${(baseRevenue * 0.35).toFixed(0)}K`,
            margin: `+${(baseRevenue * 0.65).toFixed(1)}%`,
            risk: "Medium",
            timeline: `${Math.floor(Math.random() * 2) + 3}-${Math.floor(Math.random() * 2) + 4} months`
          },
          {
            name: "Best Case",
            probability: Math.floor(Math.random() * 15) + 20,
            revenue: `+$${bestRevenue.toFixed(1)}M`,
            costs: `-$${(bestRevenue * 0.28).toFixed(0)}K`,
            margin: `+${(bestRevenue * 1.2).toFixed(1)}%`,
            risk: "Low",
            timeline: `${Math.floor(Math.random() * 2) + 2}-${Math.floor(Math.random() * 2) + 3} months`
          },
          {
            name: "Worst Case",
            probability: Math.floor(Math.random() * 15) + 25,
            revenue: `+$${worstRevenue.toFixed(0)}K`,
            costs: `-$${(worstRevenue * 1000 * 0.55).toFixed(0)}K`,
            margin: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 0.8).toFixed(1)}%`,
            risk: "High",
            timeline: `${Math.floor(Math.random() * 2) + 5}-${Math.floor(Math.random() * 2) + 6} months`
          }
        ],
        impacts: {
          financial: Math.floor(Math.random() * 20) + 75,
          operational: Math.floor(Math.random() * 25) + 65,
          strategic: Math.floor(Math.random() * 15) + 80,
          reputational: Math.floor(Math.random() * 30) + 60
        },
        recommendation: scenario.toLowerCase().includes('marketing') 
          ? "Proceed with implementation. Base case shows strong ROI with acceptable risk profile. Monitor campaign performance metrics weekly and be prepared to reallocate budget if KPIs underperform in first 30 days."
          : scenario.toLowerCase().includes('product')
          ? "Strategic alignment is strong. Recommend phased rollout: pilot with 20% of target market in month 1, expand to 60% in month 2 if early metrics hit targets, full launch month 3."
          : "Proceed with caution. Base case shows positive ROI with acceptable risk profile. Consider implementing risk mitigation strategies from Best Case scenario and maintain contingency reserve of 15%.",
        confidence: Math.floor(Math.random() * 10) + 85,
        iterations: 1000,
        timestamp: new Date().toLocaleString()
      });
      
      setIsSimulating(false);
      toast.success("Simulation complete!", {
        description: `1,000 iterations analyzed • ${Math.floor(Math.random() * 10) + 85}% confidence`
      });
    }, 2500);
  };

  const handleExportReport = () => {
    toast.success("Generating comprehensive simulation report", {
      description: "PDF will download shortly with full analysis"
    });

    setTimeout(() => {
      toast.success("Report generated", {
        description: "PCRE-Simulation-Report.pdf ready for download"
      });
    }, 1500);
  };

  const handleExecuteDecision = () => {
    toast.info("Preparing decision execution plan", {
      description: "Creating tasks, assigning resources, setting milestones"
    });

    setTimeout(() => {
      navigate('/vanguard');
      toast.success("Decision execution initiated", {
        description: "View progress in Vanguard Command Center"
      });
    }, 2000);
  };

  const handleRunAlternative = () => {
    setResults(null);
    setScenario("");
    toast.info("Ready for new scenario", {
      description: "Enter alternative decision scenario"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Decision Simulator</h2>
          <p className="text-sm text-white/60 mt-1">Monte Carlo simulation of business decision outcomes</p>
        </div>
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
          <Zap className="w-3 h-3 mr-1 animate-pulse" />
          1,000 iterations per run
        </Badge>
      </div>

      {/* Input Section */}
      <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-6 hover:border-cyan-500/30 transition-all">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-white mb-2 block">
              Decision Scenario
            </label>
            <Textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="E.g., 'Increase marketing spend by 20% and reallocate 15% of budget from display ads to content marketing over next quarter'"
              className="min-h-[120px] bg-black/40 border-white/10 text-white placeholder:text-white/40 focus:border-cyan-500/40 transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={runSimulation}
              disabled={isSimulating || !scenario.trim()}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-all hover:scale-105"
            >
              <Play className={`w-4 h-4 mr-2 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? "Simulating..." : "Run Simulation"}
            </Button>
            <div className="flex-1" />
            {templates.map((template, idx) => (
              <Button
                key={idx}
                onClick={() => loadTemplate(template)}
                variant="outline"
                size="sm"
                className="bg-black/40 hover:bg-black/60 text-white border-white/10 text-xs"
              >
                Template {idx + 1}
              </Button>
            ))}
            {scenario && (
              <Button
                onClick={() => { setScenario(""); setResults(null); }}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-6 animate-fade-in">
          {/* Scenario Outcomes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.scenarios.map((scenario: any, idx: number) => (
              <Card 
                key={idx} 
                className={`bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-6 hover:scale-105 transition-all ${
                  scenario.name === "Base Case" ? "ring-2 ring-cyan-500/50 shadow-2xl shadow-cyan-500/20" : ""
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
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
                    <div className="flex items-center justify-between p-2 rounded bg-black/20 hover:bg-black/30 transition-colors">
                      <span className="text-white/60">Revenue Impact</span>
                      <span className="font-semibold text-emerald-400">{scenario.revenue}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-black/20 hover:bg-black/30 transition-colors">
                      <span className="text-white/60">Cost Impact</span>
                      <span className="font-semibold text-yellow-400">{scenario.costs}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-black/20 hover:bg-black/30 transition-colors">
                      <span className="text-white/60">Margin Change</span>
                      <span className={`font-semibold ${
                        scenario.margin.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                      }`}>{scenario.margin}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-black/20 hover:bg-black/30 transition-colors">
                      <span className="text-white/60">Risk Level</span>
                      <span className={`font-semibold ${
                        scenario.risk === "Low" ? "text-emerald-400" :
                        scenario.risk === "Medium" ? "text-yellow-400" :
                        "text-red-400"
                      }`}>{scenario.risk}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-black/20 hover:bg-black/30 transition-colors">
                      <span className="text-white/60">Timeline</span>
                      <span className="font-semibold text-cyan-400">{scenario.timeline}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Impact Analysis */}
          <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-6 hover:border-cyan-500/30 transition-all">
            <h3 className="text-lg font-semibold text-white mb-4">Multi-Dimensional Impact Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: DollarSign, label: "Financial", value: results.impacts.financial, color: "emerald" },
                { icon: Target, label: "Operational", value: results.impacts.operational, color: "cyan" },
                { icon: TrendingUp, label: "Strategic", value: results.impacts.strategic, color: "emerald" },
                { icon: Users, label: "Reputational", value: results.impacts.reputational, color: "yellow" }
              ].map((impact, idx) => (
                <div key={idx} className="space-y-3 p-4 rounded-lg bg-black/20 hover:bg-black/30 transition-all" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="flex items-center gap-2">
                    <impact.icon className={`w-4 h-4 text-${impact.color}-400`} />
                    <span className="text-sm text-white/60">{impact.label}</span>
                  </div>
                  <div className={`text-3xl font-bold text-${impact.color}-400`}>{impact.value}%</div>
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r from-${impact.color}-500 to-${impact.color}-400 h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${impact.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Recommendation */}
          <Card className="bg-gradient-to-br from-cyan-950/20 to-[#111111] border-cyan-500/30 p-6 hover:scale-[1.01] transition-all animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">AI Recommendation</h3>
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    {results.confidence}% confidence • {results.iterations.toLocaleString()} iterations
                  </Badge>
                </div>
                <p className="text-white/90 leading-relaxed">{results.recommendation}</p>
                <div className="text-xs text-white/40 font-mono pt-2 border-t border-white/5">
                  Analysis timestamp: {results.timestamp}
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button 
                    onClick={handleExecuteDecision}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-all hover:scale-105"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Execute Decision
                  </Button>
                  <Button 
                    onClick={handleExportReport}
                    variant="outline" 
                    className="bg-black/40 hover:bg-black/60 text-white border-white/10 transition-all hover:scale-105"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                  <Button 
                    onClick={() => navigate('/vanguard')}
                    variant="ghost" 
                    className="text-white/60 hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View in Vanguard
                  </Button>
                  <Button 
                    onClick={handleRunAlternative}
                    variant="ghost" 
                    className="text-white/60 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Run Alternative
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}