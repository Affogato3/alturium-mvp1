import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Play, Pause, TrendingUp, Zap, Target } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function MarketConsole() {
  const [isLive, setIsLive] = useState(true);
  const [profitCurve, setProfitCurve] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      time: `${i}m`,
      potential: 40 + Math.random() * 20,
      realized: 35 + Math.random() * 15,
    }))
  );

  const [liquidityTunnels] = useState([
    { from: "Equities", to: "Crypto", flow: 234.7, velocity: 92 },
    { from: "Bonds", to: "Commodities", flow: 156.3, velocity: 78 },
    { from: "Forex", to: "Derivatives", flow: 423.1, velocity: 95 },
  ]);

  const [arbitrageZones] = useState([
    { zone: "Synthetic Credit Markets", window: "0.034s", profit: "$12.4M", confidence: 94 },
    { zone: "Cross-Exchange Crypto", window: "0.127s", profit: "$8.7M", confidence: 87 },
    { zone: "Currency Pair Triangulation", window: "0.089s", profit: "$6.2M", confidence: 91 },
  ]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setProfitCurve(prev => [
        ...prev.slice(1),
        {
          time: `${prev.length}m`,
          potential: prev[prev.length - 1].potential + (Math.random() - 0.5) * 10,
          realized: prev[prev.length - 1].realized + (Math.random() - 0.5) * 8,
        }
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card via-primary/5 to-card border-primary/20 backdrop-blur-sm">
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      
      <div className="relative p-4 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 animate-pulse">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Synthetic Market Console</h3>
              <p className="text-sm text-muted-foreground">Real-Time Capital Flow Analytics</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsLive(!isLive)}
              className="gap-2"
            >
              {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isLive ? "Pause" : "Resume"}
            </Button>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profit Curvature */}
          <div className="lg:col-span-2 bg-background/50 rounded-lg p-4 border border-border/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Profit Curvature Analysis
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={profitCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Area type="monotone" dataKey="potential" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="realized" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.3} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Liquidity Tunnels */}
          <div className="bg-background/50 rounded-lg p-4 border border-border/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              Liquidity Tunnels
            </h4>
            <div className="space-y-3">
              {liquidityTunnels.map((tunnel, i) => (
                <div key={i} className="p-3 rounded-lg bg-card/50 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{tunnel.from} → {tunnel.to}</span>
                    <Badge variant="outline" className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20">
                      {tunnel.velocity}% velocity
                    </Badge>
                  </div>
                  <p className="text-lg font-bold text-success">${tunnel.flow}B</p>
                  <div className="w-full bg-muted/30 rounded-full h-1 mt-2">
                    <div
                      className="bg-primary h-1 rounded-full transition-all"
                      style={{ width: `${tunnel.velocity}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arbitrage Zones */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/30">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-warning" />
            Live Arbitrage Zones
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {arbitrageZones.map((zone, i) => (
              <div key={i} className="p-3 rounded-lg bg-gradient-to-br from-warning/5 to-primary/5 border-2 border-warning/30">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px]">
                    {zone.window} window
                  </Badge>
                  <span className="text-xs font-semibold text-success">{zone.confidence}%</span>
                </div>
                <h5 className="font-semibold text-sm mb-1">{zone.zone}</h5>
                <p className="text-2xl font-bold text-success">{zone.profit}</p>
                <Button size="sm" className="w-full mt-2 bg-gradient-to-r from-warning to-primary">
                  Execute
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
