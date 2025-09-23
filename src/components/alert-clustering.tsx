import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitBranch, Users, DollarSign, Clock, AlertTriangle, TrendingUp } from "lucide-react";

interface AlertCluster {
  id: string;
  title: string;
  category: "fraud_ring" | "process_failure" | "it_security" | "compliance_gap";
  severity: "low" | "medium" | "high" | "critical";
  alertCount: number;
  totalImpact: number;
  timespan: string;
  pattern: string;
  affectedDepartments: string[];
  rootCause: string;
  alerts: ClusterAlert[];
}

interface ClusterAlert {
  id: string;
  title: string;
  timestamp: string;
  department: string;
  impact: number;
  status: "open" | "investigating" | "resolved";
}

const mockClusters: AlertCluster[] = [
  {
    id: "cluster_001",
    title: "Vendor Payment Fraud Ring",
    category: "fraud_ring",
    severity: "critical",
    alertCount: 8,
    totalImpact: 450000,
    timespan: "Last 14 days",
    pattern: "Sequential unauthorized payments to shell companies",
    affectedDepartments: ["Finance", "Procurement"],
    rootCause: "Compromised vendor approval process + insider collusion",
    alerts: [
      { id: "alert_001", title: "Unauthorized vendor payment - $85k", timestamp: "2024-01-15T14:30:00Z", department: "Finance", impact: 85000, status: "open" },
      { id: "alert_002", title: "Vendor setup without approval - TechCorp", timestamp: "2024-01-14T09:15:00Z", department: "Procurement", impact: 0, status: "investigating" },
      { id: "alert_003", title: "Duplicate invoice processing - $120k", timestamp: "2024-01-13T16:45:00Z", department: "Finance", impact: 120000, status: "open" },
    ]
  },
  {
    id: "cluster_002", 
    title: "IT Security Control Failures",
    category: "it_security",
    severity: "high",
    alertCount: 12,
    totalImpact: 25000,
    timespan: "Last 7 days",
    pattern: "Cascading access control violations",
    affectedDepartments: ["IT", "HR", "Finance"],
    rootCause: "System update broke role-based permissions",
    alerts: [
      { id: "alert_004", title: "Unauthorized admin access - Marketing user", timestamp: "2024-01-14T11:20:00Z", department: "IT", impact: 5000, status: "investigating" },
      { id: "alert_005", title: "Failed backup verification", timestamp: "2024-01-13T23:00:00Z", department: "IT", impact: 10000, status: "open" },
    ]
  },
  {
    id: "cluster_003",
    title: "SOX Compliance Violations",
    category: "compliance_gap", 
    severity: "medium",
    alertCount: 5,
    totalImpact: 75000,
    timespan: "Last 30 days",
    pattern: "Missing segregation of duties",
    affectedDepartments: ["Finance"],
    rootCause: "Staff rotation without updated access controls",
    alerts: [
      { id: "alert_006", title: "Same user initiated and approved transaction", timestamp: "2024-01-10T13:45:00Z", department: "Finance", impact: 35000, status: "resolved" },
    ]
  }
];

export function AlertClustering() {
  const [selectedCluster, setSelectedCluster] = useState<AlertCluster | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fraud_ring": return <Users className="h-4 w-4 text-red-500" />;
      case "it_security": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "compliance_gap": return <GitBranch className="h-4 w-4 text-yellow-500" />;
      case "process_failure": return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-50 border-red-200 text-red-800";
      case "high": return "bg-orange-50 border-orange-200 text-orange-800";
      case "medium": return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "low": return "bg-green-50 border-green-200 text-green-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800";
      case "investigating": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cluster List */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <GitBranch className="h-5 w-5 text-accent" />
              Alert Clusters
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Grouped by pattern and root cause
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockClusters.map((cluster) => (
              <div
                key={cluster.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCluster?.id === cluster.id
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                }`}
                onClick={() => setSelectedCluster(cluster)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(cluster.category)}
                  <span className="font-medium text-sm">{cluster.title}</span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`text-xs ${getSeverityColor(cluster.severity)}`}>
                    {cluster.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {cluster.alertCount} alerts
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{cluster.timespan}</span>
                  <span className="font-semibold">{formatCurrency(cluster.totalImpact)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Cluster Details */}
      <div className="lg:col-span-2">
        {selectedCluster ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getCategoryIcon(selectedCluster.category)}
                  {selectedCluster.title}
                </CardTitle>
                <Badge className={getSeverityColor(selectedCluster.severity)}>
                  {selectedCluster.severity} priority
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Total Impact</span>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="text-xl font-bold">{formatCurrency(selectedCluster.totalImpact)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Time Span</span>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold">{selectedCluster.timespan}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Alert Count</span>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-xl font-bold">{selectedCluster.alertCount}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-muted-foreground">Departments</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedCluster.affectedDepartments.map((dept) => (
                            <Badge key={dept} variant="outline" className="text-xs">
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Pattern Detected</h4>
                      <p className="text-sm text-muted-foreground">{selectedCluster.pattern}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-1">Root Cause Analysis</h4>
                      <p className="text-sm text-muted-foreground">{selectedCluster.rootCause}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="alerts" className="space-y-3">
                  {selectedCluster.alerts.map((alert) => (
                    <div key={alert.id} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{alert.title}</span>
                        <Badge className={`text-xs ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{alert.department} • {new Date(alert.timestamp).toLocaleDateString()}</span>
                        <span className="font-semibold">{formatCurrency(alert.impact)}</span>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                  <div className="p-4 bg-accent/5 rounded-lg">
                    <h4 className="font-medium mb-2">AI Recommendations</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Implement dual approval for vendor payments over $50k</li>
                      <li>• Review and rotate access permissions monthly</li>
                      <li>• Set up real-time monitoring for pattern detection</li>
                      <li>• Conduct forensic audit of related transactions</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm">Generate Action Plan</Button>
                    <Button size="sm" variant="outline">Escalate to Board</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-96 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a cluster to view details</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}