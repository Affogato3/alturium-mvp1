import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlturiumAuth } from "@/components/alturium-auth";
import { NavigationHeader } from "@/components/navigation-header";
import { AuditDashboard } from "@/components/audit-dashboard";
import { CNLGridDashboard } from "@/components/cnl-grid-dashboard";
import { supabase } from "@/integrations/supabase/client";
import { ScribeDashboard } from "@/components/scribe-dashboard";
import AlturiumDashboard from "@/components/alturium-dashboard";
import { ComplianceDashboard } from "@/components/compliance-dashboard";
import { EthicalArbiterDashboard } from "@/components/ethical-arbiter-dashboard";
import { PCREDashboard } from "@/components/pcre-dashboard";
import { EmbeddedComplianceDashboard } from "@/components/compliance/embedded-compliance-dashboard";
import { PaymentDashboard } from "@/components/cross-border/payment-dashboard";
import { Session, User } from "@supabase/supabase-js";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { HelixCoreDashboard } from "@/components/helix-core/helix-core-dashboard";
import { SmartInboxDashboard } from "@/components/smart-inbox-dashboard";
import { PredictiveInterlockDashboard } from "@/components/predictive-interlock-dashboard";
import { QuantumMarketMatrix } from "@/components/quantum-market-matrix";
import { FinanceFabricDashboard } from "@/components/finance-fabric-dashboard";
import FinSynapseDashboard from "@/components/finsynapse-dashboard";
import { AutoBudgetDashboard } from "@/components/autobudget-dashboard";
import { SynapseXCore } from "@/components/synapsex-core";
import { SmartFinanceAssistant } from "@/components/synapsex/smart-finance-assistant";
import { AIDataAnalysisDashboard } from "@/components/ai-data-analysis/ai-data-analysis-dashboard";
import { MarketMapDashboard } from "@/components/market-map";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "executive" | "analyst" | "auditor">("analyst");
  const [auditMode, setAuditMode] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (!error && data) {
      setUserRole(data.role as "admin" | "executive" | "analyst" | "auditor");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setAuditMode(false);
  };

  if (!user) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AlturiumAuth />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<AlturiumDashboard userRole={userRole} userName={user.user_metadata?.full_name || user.email || "User"} onSignOut={handleSignOut} />} />
            <Route path="/audit" element={
                <div className="min-h-screen bg-background">
                  <NavigationHeader
                    userRole={userRole}
                    userName={user.user_metadata?.full_name || user.email || "User"}
                    auditMode={auditMode}
                    onAuditModeToggle={() => setAuditMode(!auditMode)}
                    onSignOut={handleSignOut}
                  />
                  <main className="container mx-auto px-4 py-6">
                    <AuditDashboard userRole={userRole} auditMode={auditMode} />
                  </main>
                </div>
              } />
            <Route path="/cnl-grid" element={<CNLGridDashboard />} />
            <Route path="/vanguard" element={<ScribeDashboard />} />
            <Route path="/scribe" element={<ScribeDashboard />} />
          <Route path="/embedded-compliance" element={<EmbeddedComplianceDashboard />} />
          <Route path="/ethical-arbiter" element={<EthicalArbiterDashboard />} />
          <Route path="/pcre" element={<PCREDashboard />} />
          <Route path="/scribe" element={<ScribeDashboard />} />
          <Route path="/predictive-interlock" element={<PredictiveInterlockDashboard />} />
          <Route path="/quantum-matrix" element={<QuantumMarketMatrix />} />
            <Route path="/finance-fabric" element={<FinanceFabricDashboard />} />
            <Route path="/finsynapse" element={<FinSynapseDashboard />} />
          <Route path="/helix-core" element={<HelixCoreDashboard />} />
          <Route path="/smart-inbox" element={<SmartInboxDashboard />} />
          <Route path="/autobudget" element={<AutoBudgetDashboard />} />
          <Route path="/synapsex" element={<SynapseXCore />} />
          <Route path="/cross-border-payments" element={<PaymentDashboard />} />
          <Route path="/smart-finance-assistant" element={<SmartFinanceAssistant />} />
          <Route path="/ai-data-analysis" element={<AIDataAnalysisDashboard />} />
          <Route path="/market-map" element={<MarketMapDashboard />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
