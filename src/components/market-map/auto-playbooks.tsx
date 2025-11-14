import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookOpen, Plus, Play, Settings } from "lucide-react";

export function AutoPlaybooks() {
  const [playbooks, setPlaybooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPlaybooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('market-synapse', {
        body: { action: 'list_playbooks' }
      });

      if (error) throw error;
      setPlaybooks(data.playbooks || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load playbooks");
    } finally {
      setLoading(false);
    }
  };

  const generatePlaybook = async () => {
    toast.loading("Generating new playbook...");
    try {
      const { data, error } = await supabase.functions.invoke('market-synapse', {
        body: { action: 'generate_playbook', event_type: 'supply_disruption' }
      });

      if (error) throw error;
      
      setPlaybooks(prev => [...prev, data.playbook]);
      toast.success("Playbook generated");
    } catch (error: any) {
      toast.error(error.message || "Generation failed");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Autonomous Playbooks</h2>
        <div className="flex gap-2">
          <Button onClick={loadPlaybooks} variant="outline" size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Load Existing
          </Button>
          <Button onClick={generatePlaybook} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Generate New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playbooks.map((playbook, idx) => (
          <motion.div
            key={playbook.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{playbook.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{playbook.description}</p>
                </div>
                <Badge variant={playbook.active ? "default" : "secondary"}>
                  {playbook.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm font-medium mb-2">Workflow Steps:</p>
                  <ol className="text-sm space-y-1 pl-4">
                    {playbook.steps?.map((step: string, i: number) => (
                      <li key={i} className="list-decimal text-muted-foreground">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Success Rate:</span>
                    <span className="font-bold text-primary">{playbook.success_rate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Executions:</span>
                    <span className="font-bold">{playbook.execution_count}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="gap-2">
                  <Play className="w-4 h-4" />
                  Execute
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Configure
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {playbooks.length === 0 && !loading && (
        <Card className="p-12 bg-background/50 backdrop-blur-sm border-primary/20">
          <div className="text-center text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">No playbooks created yet</p>
            <Button onClick={generatePlaybook} className="gap-2">
              <Plus className="w-4 h-4" />
              Create First Playbook
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
