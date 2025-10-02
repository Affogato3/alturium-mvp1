import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Play,
  Upload,
  Database,
  Brain,
  Zap,
  Eye,
  Activity,
  BarChart3,
  Network,
  Clock,
  DollarSign,
  Users,
  FileText,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CompetitorInsight {
  id: string;
  competitor: string;
  weakness: string;
  severity: "critical" | "high" | "medium" | "low";
  opportunity: string;
  profitPotential: number;
  timeWindow: string;
  confidence: number;
  recommendedActions: string[];
  marketImpact: number;
}

interface MarketOpportunity {
  id: string;
  title: string;
  description: string;
  type: "pricing" | "product" | "marketing" | "expansion" | "partnership";
  profitScore: number;
  riskScore: number;
  timeToExecute: string;
  requiredResources: string[];
  expectedROI: number;
  marketShare: number;
}

interface RealTimeAlert {
  id: string;
  timestamp: string;
  type: "competitor" | "market" | "regulatory" | "opportunity";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
  impact: number;
}

export function MarketSentinel() {
  const [autoMode, setAutoMode] = useState(false);
  const [autonomousExecution, setAutonomousExecution] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState("manual");
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [manualData, setManualData] = useState("");

  // Mock data for demonstration
  const [competitorInsights] = useState<CompetitorInsight[]>([
    {
      id: "1",
      competitor: "TechCorp Inc",
      weakness: "Supply chain delays causing 15% inventory shortage",
      severity: "critical",
      opportunity: "Capture market share with aggressive pricing and guaranteed delivery",
      profitPotential: 2400000,
      timeWindow: "2-4 weeks",
      confidence: 92,
      recommendedActions: [
        "Launch targeted marketing campaign highlighting reliability",
        "Offer 10% discount with expedited shipping",
        "Contact their key clients directly",
      ],
      marketImpact: 8.5,
    },
    {
      id: "2",
      competitor: "InnovateCo",
      weakness: "Outdated product line, no updates in 18 months",
      severity: "high",
      opportunity: "Position new features as industry-leading innovation",
      profitPotential: 1800000,
      timeWindow: "1-2 months",
      confidence: 87,
      recommendedActions: [
        "Accelerate product launch timeline",
        "Highlight innovation in comparative marketing",
        "Offer migration incentives to their customers",
      ],
      marketImpact: 6.2,
    },
    {
      id: "3",
      competitor: "MarketLeader LLC",
      weakness: "Customer complaints increasing by 35% (poor support)",
      severity: "high",
      opportunity: "Emphasize superior customer service and support",
      profitPotential: 1500000,
      timeWindow: "Immediate",
      confidence: 94,
      recommendedActions: [
        "Launch customer testimonial campaign",
        "Offer free premium support trial",
        "Create comparison content focusing on service quality",
      ],
      marketImpact: 5.8,
    },
  ]);

  const [marketOpportunities] = useState<MarketOpportunity[]>([
    {
      id: "1",
      title: "APAC Market Expansion",
      description: "Low competitor presence in Southeast Asian markets with high demand signals",
      type: "expansion",
      profitScore: 94,
      riskScore: 32,
      timeToExecute: "3-6 months",
      requiredResources: ["Market research team", "Local partnerships", "$500K investment"],
      expectedROI: 285,
      marketShare: 12.5,
    },
    {
      id: "2",
      title: "Dynamic Pricing Strategy",
      description: "Competitors using static pricing; AI-driven pricing can increase margins by 18%",
      type: "pricing",
      profitScore: 88,
      riskScore: 15,
      timeToExecute: "2-4 weeks",
      requiredResources: ["Pricing algorithm", "Market data integration"],
      expectedROI: 156,
      marketShare: 4.2,
    },
    {
      id: "3",
      title: "Product Bundle Innovation",
      description: "Customer data shows demand for integrated solutions; competitors offer separate products",
      type: "product",
      profitScore: 85,
      riskScore: 28,
      timeToExecute: "1-3 months",
      requiredResources: ["Product development", "Integration team", "$200K budget"],
      expectedROI: 198,
      marketShare: 7.8,
    },
  ]);

  const [realTimeAlerts] = useState<RealTimeAlert[]>([
    {
      id: "1",
      timestamp: "2 minutes ago",
      type: "competitor",
      severity: "critical",
      title: "TechCorp Inc announced price increase",
      description: "Main competitor raising prices by 12% effective next month",
      action: "Launch counter-campaign emphasizing value pricing",
      impact: 9.2,
    },
    {
      id: "2",
      timestamp: "15 minutes ago",
      type: "opportunity",
      severity: "high",
      title: "Emerging market demand spike detected",
      description: "Social media sentiment and search volume increased 45% for our product category",
      action: "Increase marketing spend and inventory allocation",
      impact: 7.8,
    },
    {
      id: "3",
      timestamp: "1 hour ago",
      type: "market",
      severity: "medium",
      title: "Industry regulation update",
      description: "New compliance requirements favor our existing infrastructure",
      action: "Highlight compliance advantage in marketing materials",
      impact: 6.5,
    },
  ]);

  const handleDataUpload = () => {
    setAnalysisRunning(true);
    setTimeout(() => setAnalysisRunning(false), 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "competitor":
        return <Target className="h-4 w-4" />;
      case "opportunity":
        return <TrendingUp className="h-4 w-4" />;
      case "market":
        return <Activity className="h-4 w-4" />;
      case "regulatory":
        return <FileText className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Market Sentinel
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered competitor intelligence and strategic advantage engine
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="auto-mode"
              checked={autoMode}
              onCheckedChange={setAutoMode}
            />
            <Label htmlFor="auto-mode" className="text-sm font-medium">
              Auto-Ingestion
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="autonomous"
              checked={autonomousExecution}
              onCheckedChange={setAutonomousExecution}
            />
            <Label htmlFor="autonomous" className="text-sm font-medium">
              Autonomous Mode
            </Label>
          </div>
          <Button variant="default" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-destructive" />
              Critical Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Immediate action required
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Active Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              High-profit potential
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Potential Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5.7M</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next 6 months projection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              AI Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Prediction accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights">Competitor Insights</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunity Radar</TabsTrigger>
          <TabsTrigger value="simulator">Scenario Simulator</TabsTrigger>
          <TabsTrigger value="alerts">Real-Time Alerts</TabsTrigger>
          <TabsTrigger value="data">Data Sources</TabsTrigger>
        </TabsList>

        {/* Competitor Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Competitor Weakness Analysis
              </CardTitle>
              <CardDescription>
                AI-detected vulnerabilities and strategic opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {competitorInsights.map((insight) => (
                    <Card key={insight.id} className="border-l-4" style={{
                      borderLeftColor: insight.severity === "critical" ? "hsl(var(--destructive))" : 
                                       insight.severity === "high" ? "hsl(var(--primary))" : "hsl(var(--muted))"
                    }}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-lg">{insight.competitor}</CardTitle>
                              <Badge variant={getSeverityColor(insight.severity)}>
                                {insight.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                <Brain className="h-3 w-3" />
                                {insight.confidence}% confidence
                              </Badge>
                            </div>
                            <div className="space-y-3 mt-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <TrendingDown className="h-4 w-4 text-destructive" />
                                  <span className="text-sm font-semibold">Weakness Detected:</span>
                                </div>
                                <p className="text-sm text-muted-foreground ml-6">{insight.weakness}</p>
                              </div>
                              
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Target className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-semibold">Strategic Opportunity:</span>
                                </div>
                                <p className="text-sm text-muted-foreground ml-6">{insight.opportunity}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Profit Potential</p>
                            <p className="text-lg font-bold text-green-600">
                              ${(insight.profitPotential / 1000000).toFixed(1)}M
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Time Window</p>
                            <p className="text-lg font-bold">{insight.timeWindow}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Market Impact</p>
                            <div className="flex items-center gap-2">
                              <Progress value={insight.marketImpact * 10} className="h-2" />
                              <span className="text-sm font-semibold">{insight.marketImpact}/10</span>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div>
                          <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            Recommended Actions:
                          </p>
                          <div className="space-y-2">
                            {insight.recommendedActions.map((action, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button size="sm" className="gap-2">
                            <Play className="h-4 w-4" />
                            Execute Strategy
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Simulate Impact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opportunity Radar Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Market Opportunity Matrix
              </CardTitle>
              <CardDescription>
                AI-ranked opportunities optimized for profit, feasibility, and market impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {marketOpportunities.map((opportunity) => (
                    <Card key={opportunity.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {opportunity.title}
                              <Badge variant="outline">{opportunity.type}</Badge>
                            </CardTitle>
                            <CardDescription className="mt-2">
                              {opportunity.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Profit Score</p>
                            <div className="flex items-center gap-2">
                              <Progress value={opportunity.profitScore} className="h-2" />
                              <span className="text-sm font-semibold">{opportunity.profitScore}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Risk Score</p>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={opportunity.riskScore} 
                                className="h-2"
                              />
                              <span className="text-sm font-semibold">{opportunity.riskScore}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Expected ROI</p>
                            <p className="text-lg font-bold text-green-600">{opportunity.expectedROI}%</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Market Share Gain</p>
                            <p className="text-lg font-bold text-primary">+{opportunity.marketShare}%</p>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              <span className="font-semibold">Time to Execute:</span>{" "}
                              {opportunity.timeToExecute}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-2">Required Resources:</p>
                            <div className="flex flex-wrap gap-2">
                              {opportunity.requiredResources.map((resource, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {resource}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button size="sm" className="gap-2">
                            <Play className="h-4 w-4" />
                            Launch Initiative
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2">
                            <BarChart3 className="h-4 w-4" />
                            View Analysis
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenario Simulator Tab */}
        <TabsContent value="simulator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Strategic Scenario Simulator
              </CardTitle>
              <CardDescription>
                Test strategies and predict market outcomes before execution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Strategy Type</Label>
                    <Select defaultValue="pricing">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pricing">Pricing Adjustment</SelectItem>
                        <SelectItem value="product">Product Launch</SelectItem>
                        <SelectItem value="marketing">Marketing Campaign</SelectItem>
                        <SelectItem value="expansion">Market Expansion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Horizon</Label>
                    <Select defaultValue="3m">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">1 Month</SelectItem>
                        <SelectItem value="3m">3 Months</SelectItem>
                        <SelectItem value="6m">6 Months</SelectItem>
                        <SelectItem value="12m">12 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Strategy Description</Label>
                  <Textarea
                    placeholder="Describe the strategy you want to simulate..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button className="w-full gap-2">
                  <Play className="h-4 w-4" />
                  Run Simulation
                </Button>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Simulation Results</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-green-600">Best Case</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">$3.2M</p>
                        <p className="text-xs text-muted-foreground mt-1">+45% revenue</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-primary">Expected Case</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">$2.1M</p>
                        <p className="text-xs text-muted-foreground mt-1">+28% revenue</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-destructive">Worst Case</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">$1.4M</p>
                        <p className="text-xs text-muted-foreground mt-1">+15% revenue</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Market Share Impact</span>
                        <span className="font-semibold">+6.5%</span>
                      </div>
                      <Progress value={65} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Competitive Advantage</span>
                        <span className="font-semibold">+8.2/10</span>
                      </div>
                      <Progress value={82} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Risk Level</span>
                        <span className="font-semibold">25%</span>
                      </div>
                      <Progress value={25} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-Time Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Real-Time Market Intelligence
              </CardTitle>
              <CardDescription>
                Live alerts for competitor moves, market shifts, and opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {realTimeAlerts.map((alert) => (
                    <Card key={alert.id} className="border-l-4" style={{
                      borderLeftColor: alert.severity === "critical" ? "hsl(var(--destructive))" : 
                                       alert.severity === "high" ? "hsl(var(--primary))" : "hsl(var(--muted))"
                    }}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(alert.type)}
                            <CardTitle className="text-base">{alert.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Impact Score:</span>
                            <Progress value={alert.impact * 10} className="w-24 h-2" />
                            <span className="text-sm font-semibold">{alert.impact}/10</span>
                          </div>
                          <Button size="sm" variant="outline" className="gap-2">
                            <ArrowRight className="h-4 w-4" />
                            {alert.action}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Sources Tab */}
        <TabsContent value="data" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Automated Data Ingestion
                </CardTitle>
                <CardDescription>
                  Connect data sources for continuous analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Internal Sales Data", status: "connected", coverage: 95 },
                    { name: "Competitor Intelligence", status: "connected", coverage: 88 },
                    { name: "Market Trends API", status: "connected", coverage: 92 },
                    { name: "Social Media Sentiment", status: "active", coverage: 78 },
                    { name: "Regulatory Database", status: "active", coverage: 85 },
                    { name: "Customer Feedback", status: "connected", coverage: 90 },
                  ].map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{source.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={source.coverage} className="h-1 w-32" />
                          <span className="text-xs text-muted-foreground">{source.coverage}%</span>
                        </div>
                      </div>
                      <Badge variant={source.status === "connected" ? "default" : "secondary"}>
                        {source.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Manual Data Upload
                </CardTitle>
                <CardDescription>
                  Upload data files for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data Type</Label>
                    <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Input</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="json">JSON Data</SelectItem>
                        <SelectItem value="image">Image/Screenshot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDataSource === "manual" ? (
                    <div className="space-y-2">
                      <Label>Data Content</Label>
                      <Textarea
                        placeholder="Enter competitor information, market data, or any business intelligence..."
                        value={manualData}
                        onChange={(e) => setManualData(e.target.value)}
                        className="min-h-[200px]"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drop your files here or click to browse
                      </p>
                      <Input type="file" className="hidden" id="file-upload" />
                      <Label htmlFor="file-upload">
                        <Button variant="outline" size="sm" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                    </div>
                  )}

                  <Button 
                    className="w-full gap-2" 
                    onClick={handleDataUpload}
                    disabled={analysisRunning}
                  >
                    {analysisRunning ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" />
                        Analyze Data
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Autonomous Action Panel */}
          {autonomousExecution && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Autonomous Action Log
                </CardTitle>
                <CardDescription>
                  AI-executed actions and their outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {[
                      {
                        action: "Dynamic pricing adjustment",
                        timestamp: "15 minutes ago",
                        status: "completed",
                        impact: "+$12,500 revenue",
                      },
                      {
                        action: "Launched targeted ad campaign",
                        timestamp: "2 hours ago",
                        status: "active",
                        impact: "25% CTR increase",
                      },
                      {
                        action: "Contacted high-value prospect",
                        timestamp: "5 hours ago",
                        status: "completed",
                        impact: "Meeting scheduled",
                      },
                    ].map((log, idx) => (
                      <div key={idx} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={log.status === "completed" ? "default" : "secondary"}>
                            {log.status}
                          </Badge>
                          <p className="text-xs font-semibold text-green-600 mt-1">{log.impact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
