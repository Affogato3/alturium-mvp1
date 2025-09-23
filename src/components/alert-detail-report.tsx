import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CausalChainVisualizer } from "@/components/causal-chain-visualizer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  Shield,
  TrendingUp,
  Users,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  BarChart3,
  Calendar,
  MapPin,
} from "lucide-react";

interface AlertDetail {
  id: number;
  message: string;
  type: "danger" | "warning" | "info";
  time: string;
}

interface AlertDetailReportProps {
  alert: AlertDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

// Generate detailed report data based on alert
const generateDetailedReport = (alert: AlertDetail) => {
  const baseReports = {
    danger: {
      context: {
        title: "Unauthorized Vendor Payment",
        code: `ALT-${alert.id}-CR`,
        detectedBy: "ML Anomaly Detector + Rule Engine",
        sourceSystem: "Finance - AP Module",
        severity: "Critical",
      },
      rootCause: {
        trigger: "Payment bypassed standard 3-tier authorization workflow",
        evidence: ["TXN-789456", "Missing approval from Finance Director", "Vendor not in approved list"],
        businessContext: "High-risk payment pattern indicates potential fraud or process violation",
      },
      impact: {
        financial: "$45,000 - Immediate exposure, $200K potential fraud risk",
        operational: "AP workflow integrity compromised, 3 pending payments halted",
        compliance: "SOX 404 violation risk, potential audit finding",
      },
      compliance: {
        policies: ["Procurement Policy §3.2", "Financial Authorization Matrix", "Vendor Management Standard"],
        regulations: ["SOX Section 404", "Internal Controls Framework"],
        pastOccurrences: "2 similar incidents in last 90 days (increasing trend)",
      },
      risk: {
        type: "Fraud Risk",
        probability: "High (75%)",
        recurrence: "Likely without process changes",
      },
      actions: [
        { action: "Freeze payment immediately", owner: "Finance Director", timeline: "Immediate" },
        { action: "Review vendor credentials", owner: "Procurement Team", timeline: "24 hours" },
        { action: "Implement additional controls", owner: "Risk Manager", timeline: "1 week" },
      ],
      solutions: [
        "Implement automated 3-tier approval workflow with mandatory sign-offs",
        "Add real-time vendor validation against approved vendor database",
        "Deploy ML-based payment pattern monitoring for early fraud detection",
        "Create segregation of duties matrix to prevent single-person approvals",
      ],
    },
    warning: {
      context: {
        title: "Multiple Failed Login Attempts",
        code: `ALT-${alert.id}-WR`,
        detectedBy: "Security Monitoring System",
        sourceSystem: "IT Security - Identity Management",
        severity: "Medium",
      },
      rootCause: {
        trigger: "15 failed login attempts from single IP in 10 minutes",
        evidence: ["IP: 192.168.1.100", "User: admin@company.com", "Failed attempts: 15"],
        businessContext: "Potential brute force attack or compromised credentials",
      },
      impact: {
        financial: "No direct financial impact, $10K potential data breach cost",
        operational: "Account temporarily locked, user productivity impact minimal",
        compliance: "GDPR Article 32 - Security breach notification may be required",
      },
      compliance: {
        policies: ["Information Security Policy", "Access Control Standard"],
        regulations: ["GDPR Article 32", "ISO 27001"],
        pastOccurrences: "5 similar incidents this month (stable trend)",
      },
      risk: {
        type: "Data Security Risk",
        probability: "Medium (45%)",
        recurrence: "Moderate without enhanced monitoring",
      },
      actions: [
        { action: "Reset user password", owner: "IT Security", timeline: "2 hours" },
        { action: "Block suspicious IP", owner: "Network Admin", timeline: "1 hour" },
        { action: "Enable MFA for account", owner: "IT Security", timeline: "24 hours" },
      ],
      solutions: [
        "Implement progressive login delays after failed attempts",
        "Deploy IP-based geolocation blocking for unusual locations",
        "Mandatory multi-factor authentication for all administrative accounts",
        "Real-time security monitoring with automated threat response",
      ],
    },
    info: {
      context: {
        title: "Expense Report Submitted",
        code: `ALT-${alert.id}-IF`,
        detectedBy: "Workflow Management System",
        sourceSystem: "HR - Expense Management",
        severity: "Low",
      },
      rootCause: {
        trigger: "Employee expense report exceeds policy limits",
        evidence: ["Report ID: EXP-2024-001", "Amount: $2,500 (Limit: $2,000)", "Category: Travel"],
        businessContext: "Routine policy validation requiring managerial review",
      },
      impact: {
        financial: "$2,500 pending approval, low financial risk",
        operational: "Standard approval workflow triggered, no disruption",
        compliance: "Travel & Expense Policy compliance check",
      },
      compliance: {
        policies: ["Travel & Expense Policy", "Employee Handbook §7.3"],
        regulations: ["Tax Code Compliance", "Corporate Governance"],
        pastOccurrences: "12 similar cases this month (normal volume)",
      },
      risk: {
        type: "Policy Compliance",
        probability: "Low (15%)",
        recurrence: "Routine occurrence",
      },
      actions: [
        { action: "Route to manager for approval", owner: "HR System", timeline: "Auto-completed" },
        { action: "Request expense justification", owner: "Line Manager", timeline: "48 hours" },
        { action: "Review policy limits", owner: "Finance Team", timeline: "1 week" },
      ],
      solutions: [
        "Implement pre-approval workflow for expenses exceeding limits",
        "Add real-time expense tracking with budget notifications",
        "Create expense category-specific limits and approval matrices",
        "Deploy mobile expense reporting with policy validation",
      ],
    },
  };

  return baseReports[alert.type];
};

export function AlertDetailReport({ alert, isOpen, onClose }: AlertDetailReportProps) {
  if (!alert) return null;

  const report = generateDetailedReport(alert);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "text-destructive";
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-muted-foreground";
      default: return "text-foreground";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return <XCircle className="h-4 w-4" />;
      case "high": return <AlertTriangle className="h-4 w-4" />;
      case "medium": return <AlertCircle className="h-4 w-4" />;
      case "low": return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Detailed Alert Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Causal Chain Visualizer */}
          <CausalChainVisualizer alert={alert} />

