import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, TrendingUp, AlertTriangle, Info } from "lucide-react";

interface Insight {
  id: string;
  type: 'prediction' | 'alert' | 'recommendation';
  message: string;
  confidence: number;
  timestamp: Date;
}

export function InsightNarrator() {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    // Initialize with sample insights
    const initialInsights: Insight[] = [
      {
        id: '1',
        type: 'prediction',
        message: 'TSLA likely to breakout +4.2% in next 72h. Strong accumulation pattern detected with 87% confidence.',
        confidence: 0.87,
        timestamp: new Date(),
      },
      {
        id: '2',
        type: 'alert',
        message: 'Institutional sell-off likely in Tech within 48 hours. Recommend rebalancing 12% to Energy sector.',
        confidence: 0.82,
        timestamp: new Date(Date.now() - 300000),
      },
      {
        id: '3',
        type: 'recommendation',
        message: 'Supplier stock drop detected for AAPL supply chain. Consider hedging commodity exposure.',
        confidence: 0.75,
        timestamp: new Date(Date.now() - 600000),
      },
    ];

    setInsights(initialInsights);

    // Add new insights periodically
    const interval = setInterval(() => {
      const messages = [
        'Market volatility rising in Finance sector. VIX correlation increasing.',
        'Positive sentiment surge detected for GOOGL. News momentum accelerating.',
        'Cross-sector correlation breakdown between Tech and Consumer.',
        'Insider buying cluster detected in Healthcare. 3 coordinated transactions.',
        'Macro liquidity improving. Fed rate expectations shifting dovish.',
      ];

      const types: ('prediction' | 'alert' | 'recommendation')[] = ['prediction', 'alert', 'recommendation'];
      const newInsight: Insight = {
        id: Date.now().toString(),
        type: types[Math.floor(Math.random() * types.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        confidence: 0.65 + Math.random() * 0.3,
        timestamp: new Date(),
      };

      setInsights(prev => [newInsight, ...prev].slice(0, 10));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return <TrendingUp className="w-4 h-4 text-[#00E6F6]" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-[#FFA500]" />;
      case 'recommendation':
        return <Info className="w-4 h-4 text-[#43FF6B]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#00E6F6]" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'prediction':
        return { bg: 'bg-[#00E6F6]/10', border: 'border-[#00E6F6]/30', text: 'text-[#00E6F6]' };
      case 'alert':
        return { bg: 'bg-[#FFA500]/10', border: 'border-[#FFA500]/30', text: 'text-[#FFA500]' };
      case 'recommendation':
        return { bg: 'bg-[#43FF6B]/10', border: 'border-[#43FF6B]/30', text: 'text-[#43FF6B]' };
      default:
        return { bg: 'bg-[#00E6F6]/10', border: 'border-[#00E6F6]/30', text: 'text-[#00E6F6]' };
    }
  };

  return (
    <Card className="bg-[#121318]/80 border border-[#00E6F6]/30 backdrop-blur-sm h-full">
      <div className="p-4 border-b border-[#00E6F6]/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#00E6F6] animate-pulse" />
          <h3 className="text-lg font-semibold text-[#E6E8EB]">AI Insight Narrator</h3>
        </div>
        <p className="text-xs text-[#E6E8EB]/60 mt-1">
          Real-time market intelligence • Neural network analysis
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-400px)]">
        <div className="p-4 space-y-3">
          {insights.map((insight, idx) => {
            const colors = getInsightColor(insight.type);
            const icon = getInsightIcon(insight.type);

            return (
              <div
                key={insight.id}
                className={`${colors.bg} ${colors.border} border rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-fade-in`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">{icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={`${colors.bg} ${colors.text} ${colors.border} text-xs`}>
                        {insight.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-[#E6E8EB]/60">
                        {Math.floor((Date.now() - insight.timestamp.getTime()) / 60000)}m ago
                      </span>
                    </div>
                    <p className="text-sm text-[#E6E8EB] leading-relaxed">
                      {insight.message}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-[#00E6F6]/20">
                        <div
                          className={`h-full rounded-full ${colors.bg}`}
                          style={{ width: `${insight.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#E6E8EB]/60">
                        {(insight.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}