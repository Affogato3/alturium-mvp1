import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, DollarSign, Percent } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ROIResult {
  roi_percentage: number;
  payback_period_months: number;
  net_benefits: number;
  revenue_increase: number;
  cost_reduction: number;
  efficiency_gain: number;
  recommendations: string[];
}

export const ROICalculator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ROIResult | null>(null);
  const [inputs, setInputs] = useState({
    implementation_cost: 50000,
    annual_revenue: 5000000,
    employee_count: 50,
    current_reporting_hours: 12,
  });
  const { toast } = useToast();

  const calculateROI = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('calculate-roi', {
        body: inputs
      });

      if (error) throw error;

      setResult(data.roi);
      toast({
        title: "ROI Calculated",
        description: `Expected ROI: ${data.roi.roi_percentage.toFixed(1)}%`,
      });
    } catch (error) {
      console.error('Error calculating ROI:', error);
      toast({
        title: "Calculation Failed",
        description: "Unable to calculate ROI",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">ROI Calculator</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="implementation_cost">Implementation Cost ($)</Label>
            <Input
              id="implementation_cost"
              type="number"
              value={inputs.implementation_cost}
              onChange={(e) => setInputs({...inputs, implementation_cost: parseInt(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annual_revenue">Annual Revenue ($)</Label>
            <Input
              id="annual_revenue"
              type="number"
              value={inputs.annual_revenue}
              onChange={(e) => setInputs({...inputs, annual_revenue: parseInt(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee_count">Employee Count</Label>
            <Input
              id="employee_count"
              type="number"
              value={inputs.employee_count}
              onChange={(e) => setInputs({...inputs, employee_count: parseInt(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reporting_hours">Weekly Reporting Hours</Label>
            <Input
              id="reporting_hours"
              type="number"
              value={inputs.current_reporting_hours}
              onChange={(e) => setInputs({...inputs, current_reporting_hours: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <Button
          onClick={calculateROI}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Calculating..." : "Calculate ROI"}
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-4 border-t border-border"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">ROI</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {result.roi_percentage.toFixed(1)}%
                </p>
              </div>

              <div className="p-4 bg-green-500/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Payback Period</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {result.payback_period_months} mo
                </p>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Net Benefits</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  ${(result.net_benefits / 1000).toFixed(0)}K
                </p>
              </div>

              <div className="p-4 bg-yellow-500/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Revenue Increase</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  +{result.revenue_increase}%
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Cost Reduction</span>
                  <span className="text-foreground font-medium">{result.cost_reduction}%</span>
                </div>
                <Progress value={result.cost_reduction} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Efficiency Gain</span>
                  <span className="text-foreground font-medium">{result.efficiency_gain}%</span>
                </div>
                <Progress value={result.efficiency_gain} className="h-2" />
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-accent/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Recommendations:</h4>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Card>
  );
};
