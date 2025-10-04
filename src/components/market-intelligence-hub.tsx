import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Bell, ChevronRight, Target, Zap, Shield, DollarSign } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

// Real-time market data simulation
const stockData = [
  { symbol: "YOUR_CO", name: "Your Company", price: 142.50, change: -2.3, prediction: -3.5, sector: "Technology" },
  { symbol: "COMP_A", name: "Competitor A", price: 89.20, change: 1.2, prediction: 2.1, sector: "Technology" },
  { symbol: "COMP_B", name: "Competitor B", price: 156.80, change: -0.8, prediction: -1.2, sector: "Technology" },
  { symbol: "^TECH", name: "Tech Sector Index", price: 12450, change: -1.5, prediction: -2.8, sector: "Index" }
];

const newsIntelligence = [
  {
    id: 1,
    source: "WSJ",
    headline: "Fed Signals Further Interest Rate Hikes Through Q3",
    timestamp: "2 hours ago",
    impact: -7.2,
    confidence: 87,
    sector: "Technology",
    url: "https://www.wsj.com/economy/central-banking/federal-reserve-interest-rates",
    aiInsight: "Interest-sensitive sectors in your portfolio may decline 7-10% over next quarter. Debt-heavy assets require immediate review.",
    predictedImpact: {
      stock: -3.5,
      valuation: -5.2,
      revenue: -2.1,
      margin: -1.8
    },
    actionItems: [
      "Review debt structure and refinancing options",
      "Consider hedging with interest rate derivatives",
      "Delay non-critical capital expenditures"
    ]
  },
  {
    id: 2,
    source: "Forbes",
    headline: "Supply Chain Disruptions Hit APAC Manufacturing",
    timestamp: "4 hours ago",
    impact: -4.5,
    confidence: 92,
    sector: "Manufacturing",
    url: "https://www.forbes.com/supply-chain-technology/",
    aiInsight: "Your import dependency on APAC regions creates 15% exposure risk. Production delays projected at 12-18 days.",
    predictedImpact: {
      stock: -2.1,
      valuation: -3.8,
      revenue: -4.5,
      margin: -2.3
    },
    actionItems: [
      "Activate alternative supplier networks",
      "Increase inventory buffer by 20%",
      "Communicate timeline adjustments to clients"
    ]
  },
  {
    id: 3,
    source: "Bloomberg",
    headline: "Tech Sector M&A Activity Surges 34% YoY",
    timestamp: "6 hours ago",
    impact: 5.8,
    confidence: 78,
    sector: "Technology",
    url: "https://www.bloomberg.com/technology",
    aiInsight: "Increased consolidation may pressure market share. Competitor acquisitions could erode your position by 1.2% next quarter.",
    predictedImpact: {
      stock: 1.5,
      valuation: 2.8,
      revenue: -1.2,
      margin: -0.5
    },
    actionItems: [
      "Evaluate strategic acquisition targets",
      "Strengthen competitive moat in core segments",
      "Accelerate product differentiation initiatives"
    ]
  }
];

const projectionData = [
  { month: "Now", conservative: 142.5, likely: 142.5, optimistic: 142.5, actual: 142.5 },
  { month: "M+1", conservative: 138.2, likely: 141.0, optimistic: 145.8, actual: null },
  { month: "M+2", conservative: 135.5, likely: 139.8, optimistic: 148.2, actual: null },
  { month: "M+3", conservative: 133.8, likely: 138.5, optimistic: 151.5, actual: null },
  { month: "M+6", conservative: 130.2, likely: 142.0, optimistic: 162.8, actual: null },
  { month: "M+12", conservative: 128.5, likely: 148.5, optimistic: 178.2, actual: null }
];

