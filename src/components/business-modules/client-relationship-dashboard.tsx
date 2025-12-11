import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, UserPlus, Phone, Mail, FileText, TrendingUp,
  Calendar, BarChart3, AlertCircle, CheckCircle, Clock,
  MessageSquare, Send, Download, Eye, GitMerge, DollarSign
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface AnalysisResult {
  title: string;
  data: any;
  timestamp: Date;
  type: string;
}

export const ClientRelationshipDashboard = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const executeAnalysis = async (action: string, title: string) => {
    setLoading(action);
    try {
      const { data, error } = await supabase.functions.invoke("business-intelligence-engine", {
        body: {
          module: "client",
          action,
          data: {
            total_clients: 245,
            active_deals: 48,
            pipeline_value: "$2.4M",
            avg_deal_size: "$52K",
            conversion_rate: "32%",
            clients: [
              { name: "Acme Corp", value: 150000, health: 85, stage: "Active" },
              { name: "TechStart Inc", value: 85000, health: 72, stage: "Renewal" },
              { name: "Global Systems", value: 220000, health: 91, stage: "Expansion" },
            ],
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

  const pipelineData = [
    { stage: "Lead", count: 45, value: 890000 },
    { stage: "Qualified", count: 28, value: 650000 },
    { stage: "Proposal", count: 15, value: 420000 },
    { stage: "Negotiation", count: 8, value: 280000 },
    { stage: "Closed", count: 12, value: 360000 },
  ];

  const healthDistribution = [
    { name: "Healthy", value: 65, color: "#22c55e" },
    { name: "At Risk", value: 25, color: "#f59e0b" },
    { name: "Critical", value: 10, color: "#ef4444" },
  ];

  const clients = [
    { name: "Acme Corporation", value: "$150K", health: 92, stage: "Active", lastContact: "2 days ago" },
    { name: "TechStart Inc", value: "$85K", health: 65, stage: "Renewal", lastContact: "1 week ago" },
    { name: "Global Systems", value: "$220K", health: 88, stage: "Expansion", lastContact: "3 days ago" },
    { name: "InnovateCo", value: "$45K", health: 45, stage: "At Risk", lastContact: "2 weeks ago" },
    { name: "Enterprise Ltd", value: "$180K", health: 78, stage: "Active", lastContact: "5 days ago" },
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
        {data.client_score !== undefined && (
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#CFAF6E]/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#BFBFBF]">Client Health Score</span>
              <Badge variant={data.client_score > 70 ? "default" : "destructive"}>{renderValue(data.client_score)}/100</Badge>
            </div>
            <Progress value={typeof data.client_score === "number" ? data.client_score : 0} className="h-2" />
          </div>
        )}
        {data.predictions && (
          <div className="space-y-2">
            <h4 className="text-[#CFAF6E] font-semibold">Predictions</h4>
            {Array.isArray(data.predictions) ? (
              data.predictions.map((pred: any, i: number) => (
                <div key={i} className="p-3 bg-[#1A1A1A] rounded border border-[#CFAF6E]/10">
                  <span className="text-[#EDEDED]">
                    {typeof pred === "string" ? pred : (pred.title || pred.description || renderValue(pred))}
                  </span>
                </div>
              ))
            ) : (
              Object.entries(data.predictions).map(([key, value]: [string, any]) => (
                <div key={key} className="p-3 bg-[#1A1A1A] rounded border border-[#CFAF6E]/10">
                  <span className="text-[#EDEDED]">{key.replace(/_/g, " ")}: </span>
                  <span className="text-[#CFAF6E]">{renderValue(value)}</span>
                </div>
              ))
            )}
          </div>
        )}
        {data.action_items && Array.isArray(data.action_items) && (
          <div className="space-y-2">
            <h4 className="text-[#CFAF6E] font-semibold">Action Items</h4>
            {data.action_items.map((item: any, i: number) => (
              <div key={i} className="p-3 bg-gradient-to-r from-[#CFAF6E]/10 to-transparent rounded border border-[#CFAF6E]/20">
                <span className="text-[#EDEDED]">
                  {typeof item === "string" ? item : (item.action || item.title || renderValue(item))}
                </span>
              </div>
            ))}
          </div>
        )}
        {/* Fallback for unknown data structures */}
        {!data.client_score && !data.predictions && !data.action_items && (
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
              <Users className="w-8 h-8 text-[#CFAF6E]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#EDEDED]">Client Relationship Management</h1>
              <p className="text-[#BFBFBF]">AI-Powered Client Intelligence & Pipeline Management</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-[#1A1A1A] border-[#CFAF6E]/20"
            />
            <Button className="bg-[#CFAF6E] text-black hover:bg-[#CFAF6E]/80">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Total Clients", value: "245", icon: Users, trend: "+12" },
            { label: "Active Deals", value: "48", icon: BarChart3, trend: "+5" },
            { label: "Pipeline Value", value: "$2.4M", icon: DollarSign, trend: "+18%" },
            { label: "Avg Deal Size", value: "$52K", icon: TrendingUp, trend: "+8%" },
            { label: "Conversion Rate", value: "32%", icon: CheckCircle, trend: "+3%" },
          ].map((metric, i) => (
            <Card key={i} className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
              <div className="flex items-center justify-between">
                <metric.icon className="w-5 h-5 text-[#CFAF6E]" />
                <span className="text-green-400 text-sm">{metric.trend}</span>
              </div>
              <p className="text-2xl font-bold text-[#EDEDED] mt-2">{metric.value}</p>
              <p className="text-sm text-[#BFBFBF]">{metric.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Actions Panel */}
          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Client Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => executeAnalysis("lead_scoring", "Lead Scoring Analysis")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <TrendingUp className="w-4 h-4 mr-2 text-[#CFAF6E]" />
                {loading === "lead_scoring" ? "Scoring..." : "Score Leads"}
              </Button>

              <Button
                onClick={() => executeAnalysis("churn_prediction", "Churn Risk Analysis")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                {loading === "churn_prediction" ? "Analyzing..." : "Predict Churn"}
              </Button>

              <Button
                onClick={() => executeAnalysis("clv_calculation", "CLV Calculation")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                {loading === "clv_calculation" ? "Calculating..." : "Calculate CLV"}
              </Button>

              <Button
                onClick={() => executeAnalysis("pipeline_forecast", "Pipeline Forecast")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <BarChart3 className="w-4 h-4 mr-2 text-blue-400" />
                {loading === "pipeline_forecast" ? "Forecasting..." : "View Pipeline"}
              </Button>

              <Button
                onClick={() => executeAnalysis("relationship_analysis", "Relationship Health")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <Users className="w-4 h-4 mr-2 text-purple-400" />
                {loading === "relationship_analysis" ? "Analyzing..." : "Analyze Relationships"}
              </Button>

              <div className="border-t border-[#CFAF6E]/20 pt-3 mt-3 space-y-3">
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <Phone className="w-4 h-4 mr-2" />
                  Log Activity
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Quote
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <Send className="w-4 h-4 mr-2" />
                  Send Contract
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Follow-up
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <GitMerge className="w-4 h-4 mr-2" />
                  Merge Duplicates
                </Button>
              </div>
            </div>
          </Card>

          {/* Results Panel */}
          <Card className="col-span-2 bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#EDEDED]">
                {result ? result.title : "Client Intelligence"}
              </h3>
              {result && (
                <Button size="sm" variant="outline" className="border-[#CFAF6E]/30">
                  <Download className="w-3 h-3 mr-1" />
                  Export Report
                </Button>
              )}
            </div>

            <ScrollArea className="h-[350px]">
              {result ? (
                renderResultContent()
              ) : (
                <div className="space-y-3">
                  {clients.map((client, i) => (
                    <div key={i} className="p-4 bg-[#1A1A1A] rounded-lg border border-[#CFAF6E]/10 hover:border-[#CFAF6E]/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-[#EDEDED] font-medium">{client.name}</h4>
                          <p className="text-sm text-[#BFBFBF]">Last contact: {client.lastContact}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#CFAF6E] font-bold">{client.value}</p>
                          <Badge variant={client.health > 70 ? "default" : client.health > 50 ? "secondary" : "destructive"}>
                            Health: {client.health}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={client.health} className="h-1 mt-3" />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Sales Pipeline</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="stage" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #CFAF6E30" }} />
                <Bar dataKey="count" fill="#CFAF6E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Client Health Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={healthDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {healthDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #CFAF6E30" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {healthDistribution.map((item, i) => (
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
