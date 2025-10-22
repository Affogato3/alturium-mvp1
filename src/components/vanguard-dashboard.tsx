import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";

export const VanguardDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [ghostMode, setGhostMode] = useState(false);
  
  // Simulation state
  const [costDelta, setCostDelta] = useState([0]);
  const [timeDelta, setTimeDelta] = useState([0]);
  const [workforceDelta, setWorkforceDelta] = useState([0]);
  const [profitShift, setProfitShift] = useState(0);
  const [operationalLoad, setOperationalLoad] = useState(0);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1500);

    // Ghost mode keyboard shortcut
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        setGhostMode(!ghostMode);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [ghostMode]);

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
    setTimeout(() => {
      const profit = (costDelta[0] * -0.5 + timeDelta[0] * 0.3 + workforceDelta[0] * 0.4).toFixed(1);
      const load = (Math.abs(costDelta[0]) * 0.3 + Math.abs(timeDelta[0]) * 0.5 + Math.abs(workforceDelta[0]) * 0.4).toFixed(1);
      setProfitShift(parseFloat(profit));
      setOperationalLoad(parseFloat(load));
      setSimulationRunning(false);
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
                  setTimeout(() => {
                    setSimulationRunning(false);
                    setProfitShift(Math.random() * 10 - 2);
                    setOperationalLoad(Math.random() * -15);
                  }, 2000);
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Run Audit
              </Button>
              {ghostMode && (
                <Badge variant="outline" className="border-[hsl(var(--vanguard-accent))] text-[hsl(var(--vanguard-accent))]">
                  GHOST MODE
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
              <Button className="w-full justify-start bg-[hsl(var(--vanguard-bg))] hover:bg-[hsl(var(--vanguard-accent))]/10 text-[hsl(var(--vanguard-text))] border border-[hsl(var(--vanguard-accent))]/30">
                <Users className="w-4 h-4 mr-2 text-[hsl(var(--vanguard-accent))]" />
                Reallocate Workforce
              </Button>
              <Button className="w-full justify-start bg-[hsl(var(--vanguard-bg))] hover:bg-[hsl(var(--vanguard-accent))]/10 text-[hsl(var(--vanguard-text))] border border-[hsl(var(--vanguard-accent))]/30">
                <FileText className="w-4 h-4 mr-2 text-[hsl(var(--vanguard-accent))]" />
                Generate Brief
              </Button>
              <Button className="w-full justify-start bg-[hsl(var(--vanguard-bg))] hover:bg-[hsl(var(--vanguard-accent))]/10 text-[hsl(var(--vanguard-text))] border border-[hsl(var(--vanguard-accent))]/30">
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