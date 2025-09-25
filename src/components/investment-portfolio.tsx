import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, PieChart, Target, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar, Pie } from 'recharts';

const performanceData = [
  { month: 'Jan', portfolio: 100000, benchmark: 98000 },
  { month: 'Feb', portfolio: 105000, benchmark: 101000 },
  { month: 'Mar', portfolio: 98000, benchmark: 99000 },
  { month: 'Apr', portfolio: 112000, benchmark: 105000 },
  { month: 'May', portfolio: 118000, benchmark: 108000 },
  { month: 'Jun', portfolio: 125000, benchmark: 112000 },
];

const assetAllocation = [
  { name: 'Stocks', value: 60, color: 'hsl(var(--primary))' },
  { name: 'Bonds', value: 25, color: 'hsl(var(--secondary))' },
  { name: 'Real Estate', value: 10, color: 'hsl(var(--accent))' },
  { name: 'Crypto', value: 5, color: 'hsl(var(--muted))' },
];

const topHoldings = [
  { symbol: 'AAPL', name: 'Apple Inc.', value: 25000, change: 2.4, weight: 20 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', value: 20000, change: -1.2, weight: 16 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', value: 18000, change: 1.8, weight: 14.4 },
  { symbol: 'TSLA', name: 'Tesla Inc.', value: 15000, change: 4.2, weight: 12 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', value: 12000, change: 3.1, weight: 9.6 },
];

const rebalanceRecommendations = [
  { action: 'Reduce', asset: 'AAPL', current: 20, target: 15, reason: 'Overweight vs benchmark' },
  { action: 'Increase', asset: 'Bonds', current: 25, target: 30, reason: 'Risk mitigation' },
  { action: 'Consider', asset: 'REIT', current: 0, target: 5, reason: 'Diversification opportunity' },
];

export const InvestmentPortfolio = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6M');
  
  const totalValue = 125000;
  const totalReturn = 25000;
  const returnPercentage = 25.0;
  const riskScore = 7.2;

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Return</p>
                <p className="text-2xl font-bold text-success">+${totalReturn.toLocaleString()}</p>
                <p className="text-sm text-success">+{returnPercentage}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                <p className="text-2xl font-bold">{riskScore}/10</p>
                <p className="text-sm text-warning">Moderate Risk</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <p className="text-2xl font-bold text-success">+11.6%</p>
                <p className="text-sm text-muted-foreground">vs S&P 500</p>
              </div>
              <Target className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>Portfolio vs Benchmark Performance</CardDescription>
                </div>
                <div className="flex gap-2">
                  {['3M', '6M', '1Y', '3Y'].map((period) => (
                    <Button
                      key={period}
                      variant={selectedTimeframe === period ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTimeframe(period)}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="portfolio" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Portfolio"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="benchmark" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="S&P 500"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Allocation Health</CardTitle>
                <CardDescription>Target vs Current allocation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {assetAllocation.map((asset) => (
                  <div key={asset.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{asset.name}</span>
                      <span>{asset.value}%</span>
                    </div>
                    <Progress value={asset.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="holdings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Holdings</CardTitle>
              <CardDescription>Your largest positions by value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topHoldings.map((holding) => (
                  <div key={holding.symbol} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">{holding.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{holding.symbol}</p>
                        <p className="text-sm text-muted-foreground">{holding.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${holding.value.toLocaleString()}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant={holding.change > 0 ? "default" : "destructive"} className="text-xs">
                          {holding.change > 0 ? '+' : ''}{holding.change}%
                        </Badge>
                        <span className="text-sm text-muted-foreground">{holding.weight}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>AI-Powered Rebalancing Recommendations</CardTitle>
              </div>
              <CardDescription>Smart suggestions to optimize your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rebalanceRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-accent/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={rec.action === 'Reduce' ? 'destructive' : rec.action === 'Increase' ? 'default' : 'secondary'}>
                          {rec.action}
                        </Badge>
                        <span className="font-semibold">{rec.asset}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {rec.current}% → {rec.target}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                    <Button size="sm" className="mt-2">Apply Recommendation</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>AI-generated market analysis and predictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <h4 className="font-semibold text-success mb-2">Opportunity Detected</h4>
                <p className="text-sm">Tech sector showing strong momentum. Consider increasing allocation to growth stocks by 5%.</p>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <h4 className="font-semibold text-warning mb-2">Risk Alert</h4>
                <p className="text-sm">High concentration in Apple (20%). Recommended max single holding: 15%.</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Prediction</h4>
                <p className="text-sm">Portfolio expected to outperform benchmark by 3-5% over next 12 months based on current allocation.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};