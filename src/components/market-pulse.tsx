import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Globe, Brain, AlertCircle, Newspaper, Mail, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const marketSentimentData = [
  { date: '2024-01-01', sentiment: 0.65, market: 4200, volume: 85 },
  { date: '2024-01-15', sentiment: 0.72, market: 4350, volume: 92 },
  { date: '2024-02-01', sentiment: 0.58, market: 4180, volume: 78 },
  { date: '2024-02-15', sentiment: 0.45, market: 3950, volume: 95 },
  { date: '2024-03-01', sentiment: 0.68, market: 4280, volume: 88 },
  { date: '2024-03-15', sentiment: 0.78, market: 4450, volume: 102 },
];

const newsSignals = [
  {
    source: 'Financial Times',
    title: 'Tech Sector Shows Strong Q4 Performance',
    sentiment: 'positive',
    impact: 'high',
    relevance: 95,
    timestamp: '2 hours ago'
  },
  {
    source: 'Reuters',
    title: 'Federal Reserve Hints at Rate Stabilization',
    sentiment: 'neutral',
    impact: 'medium',
    relevance: 88,
    timestamp: '4 hours ago'
  },
  {
    source: 'Bloomberg',
    title: 'Energy Sector Faces Headwinds Amid Policy Changes',
    sentiment: 'negative',
    impact: 'high',
    relevance: 82,
    timestamp: '6 hours ago'
  },
  {
    source: 'MarketWatch',
    title: 'Consumer Confidence Index Rises to 18-Month High',
    sentiment: 'positive',
    impact: 'medium',
    relevance: 79,
    timestamp: '8 hours ago'
  }
];

const sectorAnalysis = [
  { sector: 'Technology', sentiment: 0.82, trend: 'up', change: 5.2, signals: 23 },
  { sector: 'Healthcare', sentiment: 0.65, trend: 'up', change: 2.1, signals: 18 },
  { sector: 'Financial', sentiment: 0.45, trend: 'down', change: -1.8, signals: 15 },
  { sector: 'Energy', sentiment: 0.38, trend: 'down', change: -3.4, signals: 12 },
  { sector: 'Consumer', sentiment: 0.71, trend: 'up', change: 3.7, signals: 20 },
];

const predictiveTrends = [
  {
    metric: 'Market Volatility',
    prediction: 'Expected to decrease by 15% over next 30 days',
    confidence: 78,
    recommendation: 'Consider increasing equity allocation'
  },
  {
    metric: 'Tech Sector Performance',
    prediction: 'Projected 8-12% growth in Q2',
    confidence: 85,
    recommendation: 'Maintain overweight position'
  },
  {
    metric: 'Interest Rate Impact',
    prediction: 'Minimal rate changes expected',
    confidence: 72,
    recommendation: 'Focus on growth over value stocks'
  }
];

export const MarketPulse = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30D');
  
  const currentSentiment = 0.68;
  const sentimentTrend = 'positive';
  const marketHealth = 'Strong';

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.6) return 'text-success';
    if (sentiment > 0.4) return 'text-warning';
    return 'text-destructive';
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Badge className="bg-success/10 text-success border-success/20">Positive</Badge>;
      case 'negative': return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Negative</Badge>;
      default: return <Badge className="bg-muted/10 text-muted-foreground border-muted/20">Neutral</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Market Sentiment</p>
                <p className={`text-2xl font-bold ${getSentimentColor(currentSentiment)}`}>
                  {(currentSentiment * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-success">Bullish Trend</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Market Health</p>
                <p className="text-2xl font-bold text-success">{marketHealth}</p>
                <p className="text-sm text-muted-foreground">Above Average</p>
              </div>
              <BarChart3 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">News Signals</p>
                <p className="text-2xl font-bold">{newsSignals.length}</p>
                <p className="text-sm text-accent">Active Monitoring</p>
              </div>
              <Newspaper className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sentiment" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="news">News Signals</TabsTrigger>
          <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Market Sentiment Trends</CardTitle>
                  <CardDescription>AI-analyzed sentiment from news, social media, and market data</CardDescription>
                </div>
                <div className="flex gap-2">
                  {['7D', '30D', '90D', '1Y'].map((period) => (
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
                <AreaChart data={marketSentimentData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="sentiment"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time News Analysis</CardTitle>
              <CardDescription>AI-powered sentiment analysis of market-moving news</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsSignals.map((news, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-accent/5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-muted-foreground">{news.source}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{news.timestamp}</span>
                        </div>
                        <h4 className="font-semibold mb-2">{news.title}</h4>
                        <div className="flex items-center space-x-3">
                          {getSentimentBadge(news.sentiment)}
                          <Badge variant={news.impact === 'high' ? 'destructive' : news.impact === 'medium' ? 'default' : 'secondary'}>
                            {news.impact} impact
                          </Badge>
                          <span className="text-sm text-muted-foreground">Relevance: {news.relevance}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sector Performance Analysis</CardTitle>
              <CardDescription>Real-time sentiment and performance by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectorAnalysis.map((sector, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {sector.trend === 'up' ? 
                          <TrendingUp className="h-5 w-5 text-success" /> : 
                          <TrendingDown className="h-5 w-5 text-destructive" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold">{sector.sector}</p>
                        <p className="text-sm text-muted-foreground">{sector.signals} signals analyzed</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${sector.change > 0 ? 'text-success' : 'text-destructive'}`}>
                          {sector.change > 0 ? '+' : ''}{sector.change}%
                        </span>
                      </div>
                      <div className={`text-sm ${getSentimentColor(sector.sentiment)}`}>
                        Sentiment: {(sector.sentiment * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Market Predictions</CardTitle>
              <CardDescription>Machine learning-powered market forecasts and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveTrends.map((trend, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-primary/5">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold">{trend.metric}</h4>
                      <Badge variant="outline">{trend.confidence}% confidence</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{trend.prediction}</p>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{trend.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Correlation Matrix</CardTitle>
              <CardDescription>AI-detected correlations between assets and market factors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <h4 className="font-semibold text-success mb-2">Strong Positive Correlation</h4>
                  <p className="text-sm">Tech stocks & Consumer sentiment (0.87)</p>
                </div>
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <h4 className="font-semibold text-destructive mb-2">Strong Negative Correlation</h4>
                  <p className="text-sm">Bond prices & Inflation expectations (-0.82)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};