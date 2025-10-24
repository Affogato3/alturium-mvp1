import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react";

interface GlobalComplianceMapProps {
  onRefresh: () => void;
}

export const GlobalComplianceMap = ({ onRefresh }: GlobalComplianceMapProps) => {
  const [jurisdictions, setJurisdictions] = useState<any[]>([]);

  useEffect(() => {
    loadJurisdictions();
  }, []);

  const loadJurisdictions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('jurisdictions')
        .select('*')
        .eq('user_id', user.id)
        .order('region');

      if (data) setJurisdictions(data);
    } catch (error) {
      console.error('Error loading jurisdictions:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'pending_update':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'audit_flagged':
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case 'non_compliant':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
      case 'pending_update':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
      case 'audit_flagged':
        return 'border-orange-500/30 bg-orange-500/10 text-orange-400';
      case 'non_compliant':
        return 'border-red-500/30 bg-red-500/10 text-red-400';
      default:
        return 'border-gray-500/30 bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <Card className="bg-[#1A1A1A] border-gray-800 p-6">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        Global Compliance Overview
        <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          {jurisdictions.length} Active Regions
        </Badge>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jurisdictions.map((jurisdiction) => (
          <Card 
            key={jurisdiction.id}
            className="bg-[#0B0B0B] border-gray-800/50 p-4 hover:border-cyan-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(jurisdiction.compliance_status)}
                  <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {jurisdiction.name}
                  </h4>
                </div>
                <p className="text-xs text-gray-400">{jurisdiction.region}</p>
              </div>
              <Badge 
                variant="outline" 
                className={getStatusColor(jurisdiction.compliance_status)}
              >
                {jurisdiction.compliance_status.replace('_', ' ')}
              </Badge>
            </div>

            {jurisdiction.last_audit_date && (
              <div className="text-xs text-gray-500 mt-2">
                Last audit: {new Date(jurisdiction.last_audit_date).toLocaleDateString()}
              </div>
            )}
          </Card>
        ))}

        {jurisdictions.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">
            <p>No jurisdictions configured yet.</p>
            <p className="text-sm mt-2">Add jurisdictions from the Jurisdiction Engine tab.</p>
          </div>
        )}
      </div>
    </Card>
  );
};