import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";

interface LiquidityNavigatorProps {
  timelinePosition: number;
  onTimelineChange: (value: number) => void;
}

export function LiquidityNavigator({ timelinePosition, onTimelineChange }: LiquidityNavigatorProps) {
  const getTimeLabel = (position: number) => {
    if (position <= 30) return `${position} Days`;
    if (position <= 180) return `${Math.round(position / 30)} Months`;
    return `${Math.round(position / 365)} Year${position > 365 ? 's' : ''}`;
  };

  const impactMetrics = [
    { label: "Cash Position", value: "$" + (145.2 + timelinePosition * 0.8).toFixed(1) + "M", trend: "up" },
    { label: "Debt Exposure", value: "$" + (89.4 - timelinePosition * 0.3).toFixed(1) + "M", trend: "down" },
    { label: "FX Risk", value: (8.7 - timelinePosition * 0.02).toFixed(1) + "%", trend: "down" },
    { label: "Yield Rate", value: (4.2 + timelinePosition * 0.015).toFixed(2) + "%", trend: "up" }
  ];

  return (
    <Card className="h-full p-4 bg-black/95 backdrop-blur-sm border-border space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[hsl(var(--cnl-flow))]" />
            Liquidity Navigator
          </h3>
          <Badge variant="outline" className="bg-card text-xs">
            {getTimeLabel(timelinePosition)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Simulate forward liquidity scenarios
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Now</span>
            <span>1 Year</span>
          </div>
          <Slider
            value={[timelinePosition]}
            onValueChange={(value) => onTimelineChange(value[0])}
            max={365}
            step={1}
            className="w-full"
          />
        </div>

        <div className="pt-2 border-t border-border">
          <h4 className="text-xs font-medium mb-3 flex items-center gap-2">
            <DollarSign className="w-3 h-3 text-[hsl(var(--cnl-profit))]" />
            Projected Impact
          </h4>
          <div className="space-y-2">
            {impactMetrics.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-card/50 border border-border/50">
                <div className="flex items-center gap-2">
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 text-[hsl(var(--cnl-profit))]" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-[hsl(var(--cnl-risk))]" />
                  )}
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <span className="text-xs font-semibold">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Liquidity Efficiency</span>
              <span className="font-semibold text-[hsl(var(--cnl-profit))]">
                {(87.3 + timelinePosition * 0.02).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-border/30 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[hsl(var(--cnl-flow))] to-[hsl(var(--cnl-profit))] transition-all duration-300"
                style={{ width: `${87.3 + timelinePosition * 0.02}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
