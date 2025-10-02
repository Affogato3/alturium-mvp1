import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  AlertTriangle,
  Target,
  Zap,
  BarChart3,
  Users,
  Lightbulb,
  Play,
  Pause
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock live stock data
const initialStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.45, change: 2.34, changePercent: 1.33, volume: '52.3M', marketCap: '2.81T', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: -1.22, changePercent: -0.32, volume: '23.1M', marketCap: '2.82T', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.23, change: 3.45, changePercent: 2.50, volume: '28.7M', marketCap: '1.77T', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 152.67, change: -2.11, changePercent: -1.36, volume: '45.2M', marketCap: '1.58T', sector: 'Consumer' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: 8.92, changePercent: 3.81, volume: '112.4M', marketCap: '771B', sector: 'Automotive' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.22, change: 12.34, changePercent: 2.56, volume: '38.9M', marketCap: '1.22T', sector: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms', price: 487.33, change: -3.56, changePercent: -0.72, volume: '15.8M', marketCap: '1.23T', sector: 'Technology' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 189.45, change: 1.78, changePercent: 0.95, volume: '8.2M', marketCap: '546B', sector: 'Financial' },
];

const competitorStocks = [
  { symbol: 'COMP-A', name: 'Competitor Alpha', price: 45.23, change: -1.89, changePercent: -4.01, vulnerability: 'high', signal: 'Weak earnings, supply chain issues' },
  { symbol: 'COMP-B', name: 'Competitor Beta', price: 78.91, change: 0.34, changePercent: 0.43, vulnerability: 'medium', signal: 'Neutral position, stable growth' },
  { symbol: 'COMP-C', name: 'Competitor Gamma', price: 123.45, change: -2.34, changePercent: -1.86, vulnerability: 'high', signal: 'CEO departure announced' },
  { symbol: 'COMP-D', name: 'Competitor Delta', price: 89.12, change: 3.45, changePercent: 4.02, vulnerability: 'low', signal: 'Strong product launch' },
];

const marketEvents = [
  {
    event: 'Fed Interest Rate Decision',
    impact: 'Your Stock: +2.4% (3 days)',
    confidence: 78,
    type: 'positive',
    timeline: '3 days',
    details: 'Rate stability signals growth in tech sector'
  },
  {
    event: 'Competitor Product Recall',
    impact: 'Market Share: +3.2%',
    confidence: 85,
    type: 'positive',
    timeline: '1 week',
    details: 'Competitor vulnerability opens market opportunity'
  },
  {
    event: 'Supply Chain Disruption',
    impact: 'Revenue: -1.8%',
    confidence: 65,
    type: 'negative',
    timeline: '2 weeks',
    details: 'Shipping delays may affect Q4 delivery'
  },
];

const scenarios = [
  {
    scenario: 'S&P 500 drops 5%',
    yourStockImpact: -2.1,
    marketShareImpact: +0.8,
    revenueImpact: -1.2,
    confidence: 72,
    timeframe: '30 days'
  },
  {
    scenario: 'Competitor acquires Company X',
    yourStockImpact: -1.5,
    marketShareImpact: -3.4,
    revenueImpact: -2.8,
    confidence: 68,
    timeframe: '90 days'
  },
  {
    scenario: 'New regulation passes',
    yourStockImpact: +3.2,
    marketShareImpact: +1.9,
    revenueImpact: +4.1,
    confidence: 81,
    timeframe: '180 days'
  },
];

const investorBehavior = [
  { type: 'Institutional Buy', entity: 'Vanguard Group', amount: '$124M', impact: 'Bullish signal', confidence: 82 },
  { type: 'Insider Sell', entity: 'Competitor CFO', amount: '$8.2M', impact: 'Weakness indicator', confidence: 76 },
  { type: 'Retail Surge', entity: 'Reddit/WSB', amount: '$45M', impact: 'High volatility risk', confidence: 59 },
  { type: 'Hedge Fund Exit', entity: 'Citadel LLC', amount: '$89M', impact: 'Bearish for competitor', confidence: 71 },
];

