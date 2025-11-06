import { useState, useEffect } from "react";
import { Activity, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export const RealTimeTracker = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  useEffect(() => {
    loadPayments();
    const interval = setInterval(loadPayments, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadPayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('cross_border_payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setPayments(data);
        if (selectedPayment) {
          const updated = data.find(p => p.id === selectedPayment.id);
          if (updated) setSelectedPayment(updated);
        }
      }
    } catch (error: any) {
      console.error('Error loading payments:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-[#CFAF6E]" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Activity className="h-5 w-5 text-[#BFBFBF] animate-pulse" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#CFAF6E]/10 text-[#CFAF6E] border-[#CFAF6E]/30';
      case 'failed': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-[#BFBFBF]/10 text-[#BFBFBF] border-[#BFBFBF]/30';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Payments List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-[#EDEDED]">All Transactions</h3>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {payments.map((payment) => (
            <Card
              key={payment.id}
              className={`p-4 cursor-pointer transition-all duration-300 ${
                selectedPayment?.id === payment.id
                  ? 'bg-[#CFAF6E]/10 border-[#CFAF6E]'
                  : 'bg-[#050505]/50 border-[#1A1A1A] hover:border-[#CFAF6E]/40'
              }`}
              onClick={() => setSelectedPayment(payment)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(payment.status)}
                  <span className="font-mono text-sm text-[#EDEDED]">{payment.transaction_ref}</span>
                </div>
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#BFBFBF]">
                  ${parseFloat(payment.amount).toLocaleString()} {payment.from_currency} → {payment.to_currency}
                </span>
                <span className="text-[#CFAF6E]">{payment.progress}%</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Details */}
      <div>
        {selectedPayment ? (
          <Card className="p-6 bg-[#050505]/50 border-[#1A1A1A]">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h3 className="font-semibold text-[#EDEDED] mb-1">Transaction Details</h3>
                <p className="text-sm text-[#BFBFBF] font-mono">{selectedPayment.transaction_ref}</p>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#BFBFBF]">Progress</span>
                  <span className="text-sm font-semibold text-[#CFAF6E]">{selectedPayment.progress}%</span>
                </div>
                <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#CFAF6E] to-[#8B7355] transition-all duration-500"
                    style={{ width: `${selectedPayment.progress}%` }}
                  />
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#BFBFBF] mb-1">Amount</p>
                  <p className="font-semibold text-[#EDEDED]">
                    ${parseFloat(selectedPayment.amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#BFBFBF] mb-1">Corridor</p>
                  <p className="font-semibold text-[#EDEDED]">{selectedPayment.corridor}</p>
                </div>
                <div>
                  <p className="text-sm text-[#BFBFBF] mb-1">Status</p>
                  <Badge className={getStatusColor(selectedPayment.status)}>
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-[#BFBFBF] mb-1">Savings</p>
                  <p className="font-semibold text-[#CFAF6E]">
                    {selectedPayment.cost_savings_pct || 0}%
                  </p>
                </div>
              </div>

              {/* Timeline */}
              {selectedPayment.tracking_data?.steps && (
                <div>
                  <h4 className="font-semibold text-[#EDEDED] mb-3">Transaction Timeline</h4>
                  <div className="space-y-3">
                    {selectedPayment.tracking_data.steps.map((step: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-2 w-2 rounded-full bg-[#CFAF6E]" />
                        </div>
                        <p className="text-sm text-[#BFBFBF]">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="pt-4 border-t border-[#1A1A1A]">
                <div className="flex items-center gap-2 text-xs text-[#BFBFBF]">
                  <Clock className="h-3 w-3" />
                  <span>Initiated: {new Date(selectedPayment.initiated_at).toLocaleString()}</span>
                </div>
                {selectedPayment.completed_at && (
                  <div className="flex items-center gap-2 text-xs text-[#BFBFBF] mt-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Completed: {new Date(selectedPayment.completed_at).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-12 bg-[#050505]/50 border-[#1A1A1A] text-center">
            <Activity className="h-12 w-12 text-[#BFBFBF] mx-auto mb-4 opacity-50" />
            <p className="text-[#BFBFBF]">Select a transaction to view details</p>
          </Card>
        )}
      </div>
    </div>
  );
};