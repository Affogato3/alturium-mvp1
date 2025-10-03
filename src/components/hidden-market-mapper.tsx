import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportDialog } from "./export-dialog";
import { useReportExport } from "@/hooks/use-report-export";
import { useState } from "react";
import {
  MapPin,
  TrendingUp,
  Target,
  AlertCircle,
  Download,
  Filter,
  DollarSign,
  Globe,
  Package,
  Users,
  BarChart3,
  Clock,
  Lightbulb,
  Network,
} from "lucide-react";

interface MarketOpportunity {
  id: string;
  name: string;
  description: string;
  profitScore: number;
  category: "segment" | "geography" | "product" | "pricing";
  revenue: number;
  roi: number;
  risk: number;
  timeToRealize: string;
  actions: string[];
  competitorSaturation: number;
  marketDemand: number;
  operationalFeasibility: number;
}

const mockOpportunities: MarketOpportunity[] = [
  {
    id: "1",
    name: "Premium SMB Segment Expansion",
    description: "Mid-market businesses ($10M-$50M ARR) showing high engagement but 40% lower conversion than enterprise",
    profitScore: 92,
    category: "segment",
    revenue: 2800000,
    roi: 340,
    risk: 22,
    timeToRealize: "6-9 months",
    actions: [
      "Launch tailored SMB pricing tier at $499/mo",
      "Create self-service onboarding with guided setup",
      "Deploy 3-person SMB success team",
      "Run LinkedIn campaign targeting CFOs at $50k budget"
    ],
    competitorSaturation: 35,
    marketDemand: 87,
    operationalFeasibility: 78
  },
  {
    id: "2",
    name: "Southeast Asia Market Entry",
    description: "Singapore, Malaysia, Thailand showing 240% search growth for core product category with minimal competition",
    profitScore: 88,
    category: "geography",
    revenue: 3200000,
    roi: 280,
    risk: 38,
    timeToRealize: "8-12 months",
    actions: [
      "Establish Singapore regional HQ with 2 sales reps",
      "Localize product for APAC compliance (PDPA, local payment)",
      "Partner with regional resellers in Malaysia/Thailand",
      "Launch multilingual support (English, Mandarin, Bahasa)"
    ],
    competitorSaturation: 18,
    marketDemand: 91,
    operationalFeasibility: 65
  },
  {
    id: "3",
    name: "Analytics + Automation Bundle",
    description: "85% of analytics users also purchase automation tools separately. Bundle penetration could capture $4.2M incremental",
    profitScore: 85,
    category: "product",
    revenue: 4200000,
    roi: 420,
    risk: 15,
    timeToRealize: "3-5 months",
    actions: [
      "Create 'Pro Suite' bundle at 25% discount vs separate",
      "Cross-sell existing analytics customers via email campaign",
      "Add one-click upgrade path in product UI",
      "Train sales on bundle positioning and objection handling"
    ],
    competitorSaturation: 42,
    marketDemand: 76,
    operationalFeasibility: 92
  },
  {
    id: "4",
    name: "Usage-Based Pricing for High-Volume Customers",
    description: "Top 12% of customers exceed usage limits monthly. Flexible pricing could reduce churn by 18% and increase ARPU 32%",
    profitScore: 81,
    category: "pricing",
    revenue: 1900000,
    roi: 385,
    risk: 25,
    timeToRealize: "4-6 months",
    actions: [
      "Introduce metered pricing tier starting at $0.08/unit",
      "Migrate top 50 high-usage accounts with dedicated CSM support",
      "Build usage analytics dashboard for transparency",
      "Create pricing calculator tool for website"
    ],
    competitorSaturation: 28,
    marketDemand: 82,
    operationalFeasibility: 71
  },
  {
    id: "5",
    name: "Healthcare Vertical Specialization",
    description: "Healthcare accounts have 2.3x higher LTV but represent only 8% of customer base. Vertical solution could capture $6M TAM",
    profitScore: 79,
    category: "segment",
    revenue: 5800000,
    roi: 290,
    risk: 42,
    timeToRealize: "10-14 months",
    actions: [
      "Develop HIPAA-compliant version with BAA support",
      "Hire healthcare industry sales specialist",
      "Create healthcare-specific case studies and collateral",
      "Attend 2 major healthcare tech conferences (HIMSS, HLTH)"
    ],
    competitorSaturation: 52,
    marketDemand: 88,
    operationalFeasibility: 58
  },
  {
    id: "6",
    name: "Freemium Product-Led Growth",
    description: "Competitor analysis shows freemium models capture 8x more leads. Could generate 4,500 qualified trials monthly",
    profitScore: 74,
    category: "product",
    revenue: 2100000,
    roi: 210,
    risk: 35,
    timeToRealize: "5-8 months",
    actions: [
      "Launch free tier with 3 users, 100 records limit",
      "Build viral sharing features and team invites",
      "Implement in-app upgrade prompts at usage milestones",
      "Create automated email nurture sequences"
    ],
    competitorSaturation: 61,
    marketDemand: 68,
    operationalFeasibility: 77
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "segment": return Users;
    case "geography": return Globe;
    case "product": return Package;
    case "pricing": return DollarSign;
    default: return Target;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "segment": return "text-primary";
    case "geography": return "text-accent";
    case "product": return "text-success";
    case "pricing": return "text-warning";
    default: return "text-muted-foreground";
  }
};

