import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HealthScoreCard } from "@/components/health-score-card";
import { WhatIfSimulator } from "@/components/what-if-simulator";
import { ComplianceHeatmap } from "@/components/compliance-heatmap";
import { AlertClustering } from "@/components/alert-clustering";
import { TaskManagement } from "@/components/task-management";
import DecisionRoom from "@/components/decision-room";
import TeamAlignmentCompass from "@/components/team-alignment-compass";
import KPIWarRoom from "@/components/kpi-war-room";
import LeadershipMirror from "@/components/leadership-mirror";
import { InvestmentPortfolio } from "@/components/investment-portfolio";
import { MarketPulse } from "@/components/market-pulse";
import { RiskAnalyzer } from "@/components/risk-analyzer";
import { BudgetPlanner } from "@/components/budget-planner";
import { DataSyncHub } from "@/components/data-sync-hub";
import { DemandPreSignal } from "@/components/demand-pre-signal";
import { ContractValidator } from "@/components/contract-validator";
import { MarketAnomalyRadar } from "@/components/market-anomaly-radar";
import { ExpenseLeakDetector } from "@/components/expense-leak-detector";
import { TruthLedger } from "@/components/truth-ledger";
import { EconomicSignalFusion } from "@/components/economic-signal-fusion";
import { MarketIntelligenceHub } from "@/components/market-intelligence-hub";
import { AIStockTracker } from "@/components/ai-stock-tracker";
import EventImpactTimeline from "@/components/event-impact-timeline";
import ImpactResonanceEngine from "@/components/impact-resonance-engine";
import { HiddenMarketMapper } from "@/components/hidden-market-mapper";
import { MarketTimingOptimizer } from "@/components/market-timing-optimizer";
import { 
  LineChart,
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
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
  Bell,
  Target,
  Briefcase,
  Activity,
  PieChart as PieChartIcon,
  DollarSign,
  Database,
  TrendingDown,
  FileCheck,
  Radar,
  AlertCircle,
  Book,
  Radio,
  LayoutGrid,
  CheckSquare,
  Users,
  Gauge,
  Eye,
  BarChart3,
  Calendar,
  Network,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataUpload } from "@/components/data-upload";
import { SampleDataTester } from "@/components/sample-data-tester";
import { AlertDetailReport } from "@/components/alert-detail-report";
import { useState } from "react";
import { cn } from "@/lib/utils";

const riskTrendData = [
  { month: "Aug", audit: 84.9, governance: 89.2, risk: 76.3 },
  { month: "Sep", audit: 87.1, governance: 91.5, risk: 78.8 },
  { month: "Oct", audit: 89.3, governance: 93.1, risk: 82.4 },
  { month: "Nov", audit: 91.7, governance: 95.8, risk: 85.2 },
  { month: "Dec", audit: 88.9, governance: 92.4, risk: 79.7 },
  { month: "Jan", audit: 91.2, governance: 96.8, risk: 88.1 },
];

const riskDistribution = [
  { name: "Low Risk", value: 68, color: "hsl(var(--success))" },
  { name: "Medium Risk", value: 22, color: "hsl(var(--warning))" },
  { name: "High Risk", value: 10, color: "hsl(var(--danger))" },
];

const recentAlerts = [
  { id: 1, type: "danger" as const, message: "Critical: Revenue booking timing issues identified in Finance", time: "2 hours ago" },
  { id: 2, type: "danger" as const, message: "IT Administrator privileges not properly managed", time: "4 hours ago" },
  { id: 3, type: "warning" as const, message: "Vendor payments without proper authorization in Procurement", time: "1 day ago" },
  { id: 4, type: "warning" as const, message: "Round-sum payment to shell company flagged", time: "2 days ago" },
  { id: 5, type: "info" as const, message: "Monthly governance review completed - 94.5% compliance rate", time: "3 days ago" },
];

const sampleAnalysisResults = {
  "financial-transactions.csv": {
    records: 1247,
    anomalies: 8,
    riskScore: 73,
    insights: {
      highRiskTransactions: 5,
      suspiciousTiming: 2,
      duplicatePayments: 1,
      averageTransactionAmount: 4725.30
    }
  },
  "audit-findings.csv": {
    records: 156,
    anomalies: 12,
    riskScore: 68,
    insights: {
      criticalFindings: 2,
      openFindings: 8,
      averageRemediationTime: 28,
      complianceGaps: 5
    }
  },
  "governance-metrics.csv": {
    records: 40,
    anomalies: 3,
    riskScore: 91,
    insights: {
      governanceScore: 89.4,
      policyReviews: 24,
      boardMeetings: 15,
      complianceRate: 92.8
    }
  }
};

