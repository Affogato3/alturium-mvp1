import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap, Target, AlertCircle } from "lucide-react";

export const StrategicRibbon = () => {
  return (
    <div className="bg-gradient-to-r from-black via-primary/5 to-black border-b border-primary/20 p-4">
      <div className="flex items-center justify-between gap-4">
        {/* KPIs */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              Profit: +$8.4M
            </Badge>
            <div className="text-xs text-cyan-400/60">▲ 23% vs last month</div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <AlertCircle className="w-3 h-3 mr-1" />
              Risk Score: 4.2
            </Badge>
            <div className="text-xs text-yellow-400/60">Low-Medium</div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Target className="w-3 h-3 mr-1" />
              Efficiency: 87%
            </Badge>
            <div className="text-xs text-primary/60">▲ 12% optimization potential</div>
          </div>
        </div>

        {/* Next Best Move */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">AI Confidence: 94%</div>
            <div className="text-sm font-semibold text-cyan-400">
              Rebalance APAC operations
            </div>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-primary text-black font-semibold hover:opacity-90">
            <Zap className="w-4 h-4 mr-2" />
            Execute Best Move
          </Button>
        </div>
      </div>
    </div>
  );
};
