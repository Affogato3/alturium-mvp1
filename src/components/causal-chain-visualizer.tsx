import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Users,
  FileText,
  TrendingDown,
  Shield,
  Building,
} from "lucide-react";

interface AlertDetail {
  id: number;
  message: string;
  type: "danger" | "warning" | "info";
  time: string;
}

interface CausalChainVisualizerProps {
  alert: AlertDetail;
}

interface ChainNode {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "alert" | "root-cause" | "impact" | "stakeholder" | "consequence";
  severity: "critical" | "high" | "medium" | "low";
}

const generateCausalChain = (alert: AlertDetail): ChainNode[] => {
  const chainData = {
    danger: [
      {
        id: "alert",
        title: "Unauthorized Payment Alert",
        description: "$45,000 payment bypassed approval workflow",
        icon: <AlertTriangle className="h-5 w-5" />,
        type: "alert" as const,
        severity: "critical" as const,
      },
      {
        id: "root-cause",
        title: "Missing Approval Chain",
        description: "3-tier authorization process was circumvented",
        icon: <Shield className="h-5 w-5" />,
        type: "root-cause" as const,
        severity: "critical" as const,
      },
      {
        id: "impact",
        title: "Process Breakdown",
        description: "AP workflow integrity compromised, controls failed",
        icon: <Building className="h-5 w-5" />,
        type: "impact" as const,
        severity: "high" as const,
      },
      {
        id: "stakeholder",
        title: "Procurement Head Bypassed",
        description: "Finance Director and CFO approvals missing",
        icon: <Users className="h-5 w-5" />,
        type: "stakeholder" as const,
        severity: "high" as const,
      },
      {
        id: "consequence",
        title: "SOX Compliance Risk",
        description: "$120K exposure + potential regulatory penalties",
        icon: <DollarSign className="h-5 w-5" />,
        type: "consequence" as const,
        severity: "critical" as const,
      },
    ],
    warning: [
      {
        id: "alert",
        title: "Failed Login Attempts",
        description: "15 failed logins from single IP",
        icon: <AlertTriangle className="h-5 w-5" />,
        type: "alert" as const,
        severity: "medium" as const,
      },
      {
        id: "root-cause",
        title: "Potential Brute Force",
        description: "Automated attack pattern detected",
        icon: <Shield className="h-5 w-5" />,
        type: "root-cause" as const,
        severity: "medium" as const,
      },
      {
        id: "impact",
        title: "Account Lockout",
        description: "User productivity temporarily impacted",
        icon: <Building className="h-5 w-5" />,
        type: "impact" as const,
        severity: "low" as const,
      },
      {
        id: "stakeholder",
        title: "IT Security Team",
        description: "Network admin and security team alerted",
        icon: <Users className="h-5 w-5" />,
        type: "stakeholder" as const,
        severity: "medium" as const,
      },
      {
        id: "consequence",
        title: "Data Breach Risk",
        description: "$10K potential cost + GDPR considerations",
        icon: <DollarSign className="h-5 w-5" />,
        type: "consequence" as const,
        severity: "medium" as const,
      },
    ],
    info: [
      {
        id: "alert",
        title: "Expense Report Alert",
        description: "$2,500 exceeds $2,000 policy limit",
        icon: <FileText className="h-5 w-5" />,
        type: "alert" as const,
        severity: "low" as const,
      },
      {
        id: "root-cause",
        title: "Policy Limit Exceeded",
        description: "Travel expense above approval threshold",
        icon: <TrendingDown className="h-5 w-5" />,
        type: "root-cause" as const,
        severity: "low" as const,
      },
      {
        id: "impact",
        title: "Approval Required",
        description: "Standard workflow triggered for review",
        icon: <Building className="h-5 w-5" />,
        type: "impact" as const,
        severity: "low" as const,
      },
      {
        id: "stakeholder",
        title: "Line Manager",
        description: "Manager approval required for processing",
        icon: <Users className="h-5 w-5" />,
        type: "stakeholder" as const,
        severity: "low" as const,
      },
      {
        id: "consequence",
        title: "Routine Compliance",
        description: "Standard process, minimal risk exposure",
        icon: <DollarSign className="h-5 w-5" />,
        type: "consequence" as const,
        severity: "low" as const,
      },
    ],
  };

  return chainData[alert.type] || chainData.info;
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "bg-destructive text-destructive-foreground";
    case "high": return "bg-warning text-warning-foreground";
    case "medium": return "bg-primary text-primary-foreground";
    case "low": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

export function CausalChainVisualizer({ alert }: CausalChainVisualizerProps) {
  const chainNodes = generateCausalChain(alert);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          🔗 Causal Chain Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Desktop Layout - Horizontal */}
          <div className="hidden md:flex items-center justify-between space-x-4 overflow-x-auto pb-4">
            {chainNodes.map((node, index) => (
              <div key={node.id} className="flex items-center">
                {/* Node */}
                <div className="flex-shrink-0 w-48">
                  <div className="relative">
                    <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getSeverityColor(node.severity)}`}>
                          {node.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="text-xs mb-2">
                            {node.type.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <h4 className="font-semibold text-sm leading-tight mb-1">
                            {node.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {node.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow - only show if not last item */}
                {index < chainNodes.length - 1 && (
                  <div className="flex-shrink-0 mx-3">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Layout - Vertical */}
          <div className="md:hidden space-y-4">
            {chainNodes.map((node, index) => (
              <div key={node.id} className="relative">
                {/* Node */}
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getSeverityColor(node.severity)}`}>
                      {node.icon}
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="text-xs mb-2">
                        {node.type.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <h4 className="font-semibold text-sm leading-tight mb-1">
                        {node.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {node.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vertical connector - only show if not last item */}
                {index < chainNodes.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-0.5 h-6 bg-primary rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{chainNodes.length}</p>
              <p className="text-xs text-muted-foreground">Chain Steps</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-warning">
                {chainNodes.filter(n => n.severity === 'critical' || n.severity === 'high').length}
              </p>
              <p className="text-xs text-muted-foreground">High Risk</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-muted-foreground">
                {chainNodes.filter(n => n.type === 'stakeholder').length}
              </p>
              <p className="text-xs text-muted-foreground">Affected Teams</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-destructive">
                {alert.type === 'danger' ? 'Critical' : alert.type === 'warning' ? 'Medium' : 'Low'}
              </p>
              <p className="text-xs text-muted-foreground">Impact Level</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}