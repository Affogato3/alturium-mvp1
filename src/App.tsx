import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage } from "@/components/auth-page";
import { NavigationHeader } from "@/components/navigation-header";
import { AuditDashboard } from "@/components/audit-dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<{
    name: string;
    role: "admin" | "auditor" | "founder";
  } | null>(null);
  const [auditMode, setAuditMode] = useState(false);

  const handleSignIn = (name: string, role: "admin" | "auditor" | "founder") => {
    setUser({ name, role });
  };

  const handleSignOut = () => {
    setUser(null);
    setAuditMode(false);
  };

  if (!user) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthPage onSignIn={handleSignIn} />
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
          <div className="min-h-screen bg-gradient-to-br from-background to-muted">
            <NavigationHeader
              userRole={user.role}
              userName={user.name}
              auditMode={auditMode}
              onAuditModeToggle={() => setAuditMode(!auditMode)}
              onSignOut={handleSignOut}
            />
            <main className="container mx-auto px-4 py-6">
              <AuditDashboard userRole={user.role} auditMode={auditMode} />
            </main>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
