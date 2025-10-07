import { useState } from "react";
import { DollarSign, Package, TrendingUp, Beaker, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Department {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  kpis: { label: string; value: string; trend: number }[];
  position: { top?: string; left?: string; right?: string; bottom?: string };
}

export const DepartmentalPortals = () => {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const departments: Department[] = [
    {
      id: "finance",
      name: "Finance",
      icon: DollarSign,
      color: "#FFD700",
      position: { top: "10%", left: "10%" },
      kpis: [
        { label: "Capital Efficiency", value: "94.2%", trend: 2.3 },
        { label: "Debt-Asset Ratio", value: "0.42", trend: -0.5 },
        { label: "ROI", value: "18.7%", trend: 1.8 },
      ],
    },
    {
      id: "supply-chain",
      name: "Supply Chain",
      icon: Package,
      color: "#00FFFF",
      position: { top: "15%", right: "10%" },
      kpis: [
        { label: "Route Efficiency", value: "87.3%", trend: 3.1 },
        { label: "Carbon Cost", value: "$2.4M", trend: -1.2 },
        { label: "Delivery Time", value: "4.2 days", trend: -0.8 },
      ],
    },
    {
      id: "marketing",
      name: "Marketing",
      icon: TrendingUp,
      color: "#FF6B9D",
      position: { bottom: "15%", left: "12%" },
      kpis: [
        { label: "Ad ROI", value: "4.2x", trend: 0.7 },
        { label: "Customer LTV", value: "$12,400", trend: 5.2 },
        { label: "Conversion Rate", value: "8.9%", trend: 1.3 },
      ],
    },
    {
      id: "rd",
      name: "R&D",
      icon: Beaker,
      color: "#A78BFA",
      position: { bottom: "10%", right: "15%" },
      kpis: [
        { label: "Pipeline Value", value: "$47M", trend: 12.3 },
        { label: "Success Rate", value: "34%", trend: 2.1 },
        { label: "Time to Market", value: "8.3 mo", trend: -1.5 },
      ],
    },
    {
      id: "hr",
      name: "HR",
      icon: Users,
      color: "#10B981",
      position: { top: "50%", left: "50%" },
      kpis: [
        { label: "Productivity", value: "142%", trend: 4.2 },
        { label: "Retention", value: "94%", trend: 1.8 },
        { label: "Cost per Employee", value: "$87K", trend: -0.3 },
      ],
    },
  ];

  return (
    <>
      {departments.map((dept) => {
        const Icon = dept.icon;
        return (
          <button
            key={dept.id}
            className="absolute group cursor-pointer"
            style={dept.position}
            onClick={() => setSelectedDept(dept)}
          >
            {/* Orb */}
            <div
              className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-125"
              style={{
                background: `radial-gradient(circle, ${dept.color}40, transparent)`,
                boxShadow: `0 0 20px ${dept.color}60`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: dept.color,
                  boxShadow: `0 0 10px ${dept.color}`,
                }}
              >
                <Icon className="w-4 h-4 text-black" />
              </div>

              {/* Pulse animation */}
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: dept.color }}
              />
            </div>

            {/* Label on hover */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <Badge
                variant="outline"
                className="bg-black/80 border-primary/20 text-xs"
              >
                {dept.name}
              </Badge>
            </div>
          </button>
        );
      })}

      {/* Department Detail Dialog */}
      <Dialog open={!!selectedDept} onOpenChange={() => setSelectedDept(null)}>
        <DialogContent className="bg-black/95 border-primary/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedDept && (
                <>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: selectedDept.color }}
                  >
                    {selectedDept.icon && <selectedDept.icon className="w-4 h-4 text-black" />}
                  </div>
                  {selectedDept.name} Department
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedDept && (
            <div className="space-y-4 mt-4">
              <div className="text-sm text-primary/60">
                Division-level optimization metrics
              </div>

              <div className="space-y-3">
                {selectedDept.kpis.map((kpi) => (
                  <Card key={kpi.label} className="bg-black/60 border-primary/10 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-primary/60">{kpi.label}</span>
                      <Badge
                        variant="outline"
                        className={
                          kpi.trend > 0
                            ? "text-green-400 border-green-400/40"
                            : "text-red-400 border-red-400/40"
                        }
                      >
                        {kpi.trend > 0 ? "+" : ""}
                        {kpi.trend.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                  </Card>
                ))}
              </div>

              <div className="pt-2 border-t border-primary/10">
                <div className="text-xs text-primary/40">
                  Cross-divisional synergy simulations available
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
