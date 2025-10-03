import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Pause,
  Bell,
  Star,
  Download,
  Calendar,
  Grid3x3,
  List,
  LineChart as LineChartIcon,
  Plus,
  Trash2
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExportDialog } from "@/components/export-dialog";
import { useReportExport } from "@/hooks/use-report-export";

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

// Historical candlestick data
const historicalData = [
  { date: '2025-01', open: 170.50, high: 178.20, low: 168.30, close: 176.45, volume: 45.2 },
  { date: '2025-02', open: 176.45, high: 182.10, low: 174.20, close: 180.23, volume: 52.1 },
  { date: '2025-03', open: 180.23, high: 185.50, low: 177.80, close: 178.45, volume: 48.7 },
  { date: '2025-04', open: 178.45, high: 183.20, low: 175.90, close: 181.67, volume: 50.3 },
  { date: '2025-05', open: 181.67, high: 188.40, low: 179.50, close: 185.89, volume: 56.8 },
  { date: '2025-06', open: 185.89, high: 192.30, low: 183.20, close: 189.12, volume: 62.4 },
];

// Predictive indicators
const predictions = [
  {
    timeframe: '1 Week',
    predicted: 182.45,
    confidence: 78,
    sentiment: 'Bullish',
    factors: ['Strong earnings forecast', 'Positive market sentiment', 'Increased institutional buying']
  },
  {
    timeframe: '1 Month',
    predicted: 195.20,
    confidence: 72,
    sentiment: 'Bullish',
    factors: ['Product launch expected', 'Sector momentum', 'Technical breakout pattern']
  },
  {
    timeframe: '3 Months',
    predicted: 208.75,
    confidence: 65,
    sentiment: 'Bullish',
    factors: ['Market expansion', 'Revenue growth projection', 'Competitive advantages']
  },
];

// Sector performance data
const sectorData = [
  { sector: 'Technology', performance: 8.4, correlation: 0.92, trend: 'up', leaders: ['AAPL', 'MSFT', 'NVDA'] },
  { sector: 'Financial', performance: 3.2, correlation: 0.67, trend: 'up', leaders: ['JPM', 'BAC', 'GS'] },
  { sector: 'Consumer', performance: -1.8, correlation: 0.45, trend: 'down', leaders: ['AMZN', 'WMT', 'HD'] },
  { sector: 'Healthcare', performance: 2.1, correlation: 0.34, trend: 'up', leaders: ['JNJ', 'UNH', 'PFE'] },
  { sector: 'Energy', performance: 5.7, correlation: 0.58, trend: 'up', leaders: ['XOM', 'CVX', 'COP'] },
];

