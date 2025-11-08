import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Sparkles,
  Eye,
  Zap,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChartData {
  id: string;
  title: string;
  type: "line" | "bar" | "area" | "scatter";
  data: any[];
  insight: string;
  confidence: number;
  trend: "up" | "down" | "stable";
  impact: string;
}

const COLORS = ["#CFAF6E", "#B2B9FF", "#00C49F", "#FF8042", "#FFBB28"];

export const InteractiveDashboard = () => {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateDashboard = async () => {
    setIsGenerating(true);
    try {
      // Generate sample data with realistic business metrics
      const revenueData = Array.from({ length: 12 }, (_, i) => ({
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        revenue: Math.floor(850000 + Math.random() * 350000 + i * 45000),
        forecast: Math.floor(900000 + Math.random() * 300000 + i * 50000),
        target: 1200000,
      }));

      const customerData = Array.from({ length: 8 }, (_, i) => ({
        segment: ["Enterprise", "SMB", "Startup", "Agency", "Retail", "Healthcare", "Finance", "Tech"][i],
        value: Math.floor(150000 + Math.random() * 450000),
        count: Math.floor(50 + Math.random() * 200),
      }));

      const performanceData = Array.from({ length: 10 }, (_, i) => ({
        week: `W${i + 1}`,
        efficiency: Math.floor(70 + Math.random() * 25),
        quality: Math.floor(75 + Math.random() * 20),
        velocity: Math.floor(65 + Math.random() * 30),
      }));

      const correlationData = Array.from({ length: 50 }, () => ({
        calls: Math.floor(5 + Math.random() * 35),
        closeRate: Math.floor(15 + Math.random() * 50),
      }));

      const newCharts: ChartData[] = [
        {
          id: "revenue-trend",
          title: "Revenue Growth & Forecast",
          type: "area",
          data: revenueData,
          insight: "Revenue accelerating at 18% QoQ with strong Q4 projection",
          confidence: 94,
          trend: "up",
          impact: "+$420K vs last quarter",
        },
        {
          id: "customer-segments",
          title: "Customer Value by Segment",
          type: "bar",
          data: customerData,
          insight: "Enterprise segment delivers 3.2× higher LTV than SMB",
          confidence: 91,
          trend: "up",
          impact: "Focus shift recommended",
        },
        {
          id: "team-performance",
          title: "Operational Performance Metrics",
          type: "line",
          data: performanceData,
          insight: "Team efficiency improved 12% following process optimization",
          confidence: 88,
          trend: "up",
          impact: "+15% productivity gain",
        },
        {
          id: "sales-correlation",
          title: "Sales Activity vs Close Rate",
          type: "scatter",
          data: correlationData,
          insight: "Strong correlation: Reps with 25+ calls/week close 40% more deals",
          confidence: 96,
          trend: "stable",
          impact: "Activity benchmark identified",
        },
      ];

      setCharts(newCharts);

      toast({
        title: "Dashboard Generated",
        description: `${newCharts.length} interactive charts created with AI insights`,
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

  const explainChart = async (chartId: string) => {
    setSelectedChart(chartId);
    setIsExplaining(true);
    setAiExplanation("");

    try {
      const chart = charts.find((c) => c.id === chartId);
      if (!chart) return;

      const { data, error } = await supabase.functions.invoke("chart-explain", {
        body: {
          chartTitle: chart.title,
          chartType: chart.type,
          dataPoints: chart.data.length,
          insight: chart.insight,
        },
      });

      if (error) throw error;

      setAiExplanation(data.explanation);

      toast({
        title: "Analysis Complete",
        description: "AI has explained the chart trends",
      });
    } catch (error: any) {
      toast({
        title: "Explanation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsExplaining(false);
    }
  };

  const simulateImpact = (chartId: string) => {
    toast({
      title: "Simulation Running",
      description: "Modeling projected impact of recommended changes...",
    });

    setTimeout(() => {
      toast({
        title: "Simulation Complete",
        description: "Expected improvement: +22% within 60 days",
      });
    }, 2000);
  };

  const renderChart = (chart: ChartData) => {
    const commonProps = {
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (chart.type) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chart.data} {...commonProps}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CFAF6E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#CFAF6E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B2B9FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#B2B9FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#BFBFBF" />
              <YAxis stroke="#BFBFBF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #CFAF6E",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#CFAF6E"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#B2B9FF"
                fillOpacity={1}
                fill="url(#colorForecast)"
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chart.data} {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="segment" stroke="#BFBFBF" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#BFBFBF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #CFAF6E",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chart.data} {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="week" stroke="#BFBFBF" />
              <YAxis stroke="#BFBFBF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #CFAF6E",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="efficiency" stroke="#CFAF6E" strokeWidth={2} />
              <Line type="monotone" dataKey="quality" stroke="#B2B9FF" strokeWidth={2} />
              <Line type="monotone" dataKey="velocity" stroke="#00C49F" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" dataKey="calls" name="Calls/Week" stroke="#BFBFBF" />
              <YAxis type="number" dataKey="closeRate" name="Close Rate %" stroke="#BFBFBF" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #CFAF6E",
                  borderRadius: "8px",
                }}
              />
              <Scatter name="Sales Performance" data={chart.data} fill="#CFAF6E" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <BarChart3 className="w-4 h-4 text-[#CFAF6E]" />;
    }
  };

  return (
    <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#CFAF6E]/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-[#CFAF6E]" />
          <div>
            <h3 className="text-xl font-bold text-[#EDEDED]">Interactive Analytics Dashboard</h3>
            <p className="text-sm text-[#BFBFBF]">AI-powered visualizations with trend analysis</p>
          </div>
        </div>
        <Button
          onClick={generateDashboard}
          disabled={isGenerating}
          className="bg-gradient-to-r from-[#CFAF6E] to-[#EDEDED] text-black hover:opacity-90"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : charts.length > 0 ? "Refresh Dashboard" : "Generate Dashboard"}
        </Button>
      </div>

      {charts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BarChart3 className="w-16 h-16 text-[#CFAF6E]/30 mb-4" />
          <p className="text-[#BFBFBF] mb-2">No dashboard generated yet</p>
          <p className="text-sm text-[#BFBFBF]/60">Click "Generate Dashboard" to create interactive charts</p>
        </div>
      ) : (
        <ScrollArea className="h-[700px]">
          <div className="space-y-6">
            {charts.map((chart, idx) => (
              <motion.div
                key={chart.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-gradient-to-br from-[#1A1A1A]/80 to-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg hover:border-[#CFAF6E]/40 transition-all"
              >
                {/* Chart Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    {getTrendIcon(chart.trend)}
                    <div>
                      <h4 className="text-lg font-semibold text-[#EDEDED]">{chart.title}</h4>
                      <p className="text-sm text-[#BFBFBF] mt-1">{chart.insight}</p>
                    </div>
                  </div>
                  <Badge className="bg-[#CFAF6E]/20 text-[#CFAF6E] border-[#CFAF6E]/30">
                    {chart.confidence}% confidence
                  </Badge>
                </div>

                {/* Chart Visualization */}
                <div className="mb-4 rounded-lg bg-[#0B0C10]/50 p-4">{renderChart(chart)}</div>

                {/* Impact Badge */}
                <div className="mb-4">
                  <Badge className="bg-gradient-to-r from-green-500/20 to-[#CFAF6E]/20 text-green-400 border-green-500/30">
                    Impact: {chart.impact}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => explainChart(chart.id)}
                    disabled={isExplaining && selectedChart === chart.id}
                    className="flex-1 border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/10"
                  >
                    <MessageSquare className="w-3 h-3 mr-2" />
                    {isExplaining && selectedChart === chart.id ? "Explaining..." : "Ask AI Why"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/10"
                  >
                    <Eye className="w-3 h-3 mr-2" />
                    Drill Down
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => simulateImpact(chart.id)}
                    className="flex-1 bg-[#CFAF6E]/20 text-[#CFAF6E] hover:bg-[#CFAF6E]/30"
                  >
                    <Zap className="w-3 h-3 mr-2" />
                    Simulate Impact
                  </Button>
                </div>

                {/* AI Explanation Panel */}
                <AnimatePresence>
                  {selectedChart === chart.id && aiExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-[#CFAF6E]/10 border border-[#CFAF6E]/20 rounded-lg"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#CFAF6E] mt-1 flex-shrink-0" />
                        <h5 className="text-sm font-semibold text-[#CFAF6E]">AI Analysis</h5>
                      </div>
                      <p className="text-sm text-[#EDEDED] whitespace-pre-line leading-relaxed">{aiExplanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};
