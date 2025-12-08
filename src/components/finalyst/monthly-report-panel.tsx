import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  FileText, 
  TrendingUp, 
  DollarSign,
  PieChart,
  BarChart3,
  Loader2,
  Download,
  Calendar,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisResult {
  content: string;
  timestamp: string;
  type: string;
}

export const MonthlyReportPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const financialData = {
    period: "November 2024",
    revenue: {
      total: 45600000,
      budget: 42000000,
      variance: 8.57,
      breakdown: [
        { category: "Trading Revenue", amount: 28500000, budget: 25000000 },
        { category: "Fee Income", amount: 12300000, budget: 12000000 },
        { category: "Interest Income", amount: 4800000, budget: 5000000 },
      ],
    },
    expenses: {
      total: 18200000,
      budget: 19500000,
      variance: -6.67,
      breakdown: [
        { category: "Compensation", amount: 9500000, budget: 10000000 },
        { category: "Technology", amount: 3200000, budget: 3500000 },
        { category: "Operations", amount: 2800000, budget: 3000000 },
        { category: "Compliance", amount: 1500000, budget: 1800000 },
        { category: "Other", amount: 1200000, budget: 1200000 },
      ],
    },
    netIncome: 27400000,
    kpis: [
      { name: "ROE", value: 18.5, target: 15, unit: "%" },
      { name: "Cost/Income", value: 39.9, target: 45, unit: "%" },
      { name: "Sharpe Ratio", value: 1.85, target: 1.5, unit: "" },
      { name: "AUM Growth", value: 12.3, target: 10, unit: "%" },
    ],
    cashFlow: {
      operating: 32500000,
      investing: -8500000,
      financing: -12000000,
      net: 12000000,
    },
    headcount: {
      current: 245,
      previous: 238,
      open: 12,
    },
  };

  const runAnalysis = async (type: string, title: string) => {
    setIsLoading(true);
    setLoadingType(type);

    try {
      const { data, error } = await supabase.functions.invoke("finalyst-analyze", {
        body: { 
          analysisType: type,
          data: financialData,
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
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const renderAnalysisContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.match(/^#{1,3}\s/) || line.match(/^[A-Z\s]{3,}:?$/)) {
        return (
          <h3 key={i} className="text-lg font-semibold text-[#22C55E] mt-4 mb-2">
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
      {/* Period Header */}
      <Card className="bg-gradient-to-r from-[#22C55E]/10 to-[#3B82F6]/10 border-[#22C55E]/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-[#22C55E]" />
            <div>
              <p className="text-lg font-semibold text-[#E2E8F0]">Monthly Financial Report</p>
              <p className="text-sm text-[#64748B]">{financialData.period}</p>
            </div>
          </div>
          <Button variant="outline" className="border-[#22C55E]/30 text-[#22C55E]">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#22C55E]/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#64748B]">Total Revenue</p>
              <p className="text-2xl font-bold text-[#22C55E]">{formatCurrency(financialData.revenue.total)}</p>
              <p className="text-xs text-[#22C55E]">+{financialData.revenue.variance.toFixed(1)}% vs budget</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#22C55E]/50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#3B82F6]/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#64748B]">Total Expenses</p>
              <p className="text-2xl font-bold text-[#3B82F6]">{formatCurrency(financialData.expenses.total)}</p>
              <p className="text-xs text-[#22C55E]">{financialData.expenses.variance.toFixed(1)}% vs budget</p>
            </div>
            <BarChart3 className="w-8 h-8 text-[#3B82F6]/50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#8B5CF6]/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#64748B]">Net Income</p>
              <p className="text-2xl font-bold text-[#8B5CF6]">{formatCurrency(financialData.netIncome)}</p>
              <p className="text-xs text-[#8B5CF6]">60.1% margin</p>
            </div>
            <DollarSign className="w-8 h-8 text-[#8B5CF6]/50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#F59E0B]/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#64748B]">Net Cash Flow</p>
              <p className="text-2xl font-bold text-[#F59E0B]">{formatCurrency(financialData.cashFlow.net)}</p>
              <p className="text-xs text-[#F59E0B]">Positive position</p>
            </div>
            <PieChart className="w-8 h-8 text-[#F59E0B]/50" />
          </div>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card className="bg-[#0F172A]/60 border-[#22C55E]/20 p-6">
        <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#22C55E]" />
          Revenue Breakdown
        </h3>
        <div className="space-y-3">
          {financialData.revenue.breakdown.map((item, i) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#E2E8F0]">{item.category}</span>
                  <span className="text-sm font-medium text-[#22C55E]">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
                <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#22C55E] to-[#16A34A]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.amount / item.budget) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
                <p className="text-xs text-[#64748B] mt-1">
                  Budget: {formatCurrency(item.budget)} ({((item.amount / item.budget - 1) * 100).toFixed(1)}%)
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* KPIs */}
      <Card className="bg-[#0F172A]/60 border-[#3B82F6]/20 p-6">
        <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-[#3B82F6]" />
          Key Performance Indicators
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {financialData.kpis.map((kpi, i) => (
            <motion.div
              key={kpi.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-lg border ${
                kpi.value >= kpi.target 
                  ? 'bg-[#22C55E]/5 border-[#22C55E]/20' 
                  : 'bg-[#F59E0B]/5 border-[#F59E0B]/20'
              }`}
            >
              <p className="text-sm text-[#64748B]">{kpi.name}</p>
              <p className={`text-2xl font-bold ${
                kpi.value >= kpi.target ? 'text-[#22C55E]' : 'text-[#F59E0B]'
              }`}>
                {kpi.value}{kpi.unit}
              </p>
              <p className="text-xs text-[#64748B]">Target: {kpi.target}{kpi.unit}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-4">
        <Button
          onClick={() => runAnalysis("monthly_report", "Full Monthly Report")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white h-14"
        >
          {loadingType === "monthly_report" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <FileText className="w-5 h-5 mr-2" />
          )}
          Generate Full Report
        </Button>

        <Button
          onClick={() => runAnalysis("variance_analysis", "Budget Variance Analysis")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white h-14"
        >
          {loadingType === "variance_analysis" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <BarChart3 className="w-5 h-5 mr-2" />
          )}
          Variance Analysis
        </Button>

        <Button
          onClick={() => runAnalysis("portfolio_attribution", "KPI Deep Dive")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white h-14"
        >
          {loadingType === "portfolio_attribution" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Target className="w-5 h-5 mr-2" />
          )}
          KPI Analysis
        </Button>

        <Button
          onClick={() => runAnalysis("market_commentary", "Executive Summary")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white h-14"
        >
          {loadingType === "market_commentary" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <DollarSign className="w-5 h-5 mr-2" />
          )}
          Executive Summary
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
            <Card className="bg-[#0F172A]/80 border-[#22C55E]/30 overflow-hidden">
              <div className="bg-gradient-to-r from-[#22C55E]/20 to-[#3B82F6]/20 px-6 py-4 border-b border-[#22C55E]/20">
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
