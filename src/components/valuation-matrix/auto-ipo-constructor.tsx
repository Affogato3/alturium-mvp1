import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

export function AutoIPOConstructor() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [ipoData, setIpoData] = useState<any>(null);

  const demandCurve = [
    { price: 18, demand: 95 },
    { price: 20, demand: 88 },
    { price: 22, demand: 76 },
    { price: 24, demand: 62 },
    { price: 26, demand: 45 },
    { price: 28, demand: 28 }
  ];

  const handleGenerate = async () => {
    if (!companyName.trim()) {
      toast({
        title: "Company Name Required",
        description: "Please enter a company name to generate IPO analysis",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIpoData({
      company: companyName,
      valuation: (Math.random() * 5 + 2).toFixed(2),
      priceRange: `$${(18 + Math.random() * 4).toFixed(0)}-${(22 + Math.random() * 6).toFixed(0)}`,
      optimalPrice: `$${(20 + Math.random() * 4).toFixed(2)}`,
      demandScore: (75 + Math.random() * 20).toFixed(0),
      timeline: "Q2 2025",
      targetInvestors: ["Growth Funds", "Tech VCs", "Sovereign Wealth", "Pension Funds"],
      keyMetrics: {
        revenue: `$${(50 + Math.random() * 150).toFixed(0)}M`,
        growth: `${(35 + Math.random() * 65).toFixed(0)}%`,
        margin: `${(15 + Math.random() * 25).toFixed(0)}%`
      }
    });

    setIsGenerating(false);
    toast({
      title: "IPO Analysis Complete",
      description: "Comprehensive IPO package generated successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Auto-IPO Constructor™</h3>
          <p className="text-sm text-muted-foreground">AI-Powered IPO Assembly in Minutes</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Enter company name..."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="flex-1"
          disabled={isGenerating}
        />
        <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
          <Sparkles className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Generate IPO"}
        </Button>
      </div>

      {ipoData && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Valuation</span>
              </div>
              <p className="text-2xl font-bold text-primary">${ipoData.valuation}B</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm text-muted-foreground">Price Range</span>
              </div>
              <p className="text-2xl font-bold text-success">{ipoData.priceRange}</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Optimal Timing</span>
              </div>
              <p className="text-2xl font-bold text-accent">{ipoData.timeline}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Target Investor Segments
              </h4>
              <div className="flex flex-wrap gap-2">
                {ipoData.targetInvestors.map((investor: string, i: number) => (
                  <Badge key={i} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {investor}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-semibold">{ipoData.keyMetrics.revenue}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Growth Rate</span>
                  <span className="font-semibold text-success">{ipoData.keyMetrics.growth}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Profit Margin</span>
                  <span className="font-semibold">{ipoData.keyMetrics.margin}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <h4 className="font-semibold mb-3">Demand Curve Estimation</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={demandCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="price" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="demand" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 via-accent/10 to-success/10 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-semibold">AI Recommendation</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Optimal IPO price of <span className="font-semibold text-foreground">{ipoData.optimalPrice}</span> yields 
              maximum market clearing with <span className="font-semibold text-success">{ipoData.demandScore}% demand confidence</span>. 
              Recommend timing for {ipoData.timeline} based on market sentiment analysis and sector comparables.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
