import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";

interface ComplianceMetric {
  department: string;
  policy: string;
  score: number;
  trend: "up" | "down" | "stable";
  riskLevel: "low" | "medium" | "high" | "critical";
  lastAudit: string;
  issues: number;
}

interface ComplianceHeatmapProps {
  timeframe?: string;
}

const mockComplianceData: ComplianceMetric[] = [
  { department: "Finance", policy: "SOX Controls", score: 95, trend: "up", riskLevel: "low", lastAudit: "2024-01-15", issues: 2 },
  { department: "Finance", policy: "Expense Approval", score: 78, trend: "down", riskLevel: "medium", lastAudit: "2024-01-10", issues: 8 },
  { department: "Finance", policy: "Vendor Management", score: 65, trend: "down", riskLevel: "high", lastAudit: "2024-01-05", issues: 15 },
  
  { department: "HR", policy: "Access Controls", score: 88, trend: "stable", riskLevel: "low", lastAudit: "2024-01-12", issues: 4 },
  { department: "HR", policy: "Background Checks", score: 92, trend: "up", riskLevel: "low", lastAudit: "2024-01-08", issues: 1 },
  { department: "HR", policy: "Training Records", score: 71, trend: "down", riskLevel: "medium", lastAudit: "2024-01-03", issues: 12 },
  
  { department: "IT", policy: "Data Security", score: 85, trend: "up", riskLevel: "low", lastAudit: "2024-01-14", issues: 6 },
  { department: "IT", policy: "System Access", score: 58, trend: "down", riskLevel: "critical", lastAudit: "2024-01-07", issues: 22 },
  { department: "IT", policy: "Backup Procedures", score: 90, trend: "stable", riskLevel: "low", lastAudit: "2024-01-11", issues: 3 },
  
  { department: "Legal", policy: "Contract Review", score: 82, trend: "up", riskLevel: "low", lastAudit: "2024-01-09", issues: 5 },
  { department: "Legal", policy: "Regulatory Filing", score: 76, trend: "stable", riskLevel: "medium", lastAudit: "2024-01-06", issues: 9 },
  { department: "Legal", policy: "Privacy Controls", score: 94, trend: "up", riskLevel: "low", lastAudit: "2024-01-13", issues: 1 },
];

export function ComplianceHeatmap({ timeframe = "current" }: ComplianceHeatmapProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedMetric, setSelectedMetric] = useState<ComplianceMetric | null>(null);

  const departments = [...new Set(mockComplianceData.map(item => item.department))];
  
  const filteredData = selectedDepartment === "all" 
    ? mockComplianceData 
    : mockComplianceData.filter(item => item.department === selectedDepartment);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-green-400";
    if (score >= 70) return "bg-yellow-400";
    if (score >= 60) return "bg-orange-400";
    return "bg-red-500";
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return "text-green-600 bg-green-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "high": return "text-orange-600 bg-orange-50";
      case "critical": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-green-500" />;
      case "down": return <TrendingDown className="h-3 w-3 text-red-500" />;
      case "stable": return <Activity className="h-3 w-3 text-blue-500" />;
      default: return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const departmentGroups = departments.reduce((acc, dept) => {
    acc[dept] = filteredData.filter(item => item.department === dept);
    return acc;
  }, {} as Record<string, ComplianceMetric[]>);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Activity className="h-5 w-5 text-accent" />
            Compliance Heatmap
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-muted-foreground">
          Real-time policy adherence across departments
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Heatmap Grid */}
        <div className="space-y-4">
          {Object.entries(departmentGroups).map(([department, metrics]) => (
            <div key={department} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">{department}</h3>
              <div className="grid gap-2">
                {metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedMetric(selectedMetric?.policy === metric.policy ? null : metric)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{metric.policy}</span>
                        {getTrendIcon(metric.trend)}
                        {metric.issues > 10 && (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getScoreColor(metric.score)}`}
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-semibold w-8">
                          {metric.score}%
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={`text-xs ${getRiskColor(metric.riskLevel)}`}>
                        {metric.riskLevel}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {metric.issues} issues
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedMetric && (
          <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">{selectedMetric.policy} Details</h4>
              <Badge className={getRiskColor(selectedMetric.riskLevel)}>
                {selectedMetric.riskLevel} risk
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Score:</span>
                <div className="font-semibold">{selectedMetric.score}%</div>
              </div>
              <div>
                <span className="text-muted-foreground">Active Issues:</span>
                <div className="font-semibold">{selectedMetric.issues}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Last Audit:</span>
                <div className="font-semibold">{new Date(selectedMetric.lastAudit).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Department:</span>
                <div className="font-semibold">{selectedMetric.department}</div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button size="sm" className="text-xs">
                View Details
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Remediation Plan
              </Button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
          <div className="flex items-center gap-4">
            <span>Score:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>90+</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span>70-89</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>&lt;70</span>
            </div>
          </div>
          <span>Click on any policy for detailed breakdown</span>
        </div>
      </CardContent>
    </Card>
  );
}