import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, TrendingUp, TrendingDown, AlertTriangle, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Sample real-time cash flow data
const generateRealtimeCashFlow = () => {
  const baseData = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Simulate business hours activity
    let inflow = 0;
    let outflow = 0;
    
    if (hour >= 9 && hour <= 17) {
      inflow = Math.random() * 5000 + 2000;
      outflow = Math.random() * 3000 + 1000;
    } else {
      inflow = Math.random() * 1000 + 200;
      outflow = Math.random() * 500 + 100;
    }
    
    baseData.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      inflow,
      outflow,
      net: inflow - outflow,
      cumulative: i === 23 ? inflow - outflow : 0
    });
  }
  
  // Calculate cumulative
  for (let i = 1; i < baseData.length; i++) {
    baseData[i].cumulative = baseData[i-1].cumulative + baseData[i].net;
  }
  
  return baseData;
};

const realtimeTransactions = [
  { id: 1, type: 'inflow', amount: 2500, source: 'Client Payment - ABC Corp', time: '2 min ago', status: 'verified' },
  { id: 2, type: 'outflow', amount: -800, source: 'AWS Infrastructure', time: '5 min ago', status: 'auto' },
  { id: 3, type: 'inflow', amount: 1200, source: 'Subscription Revenue', time: '8 min ago', status: 'verified' },
  { id: 4, type: 'outflow', amount: -450, source: 'Office Supplies', time: '12 min ago', status: 'pending' },
  { id: 5, type: 'inflow', amount: 3200, source: 'Invoice Payment - XYZ Ltd', time: '15 min ago', status: 'verified' },
];

const liquididtyMetrics = [
  { label: 'Available Cash', value: 125000, change: 8.2, trend: 'up' },
  { label: 'Daily Burn Rate', value: 2400, change: -3.1, trend: 'down' },
  { label: 'Runway (Days)', value: 52, change: 12.5, trend: 'up' },
  { label: 'Revenue Velocity', value: 15600, change: 22.3, trend: 'up' },
];

export const CashFlowRadar = () => {
  const [cashFlowData, setCashFlowData] = useState(generateRealtimeCashFlow());
  const [isLive, setIsLive] = useState(true);
  
  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setCashFlowData(generateRealtimeCashFlow());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isLive]);
  
  const totalInflow = cashFlowData.reduce((sum, item) => sum + item.inflow, 0);
  const totalOutflow = cashFlowData.reduce((sum, item) => sum + Math.abs(item.outflow), 0);
  const netFlow = totalInflow - totalOutflow;
  const currentCash = cashFlowData[cashFlowData.length - 1]?.cumulative || 0;

  return (
    <div className="space-y-6">
      {/* Live Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-muted'}`} />
            <span className="text-sm font-medium">{isLive ? 'Live Monitoring' : 'Paused'}</span>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            <Activity className="w-3 h-3 mr-1" />
            Real-time
          </Badge>
        </div>
        <Button
          variant={isLive ? "destructive" : "default"}
          size="sm"
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? 'Pause' : 'Resume'} Live Feed
        </Button>
      </div>

      {/* Liquidity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {liquididtyMetrics.map((metric) => (
          <Card key={metric.label} className="bg-gradient-to-br from-background to-muted/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">
                    {metric.label.includes('Cash') || metric.label.includes('Rate') || metric.label.includes('Velocity') 
                      ? `$${metric.value.toLocaleString()}` 
                      : metric.value}
                  </p>
                  <div className="flex items-center mt-1">
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-success" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`text-sm ml-1 ${metric.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {Math.abs(metric.change)}%
                    </span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cash Flow Heartbeat */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-primary" />
                <span>Cash Flow Heartbeat</span>
              </CardTitle>
              <CardDescription>Live inflow vs outflow monitoring (24-hour view)</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Net Flow (24h)</p>
              <p className={`text-xl font-bold ${netFlow > 0 ? 'text-success' : 'text-destructive'}`}>
                {netFlow > 0 ? '+' : ''}${netFlow.toLocaleString()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={cashFlowData}>
              <defs>
                <linearGradient id="inflowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="outflowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Area
                type="monotone"
                dataKey="inflow"
                stackId="1"
                stroke="hsl(var(--success))"
                fillOpacity={1}
                fill="url(#inflowGradient)"
                name="Inflow"
              />
              <Area
                type="monotone"
                dataKey="outflow"
                stackId="2"
                stroke="hsl(var(--destructive))"
                fillOpacity={1}
                fill="url(#outflowGradient)"
                name="Outflow"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Live Transaction Feed</CardTitle>
          <CardDescription>Real-time transaction monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realtimeTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'inflow' ? 'bg-success/20' : 'bg-destructive/20'
                  }`}>
                    {transaction.type === 'inflow' ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{transaction.source}</p>
                    <p className="text-sm text-muted-foreground">{transaction.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${transaction.type === 'inflow' ? 'text-success' : 'text-destructive'}`}>
                    {transaction.type === 'inflow' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <Badge 
                    variant={transaction.status === 'verified' ? 'default' : transaction.status === 'pending' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};