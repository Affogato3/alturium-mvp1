import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Package, AlertCircle } from 'lucide-react';

interface DrillDownData {
  department: string;
  categories: Array<{
    name: string;
    budget: number;
    spent: number;
  }>;
  topVendors: Array<{
    name: string;
    amount: number;
  }>;
  aiRecommendation: string;
}

interface DrillDownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DrillDownData | null;
}

export const DrillDownModal = ({
  open,
  onOpenChange,
  data,
}: DrillDownModalProps) => {
  if (!data) return null;

  const chartData = data.categories.map(cat => ({
    name: cat.name,
    variance: ((cat.spent - cat.budget) / cat.budget) * 100,
    spent: cat.spent,
    budget: cat.budget,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-card/95 backdrop-blur-xl border-primary/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{data.department} - Detailed Analysis</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Category breakdown */}
          <Card className="bg-card/50 p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Expense Categories
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Bar dataKey="variance" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.variance > 0 ? '#FFB020' : '#05CBA3'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top vendors */}
          <Card className="bg-card/50 p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Top Vendors by Spend
            </h3>
            <div className="space-y-3">
              {data.topVendors.map((vendor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{vendor.name}</span>
                  </div>
                  <span className="text-cyan-400 font-semibold">
                    ₹{vendor.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Recommendation */}
          <Card className="bg-primary/5 border-primary/20 p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              AI Recommendation
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {data.aiRecommendation}
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};