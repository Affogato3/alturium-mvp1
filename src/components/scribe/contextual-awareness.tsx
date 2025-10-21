import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, AlertTriangle, TrendingUp, FileText } from "lucide-react";

interface ContextualLink {
  id: string;
  type: "project" | "kpi" | "decision" | "dependency";
  title: string;
  relation: string;
  date: string;
  impact: "high" | "medium" | "low";
}

interface ContextualAwarenessProps {
  links: ContextualLink[];
  contradictions: string[];
}

export const ContextualAwareness = ({ links, contradictions }: ContextualAwarenessProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return <FileText className="h-4 w-4 text-scribe-accent" />;
      case "kpi":
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case "decision":
        return <Link2 className="h-4 w-4 text-blue-400" />;
      case "dependency":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Link2 className="h-4 w-4 text-scribe-text/60" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-scribe-accent";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-scribe-text/60";
      default:
        return "text-scribe-text/60";
    }
  };

  return (
    <Card className="bg-scribe-card border-scribe-card/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-scribe-text">
          Contextual Intelligence
        </CardTitle>
        <p className="text-sm text-scribe-text/60 mt-2">
          Connections to ongoing projects, KPIs, and previous decisions
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-scribe-text/70">Linked Context</h4>
          <div className="space-y-2">
            {links.map((link) => (
              <div
                key={link.id}
                className="p-3 rounded-lg bg-scribe-bg/50 border border-scribe-card/30 hover:border-scribe-accent/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getTypeIcon(link.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-sm font-medium text-scribe-text truncate">{link.title}</h5>
                      <span className={`text-xs ${getImpactColor(link.impact)}`}>
                        {link.impact}
                      </span>
                    </div>
                    <p className="text-xs text-scribe-text/60 mb-1">{link.relation}</p>
                    <span className="text-xs text-scribe-text/50">{link.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {contradictions.length > 0 && (
          <div className="pt-4 border-t border-scribe-card/20">
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <h4 className="text-sm font-medium text-scribe-text/70">Detected Contradictions</h4>
            </div>
            <div className="space-y-2">
              {contradictions.map((contradiction, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-yellow-400/5 border border-yellow-400/20"
                >
                  <p className="text-xs text-scribe-text/80">{contradiction}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
