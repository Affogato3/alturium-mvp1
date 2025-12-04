import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, TrendingUp, TrendingDown, AlertTriangle, Brain, 
  Target, Gauge, LineChart, RefreshCw, Plus, Zap, Shield,
  BarChart3, Eye, Settings, Sparkles, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine,
  ComposedChart, Bar
} from 'recharts';
import { MetricEstimationPanel } from './metric-estimation-panel';
import { ForecastPanel } from './forecast-panel';
import { AnomalyPanel } from './anomaly-panel';
import { AIInsightsPanel } from './ai-insights-panel';
import { DataSourcesPanel } from './data-sources-panel';

export const KalmanFilterDashboard = () => {
  const [activeTab, setActiveTab] = useState('estimation');
  const [selectedMetric, setSelectedMetric] = useState('mrr');
  const [isLoading, setIsLoading] = useState(false);
  const [estimateData, setEstimateData] = useState<any>(null);
  const [historicalEstimates, setHistoricalEstimates] = useState<any[]>([]);

  const metrics = [
    { value: 'mrr', label: 'Monthly Recurring Revenue (MRR)' },
    { value: 'arr', label: 'Annual Recurring Revenue (ARR)' },
    { value: 'cac', label: 'Customer Acquisition Cost (CAC)' },
    { value: 'ltv', label: 'Lifetime Value (LTV)' },
    { value: 'churn', label: 'Churn Rate' },
    { value: 'conversion', label: 'Conversion Rate' }
  ];

  const loadState = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke('kalman-estimate', {
        body: { action: 'get_state', metric: selectedMetric }
      });

      if (error) throw error;
      if (data?.estimates) {
        setHistoricalEstimates(data.estimates);
      }
      if (data?.state) {
        setEstimateData({
          estimated_value: data.state.state_vector?.[0] || 0,
          trend: data.state.state_vector?.[1] || 0,
          kalman_gain: data.state.kalman_gain || 0,
          signal_to_noise_ratio: data.state.signal_to_noise_ratio || 0,
          forecasts: data.forecasts || [],
          anomalies: data.anomalies || [],
          ai_insight: data.insights?.[0] || null
        });
      }
    } catch (err) {
      console.error('Load state error:', err);
    }
  };

  useEffect(() => {
    loadState();
  }, [selectedMetric]);

  const runEstimation = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to use Kalman estimation');
        return;
      }

      // Generate sample observations for demo
      const baseValue = selectedMetric === 'mrr' ? 850000 : 
                       selectedMetric === 'arr' ? 10200000 :
                       selectedMetric === 'cac' ? 450 :
                       selectedMetric === 'ltv' ? 12000 :
                       selectedMetric === 'churn' ? 0.025 : 0.035;

      const observations = [
        {
          timestamp: new Date().toISOString(),
          source: 'stripe',
          value: baseValue * (1 + (Math.random() - 0.5) * 0.05),
          confidence: 0.95
        },
        {
          timestamp: new Date().toISOString(),
          source: 'salesforce',
          value: baseValue * (1 + (Math.random() - 0.5) * 0.08),
          confidence: 0.80
        },
        {
          timestamp: new Date().toISOString(),
          source: 'quickbooks',
          value: baseValue * (1 + (Math.random() - 0.5) * 0.03),
          confidence: 0.98
        }
      ];

      const { data, error } = await supabase.functions.invoke('kalman-estimate', {
        body: {
          action: 'estimate',
          metric: selectedMetric,
          observations,
          forecast_horizon: 30
        }
      });

      if (error) throw error;

      setEstimateData(data);
      toast.success('Kalman estimation complete');
      loadState();
    } catch (err: any) {
      console.error('Estimation error:', err);
      toast.error(err.message || 'Estimation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const calibrateFilter = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in');
        return;
      }

      const { data, error } = await supabase.functions.invoke('kalman-estimate', {
        body: { action: 'calibrate', metric: selectedMetric }
      });

      if (error) throw error;

      toast.success('Filter calibrated successfully');
      if (data?.calibration?.recommendations) {
        toast.info(data.calibration.recommendations.substring(0, 100) + '...');
      }
    } catch (err: any) {
      toast.error(err.message || 'Calibration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Kalman Filter Estimation Engine
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time metric estimation with AI-powered anomaly detection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-64 bg-card border-border">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={runEstimation} 
            disabled={isLoading}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
            Run Estimation
          </Button>
          <Button variant="outline" onClick={calibrateFilter} disabled={isLoading}>
            <Settings className="w-4 h-4 mr-2" />
            Calibrate
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {estimateData && (
        <div className="grid grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimated Value</p>
                  <p className="text-2xl font-bold text-amber-400">
                    ${(estimateData.estimated_value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <Target className="w-8 h-8 text-amber-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Trend</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">
                      {Math.abs(estimateData.trend || 0).toFixed(2)}
                    </p>
                    {(estimateData.trend || 0) >= 0 ? (
                      <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Kalman Gain</p>
                  <p className="text-2xl font-bold">{(estimateData.kalman_gain || 0).toFixed(4)}</p>
                </div>
                <Gauge className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <Progress value={(estimateData.kalman_gain || 0) * 100} className="mt-2 h-1" />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Signal/Noise</p>
                  <p className="text-2xl font-bold">{(estimateData.signal_to_noise_ratio || 0).toFixed(2)}</p>
                </div>
                <Activity className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <Badge 
                variant={(estimateData.signal_to_noise_ratio || 0) > 3 ? 'default' : 'secondary'}
                className="mt-2"
              >
                {(estimateData.signal_to_noise_ratio || 0) > 5 ? 'Excellent' : 
                 (estimateData.signal_to_noise_ratio || 0) > 3 ? 'Good' : 'Needs Data'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Data Quality</p>
                  <p className="text-2xl font-bold">{((estimateData.data_quality_score || 0) * 100).toFixed(0)}%</p>
                </div>
                <Shield className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <Progress value={(estimateData.data_quality_score || 0) * 100} className="mt-2 h-1" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="estimation" className="data-[state=active]:bg-amber-500/20">
            <Target className="w-4 h-4 mr-2" />
            Estimation
          </TabsTrigger>
          <TabsTrigger value="forecast" className="data-[state=active]:bg-amber-500/20">
            <LineChart className="w-4 h-4 mr-2" />
            Forecasts
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="data-[state=active]:bg-amber-500/20">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Anomalies
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-amber-500/20">
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="sources" className="data-[state=active]:bg-amber-500/20">
            <BarChart3 className="w-4 h-4 mr-2" />
            Data Sources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="estimation">
          <MetricEstimationPanel 
            estimateData={estimateData} 
            historicalEstimates={historicalEstimates}
            metric={selectedMetric}
          />
        </TabsContent>

        <TabsContent value="forecast">
          <ForecastPanel 
            forecasts={estimateData?.forecasts || []} 
            metric={selectedMetric}
          />
        </TabsContent>

        <TabsContent value="anomalies">
          <AnomalyPanel 
            anomalies={estimateData?.anomalies || []} 
            metric={selectedMetric}
          />
        </TabsContent>

        <TabsContent value="insights">
          <AIInsightsPanel 
            insight={estimateData?.ai_insight} 
            metric={selectedMetric}
            estimateData={estimateData}
          />
        </TabsContent>

        <TabsContent value="sources">
          <DataSourcesPanel metric={selectedMetric} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
