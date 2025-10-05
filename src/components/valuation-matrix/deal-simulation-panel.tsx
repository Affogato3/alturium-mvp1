import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, Play, Pause, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Timeline {
  id: string;
  name: string;
  probability: number;
  outcome: "success" | "neutral" | "failure";
  npv: number;
  riskScore: number;
}

export function DealSimulationPanel() {
  const [isRunning, setIsRunning] = useState(true);
  const [timelines, setTimelines] = useState<Timeline[]>([
    { id: "1", name: "Optimal Path", probability: 67, outcome: "success", npv: 42.5, riskScore: 2.1 },
    { id: "2", name: "Conservative", probability: 23, outcome: "success", npv: 31.2, riskScore: 1.4 },
    { id: "3", name: "Aggressive", probability: 8, outcome: "neutral", npv: 48.9, riskScore: 4.7 },
    { id: "4", name: "High Risk", probability: 2, outcome: "failure", npv: -12.3, riskScore: 8.2 }
  ]);

  const [chartData, setChartData] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      month: `M${i + 1}`,
      optimal: 40 + Math.random() * 10,
      conservative: 30 + Math.random() * 8,
      aggressive: 45 + Math.random() * 15
    }))
  );

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimelines(prev => prev.map(t => ({
        ...t,
        probability: Math.max(0, Math.min(100, t.probability + (Math.random() - 0.5) * 3)),
        npv: t.npv + (Math.random() - 0.5) * 2
      })));

      setChartData(prev => [
        ...prev.slice(1),
        {
          month: `M${prev.length + 1}`,
          optimal: prev[prev.length - 1].optimal + (Math.random() - 0.5) * 5,
          conservative: prev[prev.length - 1].conservative + (Math.random() - 0.5) * 3,
          aggressive: prev[prev.length - 1].aggressive + (Math.random() - 0.5) * 8
        }
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <GitBranch className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">AI Deal Simulations</h3>
            <p className="text-sm text-muted-foreground">Parallel Universe Outcomes</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsRunning(!isRunning)}
          className="gap-2"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? "Pause" : "Resume"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {timelines.map(timeline => (
          <div
            key={timeline.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              timeline.outcome === "success"
                ? "bg-success/5 border-success/30"
                : timeline.outcome === "failure"
                ? "bg-danger/5 border-danger/30"
                : "bg-warning/5 border-warning/30"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {timeline.outcome === "success" && <CheckCircle2 className="w-4 h-4 text-success" />}
                {timeline.outcome === "failure" && <AlertTriangle className="w-4 h-4 text-danger" />}
                {timeline.outcome === "neutral" && <TrendingUp className="w-4 h-4 text-warning" />}
                <h4 className="font-semibold">{timeline.name}</h4>
              </div>
              <Badge
                variant="outline"
                className={
                  timeline.outcome === "success"
                    ? "bg-success/10 text-success border-success/20"
                    : timeline.outcome === "failure"
                    ? "bg-danger/10 text-danger border-danger/20"
                    : "bg-warning/10 text-warning border-warning/20"
                }
              >
                {timeline.probability.toFixed(1)}%
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">3Y NPV</p>
                <p className={`text-lg font-bold ${timeline.npv > 0 ? "text-success" : "text-danger"}`}>
                  ${Math.abs(timeline.npv).toFixed(1)}B
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Risk Score</p>
                <p className="text-lg font-bold text-foreground">
                  {timeline.riskScore.toFixed(1)}/10
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
        <h4 className="font-semibold mb-4">Timeline Projections</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="optimal" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="conservative" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="aggressive" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
