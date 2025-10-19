import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  DollarSign, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Zap,
  BarChart3,
  RefreshCw,
  Play
} from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: "personnel" | "budget" | "inventory";
  current: number;
  optimal: number;
  unit: string;
  department: string;
  utilization: number;
  predictedROI: number;
  efficiency: "optimal" | "suboptimal" | "critical";
}

interface Suggestion {
  id: string;
  type: "reallocation" | "warning" | "opportunity";
  from: string;
  to: string;
  amount: number;
  predictedImpact: number;
  confidence: number;
  reasoning: string;
}

export function DynamicResourceAllocator() {
  const [view, setView] = useState<"global" | "cluster" | "node">("global");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [autoExecute, setAutoExecute] = useState(false);
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "r1",
      name: "Engineering Team",
      type: "personnel",
      current: 45,
      optimal: 52,
      unit: "people",
      department: "Engineering",
      utilization: 112,
      predictedROI: 18.4,
      efficiency: "critical"
    },
    {
      id: "r2",
      name: "Marketing Budget Q2",
      type: "budget",
      current: 450000,
      optimal: 580000,
      unit: "$",
      department: "Marketing",
      utilization: 78,
      predictedROI: 24.7,
      efficiency: "suboptimal"
    },
    {
      id: "r3",
      name: "Cloud Infrastructure",
      type: "budget",
      current: 120000,
      optimal: 95000,
      unit: "$",
      department: "Engineering",
      utilization: 126,
      predictedROI: -8.3,
      efficiency: "critical"
    },
    {
      id: "r4",
      name: "Product Inventory (US East)",
      type: "inventory",
      current: 15000,
      optimal: 22000,
      unit: "units",
      department: "Operations",
      utilization: 68,
      predictedROI: 31.2,
      efficiency: "suboptimal"
    },
    {
      id: "r5",
      name: "Sales Team",
      type: "personnel",
      current: 28,
      optimal: 28,
      unit: "people",
      department: "Sales",
      utilization: 98,
      predictedROI: 15.2,
      efficiency: "optimal"
    },
    {
      id: "r6",
      name: "R&D Budget",
      type: "budget",
      current: 890000,
      optimal: 1100000,
      unit: "$",
      department: "R&D",
      utilization: 81,
      predictedROI: 42.1,
      efficiency: "suboptimal"
    }
  ]);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "s1",
      type: "reallocation",
      from: "Cloud Infrastructure",
      to: "Marketing Budget Q2",
      amount: 25000,
      predictedImpact: 12.4,
      confidence: 87,
      reasoning: "Marketing shows higher ROI potential. Cloud usage 26% over optimal."
    },
    {
      id: "s2",
      type: "opportunity",
      from: "General Reserve",
      to: "R&D Budget",
      amount: 210000,
      predictedImpact: 28.7,
      confidence: 92,
      reasoning: "R&D pipeline shows breakthrough potential. Historical success rate: 74%."
    },
    {
      id: "s3",
      type: "warning",
      from: "Engineering Team",
      to: "Engineering Team",
      amount: 7,
      predictedImpact: -15.2,
      confidence: 95,
      reasoning: "Team 12% over capacity. Burnout risk detected. Suggest immediate hiring."
    },
    {
      id: "s4",
      type: "reallocation",
      from: "Inventory (US West)",
      to: "Product Inventory (US East)",
      amount: 7000,
      predictedImpact: 19.3,
      confidence: 89,
      reasoning: "Demand forecast shows 34% increase in East region. West oversupplied by 22%."
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prev => prev.map(r => ({
        ...r,
        utilization: Math.max(50, Math.min(130, r.utilization + (Math.random() - 0.5) * 3))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getEfficiencyColor = (efficiency: Resource["efficiency"]) => {
    switch (efficiency) {
      case "optimal": return "text-green-400 border-green-400/40";
      case "suboptimal": return "text-yellow-400 border-yellow-400/40";
      case "critical": return "text-red-400 border-red-400/40";
    }
  };

  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "personnel": return <Users className="w-4 h-4" />;
      case "budget": return <DollarSign className="w-4 h-4" />;
      case "inventory": return <Package className="w-4 h-4" />;
    }
  };

  const getSuggestionIcon = (type: Suggestion["type"]) => {
    switch (type) {
      case "reallocation": return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case "opportunity": return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  const handleSliderChange = (resourceId: string, value: number[]) => {
    setResources(prev => prev.map(r => 
      r.id === resourceId ? { ...r, current: value[0] } : r
    ));
  };

  const applySuggestion = (suggestion: Suggestion) => {
    console.log("Applying suggestion:", suggestion);
  };

  const departments = Array.from(new Set(resources.map(r => r.department)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/20 backdrop-blur-sm">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
              Dynamic Resource Allocation Engine™
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              AI-Powered Resource Optimization • Predictive Demand Modeling • Autonomous Execution
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge 
            variant="outline" 
            className={autoExecute ? "bg-green-500/20 text-green-400 border-green-500/40" : "bg-gray-500/20 text-gray-400 border-gray-500/40"}
          >
            <Zap className="w-3 h-3 mr-1" />
            Auto-Execute: {autoExecute ? "ON" : "OFF"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoExecute(!autoExecute)}
            className="border-primary/20"
          >
            {autoExecute ? "Disable" : "Enable"} Auto-Execute
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* AI Suggestions Panel */}
        <div className="col-span-4">
          <Card className="bg-black/40 backdrop-blur-sm border-primary/20 p-4 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-primary animate-pulse" />
              <h3 className="text-lg font-bold text-white">AI Recommendations</h3>
              <Badge className="ml-auto bg-primary/20 text-primary border-primary/40">
                {suggestions.length} Active
              </Badge>
            </div>
            
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <Card 
                    key={suggestion.id}
                    className="bg-black/60 border-primary/10 p-3 hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {getSuggestionIcon(suggestion.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-white">
                            {suggestion.type === "reallocation" && "Reallocate"}
                            {suggestion.type === "opportunity" && "Opportunity"}
                            {suggestion.type === "warning" && "Warning"}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={suggestion.predictedImpact > 0 ? "text-green-400 border-green-400/40" : "text-red-400 border-red-400/40"}
                          >
                            {suggestion.predictedImpact > 0 ? "+" : ""}{suggestion.predictedImpact.toFixed(1)}%
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-primary/60 mb-2">{suggestion.reasoning}</p>
                        
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-primary/40">Confidence:</span>
                          <span className="text-primary">{suggestion.confidence}%</span>
                        </div>
                        
                        <div className="w-full bg-black/40 rounded-full h-1 mb-3">
                          <div 
                            className="bg-primary h-1 rounded-full"
                            style={{ width: `${suggestion.confidence}%` }}
                          />
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(suggestion)}
                          className="w-full"
                        >
                          <Play className="w-3 h-3 mr-2" />
                          Apply & Simulate
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Resource Grid */}
        <div className="col-span-8">
          <Card className="bg-black/40 backdrop-blur-sm border-primary/20 p-4">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-lg font-bold text-white">Resource Allocation Control</h3>
              <div className="flex gap-2 ml-auto">
                <Button
                  variant={view === "global" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("global")}
                >
                  Global View
                </Button>
                <Button
                  variant={view === "cluster" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("cluster")}
                >
                  By Department
                </Button>
              </div>
            </div>

            {/* Department Filters (Cluster View) */}
            {view === "cluster" && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {departments.map(dept => (
                  <Button
                    key={dept}
                    variant={selectedDepartment === dept ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    {dept}
                  </Button>
                ))}
              </div>
            )}

            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-4">
                {resources
                  .filter(r => view === "global" || !selectedDepartment || r.department === selectedDepartment)
                  .map((resource) => (
                  <Card 
                    key={resource.id}
                    className="bg-black/60 border-primary/10 p-4 hover:bg-black/80 transition-colors"
                    onClick={() => setSelectedResource(resource)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          resource.efficiency === "optimal" ? "bg-green-500/20" :
                          resource.efficiency === "suboptimal" ? "bg-yellow-500/20" :
                          "bg-red-500/20"
                        }`}>
                          {getTypeIcon(resource.type)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{resource.name}</h4>
                          <p className="text-xs text-primary/40">{resource.department}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getEfficiencyColor(resource.efficiency)}>
                        {resource.utilization}% Utilized
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-primary/40 mb-1">Current</p>
                        <p className="text-sm font-bold text-white">
                          {resource.type === "budget" ? `$${(resource.current / 1000).toFixed(0)}K` : `${resource.current} ${resource.unit}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-primary/40 mb-1">Optimal</p>
                        <p className="text-sm font-bold text-primary">
                          {resource.type === "budget" ? `$${(resource.optimal / 1000).toFixed(0)}K` : `${resource.optimal} ${resource.unit}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-primary/40 mb-1">Predicted ROI</p>
                        <p className={`text-sm font-bold ${resource.predictedROI > 0 ? "text-green-400" : "text-red-400"}`}>
                          {resource.predictedROI > 0 ? "+" : ""}{resource.predictedROI}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-primary/60">Adjust Allocation</span>
                        <span className="text-xs text-primary">
                          {resource.type === "budget" ? `$${(resource.current / 1000).toFixed(0)}K` : `${resource.current} ${resource.unit}`}
                        </span>
                      </div>
                      <Slider
                        value={[resource.current]}
                        onValueChange={(value) => handleSliderChange(resource.id, value)}
                        min={Math.floor(resource.optimal * 0.5)}
                        max={Math.ceil(resource.optimal * 1.5)}
                        step={resource.type === "budget" ? 5000 : 1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-primary/40">
                        <span>Min: {Math.floor(resource.optimal * 0.5)}</span>
                        <span>Max: {Math.ceil(resource.optimal * 1.5)}</span>
                      </div>
                    </div>

                    {resource.efficiency !== "optimal" && (
                      <div className="mt-3 flex items-center gap-2 p-2 bg-primary/10 rounded border border-primary/20">
                        <Zap className="w-4 h-4 text-primary" />
                        <p className="text-xs text-primary">
                          AI suggests moving to {resource.optimal} {resource.unit} for optimal efficiency
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Floating Stats */}
      <div className="fixed bottom-6 right-6 flex gap-3">
        <Card className="bg-black/80 backdrop-blur-sm border-green-500/30 p-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <div>
              <p className="text-xs text-green-400/60">Optimal</p>
              <p className="text-sm font-bold text-green-400">
                {resources.filter(r => r.efficiency === "optimal").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-black/80 backdrop-blur-sm border-yellow-500/30 p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <div>
              <p className="text-xs text-yellow-400/60">Sub-Optimal</p>
              <p className="text-sm font-bold text-yellow-400">
                {resources.filter(r => r.efficiency === "suboptimal").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-black/80 backdrop-blur-sm border-red-500/30 p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <div>
              <p className="text-xs text-red-400/60">Critical</p>
              <p className="text-sm font-bold text-red-400">
                {resources.filter(r => r.efficiency === "critical").length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}