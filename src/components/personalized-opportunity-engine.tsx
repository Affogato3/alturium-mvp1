import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, TrendingUp, Target, DollarSign, Users, Calendar, 
  Database, Mail, Cloud, MessageSquare, Video, FileText, 
  BarChart3, Lock, Bell, Upload, Download, CheckCircle2,
  AlertCircle, Zap, Brain, ArrowRight, Eye, Shield
} from "lucide-react";

const dataSources = [
  { id: 'gmail', name: 'Gmail', icon: Mail, status: 'connected', dataPoints: 1247 },
  { id: 'drive', name: 'Google Drive', icon: Cloud, status: 'connected', dataPoints: 856 },
  { id: 'slack', name: 'Slack', icon: MessageSquare, status: 'connected', dataPoints: 3421 },
  { id: 'zoom', name: 'Zoom', icon: Video, status: 'connected', dataPoints: 124 },
  { id: 'crm', name: 'CRM', icon: Database, status: 'connected', dataPoints: 2891 },
  { id: 'erp', name: 'ERP', icon: FileText, status: 'syncing', dataPoints: 1567 },
  { id: 'stock', name: 'Stock Data', icon: BarChart3, status: 'connected', dataPoints: 456 }
];

const analysisAreas = [
  {
    id: 'performance',
    name: 'Company Performance & Growth',
    icon: TrendingUp,
    coverage: 94,
    insights: ['Revenue growth: +23% YoY', 'Market share expanded 5.2%', 'Customer retention: 91%'],
    color: 'text-success'
  },
  {
    id: 'strategy',
    name: 'Strategy & Future Goals',
    icon: Target,
    coverage: 87,
    insights: ['Focus: APAC expansion', 'Product diversification priority', 'AI integration roadmap'],
    color: 'text-primary'
  },
  {
    id: 'investments',
    name: 'Investments & Capital',
    icon: DollarSign,
    coverage: 92,
    insights: ['$45M available for deployment', 'R&D allocation: 18%', 'M&A appetite: High'],
    color: 'text-warning'
  },
  {
    id: 'market',
    name: 'Market & Competition',
    icon: BarChart3,
    coverage: 89,
    insights: ['Competitor gap in mobile segment', 'Emerging market opportunity: SEA', 'Price positioning optimal'],
    color: 'text-info'
  },
  {
    id: 'stock',
    name: 'Stock & Investor Relations',
    icon: TrendingUp,
    coverage: 85,
    insights: ['Stock up 34% this quarter', 'Investor sentiment: Bullish', 'Analyst target: $142'],
    color: 'text-success'
  },
  {
    id: 'employees',
    name: 'Employee & Internal Capability',
    icon: Users,
    coverage: 91,
    insights: ['Engineering capacity: 120 devs', 'Sales team productivity +15%', 'Low attrition: 7%'],
    color: 'text-primary'
  },
  {
    id: 'timeline',
    name: 'Timelines & Resources',
    icon: Calendar,
    coverage: 88,
    insights: ['Q2 launch window available', 'Budget cycle: Q1 planning', 'Resource allocation flexible'],
    color: 'text-warning'
  }
];

