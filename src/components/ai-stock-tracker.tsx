import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Brain, MessageSquare, Globe, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

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
    newsCount: 24,
    socialMentions: 18500
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
    newsCount: 18,
    socialMentions: 12300
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
    newsCount: 31,
    socialMentions: 45200
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
    newsCount: 27,
    socialMentions: 28700
  }
];

const generatePriceHistory = (currentPrice: number, volatility: number = 0.02) => {
  const data = [];
  let price = currentPrice * 0.9; // Start 10% lower
  
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.5) * volatility * price;
    price += change;
    
    data.push({
      day: i + 1,
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000 + 10000000),
      sentiment: 0.3 + Math.random() * 0.4
    });
  }
  
  // Ensure we end close to current price
  data[29].price = currentPrice;
  
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
  const [priceHistory, setPriceHistory] = useState(generatePriceHistory(selectedStock.price));
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    setPriceHistory(generatePriceHistory(selectedStock.price));
  }, [selectedStock]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      // Update stock prices slightly
      const updatedStocks = stockData.map(stock => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 2,
        change: stock.change + (Math.random() - 0.5) * 0.5
      }));
      
      const currentStock = updatedStocks.find(s => s.symbol === selectedStock.symbol);
      if (currentStock) {
        setSelectedStock(currentStock);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isLive, selectedStock.symbol]);

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'strong_bullish': return 'text-success';
      case 'bullish': return 'text-success';
      case 'neutral': return 'text-muted-foreground';
      case 'bearish': return 'text-destructive';
      case 'strong_bearish': return 'text-destructive';
      default: return 'text-foreground';
    }
  };

  const getPredictionBadge = (prediction: string) => {
    switch (prediction) {
      case 'strong_bullish': return { variant: 'default', label: 'Strong Buy' };
      case 'bullish': return { variant: 'default', label: 'Buy' };
      case 'neutral': return { variant: 'secondary', label: 'Hold' };
      case 'bearish': return { variant: 'destructive', label: 'Sell' };
      case 'strong_bearish': return { variant: 'destructive', label: 'Strong Sell' };
      default: return { variant: 'outline', label: 'Unknown' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Stock Selection & Live Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex gap-2">
            {stockData.map((stock) => (
              <Button
                key={stock.symbol}
                variant={selectedStock.symbol === stock.symbol ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStock(stock)}
              >
                {stock.symbol}
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-muted'}`} />
            <span className="text-sm font-medium">{isLive ? 'Live' : 'Paused'}</span>
          </div>
        </div>
        <Button
          variant={isLive ? "destructive" : "default"}
          size="sm"
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? 'Pause' : 'Resume'}
        </Button>
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Price</p>
                <p className="text-2xl font-bold">${selectedStock.price.toFixed(2)}</p>
                <div className="flex items-center mt-1">
                  {selectedStock.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                  <span className={`text-sm ml-1 ${selectedStock.change > 0 ? 'text-success' : 'text-destructive'}`}>
                    {selectedStock.change > 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Score</p>
                <p className="text-2xl font-bold">{selectedStock.aiScore}/10</p>
                <Badge variant={getPredictionBadge(selectedStock.prediction).variant as any} className="mt-1">
                  {getPredictionBadge(selectedStock.prediction).label}
                </Badge>
              </div>
              <Brain className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sentiment</p>
                <p className="text-2xl font-bold">{(selectedStock.sentiment * 100).toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">{selectedStock.newsCount} news, {selectedStock.socialMentions.toLocaleString()} mentions</p>
              </div>
              <MessageSquare className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volume</p>
                <p className="text-2xl font-bold">{(selectedStock.volume / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Market Cap: ${(selectedStock.marketCap / 1000000000).toFixed(0)}B</p>
              </div>
              <Globe className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
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
              <CardDescription>30-day price movement with sentiment overlay</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={priceHistory}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
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
                    fill="url(#priceGradient)"
                    name="Price"
                  />
                  <Line
                    type="monotone"
                    dataKey="sentiment"
                    stroke="hsl(var(--warning))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Sentiment"
                    yAxisId="sentiment"
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