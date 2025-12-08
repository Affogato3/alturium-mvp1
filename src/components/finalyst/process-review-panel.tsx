import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Settings2, 
  Zap, 
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  GitBranch,
  Cog,
  ArrowRight,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisResult {
  content: string;
  timestamp: string;
  type: string;
}

export const ProcessReviewPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const processData = {
    processes: [
      {
        name: "Daily P&L Reconciliation",
        status: "needs_improvement",
        currentTime: "4.5 hours",
        targetTime: "1 hour",
        manualSteps: 12,
        automatedSteps: 3,
        errorRate: 2.3,
        painPoints: ["Multiple data sources", "Manual Excel manipulation", "Late data feeds"],
      },
      {
        name: "Trade Settlement",
        status: "good",
        currentTime: "2 hours",
        targetTime: "2 hours",
        manualSteps: 4,
        automatedSteps: 8,
        errorRate: 0.5,
        painPoints: ["Occasional counterparty delays"],
      },
      {
        name: "Regulatory Reporting",
        status: "critical",
        currentTime: "8 hours",
        targetTime: "3 hours",
        manualSteps: 18,
        automatedSteps: 2,
        errorRate: 4.1,
        painPoints: ["Manual data aggregation", "Multiple format requirements", "Version control issues"],
      },
      {
        name: "Client Onboarding",
        status: "needs_improvement",
        currentTime: "5 days",
        targetTime: "2 days",
        manualSteps: 25,
        automatedSteps: 5,
        errorRate: 1.8,
        painPoints: ["Document collection delays", "Manual KYC checks", "System integrations"],
      },
    ],
    automationOpportunities: [
      { area: "Data Extraction", potential: 85, complexity: "medium" },
      { area: "Report Generation", potential: 75, complexity: "low" },
      { area: "Reconciliation", potential: 90, complexity: "high" },
      { area: "Compliance Checks", potential: 60, complexity: "medium" },
    ],
    metrics: {
      totalProcesses: 24,
      fullyAutomated: 8,
      partiallyAutomated: 10,
      manual: 6,
      avgErrorRate: 2.1,
      potentialSavings: 1250000,
    },
  };

  const runAnalysis = async (type: string, title: string) => {
    setIsLoading(true);
    setLoadingType(type);

    try {
      const { data, error } = await supabase.functions.invoke("finalyst-analyze", {
        body: { 
          analysisType: type,
          data: processData,
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
      case "good": return "text-[#22C55E] border-[#22C55E]/30 bg-[#22C55E]/5";
      case "needs_improvement": return "text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/5";
      case "critical": return "text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/5";
      default: return "text-[#64748B] border-[#64748B]/30 bg-[#64748B]/5";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />;
      case "needs_improvement": return <AlertCircle className="w-5 h-5 text-[#F59E0B]" />;
      case "critical": return <AlertCircle className="w-5 h-5 text-[#EF4444]" />;
      default: return <Clock className="w-5 h-5 text-[#64748B]" />;
    }
  };

  const renderAnalysisContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.match(/^#{1,3}\s/) || line.match(/^[A-Z\s]{3,}:?$/)) {
        return (
          <h3 key={i} className="text-lg font-semibold text-[#F59E0B] mt-4 mb-2">
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
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#22C55E]/30 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#22C55E]/10">
              <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Fully Automated</p>
              <p className="text-2xl font-bold text-[#22C55E]">{processData.metrics.fullyAutomated}</p>
              <p className="text-xs text-[#64748B]">of {processData.metrics.totalProcesses} processes</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#F59E0B]/30 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#F59E0B]/10">
              <Cog className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Partial Automation</p>
              <p className="text-2xl font-bold text-[#F59E0B]">{processData.metrics.partiallyAutomated}</p>
              <p className="text-xs text-[#64748B]">needs enhancement</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#EF4444]/30 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#EF4444]/10">
              <AlertCircle className="w-6 h-6 text-[#EF4444]" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Manual Processes</p>
              <p className="text-2xl font-bold text-[#EF4444]">{processData.metrics.manual}</p>
              <p className="text-xs text-[#64748B]">automation candidates</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/60 border-[#8B5CF6]/30 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#8B5CF6]/10">
              <Zap className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Potential Savings</p>
              <p className="text-2xl font-bold text-[#8B5CF6]">${(processData.metrics.potentialSavings / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-[#64748B]">annually</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Process List */}
      <Card className="bg-[#0F172A]/60 border-[#F59E0B]/20 p-6">
        <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-[#F59E0B]" />
          Process Health Dashboard
        </h3>
        <div className="space-y-4">
          {processData.processes.map((process, i) => (
            <motion.div
              key={process.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-lg border ${getStatusColor(process.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(process.status)}
                  <div>
                    <p className="font-medium text-[#E2E8F0]">{process.name}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-[#64748B]">
                        Current: <span className="text-[#E2E8F0]">{process.currentTime}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#64748B]" />
                      <span className="text-[#64748B]">
                        Target: <span className="text-[#22C55E]">{process.targetTime}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#64748B]">
                    Steps: <span className="text-[#E2E8F0]">{process.manualSteps} manual / {process.automatedSteps} auto</span>
                  </p>
                  <p className="text-sm text-[#64748B]">
                    Error Rate: <span className={process.errorRate > 2 ? 'text-[#EF4444]' : 'text-[#22C55E]'}>
                      {process.errorRate}%
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {process.painPoints.map((point, j) => (
                  <span key={j} className="px-2 py-1 text-xs rounded-full bg-[#1E293B] text-[#94A3B8]">
                    {point}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Automation Opportunities */}
      <Card className="bg-[#0F172A]/60 border-[#8B5CF6]/20 p-6">
        <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#8B5CF6]" />
          Automation Opportunities
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {processData.automationOpportunities.map((opp, i) => (
            <motion.div
              key={opp.area}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg bg-[#1E293B]/40 border border-[#8B5CF6]/20"
            >
              <p className="text-sm font-medium text-[#E2E8F0]">{opp.area}</p>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#8B5CF6]">{opp.potential}%</p>
                  <p className="text-xs text-[#64748B]">automation potential</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  opp.complexity === 'low' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                  opp.complexity === 'medium' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                  'bg-[#EF4444]/10 text-[#EF4444]'
                }`}>
                  {opp.complexity}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4">
        <Button
          onClick={() => runAnalysis("process_review", "Full Process Assessment")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white h-14"
        >
          {loadingType === "process_review" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Settings2 className="w-5 h-5 mr-2" />
          )}
          Full Process Assessment
        </Button>

        <Button
          onClick={() => runAnalysis("process_review", "Automation Roadmap")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white h-14"
        >
          {isLoading && loadingType === "process_review" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Zap className="w-5 h-5 mr-2" />
          )}
          Automation Roadmap
        </Button>

        <Button
          onClick={() => runAnalysis("monthly_report", "Cost-Benefit Analysis")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white h-14"
        >
          {loadingType === "monthly_report" ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Lightbulb className="w-5 h-5 mr-2" />
          )}
          Cost-Benefit Analysis
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
            <Card className="bg-[#0F172A]/80 border-[#F59E0B]/30 overflow-hidden">
              <div className="bg-gradient-to-r from-[#F59E0B]/20 to-[#8B5CF6]/20 px-6 py-4 border-b border-[#F59E0B]/20">
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
