import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TrendingUp, CheckCircle, XCircle, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function OutcomeTracker() {
  const [outcomes, setOutcomes] = useState<any[]>([]);
  const [selectedOutcome, setSelectedOutcome] = useState<any>(null);

  const loadOutcomes = async () => {
    toast.loading("Loading historical outcomes...");
    try {
      const { data, error } = await supabase.functions.invoke('market-synapse', {
        body: { action: 'get_outcomes', period: '90d' }
      });

      if (error) throw error;

      setOutcomes(data.outcomes || []);
      toast.success("Outcomes loaded");
    } catch (error: any) {
      toast.error(error.message || "Failed to load");
    } finally {
      toast.dismiss();
    }
  };

  const accuracyData = [
    { month: 'Jan', predicted: 92, actual: 89 },
    { month: 'Feb', predicted: 91, actual: 93 },
    { month: 'Mar', predicted: 95, actual: 94 },
    { month: 'Apr', predicted: 93, actual: 91 },
    { month: 'May', predicted: 96, actual: 95 },
    { month: 'Jun', predicted: 97, actual: 96 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Outcome Tracker</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Historical performance of AI recommendations
          </p>
        </div>
        <Button onClick={loadOutcomes} className="gap-2">
          <TrendingUp className="w-4 h-4" />
          Load Results
        </Button>
      </div>

      {/* Accuracy Chart */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
        <h3 className="text-lg font-semibold mb-4">Prediction Accuracy Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={accuracyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" domain={[85, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                border: '1px solid rgba(207, 175, 110, 0.2)',
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#CFAF6E"
              strokeWidth={3}
              dot={{ fill: '#CFAF6E', r: 5 }}
              name="Predicted"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ fill: '#22c55e', r: 5 }}
              name="Actual"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Outcomes Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {outcomes.map((outcome, idx) => (
          <motion.div
            key={outcome.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {outcome.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <Badge variant={outcome.success ? "default" : "destructive"}>
                    {outcome.success ? 'Successful' : 'Ineffective'}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{outcome.date}</span>
              </div>

              <h4 className="font-semibold mb-2">{outcome.action}</h4>
              <p className="text-sm text-muted-foreground mb-3">{outcome.description}</p>

              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Predicted Impact:</span>
                  <span className="font-semibold">{outcome.predicted_impact}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Actual Impact:</span>
                  <span className="font-semibold text-primary">{outcome.actual_impact}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="font-semibold text-primary">{outcome.accuracy}%</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {outcomes.length === 0 && (
        <Card className="p-12 bg-background/50 backdrop-blur-sm border-primary/20">
          <div className="text-center text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No outcome data available yet</p>
            <p className="text-sm mt-2">Execute actions to build historical performance data</p>
          </div>
        </Card>
      )}
    </div>
  );
}
