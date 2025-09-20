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
      "relative overflow-hidden transition-all duration-300 hover:shadow-elevated border-0",
      "bg-gradient-to-br from-card to-card-elevated",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span className="text-xl">{typeIcon}</span>
            {title}
          </CardTitle>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            trend === "up" && "bg-success-light text-success",
            trend === "down" && "bg-danger-light text-danger",
            trend === "neutral" && "bg-muted text-muted-foreground"
          )}>
            <TrendIcon className="h-3 w-3" />
            {trend}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-end gap-4">
          <div className={cn(
            "text-4xl font-bold bg-clip-text text-transparent",
            statusColors.replace("bg-gradient-to-br", "bg-gradient-to-r")
          )}>
            {score}
          </div>
          <div className="flex-1">
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div 
                className={cn("h-2 rounded-full transition-all duration-500", statusColors)}
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}