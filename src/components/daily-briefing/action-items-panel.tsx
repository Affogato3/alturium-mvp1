import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Clock, CheckCircle, Mail, Phone, AlarmClock } from "lucide-react";
import { toast } from "sonner";

export const ActionItemsPanel = () => {
  const queryClient = useQueryClient();

  const { data: actionItems, isLoading } = useQuery({
    queryKey: ['action-items'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('user_id', user.id)
        .order('urgency', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const resolveActionMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from('action_items')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolution_notes: notes
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
      queryClient.invalidateQueries({ queryKey: ['pending-actions'] });
      toast.success('Action item resolved');
    },
    onError: (error: any) => {
      toast.error('Failed to resolve: ' + error.message);
    }
  });

  const snoozeActionMutation = useMutation({
    mutationFn: async (id: string) => {
      const snoozedUntil = new Date();
      snoozedUntil.setHours(snoozedUntil.getHours() + 24);

      const { error } = await supabase
        .from('action_items')
        .update({ snoozed_until: snoozedUntil.toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
      toast.success('Action item snoozed for 24 hours');
    }
  });

  const urgentItems = actionItems?.filter(item => item.urgency === 'urgent' && item.status === 'pending');
  const todayItems = actionItems?.filter(item => item.urgency === 'today' && item.status === 'pending');
  const upcomingItems = actionItems?.filter(item => item.urgency === 'upcoming' && item.status === 'pending');

  const ActionItemCard = ({ item, urgencyLevel }: { item: any; urgencyLevel: 'urgent' | 'today' | 'upcoming' }) => {
    const urgencyColors = {
      urgent: { bg: 'bg-red-500/10', border: 'border-l-red-500', icon: 'text-red-400', label: 'URGENT' },
      today: { bg: 'bg-amber-500/10', border: 'border-l-amber-500', icon: 'text-amber-400', label: 'TODAY' },
      upcoming: { bg: 'bg-blue-500/10', border: 'border-l-blue-500', icon: 'text-blue-400', label: 'UPCOMING' }
    };

    const colors = urgencyColors[urgencyLevel];

    return (
      <Card className={`bg-slate-900/50 border-slate-800 ${colors.border} border-l-4`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold ${colors.icon}`}>{colors.label}</span>
                {urgencyLevel === 'urgent' && <AlertTriangle className={`w-4 h-4 ${colors.icon}`} />}
                {urgencyLevel === 'today' && <Clock className={`w-4 h-4 ${colors.icon}`} />}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{item.description}</p>

              {item.amount && (
                <div className="mb-4">
                  <span className="text-sm text-slate-400">Impact: </span>
                  <span className="text-lg font-bold text-white">${Number(item.amount).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                onClick={() => resolveActionMutation.mutate({ id: item.id, notes: 'Resolved from dashboard' })}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Resolve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => snoozeActionMutation.mutate(item.id)}
                className="border-slate-700"
              >
                <AlarmClock className="w-4 h-4 mr-2" />
                Snooze 24h
              </Button>
              {item.type === 'overdue_invoice' && (
                <>
                  <Button size="sm" variant="outline" className="border-slate-700">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reminder
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Customer
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <div className="text-center text-slate-400">Loading action items...</div>;
  }

  return (
    <div className="space-y-8">
      {urgentItems && urgentItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            URGENT ({urgentItems.length})
          </h2>
          <div className="space-y-4">
            {urgentItems.map(item => (
              <ActionItemCard key={item.id} item={item} urgencyLevel="urgent" />
            ))}
          </div>
        </div>
      )}

      {todayItems && todayItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            TODAY ({todayItems.length})
          </h2>
          <div className="space-y-4">
            {todayItems.map(item => (
              <ActionItemCard key={item.id} item={item} urgencyLevel="today" />
            ))}
          </div>
        </div>
      )}

      {upcomingItems && upcomingItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-400 mb-4">UPCOMING ({upcomingItems.length})</h2>
          <div className="space-y-4">
            {upcomingItems.map(item => (
              <ActionItemCard key={item.id} item={item} urgencyLevel="upcoming" />
            ))}
          </div>
        </div>
      )}

      {(!actionItems || actionItems.length === 0) && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="pt-6 text-center text-slate-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <p>No pending action items. You're all caught up!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};