import { useState, useEffect } from "react";
import { Globe, TrendingUp, Clock, Shield, DollarSign, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LiquidCarbonBackground } from "./liquid-carbon-background";
import { PaymentWizard } from "./payment-wizard";
import { RealTimeTracker } from "./real-time-tracker";
import { AnalyticsDashboard } from "./analytics-dashboard";
import { RailControlPanel } from "./rail-control-panel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const PaymentDashboard = () => {
  const { toast } = useToast();
  const [showWizard, setShowWizard] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showRailControl, setShowRailControl] = useState(false);
  const [activePayments, setActivePayments] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalVolume: 0,
    activeTransactions: 0,
    avgSavings: 67,
    avgSpeed: 45
  });

  useEffect(() => {
    loadMetrics();
    loadActivePayments();
    
    const interval = setInterval(loadActivePayments, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: payments } = await supabase
        .from('cross_border_payments')
        .select('*')
        .eq('user_id', user.id);

      if (payments) {
        const totalVolume = payments.reduce((sum, p) => sum + parseFloat(p.amount?.toString() || '0'), 0);
        const activeTransactions = payments.filter(p => p.status !== 'completed' && p.status !== 'failed').length;
        const completedPayments = payments.filter(p => p.status === 'completed');
        const avgSavings = completedPayments.length > 0 
          ? completedPayments.reduce((sum, p) => sum + (parseFloat(p.cost_savings_pct?.toString() || '0')), 0) / completedPayments.length
          : 67;

        setMetrics({
          totalVolume: Math.round(totalVolume),
          activeTransactions,
          avgSavings: Math.round(avgSavings),
          avgSpeed: 45
        });
      }
    } catch (error: any) {
      console.error('Error loading metrics:', error);
    }
  };

  const loadActivePayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: payments } = await supabase
        .from('cross_border_payments')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['initiated', 'routing', 'processing'])
        .order('created_at', { ascending: false })
        .limit(5);

      if (payments) {
        setActivePayments(payments);
      }
    } catch (error: any) {
      console.error('Error loading active payments:', error);
    }
  };

  const dashboardMetrics = [
    { 
      label: "Total Volume", 
      value: `$${metrics.totalVolume.toLocaleString()}`, 
      icon: DollarSign, 
      color: "text-[#CFAF6E]" 
    },
    { 
      label: "Active Transactions", 
      value: metrics.activeTransactions.toString(), 
      icon: Activity, 
      color: "text-[#BFBFBF]" 
    },
    { 
      label: "Avg Cost Savings", 
      value: `${metrics.avgSavings}%`, 
      icon: TrendingUp, 
      color: "text-[#CFAF6E]" 
    },
    { 
      label: "Avg Settlement Time", 
      value: `${metrics.avgSpeed} min`, 
      icon: Clock, 
      color: "text-[#BFBFBF]" 
    },
  ];

  return (
    <div className="relative min-h-screen text-foreground overflow-hidden">
      <LiquidCarbonBackground />
      
      {/* Header */}
      <div className="relative z-10 border-b border-[#1A1A1A] bg-[#0a0a0a]/50 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#0a0a0a] border border-[#CFAF6E]/20">
                <Globe className="h-6 w-6 text-[#CFAF6E]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#EDEDED] via-[#BFBFBF] to-[#EDEDED] bg-clip-text text-transparent">
                  Cross-Border Payment Intelligence
                </h1>
                <p className="text-xs text-[#BFBFBF]">AI-powered global payment orchestration</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#CFAF6E] animate-pulse" />
              <span className="text-xs text-[#BFBFBF]">Optimal routing active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {dashboardMetrics.map((metric, idx) => (
            <Card 
              key={idx} 
              className="p-6 bg-[#0a0a0a]/50 backdrop-blur border-[#1A1A1A] hover:border-[#CFAF6E]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(207,175,110,0.1)] group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#BFBFBF] mb-1">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.color} group-hover:scale-105 transition-transform`}>
                    {metric.value}
                  </p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Control Strip */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-[#EDEDED]">Command Center</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              onClick={() => setShowWizard(true)}
              className="h-24 flex-col gap-2 bg-gradient-to-br from-[#1A1A1A] to-[#0a0a0a] border border-[#CFAF6E]/20 hover:border-[#CFAF6E]/60 hover:shadow-[0_0_30px_rgba(207,175,110,0.2)] transition-all duration-300 text-[#EDEDED] group"
            >
              <DollarSign className="h-6 w-6 text-[#CFAF6E] group-hover:scale-110 transition-transform" />
              <span className="text-sm">New Payment</span>
            </Button>
            
            <Button
              onClick={() => setShowTracker(true)}
              className="h-24 flex-col gap-2 bg-gradient-to-br from-[#1A1A1A] to-[#0a0a0a] border border-[#BFBFBF]/20 hover:border-[#BFBFBF]/60 hover:shadow-[0_0_30px_rgba(191,191,191,0.1)] transition-all duration-300 text-[#EDEDED] group"
            >
              <Activity className="h-6 w-6 text-[#BFBFBF] group-hover:scale-110 transition-transform" />
              <span className="text-sm">Track Payments</span>
            </Button>
            
            <Button
              onClick={() => setShowAnalytics(true)}
              className="h-24 flex-col gap-2 bg-gradient-to-br from-[#1A1A1A] to-[#0a0a0a] border border-[#CFAF6E]/20 hover:border-[#CFAF6E]/60 hover:shadow-[0_0_30px_rgba(207,175,110,0.2)] transition-all duration-300 text-[#EDEDED] group"
            >
              <TrendingUp className="h-6 w-6 text-[#CFAF6E] group-hover:scale-110 transition-transform" />
              <span className="text-sm">Analytics</span>
            </Button>
            
            <Button
              onClick={() => setShowRailControl(true)}
              className="h-24 flex-col gap-2 bg-gradient-to-br from-[#1A1A1A] to-[#0a0a0a] border border-[#BFBFBF]/20 hover:border-[#BFBFBF]/60 hover:shadow-[0_0_30px_rgba(191,191,191,0.1)] transition-all duration-300 text-[#EDEDED] group"
            >
              <Shield className="h-6 w-6 text-[#BFBFBF] group-hover:scale-110 transition-transform" />
              <span className="text-sm">Rail Control</span>
            </Button>
          </div>
        </div>

        {/* Active Transactions */}
        {activePayments.length > 0 && (
          <Card className="p-6 bg-[#0a0a0a]/50 backdrop-blur border-[#1A1A1A]">
            <h3 className="text-lg font-semibold mb-4 text-[#EDEDED]">Active Transactions</h3>
            <div className="space-y-3">
              {activePayments.map((payment) => (
                <div 
                  key={payment.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#050505]/50 border border-[#1A1A1A] hover:border-[#CFAF6E]/40 transition-all cursor-pointer"
                  onClick={() => setShowTracker(true)}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#CFAF6E]/20 to-[#CFAF6E]/5 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-[#CFAF6E]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#EDEDED]">{payment.transaction_ref}</p>
                      <p className="text-sm text-[#BFBFBF]">
                        ${parseFloat(payment.amount).toLocaleString()} {payment.from_currency} → {payment.to_currency}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#CFAF6E] capitalize">{payment.status}</p>
                    <p className="text-xs text-[#BFBFBF]">{payment.progress}% complete</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a]/95 backdrop-blur-xl border-[#1A1A1A] text-[#EDEDED]">
          <DialogHeader>
            <DialogTitle className="text-[#CFAF6E]">New Cross-Border Payment</DialogTitle>
          </DialogHeader>
          <PaymentWizard onComplete={() => { setShowWizard(false); loadMetrics(); loadActivePayments(); }} />
        </DialogContent>
      </Dialog>

      <Dialog open={showTracker} onOpenChange={setShowTracker}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a]/95 backdrop-blur-xl border-[#1A1A1A] text-[#EDEDED]">
          <DialogHeader>
            <DialogTitle className="text-[#CFAF6E]">Real-Time Payment Tracking</DialogTitle>
          </DialogHeader>
          <RealTimeTracker />
        </DialogContent>
      </Dialog>

      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a]/95 backdrop-blur-xl border-[#1A1A1A] text-[#EDEDED]">
          <DialogHeader>
            <DialogTitle className="text-[#CFAF6E]">Payment Analytics</DialogTitle>
          </DialogHeader>
          <AnalyticsDashboard />
        </DialogContent>
      </Dialog>

      <Dialog open={showRailControl} onOpenChange={setShowRailControl}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a]/95 backdrop-blur-xl border-[#1A1A1A] text-[#EDEDED]">
          <DialogHeader>
            <DialogTitle className="text-[#CFAF6E]">Rail Control Panel</DialogTitle>
          </DialogHeader>
          <RailControlPanel />
        </DialogContent>
      </Dialog>
    </div>
  );
};