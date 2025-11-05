import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, Clock, CheckCircle2, XCircle, AlertCircle,
  Send, Building2, Calendar, DollarSign 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentApproval {
  id: string;
  document_id: string;
  amount: number;
  vendor_name: string;
  payment_method: string;
  status: string;
  requested_by: string;
  scheduled_date: string;
  created_at: string;
  approved_by?: string;
  approval_notes?: string;
}

export const PaymentRail = () => {
  const { toast } = useToast();
  const [approvals, setApprovals] = useState<PaymentApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchApprovals = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_approvals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApprovals(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading approvals",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('payment_approvals_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'payment_approvals' },
        () => fetchApprovals()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleApproval = async (approvalId: string, action: 'approve' | 'reject') => {
    setProcessing(approvalId);
    try {
      const { error } = await supabase.functions.invoke('payment-approve', {
        body: { approvalId, action, notes: '' }
      });

      if (error) throw error;

      toast({
        title: action === 'approve' ? "✅ Payment Approved" : "❌ Payment Rejected",
        description: `Payment ${action}d successfully`,
      });

      fetchApprovals();
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const statusConfig: Record<string, { color: string; icon: any; variant: any }> = {
    pending: { color: "text-yellow-500", icon: Clock, variant: "outline" },
    approved: { color: "text-blue-500", icon: CheckCircle2, variant: "secondary" },
    rejected: { color: "text-red-500", icon: XCircle, variant: "destructive" },
    executed: { color: "text-green-500", icon: CheckCircle2, variant: "default" },
    failed: { color: "text-red-500", icon: AlertCircle, variant: "destructive" },
  };

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const otherApprovals = approvals.filter(a => a.status !== 'pending');

  if (loading) {
    return (
      <Card className="bg-card/40 backdrop-blur-xl">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading payment approvals...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Approvals - Requires Action */}
      {pendingApprovals.length > 0 && (
        <Card className="bg-card/40 backdrop-blur-xl border-yellow-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Pending Approvals ({pendingApprovals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingApprovals.map((approval) => {
              const StatusIcon = statusConfig[approval.status].icon;
              return (
                <Card key={approval.id} className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">{approval.vendor_name}</h3>
                          <Badge variant={statusConfig[approval.status].variant}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {approval.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-success" />
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="font-semibold">${approval.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">Scheduled:</span>
                            <span className="font-semibold">
                              {approval.scheduled_date ? new Date(approval.scheduled_date).toLocaleDateString() : 'Immediate'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Send className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">Method:</span>
                            <span className="font-semibold uppercase">{approval.payment_method}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Requested by:</span>
                            <span className="font-semibold">{approval.requested_by}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                      <Button
                        size="sm"
                        onClick={() => handleApproval(approval.id, 'approve')}
                        disabled={processing === approval.id}
                        className="flex-1 bg-success hover:bg-success/90"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve & Execute
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleApproval(approval.id, 'reject')}
                        disabled={processing === approval.id}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      {otherApprovals.length > 0 && (
        <Card className="bg-card/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-primary" />
              Payment History ({otherApprovals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {otherApprovals.map((approval) => {
              const StatusIcon = statusConfig[approval.status].icon;
              const config = statusConfig[approval.status];
              return (
                <div key={approval.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                    <div>
                      <p className="font-semibold">{approval.vendor_name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${approval.amount.toLocaleString()} • {new Date(approval.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={config.variant}>{approval.status}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {approvals.length === 0 && (
        <Card className="bg-card/40 backdrop-blur-xl">
          <CardContent className="p-12 text-center">
            <Send className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No payment requests yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
