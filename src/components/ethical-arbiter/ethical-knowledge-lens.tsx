import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, RefreshCw, Building2, Globe } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const EthicalKnowledgeLens = () => {
  const policies = [
    { name: "OECD AI Principles", status: "active", updated: "2d ago" },
    { name: "EU AI Act", status: "active", updated: "1w ago" },
    { name: "UNESCO Ethics Guidelines", status: "active", updated: "3d ago" },
    { name: "IEEE Ethics Standards", status: "active", updated: "5d ago" },
  ];

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
            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-cyan-400">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {policies.map((policy, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-black/20 border border-violet-500/20 hover:border-violet-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate">
                        {policy.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Updated {policy.updated}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                      ✓
                    </Badge>
                  </div>
                </div>
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
          
          <div className="p-3 rounded-lg bg-black/20 border border-violet-500/20">
            <p className="text-xs text-slate-400">
              Internal ethical policies synced
            </p>
            <Badge variant="outline" className="border-violet-500/50 text-violet-400 text-xs mt-2">
              Last sync: 1h ago
            </Badge>
          </div>
        </div>

        {/* Sync Action */}
        <Button className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-xs">
          <RefreshCw className="h-3 w-3 mr-2" />
          Sync Knowledge Base
        </Button>
      </CardContent>
    </Card>
  );
};
