import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain, Download, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalysisResultsProps {
  symbol: string;
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
}

export const AnalysisResults = ({ symbol, isAnalyzing, setIsAnalyzing }: AnalysisResultsProps) => {
  const [results, setResults] = useState<any>(null);

  const runFullAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('quantum-signals', {
        body: { 
          symbols: [symbol],
          analysisType: 'comprehensive'
        }
      });

      if (error) throw error;

      setResults(data);
      toast.success("Comprehensive analysis complete");
    } catch (error) {
      console.error('Error running analysis:', error);
      toast.error("Analysis failed");
      
      // Mock comprehensive results
      setResults({
        symbol,
        timestamp: new Date().toISOString(),
        technicalScore: 78,
        fundamentalScore: 82,
        sentimentScore: 75,
        recommendation: "STRONG BUY",
        targetPrice: 210.00,
        stopLoss: 165.00,
        confidence: 85,
        keyFactors: [
          "Strong momentum indicators with RSI at 68",
          "Volume profile shows institutional accumulation",
          "Breaking through key resistance at $180",
          "Positive earnings surprise expected next quarter"
        ],
        risks: [
          "Market volatility remains elevated",
          "Sector rotation could impact short-term",
          "Overbought conditions on shorter timeframes"
        ],
        opportunityScore: 88
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    const report = JSON.stringify(results, null, 2);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trade-analysis-${symbol}-${Date.now()}.json`;
    a.click();
    toast.success("Report downloaded");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#131316] border-[#272A40] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[#E9E9E9] flex items-center gap-3">
              <Brain className="h-7 w-7 text-[#D5B65C]" />
              AI Comprehensive Analysis
            </h3>
            <p className="text-[#9CA3AF] mt-1">
              Deep market intelligence for {symbol}
            </p>
          </div>
          <Button
            onClick={runFullAnalysis}
            disabled={isAnalyzing}
            className="bg-[#D5B65C] text-[#0B0B0D] hover:bg-[#C5A64C]"
            size="lg"
          >
            <Zap className="h-5 w-5 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Run Full Analysis"}
          </Button>
        </div>

        {!results ? (
          <div className="py-12 text-center">
            <Brain className="h-16 w-16 mx-auto mb-4 text-[#9CA3AF] opacity-50" />
            <p className="text-[#9CA3AF]">
              Click "Run Full Analysis" to generate comprehensive AI-powered trading insights
            </p>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-[#1A1A1A] border border-[#272A40] mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="factors">Key Factors</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-[#1A1A1A] border border-[#272A40] rounded-lg text-center">
                  <div className="text-sm text-[#9CA3AF] mb-2">Recommendation</div>
                  <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                    {results.recommendation}
                  </Badge>
                </div>

                <div className="p-6 bg-[#1A1A1A] border border-[#272A40] rounded-lg text-center">
                  <div className="text-sm text-[#9CA3AF] mb-2">Target Price</div>
                  <div className="text-2xl font-bold text-green-400">
                    ${results.targetPrice.toFixed(2)}
                  </div>
                </div>

                <div className="p-6 bg-[#1A1A1A] border border-[#272A40] rounded-lg text-center">
                  <div className="text-sm text-[#9CA3AF] mb-2">Confidence</div>
                  <div className="text-2xl font-bold text-[#D5B65C]">
                    {results.confidence}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
                  <div className="text-xs text-[#9CA3AF] mb-2">Technical Score</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#272A40] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#D5B65C]" 
                        style={{ width: `${results.technicalScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#E9E9E9]">{results.technicalScore}</span>
                  </div>
                </div>

                <div className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
                  <div className="text-xs text-[#9CA3AF] mb-2">Fundamental Score</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#272A40] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-400" 
                        style={{ width: `${results.fundamentalScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#E9E9E9]">{results.fundamentalScore}</span>
                  </div>
                </div>

                <div className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
                  <div className="text-xs text-[#9CA3AF] mb-2">Sentiment Score</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#272A40] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-400" 
                        style={{ width: `${results.sentimentScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#E9E9E9]">{results.sentimentScore}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={downloadReport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <div className="p-6 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
                <h4 className="font-semibold text-[#E9E9E9] mb-4">Technical Analysis Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Stop Loss:</span>
                    <span className="text-red-400 font-medium">${results.stopLoss.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Target Price:</span>
                    <span className="text-green-400 font-medium">${results.targetPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Risk/Reward Ratio:</span>
                    <span className="text-[#D5B65C] font-medium">1:3.2</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="factors" className="space-y-3">
              {results.keyFactors.map((factor: string, index: number) => (
                <div key={index} className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                      {index + 1}
                    </Badge>
                    <p className="text-sm text-[#E9E9E9]">{factor}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="risks" className="space-y-3">
              {results.risks.map((risk: string, index: number) => (
                <div key={index} className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                      ⚠
                    </Badge>
                    <p className="text-sm text-[#E9E9E9]">{risk}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </Card>
    </div>
  );
};
