import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radar, TrendingUp, TrendingDown, AlertCircle, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar } from 'recharts';

const anomalies = [
  {
    id: 1,
    metric: 'Customer Churn Rate',
    yourValue: 8.7,
    industryAvg: 3.6,
    variance: 2.4,
    severity: 'high',
    trend: 'up',
    insight: 'Your churn is 2.4x higher than industry average this week',
    recommendation: 'Implement retention campaign immediately; competitor launched loyalty program',
    companiesCompared: 1247
  },
  {
    id: 2,
    metric: 'Average Deal Size',
    yourValue: 12400,
    industryAvg: 18900,
    variance: -0.34,
    severity: 'medium',
    trend: 'down',
    insight: '34% below industry peers in same segment',
    recommendation: 'Review pricing strategy; consider value-based pricing model',
    companiesCompared: 892
  },
  {
    id: 3,
    metric: 'Sales Cycle Length',
    yourValue: 47,
    industryAvg: 32,
    variance: 1.47,
    severity: 'medium',
    trend: 'up',
    insight: 'Sales cycle 47% longer than competitors',
    recommendation: 'Streamline qualification process; add demo automation',
    companiesCompared: 1034
  },
  {
    id: 4,
    metric: 'Employee Productivity',
    yourValue: 94,
    industryAvg: 87,
    variance: 1.08,
    severity: 'low',
    trend: 'stable',
    insight: '8% above industry benchmark',
    recommendation: 'Maintain current workflow; document best practices',
    companiesCompared: 2341
  }
];

const comparisonData = [
  { category: 'Churn', yourCompany: 87, industry: 36, threshold: 40 },
  { category: 'Revenue Growth', yourCompany: 42, industry: 68, threshold: 50 },
  { category: 'Efficiency', yourCompany: 94, industry: 87, threshold: 80 },
  { category: 'Customer Satisfaction', yourCompany: 78, industry: 82, threshold: 75 },
  { category: 'Market Share', yourCompany: 23, industry: 45, threshold: 30 },
  { category: 'Innovation Index', yourCompany: 89, industry: 71, threshold: 70 },
];

const trendData = [
  { week: 'W-4', churn: 4.2, industry: 3.5 },
  { week: 'W-3', churn: 5.1, industry: 3.6 },
  { week: 'W-2', churn: 6.8, industry: 3.5 },
  { week: 'W-1', churn: 7.9, industry: 3.7 },
  { week: 'Now', churn: 8.7, industry: 3.6 },
];

export const MarketAnomalyRadar = () => {
  const [selectedAnomaly, setSelectedAnomaly] = useState(anomalies[0]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Anomalies</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Companies Tracked</p>
                <p className="text-2xl font-bold">1.2K+</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Variance</p>
                <p className="text-2xl font-bold">±34%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Detection Rate</p>
                <p className="text-2xl font-bold">97.3%</p>
              </div>
              <Radar className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anomaly List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Radar className="w-5 h-5 text-warning" />
            <span>Performance Anomalies vs Industry</span>
          </CardTitle>
          <CardDescription>Real-time comparison across 1,200+ peer companies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div 
                key={anomaly.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedAnomaly.id === anomaly.id 
                    ? 'bg-primary/5 border-primary' 
                    : 'bg-card hover:bg-muted/30'
                }`}
                onClick={() => setSelectedAnomaly(anomaly)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{anomaly.metric}</h3>
                      <Badge variant={getSeverityBadge(anomaly.severity) as any} className="capitalize">
                        {anomaly.severity}
                      </Badge>
                      {anomaly.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-destructive" />
                      ) : anomaly.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-warning" />
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{anomaly.insight}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Your Value</p>
                    <p className={`text-xl font-bold ${getSeverityColor(anomaly.severity)}`}>
                      {typeof anomaly.yourValue === 'number' && anomaly.yourValue > 100 
                        ? `$${anomaly.yourValue.toLocaleString()}` 
                        : `${anomaly.yourValue}${anomaly.metric.includes('Rate') || anomaly.metric.includes('Length') ? '' : '%'}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="p-2 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Industry Avg</p>
                    <p className="text-sm font-semibold">
                      {typeof anomaly.industryAvg === 'number' && anomaly.industryAvg > 100 
                        ? `$${anomaly.industryAvg.toLocaleString()}` 
                        : `${anomaly.industryAvg}${anomaly.metric.includes('Rate') || anomaly.metric.includes('Length') ? '' : '%'}`}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Variance</p>
                    <p className={`text-sm font-semibold ${anomaly.variance > 0 ? 'text-destructive' : 'text-success'}`}>
                      {anomaly.variance > 0 ? '+' : ''}{(anomaly.variance * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Companies</p>
                    <p className="text-sm font-semibold">{anomaly.companiesCompared.toLocaleString()}</p>
                  </div>
                </div>

                {selectedAnomaly.id === anomaly.id && (
                  <div className="bg-primary/5 p-3 rounded-lg border-l-4 border-primary">
                    <p className="text-sm">
                      <span className="font-semibold text-primary">AI Recommendation:</span> {anomaly.recommendation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Radar Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Metric Comparison</CardTitle>
          <CardDescription>Your company vs industry benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={comparisonData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="category" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <RechartsRadar name="Your Company" dataKey="yourCompany" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              <RechartsRadar name="Industry Avg" dataKey="industry" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" fillOpacity={0.4} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Anomaly Trend: {selectedAnomaly.metric}</CardTitle>
          <CardDescription>Weekly comparison vs industry benchmark</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="churn" stroke="hsl(var(--destructive))" strokeWidth={2} name="Your Company" />
              <Line type="monotone" dataKey="industry" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" name="Industry Avg" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
