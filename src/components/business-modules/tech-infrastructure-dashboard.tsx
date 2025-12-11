import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Server, Shield, Activity, Cpu, HardDrive, Zap,
  AlertTriangle, CheckCircle, RefreshCw, Download, Eye,
  Key, Database, Cloud, Terminal, FileText, Play
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface AnalysisResult {
  title: string;
  data: any;
  timestamp: Date;
  type: string;
}

export const TechInfrastructureDashboard = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const executeAnalysis = async (action: string, title: string) => {
    setLoading(action);
    try {
      const { data, error } = await supabase.functions.invoke("business-intelligence-engine", {
        body: {
          module: "infrastructure",
          action,
          data: {
            services: 24,
            uptime: "99.97%",
            avg_response_time: "145ms",
            error_rate: "0.02%",
            cpu_utilization: 67,
            memory_utilization: 72,
            storage_used: 85,
            active_connections: 1250,
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

  const performanceData = [
    { time: "00:00", cpu: 45, memory: 52, latency: 120 },
    { time: "04:00", cpu: 32, memory: 48, latency: 95 },
    { time: "08:00", cpu: 68, memory: 65, latency: 145 },
    { time: "12:00", cpu: 85, memory: 78, latency: 180 },
    { time: "16:00", cpu: 72, memory: 70, latency: 155 },
    { time: "20:00", cpu: 58, memory: 62, latency: 130 },
  ];

  const services = [
    { name: "API Gateway", status: "healthy", uptime: "99.99%", latency: "45ms" },
    { name: "Auth Service", status: "healthy", uptime: "99.98%", latency: "32ms" },
    { name: "Database Cluster", status: "healthy", uptime: "99.97%", latency: "12ms" },
    { name: "ML Pipeline", status: "warning", uptime: "99.85%", latency: "250ms" },
    { name: "Cache Layer", status: "healthy", uptime: "99.99%", latency: "5ms" },
    { name: "Message Queue", status: "healthy", uptime: "99.96%", latency: "18ms" },
  ];

  const securityAlerts = [
    { type: "info", message: "SSL certificate renews in 30 days", time: "2h ago" },
    { type: "warning", message: "Unusual login pattern detected", time: "4h ago" },
    { type: "success", message: "Security scan completed - no issues", time: "6h ago" },
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
        {data.health_score !== undefined && (
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#CFAF6E]/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#BFBFBF]">System Health Score</span>
              <Badge variant={data.health_score > 80 ? "default" : "destructive"}>{renderValue(data.health_score)}/100</Badge>
            </div>
            <Progress value={typeof data.health_score === "number" ? data.health_score : 0} className="h-2" />
          </div>
        )}
        {data.issues && Array.isArray(data.issues) && data.issues.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-amber-500 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Issues Detected
            </h4>
            {data.issues.map((issue: any, i: number) => (
              <div key={i} className="p-3 bg-amber-500/10 rounded border border-amber-500/20">
                <span className="text-[#EDEDED]">
                  {typeof issue === "string" ? issue : (issue.description || issue.message || renderValue(issue))}
                </span>
                {issue.severity && <Badge className="ml-2" variant="outline">{String(issue.severity)}</Badge>}
              </div>
            ))}
          </div>
        )}
        {data.security_findings && Array.isArray(data.security_findings) && data.security_findings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-red-500 font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security Findings
            </h4>
            {data.security_findings.map((finding: any, i: number) => (
              <div key={i} className="p-3 bg-red-500/10 rounded border border-red-500/20">
                <span className="text-[#EDEDED]">
                  {typeof finding === "string" ? finding : (finding.description || finding.message || renderValue(finding))}
                </span>
              </div>
            ))}
          </div>
        )}
        {data.optimizations && Array.isArray(data.optimizations) && (
          <div className="space-y-2">
            <h4 className="text-[#CFAF6E] font-semibold">Optimization Recommendations</h4>
            {data.optimizations.map((opt: any, i: number) => (
              <div key={i} className="p-3 bg-gradient-to-r from-[#CFAF6E]/10 to-transparent rounded border border-[#CFAF6E]/20">
                <span className="text-[#EDEDED]">
                  {typeof opt === "string" ? opt : (opt.recommendation || opt.title || renderValue(opt))}
                </span>
              </div>
            ))}
          </div>
        )}
        {data.cost_savings && (
          <div className="p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border border-green-500/20">
            <h4 className="text-green-500 font-semibold mb-2">Potential Cost Savings</h4>
            <p className="text-2xl font-bold text-[#EDEDED]">{renderValue(data.cost_savings)}</p>
          </div>
        )}
        {/* Fallback for unknown data structures */}
        {!data.health_score && !data.issues && !data.security_findings && !data.optimizations && !data.cost_savings && (
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
              <Server className="w-8 h-8 text-[#CFAF6E]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#EDEDED]">AI Technology Infrastructure</h1>
              <p className="text-[#BFBFBF]">Intelligent System Monitoring & Optimization</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-6 gap-4">
          {[
            { label: "Services", value: "24", icon: Cloud, status: "healthy" },
            { label: "Uptime", value: "99.97%", icon: Activity, status: "healthy" },
            { label: "Avg Latency", value: "145ms", icon: Zap, status: "healthy" },
            { label: "CPU Usage", value: "67%", icon: Cpu, status: "warning" },
            { label: "Memory", value: "72%", icon: HardDrive, status: "warning" },
            { label: "Storage", value: "85%", icon: Database, status: "critical" },
          ].map((metric, i) => (
            <Card key={i} className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
              <div className="flex items-center justify-between">
                <metric.icon className="w-5 h-5 text-[#CFAF6E]" />
                <div className={`w-2 h-2 rounded-full ${
                  metric.status === "healthy" ? "bg-green-500" : 
                  metric.status === "warning" ? "bg-amber-500" : "bg-red-500"
                }`} />
              </div>
              <p className="text-xl font-bold text-[#EDEDED] mt-2">{metric.value}</p>
              <p className="text-sm text-[#BFBFBF]">{metric.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Actions Panel */}
          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Infrastructure Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => executeAnalysis("system_health", "System Health Analysis")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <Activity className="w-4 h-4 mr-2 text-[#CFAF6E]" />
                {loading === "system_health" ? "Analyzing..." : "View System Health"}
              </Button>

              <Button
                onClick={() => executeAnalysis("security_scan", "Security Scan")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <Shield className="w-4 h-4 mr-2 text-red-400" />
                {loading === "security_scan" ? "Scanning..." : "Run Security Scan"}
              </Button>

              <Button
                onClick={() => executeAnalysis("cost_optimization", "Cost Optimization")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <Zap className="w-4 h-4 mr-2 text-green-400" />
                {loading === "cost_optimization" ? "Optimizing..." : "Optimize Costs"}
              </Button>

              <Button
                onClick={() => executeAnalysis("capacity_planning", "Capacity Planning")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <Server className="w-4 h-4 mr-2 text-blue-400" />
                {loading === "capacity_planning" ? "Planning..." : "Scale Resources"}
              </Button>

              <Button
                onClick={() => executeAnalysis("incident_analysis", "Incident Analysis")}
                disabled={loading !== null}
                className="w-full justify-start bg-[#1A1A1A] hover:bg-[#252525] text-[#EDEDED] border border-[#CFAF6E]/20"
              >
                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                {loading === "incident_analysis" ? "Analyzing..." : "Review Alerts"}
              </Button>

              <div className="border-t border-[#CFAF6E]/20 pt-3 mt-3 space-y-3">
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <Play className="w-4 h-4 mr-2" />
                  Deploy Model
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <Terminal className="w-4 h-4 mr-2" />
                  View Logs
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <Key className="w-4 h-4 mr-2" />
                  Generate API Key
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Trigger Backup
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#CFAF6E]/30 text-[#CFAF6E]">
                  <FileText className="w-4 h-4 mr-2" />
                  Test Failover
                </Button>
              </div>
            </div>
          </Card>

          {/* Results / Services Panel */}
          <Card className="col-span-2 bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#EDEDED]">
                {result ? result.title : "Service Status"}
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
                  {services.map((service, i) => (
                    <div key={i} className="p-4 bg-[#1A1A1A] rounded-lg border border-[#CFAF6E]/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            service.status === "healthy" ? "bg-green-500" : 
                            service.status === "warning" ? "bg-amber-500" : "bg-red-500"
                          }`} />
                          <span className="text-[#EDEDED] font-medium">{service.name}</span>
                        </div>
                        <Badge variant={service.status === "healthy" ? "default" : "secondary"}>
                          {service.status}
                        </Badge>
                      </div>
                      <div className="flex gap-6 mt-2 text-sm text-[#BFBFBF]">
                        <span>Uptime: {service.uptime}</span>
                        <span>Latency: {service.latency}</span>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4">
                    <h4 className="text-[#BFBFBF] text-sm font-semibold mb-3">Recent Alerts</h4>
                    {securityAlerts.map((alert, i) => (
                      <div key={i} className={`p-3 rounded mb-2 ${
                        alert.type === "warning" ? "bg-amber-500/10 border border-amber-500/20" :
                        alert.type === "success" ? "bg-green-500/10 border border-green-500/20" :
                        "bg-blue-500/10 border border-blue-500/20"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#EDEDED]">{alert.message}</span>
                          <span className="text-xs text-[#666]">{alert.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Resource Utilization (24h)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #CFAF6E30" }} />
                <Area type="monotone" dataKey="cpu" stroke="#CFAF6E" fill="#CFAF6E" fillOpacity={0.3} />
                <Area type="monotone" dataKey="memory" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#CFAF6E]/20 p-4">
            <h3 className="text-lg font-semibold text-[#EDEDED] mb-4">Response Latency (24h)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #CFAF6E30" }} />
                <Line type="monotone" dataKey="latency" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};
