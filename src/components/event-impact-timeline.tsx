import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingDown, TrendingUp, DollarSign, Droplets, AlertTriangle } from "lucide-react";

interface MetricImpact {
  metric: string;
  icon: any;
  timeToImpact: string;
  impactMagnitude: string;
  direction: "positive" | "negative" | "neutral";
  confidence: number;
  description: string;
}

interface EventPrediction {
  event: string;
  analysisDate: string;
  impacts: MetricImpact[];
  insights: string[];
}

export default function EventImpactTimeline() {
  const [eventInput, setEventInput] = useState("");
  const [prediction, setPrediction] = useState<EventPrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeEvent = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setPrediction({
        event: eventInput,
        analysisDate: new Date().toLocaleDateString(),
        impacts: [
          {
            metric: "Revenue",
            icon: DollarSign,
            timeToImpact: "2-4 weeks",
            impactMagnitude: "-3.2% to -5.1%",
            direction: "negative",
            confidence: 87,
            description: "Direct correlation with market sentiment shift"
          },
          {
            metric: "Cash Flow",
            icon: Droplets,
            timeToImpact: "4-6 weeks",
            impactMagnitude: "-2.8% to -4.5%",
            direction: "negative",
            confidence: 82,
            description: "Delayed effect from revenue decline and payment cycles"
          },
          {
            metric: "Operating Costs",
            icon: TrendingUp,
            timeToImpact: "1-2 weeks",
            impactMagnitude: "+1.5% to +2.3%",
            direction: "negative",
            confidence: 91,
            description: "Immediate increase in hedging and risk mitigation expenses"
          }
        ],
        insights: [
          "Consider accelerating receivables collection to offset cash flow impact",
          "Evaluate defensive positioning in high-margin product lines",
          "Monitor competitor response patterns for strategic adjustments",
          "Hedge currency exposure if event affects international operations"
        ]
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Event Impact Predictor
          </CardTitle>
          <CardDescription>
            Enter any business or market event to analyze timeline and metric impacts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="e.g., Fed announces 0.5% interest rate hike"
              value={eventInput}
              onChange={(e) => setEventInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && eventInput && analyzeEvent()}
              className="flex-1 bg-background/50 border-border/50"
            />
            <Button 
              onClick={analyzeEvent} 
              disabled={!eventInput || isAnalyzing}
              className="px-6"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {prediction && (
        <div className="space-y-6 animate-fade-in">
          {/* Event Summary */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Event Analysis</CardTitle>
              <CardDescription className="text-base font-medium text-foreground/80">
                "{prediction.event}"
              </CardDescription>
              <p className="text-sm text-muted-foreground">
                Analysis Date: {prediction.analysisDate}
              </p>
            </CardHeader>
          </Card>

          {/* Timeline Impact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prediction.impacts.map((impact, idx) => {
              const Icon = impact.icon;
              return (
                <Card 
                  key={idx} 
                  className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${
                          impact.direction === 'negative' 
                            ? 'bg-destructive/10 text-destructive' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <CardTitle className="text-base">{impact.metric}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {impact.confidence}% confidence
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Time to Impact</p>
                      <p className="text-lg font-semibold text-foreground">{impact.timeToImpact}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Projected Impact</p>
                      <p className={`text-2xl font-bold ${
                        impact.direction === 'negative' ? 'text-destructive' : 'text-primary'
                      }`}>
                        {impact.impactMagnitude}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {impact.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Timeline Visualization */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Impact Timeline</CardTitle>
              <CardDescription>Sequential effect cascade across metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/50"></div>
                
                {/* Timeline Items */}
                <div className="space-y-6">
                  {prediction.impacts
                    .sort((a, b) => {
                      const timeA = parseInt(a.timeToImpact.split('-')[0]);
                      const timeB = parseInt(b.timeToImpact.split('-')[0]);
                      return timeA - timeB;
                    })
                    .map((impact, idx) => {
                      const Icon = impact.icon;
                      return (
                        <div key={idx} className="relative pl-12 pb-6">
                          <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-primary border-2 border-background"></div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-primary" />
                              <span className="font-semibold">{impact.metric}</span>
                              <Badge variant="secondary" className="text-xs">
                                {impact.timeToImpact}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{impact.description}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actionable Insights */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Recommended Actions
              </CardTitle>
              <CardDescription>Proactive measures to mitigate impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prediction.insights.map((insight, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!prediction && !isAnalyzing && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-16 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Enter a business or market event to see predicted timeline impacts
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
