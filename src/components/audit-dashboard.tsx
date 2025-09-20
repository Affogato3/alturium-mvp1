import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HealthScoreCard } from "@/components/health-score-card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  FileText, 
  Download,
  Upload,
  Settings,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataUpload } from "@/components/data-upload";
import { useState } from "react";

// Mock data for demonstrations
const riskTrendData = [
  { month: "Jan", audit: 85, governance: 92, risk: 78 },
  { month: "Feb", audit: 78, governance: 88, risk: 82 },
  { month: "Mar", audit: 92, governance: 95, risk: 76 },
  { month: "Apr", audit: 88, governance: 90, risk: 85 },
  { month: "May", audit: 95, governance: 93, risk: 88 },
  { month: "Jun", audit: 91, governance: 97, risk: 91 },
];

const riskDistribution = [
  { name: "Low Risk", value: 65, color: "hsl(var(--success))" },
  { name: "Medium Risk", value: 25, color: "hsl(var(--warning))" },
  { name: "High Risk", value: 10, color: "hsl(var(--danger))" },
];

const recentAlerts = [
  { id: 1, type: "warning", message: "Unusual expense pattern detected in Q2", time: "2 hours ago" },
  { id: 2, type: "info", message: "Monthly governance review completed", time: "1 day ago" },
  { id: 3, type: "danger", message: "High risk transaction flagged for audit", time: "3 days ago" },
];

interface AuditDashboardProps {
  userRole: "admin" | "auditor" | "founder";
  auditMode: boolean;
}

export function AuditDashboard({ userRole, auditMode }: AuditDashboardProps) {
  const { toast } = useToast();
  const [showUpload, setShowUpload] = useState(false);

  const handleUploadData = () => {
    setShowUpload(true);
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generation Started",
      description: "Your audit report is being generated. You'll be notified when it's ready.",
    });
    
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your audit report has been generated successfully.",
      });
    }, 3000);
  };

  const handleExportAnalysis = () => {
    toast({
      title: "Export Started",
      description: "Your analysis data is being prepared for download.",
    });
    
    // Simulate export
    setTimeout(() => {
      const data = {
        auditHealth: 91,
        governanceIntegrity: 97,
        riskIndex: 88,
        exportDate: new Date().toISOString(),
        riskTrends: riskTrendData,
        riskDistribution: riskDistribution,
        recentAlerts: recentAlerts
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-analysis-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Analysis data has been downloaded successfully.",
      });
    }, 2000);
  };

  const handleAnalysisComplete = (results: any) => {
    toast({
      title: "Analysis Complete",
      description: `Processed ${results.fileName} with ${results.insights.records} records found.`,
    });
    setShowUpload(false);
  };

  if (showUpload) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Data Upload & Analysis</h2>
          <Button variant="outline" onClick={() => setShowUpload(false)}>
            Back to Dashboard
          </Button>
        </div>
        <DataUpload onAnalysisComplete={handleAnalysisComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HealthScoreCard
          title="Audit Health"
          score={91}
          type="audit"
          trend="up"
          description="Strong compliance posture with minor recommendations"
        />
        <HealthScoreCard
          title="Governance Integrity"
          score={97}
          type="governance"
          trend="up"
          description="Excellent governance framework implementation"
        />
        <HealthScoreCard
          title="Risk Index"
          score={88}
          type="risk"
          trend="neutral"
          description="Moderate risk profile with active monitoring"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" className="flex items-center gap-2" onClick={handleUploadData}>
              <Upload className="h-4 w-4" />
              Upload Data
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleGenerateReport}>
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExportAnalysis}>
              <Download className="h-4 w-4" />
              Export Analysis
            </Button>
            {(userRole === "admin" || userRole === "auditor") && (
              <Button variant="outline" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Audit Console
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Risk Trends (6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="audit" 
                    stroke="hsl(var(--audit))" 
                    strokeWidth={2} 
                    name="Audit Health"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="governance" 
                    stroke="hsl(var(--governance))" 
                    strokeWidth={2}
                    name="Governance"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="hsl(var(--risk))" 
                    strokeWidth={2}
                    name="Risk Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  alert.type === "danger" ? "bg-danger" :
                  alert.type === "warning" ? "bg-warning" : "bg-primary"
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <Badge variant={
                  alert.type === "danger" ? "destructive" :
                  alert.type === "warning" ? "secondary" : "default"
                }>
                  {alert.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auditor Mode Additional Details */}
      {auditMode && (userRole === "admin" || userRole === "auditor") && (
        <Card>
          <CardHeader>
            <CardTitle>Auditor Console</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">247</div>
                <div className="text-sm text-muted-foreground">Total Audits</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-warning">12</div>
                <div className="text-sm text-muted-foreground">Pending Reviews</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-success">98.5%</div>
                <div className="text-sm text-muted-foreground">Compliance Rate</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-danger">3</div>
                <div className="text-sm text-muted-foreground">Critical Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}