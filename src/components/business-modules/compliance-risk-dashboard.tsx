import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Shield, FileSearch, AlertTriangle, BookOpen, Scale, 
  Clock, MessageSquare, Download, Settings, RefreshCw,
  CheckCircle, XCircle, Eye, Calendar, Bell
} from "lucide-react";

interface AnalysisResult {
  title: string;
  data: any;
  timestamp: Date;
  type: string;
}

export const ComplianceRiskDashboard = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const executeAnalysis = async (action: string, title: string) => {
    setLoading(action);
    try {
      const { data, error } = await supabase.functions.invoke("business-intelligence-engine", {
        body: {
          module: "compliance",
          action,
          data: {
            organization: "Current Organization",
            period: "Last 30 days",
            departments: ["Finance", "Operations", "HR", "IT", "Legal"],
            regulations: ["GDPR", "SOX", "HIPAA", "PCI-DSS"],
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
            if (line.match(/^\d+\./)) {
              return <li key={i} className="text-[#BFBFBF] ml-4 list-decimal">{line.substring(line.indexOf(".") + 1)}</li>;
            }
            return line ? <p key={i} className="text-[#BFBFBF]">{line}</p> : <br key={i} />;
          })}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {data.risk_score !== undefined && (
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#CFAF6E]/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#BFBFBF]">Overall Risk Score</span>
              <Badge variant={data.risk_score > 70 ? "destructive" : data.risk_score > 40 ? "secondary" : "default"}>
                {renderValue(data.risk_score)}/100
              </Badge>
            </div>
            <Progress value={typeof data.risk_score === "number" ? data.risk_score : 0} className="h-2" />
          </div>
        )}
        {data.findings && Array.isArray(data.findings) && (
          <div className="space-y-2">
            <h4 className="text-[#CFAF6E] font-semibold">Findings</h4>
            {data.findings.map((finding: any, i: number) => (
              <div key={i} className="p-3 bg-[#1A1A1A] rounded border border-[#CFAF6E]/10">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-[#EDEDED]">
                    {typeof finding === "string" ? finding : (finding.title || finding.description || renderValue(finding))}
                  </span>
                </div>
                {finding.description && typeof finding.description === "string" && (
                  <p className="text-sm text-[#BFBFBF]">{finding.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
        {data.recommendations && Array.isArray(data.recommendations) && (
          <div className="space-y-2">
            <h4 className="text-[#CFAF6E] font-semibold">Recommendations</h4>
            {data.recommendations.map((rec: any, i: number) => (
              <div key={i} className="p-3 bg-[#1A1A1A] rounded border border-green-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-[#EDEDED]">
                    {typeof rec === "string" ? rec : (rec.action || rec.recommendation || rec.title || renderValue(rec))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {data.summary && (
          <div className="p-4 bg-gradient-to-r from-[#CFAF6E]/10 to-transparent rounded-lg border border-[#CFAF6E]/20">
            <h4 className="text-[#CFAF6E] font-semibold mb-2">Summary</h4>
            <p className="text-[#BFBFBF]">{typeof data.summary === "string" ? data.summary : renderValue(data.summary)}</p>
          </div>
        )}
        {/* Fallback for unknown data structures */}
        {!data.risk_score && !data.findings && !data.recommendations && !data.summary && (
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#CFAF6E]/20">
            <pre className="text-[#BFBFBF] text-sm whitespace-pre-wrap overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const riskMetrics = [
    { label: "Active Policies", value: "47", trend: "+3", color: "text-green-400" },
    { label: "Open Incidents", value: "12", trend: "-5", color: "text-amber-400" },
    { label: "Compliance Score", value: "94%", trend: "+2%", color: "text-green-400" },
    { label: "Pending Reviews", value: "8", trend: "+1", color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-[#CFAF6E]/20 to-[#EDEDED]/10">
              <Shield className="w-8 h-8 text-[#CFAF6E]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#EDEDED]">Compliance Risk Management</h1>
              <p className="text-[#BFBFBF]">AI-Powered Compliance Monitoring & Risk Assessment</p>
            </div>
          </div>
          <Button variant="outline" className="border-[#CFAF6E]/30 text-[#CFAF6E]">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-4 gap-4">
          {riskMetrics.map((metric, i) => (
            <Card key={i} className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
              <p className="text-[#BFBFBF] text-sm">{metric.label}</p>
              <div className="flex items-end justify-between mt-2">
                <span className="text-2xl font-bold text-[#EDEDED]">{metric.value}</span>
                <span className={`text-sm ${metric.color}`}>{metric.trend}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Actions Panel */}
          <Card className="col-span-1 bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => executeAnalysis("scan_documents", "Document Compliance Scan")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <FileSearch className="w-4 h-4 mr-2 text-[#CFAF6E]" />
                {loading === "scan_documents" ? "Scanning..." : "Scan Documents"}
              </Button>

              <Button
                onClick={() => executeAnalysis("generate_risk_report", "Risk Assessment Report")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                {loading === "generate_risk_report" ? "Generating..." : "Generate Risk Report"}
              </Button>

              <Button
                onClick={() => executeAnalysis("policy_analysis", "Policy Gap Analysis")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
                {loading === "policy_analysis" ? "Analyzing..." : "Compare Policies"}
              </Button>

              <Button
                onClick={() => executeAnalysis("audit_preparation", "Audit Preparation")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                {loading === "audit_preparation" ? "Preparing..." : "Schedule Audit"}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]"
              >
                <Bell className="w-4 h-4 mr-2" />
                Set Alert Threshold
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask Compliance AI
              </Button>
            </div>

            {/* Recent Activity */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-[#BFBFBF] mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {[
                  { action: "Policy Updated", time: "2h ago", icon: RefreshCw },
                  { action: "Incident Resolved", time: "4h ago", icon: CheckCircle },
                  { action: "Audit Scheduled", time: "1d ago", icon: Calendar },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <item.icon className="w-3 h-3 text-[#CFAF6E]" />
                    <span className="text-[#BFBFBF]">{item.action}</span>
                    <span className="text-[#666] ml-auto">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Results Panel */}
          <Card className="col-span-2 bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#EDEDED]">
                {result ? result.title : "Analysis Results"}
              </h3>
              {result && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#666]">
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                  <Button size="sm" variant="outline" className="border-[#CFAF6E]/30">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
              )}
            </div>

            <ScrollArea className="h-[500px]">
              {result ? (
                renderResultContent()
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Shield className="w-16 h-16 text-[#CFAF6E]/30 mb-4" />
                  <p className="text-[#BFBFBF]">Select an action to view compliance analysis results</p>
                  <p className="text-sm text-[#666] mt-2">AI-powered insights will appear here</p>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* Risk Heat Map */}
        <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
          <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Risk Heat Map by Department</h3>
          <div className="grid grid-cols-5 gap-4">
            {["Finance", "Operations", "HR", "IT", "Legal"].map((dept, i) => {
              const risk = [35, 62, 28, 45, 18][i];
              const color = risk > 50 ? "bg-red-500/20 border-red-500/30" : risk > 30 ? "bg-amber-500/20 border-amber-500/30" : "bg-green-500/20 border-green-500/30";
              return (
                <div key={dept} className={`p-4 rounded-lg border ${color}`}>
                  <p className="text-[#EDEDED] font-medium">{dept}</p>
                  <p className="text-2xl font-bold text-[#EDEDED] mt-2">{risk}%</p>
                  <p className="text-xs text-[#BFBFBF]">Risk Level</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
