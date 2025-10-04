import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Brain, Search, Activity, DollarSign, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, AreaChart, Area } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stockData = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 185.42,
    change: 2.34,
    changePercent: 1.28,
    volume: 52800000,
    marketCap: 2890000000000,
    sentiment: 0.72,
    aiScore: 8.4,
    prediction: 'bullish',
    category: 'company',
    rivals: ['GOOGL', 'MSFT', 'META']
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 138.21,
    change: -1.87,
    changePercent: -1.33,
    volume: 31200000,
    marketCap: 1740000000000,
    sentiment: 0.58,
    aiScore: 7.2,
    prediction: 'neutral',
    category: 'rival'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 378.91,
    change: 4.12,
    changePercent: 1.10,
    volume: 28300000,
    marketCap: 2810000000000,
    sentiment: 0.68,
    aiScore: 8.1,
    prediction: 'bullish',
    category: 'rival'
  },
  {
    symbol: 'META',
    name: 'Meta Platforms',
    price: 492.33,
    change: -2.45,
    changePercent: -0.49,
    volume: 19800000,
    marketCap: 1250000000000,
    sentiment: 0.61,
    aiScore: 7.5,
    prediction: 'neutral',
    category: 'rival'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.87,
    change: 8.92,
    changePercent: 3.72,
    volume: 89400000,
    marketCap: 790000000000,
    sentiment: 0.81,
    aiScore: 9.1,
    prediction: 'strong_bullish',
    category: 'other'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 821.36,
    change: -12.44,
    changePercent: -1.49,
    volume: 42100000,
    marketCap: 2020000000000,
    sentiment: 0.64,
    aiScore: 8.8,
    prediction: 'bullish',
    category: 'other'
  }
];

const indicesData = [
  { name: 'S&P 500', value: 5127.79, change: 0.85 },
  { name: 'NASDAQ', value: 16274.94, change: 1.24 },
  { name: 'DOW', value: 38790.43, change: 0.42 },
  { name: 'RUSSELL 2K', value: 2073.45, change: -0.33 }
];

const commoditiesData = [
  { name: 'Gold', value: 2334.50, change: 0.56, unit: '/oz' },
  { name: 'Silver', value: 27.89, change: -0.82, unit: '/oz' },
  { name: 'Oil (WTI)', value: 83.24, change: 1.45, unit: '/bbl' },
  { name: 'Nat Gas', value: 2.67, change: -2.13, unit: '/MMBtu' }
];

const generatePriceHistory = (currentPrice: number, period: 'daily' | 'weekly' | 'yearly', volatility: number = 0.02) => {
  const data = [];
  const points = period === 'daily' ? 48 : period === 'weekly' ? 168 : 365;
  let price = currentPrice * 0.9;
  
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * volatility * price;
    const prevPrice = price;
    price += change;
    
    data.push({
      time: i,
      price: parseFloat(price.toFixed(2)),
      open: parseFloat(prevPrice.toFixed(2)),
      high: parseFloat(Math.max(price, prevPrice, price + Math.random() * 2).toFixed(2)),
      low: parseFloat(Math.min(price, prevPrice, price - Math.random() * 2).toFixed(2)),
      close: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000 + 10000000)
    });
  }
  
  data[points - 1].close = currentPrice;
  data[points - 1].price = currentPrice;
  
  return data;
};

const sentimentAnalysis = [
  { source: 'Financial News', sentiment: 0.74, weight: 0.4, articles: 142 },
  { source: 'Social Media', sentiment: 0.68, weight: 0.3, mentions: 28500 },
  { source: 'Analyst Reports', sentiment: 0.81, weight: 0.2, reports: 18 },
  { source: 'Earnings Call', sentiment: 0.89, weight: 0.1, transcripts: 3 }
];

const marketSignals = [
  { signal: 'Institutional Buying', strength: 0.85, impact: 'positive', description: 'Large fund accumulation detected' },
  { signal: 'Options Flow', strength: 0.72, impact: 'positive', description: 'Bullish options activity increasing' },
  { signal: 'Technical Breakout', strength: 0.68, impact: 'positive', description: 'Price breaking above resistance' },
  { signal: 'Sector Rotation', strength: 0.45, impact: 'negative', description: 'Money flowing out of tech sector' }
];

