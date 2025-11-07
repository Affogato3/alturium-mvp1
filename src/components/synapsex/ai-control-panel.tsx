import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, Zap, Search, TrendingUp, Database, 
  Shield, Target, BarChart3, Sparkles, Network 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIResult {
  title: string;
  data: any;
  timestamp: Date;
}

export const AIControlPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState<AIResult | null>(null);
  const { toast } = useToast();

  const executeAIAnalysis = async (analysisType: string, title: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('synapsex-ai-analyze', {
        body: { analysisType, inputData: {} }
      });

      if (error) throw error;

      setCurrentResult({
        title,
        data: data.result,
        timestamp: new Date()
      });
      setShowResult(true);

      toast({
        title: "AI Analysis Complete",
        description: `${title} completed successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResultContent = () => {
    if (!currentResult) return null;

    const { data } = currentResult;

    // Handle narrative/text responses
    if (data.type === 'narrative' && data.content) {
      return (
        <div className="prose prose-invert max-w-none">
          <div className="text-[#EDEDED] whitespace-pre-wrap leading-relaxed">
            {data.content.split('\n').map((line: string, idx: number) => {
              // Handle markdown-style headers
              if (line.startsWith('**') && line.endsWith('**')) {
                const text = line.replace(/\*\*/g, '');
                return (
                  <h3 key={idx} className="text-[#CFAF6E] font-bold text-lg mt-4 mb-2">
                    {text}
                  </h3>
                );
              }
              // Handle bullet points
              if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                return (
                  <p key={idx} className="text-[#BFBFBF] ml-4 my-1">
                    {line}
                  </p>
                );
              }
              // Handle numbered lists
              if (/^\d+\./.test(line.trim())) {
                return (
                  <p key={idx} className="text-[#BFBFBF] ml-4 my-1 font-medium">
                    {line}
                  </p>
                );
              }
              // Regular paragraphs
              if (line.trim()) {
                return (
                  <p key={idx} className="text-[#EDEDED] my-2">
                    {line}
                  </p>
                );
              }
              return <br key={idx} />;
            })}
          </div>
        </div>
      );
    }

    // Fallback for any legacy structured data
    return (
      <div className="text-[#BFBFBF] text-sm">
        Analysis complete. Results processed successfully.
      </div>
    );
  };

  return (
    <>
      <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#CFAF6E]/20 p-6">
        <h3 className="text-xl font-bold text-[#EDEDED] mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#CFAF6E]" />
          AI Command Center
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => executeAIAnalysis('generate_insights', 'AI Insights Generation')}
            disabled={isLoading}
            className="bg-[#1A1A1A]/50 border border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/20 hover:border-[#CFAF6E]/60 transition-all duration-300 shadow-lg hover:shadow-[#CFAF6E]/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Insights
          </Button>

          <Button
            onClick={() => executeAIAnalysis('optimize_profit', 'Profit Optimization')}
            disabled={isLoading}
            className="bg-[#1A1A1A]/50 border border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/20 hover:border-[#CFAF6E]/60 transition-all duration-300 shadow-lg hover:shadow-[#CFAF6E]/20"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Optimize Profit
          </Button>

          <Button
            onClick={() => executeAIAnalysis('detect_waste', 'Waste Detection')}
            disabled={isLoading}
            className="bg-[#1A1A1A]/50 border border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/20 hover:border-[#CFAF6E]/60 transition-all duration-300 shadow-lg hover:shadow-[#CFAF6E]/20"
          >
            <Search className="w-4 h-4 mr-2" />
            Detect Waste
          </Button>

          <Button
            onClick={() => executeAIAnalysis('calculate_trust_score', 'Trust Score Calculation')}
            disabled={isLoading}
            className="bg-[#1A1A1A]/50 border border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/20 hover:border-[#CFAF6E]/60 transition-all duration-300 shadow-lg hover:shadow-[#CFAF6E]/20"
          >
            <Shield className="w-4 h-4 mr-2" />
            Trust Score
          </Button>

          <Button
            onClick={() => executeAIAnalysis('generate_scenarios', 'Scenario Generation')}
            disabled={isLoading}
            className="bg-[#1A1A1A]/50 border border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/20 hover:border-[#CFAF6E]/60 transition-all duration-300 shadow-lg hover:shadow-[#CFAF6E]/20"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Scenarios
          </Button>

          <Button
            onClick={() => executeAIAnalysis('entity_resolution', 'Entity Resolution')}
            disabled={isLoading}
            className="bg-[#1A1A1A]/50 border border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/20 hover:border-[#CFAF6E]/60 transition-all duration-300 shadow-lg hover:shadow-[#CFAF6E]/20"
          >
            <Network className="w-4 h-4 mr-2" />
            Resolve Entities
          </Button>

          <Button
            onClick={() => executeAIAnalysis('data_quality_scan', 'Data Quality Scan')}
            disabled={isLoading}
            className="bg-[#1A1A1A]/50 border border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/20 hover:border-[#CFAF6E]/60 transition-all duration-300 shadow-lg hover:shadow-[#CFAF6E]/20"
          >
            <Database className="w-4 h-4 mr-2" />
            Scan Data Quality
          </Button>

          <Button
            onClick={() => executeAIAnalysis('predictive_maintenance', 'Predictive Maintenance')}
            disabled={isLoading}
            className="bg-[#1A1A1A]/50 border border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/20 hover:border-[#CFAF6E]/60 transition-all duration-300 shadow-lg hover:shadow-[#CFAF6E]/20"
          >
            <Zap className="w-4 h-4 mr-2" />
            Predict Failures
          </Button>
        </div>
      </Card>

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="bg-[#050505] border-[#CFAF6E]/30 max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-[#EDEDED] text-xl flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#CFAF6E]" />
              {currentResult?.title}
            </DialogTitle>
            <p className="text-[#BFBFBF] text-xs">
              Generated at {currentResult?.timestamp.toLocaleTimeString()}
            </p>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4">
              {renderResultContent()}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};