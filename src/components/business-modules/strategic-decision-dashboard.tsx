import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Brain, TrendingUp, Target, BarChart3, Compass, 
  GitBranch, DollarSign, Globe, Zap, FileText,
  Play, Plus, RefreshCw, Download, Share2, MessageSquare
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

interface AnalysisResult {
  title: string;
  data: any;
  timestamp: Date;
  type: string;
}

export const StrategicDecisionDashboard = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [scenarioParams, setScenarioParams] = useState({
    revenueGrowth: 15,
    marketShare: 25,
    investmentLevel: 50,
  });

  const executeAnalysis = async (action: string, title: string) => {
    setLoading(action);
    try {
      const { data, error } = await supabase.functions.invoke("business-intelligence-engine", {
        body: {
          module: "strategic",
          action,
          data: {
            company: "Current Company",
            industry: "Technology/SaaS",
            revenue: "$50M ARR",
            growth_rate: "35% YoY",
            market_size: "$10B TAM",
            competitors: ["Competitor A", "Competitor B", "Competitor C"],
            scenario_params: scenarioParams,
          },
        },
      });

      if (error) throw error;

      setResult({
        title,
        data: data.result,
        timestamp: new Date(),
        type: action,
      });

      toast({
        title: "Analysis Complete",
        description: `${title} has been generated successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const forecastData = [
    { month: "Jan", baseline: 4.2, optimistic: 4.5, pessimistic: 3.9 },
    { month: "Feb", baseline: 4.5, optimistic: 5.0, pessimistic: 4.1 },
    { month: "Mar", baseline: 4.8, optimistic: 5.5, pessimistic: 4.3 },
    { month: "Apr", baseline: 5.2, optimistic: 6.2, pessimistic: 4.5 },
    { month: "May", baseline: 5.6, optimistic: 7.0, pessimistic: 4.7 },
    { month: "Jun", baseline: 6.0, optimistic: 7.8, pessimistic: 4.9 },
  ];

  const swotData = [
    { subject: "Market Position", A: 85 },
    { subject: "Technology", A: 90 },
    { subject: "Team", A: 75 },
    { subject: "Finance", A: 70 },
    { subject: "Operations", A: 80 },
    { subject: "Brand", A: 65 },
  ];

  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toLocaleString();
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.map(v => renderValue(v)).join(", ");
    if (typeof value === "object") {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${renderValue(v)}`)
        .join(", ");
    }
    return String(value);
  };

  const renderResultContent = () => {
    if (!result) return null;
    const { data } = result;

    if (typeof data === "string") {
      return <p className="text-[#BFBFBF] whitespace-pre-wrap">{data}</p>;
    }

    if (data.narrative) {
      return (
        <div className="prose prose-invert max-w-none">
          {String(data.narrative).split("\n").map((line: string, i: number) => {
            if (line.startsWith("##")) {
              return <h3 key={i} className="text-[#CFAF6E] mt-4 mb-2">{line.replace(/##/g, "")}</h3>;
            }
            if (line.startsWith("**") && line.endsWith("**")) {
              return <p key={i} className="font-bold text-[#EDEDED]">{line.replace(/\*\*/g, "")}</p>;
            }
            if (line.startsWith("- ") || line.startsWith("• ")) {
              return <li key={i} className="text-[#BFBFBF] ml-4">{line.substring(2)}</li>;
            }
            return line ? <p key={i} className="text-[#BFBFBF]">{line}</p> : <br key={i} />;
          })}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {data.confidence_score !== undefined && (
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#CFAF6E]/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#BFBFBF]">Confidence Score</span>
              <Badge>{renderValue(data.confidence_score)}%</Badge>
            </div>
            <Progress value={typeof data.confidence_score === "number" ? data.confidence_score : 0} className="h-2" />
          </div>
        )}
        {data.scenarios && Array.isArray(data.scenarios) && (
          <div className="space-y-2">
            <h4 className="text-[#CFAF6E] font-semibold">Strategic Scenarios</h4>
            {data.scenarios.map((scenario: any, i: number) => (
              <div key={i} className="p-3 bg-[#1A1A1A] rounded border border-[#CFAF6E]/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#EDEDED] font-medium">
                    {typeof scenario === "string" ? scenario : (scenario.name || `Scenario ${i + 1}`)}
                  </span>
                  {scenario.probability !== undefined && (
                    <Badge variant="outline">{renderValue(scenario.probability)}%</Badge>
                  )}
                </div>
                {scenario.description && (
                  <p className="text-sm text-[#BFBFBF]">{renderValue(scenario.description)}</p>
                )}
              </div>
            ))}
          </div>
        )}
        {data.recommendations && Array.isArray(data.recommendations) && (
          <div className="space-y-2">
            <h4 className="text-[#CFAF6E] font-semibold">Strategic Recommendations</h4>
            {data.recommendations.map((rec: any, i: number) => (
              <div key={i} className="p-3 bg-gradient-to-r from-[#CFAF6E]/10 to-transparent rounded border border-[#CFAF6E]/20">
                <span className="text-[#EDEDED]">
                  {typeof rec === "string" ? rec : (rec.action || rec.recommendation || rec.title || renderValue(rec))}
                </span>
              </div>
            ))}
          </div>
        )}
        {data.financial_projections && (
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#CFAF6E]/20">
            <h4 className="text-[#CFAF6E] font-semibold mb-3">Financial Projections</h4>
            <div className="grid grid-cols-3 gap-4">
              {Array.isArray(data.financial_projections) ? (
                data.financial_projections.map((proj: any, i: number) => (
                  <div key={i}>
                    <p className="text-xs text-[#BFBFBF]">{proj.name || proj.metric || `Projection ${i + 1}`}</p>
                    <p className="text-lg font-bold text-[#EDEDED]">{renderValue(proj.value || proj)}</p>
                  </div>
                ))
              ) : (
                Object.entries(data.financial_projections).map(([key, value]: [string, any]) => (
                  <div key={key}>
                    <p className="text-xs text-[#BFBFBF]">{key.replace(/_/g, " ").toUpperCase()}</p>
                    <p className="text-lg font-bold text-[#EDEDED]">{renderValue(value)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {/* Fallback for unknown data structures */}
        {!data.confidence_score && !data.scenarios && !data.recommendations && !data.financial_projections && (
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#CFAF6E]/20">
            <pre className="text-[#BFBFBF] text-sm whitespace-pre-wrap overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-[#CFAF6E]/20 to-[#EDEDED]/10">
              <Compass className="w-8 h-8 text-[#CFAF6E]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#EDEDED]">Strategic Decision Intelligence</h1>
              <p className="text-[#BFBFBF]">AI-Powered Market Analysis & Scenario Planning</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-[#CFAF6E]/30 text-[#CFAF6E]">
              <Share2 className="w-4 h-4 mr-2" />
              Export to Board Deck
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Actions & Scenario Builder */}
          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Strategic Analysis</h3>
            <div className="space-y-3">
              <Button
                onClick={() => executeAnalysis("market_analysis", "Market Analysis")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <TrendingUp className="w-4 h-4 mr-2 text-[#CFAF6E]" />
                {loading === "market_analysis" ? "Analyzing..." : "Analyze Market"}
              </Button>

              <Button
                onClick={() => executeAnalysis("swot_analysis", "SWOT Analysis")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <Target className="w-4 h-4 mr-2 text-blue-400" />
                {loading === "swot_analysis" ? "Generating..." : "Generate SWOT"}
              </Button>

              <Button
                onClick={() => executeAnalysis("scenario_planning", "Scenario Planning")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <GitBranch className="w-4 h-4 mr-2 text-purple-400" />
                {loading === "scenario_planning" ? "Planning..." : "Add Scenario"}
              </Button>

              <Button
                onClick={() => executeAnalysis("financial_modeling", "Financial Model")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                {loading === "financial_modeling" ? "Modeling..." : "Run Simulation"}
              </Button>

              <Button
                onClick={() => executeAnalysis("competitive_intelligence", "Competitive Intel")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <Globe className="w-4 h-4 mr-2 text-amber-400" />
                {loading === "competitive_intelligence" ? "Gathering..." : "Compare Strategies"}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask Strategy AI
              </Button>
            </div>

            {/* Scenario Parameters */}
            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-semibold text-[#BFBFBF]">Scenario Parameters</h4>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#BFBFBF]">Revenue Growth</span>
                  <span className="text-[#CFAF6E]">{scenarioParams.revenueGrowth}%</span>
                </div>
                <Slider
                  value={[scenarioParams.revenueGrowth]}
                  onValueChange={(v) => setScenarioParams({ ...scenarioParams, revenueGrowth: v[0] })}
                  max={50}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#BFBFBF]">Market Share Target</span>
                  <span className="text-[#CFAF6E]">{scenarioParams.marketShare}%</span>
                </div>
                <Slider
                  value={[scenarioParams.marketShare]}
                  onValueChange={(v) => setScenarioParams({ ...scenarioParams, marketShare: v[0] })}
                  max={50}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#BFBFBF]">Investment Level</span>
                  <span className="text-[#CFAF6E]">{scenarioParams.investmentLevel}%</span>
                </div>
                <Slider
                  value={[scenarioParams.investmentLevel]}
                  onValueChange={(v) => setScenarioParams({ ...scenarioParams, investmentLevel: v[0] })}
                  max={100}
                  step={5}
                />
              </div>
            </div>
          </Card>

          {/* Results Panel */}
          <Card className="col-span-2 bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#EDEDED]">
                {result ? result.title : "Strategic Analysis Results"}
              </h3>
              {result && (
                <Button size="sm" variant="outline" className="border-[#CFAF6E]/30">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              )}
            </div>

            <ScrollArea className="h-[400px]">
              {result ? (
                renderResultContent()
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Brain className="w-16 h-16 text-[#CFAF6E]/30 mb-4" />
                  <p className="text-[#BFBFBF]">Select an analysis to view strategic insights</p>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Revenue Forecast Scenarios</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #CFAF6E30" }} />
                <Line type="monotone" dataKey="optimistic" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="baseline" stroke="#CFAF6E" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pessimistic" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Strategic Strength Assessment</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={swotData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" stroke="#666" />
                <PolarRadiusAxis stroke="#666" />
                <Radar name="Strength" dataKey="A" stroke="#CFAF6E" fill="#CFAF6E" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};
