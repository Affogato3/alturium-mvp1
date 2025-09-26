import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, Users, DollarSign, Target, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ScenarioInputs {
  hiring: number;
  marketing: number;
  infrastructure: number;
  pricing: number;
  marketExpansion: number;
}

const baseMetrics = {
  revenue: 50000,
  expenses: 35000,
  employees: 25,
  customers: 1200,
  churnRate: 5,
  acquisitionCost: 150,
};

const ScenarioCard = ({ title, icon: Icon, current, projected, impact, color }: any) => (
  <Card className={`bg-gradient-to-br from-${color}/5 to-${color}/10 border-${color}/20`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 text-${color}`} />
          <span className="font-medium">{title}</span>
        </div>
        <Badge variant={impact > 0 ? "default" : "destructive"}>
          {impact > 0 ? '+' : ''}{impact.toFixed(1)}%
        </Badge>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Current</span>
          <span className="font-semibold">${current.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Projected</span>
          <span className={`font-bold text-${impact > 0 ? 'success' : 'destructive'}`}>
            ${projected.toLocaleString()}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ProfitabilitySimulator = () => {
  const [inputs, setInputs] = useState<ScenarioInputs>({
    hiring: 0,
    marketing: 0,
    infrastructure: 0,
    pricing: 0,
    marketExpansion: 0,
  });

  const [projections, setProjections] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState('custom');

  // Calculate projections based on inputs
  useEffect(() => {
    const calculateProjections = () => {
      const monthlyData = [];
      
      for (let month = 1; month <= 12; month++) {
        // Base growth
        const baseRevenue = baseMetrics.revenue * (1 + (month * 0.05));
        const baseExpenses = baseMetrics.expenses * (1 + (month * 0.03));
        
        // Apply scenario adjustments
        const hiringMultiplier = 1 + (inputs.hiring / 100);
        const marketingMultiplier = 1 + (inputs.marketing / 100);
        const pricingMultiplier = 1 + (inputs.pricing / 100);
        const expansionMultiplier = 1 + (inputs.marketExpansion / 100);
        
        // Revenue impact
        const adjustedRevenue = baseRevenue * pricingMultiplier * marketingMultiplier * expansionMultiplier;
        
        // Expense impact
        const hiringCost = (inputs.hiring / 100) * baseExpenses * 0.6; // 60% of expenses are people-related
        const marketingCost = (inputs.marketing / 100) * baseRevenue * 0.1; // Marketing as % of revenue
        const infraCost = (inputs.infrastructure / 100) * baseExpenses * 0.2; // Infrastructure costs
        
        const adjustedExpenses = baseExpenses + hiringCost + marketingCost + infraCost;
        
        const profit = adjustedRevenue - adjustedExpenses;
        const margin = (profit / adjustedRevenue) * 100;
        
        monthlyData.push({
          month: `Month ${month}`,
          revenue: Math.round(adjustedRevenue),
          expenses: Math.round(adjustedExpenses),
          profit: Math.round(profit),
          margin: Math.round(margin * 10) / 10,
        });
      }
      
      setProjections(monthlyData);
    };
    
    calculateProjections();
  }, [inputs]);

  const presetScenarios = {
    conservative: { hiring: 10, marketing: 15, infrastructure: 5, pricing: 5, marketExpansion: 0 },
    aggressive: { hiring: 50, marketing: 40, infrastructure: 25, pricing: 15, marketExpansion: 30 },
    pivot: { hiring: -20, marketing: 60, infrastructure: 10, pricing: 0, marketExpansion: 50 },
  };

  const applyScenario = (scenario: keyof typeof presetScenarios) => {
    setInputs(presetScenarios[scenario]);
    setSelectedScenario(scenario);
  };

  const currentMonth = projections[11] || { revenue: 0, expenses: 0, profit: 0, margin: 0 };
  const revenueImpact = ((currentMonth.revenue - baseMetrics.revenue) / baseMetrics.revenue) * 100;
  const expenseImpact = ((currentMonth.expenses - baseMetrics.expenses) / baseMetrics.expenses) * 100;
  const profitImpact = currentMonth.profit - (baseMetrics.revenue - baseMetrics.expenses);

  return (
    <div className="space-y-6">
      {/* Scenario Presets */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Profitability Scenario Engine</h3>
          <p className="text-sm text-muted-foreground">Simulate the impact of business decisions on profitability</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedScenario === 'conservative' ? "default" : "outline"}
            size="sm"
            onClick={() => applyScenario('conservative')}
          >
            Conservative
          </Button>
          <Button
            variant={selectedScenario === 'aggressive' ? "default" : "outline"}
            size="sm"
            onClick={() => applyScenario('aggressive')}
          >
            Aggressive
          </Button>
          <Button
            variant={selectedScenario === 'pivot' ? "default" : "outline"}
            size="sm"
            onClick={() => applyScenario('pivot')}
          >
            Pivot
          </Button>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScenarioCard
          title="Revenue Impact"
          icon={DollarSign}
          current={baseMetrics.revenue}
          projected={currentMonth.revenue}
          impact={revenueImpact}
          color="success"
        />
        <ScenarioCard
          title="Expense Impact"
          icon={TrendingUp}
          current={baseMetrics.expenses}
          projected={currentMonth.expenses}
          impact={expenseImpact}
          color="warning"
        />
        <ScenarioCard
          title="Profit Change"
          icon={Target}
          current={baseMetrics.revenue - baseMetrics.expenses}
          projected={currentMonth.profit}
          impact={(profitImpact / (baseMetrics.revenue - baseMetrics.expenses)) * 100}
          color="primary"
        />
      </div>

      <Tabs defaultValue="simulator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="simulator">Scenario Simulator</TabsTrigger>
          <TabsTrigger value="projections">12-Month Projections</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="simulator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Scenario Inputs</span>
                </CardTitle>
                <CardDescription>Adjust variables to simulate different business scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Team Expansion</label>
                    <span className="text-sm text-muted-foreground">{inputs.hiring}%</span>
                  </div>
                  <Slider
                    value={[inputs.hiring]}
                    onValueChange={([value]) => setInputs(prev => ({ ...prev, hiring: value }))}
                    max={100}
                    min={-50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Marketing Investment</label>
                    <span className="text-sm text-muted-foreground">{inputs.marketing}%</span>
                  </div>
                  <Slider
                    value={[inputs.marketing]}
                    onValueChange={([value]) => setInputs(prev => ({ ...prev, marketing: value }))}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Infrastructure Scaling</label>
                    <span className="text-sm text-muted-foreground">{inputs.infrastructure}%</span>
                  </div>
                  <Slider
                    value={[inputs.infrastructure]}
                    onValueChange={([value]) => setInputs(prev => ({ ...prev, infrastructure: value }))}
                    max={50}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Pricing Adjustment</label>
                    <span className="text-sm text-muted-foreground">{inputs.pricing}%</span>
                  </div>
                  <Slider
                    value={[inputs.pricing]}
                    onValueChange={([value]) => setInputs(prev => ({ ...prev, pricing: value }))}
                    max={30}
                    min={-20}
                    step={2}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Market Expansion</label>
                    <span className="text-sm text-muted-foreground">{inputs.marketExpansion}%</span>
                  </div>
                  <Slider
                    value={[inputs.marketExpansion]}
                    onValueChange={([value]) => setInputs(prev => ({ ...prev, marketExpansion: value }))}
                    max={100}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Live Results */}
            <Card>
              <CardHeader>
                <CardTitle>Scenario Results</CardTitle>
                <CardDescription>Real-time impact visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projections.slice(-6)}>
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
                    <Bar dataKey="revenue" fill="hsl(var(--success))" name="Revenue" />
                    <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" />
                    <Bar dataKey="profit" fill="hsl(var(--primary))" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>12-Month Financial Projections</CardTitle>
              <CardDescription>Based on current scenario inputs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={projections}>
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
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={3} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" strokeWidth={3} name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="hsl(var(--primary))" strokeWidth={3} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>AI Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <h4 className="font-semibold text-success mb-2">Opportunity Identified</h4>
                  <p className="text-sm">Increasing marketing by 25% could boost revenue by $18K with ROI of 3.2x.</p>
                </div>
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <h4 className="font-semibold text-warning mb-2">Risk Alert</h4>
                  <p className="text-sm">Current hiring pace may strain cash flow in months 8-10. Consider phased approach.</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2">Optimization</h4>
                  <p className="text-sm">Reducing infrastructure costs by 10% while maintaining performance could save $2.1K monthly.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scenario Confidence</CardTitle>
                <CardDescription>AI confidence levels for projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Revenue Projection</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Expense Accuracy</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Market Assumptions</span>
                    <span className="font-semibold">74%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-warning h-2 rounded-full" style={{ width: '74%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};