import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  RefreshCw,
  FileBarChart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  BarChart3,
  PieChart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisResult {
  content: string;
  timestamp: string;
  type: string;
}

export const DailyPnLPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const sampleTradingData = {
    date: new Date().toISOString().split('T')[0],
    desks: [
      { name: "Equities", pnl: 2450000, budget: 2000000, traders: 12, topPerformer: "J. Smith", topTrade: "+$890K on NVDA" },
      { name: "Fixed Income", pnl: -340000, budget: 500000, traders: 8, topPerformer: "M. Johnson", concern: "Duration risk" },
      { name: "FX", pnl: 780000, budget: 600000, traders: 6, topPerformer: "A. Williams", topTrade: "+$320K EUR/USD" },
      { name: "Commodities", pnl: 125000, budget: 200000, traders: 5, topPerformer: "R. Chen", topTrade: "+$95K Gold" },
      { name: "Derivatives", pnl: 1200000, budget: 800000, traders: 10, topPerformer: "K. Patel", topTrade: "+$450K SPX options" },
    ],
    totalPnL: 4215000,
    previousDay: 3800000,
    mtdPnL: 28500000,
    ytdPnL: 145000000,
    varUtilization: 0.72,
    sharpeRatio: 1.85,
  };

  const runAnalysis = async (type: string, title: string) => {
    setIsLoading(true);
    setLoadingType(type);

    try {
      const { data, error } = await supabase.functions.invoke("finalyst-analyze", {
        body: { 
          analysisType: type,
          data: sampleTradingData,
          context: title
        },
      });

      if (error) throw error;

      if (data?.content) {
        setResults(prev => [{
          content: data.content,
          timestamp: new Date().toISOString(),
          type: title
        }, ...prev]);
        toast.success(`${title} completed`);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const renderAnalysisContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.match(/^#{1,3}\s/) || line.match(/^[A-Z\s]{3,}:?$/)) {
        return (
          <h3 key={i} className="text-lg font-semibold text-[#3B82F6] mt-4 mb-2">
            {line.replace(/^#{1,3}\s/, '')}
          </h3>
        );
      }
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        return (
          <p key={i} className="text-[#CBD5E1] ml-4 my-1 flex items-start gap-2">
            <span className="text-[#8B5CF6] mt-1">•</span>
            <span>{line.replace(/^[•\-*]\s*/, '')}</span>
          </p>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <p key={i} className="text-[#CBD5E1] ml-4 my-1">
            <span className="text-[#22C55E] font-medium">{line.match(/^\d+\./)![0]}</span>
            {line.replace(/^\d+\.\s*/, ' ')}
          </p>
        );
      }
      if (line.trim()) {
        return <p key={i} className="text-[#94A3B8] my-2">{line}</p>;
      }
      return null;
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#22C55E]/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#64748B]">Today's P&L</p>
              <p className="text-2xl font-bold text-[#22C55E]">{formatCurrency(sampleTradingData.totalPnL)}</p>
              <p className="text-xs text-[#22C55E] flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +10.9% vs prior day
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#22C55E]/50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#3B82F6]/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#64748B]">MTD P&L</p>
              <p className="text-2xl font-bold text-[#3B82F6]">{formatCurrency(sampleTradingData.mtdPnL)}</p>
              <p className="text-xs text-[#3B82F6]">On track for target</p>
            </div>
            <BarChart3 className="w-8 h-8 text-[#3B82F6]/50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#8B5CF6]/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#64748B]">YTD P&L</p>
              <p className="text-2xl font-bold text-[#8B5CF6]">{formatCurrency(sampleTradingData.ytdPnL)}</p>
              <p className="text-xs text-[#8B5CF6]">Sharpe: {sampleTradingData.sharpeRatio}</p>
            </div>
            <PieChart className="w-8 h-8 text-[#8B5CF6]/50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#F59E0B]/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#64748B]">VaR Utilization</p>
              <p className="text-2xl font-bold text-[#F59E0B]">{(sampleTradingData.varUtilization * 100).toFixed(0)}%</p>
              <p className="text-xs text-[#F59E0B]">Within limits</p>
            </div>
            <DollarSign className="w-8 h-8 text-[#F59E0B]/50" />
          </div>
        </Card>
      </div>

      {/* Desk Breakdown */}
      <Card className="bg-[#0F172A]/60 border-[#3B82F6]/20 p-6">
        <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
          <FileBarChart className="w-5 h-5 text-[#3B82F6]" />
          Desk P&L Summary
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {sampleTradingData.desks.map((desk, i) => (
            <motion.div
              key={desk.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-lg border ${
                desk.pnl >= 0 
                  ? 'bg-[#22C55E]/5 border-[#22C55E]/20' 
                  : 'bg-[#EF4444]/5 border-[#EF4444]/20'
              }`}
            >
              <p className="text-sm font-medium text-[#E2E8F0]">{desk.name}</p>
              <p className={`text-xl font-bold ${desk.pnl >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {formatCurrency(desk.pnl)}
              </p>
              <p className="text-xs text-[#64748B] mt-1">Budget: {formatCurrency(desk.budget)}</p>
              <div className="mt-2 h-1 bg-[#1E293B] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${desk.pnl >= desk.budget ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'}`}
                  style={{ width: `${Math.min((desk.pnl / desk.budget) * 100, 100)}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-4">
        <Button
          onClick={() => runAnalysis("daily_pnl", "Full P&L Analysis")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white h-14"
        >
          {loadingType === "daily_pnl" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Calculator className="w-5 h-5 mr-2" />
          )}
          Generate Full P&L Report
        </Button>

        <Button
          onClick={() => runAnalysis("variance_analysis", "Variance Analysis")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white h-14"
        >
          {loadingType === "variance_analysis" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <TrendingUp className="w-5 h-5 mr-2" />
          )}
          Variance Analysis
        </Button>

        <Button
          onClick={() => runAnalysis("portfolio_attribution", "Attribution Analysis")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white h-14"
        >
          {loadingType === "portfolio_attribution" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <PieChart className="w-5 h-5 mr-2" />
          )}
          Attribution Analysis
        </Button>

        <Button
          onClick={() => setResults([])}
          disabled={isLoading || results.length === 0}
          variant="outline"
          className="border-[#64748B]/30 text-[#94A3B8] hover:bg-[#1E293B]/50 h-14"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Clear Results
        </Button>
      </div>

      {/* Results Display */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-[#0F172A]/80 border-[#3B82F6]/30 overflow-hidden">
              <div className="bg-gradient-to-r from-[#3B82F6]/20 to-[#8B5CF6]/20 px-6 py-4 border-b border-[#3B82F6]/20">
                <h3 className="text-lg font-semibold text-[#E2E8F0]">
                  {results[0].type}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Generated at {new Date(results[0].timestamp).toLocaleString()}
                </p>
              </div>
              <ScrollArea className="h-[500px] p-6">
                <div className="prose prose-invert max-w-none">
                  {renderAnalysisContent(results[0].content)}
                </div>
              </ScrollArea>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
