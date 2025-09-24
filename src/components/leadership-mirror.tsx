import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Users, Brain, Clock, MessageSquare, TrendingUp, TrendingDown, AlertTriangle, Target, Eye } from 'lucide-react';

interface DecisionPattern {
  category: string;
  timeSpent: number;
  decisions: number;
  bias: string;
  color: string;
}

interface BiasAlert {
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface LeadershipMetric {
  name: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  benchmark: number;
}

const LeadershipMirror: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const decisionPatterns: DecisionPattern[] = [
    { category: 'Financial Decisions', timeSpent: 35, decisions: 12, bias: 'Risk Averse', color: '#3B82F6' },
    { category: 'Product Strategy', timeSpent: 25, decisions: 8, bias: 'Innovation Focused', color: '#10B981' },
    { category: 'Team & HR', timeSpent: 20, decisions: 15, bias: 'Consensus Seeking', color: '#F59E0B' },
    { category: 'Operations', timeSpent: 12, decisions: 6, bias: 'Efficiency Driven', color: '#EF4444' },
    { category: 'External Relations', timeSpent: 8, decisions: 4, bias: 'Conservative', color: '#8B5CF6' }
  ];

  const biasAlerts: BiasAlert[] = [
    {
      type: 'Confirmation Bias',
      severity: 'high',
      description: 'Tendency to favor information that confirms pre-existing beliefs in product decisions.',
      recommendation: 'Implement devil\'s advocate sessions and seek contradictory viewpoints.',
      trend: 'increasing'
    },
    {
      type: 'Anchoring Bias',
      severity: 'medium',
      description: 'Heavy reliance on first information received in financial projections.',
      recommendation: 'Use multiple reference points and scenario planning for key financial decisions.',
      trend: 'stable'
    },
    {
      type: 'Availability Heuristic',
      severity: 'low',
      description: 'Overweighting recent events in risk assessment.',
      recommendation: 'Review historical data patterns and long-term trends before major decisions.',
      trend: 'decreasing'
    }
  ];

  const leadershipMetrics: LeadershipMetric[] = [
    { name: 'Decision Quality', score: 78, trend: 'up', change: 5.2, benchmark: 75 },
    { name: 'Speed to Decision', score: 68, trend: 'down', change: -3.1, benchmark: 70 },
    { name: 'Stakeholder Alignment', score: 85, trend: 'up', change: 7.8, benchmark: 80 },
    { name: 'Risk Calibration', score: 72, trend: 'stable', change: 0.5, benchmark: 75 },
    { name: 'Long-term Thinking', score: 69, trend: 'up', change: 4.3, benchmark: 72 }
  ];

