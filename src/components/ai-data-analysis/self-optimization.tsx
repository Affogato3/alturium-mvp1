import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, BarChart3, Brain, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";

export function SelfOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);
  const [modelUpdate, setModelUpdate] = useState<any>(null);
  const { toast } = useToast();

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate learning cycles
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const { data, error } = await supabase.functions.invoke("self-optimization", {
        body: { action: "optimize" }
      });

      if (error) throw error;

      clearInterval(interval);
      setOptimizationProgress(100);
      setModelUpdate(data);
      
      toast({
        title: "Self-Optimization Complete",
        description: `Accuracy improved to ${data.accuracy}%`,
      });
    } catch (error: any) {
      clearInterval(interval);
      toast({
        title: "Optimization Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const viewHistory = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("self-optimization", {
        body: { action: "history" }
      });

      if (error) throw error;

      setPerformanceHistory(data.history || []);
      toast({
        title: "History Loaded",
        description: "Performance timeline retrieved",
      });
    } catch (error: any) {
      toast({
        title: "Load Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button onClick={runOptimization} disabled={isOptimizing} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
          {isOptimizing ? "Optimizing..." : "Run Self-Optimization"}
        </Button>
        <Button onClick={viewHistory} variant="outline" className="gap-2">
          <BarChart3 className="w-4 h-4" />
          Performance History
        </Button>
      </div>

      {isOptimizing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Learning Cycles</span>
                  <span className="text-sm text-muted-foreground">{optimizationProgress}%</span>
                </div>
                <Progress value={optimizationProgress} className="h-2" />
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="w-5 h-5 text-primary" />
                  </motion.div>
                  <span>AI model retraining in progress...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {modelUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/5 border-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Model Update Complete
                </CardTitle>
                <Badge variant="default">v{modelUpdate.version}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Forecast Accuracy</div>
                  <div className="text-3xl font-bold text-primary">{modelUpdate.accuracy}%</div>
                  {modelUpdate.improvement && (
                    <Badge variant="secondary">+{modelUpdate.improvement}% improvement</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Training Cycles</div>
                  <div className="text-3xl font-bold">{modelUpdate.cycles}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Confidence Score</div>
                  <div className="text-3xl font-bold">{modelUpdate.confidence}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {modelUpdate.explanation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Model Update Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {modelUpdate.explanation}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {performanceHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Performance Timeline</CardTitle>
              <CardDescription>Model accuracy improvement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[80, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-semibold">Key Milestones</h4>
                {performanceHistory.filter(h => h.milestone).map((milestone, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/30">
                    <Badge variant="outline">{milestone.date}</Badge>
                    <span className="text-muted-foreground">{milestone.milestone}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