const navigationCategories = [
  {
    title: "Strategic Intelligence",
    items: [
      { id: "intelligence-hub", label: "Intelligence Hub", icon: TrendingUp },
      { id: "event-impact", label: "Event Impact", icon: Calendar },
      { id: "resonance", label: "Impact Resonance", icon: Network },
      { id: "simulator", label: "What-If Simulator", icon: Target },
      { id: "portfolio", label: "Investment Portfolio", icon: Briefcase },
      { id: "market", label: "Market Pulse", icon: Activity },
      { id: "stock-tracker", label: "Stock Tracker", icon: BarChart3 },
      { id: "kpi-war-room", label: "KPI War Room", icon: Gauge },
      { id: "hidden-market", label: "Hidden Market Mapper", icon: MapPin },
      { id: "timing-optimizer", label: "Market Timing", icon: Calendar },
    ]
  },
  {
    title: "Risk & Compliance",
    items: [
      { id: "risk", label: "Risk Analyzer", icon: Shield },
      { id: "anomaly", label: "Market Anomaly Radar", icon: Radar },
      { id: "clustering", label: "Alert Clustering", icon: AlertCircle },
      { id: "contracts", label: "Contract Validator", icon: FileCheck },
    ]
  },
  {
    title: "Financial Operations",
    items: [
      { id: "budget", label: "Budget Planner", icon: PieChartIcon },
      { id: "leaks", label: "Expense Leak Detector", icon: TrendingDown },
      { id: "truth", label: "Truth Ledger", icon: Book },
      { id: "signals", label: "Economic Signals", icon: Radio },
    ]
  },
  {
    title: "Data & Insights",
    items: [
      { id: "data-sync", label: "Data Sync Hub", icon: Database },
      { id: "demand", label: "Demand Pre-Signal", icon: TrendingUp },
      { id: "analytics", label: "Analytics Dashboard", icon: LayoutGrid },
    ]
  },
  {
    title: "Leadership & Team",
    items: [
      { id: "decision-room", label: "Decision Room", icon: Users },
      { id: "team-alignment", label: "Team Alignment", icon: Target },
      { id: "leadership-mirror", label: "Leadership Mirror", icon: Eye },
      { id: "tasks", label: "Task Management", icon: CheckSquare },
    ]
  },
];

interface AuditDashboardProps {
  userRole: "admin" | "auditor" | "founder";
  auditMode: boolean;
}