const strategicRecommendations = [
  {
    action: 'Accelerate product launch by 2 weeks',
    rationale: 'Competitor weakness + favorable market sentiment',
    projectedROI: '+$12.4M',
    risk: 'Low',
    timeframe: 'Immediate',
    confidence: 84
  },
  {
    action: 'Hedge currency exposure in APAC',
    rationale: 'Predicted 3.2% yuan depreciation',
    projectedROI: 'Save $4.1M',
    risk: 'Medium',
    timeframe: '2 weeks',
    confidence: 76
  },
  {
    action: 'Launch targeted pricing campaign',
    rationale: 'Competitor margin pressure detected',
    projectedROI: '+$8.7M revenue',
    risk: 'Low',
    timeframe: '1 week',
    confidence: 88
  },
  {
    action: 'Increase marketing budget 15%',
    rationale: 'Customer acquisition cost dropped 22%',
    projectedROI: '+18% market share',
    risk: 'Medium',
    timeframe: 'Q4 2024',
    confidence: 79
  },
];

const priceHistory = [
  { time: '09:30', price: 176.20, volume: 8.2 },
  { time: '10:00', price: 177.45, volume: 12.3 },
  { time: '10:30', price: 176.89, volume: 9.7 },
  { time: '11:00', price: 178.12, volume: 15.4 },
  { time: '11:30', price: 178.45, volume: 11.8 },
  { time: '12:00', price: 177.98, volume: 8.9 },
  { time: '12:30', price: 178.34, volume: 10.2 },
];