  const timeAllocationData = [
    { month: 'Jan', strategic: 40, operational: 35, people: 25 },
    { month: 'Feb', strategic: 38, operational: 37, people: 25 },
    { month: 'Mar', strategic: 35, operational: 40, people: 25 },
    { month: 'Apr', strategic: 42, operational: 33, people: 25 },
    { month: 'May', strategic: 45, operational: 30, people: 25 },
    { month: 'Jun', strategic: 40, operational: 35, people: 25 }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-500';
      case 'decreasing': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Leadership Mirror
              </CardTitle>
              <p className="text-muted-foreground">Reflect on your decision-making patterns and leadership effectiveness</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Eye className="w-3 h-3 mr-1" />
                AI Analysis
              </Badge>
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="decision-patterns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="decision-patterns">Decision Patterns</TabsTrigger>
          <TabsTrigger value="bias-detection">Bias Detection</TabsTrigger>
          <TabsTrigger value="leadership-health">Leadership Health</TabsTrigger>
          <TabsTrigger value="time-allocation">Time Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="decision-patterns" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Decision Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Where you spend your decision-making energy</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={decisionPatterns.map(p => ({ name: p.category, value: p.timeSpent, fill: p.color }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {decisionPatterns.map((entry, index) => (
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
                <CardTitle>Decision Categories</CardTitle>
                <p className="text-sm text-muted-foreground">Breakdown by area and bias patterns</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {decisionPatterns.map((pattern, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{pattern.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{pattern.decisions} decisions</span>
                          <Badge variant="outline" style={{ borderColor: pattern.color, color: pattern.color }}>
                            {pattern.bias}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={pattern.timeSpent} className="h-2" />
                      <p className="text-xs text-muted-foreground">{pattern.timeSpent}% of decision time</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Insights on Decision Patterns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Strengths</h4>
                  <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                    <li>• Strong focus on strategic decisions (40% of time)</li>
                    <li>• Balanced approach to team consensus-building</li>
                    <li>• Consistent decision-making velocity</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Growth Areas</h4>
                  <ul className="text-sm space-y-1 text-yellow-800 dark:text-yellow-200">
                    <li>• Consider delegating more operational decisions</li>
                    <li>• Increase time on external relationship building</li>
                    <li>• Balance risk aversion with innovation needs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bias-detection" className="space-y-4">
          <div className="space-y-4">
            {biasAlerts.map((alert, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        alert.severity === 'high' ? 'text-red-500' : 
                        alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div>
                        <h3 className="font-medium">{alert.type}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(alert.severity) as any}>{alert.severity}</Badge>
                      <span className={`text-xs ${getTrendColor(alert.trend)}`}>
                        {alert.trend}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Recommendation:</h4>
                    <p className="text-sm">{alert.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bias Calibration Exercise</CardTitle>
              <p className="text-sm text-muted-foreground">Regular exercises to improve decision-making accuracy</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Weekly Prediction Accuracy</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={72} className="flex-1" />
                    <span className="text-sm font-medium">72%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Track your prediction accuracy to calibrate confidence levels</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Devil's Advocate Sessions</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This month: 3 sessions</span>
                    <Badge variant="outline">+2 from last month</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Regular challenge sessions to test assumptions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leadership-health" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leadershipMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{metric.name}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{metric.score}</span>
                      <span className={`text-sm ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Benchmark: {metric.benchmark}</span>
                        <span>{metric.score >= metric.benchmark ? 'Above' : 'Below'}</span>
                      </div>
                      <Progress 
                        value={(metric.score / 100) * 100} 
                        className="h-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Leadership Development Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">Strengths to Leverage</h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  High stakeholder alignment score indicates strong communication skills. Consider mentoring other leaders.
                </p>
              </div>
              
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">Focus Areas</h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Decision speed could be improved through better delegation and clearer decision frameworks.
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Development Actions</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Consider executive coaching focused on decision velocity and long-term strategic thinking.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time-allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leadership Time Allocation Trends</CardTitle>
              <p className="text-sm text-muted-foreground">How your time distribution has evolved</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeAllocationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="strategic" stroke="#3B82F6" strokeWidth={2} name="Strategic" />
                  <Line type="monotone" dataKey="operational" stroke="#EF4444" strokeWidth={2} name="Operational" />
                  <Line type="monotone" dataKey="people" stroke="#10B981" strokeWidth={2} name="People" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Strategic Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">40%</div>
                <p className="text-sm text-muted-foreground">of leadership time</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+5% vs last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Operational</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">35%</div>
                <p className="text-sm text-muted-foreground">of leadership time</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">-5% vs last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">People Development</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">25%</div>
                <p className="text-sm text-muted-foreground">of leadership time</p>
                <div className="flex items-center gap-1 mt-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Stable</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Optimization Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Ideal Distribution</h4>
                  <p className="text-sm text-muted-foreground mb-2">Based on your role and company stage</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Strategic: 45%</span>
                      <span className="text-green-600">+5% recommended</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Operational: 30%</span>
                      <span className="text-blue-600">-5% recommended</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>People: 25%</span>
                      <span className="text-gray-600">Optimal</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadershipMirror;