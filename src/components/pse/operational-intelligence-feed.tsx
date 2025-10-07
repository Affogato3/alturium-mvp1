import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, TrendingUp, Zap, Check, Clock, AlertTriangle } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: "running" | "completed" | "simulating" | "blocked";
  goal: string;
  profitPotential: number;
  risk: "low" | "medium" | "high";
  eta: string;
  progress: number;
}

export const OperationalIntelligenceFeed = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "SIB-07",
      name: "M&A Pathfinder",
      type: "Synthetic Investment Banker",
      status: "running",
      goal: "Structuring $2.4B Energy Merger",
      profitPotential: 3.2,
      risk: "medium",
      eta: "2h 16m",
      progress: 67,
    },
    {
      id: "QT-14",
      name: "Alpha Arbitrage",
      type: "Quantum Trader",
      status: "completed",
      goal: "Cross-market liquidity sweep",
      profitPotential: 1.8,
      risk: "low",
      eta: "Completed",
      progress: 100,
    },
    {
      id: "SC-03",
      name: "Supply Optimizer",
      type: "Supply Chain Agent",
      status: "running",
      goal: "Route optimization for Q2 logistics",
      profitPotential: 4.7,
      risk: "low",
      eta: "45m",
      progress: 82,
    },
    {
      id: "RD-21",
      name: "Portfolio Synthesizer",
      type: "R&D Investment Agent",
      status: "simulating",
      goal: "Testing 1,247 product combinations",
      profitPotential: 12.3,
      risk: "high",
      eta: "4h 33m",
      progress: 34,
    },
    {
      id: "MK-09",
      name: "Revenue Maximizer",
      type: "Marketing Agent",
      status: "running",
      goal: "Dynamic pricing across 47 markets",
      profitPotential: 2.1,
      risk: "medium",
      eta: "1h 05m",
      progress: 91,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.status === "running" && agent.progress < 100) {
            return { ...agent, progress: Math.min(100, agent.progress + Math.random() * 3) };
          }
          if (agent.progress >= 100 && agent.status === "running") {
            return { ...agent, status: "completed" };
          }
          return agent;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: Agent["status"]) => {
    switch (status) {
      case "running":
        return <Zap className="w-4 h-4 text-green-400 animate-pulse" />;
      case "completed":
        return <Check className="w-4 h-4 text-green-400" />;
      case "simulating":
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      case "blocked":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  const getRiskColor = (risk: Agent["risk"]) => {
    switch (risk) {
      case "low":
        return "text-green-400 border-green-400/40";
      case "medium":
        return "text-yellow-400 border-yellow-400/40";
      case "high":
        return "text-red-400 border-red-400/40";
    }
  };

  const getStatusBorderColor = (status: Agent["status"]) => {
    switch (status) {
      case "running":
        return "border-green-400/40";
      case "completed":
        return "border-green-400/20";
      case "simulating":
        return "border-yellow-400/40";
      case "blocked":
        return "border-red-400/40";
    }
  };

  return (
    <Card className="h-full bg-black/40 backdrop-blur-sm border-primary/20 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-white">Operational Intelligence Feed</h3>
        <Badge className="ml-auto bg-primary/20 text-primary border-primary/40 text-xs">
          {agents.filter((a) => a.status === "running").length} Active
        </Badge>
      </div>

      <ScrollArea className="h-[calc(100%-3rem)]">
        <div className="space-y-3">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className={`bg-black/60 border ${getStatusBorderColor(agent.status)} p-3 hover:bg-black/80 transition-colors`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(agent.status)}
                  <div>
                    <div className="text-xs font-bold text-white">{agent.id} "{agent.name}"</div>
                    <div className="text-xs text-primary/40">{agent.type}</div>
                  </div>
                </div>
                <Badge variant="outline" className={`text-xs ${getRiskColor(agent.risk)}`}>
                  {agent.risk.toUpperCase()}
                </Badge>
              </div>

              <div className="text-xs text-primary/60 mb-2">{agent.goal}</div>

              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-primary/40">Profit Potential:</span>
                <span className="text-green-400 font-bold">+{agent.profitPotential}%</span>
              </div>

              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-primary/40">ETA:</span>
                <span className="text-primary">{agent.eta}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-black/40 rounded-full h-1.5 mb-2">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${agent.progress}%` }}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary/20 text-xs"
              >
                View in Simulation Dome ▸
              </Button>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
