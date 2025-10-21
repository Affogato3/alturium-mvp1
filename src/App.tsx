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
import { ScribeDashboard } from "@/components/scribe-dashboard";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

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
            <Route path="/cnl-grid" element={<CNLGridDashboard />} />
            <Route path="/scribe" element={<ScribeDashboard />} />
            <Route path="/" element={
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