export const StockMatrix = () => {
  const [stocks, setStocks] = useState(initialStocks);
  const [isLive, setIsLive] = useState(true);
  const [selectedStock, setSelectedStock] = useState(stocks[0]);

  // Simulate live price updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 2,
        change: stock.change + (Math.random() - 0.5) * 0.5,
        changePercent: stock.changePercent + (Math.random() - 0.5) * 0.3,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getVulnerabilityBadge = (level: string) => {
    switch (level) {
      case 'high': return <Badge className="bg-destructive/10 text-destructive border-destructive/20">High Vulnerability</Badge>;
      case 'medium': return <Badge className="bg-warning/10 text-warning border-warning/20">Medium Risk</Badge>;
      case 'low': return <Badge className="bg-success/10 text-success border-success/20">Strong Position</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Matrix</h1>
          <p className="text-muted-foreground">Real-time market intelligence & strategic recommendations</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isLive ? "default" : "outline"} className="gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
            {isLive ? 'LIVE' : 'PAUSED'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isLive ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Live Ticker Wall */}
      <Card className="bg-gradient-to-br from-background to-muted/20 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Market Ticker
          </CardTitle>
          <CardDescription>Real-time prices across your ecosystem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-all"
                onClick={() => setSelectedStock(stock)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-lg">{stock.symbol}</p>
                    <p className="text-xs text-muted-foreground">{stock.sector}</p>
                  </div>
                  {stock.changePercent > 0 ? 
                    <TrendingUp className="h-4 w-4 text-success" /> : 
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  }
                </div>
                <p className="text-2xl font-bold mb-1">${stock.price.toFixed(2)}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className={getChangeColor(stock.change)}>
                    {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
                  </span>
                  <span className={getChangeColor(stock.changePercent)}>
                    {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Vol: {stock.volume}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="events">Events & Impact</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Heatmap</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Simulation</TabsTrigger>
          <TabsTrigger value="investors">Investor Behavior</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        {/* Event-to-Stock Analyzer */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Event-to-Stock Impact Analyzer
              </CardTitle>
              <CardDescription>AI-predicted impact of market events on your stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketEvents.map((event, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    event.type === 'positive' ? 'bg-success/5 border-success/20' : 'bg-destructive/5 border-destructive/20'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{event.event}</h4>
                        <p className="text-sm text-muted-foreground">{event.details}</p>
                      </div>
                      <Badge variant="outline">{event.confidence}% confidence</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-lg font-bold ${event.type === 'positive' ? 'text-success' : 'text-destructive'}`}>
                        {event.impact}
                      </div>
                      <Badge variant="secondary">{event.timeline}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price & Volume Timeline</CardTitle>
              <CardDescription>Intraday movement for {selectedStock.symbol}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
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

        {/* Competitor Stock Heatmap */}
        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Competitor Vulnerability Heatmap
              </CardTitle>
              <CardDescription>Strategic opportunities from competitor weakness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorStocks.map((comp) => (
                  <div key={comp.symbol} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-bold text-lg">{comp.symbol}</p>
                          {getVulnerabilityBadge(comp.vulnerability)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{comp.name}</p>
                        <p className="text-sm">{comp.signal}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${comp.price.toFixed(2)}</p>
                        <p className={`text-sm ${getChangeColor(comp.change)}`}>
                          {comp.change > 0 ? '+' : ''}{comp.change.toFixed(2)} ({comp.changePercent.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                    {comp.vulnerability === 'high' && (
                      <div className="mt-3 p-3 rounded bg-primary/5 border border-primary/20">
                        <p className="text-sm font-medium text-primary flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Strategic Opportunity: Consider aggressive pricing or accelerated product launch
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenario Simulation */}
        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Scenario Simulation & Profit Forecast
              </CardTitle>
              <CardDescription>What-if analysis for strategic planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scenarios.map((scenario, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-lg">{scenario.scenario}</h4>
                      <Badge variant="outline">{scenario.confidence}% confidence</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Your Stock Impact</p>
                        <p className={`text-lg font-bold ${getChangeColor(scenario.yourStockImpact)}`}>
                          {scenario.yourStockImpact > 0 ? '+' : ''}{scenario.yourStockImpact}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Market Share</p>
                        <p className={`text-lg font-bold ${getChangeColor(scenario.marketShareImpact)}`}>
                          {scenario.marketShareImpact > 0 ? '+' : ''}{scenario.marketShareImpact}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Revenue Impact</p>
                        <p className={`text-lg font-bold ${getChangeColor(scenario.revenueImpact)}`}>
                          {scenario.revenueImpact > 0 ? '+' : ''}{scenario.revenueImpact}%
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{scenario.timeframe}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investor Behavior */}
        <TabsContent value="investors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Investor Behavior Mapping
              </CardTitle>
              <CardDescription>Real-time tracking of institutional and retail moves</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investorBehavior.map((investor, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={
                            investor.type.includes('Buy') ? 'default' : 
                            investor.type.includes('Sell') ? 'destructive' : 
                            'secondary'
                          }>
                            {investor.type}
                          </Badge>
                          <span className="text-sm font-medium">{investor.entity}</span>
                        </div>
                        <p className="text-2xl font-bold">{investor.amount}</p>
                      </div>
                      <Badge variant="outline">{investor.confidence}% confidence</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{investor.impact}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Recommendations */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI-Powered Strategic Recommendations
              </CardTitle>
              <CardDescription>Actionable insights with projected ROI and risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategicRecommendations.map((rec, index) => (
                  <div key={index} className="p-5 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/0">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-lg flex-1">{rec.action}</h4>
                      <Badge variant="outline">{rec.confidence}% confidence</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rec.rationale}</p>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Projected ROI</p>
                        <p className="text-lg font-bold text-success">{rec.projectedROI}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                        <Badge variant={rec.risk === 'Low' ? 'default' : 'secondary'}>{rec.risk}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Timeframe</p>
                        <p className="text-sm font-medium">{rec.timeframe}</p>
                      </div>
                    </div>
                    <Button className="w-full">Execute Recommendation</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
