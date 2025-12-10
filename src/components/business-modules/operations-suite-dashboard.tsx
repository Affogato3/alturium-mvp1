import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Settings, Workflow, Clock, Users, AlertTriangle,
  Play, Plus, RefreshCw, Download, Zap, CheckCircle,
  XCircle, BarChart3, GitBranch, Target, FileText, Upload
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface AnalysisResult {
  title: string;
  data: any;
  timestamp: Date;
  type: string;
}

export const OperationsSuiteDashboard = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const executeAnalysis = async (action: string, title: string) => {
    setLoading(action);
    try {
      const { data, error } = await supabase.functions.invoke("business-intelligence-engine", {
        body: {
          module: "operations",
          action,
          data: {
            workflows: 24,
            active_processes: 156,
            avg_cycle_time: "4.2 days",
            sla_compliance: "94%",
            automation_rate: "67%",
            bottlenecks: ["Approval delays", "Document processing", "Data entry"],
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

  const throughputData = [
    { hour: "8AM", completed: 12, pending: 8 },
    { hour: "10AM", completed: 28, pending: 15 },
    { hour: "12PM", completed: 45, pending: 22 },
    { hour: "2PM", completed: 62, pending: 18 },
    { hour: "4PM", completed: 78, pending: 12 },
    { hour: "6PM", completed: 85, pending: 8 },
  ];

  const workflowStats = [
    { name: "Onboarding", efficiency: 92, sla: 98 },
    { name: "Approvals", efficiency: 78, sla: 85 },
    { name: "Invoicing", efficiency: 95, sla: 99 },
    { name: "Support", efficiency: 88, sla: 94 },
    { name: "Reporting", efficiency: 82, sla: 90 },
  ];

  const activeWorkflows = [
    { name: "Client Onboarding - Acme Corp", stage: "KYC Review", progress: 65, status: "active" },
    { name: "Invoice Approval - Q4 Batch", stage: "Manager Sign-off", progress: 80, status: "pending" },
    { name: "Document Processing - Legal", stage: "Data Extraction", progress: 45, status: "active" },
    { name: "Support Ticket - #4521", stage: "Resolution", progress: 90, status: "active" },
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
        {data.efficiency_score !== undefined && (
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#CFAF6E]/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#BFBFBF]">Process Efficiency Score</span>
              <Badge>{data.efficiency_score}%</Badge>
            </div>
            <Progress value={data.efficiency_score} className="h-2" />
          </div>
        )}
        {data.bottlenecks && (
          <div className="space-y-2">
            <h4 className="text-[#CFAF6E] font-semibold">Identified Bottlenecks</h4>
            {data.bottlenecks.map((bottleneck: any, i: number) => (
              <div key={i} className="p-3 bg-[#1A1A1A] rounded border border-amber-500/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-[#EDEDED]">{bottleneck.name || bottleneck}</span>
                </div>
                {bottleneck.impact && <p className="text-sm text-[#BFBFBF] mt-1">Impact: {bottleneck.impact}</p>}
              </div>
            ))}
          </div>
        )}
        {data.optimizations && (
          <div className="space-y-2">
            <h4 className="text-[#CFAF6E] font-semibold">Optimization Recommendations</h4>
            {data.optimizations.map((opt: any, i: number) => (
              <div key={i} className="p-3 bg-gradient-to-r from-green-500/10 to-transparent rounded border border-green-500/20">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  <span className="text-[#EDEDED]">{opt.recommendation || opt}</span>
                </div>
                {opt.savings && <p className="text-sm text-green-400 mt-1">Projected savings: {opt.savings}</p>}
              </div>
            ))}
          </div>
        )}
        {data.projected_savings && (
          <div className="p-4 bg-gradient-to-r from-[#CFAF6E]/10 to-transparent rounded-lg border border-[#CFAF6E]/20">
            <h4 className="text-[#CFAF6E] font-semibold mb-2">Projected Savings</h4>
            <p className="text-2xl font-bold text-[#EDEDED]">{data.projected_savings}</p>
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
              <Workflow className="w-8 h-8 text-[#CFAF6E]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#EDEDED]">Operations & Process Suite</h1>
              <p className="text-[#BFBFBF]">AI-Powered Workflow Optimization & Automation</p>
            </div>
          </div>
          <Button className="bg-[#CFAF6E] text-black hover:bg-[#CFAF6E]/80">
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Active Workflows", value: "24", icon: Workflow, color: "text-[#CFAF6E]" },
            { label: "Running Processes", value: "156", icon: Play, color: "text-green-400" },
            { label: "Avg Cycle Time", value: "4.2d", icon: Clock, color: "text-blue-400" },
            { label: "SLA Compliance", value: "94%", icon: Target, color: "text-purple-400" },
            { label: "Automation Rate", value: "67%", icon: Zap, color: "text-amber-400" },
          ].map((metric, i) => (
            <Card key={i} className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
              <div className="flex items-center gap-2">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                <span className="text-[#BFBFBF] text-sm">{metric.label}</span>
              </div>
              <p className="text-2xl font-bold text-[#EDEDED] mt-2">{metric.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Actions Panel */}
          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Process Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => executeAnalysis("workflow_analysis", "Workflow Efficiency Analysis")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <BarChart3 className="w-4 h-4 mr-2 text-[#CFAF6E]" />
                {loading === "workflow_analysis" ? "Analyzing..." : "Analyze Bottlenecks"}
              </Button>

              <Button
                onClick={() => executeAnalysis("process_mining", "Process Mining Report")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <GitBranch className="w-4 h-4 mr-2 text-blue-400" />
                {loading === "process_mining" ? "Mining..." : "Generate Process Map"}
              </Button>

              <Button
                onClick={() => executeAnalysis("resource_optimization", "Resource Optimization")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <Users className="w-4 h-4 mr-2 text-purple-400" />
                {loading === "resource_optimization" ? "Optimizing..." : "Optimize Resources"}
              </Button>

              <Button
                onClick={() => executeAnalysis("sla_monitoring", "SLA Monitoring")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <Target className="w-4 h-4 mr-2 text-green-400" />
                {loading === "sla_monitoring" ? "Monitoring..." : "Set SLA"}
              </Button>

              <Button
                onClick={() => executeAnalysis("automation_opportunities", "Automation Analysis")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <Zap className="w-4 h-4 mr-2 text-amber-400" />
                {loading === "automation_opportunities" ? "Analyzing..." : "Find Automation"}
              </Button>

              <div className="border-t border-[#CFAF6E]/20 pt-3 mt-3 space-y-3">
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <Play className="w-4 h-4 mr-2" />
                  Start Process
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reassign Task
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Upload
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <FileText className="w-4 h-4 mr-2" />
                  Clone Workflow
                </Button>
              </div>
            </div>
          </Card>

          {/* Results / Active Workflows */}
          <Card className="col-span-2 bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#EDEDED]">
                {result ? result.title : "Active Workflows"}
              </h3>
              {result && (
                <Button size="sm" variant="outline" className="border-[#CFAF6E]/30">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              )}
            </div>

            <ScrollArea className="h-[350px]">
              {result ? (
                renderResultContent()
              ) : (
                <div className="space-y-3">
                  {activeWorkflows.map((workflow, i) => (
                    <div key={i} className="p-4 bg-[#1A1A1A] rounded-lg border border-[#CFAF6E]/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[#EDEDED] font-medium">{workflow.name}</h4>
                        <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                          {workflow.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#BFBFBF] mb-2">Current stage: {workflow.stage}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={workflow.progress} className="flex-1 h-2" />
                        <span className="text-sm text-[#CFAF6E]">{workflow.progress}%</span>
                      </div>
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
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Process Throughput Today</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="hour" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #CFAF6E30" }} />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                <Area type="monotone" dataKey="pending" stackId="1" stroke="#CFAF6E" fill="#CFAF6E" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Workflow Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={workflowStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#666" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" stroke="#666" width={80} />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #CFAF6E30" }} />
                <Bar dataKey="efficiency" fill="#CFAF6E" radius={[0, 4, 4, 0]} />
                <Bar dataKey="sla" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};
