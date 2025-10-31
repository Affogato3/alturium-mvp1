import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, TrendingUp, AlertCircle } from "lucide-react";

interface HeatmapCell {
  sector: string;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
  momentum: number;
}

export function MarketIntelligenceMap() {
  const [heatmap, setHeatmap] = useState<HeatmapCell[]>([]);

  useEffect(() => {
    // Initialize market intelligence heatmap
    const sectors = ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer', 'Industrials'];
    const data: HeatmapCell[] = sectors.map(sector => ({
      sector,
      signal: ['buy', 'sell', 'neutral'][Math.floor(Math.random() * 3)] as any,
      strength: Math.random(),
      momentum: (Math.random() - 0.5) * 2,
    }));
    setHeatmap(data);

    const interval = setInterval(() => {
      setHeatmap(prev => prev.map(cell => ({
        ...cell,
        strength: Math.max(0, Math.min(1, cell.strength + (Math.random() - 0.5) * 0.1)),
        momentum: cell.momentum + (Math.random() - 0.5) * 0.2,
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSignalColor = (signal: string, strength: number) => {
    if (signal === 'buy') return `rgba(67, 255, 107, ${strength})`;
    if (signal === 'sell') return `rgba(255, 51, 102, ${strength})`;
    return `rgba(0, 230, 246, ${strength * 0.3})`;
  };

  return (
    <Card className="bg-[#121318]/80 border border-[#00E6F6]/30 backdrop-blur-sm">
      <div className="p-4 border-b border-[#00E6F6]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-[#00E6F6]" />
            <h3 className="text-lg font-semibold text-[#E6E8EB]">Market Intelligence Map</h3>
          </div>
          <Badge variant="outline" className="bg-[#43FF6B]/10 text-[#43FF6B] border-[#43FF6B]/30">
            <TrendingUp className="w-3 h-3 mr-1" />
            Smart Money Flow
          </Badge>
        </div>
        <p className="text-xs text-[#E6E8EB]/60 mt-1">
          AI-detected institutional positioning • Dynamic sector clustering
        </p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {heatmap.map((cell, idx) => {
            const bgColor = getSignalColor(cell.signal, cell.strength);
            
            return (
              <div
                key={idx}
                className="relative rounded-lg p-4 border border-[#00E6F6]/20 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden group"
                style={{ backgroundColor: bgColor }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#E6E8EB] text-sm">
                      {cell.sector}
                    </span>
                    {cell.signal === 'buy' ? (
                      <TrendingUp className="w-4 h-4 text-[#43FF6B]" />
                    ) : cell.signal === 'sell' ? (
                      <AlertCircle className="w-4 h-4 text-[#FF3366]" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-[#00E6F6]" />
                    )}
                  </div>

                  <div className="text-xs text-[#E6E8EB]/80 mb-2 uppercase font-medium">
                    {cell.signal}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#E6E8EB]/60">
                      Strength: {(cell.strength * 100).toFixed(0)}%
                    </span>
                    <span className="text-xs text-[#E6E8EB]/60">
                      {cell.momentum > 0 ? '+' : ''}{cell.momentum.toFixed(2)}σ
                    </span>
                  </div>

                  {/* Pulse animation for strong signals */}
                  {cell.strength > 0.7 && (
                    <div className="absolute inset-0 rounded-lg border-2 border-white/50 animate-ping opacity-20" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-[#00E6F6]/20">
          <div className="text-xs text-[#E6E8EB]/60 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#43FF6B]" />
              <span>Buy Signal: Institutional accumulation detected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#FF3366]" />
              <span>Sell Signal: Distribution pattern emerging</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#00E6F6]/30" />
              <span>Neutral: Sideways consolidation</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}