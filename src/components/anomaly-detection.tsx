import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Eye, TrendingUp, Clock, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

const anomalies = [
  {
    id: 1,
    type: 'fraud',
    severity: 'high',
    description: 'Unusual payment pattern detected',
    amount: 15000,
    vendor: 'TechSupply Co',
    confidence: 0.92,
    timestamp: '2024-01-15 14:23:00',
    details: 'Payment amount 400% higher than historical average for this vendor',
    recommendation: 'Verify payment authorization and invoice details'
  },
  {
    id: 2,
    type: 'efficiency',
    severity: 'medium',
    description: 'Recurring duplicate charges',
    amount: 299,
    vendor: 'CloudService Pro',
    confidence: 0.87,
    timestamp: '2024-01-15 11:45:00',
    details: 'Same service charged twice monthly for last 3 months',
    recommendation: 'Contact vendor to consolidate billing or cancel duplicate subscription'
  },
  {
    id: 3,
    type: 'spike',
    severity: 'medium',
    description: 'Sudden expense category increase',
    amount: 8500,
    vendor: 'Office Supplies Inc',
    confidence: 0.78,
    timestamp: '2024-01-15 09:12:00',
    details: 'Office supplies spending up 250% from previous month',
    recommendation: 'Review recent orders and establish spending controls'
  },
  {
    id: 4,
    type: 'timing',
    severity: 'low',
    description: 'Off-hours transaction',
    amount: 1200,
    vendor: 'Maintenance Corp',
    confidence: 0.65,
    timestamp: '2024-01-14 23:45:00',
    details: 'Transaction occurred outside normal business hours',
    recommendation: 'Verify transaction was authorized and legitimate'
  }
];

const categoryTrends = [
  { category: 'Office Supplies', normal: 2000, current: 8500, anomaly: true },
  { category: 'Software', normal: 5000, current: 5200, anomaly: false },
  { category: 'Marketing', normal: 8000, current: 7800, anomaly: false },
  { category: 'Utilities', normal: 1500, current: 1600, anomaly: false },
  { category: 'Travel', normal: 3000, current: 12000, anomaly: true },
  { category: 'Consulting', normal: 10000, current: 15000, anomaly: true },
];

const mlMetrics = [
  { label: 'Detection Accuracy', value: '94.2%', icon: Shield },
  { label: 'False Positive Rate', value: '2.1%', icon: Eye },
  { label: 'Anomalies Detected', value: '127', icon: AlertTriangle },
  { label: 'Avg Response Time', value: '1.3s', icon: Clock },
];

export const AnomalyDetection = () => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  
  const filteredAnomalies = selectedSeverity === 'all' 
    ? anomalies 
    : anomalies.filter(anomaly => anomaly.severity === selectedSeverity);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Detection Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {mlMetrics.map((metric) => (
          <Card key={metric.label} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <metric.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Anomaly Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span>Live Anomaly Detection</span>
              </CardTitle>
              <CardDescription>AI-powered transaction monitoring and fraud detection</CardDescription>
            </div>
            <div className="flex gap-2">
              {['all', 'high', 'medium', 'low'].map((severity) => (
                <Button
                  key={severity}
                  variant={selectedSeverity === severity ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSeverity(severity)}
                  className="capitalize"
                >
                  {severity}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAnomalies.map((anomaly) => (
              <div key={anomaly.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-semibold">{anomaly.description}</p>
                      <p className="text-sm text-muted-foreground">{anomaly.vendor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-destructive">${anomaly.amount.toLocaleString()}</p>
                    <Badge variant={getSeverityBadge(anomaly.severity) as any} className="mt-1">
                      {anomaly.severity} risk
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-lg mb-3">
                  <p className="text-sm">{anomaly.details}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">
                      Confidence: <span className="font-semibold">{(anomaly.confidence * 100).toFixed(0)}%</span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {anomaly.timestamp}
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    Investigate
                  </Button>
                </div>
                
                <div className="mt-3 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <p className="text-sm">
                    <span className="font-semibold text-primary">AI Recommendation:</span> {anomaly.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Category Analysis</CardTitle>
          <CardDescription>Current vs historical spending patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryTrends}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="normal" fill="hsl(var(--muted))" name="Historical Average" />
              <Bar dataKey="current" fill="hsl(var(--primary))" name="Current Spending" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detection Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Detection Patterns</CardTitle>
            <CardDescription>Common anomaly types identified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5">
              <span className="font-medium">Fraud Detection</span>
              <Badge variant="destructive">3 alerts</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/5">
              <span className="font-medium">Efficiency Issues</span>
              <Badge variant="secondary">7 alerts</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
              <span className="font-medium">Spending Spikes</span>
              <Badge variant="outline">12 alerts</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="font-medium">Timing Anomalies</span>
              <Badge variant="outline">5 alerts</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Model Performance</CardTitle>
            <CardDescription>Last 30 days detection statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Detection Rate</span>
                <span className="font-semibold">94.2%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '94.2%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing Speed</span>
                <span className="font-semibold">1.3s avg</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Model Confidence</span>
                <span className="font-semibold">89.7%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '89.7%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};