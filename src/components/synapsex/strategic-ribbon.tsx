import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap, Target, AlertCircle } from "lucide-react";

export const StrategicRibbon = () => {
  return (
    <div className="bg-gradient-to-r from-black via-[#1A1A1A]/5 to-black border-b border-[#CFAF6E]/20 p-4 relative z-10">
      <div className="flex items-center justify-between gap-4">
        {/* KPIs */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#CFAF6E]/20 text-[#CFAF6E] border-[#CFAF6E]/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              Profit: +$8.4M
            </Badge>
            <div className="text-xs text-[#CFAF6E]/60">▲ 23% vs last month</div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <AlertCircle className="w-3 h-3 mr-1" />
              Risk Score: 4.2
            </Badge>
            <div className="text-xs text-yellow-400/60">Low-Medium</div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-[#EDEDED]/20 text-[#EDEDED] border-[#EDEDED]/30">
              <Target className="w-3 h-3 mr-1" />
              Efficiency: 87%
            </Badge>
            <div className="text-xs text-[#EDEDED]/60">▲ 12% optimization potential</div>
          </div>
        </div>

        {/* Next Best Move */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-[#BFBFBF]">AI Confidence: 94%</div>
            <div className="text-sm font-semibold text-[#CFAF6E]">
              Rebalance APAC operations
            </div>
          </div>
          <Button className="bg-gradient-to-r from-[#CFAF6E] to-[#EDEDED] text-black font-semibold hover:opacity-90 shadow-lg shadow-[#CFAF6E]/20">
            <Zap className="w-4 h-4 mr-2" />
            Execute Best Move
          </Button>
        </div>
      </div>
    </div>
  );
};
