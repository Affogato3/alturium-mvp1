import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3, TrendingUp, AlertCircle, Search, Plus,
  Filter, Download, Share2, Bell, Calendar, RefreshCw,
  MessageSquare, Eye, Layers, PieChart as PieChartIcon, LineChart as LineChartIcon
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";

interface AnalysisResult {
  title: string;
  data: any;
  timestamp: Date;
  type: string;
}

export const BusinessIntelligenceDashboard = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [nlQuery, setNlQuery] = useState("");

  const executeAnalysis = async (action: string, title: string, additionalData?: any) => {
    setLoading(action);
    try {
      const { data, error } = await supabase.functions.invoke("business-intelligence-engine", {
        body: {
          module: "analytics",
          action,
          data: {
            metrics: {
              revenue: 4250000,
              growth_rate: 18.5,
              customers: 1245,
              churn: 2.3,
              arr: 51000000,
              mrr: 4250000,
            },
            time_period: "Last 12 months",
            ...additionalData,
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

  const handleNLQuery = () => {
    if (!nlQuery.trim()) return;
    executeAnalysis("nlq_query", "Natural Language Query", { query: nlQuery, context: { type: "business_data" } });
  };

  const revenueData = [
    { month: "Jan", revenue: 3.2, target: 3.0 },
    { month: "Feb", revenue: 3.5, target: 3.2 },
    { month: "Mar", revenue: 3.8, target: 3.4 },
    { month: "Apr", revenue: 4.0, target: 3.6 },
    { month: "May", revenue: 3.9, target: 3.8 },
    { month: "Jun", revenue: 4.2, target: 4.0 },
    { month: "Jul", revenue: 4.5, target: 4.2 },
    { month: "Aug", revenue: 4.8, target: 4.4 },
  ];

  const segmentData = [
    { name: "Enterprise", value: 45, color: "#CFAF6E" },
    { name: "Mid-Market", value: 30, color: "#22c55e" },
    { name: "SMB", value: 20, color: "#3b82f6" },
    { name: "Startup", value: 5, color: "#a855f7" },
  ];

  const kpiCards = [
    { label: "Total Revenue", value: "$4.25M", change: "+18.5%", positive: true },
    { label: "Active Customers", value: "1,245", change: "+12%", positive: true },
    { label: "Churn Rate", value: "2.3%", change: "-0.5%", positive: true },
    { label: "Avg Deal Size", value: "$52K", change: "+8%", positive: true },
    { label: "Pipeline Value", value: "$12.4M", change: "+24%", positive: true },
    { label: "Win Rate", value: "32%", change: "+3%", positive: true },
  ];

  const renderResultContent = () => {
    if (!result) return null;
    const { data } = result;

    if (data.narrative) {
      return (
        <div className="prose prose-invert max-w-none">
          {data.narrative.split("\n").map((line: string, i: number) => {
            if (line.startsWith("##")) {
              return <h3 key={i} className="text-[#CFAF6E] mt-4 mb-2">{line.replace(/##/g, "")}</h3>;
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
        {data.insights && (
          <div className="space-y-2">
            <h4 className="text-[#CFAF6E] font-semibold">Key Insights</h4>
            {data.insights.map((insight: any, i: number) => (
              <div key={i} className="p-3 bg-[#1A1A1A] rounded border border-[#CFAF6E]/10">
                <span className="text-[#EDEDED]">{insight.title || insight}</span>
                {insight.description && <p className="text-sm text-[#BFBFBF] mt-1">{insight.description}</p>}
              </div>
            ))}
          </div>
        )}
        {data.forecasts && (
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#CFAF6E]/20">
            <h4 className="text-[#CFAF6E] font-semibold mb-3">Forecasts</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(data.forecasts).map(([key, value]: [string, any]) => (
                <div key={key}>
                  <p className="text-xs text-[#BFBFBF]">{key.replace(/_/g, " ").toUpperCase()}</p>
                  <p className="text-lg font-bold text-[#EDEDED]">{typeof value === "number" ? value.toLocaleString() : value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.anomalies && data.anomalies.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-amber-500 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Anomalies Detected
            </h4>
            {data.anomalies.map((anomaly: any, i: number) => (
              <div key={i} className="p-3 bg-amber-500/10 rounded border border-amber-500/20">
                <span className="text-[#EDEDED]">{anomaly.description || anomaly}</span>
              </div>
            ))}
          </div>
        )}
        {data.recommendations && (
          <div className="space-y-2">
            <h4 className="text-[#CFAF6E] font-semibold">Recommendations</h4>
            {data.recommendations.map((rec: any, i: number) => (
              <div key={i} className="p-3 bg-gradient-to-r from-[#CFAF6E]/10 to-transparent rounded border border-[#CFAF6E]/20">
                <span className="text-[#EDEDED]">{rec.action || rec}</span>
              </div>
            ))}
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
              <BarChart3 className="w-8 h-8 text-[#CFAF6E]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#EDEDED]">Business Intelligence Hub</h1>
              <p className="text-[#BFBFBF]">AI-Powered Analytics & Predictive Insights</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-[#CFAF6E]/30 text-[#CFAF6E]">
              <Plus className="w-4 h-4 mr-2" />
              Create Dashboard
            </Button>
            <Button variant="outline" className="border-[#CFAF6E]/30 text-[#CFAF6E]">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>

        {/* NL Query Bar */}
        <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <Input
                placeholder="Ask a question about your data... (e.g., 'Show me top 10 customers by revenue this quarter')"
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNLQuery()}
                className="pl-10 bg-[#1A1A1A] border-[#CFAF6E]/20 text-[#EDEDED]"
              />
            </div>
            <Button 
              onClick={handleNLQuery}
              disabled={loading === "nlq_query"}
              className="bg-[#CFAF6E] text-black hover:bg-[#CFAF6E]/80"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {loading === "nlq_query" ? "Querying..." : "Ask Data Question"}
            </Button>
          </div>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-6 gap-4">
          {kpiCards.map((kpi, i) => (
            <Card key={i} className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
              <p className="text-[#BFBFBF] text-sm">{kpi.label}</p>
              <p className="text-xl font-bold text-[#EDEDED] mt-1">{kpi.value}</p>
              <p className={`text-sm ${kpi.positive ? "text-green-400" : "text-red-400"}`}>{kpi.change}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Actions Panel */}
          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Analytics Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => executeAnalysis("trend_analysis", "Trend Analysis")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <TrendingUp className="w-4 h-4 mr-2 text-[#CFAF6E]" />
                {loading === "trend_analysis" ? "Analyzing..." : "Analyze Trends"}
              </Button>

              <Button
                onClick={() => executeAnalysis("predictive_forecast", "Predictive Forecast")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <LineChartIcon className="w-4 h-4 mr-2 text-blue-400" />
                {loading === "predictive_forecast" ? "Forecasting..." : "Generate Forecast"}
              </Button>

              <Button
                onClick={() => executeAnalysis("anomaly_detection", "Anomaly Detection")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                {loading === "anomaly_detection" ? "Detecting..." : "Detect Anomalies"}
              </Button>

              <Button
                onClick={() => executeAnalysis("cohort_analysis", "Cohort Analysis")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <Layers className="w-4 h-4 mr-2 text-purple-400" />
                {loading === "cohort_analysis" ? "Analyzing..." : "Run Cohort Analysis"}
              </Button>

              <div className="border-t border-[#CFAF6E]/20 pt-3 mt-3 space-y-3">
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Widget
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filter
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <Eye className="w-4 h-4 mr-2" />
                  Drill Down
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Alert
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Compare Periods
                </Button>
              </div>
            </div>
          </Card>

          {/* Results Panel */}
          <Card className="col-span-2 bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#EDEDED]">
                {result ? result.title : "Analytics Insights"}
              </h3>
              {result && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-[#CFAF6E]/30">
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline" className="border-[#CFAF6E]/30">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
              )}
            </div>

            <ScrollArea className="h-[350px]">
              {result ? (
                renderResultContent()
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <BarChart3 className="w-16 h-16 text-[#CFAF6E]/30 mb-4" />
                  <p className="text-[#BFBFBF]">Select an analysis or ask a question</p>
                  <p className="text-sm text-[#666] mt-2">AI-powered insights will appear here</p>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Revenue vs Target</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #CFAF6E30" }} />
                <Area type="monotone" dataKey="revenue" stroke="#CFAF6E" fill="#CFAF6E" fillOpacity={0.3} />
                <Area type="monotone" dataKey="target" stroke="#666" fill="#666" fillOpacity={0.1} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Revenue by Segment</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #CFAF6E30" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {segmentData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[#BFBFBF]">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
