import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Globe, 
  TrendingUp, 
  TrendingDown,
  Newspaper,
  BarChart3,
  Loader2,
  FileText,
  Zap,
  Building2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisResult {
  content: string;
  timestamp: string;
  type: string;
}

export const MarketCommentaryPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const marketData = {
    date: new Date().toISOString().split('T')[0],
    indices: [
      { name: "S&P 500", value: 5234.18, change: 1.23, ytd: 12.4 },
      { name: "NASDAQ", value: 16742.89, change: 1.78, ytd: 18.2 },
      { name: "DOW", value: 39127.14, change: 0.89, ytd: 8.7 },
      { name: "VIX", value: 14.23, change: -5.2, ytd: -22.1 },
    ],
    sectors: [
      { name: "Technology", change: 2.1, leader: "NVDA +4.2%" },
      { name: "Healthcare", change: 0.8, leader: "LLY +2.1%" },
      { name: "Financials", change: 1.2, leader: "JPM +1.8%" },
      { name: "Energy", change: -0.5, laggard: "XOM -1.2%" },
      { name: "Consumer", change: 0.6, leader: "AMZN +1.5%" },
    ],
    currencies: [
      { pair: "EUR/USD", value: 1.0892, change: 0.15 },
      { pair: "GBP/USD", value: 1.2734, change: 0.22 },
      { pair: "USD/JPY", value: 151.23, change: -0.18 },
    ],
    commodities: [
      { name: "Gold", value: 2342.50, change: 0.45 },
      { name: "Oil (WTI)", value: 78.45, change: -1.2 },
      { name: "Natural Gas", value: 2.15, change: 3.2 },
    ],
    keyEvents: [
      "Fed minutes released - dovish tone",
      "Tech earnings beat expectations",
      "China PMI data positive",
      "ECB holds rates steady",
    ],
  };

  const runAnalysis = async (type: string, title: string) => {
    setIsLoading(true);
    setLoadingType(type);

    try {
      const { data, error } = await supabase.functions.invoke("finalyst-analyze", {
        body: { 
          analysisType: type,
          data: marketData,
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

  const renderAnalysisContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.match(/^#{1,3}\s/) || line.match(/^[A-Z\s]{3,}:?$/)) {
        return (
          <h3 key={i} className="text-lg font-semibold text-[#8B5CF6] mt-4 mb-2">
            {line.replace(/^#{1,3}\s/, '')}
          </h3>
        );
      }
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        return (
          <p key={i} className="text-[#CBD5E1] ml-4 my-1 flex items-start gap-2">
            <span className="text-[#3B82F6] mt-1">•</span>
            <span>{line.replace(/^[•\-*]\s*/, '')}</span>
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
      {/* Market Overview */}
      <div className="grid grid-cols-4 gap-4">
        {marketData.indices.map((index, i) => (
          <motion.div
            key={index.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 p-4 border ${
              index.change >= 0 ? 'border-[#22C55E]/30' : 'border-[#EF4444]/30'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#64748B]">{index.name}</p>
                  <p className="text-xl font-bold text-[#E2E8F0]">
                    {index.value.toLocaleString()}
                  </p>
                  <p className={`text-sm flex items-center gap-1 ${
                    index.change >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                  }`}>
                    {index.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {index.change >= 0 ? '+' : ''}{index.change}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#64748B]">YTD</p>
                  <p className={`text-sm font-medium ${
                    index.ytd >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                  }`}>
                    {index.ytd >= 0 ? '+' : ''}{index.ytd}%
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Sector Performance */}
      <Card className="bg-[#0F172A]/60 border-[#8B5CF6]/20 p-6">
        <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#8B5CF6]" />
          Sector Performance
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {marketData.sectors.map((sector, i) => (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-3 rounded-lg border ${
                sector.change >= 0 
                  ? 'bg-[#22C55E]/5 border-[#22C55E]/20' 
                  : 'bg-[#EF4444]/5 border-[#EF4444]/20'
              }`}
            >
              <p className="text-sm font-medium text-[#E2E8F0]">{sector.name}</p>
              <p className={`text-lg font-bold ${
                sector.change >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
              }`}>
                {sector.change >= 0 ? '+' : ''}{sector.change}%
              </p>
              <p className="text-xs text-[#64748B] mt-1 truncate">
                {sector.leader || sector.laggard}
              </p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Key Events */}
      <Card className="bg-[#0F172A]/60 border-[#F59E0B]/20 p-6">
        <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#F59E0B]" />
          Key Market Events
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {marketData.keyEvents.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-[#1E293B]/40 border border-[#F59E0B]/10"
            >
              <Newspaper className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
              <p className="text-sm text-[#CBD5E1]">{event}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4">
        <Button
          onClick={() => runAnalysis("market_commentary", "Full Market Commentary")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white h-14"
        >
          {loadingType === "market_commentary" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Globe className="w-5 h-5 mr-2" />
          )}
          Generate Market Commentary
        </Button>

        <Button
          onClick={() => runAnalysis("portfolio_attribution", "Portfolio Impact Analysis")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white h-14"
        >
          {loadingType === "portfolio_attribution" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <BarChart3 className="w-5 h-5 mr-2" />
          )}
          Portfolio Impact
        </Button>

        <Button
          onClick={() => runAnalysis("monthly_report", "Executive Brief")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white h-14"
        >
          {loadingType === "monthly_report" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <FileText className="w-5 h-5 mr-2" />
          )}
          Executive Brief
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
            <Card className="bg-[#0F172A]/80 border-[#8B5CF6]/30 overflow-hidden">
              <div className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#3B82F6]/20 px-6 py-4 border-b border-[#8B5CF6]/20">
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
