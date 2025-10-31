import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, RefreshCw, Building2, Globe, ExternalLink, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export const EthicalKnowledgeLens = () => {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("1h ago");
  const [policies, setPolicies] = useState([
    { name: "OECD AI Principles", status: "active", updated: "2d ago", version: "2023.1", url: "https://oecd.ai/en/ai-principles" },
    { name: "EU AI Act", status: "active", updated: "1w ago", version: "2024.2", url: "https://artificialintelligenceact.eu/" },
    { name: "UNESCO Ethics Guidelines", status: "active", updated: "3d ago", version: "2023.4", url: "https://www.unesco.org/en/artificial-intelligence" },
    { name: "IEEE Ethics Standards", status: "active", updated: "5d ago", version: "P7000", url: "https://standards.ieee.org/industry-connections/ec/autonomous-systems/" },
  ]);

  const handleSyncKnowledge = () => {
    setSyncing(true);
    toast.info("Syncing global ethics knowledge base", {
      description: "Pulling latest regulatory updates from OECD, EU, UNESCO..."
    });

    setTimeout(() => {
      const updatedPolicies = policies.map(policy => ({
        ...policy,
        updated: "Just now",
        status: "active"
      }));
      
      setPolicies(updatedPolicies);
      setLastSyncTime("Just now");
      setSyncing(false);
      
      toast.success("Knowledge base synchronized", {
        description: `${policies.length} global policies updated • 2 new regulations detected`
      });
    }, 2500);
  };

  const handleRefreshGlobal = () => {
    toast.info("Refreshing global policies", {
      description: "Checking for regulatory updates..."
    });
    
    setTimeout(() => {
      toast.success("Global policies refreshed");
    }, 1200);
  };

  const handleViewPolicy = (policyName: string, url: string) => {
    toast.info(`Opening ${policyName}`, {
      description: "Launching policy documentation"
    });
    window.open(url, '_blank');
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-violet-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <BookOpen className="h-4 w-4 text-violet-400" />
          <span className="text-violet-400">Knowledge Lens</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Global Policies */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-slate-300">Global Policies</span>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleRefreshGlobal}
              className="h-6 px-2 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {policies.map((policy, idx) => (
                <button
                  key={idx}
                  onClick={() => handleViewPolicy(policy.name, policy.url)}
                  className="w-full p-2 rounded-lg bg-black/20 border border-violet-500/20 hover:border-violet-500/40 hover:bg-black/30 transition-all text-left group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate group-hover:text-violet-300 transition-colors">
                        {policy.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-slate-500">
                          Updated {policy.updated}
                        </p>
                        <span className="text-xs text-violet-400/60">v{policy.version}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                        <CheckCircle2 className="h-2 w-2 mr-1" />
                        Active
                      </Badge>
                      <ExternalLink className="h-3 w-3 text-violet-400/40 group-hover:text-violet-400 transition-colors" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Company Guidelines */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-violet-400" />
            <span className="text-sm text-slate-300">Company Guidelines</span>
          </div>
          
          <div className="p-3 rounded-lg bg-black/20 border border-violet-500/20 hover:bg-black/30 transition-colors">
            <p className="text-xs text-slate-400 mb-2">
              Internal ethical policies synced
            </p>
            <div className="space-y-1 text-xs text-white/60">
              <div className="flex justify-between">
                <span>Company Code of Ethics</span>
                <span className="text-green-400">✓</span>
              </div>
              <div className="flex justify-between">
                <span>ESG Compliance Framework</span>
                <span className="text-green-400">✓</span>
              </div>
              <div className="flex justify-between">
                <span>AI Usage Policy</span>
                <span className="text-green-400">✓</span>
              </div>
            </div>
            <Badge variant="outline" className="border-violet-500/50 text-violet-400 text-xs mt-2">
              Last sync: {lastSyncTime}
            </Badge>
          </div>
        </div>

        {/* Sync Action */}
        <Button 
          onClick={handleSyncKnowledge}
          disabled={syncing}
          className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-xs transition-all hover:scale-105"
        >
          <RefreshCw className={`h-3 w-3 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? "Syncing..." : "Sync Knowledge Base"}
        </Button>
      </CardContent>
    </Card>
  );
};
