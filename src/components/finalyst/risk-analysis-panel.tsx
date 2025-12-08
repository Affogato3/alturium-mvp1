import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Shield, 
  AlertTriangle, 
  Activity,
  Target,
  Loader2,
  TrendingDown,
  Gauge,
  Lock,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisResult {
  content: string;
  timestamp: string;
  type: string;
}

export const RiskAnalysisPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const riskData = {
    date: new Date().toISOString().split('T')[0],
    var: {
      historical: { value: 12500000, confidence: 95, period: "1-day" },
      parametric: { value: 11800000, confidence: 95, period: "1-day" },
      monteCarlo: { value: 13200000, confidence: 95, period: "1-day" },
    },
    limits: [
      { name: "Total VaR", current: 12500000, limit: 20000000, utilization: 62.5, status: "green" },
      { name: "Equity Delta", current: 45000000, limit: 75000000, utilization: 60, status: "green" },
      { name: "FX Exposure", current: 28000000, limit: 30000000, utilization: 93.3, status: "amber" },
      { name: "Single Name", current: 8500000, limit: 10000000, utilization: 85, status: "amber" },
      { name: "Credit Risk", current: 4200000, limit: 15000000, utilization: 28, status: "green" },
    ],
    concentration: [
      { type: "Top 5 Positions", exposure: 38, threshold: 40 },
      { type: "Technology Sector", exposure: 32, threshold: 35 },
      { type: "US Equities", exposure: 55, threshold: 60 },
      { type: "Single Counterparty", exposure: 12, threshold: 15 },
    ],
    stressTests: [
      { scenario: "Market Crash (-20%)", impact: -25000000, recovery: "3-6 months" },
      { scenario: "Rate Shock (+200bp)", impact: -8500000, recovery: "1-2 months" },
      { scenario: "FX Volatility", impact: -4200000, recovery: "2-4 weeks" },
      { scenario: "Liquidity Crisis", impact: -15000000, recovery: "2-3 months" },
    ],
    greeks: {
      delta: 45000000,
      gamma: 1200000,
      vega: 850000,
      theta: -125000,
    },
  };

  const runAnalysis = async (type: string, title: string) => {
    setIsLoading(true);
    setLoadingType(type);

    try {
      const { data, error } = await supabase.functions.invoke("finalyst-analyze", {
        body: { 
          analysisType: type,
          data: riskData,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "green": return "text-[#22C55E]";
      case "amber": return "text-[#F59E0B]";
      case "red": return "text-[#EF4444]";
      default: return "text-[#64748B]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "green": return "🟢";
      case "amber": return "🟡";
      case "red": return "🔴";
      default: return "⚪";
    }
  };

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const renderAnalysisContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.match(/^#{1,3}\s/) || line.match(/^[A-Z\s]{3,}:?$/)) {
        return (
          <h3 key={i} className="text-lg font-semibold text-[#EF4444] mt-4 mb-2">
            {line.replace(/^#{1,3}\s/, '')}
          </h3>
        );
      }
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        return (
          <p key={i} className="text-[#CBD5E1] ml-4 my-1 flex items-start gap-2">
            <span className="text-[#F59E0B] mt-1">•</span>
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
      {/* VaR Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#EF4444]/30 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#EF4444]/10">
              <Activity className="w-6 h-6 text-[#EF4444]" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Historical VaR (95%)</p>
              <p className="text-2xl font-bold text-[#EF4444]">{formatCurrency(riskData.var.historical.value)}</p>
              <p className="text-xs text-[#64748B]">1-Day</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#F59E0B]/30 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#F59E0B]/10">
              <Target className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Parametric VaR (95%)</p>
              <p className="text-2xl font-bold text-[#F59E0B]">{formatCurrency(riskData.var.parametric.value)}</p>
              <p className="text-xs text-[#64748B]">1-Day</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#8B5CF6]/30 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#8B5CF6]/10">
              <Gauge className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Monte Carlo VaR (95%)</p>
              <p className="text-2xl font-bold text-[#8B5CF6]">{formatCurrency(riskData.var.monteCarlo.value)}</p>
              <p className="text-xs text-[#64748B]">1-Day</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Limit Monitoring */}
      <Card className="bg-[#0F172A]/60 border-[#EF4444]/20 p-6">
        <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#EF4444]" />
          Limit Monitoring
        </h3>
        <div className="space-y-4">
          {riskData.limits.map((limit, i) => (
            <motion.div
              key={limit.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <span className="text-lg">{getStatusIcon(limit.status)}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#E2E8F0]">{limit.name}</span>
                  <span className={`text-sm font-medium ${getStatusColor(limit.status)}`}>
                    {limit.utilization.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={limit.utilization} 
                  className={`h-2 ${
                    limit.status === "green" ? "bg-[#22C55E]/20" :
                    limit.status === "amber" ? "bg-[#F59E0B]/20" : "bg-[#EF4444]/20"
                  }`}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-[#64748B]">{formatCurrency(limit.current)}</span>
                  <span className="text-xs text-[#64748B]">Limit: {formatCurrency(limit.limit)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Stress Tests */}
      <Card className="bg-[#0F172A]/60 border-[#F59E0B]/20 p-6">
        <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
          Stress Test Scenarios
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {riskData.stressTests.map((test, i) => (
            <motion.div
              key={test.scenario}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg bg-[#1E293B]/40 border border-[#EF4444]/20"
            >
              <p className="text-sm font-medium text-[#E2E8F0]">{test.scenario}</p>
              <p className="text-xl font-bold text-[#EF4444] mt-1">{formatCurrency(test.impact)}</p>
              <p className="text-xs text-[#64748B] mt-1">Recovery: {test.recovery}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Greeks */}
      <Card className="bg-[#0F172A]/60 border-[#8B5CF6]/20 p-6">
        <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#8B5CF6]" />
          Portfolio Greeks
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20">
            <p className="text-3xl font-bold text-[#3B82F6]">Δ</p>
            <p className="text-lg font-medium text-[#E2E8F0]">{formatCurrency(riskData.greeks.delta)}</p>
            <p className="text-xs text-[#64748B]">Delta</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20">
            <p className="text-3xl font-bold text-[#22C55E]">Γ</p>
            <p className="text-lg font-medium text-[#E2E8F0]">{formatCurrency(riskData.greeks.gamma)}</p>
            <p className="text-xs text-[#64748B]">Gamma</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
            <p className="text-3xl font-bold text-[#8B5CF6]">ν</p>
            <p className="text-lg font-medium text-[#E2E8F0]">{formatCurrency(riskData.greeks.vega)}</p>
            <p className="text-xs text-[#64748B]">Vega</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
            <p className="text-3xl font-bold text-[#EF4444]">Θ</p>
            <p className="text-lg font-medium text-[#E2E8F0]">{formatCurrency(riskData.greeks.theta)}</p>
            <p className="text-xs text-[#64748B]">Theta (daily)</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4">
        <Button
          onClick={() => runAnalysis("risk_analysis", "Full Risk Report")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white h-14"
        >
          {loadingType === "risk_analysis" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Shield className="w-5 h-5 mr-2" />
          )}
          Generate Risk Report
        </Button>

        <Button
          onClick={() => runAnalysis("variance_analysis", "Stress Test Analysis")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white h-14"
        >
          {loadingType === "variance_analysis" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <AlertTriangle className="w-5 h-5 mr-2" />
          )}
          Stress Test Analysis
        </Button>

        <Button
          onClick={() => runAnalysis("monthly_report", "Risk Summary for Management")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white h-14"
        >
          {loadingType === "monthly_report" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Lock className="w-5 h-5 mr-2" />
          )}
          Management Summary
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
            <Card className="bg-[#0F172A]/80 border-[#EF4444]/30 overflow-hidden">
              <div className="bg-gradient-to-r from-[#EF4444]/20 to-[#F59E0B]/20 px-6 py-4 border-b border-[#EF4444]/20">
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