export function HiddenMarketMapper() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<MarketOpportunity | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"score" | "revenue" | "risk">("score");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { exportReport, isGenerating } = useReportExport();

  const filteredOpportunities = mockOpportunities
    .filter(opp => filterCategory === "all" || opp.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === "score") return b.profitScore - a.profitScore;
      if (sortBy === "revenue") return b.revenue - a.revenue;
      return a.risk - b.risk;
    });

  const totalPotentialRevenue = filteredOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
  const avgProfitScore = Math.round(filteredOpportunities.reduce((sum, opp) => sum + opp.profitScore, 0) / filteredOpportunities.length);

  const handleExport = async (format: "pdf" | "word") => {
    const exportData = {
      generatedAt: new Date().toISOString(),
      totalOpportunities: filteredOpportunities.length,
      totalPotentialRevenue,
      avgProfitScore,
      opportunities: filteredOpportunities.map(opp => ({
        ...opp,
        formattedRevenue: `$${(opp.revenue / 1000000).toFixed(1)}M`,
        formattedROI: `${opp.roi}%`
      }))
    };

    await exportReport(
      "Hidden Market Opportunities Analysis",
      exportData,
      `Comprehensive market opportunity analysis identifying ${filteredOpportunities.length} revenue opportunities worth $${(totalPotentialRevenue / 1000000).toFixed(1)}M`,
      format
    );
    setShowExportDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light tracking-tight text-foreground">Hidden Market Mapper</h2>
          <p className="text-muted-foreground mt-1">
            AI-powered revenue opportunity discovery and competitive intelligence
          </p>
        </div>
        <Button onClick={() => setShowExportDialog(true)} variant="outline" className="gap-2" disabled={isGenerating}>
          <Download className="h-4 w-4" />
          Export Analysis
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Opportunities</p>
                <p className="text-3xl font-light mt-1">{filteredOpportunities.length}</p>
              </div>
              <Target className="h-8 w-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Revenue</p>
                <p className="text-3xl font-light mt-1">${(totalPotentialRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-success opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Profit Score</p>
                <p className="text-3xl font-light mt-1">{avgProfitScore}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High-Value Opps</p>
                <p className="text-3xl font-light mt-1">
                  {filteredOpportunities.filter(o => o.profitScore >= 80).length}
                </p>
              </div>
              <Lightbulb className="h-8 w-8 text-warning opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50 shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>
            <div className="flex gap-2">
              {["all", "segment", "geography", "product", "pricing"].map(cat => (
                <Button
                  key={cat}
                  variant={filterCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory(cat)}
                  className="capitalize"
                >
                  {cat}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-md border border-border bg-background text-sm"
              >
                <option value="score">Profit Score</option>
                <option value="revenue">Revenue Potential</option>
                <option value="risk">Risk Level</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opportunities List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Market Opportunities</h3>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {filteredOpportunities.map((opportunity) => {
                const CategoryIcon = getCategoryIcon(opportunity.category);
                const categoryColor = getCategoryColor(opportunity.category);
                
                return (
                  <Card
                    key={opportunity.id}
                    className={`border-border/50 shadow-card cursor-pointer transition-all hover:shadow-elevated ${
                      selectedOpportunity?.id === opportunity.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedOpportunity(opportunity)}
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CategoryIcon className={`h-4 w-4 ${categoryColor}`} />
                              <Badge variant="outline" className="capitalize">
                                {opportunity.category}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-foreground mb-1">
                              {opportunity.name}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {opportunity.description}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-2xl font-light text-foreground">
                              {opportunity.profitScore}
                            </div>
                            <div className="text-xs text-muted-foreground">Profit Score</div>
                          </div>
                        </div>

                        {/* Profit Score Bar */}
                        <div className="space-y-2">
                          <Progress value={opportunity.profitScore} className="h-2" />
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
                          <div>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                            <p className="text-sm font-medium text-success">
                              ${(opportunity.revenue / 1000000).toFixed(1)}M
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">ROI</p>
                            <p className="text-sm font-medium text-primary">
                              {opportunity.roi}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Risk</p>
                            <p className={`text-sm font-medium ${
                              opportunity.risk < 30 ? 'text-success' :
                              opportunity.risk < 40 ? 'text-warning' : 'text-danger'
                            }`}>
                              {opportunity.risk}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Opportunity Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Opportunity Details</h3>
          {selectedOpportunity ? (
            <Card className="border-border/50 shadow-elevated">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getCategoryIcon(selectedOpportunity.category);
                    return <Icon className={`h-5 w-5 ${getCategoryColor(selectedOpportunity.category)}`} />;
                  })()}
                  <div className="flex-1">
                    <CardTitle className="text-xl font-light">
                      {selectedOpportunity.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedOpportunity.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start border-b border-border/50 rounded-none bg-transparent h-auto p-0">
                  <TabsTrigger value="overview" className="rounded-none border-b-2">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="actions" className="rounded-none border-b-2">
                    Action Plan
                  </TabsTrigger>
                  <TabsTrigger value="simulation" className="rounded-none border-b-2">
                    Simulation
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-6 space-y-6">
                  {/* Financial Metrics */}
                  <div>
                    <h4 className="text-sm font-medium mb-4">Financial Impact</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Revenue Potential</p>
                        <p className="text-2xl font-light text-success">
                          ${(selectedOpportunity.revenue / 1000000).toFixed(2)}M
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Expected ROI</p>
                        <p className="text-2xl font-light text-primary">
                          {selectedOpportunity.roi}%
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                        <p className={`text-2xl font-light ${
                          selectedOpportunity.risk < 30 ? 'text-success' :
                          selectedOpportunity.risk < 40 ? 'text-warning' : 'text-danger'
                        }`}>
                          {selectedOpportunity.risk}%
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Time to Realize</p>
                        <p className="text-2xl font-light text-foreground">
                          {selectedOpportunity.timeToRealize}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Market Analysis */}
                  <div>
                    <h4 className="text-sm font-medium mb-4">Market Intelligence</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Market Demand</span>
                          <span className="font-medium">{selectedOpportunity.marketDemand}%</span>
                        </div>
                        <Progress value={selectedOpportunity.marketDemand} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Operational Feasibility</span>
                          <span className="font-medium">{selectedOpportunity.operationalFeasibility}%</span>
                        </div>
                        <Progress value={selectedOpportunity.operationalFeasibility} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Competitor Saturation</span>
                          <span className="font-medium">{selectedOpportunity.competitorSaturation}%</span>
                        </div>
                        <Progress 
                          value={selectedOpportunity.competitorSaturation} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Lightbulb className="h-4 w-4" />
                      <span>AI-generated action plan to capture this opportunity</span>
                    </div>
                    {selectedOpportunity.actions.map((action, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 rounded-lg border border-border/50 bg-card hover:shadow-card transition-shadow"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="simulation" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <BarChart3 className="h-4 w-4" />
                      <span>Projected outcome scenarios over time</span>
                    </div>

                    {/* Scenario Cards */}
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg border border-success/30 bg-success/5">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="font-medium text-success">Best Case Scenario</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Revenue</p>
                            <p className="font-medium">${(selectedOpportunity.revenue * 1.3 / 1000000).toFixed(1)}M</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ROI</p>
                            <p className="font-medium">{Math.round(selectedOpportunity.roi * 1.25)}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Timeline</p>
                            <p className="font-medium">{selectedOpportunity.timeToRealize.split('-')[0]} mo</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="font-medium text-primary">Expected Scenario</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Revenue</p>
                            <p className="font-medium">${(selectedOpportunity.revenue / 1000000).toFixed(1)}M</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ROI</p>
                            <p className="font-medium">{selectedOpportunity.roi}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Timeline</p>
                            <p className="font-medium">{selectedOpportunity.timeToRealize}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-warning/30 bg-warning/5">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="h-4 w-4 text-warning" />
                          <span className="font-medium text-warning">Conservative Scenario</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Revenue</p>
                            <p className="font-medium">${(selectedOpportunity.revenue * 0.65 / 1000000).toFixed(1)}M</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ROI</p>
                            <p className="font-medium">{Math.round(selectedOpportunity.roi * 0.7)}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Timeline</p>
                            <p className="font-medium">{selectedOpportunity.timeToRealize.split('-')[1]}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resources Required */}
                    <div className="pt-4 border-t border-border/50">
                      <h5 className="text-sm font-medium mb-3">Resources Required</h5>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>2-4 team members</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>${(selectedOpportunity.revenue / selectedOpportunity.roi * 100 / 1000).toFixed(0)}K investment</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedOpportunity.timeToRealize}</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                          <Network className="h-4 w-4 text-muted-foreground" />
                          <span>Cross-functional effort</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          ) : (
            <Card className="border-border/50 shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground">
                  Select an opportunity to view detailed analysis
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExport}
        isGenerating={isGenerating}
      />
    </div>
  );
}
