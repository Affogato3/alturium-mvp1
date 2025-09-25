import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, Shield, TrendingDown, Calculator, Target, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';

const riskMetrics = [
  { name: 'Portfolio Beta', value: 1.2, benchmark: 1.0, status: 'moderate' },
  { name: 'Sharpe Ratio', value: 1.8, benchmark: 1.5, status: 'good' },
  { name: 'Max Drawdown', value: -15.2, benchmark: -20.0, status: 'good' },
  { name: 'Volatility', value: 18.5, benchmark: 22.0, status: 'good' },
  { name: 'VaR (95%)', value: -8.3, benchmark: -10.0, status: 'good' },
];

const stressTestScenarios = [
  { scenario: '2008 Financial Crisis', portfolioLoss: -42.1, marketLoss: -48.3, resilience: 87 },
  { scenario: 'COVID-19 Crash', portfolioLoss: -28.4, marketLoss: -35.2, resilience: 81 },
  { scenario: 'Tech Bubble Burst', portfolioLoss: -31.7, marketLoss: -38.9, resilience: 82 },
  { scenario: 'Interest Rate Shock', portfolioLoss: -18.2, marketLoss: -22.8, resilience: 80 },
];

const diversificationData = [
  { category: 'Geographic', score: 85, max: 100 },
  { category: 'Sector', score: 72, max: 100 },
  { category: 'Asset Class', score: 91, max: 100 },
  { category: 'Market Cap', score: 68, max: 100 },
  { category: 'Currency', score: 45, max: 100 },
  { category: 'Style', score: 76, max: 100 },
];

const correlationMatrix = [
  { asset1: 'Stocks', asset2: 'Bonds', correlation: -0.23 },
  { asset1: 'Stocks', asset2: 'Real Estate', correlation: 0.61 },
  { asset1: 'Stocks', asset2: 'Commodities', correlation: 0.15 },
  { asset1: 'Bonds', asset2: 'Real Estate', correlation: -0.08 },
  { asset1: 'Bonds', asset2: 'Commodities', correlation: -0.31 },
  { asset1: 'Real Estate', asset2: 'Commodities', correlation: 0.22 },
];

const riskContribution = [
  { asset: 'AAPL', contribution: 28.5, allocation: 20 },
  { asset: 'GOOGL', contribution: 22.1, allocation: 16 },
  { asset: 'MSFT', contribution: 18.7, allocation: 14.4 },
  { asset: 'TSLA', contribution: 15.3, allocation: 12 },
  { asset: 'Others', contribution: 15.4, allocation: 37.6 },
];

export const RiskAnalyzer = () => {
  const [stressTestSeverity, setStressTestSeverity] = useState([50]);
  const [timeHorizon, setTimeHorizon] = useState([12]);
  
  const overallRiskScore = 6.8;
  const riskCapacity = 'Moderate';
  const recommendedAction = 'Rebalance';

  const getRiskColor = (score: number) => {
    if (score <= 3) return 'text-success';
    if (score <= 7) return 'text-warning';
    return 'text-destructive';
  };

  const getRiskBadgeColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-success/10 text-success border-success/20';
      case 'moderate': return 'bg-warning/10 text-warning border-warning/20';
      case 'poor': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                <p className={`text-2xl font-bold ${getRiskColor(overallRiskScore)}`}>
                  {overallRiskScore}/10
                </p>
                <p className="text-sm text-warning">Moderate Risk</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Capacity</p>
                <p className="text-2xl font-bold">{riskCapacity}</p>
                <p className="text-sm text-primary">Balanced Profile</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Max Drawdown</p>
                <p className="text-2xl font-bold text-success">-15.2%</p>
                <p className="text-sm text-accent">Better than benchmark</p>
              </div>
              <TrendingDown className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Action Needed</p>
                <p className="text-2xl font-bold">{recommendedAction}</p>
                <p className="text-sm text-secondary">AI Recommendation</p>
              </div>
              <Target className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="metrics">Risk Metrics</TabsTrigger>
          <TabsTrigger value="stress">Stress Tests</TabsTrigger>
          <TabsTrigger value="diversification">Diversification</TabsTrigger>
          <TabsTrigger value="correlation">Correlations</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics Overview</CardTitle>
                <CardDescription>Key risk indicators for your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{metric.name}</span>
                        <Badge className={getRiskBadgeColor(metric.status)}>
                          {metric.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Current: {metric.value}</span>
                        <span>Benchmark: {metric.benchmark}</span>
                      </div>
                      <Progress 
                        value={Math.abs(metric.value / metric.benchmark) * 50} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Contribution by Asset</CardTitle>
                <CardDescription>How each holding contributes to portfolio risk</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskContribution}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="asset" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="contribution" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Stress Tests</CardTitle>
              <CardDescription>How your portfolio would have performed during major market events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stressTestScenarios.map((test, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{test.scenario}</h4>
                      <Badge variant="outline">Resilience: {test.resilience}%</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Portfolio Loss: </span>
                        <span className="font-semibold text-destructive">{test.portfolioLoss}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Market Loss: </span>
                        <span className="font-semibold text-muted-foreground">{test.marketLoss}%</span>
                      </div>
                    </div>
                    <Progress value={test.resilience} className="mt-2 h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Stress Test</CardTitle>
              <CardDescription>Simulate custom market scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Market Shock Severity: {stressTestSeverity[0]}%</label>
                  <Slider
                    value={stressTestSeverity}
                    onValueChange={setStressTestSeverity}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Time Horizon: {timeHorizon[0]} months</label>
                  <Slider
                    value={timeHorizon}
                    onValueChange={setTimeHorizon}
                    max={36}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
              <Button className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Run Stress Test
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diversification" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Diversification Analysis</CardTitle>
                <CardDescription>Portfolio diversification across key dimensions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={diversificationData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Diversification"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diversification Scores</CardTitle>
                <CardDescription>Detailed breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {diversificationData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-sm">{item.score}/100</span>
                      </div>
                      <Progress value={item.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Correlation Matrix</CardTitle>
              <CardDescription>Correlation coefficients between asset classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {correlationMatrix.map((corr, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{corr.asset1}</span>
                      <span className="text-muted-foreground">↔</span>
                      <span className="font-medium">{corr.asset2}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={
                          Math.abs(corr.correlation) > 0.5 
                            ? 'bg-destructive/10 text-destructive border-destructive/20' 
                            : Math.abs(corr.correlation) > 0.3
                            ? 'bg-warning/10 text-warning border-warning/20'
                            : 'bg-success/10 text-success border-success/20'
                        }
                      >
                        {corr.correlation.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>AI Risk Scenarios</CardTitle>
              </div>
              <CardDescription>Machine learning-generated risk scenarios and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <h4 className="font-semibold text-destructive mb-2">High Risk Scenario</h4>
                  <p className="text-sm mb-2">Tech concentration risk: 40% of portfolio in technology sector</p>
                  <p className="text-xs text-muted-foreground">Recommendation: Reduce tech allocation by 10-15%</p>
                </div>
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <h4 className="font-semibold text-warning mb-2">Moderate Risk Scenario</h4>
                  <p className="text-sm mb-2">Interest rate sensitivity: Rising rates could impact bond allocation</p>
                  <p className="text-xs text-muted-foreground">Recommendation: Consider shorter duration bonds</p>
                </div>
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <h4 className="font-semibold text-success mb-2">Low Risk Scenario</h4>
                  <p className="text-sm mb-2">Geographic diversification: Well-distributed across regions</p>
                  <p className="text-xs text-muted-foreground">Recommendation: Maintain current allocation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};