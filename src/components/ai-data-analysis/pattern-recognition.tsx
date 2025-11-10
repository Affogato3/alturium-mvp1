import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function PatternRecognition() {
  const [isScanning, setIsScanning] = useState(false);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [actionPlan, setActionPlan] = useState("");
  const { toast } = useToast();

  const scanForPatterns = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke("pattern-recognition", {
        body: { action: "scan", dataset: "revenue_marketing" }
      });

      if (error) throw error;

      setPatterns(data.patterns || []);
      toast({
        title: "Pattern Scan Complete",
        description: `Detected ${data.patterns?.length || 0} significant patterns`,
      });
    } catch (error: any) {
      toast({
        title: "Scan Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const viewAnomalies = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("pattern-recognition", {
        body: { action: "anomalies" }
      });

      if (error) throw error;

      setAnomalies(data.anomalies || []);
      toast({
        title: "Anomalies Detected",
        description: `Found ${data.anomalies?.length || 0} unusual deviations`,
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateActionPlan = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("pattern-recognition", {
        body: { action: "action_plan", patterns }
      });

      if (error) throw error;

      setActionPlan(data.plan || "");
      toast({
        title: "Action Plan Generated",
        description: "AI recommendations ready",
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
        <Button onClick={scanForPatterns} disabled={isScanning} className="gap-2">
          <Search className="w-4 h-4" />
          {isScanning ? "Scanning..." : "Scan for Patterns"}
        </Button>
        <Button onClick={viewAnomalies} variant="outline" className="gap-2">
          <AlertCircle className="w-4 h-4" />
          View Anomalies
        </Button>
        <Button onClick={generateActionPlan} variant="secondary" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Generate Action Plan
        </Button>
      </div>

      {patterns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4"
        >
          {patterns.map((pattern, idx) => (
            <Card key={idx} className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pattern.type}</CardTitle>
                  <Badge variant="secondary">
                    Confidence: {Math.round(pattern.confidence * 100)}%
                  </Badge>
                </div>
                <CardDescription>{pattern.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span>{pattern.insight}</span>
                  </div>
                  {pattern.chart_data && (
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={pattern.chart_data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {anomalies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold">Detected Anomalies</h3>
          {anomalies.map((anomaly, idx) => (
            <Card key={idx} className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <p className="font-medium">{anomaly.title}</p>
                    <p className="text-sm text-muted-foreground">{anomaly.description}</p>
                    <Badge variant="outline" className="mt-2">Impact: {anomaly.impact}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {actionPlan && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{actionPlan}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
