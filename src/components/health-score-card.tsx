import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HealthScoreCardProps {
  title: string;
  score: number;
  type: "audit" | "governance" | "risk";
  trend: "up" | "down" | "neutral";
  description: string;
  className?: string;
}

const getScoreStatus = (score: number) => {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "danger";
};

const getStatusColors = (status: string, type: string) => {
  switch (status) {
    case "success":
      return "bg-gradient-to-br from-success to-success/80 text-success-foreground";
    case "warning":
      return "bg-gradient-to-br from-warning to-warning/80 text-warning-foreground";
    case "danger":
      return "bg-gradient-to-br from-danger to-danger/80 text-danger-foreground";
    default:
      return "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground";
  }
};

const getTypeIcon = (type: string) => {
  const iconMap = {
    audit: "🔍",
    governance: "⚖️",
    risk: "⚠️"
  };
  return iconMap[type as keyof typeof iconMap] || "📊";
};

export function HealthScoreCard({ 
  title, 
  score, 
  type, 
  trend, 
  description, 
  className 
}: HealthScoreCardProps) {
  const status = getScoreStatus(score);
  const statusColors = getStatusColors(status, type);
  const typeIcon = getTypeIcon(type);

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-elevated border-border/50",
      "bg-gradient-to-br from-card to-card-elevated shadow-card",
      className
    )}>
      <CardHeader className="pb-4 space-y-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
          </div>
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
            trend === "up" && "bg-success/10 text-success border-success/20",
            trend === "down" && "bg-danger/10 text-danger border-danger/20",
            trend === "neutral" && "bg-muted text-muted-foreground border-border"
          )}>
            <TrendIcon className="h-3 w-3" />
            <span className="capitalize">{trend}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <div className="flex items-baseline gap-2">
          <div className={cn(
            "text-5xl font-light tracking-tight bg-clip-text text-transparent",
            statusColors.replace("bg-gradient-to-br", "bg-gradient-to-r")
          )}>
            {score}
          </div>
          <span className="text-2xl font-light text-muted-foreground">/100</span>
        </div>
        
        <div className="space-y-2">
          <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
            <div 
              className={cn(
                "h-1.5 rounded-full transition-all duration-700 ease-out",
                statusColors
              )}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}