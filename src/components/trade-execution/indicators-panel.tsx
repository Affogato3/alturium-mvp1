import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TrendingUp, Activity, BarChart3 } from "lucide-react";

interface Indicator {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  value?: number;
  signal?: "buy" | "sell" | "neutral";
}

interface IndicatorsPanelProps {
  symbol: string;
}

export const IndicatorsPanel = ({ symbol }: IndicatorsPanelProps) => {
  const [indicators, setIndicators] = useState<Indicator[]>([
    { id: "ma20", name: "MA 20", category: "trend", enabled: true, value: 182.45, signal: "buy" },
    { id: "ma50", name: "MA 50", category: "trend", enabled: true, value: 175.23, signal: "neutral" },
    { id: "rsi", name: "RSI (14)", category: "momentum", enabled: true, value: 68.5, signal: "buy" },
    { id: "macd", name: "MACD", category: "momentum", enabled: false, value: 2.3, signal: "buy" },
    { id: "bb", name: "Bollinger Bands", category: "volatility", enabled: false },
    { id: "vwap", name: "VWAP", category: "volume", enabled: false, value: 180.12 },
  ]);

  const toggleIndicator = (id: string) => {
    setIndicators(indicators.map(ind => 
      ind.id === id ? { ...ind, enabled: !ind.enabled } : ind
    ));
  };

  const getSignalBadge = (signal?: string) => {
    if (!signal) return null;
    
    const colors = {
      buy: "bg-green-500/10 text-green-400 border-green-500/20",
      sell: "bg-red-500/10 text-red-400 border-red-500/20",
      neutral: "bg-gray-500/10 text-gray-400 border-gray-500/20"
    };

    return (
      <Badge variant="outline" className={colors[signal as keyof typeof colors]}>
        {signal.toUpperCase()}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      trend: <TrendingUp className="h-4 w-4" />,
      momentum: <Activity className="h-4 w-4" />,
      volatility: <BarChart3 className="h-4 w-4" />,
      volume: <BarChart3 className="h-4 w-4" />
    };
    return icons[category as keyof typeof icons];
  };

  const categories = Array.from(new Set(indicators.map(i => i.category)));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#E9E9E9] mb-4">Technical Indicators</h3>
        
        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h4 className="text-sm font-medium text-[#9CA3AF] mb-3 uppercase tracking-wide flex items-center gap-2">
              {getCategoryIcon(category)}
              {category}
            </h4>
            <div className="space-y-2">
              {indicators
                .filter(ind => ind.category === category)
                .map((indicator) => (
                  <div
                    key={indicator.id}
                    className="p-3 bg-[#1A1A1A] border border-[#272A40] rounded-lg flex items-center justify-between hover:border-[#D5B65C]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Switch
                        checked={indicator.enabled}
                        onCheckedChange={() => toggleIndicator(indicator.id)}
                      />
                      <div className="flex-1">
                        <Label className="text-sm text-[#E9E9E9]">{indicator.name}</Label>
                        {indicator.value && (
                          <p className="text-xs text-[#9CA3AF] mt-1">Value: {indicator.value}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSignalBadge(indicator.signal)}
                      {indicator.enabled && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
        <h4 className="text-sm font-medium text-[#E9E9E9] mb-3">Indicator Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#9CA3AF]">Buy Signals:</span>
            <span className="text-green-400 font-medium">
              {indicators.filter(i => i.enabled && i.signal === "buy").length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#9CA3AF]">Sell Signals:</span>
            <span className="text-red-400 font-medium">
              {indicators.filter(i => i.enabled && i.signal === "sell").length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#9CA3AF]">Neutral:</span>
            <span className="text-gray-400 font-medium">
              {indicators.filter(i => i.enabled && i.signal === "neutral").length}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[#272A40]">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#E9E9E9]">Overall Signal:</span>
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              BULLISH
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
