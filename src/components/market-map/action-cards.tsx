import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, FileText, Play, RotateCcw } from "lucide-react";

export function ActionCards() {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const generateActions = async () => {
    setLoading(true);
    toast.loading("Generating action recommendations...");

    try {
      const { data, error } = await supabase.functions.invoke('market-synapse', {
        body: { action: 'generate_actions', context: 'recent_events' }
      });

      if (error) throw error;

      setActions(data.actions || []);
      toast.success(`Generated ${data.actions?.length || 0} recommendations`);
    } catch (error: any) {
      toast.error(error.message || "Generation failed");
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  const approveAction = async (actionId: string) => {
    toast.loading("Executing action...");

    try {
      const { data, error } = await supabase.functions.invoke('market-synapse', {
        body: { action: 'execute_action', action_id: actionId }
      });

      if (error) throw error;

      toast.success("Action executed successfully");
      setActions(prev => prev.map(a => 
        a.id === actionId ? { ...a, status: 'executed' } : a
      ));
    } catch (error: any) {
      toast.error(error.message || "Execution failed");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Action Recommendations</h2>
        <Button onClick={generateActions} disabled={loading} className="gap-2">
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Generate Actions
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, idx) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Card
              className="relative p-6 bg-background/50 backdrop-blur-sm border-primary/20 cursor-pointer overflow-hidden"
              onClick={() => setFlippedCard(flippedCard === action.id ? null : action.id)}
            >
              {/* Breathing effect */}
              <motion.div
                className="absolute inset-0 border border-primary/30 rounded-lg"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Front of card */}
              <motion.div
                animate={{
                  rotateY: flippedCard === action.id ? 180 : 0
                }}
                transition={{ duration: 0.6 }}
                style={{
                  backfaceVisibility: 'hidden',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge variant={action.priority === 'high' ? 'destructive' : 'default'}>
                      {action.priority} priority
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      {action.confidence}% confidence
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>

                  <div className="pt-4 border-t border-border space-y-2">
                    <p className="text-sm font-medium">Expected Impact:</p>
                    <p className="text-2xl font-bold text-primary">{action.expected_impact}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        approveAction(action.id);
                      }}
                      disabled={action.status === 'executed'}
                      className="gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {action.status === 'executed' ? 'Executed' : 'Approve'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlippedCard(action.id);
                      }}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Explain
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Back of card */}
              {flippedCard === action.id && (
                <motion.div
                  className="absolute inset-0 p-6 bg-background/95 backdrop-blur-sm"
                  initial={{ rotateY: -180 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">Reasoning:</h4>
                    <p className="text-sm">{action.reasoning}</p>
                    
                    <div className="pt-3 border-t border-border">
                      <h4 className="font-semibold text-primary mb-2">Sources:</h4>
                      <ul className="text-sm space-y-1">
                        {action.sources?.map((source: string, i: number) => (
                          <li key={i} className="text-blue-400 underline">
                            • {source}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {actions.length === 0 && !loading && (
        <Card className="p-12 bg-background/50 backdrop-blur-sm border-primary/20">
          <div className="text-center text-muted-foreground">
            <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Click "Generate Actions" to create AI recommendations</p>
          </div>
        </Card>
      )}
    </div>
  );
}