const generatedOpportunities = [
  {
    id: 1,
    title: 'APAC Mobile-First Product Launch',
    description: 'Launch mobile-optimized version targeting Southeast Asian markets with local payment integration',
    profitScore: 94,
    roi: 340,
    timeline: '4-6 months',
    investment: '$8.5M',
    risk: 'medium',
    alignment: 98,
    feasibility: 89,
    keyDrivers: ['Competitor gap in mobile', 'APAC expansion goal', 'Available capital', 'Engineering capacity'],
    steps: [
      'Conduct market research in Indonesia, Thailand, Vietnam',
      'Develop mobile-first UI with local payment gateways',
      'Partner with regional distributors',
      'Launch beta in Q2, full rollout Q3'
    ],
    kpis: ['User acquisition rate', 'Market penetration %', 'Revenue per market', 'CAC vs LTV ratio']
  },
  {
    id: 2,
    title: 'AI-Powered Customer Success Platform',
    description: 'Build internal AI tool to predict churn and automate retention campaigns, leveraging existing data',
    profitScore: 88,
    roi: 280,
    timeline: '3-4 months',
    investment: '$3.2M',
    risk: 'low',
    alignment: 95,
    feasibility: 94,
    keyDrivers: ['91% retention baseline', 'AI integration roadmap', 'CRM data richness', 'Low attrition = stable team'],
    steps: [
      'Train AI model on historical churn data',
      'Integrate with existing CRM and support systems',
      'Pilot with high-risk accounts in Q1',
      'Full rollout to all customer success teams'
    ],
    kpis: ['Churn reduction %', 'Retention cost savings', 'Customer lifetime value increase', 'Response time improvement']
  },
  {
    id: 3,
    title: 'Strategic Acquisition: Fintech Startup',
    description: 'Acquire emerging fintech player to accelerate payment infrastructure and expand product portfolio',
    profitScore: 91,
    roi: 420,
    timeline: '6-12 months',
    investment: '$22M',
    risk: 'high',
    alignment: 92,
    feasibility: 78,
    keyDrivers: ['M&A appetite high', '$45M capital available', 'Product diversification goal', 'Investor bullish sentiment'],
    steps: [
      'Due diligence on 3 target companies',
      'Negotiate acquisition terms and valuation',
      'Regulatory approval process',
      'Integration plan with existing products'
    ],
    kpis: ['Deal closure time', 'Integration success rate', 'Revenue synergy realization', 'Customer cross-sell rate']
  },
  {
    id: 4,
    title: 'Premium Enterprise Tier Launch',
    description: 'Introduce high-margin enterprise plan with advanced features, targeting Fortune 500 companies',
    profitScore: 86,
    roi: 310,
    timeline: '2-3 months',
    investment: '$1.8M',
    risk: 'low',
    alignment: 89,
    feasibility: 96,
    keyDrivers: ['Sales team productivity up', 'Price positioning optimal', 'Engineering capacity', 'Q2 launch window'],
    steps: [
      'Define enterprise feature set and pricing',
      'Build dedicated support infrastructure',
      'Sales team training and enablement',
      'Pilot with 5 strategic accounts'
    ],
    kpis: ['Enterprise customer count', 'Average contract value', 'Sales cycle length', 'Gross margin improvement']
  }
];

const liveInsights = [
  { time: '12 mins ago', source: 'Slack', insight: 'Engineering team discussing APAC mobile optimization feasibility', confidence: 92 },
  { time: '34 mins ago', source: 'Gmail', insight: 'Investor email expressing interest in Southeast Asian expansion', confidence: 89 },
  { time: '1 hour ago', source: 'Zoom', insight: 'Strategy meeting confirmed $45M capital deployment budget', confidence: 95 },
  { time: '2 hours ago', source: 'CRM', insight: 'Churn risk detected for 3 enterprise accounts - retention opportunity', confidence: 88 },
  { time: '3 hours ago', source: 'Stock Data', insight: 'Analyst upgrade to "Buy" rating - investor sentiment positive', confidence: 91 }
];

