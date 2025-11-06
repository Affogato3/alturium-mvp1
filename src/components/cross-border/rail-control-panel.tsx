import { useState, useEffect } from "react";
import { Shield, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const RailControlPanel = () => {
  const { toast } = useToast();
  const [rails, setRails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRails();
  }, []);

  const loadRails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('payment_rails')
        .select('*')
        .eq('user_id', user.id)
        .order('rail_name');

      if (data) {
        setRails(data);
      }
    } catch (error: any) {
      console.error('Error loading rails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (railId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('payment_rails')
        .update({ status: newStatus })
        .eq('id', railId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Rail ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      });

      loadRails();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-5 w-5 text-[#CFAF6E]" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default:
        return <Activity className="h-5 w-5 text-[#BFBFBF]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#CFAF6E]/10 text-[#CFAF6E] border-[#CFAF6E]/30';
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-[#BFBFBF]/10 text-[#BFBFBF] border-[#BFBFBF]/30';
    }
  };

  const getRailTypeLabel = (type: string) => {
    switch (type) {
      case 'swift_gpi': return 'SWIFT gpi';
      case 'stablecoin': return 'Stablecoin';
      case 'cbdc': return 'CBDC';
      case 'local_network': return 'Local Network';
      case 'blockchain': return 'Blockchain';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-[#CFAF6E] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[#BFBFBF]">Loading rails...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-[#CFAF6E]" />
        <h3 className="font-semibold text-[#EDEDED]">Payment Rail Status</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rails.map((rail) => (
          <Card 
            key={rail.id}
            className="p-6 bg-[#050505]/50 backdrop-blur border-[#1A1A1A] hover:border-[#CFAF6E]/40 transition-all"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(rail.status)}
                  <div>
                    <h4 className="font-semibold text-[#EDEDED]">{rail.rail_name}</h4>
                    <p className="text-xs text-[#BFBFBF]">{getRailTypeLabel(rail.rail_type)}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(rail.status)}>
                  {rail.status}
                </Badge>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-[#BFBFBF] mb-1">Health Score</p>
                  <p className="font-semibold text-[#CFAF6E]">
                    {rail.health_score.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#BFBFBF] mb-1">Success Rate</p>
                  <p className="font-semibold text-[#EDEDED]">
                    {rail.success_rate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#BFBFBF] mb-1">Avg Latency</p>
                  <p className="font-semibold text-[#EDEDED]">
                    {Math.round(rail.avg_latency_ms / 60000)}m
                  </p>
                </div>
              </div>

              {/* Last Ping */}
              {rail.last_ping_at && (
                <p className="text-xs text-[#BFBFBF]">
                  Last ping: {new Date(rail.last_ping_at).toLocaleString()}
                </p>
              )}

              {/* Actions */}
              <Button
                onClick={() => handleStatusToggle(rail.id, rail.status)}
                variant="outline"
                size="sm"
                className={`w-full ${
                  rail.status === 'active'
                    ? 'border-[#BFBFBF]/30 hover:border-[#BFBFBF]/60 text-[#BFBFBF]'
                    : 'border-[#CFAF6E]/30 hover:border-[#CFAF6E]/60 text-[#CFAF6E]'
                }`}
              >
                {rail.status === 'active' ? 'Deactivate' : 'Activate'} Rail
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};