import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Lock, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AuditVault = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    loadAuditEvents();
  }, []);

  const loadAuditEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('compliance_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) setEvents(data);
    } catch (error) {
      console.error('Error loading audit events:', error);
    }
  };

  const getDecisionColor = (decision: string) => {
    if (decision.includes('allow')) return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
    if (decision.includes('block')) return 'border-red-500/30 bg-red-500/10 text-red-400';
    return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
  };

  return (
    <Card className="bg-[#1A1A1A] border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-400" />
          Immutable Audit Vault
        </h3>
        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400">
          <Lock className="w-3 h-3 mr-1" />
          Blockchain Secured
        </Badge>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-3">
          {events.map((event) => (
            <Card 
              key={event.id}
              className="bg-[#0B0B0B] border-gray-800/50 p-4 hover:border-cyan-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs bg-gray-800/50 border-gray-700 text-gray-300">
                      {event.event_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getDecisionColor(event.decision)}`}>
                      {event.decision}
                    </Badge>
                  </div>
                  
                  <div className="font-mono text-xs text-gray-400 mb-2">
                    TX: {event.ledger_tx_hash || 'Pending'}
                  </div>

                  <div className="text-sm text-gray-300">
                    Hash: <span className="font-mono text-xs text-cyan-400">{event.payload_hash.slice(0, 32)}...</span>
                  </div>

                  {event.confidence_score && (
                    <div className="text-xs text-gray-400 mt-2">
                      Confidence: {(event.confidence_score * 100).toFixed(1)}%
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(event.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors" />
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
            </Card>
          ))}

          {events.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Lock className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>No audit events recorded yet.</p>
              <p className="text-sm mt-2">All compliance actions will be logged here.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};