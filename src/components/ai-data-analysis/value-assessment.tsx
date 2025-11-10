import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Activity, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function ValueAssessment() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [valuation, setValuation] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [optimizations, setOptimizations] = useState<any[]>([]);
  const { toast } = useToast();

  const runValuation = async () => {
    setIsCalculating(true);
    try {
      const { data, error } = await supabase.functions.invoke("value-assessment", {
        body: { action: "valuation" }
      });

      if (error) throw error;

      setValuation(data);
      toast({
        title: "Valuation Complete",
        description: `Enterprise value: $${(data.value / 1000000).toFixed(1)}M`,
      });
    } catch (error: any) {
      toast({
        title: "Calculation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const forecastValue = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("value-assessment", {
        body: { action: "forecast", months: 12 }
      });

      if (error) throw error;

      setForecast(data.forecast || []);
      toast({
        title: "Forecast Generated",
        description: "12-month valuation projection ready",
      });
    } catch (error: any) {
      toast({
        title: "Forecast Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const optimizeLevers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("value-assessment", {
        body: { action: "optimize", currentValuation: valuation }
      });

      if (error) throw error;

      setOptimizations(data.optimizations || []);
      toast({
        title: "Optimization Analysis Complete",
        description: `${data.optimizations?.length || 0} value levers identified`,
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button onClick={runValuation} disabled={isCalculating} className="gap-2">
          <TrendingUp className="w-4 h-4" />
          {isCalculating ? "Calculating..." : "Run Valuation"}
        </Button>
        <Button onClick={forecastValue} variant="outline" className="gap-2" disabled={!valuation}>
          <Activity className="w-4 h-4" />
          Forecast Value
        </Button>
        <Button onClick={optimizeLevers} variant="secondary" className="gap-2" disabled={!valuation}>
          <Lightbulb className="w-4 h-4" />
          Optimize Levers
        </Button>
      </div>

      {valuation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl">Enterprise Valuation</CardTitle>
              <CardDescription>Real-time company value assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-end gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                  >
                    ${(valuation.value / 1000000).toFixed(1)}M
                  </motion.div>
                  {valuation.change && (
                    <Badge variant={valuation.change > 0 ? "default" : "destructive"} className="mb-2">
                      {valuation.change > 0 ? "+" : ""}{valuation.change}% MoM
                    </Badge>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {valuation.drivers?.map((driver: any, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 rounded-lg bg-card/50 backdrop-blur border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">{driver.name}</span>
                        <BarChart3 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">{driver.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{driver.impact}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {forecast.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Valuation Forecast</CardTitle>
                <CardDescription>12-month projection with confidence intervals</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={forecast}>
                    <defs>
                      <linearGradient id="valuationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="high" 
                      stroke="hsl(var(--primary))" 
                      fill="url(#valuationGradient)"
                      fillOpacity={0.2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="url(#valuationGradient)"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="low" 
                      stroke="hsl(var(--primary))" 
                      fill="url(#valuationGradient)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {optimizations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Value Optimization Levers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {optimizations.map((opt, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-lg bg-card border border-primary/20 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{opt.lever}</p>
                        <p className="text-sm text-muted-foreground">{opt.action}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        +${(opt.impact / 1000000).toFixed(1)}M
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
