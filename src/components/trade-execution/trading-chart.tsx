import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Pencil, 
  Target,
  Ruler,
  Grid3x3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TradingChartProps {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
  onAnalysisUpdate: (data: any) => void;
}

export const TradingChart = ({ symbol, onSymbolChange, onAnalysisUpdate }: TradingChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<"line" | "area" | "candle">("area");
  const [timeframe, setTimeframe] = useState("1D");
  const [drawMode, setDrawMode] = useState<"none" | "trendline" | "fib" | "zone">("none");
  const [isLoading, setIsLoading] = useState(false);
  const [symbolInput, setSymbolInput] = useState(symbol);

  useEffect(() => {
    loadMarketData();
  }, [symbol, timeframe]);

  const loadMarketData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('market-data-aggregator', {
        body: { 
          symbols: [symbol],
          dataType: 'historical',
          timeframe 
        }
      });

      if (error) throw error;

      // Generate mock historical data for visualization
      const mockData = Array.from({ length: 100 }, (_, i) => {
        const basePrice = 150 + Math.random() * 50;
        const volatility = 5;
        return {
          time: new Date(Date.now() - (100 - i) * 3600000).toLocaleTimeString(),
          price: basePrice + (Math.random() - 0.5) * volatility,
          volume: Math.floor(Math.random() * 1000000),
          high: basePrice + Math.random() * volatility,
          low: basePrice - Math.random() * volatility,
          open: basePrice + (Math.random() - 0.5) * volatility,
          close: basePrice + (Math.random() - 0.5) * volatility,
        };
      });

      setChartData(mockData);
      
      const currentPrice = mockData[mockData.length - 1].price;
      const prevPrice = mockData[mockData.length - 2].price;
      const change = ((currentPrice - prevPrice) / prevPrice) * 100;

      onAnalysisUpdate({
        currentPrice,
        change,
        high: Math.max(...mockData.map(d => d.high)),
        low: Math.min(...mockData.map(d => d.low)),
        volume: mockData.reduce((sum, d) => sum + d.volume, 0)
      });

      toast.success("Market data loaded");
    } catch (error) {
      console.error('Error loading market data:', error);
      toast.error("Failed to load market data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymbolSubmit = () => {
    onSymbolChange(symbolInput.toUpperCase());
  };

  const renderChart = () => {
    if (chartType === "line") {
      return (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#272A40" />
          <XAxis dataKey="time" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#131316', 
              border: '1px solid #272A40',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#D5B65C" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      );
    } else if (chartType === "area") {
      return (
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D5B65C" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#D5B65C" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#272A40" />
          <XAxis dataKey="time" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#131316', 
              border: '1px solid #272A40',
              borderRadius: '8px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#D5B65C" 
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      );
    } else {
      return (
        <BarChart data={chartData.slice(-20)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#272A40" />
          <XAxis dataKey="time" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#131316', 
              border: '1px solid #272A40',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="volume" fill="#D5B65C" opacity={0.8} />
        </BarChart>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Input 
            value={symbolInput}
            onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSymbolSubmit()}
            placeholder="Symbol"
            className="w-32 bg-[#1A1A1A] border-[#272A40]"
          />
          <Button 
            onClick={handleSymbolSubmit}
            variant="outline"
            size="sm"
            className="bg-[#D5B65C]/10 border-[#D5B65C] text-[#D5B65C] hover:bg-[#D5B65C]/20"
          >
            Load
          </Button>
          <Badge variant="outline" className="bg-[#D5B65C]/10 text-[#D5B65C] border-[#D5B65C]/20">
            {symbol}
          </Badge>
        </div>

        <div className="flex gap-2">
          {["1D", "1W", "1M", "3M", "1Y"].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={timeframe === tf ? "bg-[#D5B65C] text-[#0B0B0D]" : ""}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      {/* Drawing Tools */}
      <div className="flex gap-2 border-b border-[#272A40] pb-4">
        <Button
          variant={drawMode === "trendline" ? "default" : "outline"}
          size="sm"
          onClick={() => setDrawMode("trendline")}
          className={drawMode === "trendline" ? "bg-[#D5B65C] text-[#0B0B0D]" : ""}
        >
          <Ruler className="h-4 w-4 mr-2" />
          Trendline
        </Button>
        <Button
          variant={drawMode === "fib" ? "default" : "outline"}
          size="sm"
          onClick={() => setDrawMode("fib")}
          className={drawMode === "fib" ? "bg-[#D5B65C] text-[#0B0B0D]" : ""}
        >
          <Target className="h-4 w-4 mr-2" />
          Fibonacci
        </Button>
        <Button
          variant={drawMode === "zone" ? "default" : "outline"}
          size="sm"
          onClick={() => setDrawMode("zone")}
          className={drawMode === "zone" ? "bg-[#D5B65C] text-[#0B0B0D]" : ""}
        >
          <Grid3x3 className="h-4 w-4 mr-2" />
          Support/Resistance
        </Button>
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-2">
        <Button
          variant={chartType === "line" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType("line")}
        >
          Line
        </Button>
        <Button
          variant={chartType === "area" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType("area")}
        >
          Area
        </Button>
        <Button
          variant={chartType === "candle" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType("candle")}
        >
          Volume
        </Button>
      </div>

      {/* Chart */}
      <div className="h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-[#9CA3AF]">Loading chart data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>

      {drawMode !== "none" && (
        <div className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
          <p className="text-sm text-[#9CA3AF]">
            <Pencil className="h-4 w-4 inline mr-2" />
            {drawMode === "trendline" && "Click two points on the chart to draw a trendline"}
            {drawMode === "fib" && "Click to set Fibonacci retracement levels"}
            {drawMode === "zone" && "Click and drag to mark support/resistance zones"}
          </p>
        </div>
      )}
    </div>
  );
};