export const PersonalizedOpportunityEngine = () => {
  const [autoPersonalization, setAutoPersonalization] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);
  const [manualDataInput, setManualDataInput] = useState('');

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-success/20 text-success';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'high': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-primary';
    return 'text-warning';
  };

  return (
    <div className="space-y-6">
      {/* Header with Auto-Personalization Toggle */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Personalized Opportunity Generation Engine</CardTitle>
                <CardDescription>Hyper-personalized opportunities optimized for your unique company DNA</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right mr-2">
                <p className="text-sm font-medium">Auto-Personalization</p>
                <p className="text-xs text-muted-foreground">
                  {autoPersonalization ? 'Active' : 'Manual Mode'}
                </p>
              </div>
              <Switch 
                checked={autoPersonalization} 
                onCheckedChange={setAutoPersonalization}
                className="data-[state=checked]:bg-success"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Status Bar */}
      {autoPersonalization && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div>
                  <p className="font-semibold">Auto-Personalization Active</p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: 2 minutes ago • Coverage: 89% • Confidence: High
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="analysis">7-Area Analysis</TabsTrigger>
          <TabsTrigger value="data">Data Sources</TabsTrigger>
          <TabsTrigger value="insights">Live Insights</TabsTrigger>
        </TabsList>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Opportunities Generated</p>
                    <p className="text-2xl font-bold">{generatedOpportunities.length}</p>
                  </div>
                  <Sparkles className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Profit Score</p>
                    <p className="text-2xl font-bold">89.8</p>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Projected ROI</p>
                    <p className="text-2xl font-bold">337%</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-info/5 to-info/10 border-info/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data Coverage</p>
                    <p className="text-2xl font-bold">89%</p>
                  </div>
                  <Brain className="h-8 w-8 text-info" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Opportunities */}
          <div className="grid grid-cols-1 gap-6">
            {generatedOpportunities.map((opp) => (
              <Card 
                key={opp.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedOpportunity === opp.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedOpportunity(selectedOpportunity === opp.id ? null : opp.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-xl">{opp.title}</CardTitle>
                        <Badge className={getRiskColor(opp.risk)}>
                          {opp.risk.toUpperCase()} RISK
                        </Badge>
                      </div>
                      <CardDescription>{opp.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Sparkles className={`h-5 w-5 ${getScoreColor(opp.profitScore)}`} />
                        <span className={`text-3xl font-bold ${getScoreColor(opp.profitScore)}`}>
                          {opp.profitScore}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Profit Score</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Expected ROI</p>
                      <p className="text-xl font-bold text-success">+{opp.roi}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Timeline</p>
                      <p className="text-xl font-bold">{opp.timeline}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Investment</p>
                      <p className="text-xl font-bold text-warning">{opp.investment}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Alignment</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={opp.alignment} className="flex-1" />
                        <span className="text-sm font-bold">{opp.alignment}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedOpportunity === opp.id && (
                    <div className="space-y-6 pt-6 border-t">
                      {/* Key Drivers */}
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Zap className="h-4 w-4 text-warning" />
                          <p className="font-semibold">Key Drivers</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {opp.keyDrivers.map((driver, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {driver}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Execution Steps */}
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <ArrowRight className="h-4 w-4 text-primary" />
                          <p className="font-semibold">Execution Steps</p>
                        </div>
                        <div className="space-y-2">
                          {opp.steps.map((step, idx) => (
                            <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-primary">{idx + 1}</span>
                              </div>
                              <p className="text-sm">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Success KPIs */}
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <BarChart3 className="h-4 w-4 text-success" />
                          <p className="font-semibold">Success KPIs</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {opp.kpis.map((kpi, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-success/5 border border-success/20">
                              <p className="text-sm">{kpi}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <Button className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Export Full Report
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Detailed Analysis
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 7-Area Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>7-Area Company DNA Analysis</CardTitle>
              <CardDescription>Comprehensive coverage of your unique business profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analysisAreas.map((area) => (
                  <div key={area.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <area.icon className={`h-5 w-5 ${area.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold">{area.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Data Coverage: {area.coverage}%
                          </p>
                        </div>
                      </div>
                      <Progress value={area.coverage} className="w-32" />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Key Insights:</p>
                      {area.insights.map((insight, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Sources Tab */}
        <TabsContent value="data" className="space-y-6">
          {/* Automatic Data Sources */}
          {autoPersonalization && (
            <Card>
              <CardHeader>
                <CardTitle>Connected Data Sources</CardTitle>
                <CardDescription>Automatic data ingestion from integrated platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dataSources.map((source) => (
                    <div key={source.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <source.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{source.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {source.dataPoints.toLocaleString()} data points
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={source.status === 'connected' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {source.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manual Data Input */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Data Input</CardTitle>
              <CardDescription>Provide additional data manually to enhance personalization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Text Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Text / Numerical Data
                </label>
                <Textarea 
                  placeholder="Enter company data, metrics, goals, or strategic information..."
                  value={manualDataInput}
                  onChange={(e) => setManualDataInput(e.target.value)}
                  rows={6}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  File Upload (CSV, Excel, Images, PDFs)
                </label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    CSV, XLSX, JPG, PNG, PDF (Max 20MB)
                  </p>
                </div>
              </div>

              <Button className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Process & Generate Opportunities
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Live Intelligence Stream</CardTitle>
                  <CardDescription>Real-time insights extracted from connected sources</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Configure Alerts
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {liveInsights.map((insight, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {insight.source}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{insight.time}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <p className="text-sm font-semibold">{insight.confidence}%</p>
                      </div>
                    </div>
                    <p className="text-sm">{insight.insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alert Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Preferences</CardTitle>
              <CardDescription>Configure notifications for new opportunities and risks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <div>
                    <p className="font-medium">High-Value Opportunities</p>
                    <p className="text-xs text-muted-foreground">Profit score {'>'} 85</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium">Risk Alerts</p>
                    <p className="text-xs text-muted-foreground">Emerging threats detected</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">Market Shifts</p>
                    <p className="text-xs text-muted-foreground">Competitive landscape changes</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};