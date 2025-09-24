import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Users, Clock, Target, Activity, Zap } from 'lucide-react';

interface KPIMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'critical' | 'warning' | 'good';
  lastUpdated: string;
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  metric: string;
}

const KPIWarRoom: React.FC = () => {
  const [liveMode, setLiveMode] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [kpiMetrics, setKPIMetrics] = useState<KPIMetric[]>([
    {
      id: 'revenue',
      name: 'Monthly Recurring Revenue',
      value: 485000,
      target: 500000,
      unit: '$',
      trend: 'up',
      change: 12.5,
      status: 'warning',
      lastUpdated: 'Live'
    },
    {
      id: 'runway',
      name: 'Cash Runway',
      value: 8.2,
      target: 12,
      unit: 'months',
      trend: 'down',
      change: -0.8,
      status: 'critical',
      lastUpdated: 'Live'
    },
    {
      id: 'churn',
      name: 'Customer Churn Rate',
      value: 5.2,
      target: 5.0,
      unit: '%',
      trend: 'up',
      change: 0.7,
      status: 'warning',
      lastUpdated: 'Live'
    },
    {
      id: 'cac',
      name: 'Customer Acquisition Cost',
      value: 85,
      target: 80,
      unit: '$',
      trend: 'up',
      change: 8.2,
      status: 'warning',
      lastUpdated: 'Live'
    },
    {
      id: 'nps',
      name: 'Net Promoter Score',
      value: 67,
      target: 70,
      unit: '',
      trend: 'stable',
      change: 0.5,
      status: 'good',
      lastUpdated: 'Live'
    },
    {
      id: 'compliance',
      name: 'Compliance Score',
      value: 94,
      target: 95,
      unit: '%',
      trend: 'up',
      change: 2.1,
      status: 'good',
      lastUpdated: 'Live'
    }
  ]);

  const chartData = [
    { time: '00:00', revenue: 450000, runway: 9.1, churn: 4.8 },
    { time: '04:00', revenue: 455000, runway: 8.9, churn: 4.9 },
    { time: '08:00', revenue: 465000, runway: 8.7, churn: 5.0 },
    { time: '12:00', revenue: 475000, runway: 8.5, churn: 5.1 },
    { time: '16:00', revenue: 480000, runway: 8.3, churn: 5.2 },
    { time: '20:00', revenue: 485000, runway: 8.2, churn: 5.2 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-950';
      case 'warning': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950';
      case 'good': return 'text-green-600 bg-green-50 dark:bg-green-950';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getKPIIcon = (id: string) => {
    switch (id) {
      case 'revenue': return <DollarSign className="w-5 h-5" />;
      case 'runway': return <Clock className="w-5 h-5" />;
      case 'churn': return <Users className="w-5 h-5" />;
      case 'cac': return <Target className="w-5 h-5" />;
      case 'nps': return <TrendingUp className="w-5 h-5" />;
      case 'compliance': return <Activity className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  // Simulate live updates
  useEffect(() => {
    if (!liveMode) return;

    const interval = setInterval(() => {
      setKPIMetrics(prev => prev.map(metric => {
        const change = (Math.random() - 0.5) * 0.05; // Small random change
        const newValue = metric.value * (1 + change);
        const newChange = ((newValue - metric.value) / metric.value) * 100;
        
        let newStatus = metric.status;
        if (metric.id === 'runway' && newValue < 6) newStatus = 'critical';
        else if (metric.id === 'churn' && newValue > 6) newStatus = 'critical';
        else if (newValue < metric.target * 0.9) newStatus = 'warning';
        else if (newValue >= metric.target) newStatus = 'good';

        return {
          ...metric,
          value: newValue,
          change: newChange,
          status: newStatus,
          trend: newChange > 0.1 ? 'up' : newChange < -0.1 ? 'down' : 'stable'
        };
      }));

      // Generate random alerts
      if (Math.random() < 0.3) {
        const alertTypes = ['critical', 'warning', 'info'] as const;
        const messages = [
          'Revenue milestone approaching target',
          'Cash runway dropped below threshold',
          'Churn rate increased significantly',
          'New compliance requirement detected',
          'Customer acquisition trending upward'
        ];
        
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date().toLocaleTimeString(),
          metric: 'revenue'
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [liveMode]);

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-400" />
                KPI War Room
              </CardTitle>
              <p className="text-gray-400">Real-time business metrics command center</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={liveMode ? 'default' : 'secondary'} className="bg-red-500 text-white animate-pulse">
                {liveMode ? 'LIVE' : 'PAUSED'}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLiveMode(!liveMode)}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                {liveMode ? 'Pause' : 'Resume'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {kpiMetrics.map((metric) => (
          <Card 
            key={metric.id} 
            className={`bg-gray-900 border-gray-800 cursor-pointer transition-all hover:bg-gray-800 ${
              selectedMetric === metric.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedMetric(metric.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getKPIIcon(metric.id)}
                  <span className="text-sm text-gray-400">{metric.name}</span>
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {metric.unit === '$' ? '$' : ''}{metric.value.toLocaleString()}
                    {metric.unit !== '$' && metric.unit !== '' ? metric.unit : ''}
                  </span>
                  <span className={`text-sm ${metric.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Target: {metric.unit === '$' ? '$' : ''}{metric.target.toLocaleString()}{metric.unit !== '$' && metric.unit !== '' ? metric.unit : ''}</span>
                    <span>{((metric.value / metric.target) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={(metric.value / metric.target) * 100} 
                    className="h-1 bg-gray-800"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(metric.status)} border-current`}
                  >
                    {metric.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-500">{metric.lastUpdated}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Live Metrics Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Area 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke="#3B82F6" 
                  fill="#1E40AF" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Live Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No alerts - all systems nominal</p>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-3 rounded-lg border ${
                      alert.type === 'critical' ? 'bg-red-950 border-red-500' :
                      alert.type === 'warning' ? 'bg-yellow-950 border-yellow-500' :
                      'bg-blue-950 border-blue-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          alert.type === 'critical' ? 'text-red-400 border-red-400' :
                          alert.type === 'warning' ? 'text-yellow-400 border-yellow-400' :
                          'text-blue-400 border-blue-400'
                        }`}
                      >
                        {alert.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-400">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm text-white">{alert.message}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-white">Emergency Actions</p>
              <p className="text-sm text-gray-400">Quick access to critical business controls</p>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Trigger Alert
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800">
                <Users className="w-4 h-4 mr-2" />
                Rally Team
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800">
                <Target className="w-4 h-4 mr-2" />
                Adjust Targets
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIWarRoom;