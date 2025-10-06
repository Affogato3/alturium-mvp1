import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Agent {
  id: string;
  name: string;
  glyph: string;
  status: "profitable" | "stalled" | "failed";
  type: string;
  dealsCompleted: number;
  currentTask: string;
  profitGenerated: number;
  confidence: number;
}

interface AgentFeedDockProps {
  fullscreen?: boolean;
}

export function AgentFeedDock({ fullscreen = false }: AgentFeedDockProps) {
  const [agents, setAgents] = useState<Agent[]>([
    { id: "1", name: "AlphaVault", glyph: "🜚", status: "profitable", type: "Trading Engine", dealsCompleted: 1247, currentTask: "Executing arbitrage tunnel", profitGenerated: 847.3, confidence: 94 },
    { id: "2", name: "Meridian", glyph: "⚖️", status: "profitable", type: "M&A Specialist", dealsCompleted: 84, currentTask: "Negotiating $12B acquisition", profitGenerated: 423.1, confidence: 89 },
    { id: "3", name: "QuantumHedge", glyph: "⚡", status: "stalled", type: "Risk Optimizer", dealsCompleted: 532, currentTask: "Rebalancing derivatives", profitGenerated: 234.7, confidence: 67 },
    { id: "4", name: "SyntheticIPO", glyph: "📊", status: "profitable", type: "IPO Constructor", dealsCompleted: 23, currentTask: "Building Series D deck", profitGenerated: 678.9, confidence: 92 },
    { id: "5", name: "LiquidityCore", glyph: "💎", status: "profitable", type: "Capital Allocator", dealsCompleted: 3421, currentTask: "Optimizing treasury", profitGenerated: 1247.3, confidence: 96 },
    { id: "6", name: "ComplianceShield", glyph: "🛡️", status: "stalled", type: "Regulatory AI", dealsCompleted: 892, currentTask: "Auditing ESG compliance", profitGenerated: 0, confidence: 78 },
  ]);

  const [negotiations, setNegotiations] = useState<Array<{ from: string; to: string; message: string; time: string; type: string }>>([
    { from: "AlphaVault", to: "QuantumHedge", message: "Detected 0.034s arbitrage window in synthetic credit markets", time: "2s ago", type: "opportunity" },
    { from: "Meridian", to: "ComplianceShield", message: "Requesting regulatory clearance for cross-border M&A", time: "8s ago", type: "request" },
    { from: "SyntheticIPO", to: "LiquidityCore", message: "Capital requirement: $250M for optimal IPO timing", time: "15s ago", type: "capital" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update agent confidence
      setAgents(prev => prev.map(agent => ({
        ...agent,
        confidence: Math.max(50, Math.min(99, agent.confidence + (Math.random() - 0.5) * 3)),
        profitGenerated: agent.status === "profitable" ? agent.profitGenerated + Math.random() * 5 : agent.profitGenerated,
      })));

      // Add new negotiations
      if (Math.random() > 0.6) {
        const messages = [
          "Running 10,000 deal simulations in parallel universes",
          "Liquidity anomaly detected - deploying countermeasure",
          "Profit gradient mutation: +12.4% optimization found",
          "Stress test complete: 94.2% success probability",
          "Auto-executing hedging strategy across 8 asset classes",
        ];
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        setNegotiations(prev => [
          { 
            from: randomAgent.name, 
            to: "System", 
            message: messages[Math.floor(Math.random() * messages.length)], 
            time: "just now",
            type: Math.random() > 0.5 ? "opportunity" : "analysis"
          },
          ...prev.slice(0, 9)
        ]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [agents]);

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br from-card via-primary/5 to-card border-primary/20 backdrop-blur-sm ${fullscreen ? 'h-auto' : 'h-full'}`}>
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      
      <div className="relative p-4 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-border/50">
          <div className="p-2 rounded-lg bg-primary/20 animate-pulse">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Live Agent Feed Dock</h3>
            <p className="text-sm text-muted-foreground">Autonomous Deal Intelligence</p>
          </div>
        </div>

        <ScrollArea className={fullscreen ? "h-[600px]" : "h-[calc(100vh-400px)]"}>
          <div className="space-y-3">
            {agents.map(agent => (
              <div
                key={agent.id}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-[1.02] cursor-pointer ${
                  agent.status === "profitable"
                    ? "bg-success/5 border-success/30 hover:border-success/50"
                    : agent.status === "stalled"
                    ? "bg-warning/5 border-warning/30 hover:border-warning/50"
                    : "bg-danger/5 border-danger/30 hover:border-danger/50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-primary/20 text-primary font-semibold flex items-center justify-center text-lg">
                      {agent.glyph}
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm">{agent.name}</h4>
                      <p className="text-xs text-muted-foreground">{agent.type}</p>
                    </div>
                  </div>
                  {agent.status === "profitable" && <CheckCircle className="w-4 h-4 text-success" />}
                  {agent.status === "stalled" && <Loader2 className="w-4 h-4 text-warning animate-spin" />}
                  {agent.status === "failed" && <AlertCircle className="w-4 h-4 text-danger" />}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-semibold text-primary">{agent.confidence}%</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-1">
                    <div
                      className="bg-primary h-1 rounded-full transition-all duration-500"
                      style={{ width: `${agent.confidence}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Deals</p>
                      <p className="text-sm font-bold">{agent.dealsCompleted.toLocaleString()}</p>
                    </div>
                    {agent.profitGenerated > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground">Profit</p>
                        <p className="text-sm font-bold text-success">${agent.profitGenerated.toFixed(1)}B</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 p-2 bg-background/50 rounded text-xs">
                    <p className="text-muted-foreground">{agent.currentTask}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 pt-3 border-t border-border/50">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Live Negotiations
          </h4>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {negotiations.map((neg, i) => (
                <div key={i} className="p-2 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-xs">{neg.from}</span>
                    <span className="text-xs text-muted-foreground">→ {neg.to}</span>
                    <Badge variant="outline" className="ml-auto text-[10px] h-4">
                      {neg.time}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{neg.message}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
}
