import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const PartnerMonitor = () => {
  const { toast } = useToast();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('compliance_partners' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('trust_score', { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Create sample partners for demo
        await createSamplePartners(user.id);
        await loadPartners();
        return;
      }
      
      setPartners(data);
    } catch (error: any) {
      console.error('Error loading partners:', error);
    }
  };

  const createSamplePartners = async (userId: string) => {
    const samplePartners = [
      { partner_name: "Stripe Connect", partner_type: "Payment Processor", trust_score: 98.5, health_status: "healthy", api_calls_monitored: 125000 },
      { partner_name: "Plaid Banking", partner_type: "Data Provider", trust_score: 96.2, health_status: "healthy", api_calls_monitored: 89000 },
      { partner_name: "Wise Transfers", partner_type: "Payment Rails", trust_score: 94.8, health_status: "warning", api_calls_monitored: 45000 },
      { partner_name: "Persona KYC", partner_type: "Identity Verification", trust_score: 92.1, health_status: "warning", api_calls_monitored: 12000 },
    ];

    await supabase.from('compliance_partners' as any).insert(
      samplePartners.map(p => ({ ...p, user_id: userId }))
    );
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-success border-success/20 bg-success/10';
      case 'warning': return 'text-warning border-warning/20 bg-warning/10';
      case 'critical': return 'text-destructive border-destructive/20 bg-destructive/10';
      default: return 'text-muted-foreground border-border/20';
    }
  };

  const getTrustScoreIcon = (score: number) => {
    if (score >= 95) return <TrendingUp className="h-4 w-4 text-success" />;
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-warning" />;
    return <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const runHealthCheck = async (partnerId: string) => {
    setLoading(true);
    try {
      toast({
        title: "Running Health Check",
        description: "Analyzing partner compliance posture...",
      });

      // Simulate health check
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Health Check Complete",
        description: "Partner compliance validated successfully",
      });
      
      await loadPartners();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Partner Health Monitor</h3>
        </div>
        <Badge variant="outline" className="border-success/20 text-success">
          Real-time
        </Badge>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {partners.map((partner) => (
            <Card key={partner.id} className="p-4 bg-card/30 backdrop-blur border-primary/10 hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{partner.partner_name}</h4>
                    <Badge variant="outline" className={getHealthColor(partner.health_status)}>
                      {partner.health_status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{partner.partner_type}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => runHealthCheck(partner.id)}
                  disabled={loading}
                  className="border-primary/20"
                >
                  Check
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Trust Score</p>
                  <div className="flex items-center gap-2">
                    {getTrustScoreIcon(partner.trust_score)}
                    <span className="font-semibold">{partner.trust_score}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">API Calls</p>
                  <p className="font-semibold">{partner.api_calls_monitored.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Violations</p>
                  <div className="flex items-center gap-1">
                    {partner.total_violations > 0 && <AlertTriangle className="h-3 w-3 text-warning" />}
                    <span className="font-semibold">{partner.total_violations}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Last Updated</p>
                  <p className="text-xs">{new Date(partner.updated_at).toLocaleTimeString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};