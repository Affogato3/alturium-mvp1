import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  type: string;
  title: string;
  generated: string;
  size: string;
  summary: string;
}

export function ReportGenerator() {
  const { toast } = useToast();
  const [reports] = useState<Report[]>([
    {
      id: "1",
      type: "Alpha Codex",
      title: "Daily Alpha Codex - Market Intelligence Brief",
      generated: "2h ago",
      size: "2.4 MB",
      summary: "Portfolio performance +23.4% vs benchmark. AI detected 12 arbitrage opportunities. Next 24h strategy: increase crypto exposure by 15%, hedge tech sector volatility.",
    },
    {
      id: "2",
      type: "Quantum Forecast",
      title: "Quantum Forecast Deck - 7-Day Outlook",
      generated: "6h ago",
      size: "5.1 MB",
      summary: "Macroeconomic simulations predict 72% probability of interest rate hold. Energy sector showing positive momentum. Recommended rebalancing: +8% commodities, -5% bonds.",
    },
    {
      id: "3",
      type: "Regulatory Audit",
      title: "Regulatory Audit Trail - Compliance Report",
      generated: "12h ago",
      size: "1.8 MB",
      summary: "All AI decisions logged and compliant with SOX, GDPR, and SEC regulations. Zero compliance violations. 847 automated trades executed within risk parameters.",
    },
    {
      id: "4",
      type: "Executive Memo",
      title: "Executive Memo - Week in Review",
      generated: "1d ago",
      size: "892 KB",
      summary: "This week's market topology favored DeFi energy trades with risk equilibrium remaining stable. Total profit: $847.3B across all strategies. AI confidence: 94.2%.",
    },
  ]);

  const handleDownload = (reportTitle: string) => {
    toast({
      title: "Report Downloaded",
      description: `${reportTitle} has been downloaded successfully.`,
    });
  };

  const handleView = (reportTitle: string) => {
    toast({
      title: "Opening Report",
      description: `Opening ${reportTitle} in viewer...`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-card via-primary/5 to-card border-primary/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        
        <div className="relative p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 animate-pulse">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-2xl">OmniQuant Insight Codex</h3>
                <p className="text-sm text-muted-foreground">AI-Generated Intelligence Reports</p>
              </div>
            </div>
            <Button className="gap-2 bg-gradient-to-r from-primary to-accent">
              <Sparkles className="w-4 h-4" />
              Generate New Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(report => (
              <Card key={report.id} className="p-4 bg-background/50 border-primary/20 hover:border-primary/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {report.type}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{report.generated}</span>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">{report.summary}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">{report.size}</span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleView(report.title)}
                        className="gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleDownload(report.title)}
                        className="gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Report Templates */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-card via-accent/5 to-card border-accent/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        
        <div className="relative p-6">
          <h4 className="font-semibold text-lg mb-4">Available Report Templates</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Daily Alpha Codex", desc: "24h profit + strategy" },
              { name: "Quantum Forecast", desc: "Global shifts + AI rationale" },
              { name: "Regulatory Audit", desc: "Compliance transparency" },
              { name: "Executive Memo", desc: "Plain English briefing" },
            ].map((template, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-gradient-to-br from-background to-accent/5 border border-border/50 hover:border-accent/40 transition-all cursor-pointer"
              >
                <FileText className="w-8 h-8 text-accent mb-2" />
                <h5 className="font-semibold text-sm mb-1">{template.name}</h5>
                <p className="text-xs text-muted-foreground">{template.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
