import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap, DollarSign, Target } from "lucide-react";

interface DepartmentAllocation {
  id: string;
  name: string;
  currentBudget: number;
  optimalBudget: number;
  roi: number;
  profitImpact: number;
}

export const AIProfitOptimizer = () => {
  const [departments, setDepartments] = useState<DepartmentAllocation[]>([
    { id: "marketing", name: "Marketing", currentBudget: 500, optimalBudget: 620, roi: 3.2, profitImpact: 8.4 },
    { id: "rd", name: "R&D", currentBudget: 800, optimalBudget: 950, roi: 4.7, profitImpact: 12.3 },
    { id: "sales", name: "Sales", currentBudget: 600, optimalBudget: 540, roi: 2.8, profitImpact: -4.2 },
    { id: "operations", name: "Operations", currentBudget: 1200, optimalBudget: 1100, roi: 1.9, profitImpact: 6.1 },
    { id: "hr", name: "HR", currentBudget: 400, optimalBudget: 390, roi: 1.4, profitImpact: 2.8 },
  ]);

  const [optimizing, setOptimizing] = useState(false);
  const [totalProfitGain, setTotalProfitGain] = useState(0);

  useEffect(() => {
    const gain = departments.reduce((sum, dept) => sum + dept.profitImpact, 0);
    setTotalProfitGain(gain);
  }, [departments]);

  const handleOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setDepartments(prev => prev.map(dept => ({
        ...dept,
        currentBudget: dept.optimalBudget
      })));
      setOptimizing(false);
    }, 2000);
  };

  const handleBudgetChange = (deptId: string, value: number[]) => {
    setDepartments(prev => prev.map(dept =>
      dept.id === deptId ? { ...dept, currentBudget: value[0] } : dept
    ));
  };

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-black/60 border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-xs text-primary/60">Total Budget</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${departments.reduce((sum, d) => sum + d.currentBudget, 0)}K
          </div>
        </Card>

        <Card className="bg-black/60 border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-xs text-primary/60">Profit Gain</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            +{totalProfitGain.toFixed(1)}%
          </div>
        </Card>

        <Card className="bg-black/60 border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-primary/60">Avg ROI</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {(departments.reduce((sum, d) => sum + d.roi, 0) / departments.length).toFixed(1)}x
          </div>
        </Card>

        <Card className="bg-black/60 border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-xs text-primary/60">AI Status</span>
          </div>
          <Badge className="bg-green-400/20 text-green-400 border-green-400/40">
            Optimizing
          </Badge>
        </Card>
      </div>

      {/* Department Optimization */}
      <Card className="bg-black/60 border-primary/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Department Budget Allocation</h3>
          <Button
            onClick={handleOptimize}
            disabled={optimizing}
            className="bg-primary/20 hover:bg-primary/30 border border-primary/40"
          >
            {optimizing ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Auto-Optimize All
              </>
            )}
          </Button>
        </div>

        <div className="space-y-6">
          {departments.map((dept) => {
            const difference = dept.optimalBudget - dept.currentBudget;
            const percentDiff = (difference / dept.currentBudget) * 100;

            return (
              <div key={dept.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">{dept.name}</div>
                    <div className="text-xs text-primary/60">
                      ROI: {dept.roi}x • Impact: {dept.profitImpact > 0 ? '+' : ''}{dept.profitImpact.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">${dept.currentBudget}K</div>
                    <div className={`text-xs ${difference > 0 ? 'text-green-400' : difference < 0 ? 'text-red-400' : 'text-primary/60'}`}>
                      {difference > 0 ? '+' : ''}{difference}K ({percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%)
                    </div>
                  </div>
                </div>

                <Slider
                  value={[dept.currentBudget]}
                  onValueChange={(value) => handleBudgetChange(dept.id, value)}
                  min={100}
                  max={2000}
                  step={10}
                  className="w-full"
                />

                {/* Mini Heatmap */}
                <div className="grid grid-cols-10 gap-1 h-2">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const intensity = Math.max(0, dept.roi - i * 0.5);
                    return (
                      <div
                        key={i}
                        className="rounded-sm transition-all duration-300"
                        style={{
                          backgroundColor: `rgba(34, 197, 94, ${Math.min(1, intensity / 5)})`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Micro-Decisions Feed */}
      <Card className="bg-black/60 border-primary/20 p-6">
        <h3 className="text-lg font-bold text-white mb-4">AI Micro-Decisions (Live)</h3>
        <div className="space-y-3">
          {[
            { action: "Increase digital ad spend by $12K", impact: "+2.3%", time: "2m ago", status: "applied" },
            { action: "Shift 5 developers from Project A to B", impact: "+1.8%", time: "8m ago", status: "applied" },
            { action: "Reduce inventory holding by 15%", impact: "+0.9%", time: "15m ago", status: "pending" },
            { action: "Adjust pricing algorithm for Region 3", impact: "+3.1%", time: "23m ago", status: "applied" },
          ].map((decision, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-black/40 border border-primary/10 rounded-lg hover:border-primary/30 transition-all group"
            >
              <div className="flex-1">
                <div className="text-sm text-white">{decision.action}</div>
                <div className="text-xs text-primary/40">{decision.time}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-green-400 font-bold">{decision.impact}</div>
                <Badge
                  variant="outline"
                  className={
                    decision.status === "applied"
                      ? "text-green-400 border-green-400/40"
                      : "text-yellow-400 border-yellow-400/40"
                  }
                >
                  {decision.status}
                </Badge>
              </div>
              {/* Ripple effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 bg-primary/5 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
