import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Settings, RefreshCw, Save, Share2, FileText } from "lucide-react";
import { MeetingSummaryCard } from "./scribe/meeting-summary-card";
import { MoMSection } from "./scribe/mom-section";
import { VisualInsights } from "./scribe/visual-insights";
import { InsightsFeed } from "./scribe/insights-feed";
import { EmployeeLogs } from "./scribe/employee-logs";
import { AgendaBuilder } from "./scribe/agenda-builder";
import { DecisionImpactAnalyzer } from "./scribe/decision-impact-analyzer";
import { ContextualAwareness } from "./scribe/contextual-awareness";
import { KnowledgeDocumentation } from "./scribe/knowledge-documentation";
import { IntegrationHub } from "./scribe/integration-hub";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export const ScribeDashboard = () => {
  const { toast } = useToast();

  // Sample data
  const meeting = {
    title: "Q4 Strategy Review",
    date: "Oct 21, 2025",
    participants: ["A. Mehta", "R. Singh", "L. Fernandes", "S. Kumar"],
    duration: 45,
    summary: [
      "Team agreed to accelerate product launch timeline by 2 weeks",
      "Marketing budget increased by 15% for Q1 2026 campaign",
      "New hiring targets set: 3 engineers, 2 designers by end of quarter",
    ],
    sentimentScore: 0.78,
  };

  const [decisions, setDecisions] = useState([
    { id: "1", text: "Accelerate product launch to December 15th", category: "Strategy" },
    { id: "2", text: "Increase marketing budget by 15% for Q1 2026", category: "Budget" },
    { id: "3", text: "Hire 3 engineers and 2 designers by Q4 end", category: "HR" },
  ]);

  const [tasks, setTasks] = useState([
    { id: "1", title: "Update product roadmap with new timeline", assignee: "A. Mehta", deadline: "Oct 25, 2025", completed: false },
    { id: "2", title: "Prepare revised budget proposal", assignee: "R. Singh", deadline: "Oct 28, 2025", completed: false },
    { id: "3", title: "Post job openings for engineering roles", assignee: "L. Fernandes", deadline: "Oct 23, 2025", completed: true },
  ]);

  const sentimentTimeline = [
    { time: "0m", sentiment: 0.6 },
    { time: "10m", sentiment: 0.7 },
    { time: "20m", sentiment: 0.75 },
    { time: "30m", sentiment: 0.8 },
    { time: "40m", sentiment: 0.78 },
  ];

  const speakerBalance = [
    { name: "A. Mehta", percentage: 35, keywords: ["strategy", "timeline", "launch"] },
    { name: "R. Singh", percentage: 28, keywords: ["budget", "marketing", "Q1"] },
    { name: "L. Fernandes", percentage: 22, keywords: ["hiring", "recruitment", "team"] },
    { name: "S. Kumar", percentage: 15, keywords: ["technical", "roadmap", "features"] },
  ];

  const taskDensity = { completed: 1, new: 2, pending: 0 };

  const [insights, setInsights] = useState([
    {
      id: "1",
      type: "improvement" as const,
      content: "Average decision turnaround time improving by 17% this month.",
      pinned: false,
    },
    {
      id: "2",
      type: "bottleneck" as const,
      content: "Repeated bottleneck identified: product QA delays in 3 consecutive meetings.",
      pinned: false,
    },
    {
      id: "3",
      type: "sentiment" as const,
      content: "Team sentiment increased 12% during strategy discussion — strong alignment detected.",
      pinned: false,
    },
  ]);

  const employees = [
    { id: "1", name: "A. Mehta", talkTime: 35, keyActions: 3, sentiment: 0.85, attendanceScore: 96, keywords: ["strategy", "timeline", "launch"] },
    { id: "2", name: "R. Singh", talkTime: 28, keyActions: 2, sentiment: 0.72, attendanceScore: 89, keywords: ["budget", "marketing", "Q1"] },
    { id: "3", name: "L. Fernandes", talkTime: 22, keyActions: 2, sentiment: 0.88, attendanceScore: 92, keywords: ["hiring", "recruitment", "team"] },
    { id: "4", name: "S. Kumar", talkTime: 15, keyActions: 1, sentiment: 0.68, attendanceScore: 85, keywords: ["technical", "roadmap"] },
  ];

  const handleTaskToggle = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleInsightPin = (id: string) => {
    setInsights(insights.map(insight =>
      insight.id === id ? { ...insight, pinned: !insight.pinned } : insight
    ));
    toast({
      title: "Insight updated",
      description: "Insight pin status changed",
    });
  };

  const handleInsightArchive = (id: string) => {
    setInsights(insights.filter(insight => insight.id !== id));
    toast({
      title: "Insight archived",
      description: "Insight moved to archive",
    });
  };

  // Enhanced features data
  const agendaItems = [
    { id: "1", topic: "Review Q4 product launch progress", duration: 15, participants: ["A. Mehta", "R. Singh"], priority: "high" as const },
    { id: "2", topic: "Discuss marketing campaign effectiveness", duration: 20, participants: ["R. Singh", "L. Fernandes"], priority: "high" as const },
    { id: "3", topic: "Hiring pipeline update", duration: 10, participants: ["L. Fernandes"], priority: "medium" as const },
    { id: "4", topic: "Budget allocation review", duration: 15, participants: ["All"], priority: "medium" as const },
  ];

  const decisionImpacts = [
    {
      id: "1",
      decision: "Accelerate product launch to December 15th",
      impacts: {
        financial: { value: "+$120K revenue (Q4)", trend: "up" as const },
        timeline: { value: "+4 days sprint", trend: "down" as const },
        metrics: [
          { name: "Customer retention", value: "+8%", trend: "up" as const },
          { name: "Team velocity", value: "-12%", trend: "down" as const },
          { name: "Market share", value: "+3.5%", trend: "up" as const },
        ],
      },
      confidence: 87,
      risks: ["Resource burnout risk", "QA coverage may be reduced"],
    },
    {
      id: "2",
      decision: "Increase marketing budget by 15%",
      impacts: {
        financial: { value: "+$45K spend", trend: "down" as const },
        timeline: { value: "No impact", trend: "neutral" as const },
        metrics: [
          { name: "Lead generation", value: "+22%", trend: "up" as const },
          { name: "CAC", value: "-8%", trend: "up" as const },
          { name: "ROI", value: "+15%", trend: "up" as const },
        ],
      },
      confidence: 92,
      risks: ["Budget constraints in Q2 if performance drops"],
    },
  ];

  const contextualLinks = [
    { id: "1", type: "project" as const, title: "Product Launch Sprint", relation: "Timeline directly affected by acceleration decision", date: "Oct 15, 2025", impact: "high" as const },
    { id: "2", type: "kpi" as const, title: "Q4 Revenue Target", relation: "Marketing budget increase supports this target", date: "Oct 1, 2025", impact: "high" as const },
    { id: "3", type: "decision" as const, title: "Previous hiring freeze decision", relation: "Now reversed with new hiring targets", date: "Sep 10, 2025", impact: "medium" as const },
    { id: "4", type: "dependency" as const, title: "Engineering capacity constraint", relation: "May impact delivery timeline", date: "Oct 18, 2025", impact: "medium" as const },
  ];

  const contradictions = [
    "Previous meeting (Oct 10) indicated conservative timeline approach, now accelerating by 2 weeks",
    "Budget constraints mentioned in Q3 review, but 15% marketing increase approved",
  ];

  const knowledgeItems = [
    {
      id: "1",
      title: "Q4 Product Roadmap (Updated)",
      summary: "Revised timeline showing accelerated feature delivery, dependency mapping, and resource allocation for December 15 launch target.",
      attachments: [
        { name: "roadmap-v3.pdf", type: "pdf" },
        { name: "timeline.xlsx", type: "excel" },
      ],
      linkedMeetings: 4,
      lastUpdated: "Oct 21, 2025",
      owner: "A. Mehta",
    },
    {
      id: "2",
      title: "Marketing Campaign Performance Data",
      summary: "Historical ROI analysis and projected impact of 15% budget increase on Q1 2026 lead generation and customer acquisition costs.",
      attachments: [
        { name: "campaign-analysis.pdf", type: "pdf" },
        { name: "budget-forecast.xlsx", type: "excel" },
      ],
      linkedMeetings: 3,
      lastUpdated: "Oct 20, 2025",
      owner: "R. Singh",
    },
  ];

  const integrations = [
    { id: "slack", name: "Slack", icon: "💬", status: "connected" as const, lastSync: "2 min ago" },
    { id: "asana", name: "Asana", icon: "✓", status: "connected" as const, lastSync: "5 min ago" },
    { id: "notion", name: "Notion", icon: "📝", status: "connected" as const, lastSync: "10 min ago" },
    { id: "jira", name: "Jira", icon: "🔷", status: "disconnected" as const, lastSync: "" },
  ];

  const handleExport = (format: string) => {
    toast({
      title: "Export started",
      description: `Generating ${format.toUpperCase()} report with full meeting intelligence...`,
    });
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `Scribe-Meeting-Report.${format} ready for download`,
      });
    }, 2000);
  };

  const handleApproveAgenda = () => {
    toast({
      title: "Agenda approved",
      description: "Next meeting has been scheduled with the approved agenda.",
    });
  };

  const handleEditAgendaItem = (id: string) => {
    toast({
      title: "Edit agenda item",
      description: `Opening editor for item ${id}...`,
    });
  };

  const handleViewKnowledge = (id: string) => {
    toast({
      title: "Opening document",
      description: `Loading knowledge item ${id}...`,
    });
  };

  const handleSendToIntegration = async (integrationId: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        toast({
          title: "Sent successfully",
          description: `Meeting intelligence sent to ${integrationId}`,
        });
        resolve();
      }, 1500);
    });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--scribe-bg))]">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-[hsl(var(--scribe-bg))]/95 backdrop-blur-sm border-b border-[hsl(var(--scribe-text))]/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[hsl(var(--scribe-accent))]" />
                <h1 className="text-xl font-semibold text-[hsl(var(--scribe-text))]">
                  Alturium Scribe
                </h1>
              </div>
              <div className="hidden lg:flex items-center gap-4 text-sm text-[hsl(var(--scribe-text))]/60">
                <span className="font-medium text-[hsl(var(--scribe-text))]/80">{meeting.title}</span>
                <span>•</span>
                <span>{meeting.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-transparent border-[hsl(var(--scribe-text))]/20 text-[hsl(var(--scribe-text))] hover:bg-[hsl(var(--scribe-card))]">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[hsl(var(--scribe-card))] border-[hsl(var(--scribe-text))]/10">
                  <DropdownMenuItem onClick={() => handleExport("pdf")} className="text-[hsl(var(--scribe-text))]">
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("csv")} className="text-[hsl(var(--scribe-text))]">
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("json")} className="text-[hsl(var(--scribe-text))]">
                    Export as JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" className="text-[hsl(var(--scribe-text))]/60 hover:text-[hsl(var(--scribe-text))] hover:bg-[hsl(var(--scribe-card))]">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-[hsl(var(--scribe-text))]/60 hover:text-[hsl(var(--scribe-text))] hover:bg-[hsl(var(--scribe-card))]">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Meeting Summary */}
        <MeetingSummaryCard meeting={meeting} />

        {/* Decision Impact Analysis */}
        <DecisionImpactAnalyzer impacts={decisionImpacts} />

        {/* MoM Section */}
        <MoMSection decisions={decisions} tasks={tasks} onTaskToggle={handleTaskToggle} />

        {/* Two-column layout for Context and Knowledge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContextualAwareness
            links={contextualLinks}
            contradictions={contradictions}
          />
          <KnowledgeDocumentation
            items={knowledgeItems}
            onViewItem={handleViewKnowledge}
          />
        </div>

        {/* Visual Insights */}
        <VisualInsights
          sentimentTimeline={sentimentTimeline}
          speakerBalance={speakerBalance}
          taskDensity={taskDensity}
        />

        {/* Agenda Builder and Integration Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AgendaBuilder
            agendaItems={agendaItems}
            onApprove={handleApproveAgenda}
            onEdit={handleEditAgendaItem}
          />
          <IntegrationHub
            integrations={integrations}
            onSend={handleSendToIntegration}
          />
        </div>

        {/* Insights Feed */}
        <InsightsFeed
          insights={insights}
          onPin={handleInsightPin}
          onArchive={handleInsightArchive}
        />

        {/* Employee Logs */}
        <EmployeeLogs employees={employees} />
      </main>

      {/* Footer Action Strip */}
      <footer className="sticky bottom-0 bg-[hsl(var(--scribe-bg))]/95 backdrop-blur-sm border-t border-[hsl(var(--scribe-text))]/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="bg-transparent border-[hsl(var(--scribe-text))]/20 text-[hsl(var(--scribe-text))] hover:bg-[hsl(var(--scribe-card))]">
                <Save className="w-4 h-4 mr-2" />
                Save Meeting Pack
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent border-[hsl(var(--scribe-text))]/20 text-[hsl(var(--scribe-text))] hover:bg-[hsl(var(--scribe-card))]">
                <Share2 className="w-4 h-4 mr-2" />
                Share Insights
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-[hsl(var(--scribe-text))]/60 hover:text-[hsl(var(--scribe-text))] hover:bg-[hsl(var(--scribe-card))]">
              AI Audit Log
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};