export const StockMatrix = () => {
  const [stocks, setStocks] = useState(initialStocks);
  const [isLive, setIsLive] = useState(true);
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [layoutPreference, setLayoutPreference] = useState<'grid' | 'table' | 'chart'>('grid');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { toast } = useToast();
  const { exportReport, isGenerating } = useReportExport();

  // Load user data
  useEffect(() => {
    loadWatchlist();
    loadAlerts();
    loadPreferences();
  }, []);

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

  const loadWatchlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('watchlists')
      .select('symbol')
      .eq('user_id', user.id);

    if (data) {
      setWatchlist(data.map(w => w.symbol));
    }
  };

  const loadAlerts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('stock_alerts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (data) {
      setAlerts(data);
    }
  };

  const loadPreferences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_preferences')
      .select('layout_preference')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setLayoutPreference(data.layout_preference as 'grid' | 'table' | 'chart');
    }
  };

  const toggleWatchlist = async (symbol: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please sign in to use watchlists", variant: "destructive" });
      return;
    }

    if (watchlist.includes(symbol)) {
      await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', user.id)
        .eq('symbol', symbol);
      setWatchlist(prev => prev.filter(s => s !== symbol));
      toast({ title: "Removed from watchlist" });
    } else {
      await supabase
        .from('watchlists')
        .insert({ user_id: user.id, symbol, name: stocks.find(s => s.symbol === symbol)?.name || symbol });
      setWatchlist(prev => [...prev, symbol]);
      toast({ title: "Added to watchlist" });
    }
  };

  const createAlert = async (alertData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please sign in to create alerts", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from('stock_alerts')
      .insert({ ...alertData, user_id: user.id });

    if (!error) {
      loadAlerts();
      toast({ title: "Alert created successfully" });
      setShowAlertDialog(false);
    }
  };

  const deleteAlert = async (alertId: string) => {
    await supabase
      .from('stock_alerts')
      .delete()
      .eq('id', alertId);
    
    loadAlerts();
    toast({ title: "Alert deleted" });
  };

  const updateLayoutPreference = async (layout: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setLayoutPreference(layout as 'grid' | 'table' | 'chart');
    
    await supabase
      .from('user_preferences')
      .upsert({ user_id: user.id, layout_preference: layout });
  };

  const handleExport = async (format: 'pdf' | 'word') => {
    const reportTitle = `Stock Matrix Analysis - ${selectedStock.symbol}`;
    const reportData = {
      selectedStock,
      marketEvents,
      competitorStocks,
      scenarios,
      investorBehavior,
      strategicRecommendations,
      predictions,
      sectorData,
      historicalData
    };
    const context = 'Comprehensive stock market analysis including live data, historical trends, competitor analysis, and AI-driven predictions';

    await exportReport(reportTitle, reportData, context, format);
  };

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
          <div className="flex items-center gap-2 border rounded-lg p-1">
            <Button
              variant={layoutPreference === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => updateLayoutPreference('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={layoutPreference === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => updateLayoutPreference('table')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={layoutPreference === 'chart' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => updateLayoutPreference('chart')}
            >
              <LineChartIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportDialog(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
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
          {layoutPreference === 'grid' && (
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
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(stock.symbol);
                        }}
                      >
                        <Star className={`h-3 w-3 ${watchlist.includes(stock.symbol) ? 'fill-primary text-primary' : ''}`} />
                      </Button>
                      {stock.changePercent > 0 ? 
                        <TrendingUp className="h-4 w-4 text-success" /> : 
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      }
                    </div>
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
          )}
          {layoutPreference === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Symbol</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Change</th>
                    <th className="text-right p-2">%Change</th>
                    <th className="text-right p-2">Volume</th>
                    <th className="text-center p-2">Watch</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => (
                    <tr key={stock.symbol} className="border-b hover:bg-accent/50 cursor-pointer" onClick={() => setSelectedStock(stock)}>
                      <td className="p-2 font-bold">{stock.symbol}</td>
                      <td className="p-2">{stock.name}</td>
                      <td className="p-2 text-right">${stock.price.toFixed(2)}</td>
                      <td className={`p-2 text-right ${getChangeColor(stock.change)}`}>
                        {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
                      </td>
                      <td className={`p-2 text-right ${getChangeColor(stock.changePercent)}`}>
                        {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </td>
                      <td className="p-2 text-right">{stock.volume}</td>
                      <td className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(stock.symbol);
                          }}
                        >
                          <Star className={`h-3 w-3 ${watchlist.includes(stock.symbol) ? 'fill-primary text-primary' : ''}`} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {layoutPreference === 'chart' && (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={stocks}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="symbol" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="price" fill="hsl(var(--primary))" fillOpacity={0.6} />
                <Line type="monotone" dataKey="changePercent" stroke="hsl(var(--success))" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-8 lg:grid-cols-8">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="historical">Historical</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="investors">Investors</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
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

        {/* Historical Analysis */}
        <TabsContent value="historical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Historical Price Analysis
              </CardTitle>
              <CardDescription>Candlestick patterns and volume trends for {selectedStock.symbol}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="price" orientation="left" />
                  <YAxis yAxisId="volume" orientation="right" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar yAxisId="volume" dataKey="volume" fill="hsl(var(--muted))" fillOpacity={0.3} />
                  <Line yAxisId="price" type="monotone" dataKey="high" stroke="hsl(var(--success))" strokeWidth={2} />
                  <Line yAxisId="price" type="monotone" dataKey="low" stroke="hsl(var(--destructive))" strokeWidth={2} />
                  <Line yAxisId="price" type="monotone" dataKey="close" stroke="hsl(var(--primary))" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-lg border bg-card">
                  <p className="text-sm text-muted-foreground mb-1">6M High</p>
                  <p className="text-2xl font-bold">${Math.max(...historicalData.map(d => d.high)).toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <p className="text-sm text-muted-foreground mb-1">6M Low</p>
                  <p className="text-2xl font-bold">${Math.min(...historicalData.map(d => d.low)).toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <p className="text-sm text-muted-foreground mb-1">Avg Volume</p>
                  <p className="text-2xl font-bold">{(historicalData.reduce((sum, d) => sum + d.volume, 0) / historicalData.length).toFixed(1)}M</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <p className="text-sm text-muted-foreground mb-1">6M Return</p>
                  <p className={`text-2xl font-bold ${getChangeColor(historicalData[historicalData.length - 1].close - historicalData[0].open)}`}>
                    +{(((historicalData[historicalData.length - 1].close - historicalData[0].open) / historicalData[0].open) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Indicators */}
        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI-Powered Price Predictions
              </CardTitle>
              <CardDescription>Data-driven forecasts for {selectedStock.symbol}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((pred, index) => (
                  <div key={index} className="p-5 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{pred.timeframe} Forecast</h4>
                        <Badge variant={pred.sentiment === 'Bullish' ? 'default' : 'destructive'}>{pred.sentiment}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">${pred.predicted.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{pred.confidence}% confidence</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Key Factors:</p>
                      <ul className="space-y-1">
                        {pred.factors.map((factor, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sector Analysis */}
        <TabsContent value="sectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sector Performance & Correlations
              </CardTitle>
              <CardDescription>Market trends and sector leadership analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectorData.map((sector, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    sector.trend === 'up' ? 'bg-success/5 border-success/20' : 'bg-destructive/5 border-destructive/20'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{sector.sector}</h4>
                        <div className="flex gap-2 flex-wrap">
                          {sector.leaders.map((leader, i) => (
                            <Badge key={i} variant="outline">{leader}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${sector.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                          {sector.performance > 0 ? '+' : ''}{sector.performance}%
                        </p>
                        <p className="text-sm text-muted-foreground">Correlation: {sector.correlation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Card className="mt-6 bg-muted/20">
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={sectorData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="sector" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="performance" fill="hsl(var(--primary))" />
                      <Line type="monotone" dataKey="correlation" stroke="hsl(var(--success))" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Management */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Custom Price Alerts
                  </CardTitle>
                  <CardDescription>Manage your stock price notifications</CardDescription>
                </div>
                <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Alert
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Alert</DialogTitle>
                      <DialogDescription>Set up a custom alert for stock price movements</DialogDescription>
                    </DialogHeader>
                    <AlertForm onSubmit={createAlert} stocks={stocks} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No alerts configured yet</p>
                  <Button className="mt-4" onClick={() => setShowAlertDialog(true)}>
                    Create Your First Alert
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-4 rounded-lg border bg-card flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold">{alert.symbol}</p>
                          <Badge variant="outline">{alert.alert_type.replace('_', ' ')}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Threshold: ${alert.threshold_value} • {alert.notification_method}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExport}
        isGenerating={isGenerating}
      />
    </div>
  );
};

// Alert Form Component
const AlertForm = ({ onSubmit, stocks }: { onSubmit: (data: any) => void, stocks: any[] }) => {
  const [formData, setFormData] = useState({
    symbol: stocks[0]?.symbol || '',
    alert_type: 'price_above',
    threshold_value: '',
    notification_method: 'in_app'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      threshold_value: parseFloat(formData.threshold_value)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Stock Symbol</Label>
        <Select value={formData.symbol} onValueChange={(value) => setFormData({ ...formData, symbol: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {stocks.map((stock) => (
              <SelectItem key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Alert Type</Label>
        <Select value={formData.alert_type} onValueChange={(value) => setFormData({ ...formData, alert_type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_above">Price Above</SelectItem>
            <SelectItem value="price_below">Price Below</SelectItem>
            <SelectItem value="percent_change">Percent Change</SelectItem>
            <SelectItem value="volume_spike">Volume Spike</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Threshold Value</Label>
        <Input
          type="number"
          step="0.01"
          placeholder="Enter value"
          value={formData.threshold_value}
          onChange={(e) => setFormData({ ...formData, threshold_value: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Notification Method</Label>
        <Select value={formData.notification_method} onValueChange={(value) => setFormData({ ...formData, notification_method: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_app">In-App</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">Create Alert</Button>
    </form>
  );
};