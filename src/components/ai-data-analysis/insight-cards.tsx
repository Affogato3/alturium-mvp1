import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, TrendingUp, Eye, Play, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Insight {
  id: string;
  observation: string;
  root_cause: string;
  recommendation: string;
  expected_outcome: string;
  confidence: number;
  priority: "high" | "medium" | "low";
}

export const InsightCards = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateInsights = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-insights');
      
      if (error) throw error;

      setInsights(data.insights || []);

      toast({
        title: "Insights Generated",
        description: `${data.insights?.length || 0} actionable insights ready`,
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-[#CFAF6E]/20 text-[#CFAF6E] border-[#CFAF6E]/30";
    }
  };

  return (
    <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#CFAF6E]/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-[#CFAF6E]" />
          <div>
            <h3 className="text-xl font-bold text-[#EDEDED]">AI Insight Cards</h3>
            <p className="text-sm text-[#BFBFBF]">Prioritized recommendations with impact</p>
          </div>
        </div>
        <Button
          onClick={generateInsights}
          disabled={isGenerating}
          className="bg-gradient-to-r from-[#CFAF6E] to-[#EDEDED] text-black hover:opacity-90"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Insights"}
        </Button>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {insights.map((insight, idx) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 bg-gradient-to-br from-[#1A1A1A]/80 to-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg hover:border-[#CFAF6E]/40 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge className={getPriorityColor(insight.priority)}>
                  {insight.priority} priority
                </Badge>
                <span className="text-xs text-[#BFBFBF]">
                  Confidence: <span className="text-[#CFAF6E] font-semibold">{insight.confidence}%</span>
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#CFAF6E]">🔍 Observation:</span>
                  </div>
                  <p className="text-sm text-[#EDEDED]">{insight.observation}</p>
                </div>

                <div>
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#CFAF6E]">🎯 Root Cause:</span>
                  </div>
                  <p className="text-sm text-[#BFBFBF]">{insight.root_cause}</p>
                </div>

                <div>
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#CFAF6E]">💡 Recommendation:</span>
                  </div>
                  <p className="text-sm text-[#EDEDED]">{insight.recommendation}</p>
                </div>

                <div>
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#CFAF6E]">💰 Expected Outcome:</span>
                  </div>
                  <p className="text-sm text-green-400">{insight.expected_outcome}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-[#CFAF6E]/10">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/10"
                >
                  <Eye className="w-3 h-3 mr-2" />
                  View Data
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-[#CFAF6E]/20 text-[#CFAF6E] hover:bg-[#CFAF6E]/30"
                >
                  <Play className="w-3 h-3 mr-2" />
                  Simulate
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-[#CFAF6E] to-green-400 text-black hover:opacity-90"
                >
                  <CheckCircle className="w-3 h-3 mr-2" />
                  Implement
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
