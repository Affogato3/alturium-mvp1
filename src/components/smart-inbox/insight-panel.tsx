import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Info, Sparkles } from "lucide-react";

interface InsightPanelProps {
  summary: any;
  forecast: any[];
  recommendations: any[];
}

export const InsightPanel = ({ summary, forecast, recommendations }: InsightPanelProps) => {
  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Inbox Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Pending Documents</span>
            <Badge variant="secondary" className="text-lg px-3">
              {summary?.total_pending || 0}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-lg font-bold text-success">
              ${(summary?.total_amount || 0).toLocaleString()}
            </span>
          </div>
          {summary?.high_risk_days > 0 && (
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-sm text-warning flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                High Risk Days
              </span>
              <Badge variant="destructive">{summary.high_risk_days}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card className="bg-card/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-2">
                  {rec.type === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 text-warning mt-1" />
                  ) : (
                    <Info className="h-4 w-4 text-primary mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1">{rec.message}</p>
                    <p className="text-xs text-muted-foreground">{rec.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Liquidity Forecast */}
      {forecast && forecast.length > 0 && (
        <Card className="bg-card/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg">14-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {forecast.slice(0, 7).map((day: any, idx: number) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center text-sm p-2 rounded hover:bg-muted/30 transition-colors"
                >
                  <span className="text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold ${day.predicted_balance < 0 ? 'text-destructive' : 'text-success'}`}>
                      ${Math.abs(day.predicted_balance).toLocaleString()}
                    </span>
                    <Badge 
                      variant={day.risk_level === 'high' ? 'destructive' : day.risk_level === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {day.risk_level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};