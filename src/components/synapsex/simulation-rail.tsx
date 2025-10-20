import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Play, RotateCcw } from "lucide-react";

const baselineData = [
  { month: "Jan", baseline: 8.2, optimized: 8.2, aggressive: 8.2 },
  { month: "Feb", baseline: 8.4, optimized: 8.7, aggressive: 8.9 },
  { month: "Mar", baseline: 8.3, optimized: 9.2, aggressive: 9.8 },
  { month: "Apr", baseline: 8.6, optimized: 9.8, aggressive: 10.9 },
  { month: "May", baseline: 8.5, optimized: 10.3, aggressive: 12.1 },
  { month: "Jun", baseline: 8.7, optimized: 10.9, aggressive: 13.5 },
];

export const SimulationRail = () => {
  return (
    <Card className="bg-black/40 backdrop-blur-sm border-primary/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Profit Trajectory Simulator</h3>
          <p className="text-xs text-muted-foreground">
            6-month forecast under different AI strategies
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-black/50 border-primary/20">
            <RotateCcw className="w-3 h-3 mr-2" />
            Reset
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-primary text-black">
            <Play className="w-3 h-3 mr-2" />
            Run Simulation
          </Button>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
          Baseline (Current Path)
        </Badge>
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
          AI Optimized
        </Badge>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          Aggressive Growth
        </Badge>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={baselineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="month"
            stroke="rgba(255,255,255,0.3)"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.3)"
            style={{ fontSize: "12px" }}
            domain={[7, 14]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="baseline"
            stroke="#6b7280"
            strokeWidth={2}
            dot={false}
            name="Baseline"
          />
          <Line
            type="monotone"
            dataKey="optimized"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={false}
            name="Optimized"
          />
          <Line
            type="monotone"
            dataKey="aggressive"
            stroke="#eab308"
            strokeWidth={2}
            dot={false}
            name="Aggressive"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-400">+$420K</div>
          <div className="text-xs text-muted-foreground">Baseline (6mo)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">+$2.1M</div>
          <div className="text-xs text-muted-foreground">Optimized (6mo)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">+$4.8M</div>
          <div className="text-xs text-muted-foreground">Aggressive (6mo)</div>
        </div>
      </div>
    </Card>
  );
};
