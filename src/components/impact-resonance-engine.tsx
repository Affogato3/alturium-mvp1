import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Network, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  DollarSign,
  Users,
  Package,
  Building2,
  Globe,
  Download,
  Filter
} from "lucide-react";

interface NetworkNode {
  id: string;
  label: string;
  type: "department" | "product" | "external" | "process";
  icon: any;
  impact: number; // -100 to +100
  profitPotential: number; // 0 to 100
  riskLevel: number; // 0 to 100
  timeToImpact: number; // weeks
  connections: string[];
}

interface RippleEffect {
  node: string;
  directImpact: number;
  indirectImpact: number;
  totalImpact: number;
  timeline: number; // weeks
  description: string;
  opportunities: string[];
  risks: string[];
}

interface ResonanceAnalysis {
  decision: string;
  timestamp: string;
  networkGraph: NetworkNode[];
  rippleEffects: RippleEffect[];
  insights: {
    directProfit: number;
    indirectProfit: number;
    hiddenRisks: string[];
    latentOpportunities: string[];
  };
}

export default function ImpactResonanceEngine() {
  const [decisionInput, setDecisionInput] = useState("");
  const [analysis, setAnalysis] = useState<ResonanceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [filterMetric, setFilterMetric] = useState<"all" | "revenue" | "cost" | "risk">("all");

  const analyzeDecision = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with networked impact modeling
    setTimeout(() => {
      const nodes: NetworkNode[] = [
        {
          id: "sales",
          label: "Sales Department",
          type: "department",
          icon: Users,
          impact: 45,
          profitPotential: 78,
          riskLevel: 15,
          timeToImpact: 2,
          connections: ["marketing", "operations", "customers"]
        },
        {
          id: "marketing",
          label: "Marketing",
          type: "department",
          icon: TrendingUp,
          impact: 32,
          profitPotential: 65,
          riskLevel: 22,
          timeToImpact: 1,
          connections: ["sales", "product", "customers"]
        },
        {
          id: "operations",
          label: "Operations",
          type: "department",
          icon: Building2,
          impact: -12,
          profitPotential: 25,
          riskLevel: 58,
          timeToImpact: 3,
          connections: ["sales", "supply", "production"]
        },
        {
          id: "product",
          label: "Product Line A",
          type: "product",
          icon: Package,
          impact: 28,
          profitPotential: 82,
          riskLevel: 18,
          timeToImpact: 4,
          connections: ["marketing", "production", "customers"]
        },
        {
          id: "production",
          label: "Production",
          type: "process",
          icon: Building2,
          impact: -8,
          profitPotential: 35,
          riskLevel: 45,
          timeToImpact: 5,
          connections: ["operations", "supply", "product"]
        },
        {
          id: "supply",
          label: "Supply Chain",
          type: "external",
          icon: Globe,
          impact: -15,
          profitPotential: 20,
          riskLevel: 72,
          timeToImpact: 6,
          connections: ["operations", "production", "market"]
        },
        {
          id: "customers",
          label: "Customer Base",
          type: "external",
          icon: Users,
          impact: 52,
          profitPotential: 88,
          riskLevel: 12,
          timeToImpact: 2,
          connections: ["sales", "marketing", "product"]
        },
        {
          id: "market",
          label: "Market Conditions",
          type: "external",
          icon: Globe,
          impact: 18,
          profitPotential: 45,
          riskLevel: 38,
          timeToImpact: 8,
          connections: ["supply", "customers", "sales"]
        }
      ];

      setAnalysis({
        decision: decisionInput,
        timestamp: new Date().toLocaleDateString(),
        networkGraph: nodes,
        rippleEffects: [
          {
            node: "Sales Department",
            directImpact: 45,
            indirectImpact: 23,
            totalImpact: 68,
            timeline: 2,
            description: "Immediate revenue boost from new pricing strategy",
            opportunities: [
              "Cross-sell potential increased by 12%",
              "Premium segment expansion possible"
            ],
            risks: ["Price sensitivity in 18% of customer base"]
          },
          {
            node: "Customer Base",
            directImpact: 52,
            indirectImpact: 15,
            totalImpact: 67,
            timeline: 2,
            description: "Enhanced value perception driving retention",
            opportunities: [
              "Referral rate projected to increase 8%",
              "Upsell readiness at 65% of active accounts"
            ],
            risks: ["Competitor response could neutralize gains"]
          },
          {
            node: "Marketing",
            directImpact: 32,
            indirectImpact: 18,
            totalImpact: 50,
            timeline: 1,
            description: "Campaign effectiveness multiplied through price optimization",
            opportunities: ["Cost per acquisition reduced by estimated 15%"],
            risks: ["Budget reallocation needed for messaging shift"]
          },
          {
            node: "Product Line A",
            directImpact: 28,
            indirectImpact: 22,
            totalImpact: 50,
            timeline: 4,
            description: "Perceived value increase enabling premium positioning",
            opportunities: [
              "Feature differentiation highlighted",
              "Bundle opportunities with complementary products"
            ],
            risks: ["Production scaling required if demand spikes"]
          }
        ],
        insights: {
          directProfit: 2850000,
          indirectProfit: 1240000,
          hiddenRisks: [
            "Supply chain capacity constraints could limit growth capture",
            "Competitor price matching would erode 40% of projected gains",
            "Marketing budget increase of $180K needed to sustain momentum"
          ],
          latentOpportunities: [
            "Secondary revenue stream: premium service tier unlocked",
            "Market share gain: 2.3% additional capture in next quarter",
            "Brand positioning: moves from mid-tier to premium perception",
            "Customer lifetime value: projected 18% increase"
          ]
        }
      });

      setIsAnalyzing(false);
    }, 1800);
  };

  const getNodeColor = (node: NetworkNode) => {
    if (filterMetric === "revenue") {
      return node.impact > 30 ? "hsl(var(--primary))" : 
             node.impact > 0 ? "hsl(var(--primary) / 0.6)" : 
             "hsl(var(--muted-foreground) / 0.3)";
    }
    if (filterMetric === "risk") {
      return node.riskLevel > 60 ? "hsl(var(--destructive))" : 
             node.riskLevel > 30 ? "hsl(var(--destructive) / 0.6)" : 
             "hsl(var(--primary) / 0.5)";
    }
    // Default: profit potential
    return node.profitPotential > 70 ? "hsl(var(--primary))" : 
           node.profitPotential > 40 ? "hsl(var(--primary) / 0.6)" : 
           "hsl(var(--muted-foreground) / 0.4)";
  };

  const getNodeSize = (node: NetworkNode) => {
    const base = 60;
    const multiplier = Math.abs(node.impact) / 100;
    return base + (multiplier * 40);
  };

  const exportReport = () => {
    // In production, this would generate a PDF
    const reportData = JSON.stringify(analysis, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'impact-resonance-report.json';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Impact Resonance Engine
          </CardTitle>
          <CardDescription>
            Model how decisions ripple through your entire business ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="e.g., Increase product pricing by 15%"
              value={decisionInput}
              onChange={(e) => setDecisionInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && decisionInput && analyzeDecision()}
              className="flex-1 bg-background/50 border-border/50"
            />
            <Button 
              onClick={analyzeDecision} 
              disabled={!decisionInput || isAnalyzing}
              className="px-6"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Impact"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Direct Profit Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">
                    ${(analysis.insights.directProfit / 1000000).toFixed(2)}M
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Indirect Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">
                    ${(analysis.insights.indirectProfit / 1000000).toFixed(2)}M
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Latent Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">
                    {analysis.insights.latentOpportunities.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Hidden Risks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span className="text-2xl font-bold text-foreground">
                    {analysis.insights.hiddenRisks.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="network" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="network">Network Graph</TabsTrigger>
                <TabsTrigger value="ripples">Ripple Effects</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Network Graph Tab */}
            <TabsContent value="network" className="space-y-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Business Ecosystem Network</CardTitle>
                      <CardDescription>
                        Node size = impact strength | Color = {filterMetric === "all" ? "profit potential" : filterMetric}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={filterMetric === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterMetric("all")}
                      >
                        All
                      </Button>
                      <Button
                        variant={filterMetric === "revenue" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterMetric("revenue")}
                      >
                        Revenue
                      </Button>
                      <Button
                        variant={filterMetric === "risk" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterMetric("risk")}
                      >
                        Risk
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Network Visualization */}
                  <div className="relative h-[500px] bg-background/30 rounded-lg border border-border/30 overflow-hidden">
                    {/* Simulated network graph using positioned divs */}
                    <div className="absolute inset-0 p-8">
                      {analysis.networkGraph.map((node, idx) => {
                        const positions = [
                          { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }, // center
                          { top: "20%", left: "30%", transform: "translate(-50%, -50%)" },
                          { top: "20%", left: "70%", transform: "translate(-50%, -50%)" },
                          { top: "50%", left: "15%", transform: "translate(-50%, -50%)" },
                          { top: "50%", left: "85%", transform: "translate(-50%, -50%)" },
                          { top: "80%", left: "30%", transform: "translate(-50%, -50%)" },
                          { top: "80%", left: "70%", transform: "translate(-50%, -50%)" },
                          { top: "35%", left: "50%", transform: "translate(-50%, -50%)" }
                        ];
                        
                        const position = positions[idx] || positions[0];
                        const size = getNodeSize(node);
                        const color = getNodeColor(node);
                        const Icon = node.icon;
                        
                        return (
                          <div
                            key={node.id}
                            className="absolute cursor-pointer transition-all duration-300 hover:scale-110"
                            style={{
                              ...position,
                              width: `${size}px`,
                              height: `${size}px`,
                            }}
                            onMouseEnter={() => setSelectedNode(node)}
                            onMouseLeave={() => setSelectedNode(null)}
                          >
                            <div
                              className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
                              style={{
                                backgroundColor: color,
                                border: selectedNode?.id === node.id ? "3px solid hsl(var(--primary))" : "2px solid hsl(var(--border))"
                              }}
                            >
                              <Icon className="w-1/2 h-1/2 text-white" />
                            </div>
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                              <Badge variant="secondary" className="text-xs">
                                {node.label}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Connection lines (simplified) */}
                    <svg className="absolute inset-0 pointer-events-none opacity-30">
                      <line x1="50%" y1="50%" x2="30%" y2="20%" stroke="hsl(var(--primary))" strokeWidth="2" />
                      <line x1="50%" y1="50%" x2="70%" y2="20%" stroke="hsl(var(--primary))" strokeWidth="2" />
                      <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" />
                      <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* Node Details Panel */}
                  {selectedNode && (
                    <Card className="mt-4 border-primary/30 bg-primary/5 animate-fade-in">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Impact Score</p>
                            <p className={`text-xl font-bold ${selectedNode.impact > 0 ? 'text-primary' : 'text-destructive'}`}>
                              {selectedNode.impact > 0 ? '+' : ''}{selectedNode.impact}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Profit Potential</p>
                            <p className="text-xl font-bold text-primary">{selectedNode.profitPotential}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                            <p className="text-xl font-bold text-destructive">{selectedNode.riskLevel}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Time to Impact</p>
                            <p className="text-xl font-bold text-foreground">{selectedNode.timeToImpact}w</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ripple Effects Tab */}
            <TabsContent value="ripples" className="space-y-4">
              {analysis.rippleEffects.map((effect, idx) => (
                <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{effect.node}</CardTitle>
                        <CardDescription>{effect.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Week {effect.timeline}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Impact Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Direct Impact</p>
                        <p className="text-xl font-bold text-primary">+{effect.directImpact}%</p>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-xs text-muted-foreground mb-1">Indirect Impact</p>
                        <p className="text-xl font-bold text-primary">+{effect.indirectImpact}%</p>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Total Impact</p>
                        <p className="text-xl font-bold text-primary">+{effect.totalImpact}%</p>
                      </div>
                    </div>

                    {/* Timeline Bar */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Impact Timeline (weeks)</p>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
                          style={{ width: `${(effect.timeline / 8) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Opportunities & Risks */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Opportunities
                        </p>
                        <ul className="space-y-1">
                          {effect.opportunities.map((opp, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{opp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Risks
                        </p>
                        <ul className="space-y-1">
                          {effect.risks.map((risk, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-destructive mt-1">•</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="insights" className="space-y-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Latent Opportunities
                  </CardTitle>
                  <CardDescription>Hidden profit streams revealed by network analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.insights.latentOpportunities.map((opp, idx) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{opp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Hidden Risks
                  </CardTitle>
                  <CardDescription>Cascading risks detected through propagation modeling</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.insights.hiddenRisks.map((risk, idx) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-lg bg-destructive/5 border border-destructive/10 hover:bg-destructive/10 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground leading-relaxed">{risk}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Empty State */}
      {!analysis && !isAnalyzing && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-16 text-center">
            <Network className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              Enter a business decision to see its networked impact across your entire ecosystem
            </p>
            <p className="text-xs text-muted-foreground/70">
              AI models ripple effects, hidden opportunities, and cascading risks
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
