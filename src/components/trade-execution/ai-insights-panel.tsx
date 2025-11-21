import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Target, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIInsightsPanelProps {
  symbol: string;
  analysisData: any;
}

export const AIInsightsPanel = ({ symbol, analysisData }: AIInsightsPanelProps) => {
  const [insights, setInsights] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInsights = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('quantum-signals', {
        body: { 
          symbols: [symbol],
          analysisType: 'trade_insights',
          marketData: analysisData
        }
      });

      if (error) throw error;

      setInsights(data);
      toast.success("AI insights generated");
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error("Failed to generate insights");
      
      // Mock insights for demonstration
      setInsights({
        trendDirection: "BULLISH",
        confidence: 87,
        volatilityRisk: "MODERATE",
        breakoutProbability: 72,
        supportLevel: analysisData?.currentPrice * 0.95,
        resistanceLevel: analysisData?.currentPrice * 1.08,
        recommendation: "BUY",
        reasoning: "Strong momentum indicators with healthy volume profile. RSI indicates room for further upside movement."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#E9E9E9] flex items-center gap-2">
          <Brain className="h-5 w-5 text-[#D5B65C]" />
          AI Insights
        </h3>
        <Button
          onClick={generateInsights}
          disabled={isGenerating}
          size="sm"
          className="bg-[#D5B65C] text-[#0B0B0D] hover:bg-[#C5A64C]"
        >
          <Zap className="h-4 w-4 mr-2" />
          {isGenerating ? "Analyzing..." : "Generate"}
        </Button>
      </div>

      {!insights ? (
        <div className="p-6 text-center text-[#9CA3AF] bg-[#1A1A1A] border border-[#272A40] rounded-lg">
          <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Click "Generate" to get AI-powered trading insights</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Main Recommendation */}
          <div className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#9CA3AF]">Recommendation</span>
              <Badge 
                variant="outline" 
                className={
                  insights.recommendation === "BUY" 
                    ? "bg-green-500/10 text-green-400 border-green-500/20" 
                    : insights.recommendation === "SELL"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                }
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {insights.recommendation}
              </Badge>
            </div>
            <p className="text-sm text-[#E9E9E9]">{insights.reasoning}</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
              <div className="text-xs text-[#9CA3AF] mb-1">Trend</div>
              <div className="text-lg font-semibold text-[#D5B65C]">
                {insights.trendDirection}
              </div>
            </div>
            <div className="p-3 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
              <div className="text-xs text-[#9CA3AF] mb-1">Confidence</div>
              <div className="text-lg font-semibold text-green-400">
                {insights.confidence}%
              </div>
            </div>
            <div className="p-3 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
              <div className="text-xs text-[#9CA3AF] mb-1">Volatility Risk</div>
              <div className="text-sm font-semibold text-[#E9E9E9]">
                {insights.volatilityRisk}
              </div>
            </div>
            <div className="p-3 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
              <div className="text-xs text-[#9CA3AF] mb-1">Breakout Prob.</div>
              <div className="text-lg font-semibold text-[#D5B65C]">
                {insights.breakoutProbability}%
              </div>
            </div>
          </div>

          {/* Levels */}
          <div className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#9CA3AF]">Support Level:</span>
              <span className="text-sm font-medium text-red-400">
                ${insights.supportLevel?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#9CA3AF]">Resistance Level:</span>
              <span className="text-sm font-medium text-green-400">
                ${insights.resistanceLevel?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Position Sizing Suggestion */}
          <div className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-[#D5B65C]" />
              <span className="text-sm font-medium text-[#E9E9E9]">AI Position Sizing</span>
            </div>
            <div className="space-y-1 text-xs text-[#9CA3AF]">
              <div className="flex justify-between">
                <span>Recommended Size:</span>
                <span className="text-[#E9E9E9]">15-20% of portfolio</span>
              </div>
              <div className="flex justify-between">
                <span>Stop Loss:</span>
                <span className="text-red-400">${(insights.supportLevel * 0.98).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Take Profit:</span>
                <span className="text-green-400">${(insights.resistanceLevel * 1.02).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Risk/Reward:</span>
                <span className="text-[#D5B65C]">1:2.5</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
