import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, AlertTriangle, XCircle, RefreshCw, 
  Wrench, Database, Shield, Zap 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Connector {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'warning' | 'error';
  health_score: number;
  last_sync: Date;
  sync_count: number;
  error_count: number;
}

export const ConnectorHealthDashboard = () => {
  const [connectors, setConnectors] = useState<Connector[]>([
    {
      id: '1',
      name: 'Salesforce CRM',
      type: 'CRM',
      status: 'active',
      health_score: 98,
      last_sync: new Date(),
      sync_count: 4217,
      error_count: 3
    },
    {
      id: '2',
      name: 'QuickBooks Online',
      type: 'ERP',
      status: 'active',
      health_score: 95,
      last_sync: new Date(Date.now() - 300000),
      sync_count: 1847,
      error_count: 12
    },
    {
      id: '3',
      name: 'Stripe Payments',
      type: 'Finance',
      status: 'warning',
      health_score: 78,
      last_sync: new Date(Date.now() - 1800000),
      sync_count: 8934,
      error_count: 47
    },
    {
      id: '4',
      name: 'Workday HRIS',
      type: 'HR',
      status: 'active',
      health_score: 92,
      last_sync: new Date(Date.now() - 120000),
      sync_count: 2341,
      error_count: 8
    },
    {
      id: '5',
      name: 'Google Ads',
      type: 'Marketing',
      status: 'error',
      health_score: 45,
      last_sync: new Date(Date.now() - 7200000),
      sync_count: 1523,
      error_count: 156
    },
  ]);
  const [isHealing, setIsHealing] = useState<string | null>(null);
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <RefreshCw className="w-5 h-5 text-[#BFBFBF]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-[#BFBFBF]/20 text-[#BFBFBF] border-[#BFBFBF]/30';
    }
  };

  const autoHeal = async (connectorId: string) => {
    setIsHealing(connectorId);
    
    // Simulate auto-healing
    setTimeout(() => {
      setConnectors(prev => prev.map(c => 
        c.id === connectorId 
          ? { ...c, status: 'active', health_score: Math.min(c.health_score + 20, 100), error_count: 0 }
          : c
      ));
      setIsHealing(null);
      
      toast({
        title: "Auto-Heal Complete",
        description: "Connector has been successfully repaired",
      });
    }, 2000);
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#CFAF6E]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-[#CFAF6E]" />
            <span className="text-xs text-[#BFBFBF]">Total Connectors</span>
          </div>
          <div className="text-2xl font-bold text-[#EDEDED]">{connectors.length}</div>
        </Card>

        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-green-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-xs text-[#BFBFBF]">Active</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {connectors.filter(c => c.status === 'active').length}
          </div>
        </Card>

        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-yellow-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-[#BFBFBF]">Warnings</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">
            {connectors.filter(c => c.status === 'warning').length}
          </div>
        </Card>

        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-red-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-[#BFBFBF]">Errors</span>
          </div>
          <div className="text-2xl font-bold text-red-400">
            {connectors.filter(c => c.status === 'error').length}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {connectors.map((connector) => (
          <Card key={connector.id} className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#CFAF6E]/20 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(connector.status)}
                  <div>
                    <h4 className="text-[#EDEDED] font-semibold">{connector.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {connector.type}
                      </Badge>
                      <Badge className={getStatusColor(connector.status)}>
                        {connector.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-[#BFBFBF]">Health Score</div>
                    <div className={`text-xl font-bold ${getHealthColor(connector.health_score)}`}>
                      {connector.health_score}%
                    </div>
                    <Progress value={connector.health_score} className="h-1 mt-1" />
                  </div>
                  <div>
                    <div className="text-xs text-[#BFBFBF]">Last Sync</div>
                    <div className="text-sm text-[#EDEDED]">
                      {Math.floor((Date.now() - connector.last_sync.getTime()) / 60000)} min ago
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#BFBFBF]">Total Syncs</div>
                    <div className="text-sm text-[#EDEDED]">{connector.sync_count.toLocaleString()}</div>
                  </div>
                </div>

                {connector.error_count > 0 && (
                  <div className="text-xs text-red-400">
                    {connector.error_count} errors detected
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-[#1A1A1A]/50 border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/20"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                {connector.status !== 'active' && (
                  <Button
                    size="sm"
                    onClick={() => autoHeal(connector.id)}
                    disabled={isHealing === connector.id}
                    className="bg-gradient-to-r from-[#CFAF6E] to-[#EDEDED] text-black hover:opacity-90 shadow-lg shadow-[#CFAF6E]/20"
                  >
                    {isHealing === connector.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Healing...
                      </>
                    ) : (
                      <>
                        <Wrench className="w-4 h-4 mr-2" />
                        Auto-Heal
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};