export const AIStockTracker = () => {
  const [selectedStock, setSelectedStock] = useState(stockData[0]);
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'yearly'>('daily');
  const [priceHistory, setPriceHistory] = useState(generatePriceHistory(selectedStock.price, timePeriod));
  const [isLive, setIsLive] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedStocks, setDisplayedStocks] = useState(stockData);

  useEffect(() => {
    setPriceHistory(generatePriceHistory(selectedStock.price, timePeriod));
  }, [selectedStock, timePeriod]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setDisplayedStocks(stockData);
    } else {
      const filtered = stockData.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayedStocks(filtered);
    }
  }, [searchQuery]);

  // Simulate real-time updates every 3 seconds
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      const updatedStocks = stockData.map(stock => {
        const priceChange = (Math.random() - 0.5) * 2;
        const newPrice = stock.price + priceChange;
        const newChange = stock.change + priceChange;
        const newChangePercent = (newChange / stock.price) * 100;
        
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(newChange.toFixed(2)),
          changePercent: parseFloat(newChangePercent.toFixed(2))
        };
      });
      
      const currentStock = updatedStocks.find(s => s.symbol === selectedStock.symbol);
      if (currentStock) {
        setSelectedStock(currentStock);
      }
      setDisplayedStocks(updatedStocks);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isLive, selectedStock.symbol]);

  const companyStock = stockData.find(s => s.category === 'company') || stockData[0];
  const rivalStocks = stockData.filter(s => companyStock.rivals?.includes(s.symbol));

  return (
    <div className="min-h-screen bg-background p-6 space-y-4">
      {/* Header with Search and Live Status */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks (e.g., AAPL, Tesla)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-primary/20 focus:border-primary/50"
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-muted'}`} />
            <span className="text-sm font-medium text-primary">{isLive ? 'LIVE' : 'PAUSED'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={timePeriod === 'daily' ? "default" : "outline"}
            size="sm"
            onClick={() => setTimePeriod('daily')}
            className="border-primary/20"
          >
            Daily
          </Button>
          <Button
            variant={timePeriod === 'weekly' ? "default" : "outline"}
            size="sm"
            onClick={() => setTimePeriod('weekly')}
            className="border-primary/20"
          >
            Weekly
          </Button>
          <Button
            variant={timePeriod === 'yearly' ? "default" : "outline"}
            size="sm"
            onClick={() => setTimePeriod('yearly')}
            className="border-primary/20"
          >
            Yearly
          </Button>
          <Button
            variant={isLive ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Multi-Panel Grid Layout */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Side - Stock Table & Market Data */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* Company & Rivals Table */}
          <Card className="bg-card/50 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Company & Rivals
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {/* Company Stock */}
                <div
                  onClick={() => setSelectedStock(companyStock)}
                  className={`px-4 py-3 cursor-pointer transition-colors border-l-4 ${
                    selectedStock.symbol === companyStock.symbol
                      ? 'bg-primary/20 border-primary'
                      : 'border-transparent hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{companyStock.symbol}</p>
                      <p className="text-xs text-muted-foreground">{companyStock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">${companyStock.price.toFixed(2)}</p>
                      <p className={`text-xs font-medium ${companyStock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {companyStock.change >= 0 ? '▲' : '▼'} {Math.abs(companyStock.changePercent).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Rival Stocks */}
                {rivalStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                    className={`px-4 py-3 cursor-pointer transition-colors border-l-4 ${
                      selectedStock.symbol === stock.symbol
                        ? 'bg-primary/20 border-primary'
                        : 'border-transparent hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">${stock.price.toFixed(2)}</p>
                        <p className={`text-xs font-medium ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Indices */}
          <Card className="bg-card/50 border-warning/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-warning flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Market Indices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {indicesData.map((index) => (
                <div key={index.name} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm font-medium">{index.name}</span>
                  <div className="text-right">
                    <p className="text-sm font-bold">{index.value.toFixed(2)}</p>
                    <p className={`text-xs ${index.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {index.change >= 0 ? '▲' : '▼'} {Math.abs(index.change).toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Commodities */}
          <Card className="bg-card/50 border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-accent flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Commodities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {commoditiesData.map((commodity) => (
                <div key={commodity.name} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{commodity.name}</p>
                    <p className="text-xs text-muted-foreground">{commodity.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${commodity.value.toFixed(2)}</p>
                    <p className={`text-xs ${commodity.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {commodity.change >= 0 ? '▲' : '▼'} {Math.abs(commodity.change).toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center - Main Charts */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          {/* Line Chart */}
          <Card className="bg-card/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary">
                {selectedStock.name} ({selectedStock.symbol})
              </CardTitle>
              <CardDescription>
                {timePeriod === 'daily' ? 'Intraday' : timePeriod === 'weekly' ? '7-Day' : '1-Year'} Price Movement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceHistory}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--primary))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={false}
                    fill="url(#priceGradient)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Candlestick Chart */}
          <Card className="bg-card/50 border-success/20">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-success">Candlestick Analysis</CardTitle>
              <CardDescription>OHLC Data with Volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    yAxisId="price"
                    domain={['auto', 'auto']}
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    yAxisId="volume"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--success))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar 
                    yAxisId="volume"
                    dataKey="volume" 
                    fill="hsl(var(--muted))" 
                    opacity={0.3}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="high"
                    stroke="hsl(var(--success))"
                    strokeWidth={1}
                    dot={false}
                  />
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="low"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={1}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - All Stocks & Market Sentiment */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* All Stocks Table */}
          <Card className="bg-card/50 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary">All Stocks</CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[600px] overflow-y-auto">
              <div className="space-y-1">
                {displayedStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                    className={`px-4 py-3 cursor-pointer transition-colors border-l-4 ${
                      selectedStock.symbol === stock.symbol
                        ? 'bg-primary/20 border-primary'
                        : 'border-transparent hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{stock.symbol}</p>
                          {stock.category === 'company' && (
                            <Badge variant="default" className="text-xs px-1 py-0">Main</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">${stock.price.toFixed(2)}</p>
                        <p className={`text-xs font-medium ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Vol: {(stock.volume / 1000000).toFixed(1)}M</span>
                      <Badge variant={stock.sentiment > 0.7 ? "default" : "secondary"} className="text-xs">
                        {(stock.sentiment * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Sentiment */}
          <Card className="bg-card/50 border-success/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-success flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Market Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <p className="text-3xl font-bold text-success">
                    {(selectedStock.sentiment * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Overall Sentiment</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">AI Score</span>
                    <span className="text-sm font-bold text-primary">{selectedStock.aiScore}/10</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(selectedStock.aiScore / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Prediction</span>
                    <Badge variant={selectedStock.prediction === 'strong_bullish' || selectedStock.prediction === 'bullish' ? "default" : "secondary"}>
                      {selectedStock.prediction.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chart">Price Chart</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="signals">Market Signals</TabsTrigger>
          <TabsTrigger value="prediction">AI Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{selectedStock.name} ({selectedStock.symbol})</CardTitle>
              <CardDescription>{timePeriod} price movement analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={priceHistory}>
                  <defs>
                    <linearGradient id="priceGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={['auto', 'auto']} stroke="hsl(var(--muted-foreground))" />
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
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#priceGradient2)"
                    name="Price"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Source Sentiment Analysis</CardTitle>
              <CardDescription>AI-powered sentiment from news, social media, and analyst reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {sentimentAnalysis.map((source) => (
                <div key={source.source} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{source.source}</span>
                      <p className="text-sm text-muted-foreground">
                        Weight: {(source.weight * 100).toFixed(0)}% • 
                        {source.articles && ` ${source.articles} articles`}
                        {source.mentions && ` ${source.mentions.toLocaleString()} mentions`}
                        {source.reports && ` ${source.reports} reports`}
                        {source.transcripts && ` ${source.transcripts} transcripts`}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">{(source.sentiment * 100).toFixed(0)}%</span>
                      <Badge variant={source.sentiment > 0.7 ? "default" : source.sentiment > 0.5 ? "secondary" : "destructive"}>
                        {source.sentiment > 0.7 ? 'Positive' : source.sentiment > 0.5 ? 'Neutral' : 'Negative'}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${source.sentiment > 0.7 ? 'bg-success' : source.sentiment > 0.5 ? 'bg-warning' : 'bg-destructive'}`}
                      style={{ width: `${source.sentiment * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Market Signals</CardTitle>
              <CardDescription>Real-time market indicators and their impact assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketSignals.map((signal, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{signal.signal}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant={signal.impact === 'positive' ? "default" : "destructive"}>
                        {signal.impact}
                      </Badge>
                      <span className="text-sm font-medium">{(signal.strength * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{signal.description}</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${signal.impact === 'positive' ? 'bg-success' : 'bg-destructive'}`}
                      style={{ width: `${signal.strength * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediction" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span>AI Price Prediction</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 rounded-lg bg-primary/10">
                  <p className="text-sm text-muted-foreground mb-2">7-Day Target</p>
                  <p className="text-3xl font-bold text-primary">
                    ${(selectedStock.price * 1.05).toFixed(2)}
                  </p>
                  <p className="text-sm text-success mt-1">+5.2% potential upside</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Confidence Level</span>
                    <span className="text-sm font-semibold">78%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Risk Assessment</span>
                    <span className="text-sm font-semibold">Medium</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-warning h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Factors</CardTitle>
                <CardDescription>Primary drivers behind AI prediction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-success/10 border-l-4 border-success">
                  <h4 className="font-semibold text-success text-sm">Positive Catalysts</h4>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                    <li>• Strong earnings momentum</li>
                    <li>• Institutional accumulation</li>
                    <li>• Technical breakout pattern</li>
                  </ul>
                </div>
                
                <div className="p-3 rounded-lg bg-destructive/10 border-l-4 border-destructive">
                  <h4 className="font-semibold text-destructive text-sm">Risk Factors</h4>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                    <li>• Market volatility concerns</li>
                    <li>• Sector rotation headwinds</li>
                    <li>• Valuation metrics stretched</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-primary/10 border-l-4 border-primary">
                  <h4 className="font-semibold text-primary text-sm">Model Inputs</h4>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                    <li>• 50+ technical indicators</li>
                    <li>• Sentiment from 1000+ sources</li>
                    <li>• Options flow analysis</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};