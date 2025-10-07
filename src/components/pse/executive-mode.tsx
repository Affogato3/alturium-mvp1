import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Target } from "lucide-react";

export const ExecutiveMode = () => {
  return (
    <div className="grid grid-cols-3 gap-6 p-8">
      {/* Live Profit Index */}
      <Card className="bg-gradient-to-br from-black/80 to-gray-900/80 border-primary/20 p-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-white">Live Profit Index</h2>
        </div>

        <div className="space-y-6">
          <div>
            <div className="text-sm text-primary/60 mb-2">Current Singularity</div>
            <div className="text-6xl font-bold text-primary mb-2">97.3%</div>
            <Badge className="bg-green-400/20 text-green-400 border-green-400/40">
              +2.4% vs Yesterday
            </Badge>
          </div>

          <div className="pt-6 border-t border-primary/10">
            <div className="text-sm text-primary/60 mb-3">Profit Velocity</div>
            <div className="text-3xl font-bold text-white">$847K/hour</div>
          </div>

          <div className="pt-6 border-t border-primary/10">
            <div className="text-sm text-primary/60 mb-3">Global Stability</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-white">72.4%</div>
              <Badge variant="outline" className="text-green-400 border-green-400/40">
                STABLE
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Decisions Summary */}
      <Card className="bg-gradient-to-br from-black/80 to-gray-900/80 border-primary/20 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-white">Active Decisions</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-black/40 rounded-lg border border-primary/10">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm font-bold text-white">M&A Pathfinder</div>
              <Badge className="bg-green-400/20 text-green-400 border-green-400/40">
                RUNNING
              </Badge>
            </div>
            <div className="text-xs text-primary/60 mb-3">
              Structuring $2.4B Energy Merger
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary/40">Impact</span>
              <span className="text-green-400 font-bold">+3.2%</span>
            </div>
          </div>

          <div className="p-4 bg-black/40 rounded-lg border border-primary/10">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm font-bold text-white">Supply Optimizer</div>
              <Badge className="bg-green-400/20 text-green-400 border-green-400/40">
                RUNNING
              </Badge>
            </div>
            <div className="text-xs text-primary/60 mb-3">
              Q2 Logistics Route Optimization
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary/40">Impact</span>
              <span className="text-green-400 font-bold">+4.7%</span>
            </div>
          </div>

          <div className="p-4 bg-black/40 rounded-lg border border-primary/10">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm font-bold text-white">Revenue Maximizer</div>
              <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/40">
                SIMULATING
              </Badge>
            </div>
            <div className="text-xs text-primary/60 mb-3">
              Dynamic Pricing Across 47 Markets
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary/40">Potential</span>
              <span className="text-green-400 font-bold">+2.1%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Projected Daily Gains */}
      <Card className="bg-gradient-to-br from-black/80 to-gray-900/80 border-primary/20 p-8">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-white">Projected Gains</h2>
        </div>

        <div className="space-y-6">
          <div>
            <div className="text-sm text-primary/60 mb-2">Today's Forecast</div>
            <div className="text-6xl font-bold text-green-400 mb-2">$18.4M</div>
            <Badge className="bg-green-400/20 text-green-400 border-green-400/40">
              +127% vs Baseline
            </Badge>
          </div>

          <div className="pt-6 border-t border-primary/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary/60">7-Day Projection</span>
              <span className="text-xl font-bold text-white">$134.2M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary/60">30-Day Projection</span>
              <span className="text-xl font-bold text-white">$586.7M</span>
            </div>
          </div>

          <div className="pt-6 border-t border-primary/10">
            <div className="text-sm text-primary/60 mb-3">Confidence Level</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-white">94.3%</div>
              <Badge variant="outline" className="text-primary border-primary/40">
                HIGH
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