export function AuditDashboard({ userRole, auditMode }: AuditDashboardProps) {
  const { toast } = useToast();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<typeof recentAlerts[0] | null>(null);
  const [activeView, setActiveView] = useState("intelligence-hub");

  const handleAlertClick = (alert: typeof recentAlerts[0]) => {
    setSelectedAlert(alert);
  };

  const handleCloseAlertDetail = () => {
    setSelectedAlert(null);
  };

  const handleUploadData = () => {
    setShowUpload(true);
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generation Started",
      description: "Your audit report is being generated. You'll be notified when it's ready.",
    });
    
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
    
    setTimeout(() => {
      const data = {
        exportMetadata: {
          exportDate: new Date().toISOString(),
          generatedBy: "Audit Dashboard v1.0",
          dataRange: "2024-01-01 to 2024-02-15",
          totalRecords: 1443
        },
        healthScores: {
          auditHealth: 91.2,
          governanceIntegrity: 96.8,
          riskIndex: 88.1,
          overallScore: 92.0
        },
        trends: {
          sixMonthRiskTrends: riskTrendData,
          riskDistribution: riskDistribution,
          keyMetrics: {
            totalTransactions: 1247,
            flaggedTransactions: 8,
            criticalFindings: 2,
            complianceRate: 94.5
          }
        },
        alerts: {
          recentAlerts: recentAlerts,
          alertSummary: {
            critical: 2,
            warning: 3,
            info: 1,
            totalActive: 6
          }
        },
        analyticsInsights: {
          financialAnalysis: sampleAnalysisResults["financial-transactions.csv"],
          auditFindings: sampleAnalysisResults["audit-findings.csv"],
          governanceMetrics: sampleAnalysisResults["governance-metrics.csv"]
        },
        recommendations: [
          "Address critical revenue booking timing issues immediately",
          "Implement stronger IT access controls",
          "Review vendor authorization processes",
          "Enhance weekend transaction monitoring",
          "Conduct quarterly governance reviews"
        ]
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprehensive-audit-analysis-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Comprehensive analysis data downloaded with 1,443 records analyzed.",
      });
    }, 2000);
  };

  const handleAnalysisComplete = (results: any) => {
    const fileName = results.fileName.toLowerCase();
    let enhancedResults = results;
    
    if (fileName.includes('financial') || fileName.includes('transaction')) {
      enhancedResults = { ...results, ...sampleAnalysisResults["financial-transactions.csv"] };
    } else if (fileName.includes('audit') || fileName.includes('finding')) {
      enhancedResults = { ...results, ...sampleAnalysisResults["audit-findings.csv"] };
    } else if (fileName.includes('governance') || fileName.includes('metric')) {
      enhancedResults = { ...results, ...sampleAnalysisResults["governance-metrics.csv"] };
    }
    
    toast({
      title: "Analysis Complete",
      description: `Processed ${results.fileName} - Found ${enhancedResults.records} records, ${enhancedResults.anomalies} anomalies detected (Risk Score: ${enhancedResults.riskScore}%)`,
    });
    setShowUpload(false);
  };

  if (showUpload) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light tracking-tight">Data Upload & Analysis</h2>
          <Button variant="outline" onClick={() => setShowUpload(false)}>
            Back to Dashboard
          </Button>
        </div>
        <SampleDataTester onFileTest={(fileName, content) => {
          toast({
            title: "Testing Sample File",
            description: `Analyzing ${fileName} with ${content.split('\n').length - 1} records...`,
          });
          
          setTimeout(() => {
            const results = {
              fileName,
              insights: {
                records: content.split('\n').length - 1,
                anomalies: Math.floor(Math.random() * 5) + 1,
                riskScore: Math.floor(Math.random() * 40) + 60
              }
            };
            handleAnalysisComplete(results);
          }, 2000);
        }} />
        <DataUpload onAnalysisComplete={handleAnalysisComplete} />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case "intelligence-hub": return <MarketIntelligenceHub />;
      case "event-impact": return <EventImpactTimeline />;
      case "resonance": return <ImpactResonanceEngine />;
      case "simulator": return <WhatIfSimulator />;
      case "portfolio": return <InvestmentPortfolio />;
      case "market": return <MarketPulse />;
      case "stock-tracker": return <AIStockTracker />;
      case "risk": return <RiskAnalyzer />;
      case "budget": return <BudgetPlanner />;
      case "data-sync": return <DataSyncHub />;
      case "demand": return <DemandPreSignal />;
      case "contracts": return <ContractValidator />;
      case "anomaly": return <MarketAnomalyRadar />;
      case "leaks": return <ExpenseLeakDetector />;
      case "truth": return <TruthLedger />;
      case "signals": return <EconomicSignalFusion />;
      case "clustering": return <AlertClustering />;
      case "tasks": return <TaskManagement />;
      case "decision-room": return <DecisionRoom />;
      case "team-alignment": return <TeamAlignmentCompass />;
      case "kpi-war-room": return <KPIWarRoom />;
      case "leadership-mirror": return <LeadershipMirror />;
      case "hidden-market": return <HiddenMarketMapper />;
      case "timing-optimizer": return <MarketTimingOptimizer />;
      case "analytics": return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50 shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-light">
                <TrendingUp className="h-5 w-5 text-primary" />
                Risk Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={riskTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-20" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                    <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="audit" 
                      stroke="hsl(var(--audit))" 
                      strokeWidth={2} 
                      name="Audit Health"
                      dot={{ fill: 'hsl(var(--audit))', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="governance" 
                      stroke="hsl(var(--governance))" 
                      strokeWidth={2}
                      name="Governance"
                      dot={{ fill: 'hsl(var(--governance))', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="risk" 
                      stroke="hsl(var(--risk))" 
                      strokeWidth={2}
                      name="Risk Score"
                      dot={{ fill: 'hsl(var(--risk))', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-light">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
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
      );
      default: return <WhatIfSimulator />;
    }
  };

  return (
    <div className="flex gap-6 min-h-[calc(100vh-8rem)]">
      {/* Vertical Navigation Rail */}
      <div className="w-64 flex-shrink-0">
        <Card className="h-full border-border/50 shadow-card sticky top-6">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-lg font-light tracking-wide">Intelligence Hub</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4 space-y-6">
              {navigationCategories.map((category) => (
                <div key={category.title} className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">
                    {category.title}
                  </h3>
                  <div className="space-y-1">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveView(item.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                            isActive 
                              ? "bg-primary text-primary-foreground shadow-gold font-medium" 
                              : "text-foreground hover:bg-muted/50"
                          )}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* Executive KPI Overview - 3 Column Grid */}
        <div className="grid grid-cols-3 gap-6">
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

        {/* Quick Actions Bar */}
        <Card className="border-border/50 shadow-card">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Button 
                  variant="default" 
                  className="shadow-gold"
                  onClick={handleUploadData}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Data
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleGenerateReport}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleExportAnalysis}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Analysis
                </Button>
              </div>
              <Badge variant="outline" className="text-xs font-light px-3 py-1">
                <Bell className="h-3 w-3 mr-1" />
                {recentAlerts.filter(a => a.type === "danger").length} Critical Alerts
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Content Area */}
        <div className="min-h-[600px]">
          {renderContent()}
        </div>

        {/* Recent Alerts - Compact View */}
        {activeView === "simulator" && (
          <Card className="border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-light">
                <Bell className="h-5 w-5 text-primary" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 cursor-pointer transition-all"
                    onClick={() => handleAlertClick(alert)}
                  >
                    <AlertCircle 
                      className={cn(
                        "h-5 w-5 mt-0.5 flex-shrink-0",
                        alert.type === "danger" && "text-danger",
                        alert.type === "warning" && "text-warning",
                        alert.type === "info" && "text-primary"
                      )} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDetailReport 
        alert={selectedAlert} 
        isOpen={selectedAlert !== null}
        onClose={handleCloseAlertDetail} 
      />
    </div>
  );
}
