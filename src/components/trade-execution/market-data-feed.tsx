import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

interface MarketDataFeedProps {
  symbol: string;
}

export const MarketDataFeed = ({ symbol }: MarketDataFeedProps) => {
  const [liveData, setLiveData] = useState({
    bid: 180.25,
    ask: 180.27,
    last: 180.26,
    volume: 12543000,
    high: 182.45,
    low: 178.90,
    change: 2.35,
    changePercent: 1.32
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        bid: prev.bid + (Math.random() - 0.5) * 0.1,
        ask: prev.ask + (Math.random() - 0.5) * 0.1,
        last: prev.last + (Math.random() - 0.5) * 0.1,
        volume: prev.volume + Math.floor(Math.random() * 10000)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#E9E9E9] flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#D5B65C]" />
          Live Market Data
        </h3>
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
          ● Streaming
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
          <div className="text-xs text-[#9CA3AF] mb-1">Bid</div>
          <div className="text-lg font-semibold text-red-400">
            ${liveData.bid.toFixed(2)}
          </div>
        </div>

        <div className="p-3 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
          <div className="text-xs text-[#9CA3AF] mb-1">Ask</div>
          <div className="text-lg font-semibold text-green-400">
            ${liveData.ask.toFixed(2)}
          </div>
        </div>

        <div className="p-3 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
          <div className="text-xs text-[#9CA3AF] mb-1">Last</div>
          <div className="text-lg font-semibold text-[#E9E9E9]">
            ${liveData.last.toFixed(2)}
          </div>
        </div>

        <div className="p-3 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
          <div className="text-xs text-[#9CA3AF] mb-1">Change</div>
          <div className={`text-lg font-semibold flex items-center gap-1 ${liveData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {liveData.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {liveData.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
          <div className="text-xs text-[#9CA3AF] mb-1">High</div>
          <div className="text-sm font-medium text-[#E9E9E9]">
            ${liveData.high.toFixed(2)}
          </div>
        </div>

        <div className="p-3 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
          <div className="text-xs text-[#9CA3AF] mb-1">Low</div>
          <div className="text-sm font-medium text-[#E9E9E9]">
            ${liveData.low.toFixed(2)}
          </div>
        </div>

        <div className="p-3 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
          <div className="text-xs text-[#9CA3AF] mb-1">Volume</div>
          <div className="text-sm font-medium text-[#E9E9E9]">
            {(liveData.volume / 1000000).toFixed(2)}M
          </div>
        </div>
      </div>
    </div>
  );
};
