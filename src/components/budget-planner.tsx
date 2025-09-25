import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, AlertCircle, Target, PiggyBank, Calendar } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const budgetCategories = [
  { name: 'Housing', budget: 2500, spent: 2400, percentage: 30, color: 'hsl(var(--primary))' },
  { name: 'Transportation', budget: 800, spent: 920, percentage: 10, color: 'hsl(var(--secondary))' },
  { name: 'Food & Dining', budget: 600, spent: 580, percentage: 8, color: 'hsl(var(--accent))' },
  { name: 'Utilities', budget: 300, spent: 285, percentage: 4, color: 'hsl(var(--muted))' },
  { name: 'Entertainment', budget: 400, spent: 350, percentage: 5, color: 'hsl(var(--success))' },
  { name: 'Healthcare', budget: 500, spent: 420, percentage: 6, color: 'hsl(var(--warning))' },
  { name: 'Shopping', budget: 600, spent: 780, percentage: 8, color: 'hsl(var(--destructive))' },
  { name: 'Savings', budget: 1200, spent: 1200, percentage: 15, color: 'hsl(var(--primary-foreground))' },
];

const monthlyTrends = [
  { month: 'Jan', income: 8000, expenses: 6800, savings: 1200 },
  { month: 'Feb', income: 8000, expenses: 7100, savings: 900 },
  { month: 'Mar', income: 8200, expenses: 6950, savings: 1250 },
  { month: 'Apr', income: 8000, expenses: 7200, savings: 800 },
  { month: 'May', income: 8500, expenses: 7000, savings: 1500 },
  { month: 'Jun', income: 8000, expenses: 6735, savings: 1265 },
];

const savingsGoals = [
  { name: 'Emergency Fund', target: 24000, current: 18500, deadline: '2024-12-31', priority: 'high' },
  { name: 'Vacation', target: 5000, current: 2800, deadline: '2024-08-15', priority: 'medium' },
  { name: 'Car Down Payment', target: 8000, current: 3200, deadline: '2025-03-01', priority: 'high' },
  { name: 'Home Renovation', target: 15000, current: 4500, deadline: '2025-06-01', priority: 'low' },
];

const predictiveInsights = [
  {
    category: 'Transportation',
    prediction: 'Likely to exceed budget by $120 this month',
    confidence: 85,
    recommendation: 'Consider carpooling or public transport'
  },
  {
    category: 'Shopping',
    prediction: 'High spending detected - 30% over budget',
    confidence: 92,
    recommendation: 'Review unnecessary purchases'
  },
  {
    category: 'Emergency Fund',
    prediction: 'On track to reach goal 2 months early',
    confidence: 78,
    recommendation: 'Consider increasing monthly contribution'
  }
];

export const BudgetPlanner = () => {
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  
  const totalIncome = 8000;
  const totalExpenses = 6735;
  const totalSavings = 1265;
  const savingsRate = (totalSavings / totalIncome) * 100;

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return { status: 'over', color: 'text-destructive' };
    if (percentage > 90) return { status: 'warning', color: 'text-warning' };
    return { status: 'good', color: 'text-success' };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
                <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">84.2% of income</p>
              </div>
              <TrendingUp className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Savings</p>
                <p className="text-2xl font-bold text-success">${totalSavings.toLocaleString()}</p>
                <p className="text-sm text-success">{savingsRate.toFixed(1)}% rate</p>
              </div>
              <PiggyBank className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Health</p>
                <p className="text-2xl font-bold text-warning">Good</p>
                <p className="text-sm text-muted-foreground">2 categories over</p>
              </div>
              <Target className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="goals">Savings Goals</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending Distribution</CardTitle>
                <CardDescription>Monthly budget allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="budget"
                      data={budgetCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {budgetCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Income vs Expenses over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
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
                    <Line type="monotone" dataKey="income" stroke="hsl(var(--success))" strokeWidth={2} name="Income" />
                    <Line type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" strokeWidth={2} name="Expenses" />
                    <Line type="monotone" dataKey="savings" stroke="hsl(var(--primary))" strokeWidth={2} name="Savings" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Categories</CardTitle>
              <CardDescription>Track spending vs budget for each category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgetCategories.map((category, index) => {
                  const status = getBudgetStatus(category.spent, category.budget);
                  const spentPercentage = (category.spent / category.budget) * 100;
                  
                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold">{category.name}</h4>
                          <Badge className={
                            status.status === 'over' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                            status.status === 'warning' ? 'bg-warning/10 text-warning border-warning/20' :
                            'bg-success/10 text-success border-success/20'
                          }>
                            {status.status === 'over' ? 'Over Budget' : status.status === 'warning' ? 'Near Limit' : 'On Track'}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${status.color}`}>
                            ${category.spent} / ${category.budget}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {spentPercentage.toFixed(1)}% used
                          </div>
                        </div>
                      </div>
                      <Progress value={Math.min(spentPercentage, 100)} className="h-3" />
                      {category.spent > category.budget && (
                        <p className="text-sm text-destructive">
                          Over budget by ${(category.spent - category.budget).toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Savings Goals</CardTitle>
                <CardDescription>Track progress toward your financial goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {savingsGoals.map((goal, index) => {
                    const progress = (goal.current / goal.target) * 100;
                    const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold">{goal.name}</h4>
                            <Badge className={getPriorityColor(goal.priority)}>
                              {goal.priority} priority
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {daysLeft} days left
                            </div>
                          </div>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{progress.toFixed(1)}% complete</span>
                          <span>${(goal.target - goal.current).toLocaleString()} remaining</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add New Goal</CardTitle>
                <CardDescription>Set a new savings target</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Goal Name</label>
                  <Input
                    placeholder="e.g., New Laptop"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Amount</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Date</label>
                  <Input type="date" />
                </div>
                <Button className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Budget Insights</CardTitle>
              <CardDescription>Smart recommendations based on your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveInsights.map((insight, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-accent/5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">{insight.category}</h4>
                      </div>
                      <Badge variant="outline">{insight.confidence}% confidence</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{insight.prediction}</p>
                    <p className="text-sm font-medium text-primary">{insight.recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Health Report</CardTitle>
              <CardDescription>AI-generated summary and action items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <h4 className="font-semibold text-success mb-2">✓ Strengths</h4>
                <ul className="text-sm space-y-1">
                  <li>• Consistent savings rate of 15.8%</li>
                  <li>• Housing costs within recommended 30% of income</li>
                  <li>• Emergency fund growing steadily</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <h4 className="font-semibold text-warning mb-2">⚠ Areas for Improvement</h4>
                <ul className="text-sm space-y-1">
                  <li>• Transportation costs 15% over budget</li>
                  <li>• Shopping spending trending upward</li>
                  <li>• Consider automating more savings</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};