import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Area, AreaChart, ReferenceLine
} from 'recharts';
import { Target, TrendingUp, Activity } from 'lucide-react';

interface MetricEstimationPanelProps {
  estimateData: any;
  historicalEstimates: any[];
  metric: string;
}

export const MetricEstimationPanel: React.FC<MetricEstimationPanelProps> = ({
  estimateData,
  historicalEstimates,
  metric
}) => {
  const chartData = historicalEstimates.slice().reverse().map((est, i) => ({
    time: new Date(est.timestamp).toLocaleTimeString(),
    estimate: est.estimated_value,
    ci95Upper: est.confidence_interval_95_upper,
    ci95Lower: est.confidence_interval_95_lower,
    ci68Upper: est.confidence_interval_68_upper,
    ci68Lower: est.confidence_interval_68_lower
  }));

  const formatCurrency = (value: number) => {
    if (metric === 'churn' || metric === 'conversion') {
      return `${(value * 100).toFixed(2)}%`;
    }
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main Estimation Chart */}
      <Card className="col-span-2 bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            Real-Time Estimation with Confidence Bands
          </CardTitle>
          <CardDescription>
            Kalman filter estimate (gold) with 95% confidence interval (shaded)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(v) => metric === 'churn' || metric === 'conversion' ? `${(v*100).toFixed(1)}%` : `$${(v/1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area 
                  type="monotone" 
                  dataKey="ci95Upper" 
                  stroke="none"
                  fill="hsl(var(--primary) / 0.1)"
                  name="95% CI Upper"
                />
                <Area 
                  type="monotone" 
                  dataKey="ci95Lower" 
                  stroke="none"
                  fill="hsl(var(--background))"
                  name="95% CI Lower"
                />
                <Line 
                  type="monotone" 
                  dataKey="estimate" 
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', r: 4 }}
                  name="Estimate"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Estimation Details */}
      <div className="space-y-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Current Estimate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-amber-400">
                  {formatCurrency(estimateData?.estimated_value || 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Best estimate of true {metric.toUpperCase()}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">95% Confidence</span>
                  <span>
                    {formatCurrency(estimateData?.confidence_interval?.lower_95 || 0)} - {formatCurrency(estimateData?.confidence_interval?.upper_95 || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">68% Confidence</span>
                  <span>
                    {formatCurrency(estimateData?.confidence_interval?.lower_68 || 0)} - {formatCurrency(estimateData?.confidence_interval?.upper_68 || 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Filter Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Kalman Gain</span>
              <Badge variant="outline">
                {(estimateData?.kalman_gain || 0).toFixed(4)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {(estimateData?.kalman_gain || 0) > 0.5 
                ? 'High gain: New measurements weighted heavily' 
                : 'Low gain: Predictions weighted heavily'}
            </p>

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-muted-foreground">Innovation</span>
              <Badge variant={(estimateData?.innovation || 0) > 0 ? 'default' : 'secondary'}>
                {(estimateData?.innovation || 0).toFixed(2)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.abs(estimateData?.innovation || 0) < 1000 
                ? 'Low surprise: Model predictions accurate'
                : 'High surprise: Recent data differs from prediction'}
            </p>

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-muted-foreground">Signal/Noise</span>
              <Badge 
                variant={(estimateData?.signal_to_noise_ratio || 0) > 3 ? 'default' : 'destructive'}
              >
                {(estimateData?.signal_to_noise_ratio || 0).toFixed(2)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {(estimateData?.signal_to_noise_ratio || 0) > 5 
                ? 'Excellent signal clarity'
                : (estimateData?.signal_to_noise_ratio || 0) > 3 
                  ? 'Good signal quality'
                  : 'Noisy data - consider more sources'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium">Trend Analysis</span>
            </div>
            <p className="text-2xl font-bold">
              {(estimateData?.trend || 0) >= 0 ? '+' : ''}{(estimateData?.trend || 0).toFixed(2)}
              <span className="text-sm text-muted-foreground ml-1">per period</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {(estimateData?.trend || 0) > 0 
                ? `${metric.toUpperCase()} is trending upward`
                : (estimateData?.trend || 0) < 0 
                  ? `${metric.toUpperCase()} is trending downward`
                  : `${metric.toUpperCase()} is stable`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
