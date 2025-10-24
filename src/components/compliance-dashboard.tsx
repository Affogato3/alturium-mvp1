import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Shield, AlertTriangle, FileCheck, Activity, Lock, Play, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GlobalComplianceMap } from "./compliance/global-compliance-map";
import { JurisdictionEngine } from "./compliance/jurisdiction-engine";
import { AuditVault } from "./compliance/audit-vault";
import { RiskMonitor } from "./compliance/risk-monitor";
import { RegulationFeed } from "./compliance/regulation-feed";
import { ComplianceAgent } from "./compliance/compliance-agent";

export const ComplianceDashboard = () => {
  const [complianceScore, setComplianceScore] = useState(97.4);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'jurisdictions' | 'audit' | 'risks'>('overview');
  const [stats, setStats] = useState({
    totalJurisdictions: 0,
    compliantRegions: 0,
    activeRisks: 0,
    pendingReviews: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load jurisdictions
      const { data: jurisdictions } = await supabase
        .from('jurisdictions')
        .select('*')
        .eq('user_id', user.id);

      // Load risk clusters
      const { data: risks } = await supabase
        .from('risk_clusters')
        .select('*')
        .eq('user_id', user.id)
        .eq('mitigation_status', 'pending');

      // Load policies needing review
      const { data: policies } = await supabase
        .from('policies')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'staging');

      const compliantCount = jurisdictions?.filter(j => j.compliance_status === 'compliant').length || 0;

      setStats({
        totalJurisdictions: jurisdictions?.length || 0,
        compliantRegions: compliantCount,
        activeRisks: risks?.length || 0,
        pendingReviews: policies?.length || 0,
      });

      // Calculate overall compliance score
      if (jurisdictions && jurisdictions.length > 0) {
        const score = (compliantCount / jurisdictions.length) * 100;
        setComplianceScore(Math.round(score * 10) / 10);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const runComplianceAgent = async () => {
    setIsAgentRunning(true);
    toast.info("Deploying Autonomous Compliance Agent...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('compliance-engine', {
        body: { 
          action: 'audit_compliance',
          data: { timestamp: Date.now(), scope: 'full' }
        }
      });

      if (error) throw error;

      toast.success(`Compliance scan complete. Score: ${complianceScore}%`);
      loadDashboardData();
    } catch (error) {
      console.error('Agent error:', error);
      toast.error('Failed to run compliance audit');
    } finally {
      setIsAgentRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-[#121212]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#00E0FF] flex items-center gap-2">
                <Shield className="w-6 h-6" />
                ALTURIUM // REGTECH
              </h1>
              <p className="text-xs text-gray-400 mt-1">Global Compliance Core · Policy Rule Engine Active</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <Activity className="w-3 h-3 mr-1 animate-pulse" />
                Live Monitoring
              </Badge>
              <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                Score: {complianceScore}%
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#1A1A1A] border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Jurisdictions</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalJurisdictions}</p>
              </div>
              <Globe className="w-10 h-10 text-cyan-400/50" />
            </div>
          </Card>

          <Card className="bg-[#1A1A1A] border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Compliant Regions</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">{stats.compliantRegions}</p>
              </div>
              <Shield className="w-10 h-10 text-emerald-400/50" />
            </div>
          </Card>

          <Card className="bg-[#1A1A1A] border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Risks</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">{stats.activeRisks}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-amber-400/50" />
            </div>
          </Card>

          <Card className="bg-[#1A1A1A] border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Reviews</p>
                <p className="text-3xl font-bold text-cyan-400 mt-1">{stats.pendingReviews}</p>
              </div>
              <FileCheck className="w-10 h-10 text-cyan-400/50" />
            </div>
          </Card>
        </div>

        {/* Compliance Score Card */}
        <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0B0B0B] border-cyan-500/30 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Overall Compliance Integrity</h2>
              <p className="text-sm text-gray-400">Real-time assessment across all jurisdictions</p>
            </div>
            <Button 
              onClick={runComplianceAgent}
              disabled={isAgentRunning}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
            >
              {isAgentRunning ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Deploy Agent
                </>
              )}
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-5xl font-bold text-cyan-400">{complianceScore}%</span>
              <Badge 
                variant="outline" 
                className={`${
                  complianceScore >= 95 ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                  complianceScore >= 80 ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
                  'border-red-500/30 bg-red-500/10 text-red-400'
                }`}
              >
                {complianceScore >= 95 ? 'Excellent' : complianceScore >= 80 ? 'Good' : 'Needs Attention'}
              </Badge>
            </div>
            <Progress value={complianceScore} className="h-3" />
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeView} onValueChange={(v: any) => setActiveView(v)} className="space-y-6">
          <TabsList className="bg-[#1A1A1A] border border-gray-800">
            <TabsTrigger value="overview">
              <Globe className="w-4 h-4 mr-2" />
              Global Overview
            </TabsTrigger>
            <TabsTrigger value="jurisdictions">
              <Settings className="w-4 h-4 mr-2" />
              Jurisdiction Engine
            </TabsTrigger>
            <TabsTrigger value="audit">
              <Lock className="w-4 h-4 mr-2" />
              Audit Vault
            </TabsTrigger>
            <TabsTrigger value="risks">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Risk Monitor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <GlobalComplianceMap onRefresh={loadDashboardData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RegulationFeed />
              <ComplianceAgent />
            </div>
          </TabsContent>

          <TabsContent value="jurisdictions">
            <JurisdictionEngine onUpdate={loadDashboardData} />
          </TabsContent>

          <TabsContent value="audit">
            <AuditVault />
          </TabsContent>

          <TabsContent value="risks">
            <RiskMonitor onUpdate={loadDashboardData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};