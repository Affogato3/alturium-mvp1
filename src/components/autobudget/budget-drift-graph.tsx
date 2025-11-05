import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ForecastData {
  date: string;
  actual: number;
  forecast: number;
  planned: number;
}

interface BudgetDriftGraphProps {
  data: ForecastData[];
}

export const BudgetDriftGraph = ({ data }: BudgetDriftGraphProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-primary/20 p-6">
      <h3 className="text-lg font-semibold mb-4">Budget Drift Forecast</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00E6F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00E6F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFB020" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FFB020" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Area
            type="monotone"
            dataKey="planned"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#colorPlanned)"
            name="Planned Budget"
          />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#00E6F6"
            strokeWidth={2}
            fill="url(#colorActual)"
            name="Actual Spend"
          />
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="#FFB020"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#colorForecast)"
            name="AI Forecast"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};