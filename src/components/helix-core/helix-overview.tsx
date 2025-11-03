import { Card } from "@/components/ui/card";
import { Activity, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

export const HelixOverview = () => {
  const [metrics, setMetrics] = useState({
    totalCashFlow: 0,
    liquidityGap: 0,
    activeAlerts: 0,
    healthIndex: 0
  });

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics({
        totalCashFlow: 2450000 + Math.random() * 100000,
        liquidityGap: -45000 + Math.random() * 10000,
        activeAlerts: Math.floor(Math.random() * 5),
        healthIndex: 85 + Math.random() * 10
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (index: number) => {
    if (index >= 90) return "text-success";
    if (index >= 70) return "text-warning";
    return "text-danger";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all hover:scale-105 cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Cash Flow</h3>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold animate-pulse">
            ${(metrics.totalCashFlow / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-muted-foreground">Real-time balance</p>
        </div>
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur border-warning/20 hover:border-warning/40 transition-all hover:scale-105 cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-warning/10 group-hover:bg-warning/20 transition-colors">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Liquidity Gap</h3>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-warning animate-pulse">
            ${(Math.abs(metrics.liquidityGap) / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-muted-foreground">Predicted in 7 days</p>
        </div>
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur border-danger/20 hover:border-danger/40 transition-all hover:scale-105 cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-danger/10 group-hover:bg-danger/20 transition-colors">
              <AlertTriangle className="h-5 w-5 text-danger" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Active Alerts</h3>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-danger animate-pulse">
            {metrics.activeAlerts}
          </p>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </div>
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur border-success/20 hover:border-success/40 transition-all hover:scale-105 cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
              <Activity className="h-5 w-5 text-success" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Health Index</h3>
          </div>
        </div>
        <div className="space-y-1">
          <p className={`text-3xl font-bold ${getHealthColor(metrics.healthIndex)} animate-pulse`}>
            {metrics.healthIndex.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">Portfolio health</p>
        </div>
      </Card>
    </div>
  );
};
