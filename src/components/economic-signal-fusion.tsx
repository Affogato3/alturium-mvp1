import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, MapPin, TrendingUp, TrendingDown, AlertTriangle, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const regions = [
  { id: 'us', name: 'United States', currency: 'USD', currencySymbol: '$' },
  { id: 'uk', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£' },
  { id: 'eu', name: 'European Union', currency: 'EUR', currencySymbol: '€' },
  { id: 'jp', name: 'Japan', currency: 'JPY', currencySymbol: '¥' },
  { id: 'cn', name: 'China', currency: 'CNY', currencySymbol: '¥' },
  { id: 'in', name: 'India', currency: 'INR', currencySymbol: '₹' },
];

const macroSignals = [
  { indicator: 'Interest Rates', global: 5.25, us: 5.5, uk: 5.25, eu: 4.5, jp: -0.1, cn: 3.45, trend: 'stable' },
  { indicator: 'GDP Growth', global: 2.8, us: 2.4, uk: 0.6, eu: 0.5, jp: 1.2, cn: 5.2, trend: 'up' },
  { indicator: 'Inflation Rate', global: 3.4, us: 3.2, uk: 4.0, eu: 2.9, jp: 3.8, cn: 0.2, trend: 'down' },
  { indicator: 'Unemployment', global: 5.2, us: 3.7, uk: 4.3, eu: 6.4, jp: 2.6, cn: 5.1, trend: 'stable' },
  { indicator: 'Oil Price ($/barrel)', global: 82, us: 82, uk: 82, eu: 82, jp: 82, cn: 82, trend: 'up' },
];

const localSignals = [
  {
    region: 'us',
    signals: [
      { metric: 'Consumer Confidence', value: 102.6, change: '+2.3%', status: 'positive' },
      { metric: 'Tech Sector Growth', value: 8.4, change: '+12%', status: 'positive' },
      { metric: 'Regional Search Volume', value: 234000, change: '-8%', status: 'negative' },
      { metric: 'Venture Capital Activity', value: 4.2, change: '-22%', status: 'negative' },
    ]
  },
  {
    region: 'uk',
    signals: [
      { metric: 'Consumer Confidence', value: 87.2, change: '-4.1%', status: 'negative' },
      { metric: 'FinTech Growth', value: 6.7, change: '+18%', status: 'positive' },
      { metric: 'Regional Search Volume', value: 89000, change: '+12%', status: 'positive' },
      { metric: 'Brexit Impact Index', value: 62, change: '-3%', status: 'neutral' },
    ]
  }
];

const forecastData = [
  { month: 'Mar', demand: 100, forecast: 100 },
  { month: 'Apr', demand: 98, forecast: 95 },
  { month: 'May', demand: null, forecast: 87 },
  { month: 'Jun', demand: null, forecast: 82 },
  { month: 'Jul', demand: null, forecast: 79 },
  { month: 'Aug', demand: null, forecast: 83 },
  { month: 'Sep', demand: null, forecast: 91 },
];

const alerts = [
  {
    id: 1,
    region: 'US',
    severity: 'high',
    message: 'Demand drop predicted: -18% in next 2 weeks',
    cause: 'Tech layoffs + interest rate impact',
    recommendation: 'Reduce inventory, focus on enterprise segment',
    confidence: 0.87
  },
  {
    id: 2,
    region: 'EU',
    severity: 'medium',
    message: 'Inflation cooling faster than expected',
    cause: 'ECB policy + energy prices stabilizing',
    recommendation: 'Opportunity for price adjustments upward',
    confidence: 0.79
  }
];

export const EconomicSignalFusion = () => {
  const [selectedRegion, setSelectedRegion] = useState('us');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const currentRegion = regions.find(r => r.id === selectedRegion) || regions[0];
  const currentSignals = localSignals.find(s => s.region === selectedRegion)?.signals || [];

  const getCurrencySymbol = (currency: string) => {
    return regions.find(r => r.currency === currency)?.currencySymbol || '$';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <span className="w-4 h-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Region & Currency Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-primary" />
            <span>Global-Local Economic Fusion</span>
          </CardTitle>
          <CardDescription>Macro signals → Local impact predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Target Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Display Currency</label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.currency} value={region.currency}>
                      {region.currency} ({region.currencySymbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macro Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Global Macro Indicators</CardTitle>
          <CardDescription>Key economic signals across regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Indicator</th>
                  <th className="text-center p-3 font-medium">Global</th>
                  <th className="text-center p-3 font-medium">US</th>
                  <th className="text-center p-3 font-medium">UK</th>
                  <th className="text-center p-3 font-medium">EU</th>
                  <th className="text-center p-3 font-medium">Japan</th>
                  <th className="text-center p-3 font-medium">China</th>
                  <th className="text-center p-3 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {macroSignals.map((signal, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/30">
                    <td className="p-3 font-medium">{signal.indicator}</td>
                    <td className="text-center p-3">{signal.global}%</td>
                    <td className="text-center p-3">{signal.us}%</td>
                    <td className="text-center p-3">{signal.uk}%</td>
                    <td className="text-center p-3">{signal.eu}%</td>
                    <td className="text-center p-3">{signal.jp}%</td>
                    <td className="text-center p-3">{signal.cn}%</td>
                    <td className="flex justify-center p-3">{getTrendIcon(signal.trend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Local Signals for Selected Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Local Signals: {currentRegion.name}</span>
          </CardTitle>
          <CardDescription>Region-specific economic indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSignals.map((signal, idx) => (
              <div key={idx} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{signal.metric}</span>
                  <Badge 
                    variant={signal.status === 'positive' ? 'default' : signal.status === 'negative' ? 'destructive' : 'outline'}
                  >
                    {signal.change}
                  </Badge>
                </div>
                <p className={`text-2xl font-bold ${getStatusColor(signal.status)}`}>
                  {signal.metric.includes('Volume') || signal.metric.includes('Activity') 
                    ? `${getCurrencySymbol(selectedCurrency)}${(signal.value * 1000).toLocaleString()}`
                    : signal.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forecast with Macro Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Business Forecast</CardTitle>
          <CardDescription>AI-powered predictions combining global + local signals</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Area type="monotone" dataKey="demand" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Actual Demand" />
              <Area type="monotone" dataKey="forecast" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.4} strokeDasharray="5 5" name="AI Forecast" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Early Warning Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <span>Early Warning Alerts</span>
          </CardTitle>
          <CardDescription>Signals detected before market impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={getSeverityBadge(alert.severity) as any} className="capitalize">
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline">{alert.region}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{alert.message}</h3>
                    <p className="text-sm text-muted-foreground">{alert.cause}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <p className="text-sm font-semibold">{(alert.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
                <div className="bg-primary/5 p-3 rounded-lg border-l-4 border-primary">
                  <p className="text-sm">
                    <span className="font-semibold text-primary">Recommendation:</span> {alert.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Currency Conversion Info */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Settings</CardTitle>
          <CardDescription>Current display: {selectedCurrency} ({getCurrencySymbol(selectedCurrency)})</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {regions.map((region) => (
              <div key={region.id} className="p-3 rounded-lg bg-muted/30">
                <p className="text-sm font-medium">{region.currency}</p>
                <p className="text-2xl font-bold">{region.currencySymbol}</p>
                <p className="text-xs text-muted-foreground">{region.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
