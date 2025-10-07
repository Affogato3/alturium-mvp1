import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Download, Save, FileText } from "lucide-react";
import { toast } from "sonner";

export const ProfitCurvatureConsole = () => {
  const [activeTab, setActiveTab] = useState("gradient");

  const gradientData = [
    { variable: "Pricing", sensitivity: 8.7, delta: 0.43 },
    { variable: "Marketing", sensitivity: 6.2, delta: 0.31 },
    { variable: "Supply Chain", sensitivity: 5.8, delta: 0.29 },
    { variable: "R&D Budget", sensitivity: 4.1, delta: 0.21 },
    { variable: "Headcount", sensitivity: 2.9, delta: 0.15 },
  ];

  const temporalData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    profitDelta: Math.sin(i / 3) * 5 + Math.random() * 2 + 3,
    optimalTiming: Math.sin((i + 2) / 3) * 6 + 4,
  }));

  const forecastData = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    actual: 100 + i * 5 + Math.random() * 10,
    projected: 100 + i * 6 + Math.random() * 8,
  }));

  const handleGenerateReport = () => {
    toast.success("Generating comprehensive profit analysis report...");
  };

  const handleSaveSnapshot = () => {
    toast.success("Configuration snapshot saved to cloud");
  };

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-primary/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-white">Profit Curvature Console</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveSnapshot}
            className="border-primary/20"
          >
            <Save className="w-4 h-4 mr-1" />
            Snapshot
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateReport}
            className="border-primary/20"
          >
            <FileText className="w-4 h-4 mr-1" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-black/60">
          <TabsTrigger value="gradient">Profit Gradient</TabsTrigger>
          <TabsTrigger value="temporal">Temporal Arbitrage</TabsTrigger>
          <TabsTrigger value="forecast">Forecast Overlay</TabsTrigger>
        </TabsList>

        <TabsContent value="gradient" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Gradient Heatmap */}
            <Card className="bg-black/60 border-primary/10 p-4">
              <h4 className="text-sm font-bold text-white mb-3">Sensitivity Heatmap (∂P/∂x)</h4>
              <div className="space-y-2">
                {gradientData.map((item) => (
                  <div key={item.variable} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-primary/60">{item.variable}</span>
                      <Badge 
                        variant="outline" 
                        className={item.sensitivity > 6 ? "text-green-400 border-green-400/40" : "text-yellow-400 border-yellow-400/40"}
                      >
                        {item.sensitivity.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary/40 to-primary h-2 rounded-full"
                        style={{ width: `${(item.sensitivity / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Profit Curvature Chart */}
            <Card className="bg-black/60 border-primary/10 p-4">
              <h4 className="text-sm font-bold text-white mb-3">Curvature Visualization</h4>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={gradientData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.1)" />
                  <XAxis dataKey="variable" tick={{ fill: '#999', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#999', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.9)', 
                      border: '1px solid rgba(0,255,255,0.2)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sensitivity" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.3)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="temporal" className="space-y-4">
          <Card className="bg-black/60 border-primary/10 p-4">
            <h4 className="text-sm font-bold text-white mb-3">
              Temporal Profit Delta (ΔP/Δt) - Next 24 Hours
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={temporalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.1)" />
                <XAxis dataKey="hour" tick={{ fill: '#999', fontSize: 10 }} />
                <YAxis tick={{ fill: '#999', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(0,255,255,0.2)',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="profitDelta" 
                  stroke="#00FFFF" 
                  strokeWidth={2} 
                  dot={false} 
                  name="Current"
                />
                <Line 
                  type="monotone" 
                  dataKey="optimalTiming" 
                  stroke="#FFD700" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                  name="Optimal"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-[#00FFFF]" />
                <span className="text-primary/60">Current Path</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-[#FFD700]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #FFD700 0, #FFD700 5px, transparent 5px, transparent 10px)' }} />
                <span className="text-primary/60">Optimal Timing</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card className="bg-black/60 border-primary/10 p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-white">12-Month Forecast</h4>
              <div className="flex gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/40">
                  Accuracy: 94.3%
                </Badge>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.1)" />
                <XAxis dataKey="month" tick={{ fill: '#999', fontSize: 10 }} />
                <YAxis tick={{ fill: '#999', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(0,255,255,0.2)',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#00FFFF" 
                  fill="rgba(0, 255, 255, 0.2)" 
                  name="Actual"
                />
                <Area 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="#FFD700" 
                  fill="rgba(255, 215, 0, 0.2)" 
                  name="Projected"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
