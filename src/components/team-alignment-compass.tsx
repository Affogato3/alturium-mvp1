import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Users, Target, TrendingUp, MessageSquare, Zap } from 'lucide-react';

interface AlignmentMetric {
  department: string;
  priority: string;
  confidence: number;
  lastUpdated: string;
  conflictsWith?: string[];
}

interface AlignmentAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  departments: string[];
  recommendation: string;
}

const TeamAlignmentCompass: React.FC = () => {
  const [overallScore, setOverallScore] = useState(78);
  const [selectedView, setSelectedView] = useState('overview');

  const alignmentMetrics: AlignmentMetric[] = [
    {
      department: 'Product',
      priority: 'User Experience Enhancement',
      confidence: 85,
      lastUpdated: '2 hours ago',
      conflictsWith: ['Engineering']
    },
    {
      department: 'Engineering',
      priority: 'Technical Debt Reduction',
      confidence: 92,
      lastUpdated: '1 hour ago',
      conflictsWith: ['Product', 'Marketing']
    },
    {
      department: 'Marketing',
      priority: 'Lead Generation Growth',
      confidence: 78,
      lastUpdated: '30 minutes ago'
    },
    {
      department: 'Sales',
      priority: 'Q4 Revenue Targets',
      confidence: 88,
      lastUpdated: '45 minutes ago'
    },
    {
      department: 'Finance',
      priority: 'Cost Optimization',
      confidence: 95,
      lastUpdated: '1 hour ago',
      conflictsWith: ['Marketing']
    }
  ];

  const alignmentAlerts: AlignmentAlert[] = [
    {
      id: '1',
      severity: 'high',
      title: 'Product vs Engineering Priority Conflict',
      description: 'Product team prioritizing new features while Engineering focuses on tech debt.',
      departments: ['Product', 'Engineering'],
      recommendation: 'Schedule alignment meeting to balance feature development with technical stability'
    },
    {
      id: '2',
      severity: 'medium',
      title: 'Marketing Budget vs Finance Goals',
      description: 'Marketing expansion plans conflict with cost optimization targets.',
      departments: ['Marketing', 'Finance'],
      recommendation: 'Review ROI targets and adjust marketing spend allocation'
    },
    {
      id: '3',
      severity: 'low',
      title: 'Cross-team Communication Gap',
      description: 'Sales and Product teams have limited visibility into each other\'s priorities.',
      departments: ['Sales', 'Product'],
      recommendation: 'Implement weekly cross-functional standups'
    }
  ];

  const departmentColors = {
    'Product': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Engineering': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Marketing': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Sales': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Finance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOverallScore(prev => {
        const change = (Math.random() - 0.5) * 4; // Random change between -2 and +2
        return Math.max(50, Math.min(100, prev + change));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6" />
                Team Alignment Compass
              </CardTitle>
              <p className="text-muted-foreground">Real-time organizational alignment tracking</p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                {Math.round(overallScore)}%
              </div>
              <p className="text-sm text-muted-foreground">Alignment Score</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alignment Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Week</span>
                    <span className={`font-bold ${getScoreColor(overallScore)}`}>{Math.round(overallScore)}%</span>
                  </div>
                  <Progress value={overallScore} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Week</span>
                    <span className="font-bold text-muted-foreground">74%</span>
                  </div>
                  <Progress value={74} className="h-2 opacity-60" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Month</span>
                    <span className="font-bold text-muted-foreground">69%</span>
                  </div>
                  <Progress value={69} className="h-2 opacity-40" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Schedule Alignment Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Cross-Department Sync
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Review OKRs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="w-4 h-4 mr-2" />
                  Run Alignment Survey
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Misalignment Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alignmentAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                      alert.severity === 'high' ? 'text-red-500' : 
                      alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        <Badge variant={getSeverityColor(alert.severity) as any}>{alert.severity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex gap-1">
                        {alert.departments.map((dept) => (
                          <Badge key={dept} variant="outline" className={departmentColors[dept as keyof typeof departmentColors]}>
                            {dept}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4">
            {alignmentMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={departmentColors[metric.department as keyof typeof departmentColors]}>
                        {metric.department}
                      </Badge>
                      <div>
                        <h3 className="font-medium">{metric.priority}</h3>
                        <p className="text-sm text-muted-foreground">Updated {metric.lastUpdated}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(metric.confidence)}`}>
                        {metric.confidence}%
                      </div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>
                  
                  <Progress value={metric.confidence} className="mb-3" />
                  
                  {metric.conflictsWith && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Conflicts with:</span>
                      <div className="flex gap-1">
                        {metric.conflictsWith.map((dept) => (
                          <Badge key={dept} variant="outline" className="text-xs">
                            {dept}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {alignmentAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        alert.severity === 'high' ? 'text-red-500' : 
                        alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div>
                        <h3 className="font-medium">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        <div className="flex gap-1 mb-3">
                          {alert.departments.map((dept) => (
                            <Badge key={dept} variant="outline" className={departmentColors[dept as keyof typeof departmentColors]}>
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Badge variant={getSeverityColor(alert.severity) as any}>{alert.severity}</Badge>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Recommended Action:</h4>
                    <p className="text-sm">{alert.recommendation}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm">Take Action</Button>
                    <Button size="sm" variant="outline">Dismiss</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamAlignmentCompass;