import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Sparkles, Play, Save, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ScenarioModeler = () => {
  const [revenueGrowth, setRevenueGrowth] = useState([15]);
  const [churnRate, setChurnRate] = useState([5]);
  const [cacChange, setCacChange] = useState([0]);
  const [isLoading, setIsLoading] = useState(false);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const { toast } = useToast();

  const generateScenarios = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('synapsex-ai-analyze', {
        body: { 
          analysisType: 'generate_scenarios',
          inputData: {
            revenue_growth: revenueGrowth[0] / 100,
            churn_rate: churnRate[0] / 100,
            cac_change: cacChange[0] / 100
          }
        }
      });

      if (error) throw error;

      setScenarios(data.result.scenarios);

      toast({
        title: "Scenarios Generated",
        description: "AI has created forecast scenarios based on your assumptions",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = scenarios.length > 0 ? [
    {
      quarter: 'Q1',
      Base: scenarios.find(s => s.type === 'base')?.forecast.q1_revenue / 1000000,
      Aggressive: scenarios.find(s => s.type === 'aggressive')?.forecast.q1_revenue / 1000000,
      Conservative: scenarios.find(s => s.type === 'conservative')?.forecast.q1_revenue / 1000000,
    },
    {
      quarter: 'Q2',
      Base: scenarios.find(s => s.type === 'base')?.forecast.q2_revenue / 1000000,
      Aggressive: scenarios.find(s => s.type === 'aggressive')?.forecast.q2_revenue / 1000000,
      Conservative: scenarios.find(s => s.type === 'conservative')?.forecast.q2_revenue / 1000000,
    },
    {
      quarter: 'Q3',
      Base: scenarios.find(s => s.type === 'base')?.forecast.q3_revenue / 1000000,
      Aggressive: scenarios.find(s => s.type === 'aggressive')?.forecast.q3_revenue / 1000000,
      Conservative: scenarios.find(s => s.type === 'conservative')?.forecast.q3_revenue / 1000000,
    },
    {
      quarter: 'Q4',
      Base: scenarios.find(s => s.type === 'base')?.forecast.q4_revenue / 1000000,
      Aggressive: scenarios.find(s => s.type === 'aggressive')?.forecast.q4_revenue / 1000000,
      Conservative: scenarios.find(s => s.type === 'conservative')?.forecast.q4_revenue / 1000000,
    },
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#CFAF6E]/20 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#CFAF6E]" />
            <h3 className="text-xl font-bold text-[#EDEDED]">Scenario Forecast</h3>
          </div>

          {scenarios.length > 0 ? (
            <div className="space-y-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis dataKey="quarter" stroke="#BFBFBF" />
                    <YAxis stroke="#BFBFBF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A1A1A', 
                        border: '1px solid #CFAF6E',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Base" stroke="#CFAF6E" strokeWidth={2} />
                    <Line type="monotone" dataKey="Aggressive" stroke="#22c55e" strokeWidth={2} />
                    <Line type="monotone" dataKey="Conservative" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {scenarios.map((scenario, idx) => (
                  <div key={idx} className="p-4 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[#EDEDED] font-semibold">{scenario.name}</h4>
                      <Badge className={
                        scenario.type === 'aggressive' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        scenario.type === 'conservative' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        'bg-[#CFAF6E]/20 text-[#CFAF6E] border-[#CFAF6E]/30'
                      }>
                        {(scenario.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#BFBFBF]">Q4 Revenue:</span>
                        <span className="text-[#EDEDED]">${(scenario.forecast.q4_revenue / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#BFBFBF]">Growth:</span>
                        <span className="text-[#EDEDED]">{(scenario.assumptions.revenue_growth * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#BFBFBF]">Churn:</span>
                        <span className="text-[#EDEDED]">{(scenario.assumptions.churn_rate * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-[#BFBFBF]">
              Configure assumptions and click "Generate Scenarios" to see forecasts
            </div>
          )}
        </Card>
      </div>

      <div>
        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#CFAF6E]/20 p-6">
          <h3 className="text-lg font-bold text-[#EDEDED] mb-6">Model Assumptions</h3>

          <div className="space-y-6">
            <div>
              <Label className="text-[#EDEDED] mb-2 block">Revenue Growth Rate</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={revenueGrowth}
                  onValueChange={setRevenueGrowth}
                  min={-20}
                  max={50}
                  step={1}
                  className="flex-1"
                />
                <span className="text-[#CFAF6E] font-semibold w-16 text-right">{revenueGrowth[0]}%</span>
              </div>
            </div>

            <div>
              <Label className="text-[#EDEDED] mb-2 block">Churn Rate</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={churnRate}
                  onValueChange={setChurnRate}
                  min={0}
                  max={20}
                  step={0.5}
                  className="flex-1"
                />
                <span className="text-[#CFAF6E] font-semibold w-16 text-right">{churnRate[0]}%</span>
              </div>
            </div>

            <div>
              <Label className="text-[#EDEDED] mb-2 block">CAC Change</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={cacChange}
                  onValueChange={setCacChange}
                  min={-50}
                  max={50}
                  step={5}
                  className="flex-1"
                />
                <span className="text-[#CFAF6E] font-semibold w-16 text-right">{cacChange[0]}%</span>
              </div>
            </div>

            <Button
              onClick={generateScenarios}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#CFAF6E] to-[#EDEDED] text-black hover:opacity-90 shadow-lg shadow-[#CFAF6E]/20"
            >
              <Play className="w-4 h-4 mr-2" />
              Generate Scenarios
            </Button>

            {scenarios.length > 0 && (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full bg-[#1A1A1A]/50 border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/20"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Scenario
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-[#1A1A1A]/50 border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};