const sectorImpactData = [
  { sector: "Your Stock", event: "Fed Rate Hike", impact: -3.5, confidence: 87, severity: "high" },
  { sector: "Valuation", event: "Supply Chain", impact: -5.2, confidence: 92, severity: "critical" },
  { sector: "Revenue", event: "M&A Activity", impact: -1.2, confidence: 78, severity: "moderate" },
  { sector: "Market Share", event: "Competitor Move", impact: -2.1, confidence: 85, severity: "high" },
  { sector: "Profit Margin", event: "Input Costs", impact: -1.8, confidence: 81, severity: "moderate" },
  { sector: "Growth Rate", event: "Sector Trends", impact: 2.3, confidence: 74, severity: "low" }
];

const scenarioOptions = [
  { id: "inflation", label: "Inflation stays at 6% for 6 months", active: false },
  { id: "oil", label: "Oil prices rise $20/barrel", active: false },
  { id: "recession", label: "Mild recession (2% GDP contraction)", active: false },
  { id: "rates", label: "Additional 2% rate increase", active: false }
];

export const MarketIntelligenceHub = () => {
  const [selectedNews, setSelectedNews] = useState(newsIntelligence[0]);
  const [activeScenarios, setActiveScenarios] = useState<string[]>([]);
  const [liveNews, setLiveNews] = useState(newsIntelligence);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate live news updates every 5 minutes
  useEffect(() => {
    const updateNews = () => {
      // Update timestamps and slight variations in data
      setLiveNews(prev => prev.map(news => ({
        ...news,
        timestamp: getRelativeTime(news.id),
        impact: news.impact + (Math.random() - 0.5) * 0.5,
        confidence: Math.min(99, Math.max(70, news.confidence + (Math.random() - 0.5) * 2))
      })));
      setLastUpdate(new Date());
    };

    const interval = setInterval(updateNews, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const getRelativeTime = (id: number) => {
    const hours = id * 2;
    return `${hours} hours ago`;
  };

  const handleNewsClick = (news: typeof newsIntelligence[0], event: React.MouseEvent) => {
    // Only open URL if clicking on the card itself, not when selecting for detail view
    if ((event.target as HTMLElement).closest('.news-card-content')) {
      return;
    }
    window.open(news.url, '_blank', 'noopener,noreferrer');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-500";
      case "high": return "text-orange-500";
      case "moderate": return "text-yellow-500";
      default: return "text-blue-500";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/10 border-red-500/20";
      case "high": return "bg-orange-500/10 border-orange-500/20";
      case "moderate": return "bg-yellow-500/10 border-yellow-500/20";
      default: return "bg-blue-500/10 border-blue-500/20";
    }
  };

  const toggleScenario = (scenarioId: string) => {
    setActiveScenarios(prev => 
      prev.includes(scenarioId) 
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Live Intelligence Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Overview */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Live Market Feed</CardTitle>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse mr-2" />
                Live
              </Badge>
            </div>
            <CardDescription>Real-time stock tracking & predictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stockData.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div>
                  <div className="font-semibold text-foreground">{stock.symbol}</div>
                  <div className="text-sm text-muted-foreground">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-semibold">${stock.price.toFixed(2)}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={stock.change >= 0 ? "text-success" : "text-destructive"}>
                      {stock.change >= 0 ? <TrendingUp className="h-3 w-3 inline" /> : <TrendingDown className="h-3 w-3 inline" />}
                      {stock.change.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className={stock.prediction >= 0 ? "text-success/70" : "text-destructive/70"}>
                      {stock.prediction >= 0 ? "+" : ""}{stock.prediction.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* News Intelligence */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">News Intelligence</CardTitle>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>AI-interpreted business insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {liveNews.map((news) => (
              <div 
                key={news.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md group ${
                  selectedNews.id === news.id 
                    ? "bg-primary/5 border-primary/30" 
                    : "bg-muted/20 border-border/30 hover:bg-muted/40"
                }`}
              >
                <div 
                  className="news-card-content"
                  onClick={() => setSelectedNews(news)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">{news.source}</Badge>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={news.impact >= 0 ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {news.impact >= 0 ? "+" : ""}{news.impact.toFixed(1)}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">{Math.round(news.confidence)}% conf.</span>
                    </div>
                  </div>
                  <div className="font-medium text-sm line-clamp-2 mb-1">{news.headline}</div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{news.timestamp}</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(news.url, '_blank', 'noopener,noreferrer');
                  }}
                >
                  Read Full Article →
                </Button>
              </div>
            ))}
            <div className="text-xs text-muted-foreground text-center pt-2">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="impact" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="impact" className="space-y-6">
          {/* Selected News Detail */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{selectedNews.source}</Badge>
                    <span className="text-sm text-muted-foreground">{selectedNews.timestamp}</span>
                  </div>
                  <CardTitle className="text-xl mb-2">{selectedNews.headline}</CardTitle>
                  <CardDescription className="text-base">{selectedNews.aiInsight}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Stock Impact</span>
                  </div>
                  <div className="text-2xl font-bold text-destructive">
                    {selectedNews.predictedImpact.stock >= 0 ? "+" : ""}{selectedNews.predictedImpact.stock}%
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Valuation</span>
                  </div>
                  <div className="text-2xl font-bold text-destructive">
                    {selectedNews.predictedImpact.valuation >= 0 ? "+" : ""}{selectedNews.predictedImpact.valuation}%
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Revenue</span>
                  </div>
                  <div className="text-2xl font-bold text-destructive">
                    {selectedNews.predictedImpact.revenue >= 0 ? "+" : ""}{selectedNews.predictedImpact.revenue}%
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Margin</span>
                  </div>
                  <div className="text-2xl font-bold text-destructive">
                    {selectedNews.predictedImpact.margin >= 0 ? "+" : ""}{selectedNews.predictedImpact.margin}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sector Impact Heatmap */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Sector Impact Heatmap</CardTitle>
              <CardDescription>Event-driven predictions across key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sectorImpactData.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${getSeverityBg(item.severity)} transition-all hover:shadow-md`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-foreground">{item.sector}</div>
                        <div className="text-sm text-muted-foreground">{item.event}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${item.impact >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {item.impact >= 0 ? "+" : ""}{item.impact}%
                        </div>
                        <div className="text-xs text-muted-foreground">{item.confidence}% confidence</div>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                      <div 
                        className={`h-full ${item.impact >= 0 ? 'bg-success' : 'bg-destructive'}`}
                        style={{ width: `${Math.abs(item.impact) * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Stock Price Projections</CardTitle>
              <CardDescription>12-month outlook with confidence bands</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="optimistic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="conservative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[120, 180]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="optimistic" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#optimistic)" />
                  <Area type="monotone" dataKey="conservative" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#conservative)" />
                  <Line type="monotone" dataKey="likely" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))' }} />
                  <Line type="monotone" dataKey="actual" stroke="hsl(var(--foreground))" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Scenario Simulator</CardTitle>
              <CardDescription>Test multiple economic conditions simultaneously</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scenarioOptions.map((scenario) => (
                <div 
                  key={scenario.id}
                  onClick={() => toggleScenario(scenario.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    activeScenarios.includes(scenario.id)
                      ? "bg-primary/10 border-primary/50 shadow-md"
                      : "bg-muted/20 border-border/30 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{scenario.label}</span>
                    <Badge variant={activeScenarios.includes(scenario.id) ? "default" : "outline"}>
                      {activeScenarios.includes(scenario.id) ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {activeScenarios.length > 0 && (
                <div className="mt-6 p-6 rounded-lg bg-muted/30 border border-border/50">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Combined Impact Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Stock Price Impact</div>
                      <div className="text-3xl font-bold text-destructive">-{(activeScenarios.length * 2.3).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Revenue Impact</div>
                      <div className="text-3xl font-bold text-destructive">-{(activeScenarios.length * 1.8).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>AI-Recommended Actions</CardTitle>
              <CardDescription>Based on {selectedNews.headline}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedNews.actionItems.map((action, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
                  <div className="mt-1">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-2">{action}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default">Execute</Button>
                      <Button size="sm" variant="outline">Learn More</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
