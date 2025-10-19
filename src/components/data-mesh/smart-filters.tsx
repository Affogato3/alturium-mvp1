import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Database, Activity, TrendingUp, Shield } from "lucide-react";

interface SmartFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function SmartFilters({ onFilterChange }: SmartFiltersProps) {
  const dataTypes = [
    { id: 'financial', label: 'Financial', icon: TrendingUp, enabled: true },
    { id: 'operational', label: 'Operational', icon: Activity, enabled: true },
    { id: 'iot', label: 'IoT Sensors', icon: Database, enabled: true },
    { id: 'market', label: 'Market Data', icon: Shield, enabled: true },
  ];

  return (
    <Card className="bg-black/60 backdrop-blur-sm border-primary/20 p-4">
      <h3 className="text-sm font-bold text-white mb-4">Smart Filters</h3>
      
      {/* Data Types */}
      <div className="space-y-3 mb-6">
        <p className="text-xs text-muted-foreground">Data Types</p>
        <div className="grid grid-cols-2 gap-2">
          {dataTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div 
                key={type.id}
                className="flex items-center justify-between bg-black/60 p-2 rounded-lg border border-primary/10"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3 h-3 text-primary" />
                  <span className="text-xs text-white">{type.label}</span>
                </div>
                <Switch checked={type.enabled} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Impact Score Filter */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">Min Impact Score</p>
          <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">
            50+
          </Badge>
        </div>
        <Slider defaultValue={[50]} max={100} step={5} className="w-full" />
      </div>

      {/* Freshness Filter */}
      <div className="space-y-3 mb-6">
        <p className="text-xs text-muted-foreground">Data Freshness</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer bg-primary/20 text-primary border-primary/30">
            Live
          </Badge>
          <Badge variant="outline" className="cursor-pointer bg-black/40 border-primary/20">
            &lt; 1h
          </Badge>
          <Badge variant="outline" className="cursor-pointer bg-black/40 border-primary/20">
            &lt; 24h
          </Badge>
          <Badge variant="outline" className="cursor-pointer bg-black/40 border-primary/20">
            All
          </Badge>
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">Status</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer bg-blue-500/20 text-blue-400 border-blue-500/30">
            Opportunity
          </Badge>
          <Badge variant="outline" className="cursor-pointer bg-red-500/20 text-red-400 border-red-500/30">
            Risk
          </Badge>
          <Badge variant="outline" className="cursor-pointer bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Volatile
          </Badge>
          <Badge variant="outline" className="cursor-pointer bg-gray-500/20 text-gray-400 border-gray-500/30">
            Normal
          </Badge>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="mt-6 p-3 bg-primary/10 border border-primary/20 rounded-lg">
        <p className="text-xs text-primary font-semibold mb-1">AI Suggestion</p>
        <p className="text-xs text-muted-foreground">
          Focus on 5 high-impact nodes showing unusual patterns this week
        </p>
      </div>
    </Card>
  );
}
