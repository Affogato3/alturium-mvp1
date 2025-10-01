import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, MapPin, Hash, ShoppingCart, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const demandSignals = [
  {
    id: 1,
    product: 'Cloud Analytics Platform',
    region: 'Southeast Asia',
    signalStrength: 0.89,
    trendType: 'surge',
    sources: ['TikTok mentions +450%', 'Search trends +320%', 'Payment processor signals'],
    estimatedDemand: '+2,400 customers',
    timeToMarket: '2-3 weeks',
    confidence: 0.87,
    potentialRevenue: '$1.2M'
  },
  {
    id: 2,
    product: 'AI Document Scanner',
    region: 'European Union',
    signalStrength: 0.76,
    trendType: 'rising',
    sources: ['LinkedIn discussions +180%', 'Supply chain orders up', 'Competitor mentions'],
    estimatedDemand: '+890 customers',
    timeToMarket: '4-5 weeks',
    confidence: 0.79,
    potentialRevenue: '$450K'
  },
  {
    id: 3,
    product: 'Mobile Expense Tracker',
    region: 'Latin America',
    signalStrength: 0.92,
    trendType: 'breakout',
    sources: ['App store search spike', 'Social media viral trend', 'Influencer campaigns'],
    estimatedDemand: '+5,200 customers',
    timeToMarket: '1-2 weeks',
    confidence: 0.91,
    potentialRevenue: '$780K'
  }
];

const trendData = [
  { week: 'W-8', mentions: 120, searches: 450, orders: 23 },
  { week: 'W-7', mentions: 145, searches: 520, orders: 28 },
  { week: 'W-6', mentions: 180, searches: 610, orders: 34 },
  { week: 'W-5', mentions: 220, searches: 780, orders: 41 },
  { week: 'W-4', mentions: 310, searches: 1100, orders: 52 },
  { week: 'W-3', mentions: 480, searches: 1650, orders: 73 },
  { week: 'W-2', mentions: 740, searches: 2340, orders: 98 },
  { week: 'W-1', mentions: 1120, searches: 3450, orders: 142 },
  { week: 'Now', mentions: 1680, searches: 4890, orders: 187 },
];

const regionalHeatmap = [
  { region: 'North America', demand: 78, growth: '+12%', status: 'stable' },
  { region: 'Europe', demand: 84, growth: '+18%', status: 'rising' },
  { region: 'Asia Pacific', demand: 92, growth: '+45%', status: 'surge' },
  { region: 'Latin America', demand: 89, growth: '+67%', status: 'breakout' },
  { region: 'Middle East', demand: 71, growth: '+23%', status: 'rising' },
  { region: 'Africa', demand: 65, growth: '+31%', status: 'rising' },
];

export const DemandPreSignal = () => {
  const [selectedSignal, setSelectedSignal] = useState(demandSignals[0]);

  const getSignalColor = (strength: number) => {
    if (strength >= 0.85) return 'text-success';
    if (strength >= 0.70) return 'text-primary';
    return 'text-warning';
  };

  const getTrendBadge = (type: string) => {
    switch (type) {
      case 'surge': return 'destructive';
      case 'breakout': return 'default';
      case 'rising': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'breakout': return 'bg-success';
      case 'surge': return 'bg-primary';
      case 'rising': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Signals</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Zap className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Potential Revenue</p>
                <p className="text-2xl font-bold">$3.8M</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Lead Time</p>
                <p className="text-2xl font-bold">2.8 wks</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Detection Accuracy</p>
                <p className="text-2xl font-bold">87.3%</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demand Signals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-warning" />
            <span>Pre-Market Demand Signals</span>
          </CardTitle>
          <CardDescription>AI-detected demand surges before customer contact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demandSignals.map((signal) => (
              <div 
                key={signal.id} 
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedSignal.id === signal.id 
                    ? 'bg-primary/5 border-primary' 
                    : 'bg-card hover:bg-muted/30'
                }`}
                onClick={() => setSelectedSignal(signal)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{signal.product}</h3>
                      <Badge variant={getTrendBadge(signal.trendType) as any} className="capitalize">
                        {signal.trendType}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{signal.region}</span>
                      </span>
                      <span>Time to market: {signal.timeToMarket}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Potential Revenue</p>
                    <p className="text-xl font-bold text-success">{signal.potentialRevenue}</p>
                  </div>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg mb-3">
                  <p className="text-sm font-medium mb-2">Signal Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {signal.sources.map((source, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Signal Strength</p>
                      <p className={`text-sm font-semibold ${getSignalColor(signal.signalStrength)}`}>
                        {(signal.signalStrength * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <p className="text-sm font-semibold">{(signal.confidence * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Est. Demand</p>
                      <p className="text-sm font-semibold">{signal.estimatedDemand}</p>
                    </div>
                  </div>
                  <Button size="sm">
                    Prepare Campaign
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Demand Trend Analysis</CardTitle>
          <CardDescription>Social media, search trends, and supply chain signals</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Area type="monotone" dataKey="mentions" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Social Mentions" />
              <Area type="monotone" dataKey="searches" stackId="1" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.6} name="Search Volume" />
              <Area type="monotone" dataKey="orders" stackId="1" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.6} name="Supply Orders" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Regional Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Demand Heatmap</CardTitle>
          <CardDescription>Global demand signals by region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {regionalHeatmap.map((region, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div className="w-32 text-sm font-medium">{region.region}</div>
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className={`${getStatusColor(region.status)} h-3 rounded-full transition-all`}
                      style={{ width: `${region.demand}%` }}
                    />
                  </div>
                </div>
                <div className="w-24 text-sm font-semibold text-success">{region.growth}</div>
                <Badge variant="outline" className="w-20 justify-center capitalize text-xs">
                  {region.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
