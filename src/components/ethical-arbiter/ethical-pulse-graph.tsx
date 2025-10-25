import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, RefreshCw, BarChart3, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const EthicalPulseGraph = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4 text-cyan-400" />
          <span className="text-cyan-400">Ethical Pulse</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pulse Waveform Visualization */}
        <div className="h-32 bg-gradient-to-br from-cyan-900/20 to-black rounded-lg border border-cyan-500/20 relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 200 50">
            <path
              d="M0,25 Q10,10 20,25 T40,25 Q50,15 60,25 T80,25 Q90,30 100,25 T120,25 Q130,20 140,25 T160,25 Q170,15 180,25 T200,25"
              fill="none"
              stroke="url(#pulse-gradient)"
              strokeWidth="2"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Health Score */}
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              89.3%
            </Badge>
          </div>
        </div>

        {/* Metric Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Privacy</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500" style={{ width: "92%" }} />
              </div>
              <span className="text-cyan-400 text-xs">92%</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Fairness</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500" style={{ width: "87%" }} />
              </div>
              <span className="text-cyan-400 text-xs">87%</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Carbon Impact</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: "94%" }} />
              </div>
              <span className="text-green-400 text-xs">94%</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Legality</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500" style={{ width: "96%" }} />
              </div>
              <span className="text-cyan-400 text-xs">96%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <BarChart3 className="h-3 w-3 mr-1" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