          {/* Alert Context & Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                🔍 Alert Context & Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alert Title</p>
                  <p className="text-lg font-semibold">{report.context.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alert ID / Code</p>
                  <p className="font-mono text-sm">{report.context.code}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Detected By</p>
                  <p>{report.context.detectedBy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                  <p className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {alert.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Source System</p>
                  <p className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {report.context.sourceSystem}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Severity</p>
                  <Badge className={`flex items-center gap-1 ${getSeverityColor(report.context.severity)}`}>
                    {getSeverityIcon(report.context.severity)}
                    {report.context.severity}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Root Cause Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                📊 Root Cause Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">What triggered the alert?</p>
                <p className="mt-1">{report.rootCause.trigger}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Supporting Evidence</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {report.rootCause.evidence.map((item, idx) => (
                    <li key={idx} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Business Context</p>
                <p className="mt-1">{report.rootCause.businessContext}</p>
              </div>
            </CardContent>
          </Card>

          {/* Impact Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                🧮 Quantitative Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Financial Impact</p>
                  <p className="mt-1 text-sm">{report.impact.financial}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Operational Impact</p>
                  <p className="mt-1 text-sm">{report.impact.operational}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliance Impact</p>
                  <p className="mt-1 text-sm">{report.impact.compliance}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance & Policy Mapping */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                ⚖️ Compliance & Policy Mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Policies Violated</p>
                  <ul className="mt-1 space-y-1">
                    {report.compliance.policies.map((policy, idx) => (
                      <li key={idx} className="text-sm">• {policy}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Regulatory References</p>
                  <ul className="mt-1 space-y-1">
                    {report.compliance.regulations.map((reg, idx) => (
                      <li key={idx} className="text-sm">• {reg}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Past Occurrences</p>
                  <p className="mt-1 text-sm flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {report.compliance.pastOccurrences}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Categorization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                🛠️ Risk Categorization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Risk Type</p>
                  <Badge variant="outline" className="mt-1">{report.risk.type}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Probability</p>
                  <p className="mt-1 text-sm">{report.risk.probability}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recurrence Risk</p>
                  <p className="mt-1 text-sm">{report.risk.recurrence}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                ✅ Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.actions.map((action, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{action.action}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {action.owner}
                      </p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {action.timeline}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI-Generated Solutions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                🤖 AI-Generated Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  These solutions are AI-generated based on the alert pattern and industry best practices.
                </AlertDescription>
              </Alert>
              <div className="mt-4 space-y-2">
                {report.solutions.map((solution, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{solution}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export to PDF
            </Button>
            <Button onClick={onClose}>Close Report</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}