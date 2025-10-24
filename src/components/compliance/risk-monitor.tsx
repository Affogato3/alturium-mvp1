import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface RiskMonitorProps {
  onUpdate: () => void;
}

export const RiskMonitor = ({ onUpdate }: RiskMonitorProps) => {
  const [risks, setRisks] = useState<any[]>([]);

  useEffect(() => {
    loadRisks();
  }, []);

  const loadRisks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('risk_clusters')
        .select('*')
        .eq('user_id', user.id)
        .order('risk_level', { ascending: false })
        .order('detected_at', { ascending: false });

      if (data) setRisks(data);
    } catch (error) {
      console.error('Error loading risks:', error);
    }
  };

  const markResolved = async (id: string) => {
    try {
      const { error } = await supabase
        .from('risk_clusters')
        .update({ 
          mitigation_status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Risk marked as resolved');
      loadRisks();
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'border-red-500/30 bg-red-500/10 text-red-400';
      case 'high':
        return 'border-orange-500/30 bg-orange-500/10 text-orange-400';
      case 'medium':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
      case 'low':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
      default:
        return 'border-gray-500/30 bg-gray-500/10 text-gray-400';
    }
  };

  const pendingRisks = risks.filter(r => r.mitigation_status === 'pending');
  const resolvedRisks = risks.filter(r => r.mitigation_status === 'resolved');

  return (
    <Card className="bg-[#1A1A1A] border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Risk & Sanction Monitor
        </h3>
        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400">
          {pendingRisks.length} Active
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Active Risks */}
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Active Risks
          </h4>
          <div className="space-y-3">
            {pendingRisks.map((risk) => (
              <Card key={risk.id} className="bg-[#0B0B0B] border-gray-800/50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getRiskLevelColor(risk.risk_level)}>
                        {risk.risk_level.toUpperCase()}
                      </Badge>
                      <span className="font-semibold text-white">{risk.cluster_name}</span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-2">{risk.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Jurisdiction: {risk.jurisdiction}</span>
                      <span>Detected: {new Date(risk.detected_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markResolved(risk.id)}
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Resolve
                  </Button>
                </div>
              </Card>
            ))}

            {pendingRisks.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500/50" />
                <p>No active risks detected.</p>
              </div>
            )}
          </div>
        </div>

        {/* Resolved Risks */}
        {resolvedRisks.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Recently Resolved
            </h4>
            <div className="space-y-2">
              {resolvedRisks.slice(0, 3).map((risk) => (
                <Card key={risk.id} className="bg-[#0B0B0B] border-gray-800/50 p-3 opacity-60">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{risk.cluster_name}</span>
                    <span className="text-xs text-emerald-400">
                      ✓ Resolved {new Date(risk.resolved_at).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};