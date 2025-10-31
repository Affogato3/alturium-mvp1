import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Target,
  Users,
  Zap,
  DollarSign,
  Clock,
  BarChart3,
  Shield,
  Brain,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  Play,
  RotateCcw,
  Bell,
  Send,
  Link2,
  Network,
  Workflow,
  GitBranch,
  Lock,
  Blocks,
  Layers,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { MissionBoard } from "./vanguard/mission-board";
import { DiscussionStream } from "./vanguard/discussion-stream";
import { SmartNotes } from "./vanguard/smart-notes";
import { AICommandLine } from "./vanguard/ai-command-line";
import { SyncBar } from "./vanguard/sync-bar";

export const VanguardDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [ghostMode, setGhostMode] = useState(false);
  const [shadowMode, setShadowMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  
  // Simulation state
  const [costDelta, setCostDelta] = useState([0]);
  const [timeDelta, setTimeDelta] = useState([0]);
  const [workforceDelta, setWorkforceDelta] = useState([0]);
  const [profitShift, setProfitShift] = useState(0);
  const [operationalLoad, setOperationalLoad] = useState(0);
  
  // Autonomous features state
  const [autoMemoEnabled, setAutoMemoEnabled] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState({
    slack: false,
    teams: false,
    zoom: false,
    salesforce: false,
    jira: false,
    workspace: false,
  });
  const [auditLedger, setAuditLedger] = useState<any[]>([]);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1500);

    // Ghost mode keyboard shortcut
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        setGhostMode(prev => {
          const newMode = !prev;
          toast.success(newMode ? "Ghost Mode Activated" : "Ghost Mode Deactivated");
          return newMode;
        });
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [ghostMode]);

  // Simulate autonomous notifications
  useEffect(() => {
    if (autoMemoEnabled) {
      const interval = setInterval(() => {
        const newNotification = {
          id: Date.now(),
          type: Math.random() > 0.5 ? "memo" : "task",
          title: Math.random() > 0.5 ? "Quarterly review memo generated" : "Task assigned: Cost optimization",
          timestamp: new Date().toLocaleTimeString(),
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [autoMemoEnabled]);

  // Simulate audit ledger entries
  useEffect(() => {
    const sampleAudits = [
      { id: 1, action: "Workforce reallocation executed", outcome: "ROI +2.4%", timestamp: "2 hours ago", verified: true },
      { id: 2, action: "Shadow simulation completed", outcome: "Risk: Low", timestamp: "5 hours ago", verified: true },
      { id: 3, action: "AI task generation initiated", outcome: "12 tasks created", timestamp: "1 day ago", verified: true },
    ];
    setAuditLedger(sampleAudits);
  }, []);

  // Command metrics
  const commandMetrics = [
    { label: "Operational", value: 94, status: "stable", trend: "+2.3%" },
    { label: "Financial", value: 87, status: "stable", trend: "+5.1%" },
    { label: "Compliance", value: 78, status: "warning", trend: "-1.2%" },
    { label: "Culture", value: 92, status: "stable", trend: "+3.8%" },
  ];

  // Executive debrief meetings
  const meetings = [
    {
      id: "1",
      title: "Q4 Strategy Review",
      type: "strategic",
      date: "Oct 21, 10:30",
      summary: "Team agreed to accelerate product launch timeline by 2 weeks. Marketing budget increased by 15% for Q1 campaign.",
      sentiment: 0.85,
      riskLevel: "low",
    },
    {
      id: "2",
      title: "Product Roadmap Sync",
      type: "operational",
      date: "Oct 21, 14:00",
      summary: "Engineering capacity constraints identified. QA automation prioritized to support accelerated timeline.",
      sentiment: 0.62,
      riskLevel: "medium",
    },
    {
      id: "3",
      title: "Team Performance Review",
      type: "cultural",
      date: "Oct 20, 16:00",
      summary: "Team morale improved 12% following successful sprint completion. Burnout risk flagged for two team members.",
      sentiment: 0.78,
      riskLevel: "low",
    },
  ];

  // Context threads
  const contextThreads = [
    {
      id: "1",
      topic: "Pricing overhaul discussed across 4 teams this week",
      origin: "Product & Finance",
      responsible: "A. Mehta",
      lastUpdate: "2 hours ago",
      status: "progressing",
    },
    {
      id: "2",
      topic: "Marketing automation implementation stalled",
      origin: "Marketing & Ops",
      responsible: "R. Singh",
      lastUpdate: "1 day ago",
      status: "stalled",
    },
    {
      id: "3",
      topic: "Compliance audit preparation across departments",
      origin: "Legal & All",
      responsible: "L. Fernandes",
      lastUpdate: "3 days ago",
      status: "at-risk",
    },
  ];

  // Compliance alerts
  const complianceAlerts = [
    {
      id: "1",
      event: "Potential data handling risk detected in Product sync",
      timestamp: "Oct 21, 10:30",
      severity: "medium",
      resolved: false,
    },
    {
      id: "2",
      event: "Budget approval process deviation flagged",
      timestamp: "Oct 20, 15:45",
      severity: "low",
      resolved: true,
    },
  ];

  // Cognitive insight cards
  const cognitiveInsights = [
    {
      id: "1",
      insight: "Finance causes 2.3 days of average delay in approval chain.",
      impact: "high",
      category: "bottleneck",
    },
    {
      id: "2",
      insight: "Team morale dipped 7% after sprint deadline changes.",
      impact: "medium",
      category: "culture",
    },
    {
      id: "3",
      insight: "Marketing ROI improved 18% with new automation tools.",
      impact: "high",
      category: "opportunity",
    },
  ];

  // Workforce ROI data
  const workforceData = [
    {
      id: "1",
      name: "A. Mehta",
      profitContribution: 12.8,
      timeUtilization: 94,
      roleShift: "Lead strategic initiatives",
    },
    {
      id: "2",
      name: "R. Singh",
      profitContribution: 8.4,
      timeUtilization: 76,
      roleShift: "Delegate operational tasks",
    },
    {
      id: "3",
      name: "L. Fernandes",
      profitContribution: 10.2,
      timeUtilization: 88,
      roleShift: "Expand compliance oversight",
    },
  ];

  // Profit-focused tasks
  const profitTasks = [
    {
      id: "1",
      task: "Launch automated email campaign",
      owner: "Marketing",
      profitImpact: "+$45K",
      priority: "high",
      completed: false,
    },
    {
      id: "2",
      task: "Implement cost optimization in cloud infra",
      owner: "Engineering",
      profitImpact: "+$23K",
      priority: "high",
      completed: false,
    },
    {
      id: "3",
      task: "Negotiate vendor contract renewals",
      owner: "Finance",
      profitImpact: "+$18K",
      priority: "medium",
      completed: true,
    },
  ];

  // CFO insights
  const cfoMetrics = [
    { label: "Revenue Forecast Delta", value: "+3.2%", trend: "up" },
    { label: "Margin Stability Index", value: "87/100", trend: "stable" },
    { label: "Expense Drift", value: "-1.8%", trend: "up" },
    { label: "Capital Efficiency", value: "2.4x", trend: "up" },
  ];

  const getMetricGlow = (status: string) => {
    if (status === "stable") return "shadow-[0_0_20px_rgba(255,255,255,0.1)]";
    if (status === "warning") return "shadow-[0_0_20px_rgba(255,59,59,0.3)]";
    return "shadow-[0_0_20px_rgba(0,255,255,0.2)]";
  };

  const getThreadGlow = (status: string) => {
    if (status === "progressing") return "border-[hsl(var(--vanguard-accent))]";
    if (status === "stalled") return "border-amber-500";
    return "border-[hsl(var(--vanguard-alert))]";
  };

  const runSimulation = () => {
    setSimulationRunning(true);
    toast.info("Running comprehensive simulation with current parameters...");
    
    setTimeout(() => {
      const profit = (costDelta[0] * -0.5 + timeDelta[0] * 0.3 + workforceDelta[0] * 0.4).toFixed(1);
      const load = (Math.abs(costDelta[0]) * 0.3 + Math.abs(timeDelta[0]) * 0.5 + Math.abs(workforceDelta[0]) * 0.4).toFixed(1);
      setProfitShift(parseFloat(profit));
      setOperationalLoad(parseFloat(load));
      
      // Update audit ledger with simulation results
      const newAudit = {
        id: Date.now(),
        action: `Simulation: Cost ${costDelta[0] > 0 ? '+' : ''}${costDelta[0]}%, Time ${timeDelta[0] > 0 ? '+' : ''}${timeDelta[0]}%, Workforce ${workforceDelta[0] > 0 ? '+' : ''}${workforceDelta[0]}%`,
        outcome: `Profit Impact: ${parseFloat(profit) > 0 ? '+' : ''}${profit}%, Load: ${load}%`,
        timestamp: "Just now",
        verified: true,
      };
      setAuditLedger(prev => [newAudit, ...prev]);
      
      setSimulationRunning(false);
      toast.success(`Simulation complete! Profit shift: ${parseFloat(profit) > 0 ? '+' : ''}${profit}%, Operational load: ${load}%`);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--vanguard-bg))] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[hsl(var(--vanguard-accent))] animate-spin" />
            <span className="text-lg font-mono text-[hsl(var(--vanguard-text))]">
              CALIBRATING INTELLIGENCE FABRIC
            </span>
          </div>
          <div className="w-64 h-1 bg-[hsl(var(--vanguard-card))] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[hsl(var(--vanguard-accent))] to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--vanguard-bg))]">
      {/* Header with shimmer effect when active */}
      <header className="sticky top-0 z-50 bg-[hsl(var(--vanguard-bg))]/95 backdrop-blur-sm border-b border-[hsl(var(--vanguard-text))]/10">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--vanguard-accent))] to-transparent animate-shimmer" />
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Brain className="w-6 h-6 text-[hsl(var(--vanguard-accent))]" />
              <h1 className="text-2xl font-bold text-[hsl(var(--vanguard-text))] tracking-tight">
                ALTURIUM VANGUARD™
              </h1>
              <Badge className="bg-[hsl(var(--vanguard-accent))]/20 text-[hsl(var(--vanguard-accent))] border-[hsl(var(--vanguard-accent))]/30">
                AI PROFIT COMMAND
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[hsl(var(--vanguard-text))]/60 hover:text-[hsl(var(--vanguard-accent))]"
                onClick={() => {
                  const debriefSection = document.getElementById('executive-debrief');
                  debriefSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Executive Debrief
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[hsl(var(--vanguard-text))]/60 hover:text-[hsl(var(--vanguard-accent))]"
                onClick={() => {
                  setSimulationRunning(true);
                  toast.info("Deploying comprehensive audit across all operational metrics...");
                  
                  setTimeout(() => {
                    const newProfitShift = (Math.random() * 10 - 2).toFixed(1);
                    const newOpLoad = (Math.random() * -15).toFixed(1);
                    
                    setProfitShift(parseFloat(newProfitShift));
                    setOperationalLoad(parseFloat(newOpLoad));
                    
                    // Add audit to ledger
                    const auditEntry = {
                      id: Date.now(),
                      action: "Full operational audit executed",
                      outcome: `Efficiency: ${parseFloat(newProfitShift) > 0 ? '+' : ''}${newProfitShift}%, Load: ${newOpLoad}%`,
                      timestamp: "Just now",
                      verified: true,
                    };
                    setAuditLedger(prev => [auditEntry, ...prev]);
                    
                    setSimulationRunning(false);
                    toast.success(`Audit complete! Profit shift: ${parseFloat(newProfitShift) > 0 ? '+' : ''}${newProfitShift}%, Load reduced: ${newOpLoad}%`);
                  }, 2500);
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Run Audit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[hsl(var(--vanguard-text))]/60 hover:text-[hsl(var(--vanguard-accent))]"
                onClick={() => {
                  setShadowMode(!shadowMode);
                  toast.success(shadowMode ? "Shadow Mode Disabled" : "Shadow Mode Enabled - Testing decisions virtually");
                }}
              >
                <Layers className="w-4 h-4 mr-2" />
                Shadow Mode
              </Button>
              {ghostMode && (
                <Badge variant="outline" className="border-[hsl(var(--vanguard-accent))] text-[hsl(var(--vanguard-accent))]">
                  GHOST MODE
                </Badge>
              )}
              {shadowMode && (
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  SHADOW MODE
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* A. Command Deck - Metric Bar */}
        <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {commandMetrics.map((metric) => (
              <div
                key={metric.label}
                className={`bg-[hsl(var(--vanguard-bg))] p-4 rounded-lg transition-all duration-300 hover:scale-105 ${getMetricGlow(
                  metric.status
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[hsl(var(--vanguard-text))]/60 uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <span className="text-xs text-[hsl(var(--vanguard-accent))]">{metric.trend}</span>
                </div>
                <Progress value={metric.value} className="h-1 mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[hsl(var(--vanguard-text))]">{metric.value}%</span>
                  {metric.status === "stable" ? (
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--vanguard-text))]/40" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[hsl(var(--vanguard-alert))]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Command Line - Natural Language Interface */}
        <AICommandLine />

        {/* Collaborative Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mission Board - Collaborative Projects */}
          <MissionBoard />

          {/* Discussion Stream - AI-Organized Threads */}
          <DiscussionStream />
        </div>

        {/* Smart Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Smart Notes Panel */}
          <SmartNotes />

          {/* Instant Sync Bar */}
          <SyncBar />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* B. Executive Debrief */}
          <Card id="executive-debrief" className="lg:col-span-2 bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
                Executive Debrief
              </h2>
              <Badge variant="outline" className="text-xs">
                {meetings.length} MEETINGS
              </Badge>
            </div>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-[hsl(var(--vanguard-bg))] p-4 rounded-lg border border-[hsl(var(--vanguard-text))]/5 hover:border-[hsl(var(--vanguard-accent))]/30 transition-all duration-300 animate-fade-in"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-[hsl(var(--vanguard-text))]">{meeting.title}</h3>
                        <p className="text-xs text-[hsl(var(--vanguard-text))]/50">{meeting.date}</p>
                      </div>
                      <Badge
                        className={
                          meeting.type === "strategic"
                            ? "bg-[hsl(var(--vanguard-accent))]/20 text-[hsl(var(--vanguard-accent))]"
                            : meeting.type === "operational"
                            ? "bg-amber-500/20 text-amber-500"
                            : "bg-blue-500/20 text-blue-500"
                        }
                      >
                        {meeting.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-[hsl(var(--vanguard-text))]/70 mb-3">{meeting.summary}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[hsl(var(--vanguard-text))]/40" />
                        <span className="text-xs text-[hsl(var(--vanguard-text))]/60">
                          Sentiment: {(meeting.sentiment * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-1 flex-1 bg-[hsl(var(--vanguard-text))]/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[hsl(var(--vanguard-accent))] to-transparent"
                          style={{ width: `${meeting.sentiment * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Quick Commands */}
          <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
            <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide mb-4">
              Quick Commands
            </h2>
            <div className="space-y-3">
              <Button
                className="w-full justify-start bg-[hsl(var(--vanguard-bg))] hover:bg-[hsl(var(--vanguard-accent))]/10 text-[hsl(var(--vanguard-text))] border border-[hsl(var(--vanguard-accent))]/30"
                onClick={runSimulation}
              >
                <Zap className="w-4 h-4 mr-2 text-[hsl(var(--vanguard-accent))]" />
                Run Profit Simulation
              </Button>
              <Button 
                className="w-full justify-start bg-[hsl(var(--vanguard-bg))] hover:bg-[hsl(var(--vanguard-accent))]/10 text-[hsl(var(--vanguard-text))] border border-[hsl(var(--vanguard-accent))]/30"
                onClick={() => {
                  toast.info("Analyzing workforce efficiency...");
                  setTimeout(() => {
                    toast.success("Workforce reallocation plan generated. Expected ROI: +3.2%");
                  }, 1500);
                }}
              >
                <Users className="w-4 h-4 mr-2 text-[hsl(var(--vanguard-accent))]" />
                Reallocate Workforce
              </Button>
              <Button 
                className="w-full justify-start bg-[hsl(var(--vanguard-bg))] hover:bg-[hsl(var(--vanguard-accent))]/10 text-[hsl(var(--vanguard-text))] border border-[hsl(var(--vanguard-accent))]/30"
                onClick={() => {
                  toast.info("Generating executive brief...");
                  setTimeout(() => {
                    toast.success("Executive brief generated and sent to leadership@company.com");
                  }, 2000);
                }}
              >
                <FileText className="w-4 h-4 mr-2 text-[hsl(var(--vanguard-accent))]" />
                Generate Brief
              </Button>
              <Button 
                className="w-full justify-start bg-[hsl(var(--vanguard-bg))] hover:bg-[hsl(var(--vanguard-accent))]/10 text-[hsl(var(--vanguard-text))] border border-[hsl(var(--vanguard-accent))]/30"
                onClick={() => {
                  setFocusMode(!focusMode);
                  toast.success(focusMode ? "Focus Mode Disabled" : "Focus Mode Enabled - Showing only critical metrics");
                }}
              >
                <Eye className="w-4 h-4 mr-2 text-[hsl(var(--vanguard-accent))]" />
                Focus Mode
              </Button>
            </div>

            {/* CFO Mode Metrics */}
            <div className="mt-6 pt-6 border-t border-[hsl(var(--vanguard-text))]/10">
              <h3 className="text-sm font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide mb-3">
                CFO Insight
              </h3>
              <div className="space-y-2">
                {cfoMetrics.map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between">
                    <span className="text-xs text-[hsl(var(--vanguard-text))]/60">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-[hsl(var(--vanguard-text))]">{metric.value}</span>
                      {metric.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 text-[hsl(var(--vanguard-accent))]" />
                      ) : metric.trend === "down" ? (
                        <TrendingDown className="w-3 h-3 text-[hsl(var(--vanguard-alert))]" />
                      ) : (
                        <Target className="w-3 h-3 text-[hsl(var(--vanguard-text))]/40" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* C. Context Threads */}
        <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
          <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide mb-4">
            Context Threads
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contextThreads.map((thread) => (
              <div
                key={thread.id}
                className={`bg-[hsl(var(--vanguard-bg))] p-4 rounded-lg border-l-4 ${getThreadGlow(
                  thread.status
                )} hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                <h3 className="font-semibold text-[hsl(var(--vanguard-text))] mb-2">{thread.topic}</h3>
                <div className="space-y-1 text-xs text-[hsl(var(--vanguard-text))]/60">
                  <p>Origin: {thread.origin}</p>
                  <p>Responsible: {thread.responsible}</p>
                  <p>Last update: {thread.lastUpdate}</p>
                </div>
                <Badge className="mt-3" variant="outline">
                  {thread.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* D. Compliance Sentinel */}
          <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[hsl(var(--vanguard-accent))]" />
              <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
                Compliance Sentinel
              </h2>
            </div>
            <div className="space-y-3">
              {complianceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-[hsl(var(--vanguard-bg))] p-4 rounded-lg border border-[hsl(var(--vanguard-text))]/5 ${
                    alert.resolved ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-[hsl(var(--vanguard-text))]">{alert.event}</p>
                    {alert.resolved ? (
                      <CheckCircle2 className="w-5 h-5 text-[hsl(var(--vanguard-text))]/40" />
                    ) : (
                      <AlertCircle
                        className={`w-5 h-5 ${
                          alert.severity === "high"
                            ? "text-[hsl(var(--vanguard-alert))]"
                            : "text-amber-500"
                        }`}
                      />
                    )}
                  </div>
                  <p className="text-xs text-[hsl(var(--vanguard-text))]/50">{alert.timestamp}</p>
                  {!alert.resolved && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2 text-[hsl(var(--vanguard-accent))] hover:text-[hsl(var(--vanguard-accent))]"
                      onClick={() => {
                        toast.success("Compliance alert marked as resolved");
                      }}
                    >
                      Mark Resolved
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* E. Cognitive Insight Cards */}
          <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-[hsl(var(--vanguard-accent))]" />
              <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
                Cognitive Insights
              </h2>
            </div>
            <div className="space-y-3">
              {cognitiveInsights.map((item) => (
                <div
                  key={item.id}
                  className="bg-[hsl(var(--vanguard-bg))] p-4 rounded-lg border border-[hsl(var(--vanguard-accent))]/20 hover:border-[hsl(var(--vanguard-accent))]/50 transition-all duration-300 animate-fade-in"
                >
                  <p className="text-sm text-[hsl(var(--vanguard-text))] mb-2">{item.insight}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        item.impact === "high"
                          ? "bg-[hsl(var(--vanguard-accent))]/20 text-[hsl(var(--vanguard-accent))]"
                          : "bg-[hsl(var(--vanguard-text))]/20 text-[hsl(var(--vanguard-text))]"
                      }
                    >
                      {item.category}
                    </Badge>
                    <span className="text-xs text-[hsl(var(--vanguard-text))]/50">
                      Impact: {item.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Workforce ROI Monitor */}
        <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
              Workforce ROI Monitor
            </h2>
            <Button
              size="sm"
              className="bg-[hsl(var(--vanguard-accent))]/20 hover:bg-[hsl(var(--vanguard-accent))]/30 text-[hsl(var(--vanguard-accent))] border border-[hsl(var(--vanguard-accent))]/50"
              onClick={() => {
                toast.info("Running AI optimization algorithm...");
                setTimeout(() => {
                  toast.success("Workforce optimized. 3 role shifts recommended. Expected profit impact: +$2.1M annually");
                }, 2500);
              }}
            >
              Auto-Optimize Workforce
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workforceData.map((person) => (
              <div
                key={person.id}
                className="bg-[hsl(var(--vanguard-bg))] p-4 rounded-lg border border-[hsl(var(--vanguard-text))]/5 hover:border-[hsl(var(--vanguard-accent))]/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-[hsl(var(--vanguard-text))]/40" />
                  <span className="font-semibold text-[hsl(var(--vanguard-text))]">{person.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[hsl(var(--vanguard-text))]/60">Profit Contribution</span>
                    <span className="text-sm font-bold text-[hsl(var(--vanguard-accent))]">
                      {person.profitContribution}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[hsl(var(--vanguard-text))]/60">Time Utilization</span>
                    <span className="text-sm font-mono text-[hsl(var(--vanguard-text))]">
                      {person.timeUtilization}%
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[hsl(var(--vanguard-text))]/10">
                    <p className="text-xs text-[hsl(var(--vanguard-accent))]">{person.roleShift}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Cognitive Task Commander */}
        <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
          <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide mb-4">
            Cognitive Task Commander
          </h2>
          <div className="space-y-2">
            {profitTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-[hsl(var(--vanguard-bg))] p-4 rounded-lg flex items-center justify-between border border-[hsl(var(--vanguard-text))]/5 ${
                  !task.completed && task.priority === "high"
                    ? "animate-pulse border-[hsl(var(--vanguard-accent))]/30"
                    : ""
                } ${task.completed ? "opacity-50" : ""}`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div>
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[hsl(var(--vanguard-text))]/40" />
                    ) : (
                      <Clock className="w-5 h-5 text-[hsl(var(--vanguard-accent))]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[hsl(var(--vanguard-text))]">{task.task}</p>
                    <p className="text-xs text-[hsl(var(--vanguard-text))]/50">{task.owner}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[hsl(var(--vanguard-accent))]">{task.profitImpact}</p>
                  <Badge
                    variant="outline"
                    className={
                      task.priority === "high"
                        ? "border-[hsl(var(--vanguard-accent))] text-[hsl(var(--vanguard-accent))]"
                        : ""
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Predictive Profit Simulation */}
        <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
          <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide mb-4">
            Predictive Profit Simulation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="text-xs text-[hsl(var(--vanguard-text))]/60 uppercase tracking-wider mb-2 block">
                  Cost Delta (%)
                </label>
                <Slider
                  value={costDelta}
                  onValueChange={setCostDelta}
                  min={-20}
                  max={20}
                  step={1}
                  className="mb-2"
                />
                <span className="text-sm font-mono text-[hsl(var(--vanguard-accent))]">
                  {costDelta[0] > 0 ? "+" : ""}
                  {costDelta[0]}%
                </span>
              </div>
              <div>
                <label className="text-xs text-[hsl(var(--vanguard-text))]/60 uppercase tracking-wider mb-2 block">
                  Time Delta (%)
                </label>
                <Slider
                  value={timeDelta}
                  onValueChange={setTimeDelta}
                  min={-20}
                  max={20}
                  step={1}
                  className="mb-2"
                />
                <span className="text-sm font-mono text-[hsl(var(--vanguard-accent))]">
                  {timeDelta[0] > 0 ? "+" : ""}
                  {timeDelta[0]}%
                </span>
              </div>
              <div>
                <label className="text-xs text-[hsl(var(--vanguard-text))]/60 uppercase tracking-wider mb-2 block">
                  Workforce Delta (%)
                </label>
                <Slider
                  value={workforceDelta}
                  onValueChange={setWorkforceDelta}
                  min={-20}
                  max={20}
                  step={1}
                  className="mb-2"
                />
                <span className="text-sm font-mono text-[hsl(var(--vanguard-accent))]">
                  {workforceDelta[0] > 0 ? "+" : ""}
                  {workforceDelta[0]}%
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={runSimulation}
                  disabled={simulationRunning}
                  className="flex-1 bg-[hsl(var(--vanguard-accent))]/20 hover:bg-[hsl(var(--vanguard-accent))]/30 text-[hsl(var(--vanguard-accent))] border border-[hsl(var(--vanguard-accent))]/50"
                >
                  {simulationRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Simulation
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCostDelta([0]);
                    setTimeDelta([0]);
                    setWorkforceDelta([0]);
                    setProfitShift(0);
                    setOperationalLoad(0);
                  }}
                  className="text-[hsl(var(--vanguard-text))]/60 hover:text-[hsl(var(--vanguard-text))]"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="bg-[hsl(var(--vanguard-bg))] p-6 rounded-lg">
              <h3 className="text-sm font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wider mb-4">
                Projected Impact
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-[hsl(var(--vanguard-card))] rounded-lg">
                  <p className="text-xs text-[hsl(var(--vanguard-text))]/60 mb-1">Expected Profit Shift</p>
                  <p
                    className={`text-3xl font-bold font-mono ${
                      profitShift > 0
                        ? "text-[hsl(var(--vanguard-accent))]"
                        : profitShift < 0
                        ? "text-[hsl(var(--vanguard-alert))]"
                        : "text-[hsl(var(--vanguard-text))]"
                    }`}
                  >
                    {profitShift > 0 ? "+" : ""}
                    {profitShift}%
                  </p>
                </div>
                <div className="p-4 bg-[hsl(var(--vanguard-card))] rounded-lg">
                  <p className="text-xs text-[hsl(var(--vanguard-text))]/60 mb-1">Operational Load</p>
                  <p
                    className={`text-3xl font-bold font-mono ${
                      operationalLoad > 10
                        ? "text-[hsl(var(--vanguard-alert))]"
                        : "text-[hsl(var(--vanguard-text))]"
                    }`}
                  >
                    {operationalLoad > 0 ? "-" : ""}
                    {Math.abs(operationalLoad)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Autonomous Task & Memo Generation */}
        <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[hsl(var(--vanguard-accent))]" />
              <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
                Autonomous Task & Memo Generation
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[hsl(var(--vanguard-text))]/60">Auto-Generate</span>
              <Switch 
                checked={autoMemoEnabled} 
                onCheckedChange={(checked) => {
                  setAutoMemoEnabled(checked);
                  toast.success(checked ? "Autonomous generation enabled" : "Autonomous generation disabled");
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[hsl(var(--vanguard-text))] mb-3">Recent Notifications</h3>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-[hsl(var(--vanguard-text))]/50">No notifications yet</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="bg-[hsl(var(--vanguard-bg))] p-3 rounded-lg border border-[hsl(var(--vanguard-accent))]/20 animate-fade-in"
                      >
                        <div className="flex items-start gap-2">
                          {notif.type === "memo" ? (
                            <FileText className="w-4 h-4 text-[hsl(var(--vanguard-accent))] mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-[hsl(var(--vanguard-accent))] mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs text-[hsl(var(--vanguard-text))]">{notif.title}</p>
                            <p className="text-xs text-[hsl(var(--vanguard-text))]/50">{notif.timestamp}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => toast.success("Sent to team via Slack")}
                          >
                            <Send className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[hsl(var(--vanguard-text))] mb-3">Quick Actions</h3>
              <Button 
                className="w-full justify-start bg-[hsl(var(--vanguard-bg))] hover:bg-[hsl(var(--vanguard-accent))]/10 text-[hsl(var(--vanguard-text))] border border-[hsl(var(--vanguard-accent))]/30"
                onClick={() => {
                  toast.info("Generating memo from today's meetings...");
                  setTimeout(() => {
                    const newMemo = {
                      id: Date.now(),
                      type: "memo",
                      title: "Daily executive memo generated",
                      timestamp: new Date().toLocaleTimeString(),
                    };
                    setNotifications(prev => [newMemo, ...prev]);
                    toast.success("Memo generated and distributed");
                  }, 1500);
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Memo
              </Button>
              <Button 
                className="w-full justify-start bg-[hsl(var(--vanguard-bg))] hover:bg-[hsl(var(--vanguard-accent))]/10 text-[hsl(var(--vanguard-text))] border border-[hsl(var(--vanguard-accent))]/30"
                onClick={() => {
                  toast.info("Assigning tasks based on meeting insights...");
                  setTimeout(() => {
                    toast.success("5 tasks created and assigned to team members");
                  }, 1500);
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Auto-Assign Tasks
              </Button>
              <Button 
                className="w-full justify-start bg-[hsl(var(--vanguard-bg))] hover:bg-[hsl(var(--vanguard-accent))]/10 text-[hsl(var(--vanguard-text))] border border-[hsl(var(--vanguard-accent))]/30"
                onClick={() => toast.info("Opening Slack integration panel...")}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send to Slack
              </Button>
            </div>
          </div>
        </Card>

        {/* Behavioral & Workflow AI Monitoring */}
        <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Workflow className="w-5 h-5 text-[hsl(var(--vanguard-accent))]" />
            <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
              Behavioral & Workflow AI Monitoring
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Meeting Efficiency", value: 78, issue: "Long discussions detected" },
              { label: "Email Response Time", value: 92, issue: null },
              { label: "Task Completion Rate", value: 85, issue: null },
              { label: "Decision Velocity", value: 64, issue: "Bottleneck in approvals" },
            ].map((metric, idx) => (
              <div
                key={idx}
                className={`bg-[hsl(var(--vanguard-bg))] p-4 rounded-lg border border-[hsl(var(--vanguard-text))]/5 hover:border-[hsl(var(--vanguard-accent))]/30 transition-all cursor-pointer ${
                  metric.issue ? "animate-pulse border-amber-500/30" : ""
                }`}
                onClick={() => {
                  if (metric.issue) {
                    toast.warning(`Issue detected: ${metric.issue}`, {
                      description: "Click for suggested actions",
                    });
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[hsl(var(--vanguard-text))]/60">{metric.label}</span>
                  {metric.issue && <AlertCircle className="w-4 h-4 text-amber-500" />}
                </div>
                <Progress value={metric.value} className="h-1 mb-2" />
                <div className="text-2xl font-bold text-[hsl(var(--vanguard-text))]">{metric.value}%</div>
                {metric.issue && (
                  <p className="text-xs text-amber-500 mt-2">{metric.issue}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Cross-System Integration Panel */}
        <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-5 h-5 text-[hsl(var(--vanguard-accent))]" />
            <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
              Cross-System Integration
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(integrations).map(([key, enabled]) => (
              <div
                key={key}
                className={`bg-[hsl(var(--vanguard-bg))] p-4 rounded-lg border transition-all cursor-pointer hover:scale-105 ${
                  enabled
                    ? "border-[hsl(var(--vanguard-accent))]/50 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                    : "border-[hsl(var(--vanguard-text))]/10"
                }`}
                onClick={() => {
                  setIntegrations(prev => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof prev],
                  }));
                  toast.success(
                    !enabled
                      ? `${key.charAt(0).toUpperCase() + key.slice(1)} connected`
                      : `${key.charAt(0).toUpperCase() + key.slice(1)} disconnected`
                  );
                }}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <Link2 className={`w-6 h-6 ${enabled ? "text-[hsl(var(--vanguard-accent))]" : "text-[hsl(var(--vanguard-text))]/40"}`} />
                  <span className="text-xs font-semibold text-[hsl(var(--vanguard-text))] capitalize">
                    {key}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${enabled ? "bg-[hsl(var(--vanguard-accent))] animate-pulse" : "bg-[hsl(var(--vanguard-text))]/20"}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[hsl(var(--vanguard-text))]/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[hsl(var(--vanguard-text))]/60">
                {Object.values(integrations).filter(Boolean).length} / {Object.keys(integrations).length} systems connected
              </span>
              <Button 
                size="sm"
                variant="ghost"
                className="text-[hsl(var(--vanguard-accent))]"
                onClick={() => {
                  toast.info("Running cross-system sync...");
                  setTimeout(() => toast.success("All systems synchronized"), 2000);
                }}
              >
                <Zap className="w-3 h-3 mr-2" />
                Sync All
              </Button>
            </div>
          </div>
        </Card>

        {/* Immutable Audit Ledger */}
        <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-[hsl(var(--vanguard-accent))]" />
            <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
              Immutable Audit Ledger
            </h2>
            <Badge className="bg-[hsl(var(--vanguard-accent))]/20 text-[hsl(var(--vanguard-accent))] text-xs">
              BLOCKCHAIN-SECURED
            </Badge>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {auditLedger.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="bg-[hsl(var(--vanguard-bg))] p-4 rounded-lg border border-[hsl(var(--vanguard-text))]/5 hover:border-[hsl(var(--vanguard-accent))]/30 transition-all cursor-pointer"
                  onClick={() => {
                    toast.info("Audit Entry Details", {
                      description: `Action: ${entry.action}\nOutcome: ${entry.outcome}\nVerified: ${entry.verified ? "Yes" : "Pending"}`,
                    });
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${entry.verified ? "bg-[hsl(var(--vanguard-accent))]" : "bg-amber-500"}`} />
                      {idx < auditLedger.length - 1 && (
                        <div className="w-0.5 h-12 bg-[hsl(var(--vanguard-text))]/10 my-1" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-semibold text-[hsl(var(--vanguard-text))]">{entry.action}</p>
                        {entry.verified && <CheckCircle2 className="w-4 h-4 text-[hsl(var(--vanguard-accent))]" />}
                      </div>
                      <p className="text-xs text-[hsl(var(--vanguard-accent))] mb-1">{entry.outcome}</p>
                      <p className="text-xs text-[hsl(var(--vanguard-text))]/50">{entry.timestamp}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[hsl(var(--vanguard-text))]/40" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Macro-Level Oversight */}
        <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Blocks className="w-5 h-5 text-[hsl(var(--vanguard-accent))]" />
            <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
              Macro-Level Oversight
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Subsidiary Alpha", performance: 94, budget: "$2.4M", status: "optimal" },
              { name: "Subsidiary Beta", performance: 78, budget: "$1.8M", status: "warning" },
              { name: "Subsidiary Gamma", performance: 88, budget: "$3.1M", status: "optimal" },
            ].map((sub) => (
              <div
                key={sub.name}
                className={`bg-[hsl(var(--vanguard-bg))] p-5 rounded-lg border transition-all cursor-pointer hover:scale-105 ${
                  sub.status === "optimal"
                    ? "border-[hsl(var(--vanguard-accent))]/30"
                    : "border-amber-500/30"
                }`}
                onClick={() => {
                  toast.info(`${sub.name} Details`, {
                    description: `Performance: ${sub.performance}%\nBudget: ${sub.budget}\nStatus: ${sub.status}`,
                  });
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[hsl(var(--vanguard-text))]">{sub.name}</h3>
                  <Badge
                    className={
                      sub.status === "optimal"
                        ? "bg-[hsl(var(--vanguard-accent))]/20 text-[hsl(var(--vanguard-accent))]"
                        : "bg-amber-500/20 text-amber-500"
                    }
                  >
                    {sub.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[hsl(var(--vanguard-text))]/60">Performance</span>
                    <span className="text-sm font-bold text-[hsl(var(--vanguard-text))]">{sub.performance}%</span>
                  </div>
                  <Progress value={sub.performance} className="h-1" />
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-[hsl(var(--vanguard-text))]/60">Annual Budget</span>
                    <span className="text-sm font-mono text-[hsl(var(--vanguard-accent))]">{sub.budget}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* Footer with Security Indicator */}
      <footer className="sticky bottom-0 bg-[hsl(var(--vanguard-bg))]/95 backdrop-blur-sm border-t border-[hsl(var(--vanguard-text))]/10">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-[hsl(var(--vanguard-text))]/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--vanguard-accent))] animate-pulse" />
                <span>Secure Channel Active — AES-512 | Behavioral Pattern Check</span>
              </div>
            </div>
            <div className="text-xs text-[hsl(var(--vanguard-text))]/50">
              Last Sync: <span className="text-[hsl(var(--vanguard-accent))]">3 mins ago</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};