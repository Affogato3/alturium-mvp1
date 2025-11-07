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

    if (data.insights) {
      return (
        <div className="space-y-4">
          <p className="text-[#BFBFBF] text-sm">{data.summary}</p>
          <div className="space-y-3">
            {data.insights.map((insight: any, idx: number) => (
              <div key={idx} className="p-4 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={
                        insight.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        insight.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-green-500/20 text-green-400 border-green-500/30'
                      }>
                        {insight.priority}
                      </Badge>
                      <span className="text-xs text-[#BFBFBF]">Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-[#EDEDED]">{insight.message}</p>
                    {insight.impact_amount && (
                      <p className="text-[#CFAF6E] mt-2">Potential Impact: ${insight.impact_amount.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (data.recommendations) {
      return (
        <div className="space-y-4">
          <p className="text-[#CFAF6E] font-semibold">Total Potential Impact: ${data.total_potential_impact?.toLocaleString()}</p>
          <div className="space-y-3">
            {data.recommendations.map((rec: any, idx: number) => (
              <div key={idx} className="p-4 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg">
                <h4 className="text-[#EDEDED] font-semibold mb-2">{rec.title}</h4>
                <p className="text-[#BFBFBF] text-sm mb-2">{rec.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-[#CFAF6E]">Impact: +${rec.impact_amount?.toLocaleString()}</span>
                  <span className="text-[#BFBFBF]">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                  <Badge variant="outline">{rec.implementation_complexity}</Badge>
                </div>
                {rec.reasoning && (
                  <p className="text-[#BFBFBF] text-xs mt-2 italic">{rec.reasoning}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (data.waste_items) {
      return (
        <div className="space-y-4">
          <p className="text-[#CFAF6E] font-semibold">Total Potential Savings: ${data.total_potential_savings?.toLocaleString()}/year</p>
          <div className="space-y-3">
            {data.waste_items.map((item: any, idx: number) => (
              <div key={idx} className="p-4 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg">
                <h4 className="text-[#EDEDED] font-semibold mb-2">{item.title}</h4>
                <p className="text-[#BFBFBF] text-sm mb-2">{item.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-red-400">Current Cost: ${item.annual_cost?.toLocaleString()}/year</span>
                  <span className="text-green-400">Savings: ${item.potential_savings?.toLocaleString()}</span>
                  <span className="text-[#BFBFBF]">Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (data.overall_score !== undefined) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#1A1A1A" strokeWidth="12" />
                <circle 
                  cx="100" cy="100" r="90" 
                  fill="none" 
                  stroke="#CFAF6E" 
                  strokeWidth="12" 
                  strokeDasharray={`${(data.overall_score / 100) * 565} 565`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
                <text x="100" y="100" textAnchor="middle" dy=".3em" className="text-4xl font-bold fill-[#CFAF6E]">
                  {data.overall_score}
                </text>
                <text x="100" y="130" textAnchor="middle" className="text-sm fill-[#BFBFBF]">
                  {data.grade}
                </text>
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(data.breakdown || {}).map(([key, value]: [string, any]) => (
              <div key={key} className="p-3 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg">
                <div className="text-xs text-[#BFBFBF] mb-1">{key.replace(/_/g, ' ')}</div>
                <div className="text-xl font-bold text-[#CFAF6E]">{value}</div>
              </div>
            ))}
          </div>
          <p className="text-[#BFBFBF] text-sm">Industry Percentile: {data.industry_percentile}th</p>
          {data.insights && (
            <div className="space-y-2">
              {data.insights.map((insight: string, idx: number) => (
                <p key={idx} className="text-[#EDEDED] text-sm">• {insight}</p>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (data.scenarios) {
      return (
        <div className="space-y-4">
          <p className="text-[#BFBFBF] mb-4">{data.recommendation}</p>
          <div className="space-y-3">
            {data.scenarios.map((scenario: any, idx: number) => (
              <div key={idx} className="p-4 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[#EDEDED] font-semibold">{scenario.name}</h4>
                  <Badge className="bg-[#CFAF6E]/20 text-[#CFAF6E] border-[#CFAF6E]/30">
                    Confidence: {(scenario.confidence * 100).toFixed(0)}%
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <div className="text-[#BFBFBF] text-xs">Q1</div>
                    <div className="text-[#EDEDED]">${(scenario.forecast.q1_revenue / 1000000).toFixed(1)}M</div>
                  </div>
                  <div>
                    <div className="text-[#BFBFBF] text-xs">Q2</div>
                    <div className="text-[#EDEDED]">${(scenario.forecast.q2_revenue / 1000000).toFixed(1)}M</div>
                  </div>
                  <div>
                    <div className="text-[#BFBFBF] text-xs">Q3</div>
                    <div className="text-[#EDEDED]">${(scenario.forecast.q3_revenue / 1000000).toFixed(1)}M</div>
                  </div>
                  <div>
                    <div className="text-[#BFBFBF] text-xs">Q4</div>
                    <div className="text-[#EDEDED]">${(scenario.forecast.q4_revenue / 1000000).toFixed(1)}M</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <pre className="text-[#EDEDED] text-xs">{JSON.stringify(data, null, 2)}</pre>;
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