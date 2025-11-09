import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, AlertCircle, Send, BarChart3, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EmbeddedInsight {
  insight: string;
  reason: string;
  recommendation: string;
  confidence: number;
  impact: string;
  trend: "up" | "down" | "neutral";
}

export const EmbeddedAnalyticsPanel = () => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<EmbeddedInsight | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  const generateInsight = async (context: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('workflow-insights', {
        body: { 
          context,
          fields: {
            amount: 150000,
            stage: "Negotiation",
            last_activity: "2025-11-03"
          }
        }
      });

      if (error) throw error;

      setInsight(data.insight);
      toast({
        title: "Insight Generated",
        description: "AI analysis complete with contextual recommendations",
      });
    } catch (error) {
      console.error('Error generating insight:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to generate insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendToChannel = async (channel: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-alert', {
        body: {
          insight_id: `INS_${Date.now()}`,
          channels: [channel],
          message: insight?.insight
        }
      });

      if (error) throw error;

      toast({
        title: "Sent Successfully",
        description: `Insight shared to ${channel}`,
      });
    } catch (error) {
      console.error('Error sending alert:', error);
      toast({
        title: "Send Failed",
        description: "Unable to send notification",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          In-Workflow Intelligence
        </h3>
        <Button
          onClick={() => generateInsight("Sales Opportunity")}
          disabled={loading}
          size="sm"
          variant="outline"
        >
          {loading ? "Analyzing..." : "Generate Insight"}
        </Button>
      </div>

      {insight && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="space-y-4">
              {/* Confidence Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    insight.confidence > 0.85 ? 'bg-green-500' : 
                    insight.confidence > 0.7 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  } animate-pulse`} />
                  <span className="text-sm text-muted-foreground">
                    Confidence Score
                  </span>
                </div>
                <Badge variant="outline" className="font-mono">
                  {(insight.confidence * 100).toFixed(0)}%
                </Badge>
              </div>

              <Progress value={insight.confidence * 100} className="h-2" />

              {/* Main Insight */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  {insight.trend === "down" ? (
                    <TrendingDown className="h-5 w-5 text-destructive mt-0.5" />
                  ) : insight.trend === "up" ? (
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  )}
                  <div>
                    <p className="text-foreground font-medium">{insight.insight}</p>
                    <p className="text-sm text-muted-foreground mt-1">{insight.reason}</p>
                  </div>
                </div>
              </div>

              {/* Impact */}
              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium text-primary">Expected Impact:</span>
                <span className="text-sm text-foreground">{insight.impact}</span>
              </div>

              {/* Recommendation */}
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Recommended Action:</p>
                <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                  variant="outline"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {expanded ? "Hide" : "View"} Details
                </Button>
                <Button
                  size="sm"
                  onClick={() => sendToChannel("email")}
                  variant="outline"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send to Email
                </Button>
                <Button
                  size="sm"
                  onClick={() => sendToChannel("slack")}
                  variant="outline"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send to Slack
                </Button>
              </div>

              {/* Expanded Details */}
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pt-4 border-t border-border"
                >
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Data Source:</strong> CRM Pipeline (Synced 8 min ago)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Model:</strong> Anomaly Detection v2
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Historical Context:</strong> Based on 90-day trend analysis
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
