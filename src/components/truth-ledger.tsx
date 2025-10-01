import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Target, TrendingUp, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const predictions = [
  {
    id: 1,
    date: '2024-01-15',
    type: 'Revenue Forecast',
    prediction: 'Q1 revenue will be $2.4M',
    actualOutcome: '$2.38M',
    accuracy: 99.2,
    status: 'correct',
    confidence: 0.87,
    timeframe: 'Q1 2024',
    category: 'Finance'
  },
  {
    id: 2,
    date: '2024-02-01',
    type: 'Churn Prediction',
    prediction: 'Customer ABC Corp will churn within 30 days',
    actualOutcome: 'Churned after 28 days',
    accuracy: 93.3,
    status: 'correct',
    confidence: 0.91,
    timeframe: '30 days',
    category: 'Customer'
  },
  {
    id: 3,
    date: '2024-02-10',
    type: 'Market Demand',
    prediction: 'SE Asia demand will surge +40% in March',
    actualOutcome: '+47% actual growth',
    accuracy: 85.1,
    status: 'correct',
    confidence: 0.79,
    timeframe: 'March 2024',
    category: 'Market'
  },
  {
    id: 4,
    date: '2024-02-20',
    type: 'Expense Forecast',
    prediction: 'Cloud costs will increase 15% in Q2',
    actualOutcome: '+12% actual increase',
    accuracy: 80.0,
    status: 'close',
    confidence: 0.82,
    timeframe: 'Q2 2024',
    category: 'Operations'
  },
  {
    id: 5,
    date: '2024-03-01',
    type: 'Employee Attrition',
    prediction: '3 employees in Sales will leave in Q2',
    actualOutcome: '2 employees left',
    accuracy: 66.7,
    status: 'partial',
    confidence: 0.74,
    timeframe: 'Q2 2024',
    category: 'HR'
  },
  {
    id: 6,
    date: '2024-03-05',
    type: 'Deal Closure',
    prediction: 'Enterprise deal XYZ will close by March 31',
    actualOutcome: 'Deal postponed to April 15',
    accuracy: 0,
    status: 'incorrect',
    confidence: 0.68,
    timeframe: 'March 2024',
    category: 'Sales'
  }
];

const accuracyTrend = [
  { month: 'Oct', accuracy: 78.2, predictions: 42 },
  { month: 'Nov', accuracy: 81.5, predictions: 56 },
  { month: 'Dec', accuracy: 84.3, predictions: 63 },
  { month: 'Jan', accuracy: 87.1, predictions: 71 },
  { month: 'Feb', accuracy: 89.4, predictions: 78 },
  { month: 'Mar', accuracy: 91.2, predictions: 84 },
];

const categoryAccuracy = [
  { category: 'Finance', accuracy: 94 },
  { category: 'Customer', accuracy: 91 },
  { category: 'Market', accuracy: 87 },
  { category: 'Operations', accuracy: 85 },
  { category: 'HR', accuracy: 79 },
  { category: 'Sales', accuracy: 73 },
];

export const TruthLedger = () => {
  const [filter, setFilter] = useState('all');

  const filteredPredictions = filter === 'all' 
    ? predictions 
    : predictions.filter(p => p.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'correct': return 'default';
      case 'close': return 'secondary';
      case 'partial': return 'outline';
      case 'incorrect': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'incorrect': return <XCircle className="w-5 h-5 text-destructive" />;
      default: return <Target className="w-5 h-5 text-warning" />;
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-success';
    if (accuracy >= 70) return 'text-primary';
    if (accuracy >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const overallAccuracy = predictions.reduce((sum, p) => sum + p.accuracy, 0) / predictions.length;
  const correctPredictions = predictions.filter(p => p.status === 'correct').length;
  const totalPredictions = predictions.length;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Accuracy</p>
                <p className="text-2xl font-bold">{overallAccuracy.toFixed(1)}%</p>
              </div>
              <Award className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Predictions</p>
                <p className="text-2xl font-bold">{totalPredictions}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Correct</p>
                <p className="text-2xl font-bold">{correctPredictions}/{totalPredictions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Improving</p>
                <p className="text-2xl font-bold">+13%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prediction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <span>Prediction vs Reality Tracker</span>
              </CardTitle>
              <CardDescription>Self-learning accuracy feedback loop</CardDescription>
            </div>
            <div className="flex gap-2">
              {['all', 'correct', 'close', 'partial', 'incorrect'].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPredictions.map((pred) => (
              <div key={pred.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1">
                    {getStatusIcon(pred.status)}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{pred.type}</h3>
                        <Badge variant={getStatusBadge(pred.status) as any} className="capitalize">
                          {pred.status}
                        </Badge>
                        <Badge variant="outline">{pred.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{pred.date} • {pred.timeframe}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className={`text-xl font-bold ${getAccuracyColor(pred.accuracy)}`}>
                      {pred.accuracy.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-1">Prediction</p>
                    <p className="text-sm font-medium">{pred.prediction}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border">
                    <p className="text-xs text-muted-foreground mb-1">Actual Outcome</p>
                    <p className="text-sm font-medium">{pred.actualOutcome}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Confidence: <span className="font-semibold">{(pred.confidence * 100).toFixed(0)}%</span>
                  </span>
                  <Button size="sm" variant="outline">
                    View Analysis
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accuracy Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Accuracy Improvement Over Time</CardTitle>
          <CardDescription>Self-learning progress trajectory</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={accuracyTrend}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis domain={[70, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--success))" strokeWidth={3} name="Accuracy %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Accuracy by Category</CardTitle>
          <CardDescription>Prediction performance across business areas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryAccuracy}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="accuracy" fill="hsl(var(--primary))" name="Accuracy %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
