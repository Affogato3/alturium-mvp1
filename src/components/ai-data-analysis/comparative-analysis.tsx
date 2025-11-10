import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flag, TrendingDown, BookOpen, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

export function ComparativeAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { toast } = useToast();

  const runBenchmark = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("comparative-analysis", {
        body: { action: "benchmark", industry: "saas" }
      });

      if (error) throw error;

      setBenchmarkData(data);
      toast({
        title: "Benchmark Complete",
        description: "Industry comparison analysis ready",
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRecommendations = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("comparative-analysis", {
        body: { action: "recommendations", benchmarkData }
      });

      if (error) throw error;

      setRecommendations(data.recommendations || []);
      toast({
        title: "Recommendations Generated",
        description: `${data.recommendations?.length || 0} optimization suggestions`,
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button onClick={runBenchmark} disabled={isAnalyzing} className="gap-2">
          <Flag className="w-4 h-4" />
          {isAnalyzing ? "Analyzing..." : "Run Benchmark Scan"}
        </Button>
        <Button onClick={getRecommendations} variant="outline" className="gap-2" disabled={!benchmarkData}>
          <Lightbulb className="w-4 h-4" />
          AI Recommendation
        </Button>
      </div>

      {benchmarkData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle>Industry Benchmark Comparison</CardTitle>
              <CardDescription>Your metrics vs. industry standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {benchmarkData.metrics?.map((metric: any, idx: number) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <Badge variant={metric.percentile > 60 ? "default" : "secondary"}>
                          {metric.percentile}th percentile
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.percentile}%` }}
                              className="h-full bg-primary rounded-full"
                              transition={{ duration: 1, delay: idx * 0.1 }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground w-20 text-right">
                          {metric.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {benchmarkData.radarData && (
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={benchmarkData.radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="metric" stroke="hsl(var(--foreground))" />
                      <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                      <Radar name="Your Company" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                      <Radar name="Industry Avg" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {benchmarkData.gaps && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                  Performance Gaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {benchmarkData.gaps.map((gap: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-card">
                      <Badge variant="outline" className="mt-1">{gap.severity}</Badge>
                      <div className="flex-1">
                        <p className="font-medium">{gap.metric}</p>
                        <p className="text-sm text-muted-foreground">{gap.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                AI Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-card border border-primary/20"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <p className="flex-1 text-sm">{rec}</p>
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
