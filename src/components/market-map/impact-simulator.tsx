import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TrendingDown, TrendingUp, Target, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

export function ImpactSimulator() {
  const [duration, setDuration] = useState([45]);
  const [severity, setSeverity] = useState([5]);
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSimulate = async () => {
    setSimulating(true);
    toast.loading("Running impact simulation...");

    try {
      const { data, error } = await supabase.functions.invoke('market-synapse', {
        body: {
          action: 'simulate_impact',
          duration: duration[0],
          severity: severity[0],
          event_type: 'supply_chain_disruption'
        }
      });

      if (error) throw error;

      setResults(data);
      toast.success("Simulation complete");
    } catch (error: any) {
      toast.error(error.message || "Simulation failed");
    } finally {
      setSimulating(false);
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
        <h2 className="text-2xl font-bold mb-4">Impact Simulation Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Event Duration: {duration[0]} days
              </label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={1}
                max={180}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Severity Level: {severity[0]}/10
              </label>
              <Slider
                value={severity}
                onValueChange={setSeverity}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button
              onClick={handleSimulate}
              disabled={simulating}
              size="lg"
              className="w-full h-24 text-lg gap-3"
            >
              <Target className={`w-6 h-6 ${simulating ? 'animate-spin' : ''}`} />
              {simulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Impact Metrics */}
          <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4">Impact Metrics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Revenue Impact</span>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  <span className="font-bold text-destructive">
                    {results.revenue_impact}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Margin Impact</span>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  <span className="font-bold text-destructive">
                    {results.margin_impact}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cost Increase</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-destructive" />
                  <span className="font-bold text-destructive">
                    {results.cost_increase}%
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Confidence</span>
                  <span className="font-bold text-primary">
                    {results.confidence}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Impact Curve */}
          <Card className="lg:col-span-2 p-6 bg-background/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4">Impact Timeline</h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={results.timeline || []}>
                <defs>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CFAF6E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#CFAF6E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPessimistic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOptimistic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 10, 10, 0.9)',
                    border: '1px solid rgba(207, 175, 110, 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="optimistic"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorOptimistic)"
                />
                <Area
                  type="monotone"
                  dataKey="baseline"
                  stroke="#CFAF6E"
                  fillOpacity={1}
                  fill="url(#colorBaseline)"
                />
                <Area
                  type="monotone"
                  dataKey="pessimistic"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorPessimistic)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
