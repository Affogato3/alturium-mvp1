import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { LineChart, Calendar, Target, TrendingUp, ArrowRight } from 'lucide-react';

interface ForecastPanelProps {
  forecasts: any[];
  metric: string;
}

export const ForecastPanel: React.FC<ForecastPanelProps> = ({ forecasts, metric }) => {
  const formatCurrency = (value: number) => {
    if (metric === 'churn' || metric === 'conversion') {
      return `${(value * 100).toFixed(2)}%`;
    }
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const chartData = forecasts.map(f => ({
    date: new Date(f.date || f.forecast_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    predicted: f.predicted_value,
    upper: f.confidence_interval_upper,
    lower: f.confidence_interval_lower,
    confidence: (f.model_confidence || 0.8) * 100
  }));

  const monthEndForecast = forecasts.length > 0 ? forecasts[forecasts.length - 1] : null;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Forecast Chart */}
      <Card className="col-span-2 bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-amber-500" />
            30-Day Forecast with Confidence Bands
          </CardTitle>
          <CardDescription>
            Predicted values with 95% confidence intervals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
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
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'predicted' ? 'Prediction' : name === 'upper' ? '95% Upper' : '95% Lower'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="upper" 
                  stroke="none"
                  fill="hsl(var(--primary) / 0.15)"
                />
                <Area 
                  type="monotone" 
                  dataKey="lower" 
                  stroke="none"
                  fill="hsl(var(--background))"
                />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#forecastGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Details */}
      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Month-End Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthEndForecast ? (
              <div className="space-y-3">
                <p className="text-3xl font-bold text-amber-400">
                  {formatCurrency(monthEndForecast.predicted_value)}
                </p>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">95% Range</span>
                    <span>
                      {formatCurrency(monthEndForecast.confidence_interval_lower)} - {formatCurrency(monthEndForecast.confidence_interval_upper)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence</span>
                    <Badge variant="outline">
                      {((monthEndForecast.model_confidence || 0.8) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Run estimation to generate forecasts</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Forecast Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {forecasts.slice(0, 5).map((f, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      (f.model_confidence || 0.8) > 0.8 ? 'bg-emerald-500' :
                      (f.model_confidence || 0.8) > 0.6 ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <span className="text-muted-foreground">
                      {new Date(f.date || f.forecast_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <span className="font-medium">{formatCurrency(f.predicted_value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4" />
              Forecast Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Model Type</span>
                <Badge>Simple Trend</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Horizon</span>
                <span className="text-sm">{forecasts.length} days</span>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Confidence decreases further into the future. Short-term forecasts (1-7 days) are most reliable.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
