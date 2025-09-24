import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, TrendingUp, AlertTriangle, CheckCircle, Clock, Users, Brain, FileText } from 'lucide-react';

interface DecisionRoomProps {
  decisionId?: string;
}

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  vote?: 'approve' | 'reject' | 'abstain';
  comment?: string;
}

interface AIInsight {
  perspective: 'financial' | 'legal' | 'operational' | 'strategic';
  confidence: number;
  summary: string;
  risks: string[];
  opportunities: string[];
}

const DecisionRoom: React.FC<DecisionRoomProps> = ({ decisionId = "series-a-funding" }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userVote, setUserVote] = useState<'approve' | 'reject' | 'abstain' | null>(null);

  const stakeholders: Stakeholder[] = [
    { id: '1', name: 'Sarah Chen', role: 'CEO', vote: 'approve', comment: 'Strong growth potential' },
    { id: '2', name: 'Marcus Johnson', role: 'CFO', vote: 'approve', comment: 'Financial metrics look solid' },
    { id: '3', name: 'Lisa Park', role: 'Head of Legal', vote: 'abstain', comment: 'Need more due diligence time' },
    { id: '4', name: 'David Kumar', role: 'CTO', vote: 'approve' },
    { id: '5', name: 'Emily Rodriguez', role: 'Board Member' }, // No vote yet
  ];

  const aiInsights: AIInsight[] = [
    {
      perspective: 'financial',
      confidence: 87,
      summary: 'Revenue projections align with market conditions. Cash runway extends to 18 months.',
      risks: ['Market saturation risk', 'Customer acquisition cost increasing'],
      opportunities: ['Expansion into EU market', 'Product line diversification']
    },
    {
      perspective: 'legal',
      confidence: 92,
      summary: 'Standard terms with minor red flags. IP protection adequate.',
      risks: ['Liquidation preference clause', 'Board composition changes'],
      opportunities: ['Improved governance structure', 'Enhanced compliance framework']
    },
    {
      perspective: 'operational',
      confidence: 78,
      summary: 'Team capacity sufficient for growth. Systems need scaling preparation.',
      risks: ['Hiring challenges in key roles', 'Infrastructure scaling costs'],
      opportunities: ['Process automation gains', 'Team specialization benefits']
    }
  ];

  const consensusScore = Math.round((stakeholders.filter(s => s.vote === 'approve').length / stakeholders.filter(s => s.vote).length) * 100);

  const getPerspectiveIcon = (perspective: string) => {
    switch (perspective) {
      case 'financial': return <TrendingUp className="w-4 h-4" />;
      case 'legal': return <FileText className="w-4 h-4" />;
      case 'operational': return <Users className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Series A Funding Decision</CardTitle>
              <CardDescription>$5M Series A Round - Acme Ventures</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10">
                <Clock className="w-3 h-3 mr-1" />
                3 days left
              </Badge>
              <Badge variant={consensusScore >= 70 ? "default" : "secondary"}>
                {consensusScore}% Consensus
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Analysis</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="decision-tree">Decision Tree</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Funding Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">$5.0M</div>
                <p className="text-xs text-muted-foreground">Series A Round</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Valuation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$20M</div>
                <p className="text-xs text-muted-foreground">Pre-money</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Runway Extension</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">18 months</div>
                <p className="text-xs text-muted-foreground">Current burn rate</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Key Discussion Points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Strong Market Position</p>
                  <p className="text-sm text-muted-foreground">40% YoY growth, expanding customer base</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">Board Composition Changes</p>
                  <p className="text-sm text-muted-foreground">Investor gets 2 board seats, potential governance impact</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Growth Acceleration</p>
                  <p className="text-sm text-muted-foreground">Funding enables EU expansion and product development</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          {aiInsights.map((insight, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 capitalize">
                  {getPerspectiveIcon(insight.perspective)}
                  {insight.perspective} Analysis
                  <Badge variant="outline" className="ml-auto">
                    {insight.confidence}% Confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{insight.summary}</p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Risks
                    </h4>
                    <ul className="space-y-1">
                      {insight.risks.map((risk, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {risk}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Opportunities
                    </h4>
                    <ul className="space-y-1">
                      {insight.opportunities.map((opp, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {opp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="stakeholders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stakeholder Votes</CardTitle>
              <CardDescription>Current consensus: {consensusScore}%</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={consensusScore} className="mb-4" />
              
              <div className="space-y-3">
                {stakeholders.map((stakeholder) => (
                  <div key={stakeholder.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={stakeholder.avatar} />
                        <AvatarFallback>{stakeholder.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{stakeholder.name}</p>
                        <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {stakeholder.vote ? (
                        <Badge 
                          variant={
                            stakeholder.vote === 'approve' ? 'default' : 
                            stakeholder.vote === 'reject' ? 'destructive' : 'outline'
                          }
                        >
                          {stakeholder.vote}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                      {stakeholder.comment && (
                        <div className="text-xs text-muted-foreground max-w-xs truncate">
                          "{stakeholder.comment}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cast Your Vote</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                variant={userVote === 'approve' ? 'default' : 'outline'}
                onClick={() => setUserVote('approve')}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button 
                variant={userVote === 'reject' ? 'destructive' : 'outline'}
                onClick={() => setUserVote('reject')}
                className="flex-1"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button 
                variant={userVote === 'abstain' ? 'secondary' : 'outline'}
                onClick={() => setUserVote('abstain')}
                className="flex-1"
              >
                Abstain
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decision-tree" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Decision Framework</CardTitle>
              <CardDescription>Structured analysis of the funding decision</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
                  <h3 className="font-medium mb-2">If We Accept Funding:</h3>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-green-600 mb-1">Pros:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• 18-month runway extension</li>
                        <li>• EU market expansion possible</li>
                        <li>• Accelerated product development</li>
                        <li>• Strategic investor expertise</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-red-600 mb-1">Cons:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Dilution of existing shareholders</li>
                        <li>• Board control changes</li>
                        <li>• Higher growth expectations</li>
                        <li>• Liquidation preferences</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-950">
                  <h3 className="font-medium mb-2">If We Reject Funding:</h3>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-green-600 mb-1">Pros:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Maintain full control</li>
                        <li>• No dilution</li>
                        <li>• Flexible strategic direction</li>
                        <li>• Focus on profitability</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-red-600 mb-1">Cons:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Limited growth capital</li>
                        <li>• 8-month runway remaining</li>
                        <li>• Slower market expansion</li>
                        <li>• Risk of missing market opportunity</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Ready to finalize decision?</p>
              <p className="text-sm text-muted-foreground">Export consensus report for board records</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DecisionRoom;