import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Cloud, Mail, FileText, MessageSquare, Video, Database, ShoppingCart, Activity, TrendingUp, TrendingDown, Minus, Brain, Zap } from "lucide-react";

const integrations = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: Mail,
    description: 'Auto-sync emails, invoices, contracts',
    status: 'connected',
    lastSync: '2 mins ago',
    dataPoints: 1247
  },
  {
    id: 'drive',
    name: 'Google Drive',
    icon: Cloud,
    description: 'Financial docs, contracts, reports',
    status: 'connected',
    lastSync: '5 mins ago',
    dataPoints: 856
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: MessageSquare,
    description: 'Team conversations, decisions, action items',
    status: 'connected',
    lastSync: '1 min ago',
    dataPoints: 3421
  },
  {
    id: 'zoom',
    name: 'Zoom',
    icon: Video,
    description: 'Meeting transcripts, action items',
    status: 'syncing',
    lastSync: 'syncing...',
    dataPoints: 124
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    icon: FileText,
    description: 'Financial models, budgets, KPIs',
    status: 'connected',
    lastSync: '3 mins ago',
    dataPoints: 542
  },
  {
    id: 'crm',
    name: 'Salesforce CRM',
    icon: Database,
    description: 'Customer data, pipeline, churn signals',
    status: 'connected',
    lastSync: '4 mins ago',
    dataPoints: 2891
  },
  {
    id: 'erp',
    name: 'SAP ERP',
    icon: ShoppingCart,
    description: 'Operations, supply chain, HR, inventory',
    status: 'error',
    lastSync: '2 hours ago',
    dataPoints: 1567
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    icon: Activity,
    description: 'Accounting, payroll, compliance',
    status: 'connected',
    lastSync: '1 min ago',
    dataPoints: 1893
  }
];

const recentSyncs = [
  { time: '2 mins ago', source: 'Gmail', type: 'Invoice', action: 'Auto-categorized as expense', confidence: 0.94, dataExtracted: 'Revenue: $45,000' },
  { time: '3 mins ago', source: 'Zoom', type: 'Meeting Transcript', action: 'Extracted 3 action items + budget variance detected', confidence: 0.89, dataExtracted: 'Budget impact: -$12K' },
  { time: '5 mins ago', source: 'Slack', type: 'Decision', action: 'Linked to Q1 budget revision', confidence: 0.92, dataExtracted: 'Target: +15% growth' },
  { time: '6 mins ago', source: 'Drive', type: 'Financial Report', action: 'Auto-extracted KPIs: Revenue, Churn, CAC', confidence: 0.91, dataExtracted: '23 metrics parsed' },
  { time: '8 mins ago', source: 'CRM', type: 'Customer Data', action: 'Churn risk detected for 3 accounts', confidence: 0.91, dataExtracted: 'ARR at risk: $180K' },
  { time: '10 mins ago', source: 'QuickBooks', type: 'Transaction Log', action: 'Detected expense anomaly in Marketing', confidence: 0.88, dataExtracted: '+240% variance' },
  { time: '12 mins ago', source: 'Sheets', type: 'KPI Dashboard', action: 'Auto-synced 47 operational metrics', confidence: 0.95, dataExtracted: 'Productivity: +8%' }
];

const autoDetectedMetrics = [
  { category: 'Revenue Metrics', metrics: ['MRR', 'ARR', 'Growth Rate', 'Revenue/Customer'], count: 12, trend: 'up' },
  { category: 'Customer Health', metrics: ['Churn %', 'NPS', 'CAC', 'LTV', 'Retention'], count: 8, trend: 'stable' },
  { category: 'Operational KPIs', metrics: ['Burn Rate', 'Runway', 'Team Productivity', 'Velocity'], count: 15, trend: 'up' },
  { category: 'Financial Health', metrics: ['Gross Margin', 'EBITDA', 'Cash Flow', 'Budget Variance'], count: 10, trend: 'down' }
];

export const DataSyncHub = () => {
  const [enabledIntegrations, setEnabledIntegrations] = useState<Record<string, boolean>>({
    gmail: true,
    drive: true,
    slack: true,
    zoom: true,
    sheets: true,
    crm: true,
    erp: false,
    quickbooks: true
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-success/20 text-success';
      case 'syncing': return 'bg-primary/20 text-primary';
      case 'error': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'syncing': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Integrations</p>
                <p className="text-2xl font-bold">7/8</p>
              </div>
              <Cloud className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data Points Synced</p>
                <p className="text-2xl font-bold">12.5K</p>
              </div>
              <Database className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Auto-Actions</p>
                <p className="text-2xl font-bold">347</p>
              </div>
              <Activity className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold">91.2%</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Integrations</CardTitle>
          <CardDescription>Real-time data sync from all your business tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <integration.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={enabledIntegrations[integration.id]}
                    onCheckedChange={(checked) => 
                      setEnabledIntegrations(prev => ({ ...prev, [integration.id]: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge variant={getStatusBadge(integration.status) as any} className="capitalize">
                      {integration.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {integration.dataPoints.toLocaleString()} data points
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{integration.lastSync}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Intelligence Overview */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI-Powered Intelligence Engine</CardTitle>
          </div>
          <CardDescription>Automatically processes raw data without manual configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-card border">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="h-4 w-4 text-warning" />
                <p className="font-semibold">Auto-Detection Capabilities</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Revenue & expense patterns from transactions</li>
                <li>• Customer growth & churn signals from CRM</li>
                <li>• Budget variance from financial reports</li>
                <li>• Productivity metrics from team data</li>
                <li>• Risk indicators across all data sources</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <div className="flex items-center space-x-2 mb-3">
                <Activity className="h-4 w-4 text-success" />
                <p className="font-semibold">Real-Time Processing</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Instant numerical data extraction</li>
                <li>• Automatic KPI identification</li>
                <li>• Smart categorization (no manual tags)</li>
                <li>• Cross-source data correlation</li>
                <li>• Anomaly detection on all metrics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Detected Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Detected Business Metrics</CardTitle>
          <CardDescription>AI automatically identifies and tracks key metrics without configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {autoDetectedMetrics.map((category, idx) => (
              <div key={idx} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-primary" />
                    <p className="font-semibold">{category.category}</p>
                  </div>
                  {category.trend === 'up' && <TrendingUp className="h-4 w-4 text-success" />}
                  {category.trend === 'down' && <TrendingDown className="h-4 w-4 text-destructive" />}
                  {category.trend === 'stable' && <Minus className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {category.metrics.map((metric, midx) => (
                      <Badge key={midx} variant="outline" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{category.count} metrics tracked</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Auto-Sync Activity</CardTitle>
          <CardDescription>AI-powered data enrichment and classification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSyncs.map((sync, idx) => (
              <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-xs">{sync.source}</Badge>
                    <Badge variant="secondary" className="text-xs">{sync.type}</Badge>
                    <span className="text-xs text-muted-foreground">{sync.time}</span>
                  </div>
                  <p className="text-sm mb-1">{sync.action}</p>
                  <p className="text-xs text-primary font-medium">{sync.dataExtracted}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className="text-sm font-semibold">{(sync.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Relationship Graph Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Data Relationships</CardTitle>
          <CardDescription>Auto-linked connections across your business data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="font-semibold mb-2">Email → Invoice → Expense</p>
              <p className="text-sm text-muted-foreground">347 auto-linked chains</p>
            </div>
            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <p className="font-semibold mb-2">Meeting → Action → KPI</p>
              <p className="text-sm text-muted-foreground">124 auto-tracked items</p>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
              <p className="font-semibold mb-2">Customer → Contract → Risk</p>
              <p className="text-sm text-muted-foreground">89 risk profiles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
