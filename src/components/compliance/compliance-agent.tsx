import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bot, Play, Loader2 } from "lucide-react";

export const ComplianceAgent = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const runAgent = async () => {
    setIsRunning(true);
    toast.info("Deploying Autonomous Compliance Agent...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('compliance-engine', {
        body: { 
          action: 'audit_compliance',
          data: { 
            timestamp: Date.now(),
            scope: 'full',
            checks: ['aml', 'kyc', 'sanctions', 'data_protection', 'tax_compliance']
          }
        }
      });

      if (error) throw error;

      setResult(data);
      setLastRun(new Date().toISOString());
      toast.success("Compliance scan complete");
    } catch (error: any) {
      console.error('Agent error:', error);
      toast.error(error.message || 'Failed to run compliance agent');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="bg-[#1A1A1A] border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          Autonomous Compliance Agent
        </h3>
        {lastRun && (
          <Badge variant="outline" className="border-gray-700 bg-gray-800/50 text-gray-300 text-xs">
            Last run: {new Date(lastRun).toLocaleTimeString()}
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-[#0B0B0B] border border-gray-800/50 rounded-lg p-4">
          <p className="text-sm text-gray-300 mb-4">
            The autonomous agent continuously monitors your operations against regulatory requirements,
            detects compliance gaps, and suggests remediation actions.
          </p>

          <div className="flex items-center gap-4">
            <Button 
              onClick={runAgent}
              disabled={isRunning}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold flex-1"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Full Audit
                </>
              )}
            </Button>
          </div>
        </div>

        {result && (
          <Card className="bg-[#0B0B0B] border-cyan-500/30 p-4">
            <h4 className="text-sm font-semibold text-cyan-400 mb-2">Latest Scan Results</h4>
            <div className="text-xs text-gray-400 whitespace-pre-wrap font-mono">
              {result.recommendation || JSON.stringify(result, null, 2)}
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
};