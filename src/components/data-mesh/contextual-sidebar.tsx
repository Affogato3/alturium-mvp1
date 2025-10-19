import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Zap, Activity, Database } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataNode {
  id: string;
  label: string;
  type: string;
  impactScore: number;
  status: string;
  connections: string[];
  metadata: {
    size: string;
    lastUpdated: string;
    reliability: number;
  };
}

interface ContextualSidebarProps {
  node: DataNode | null;
  onClose: () => void;
}

export function ContextualSidebar({ node, onClose }: ContextualSidebarProps) {
  if (!node) return null;

  const anomalies = [
    { severity: 'high', message: 'Unusual spike in data volume (+45%)', time: '2min ago' },
    { severity: 'medium', message: 'Connection latency increased', time: '5min ago' },
  ];

  const patterns = [
    { type: 'correlation', description: 'Strong correlation with Market Feed (0.87)', impact: 'high' },
    { type: 'trend', description: 'Consistent upward trend over 7 days', impact: 'medium' },
  ];

  const predictions = [
    { metric: 'Revenue Impact', value: '+$2.3M', probability: 78, timeframe: '30 days' },
    { metric: 'Risk Score', value: '23%', probability: 65, timeframe: '7 days' },
  ];

  const actions = [
    'Increase monitoring frequency',
    'Allocate additional compute resources',
    'Run correlation analysis with Finance ERP',
    'Schedule predictive maintenance',
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-black/95 backdrop-blur-sm border-l border-primary/20 z-50 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{node.label}</h2>
              <p className="text-sm text-muted-foreground mt-1">Type: {node.type}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
              ×
            </Button>
          </div>

          {/* Status Badge */}
          <div className="flex gap-2">
            <Badge 
              variant="outline" 
              className={`${
                node.status === 'opportunity' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                node.status === 'risk' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                node.status === 'volatile' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                'bg-gray-500/20 text-gray-400 border-gray-500/30'
              }`}
            >
              {node.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Impact: {node.impactScore}/100
            </Badge>
          </div>

          {/* Metadata */}
          <Card className="bg-gray-900/50 border-primary/10 p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Metadata
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Size</span>
                <span className="text-xs text-white">{node.metadata.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Last Updated</span>
                <span className="text-xs text-white">{node.metadata.lastUpdated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Reliability</span>
                <span className="text-xs text-white">{node.metadata.reliability}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Connections</span>
                <span className="text-xs text-white">{node.connections.length}</span>
              </div>
            </div>
          </Card>

          {/* Anomalies */}
          <Card className="bg-gray-900/50 border-red-500/20 p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Anomalies Detected
            </h3>
            <div className="space-y-3">
              {anomalies.map((anomaly, i) => (
                <div key={i} className="border-l-2 border-red-500/50 pl-3">
                  <p className="text-xs text-white">{anomaly.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{anomaly.time}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Historical Patterns */}
          <Card className="bg-gray-900/50 border-primary/10 p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Historical Patterns
            </h3>
            <div className="space-y-3">
              {patterns.map((pattern, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white capitalize">{pattern.type}</span>
                    <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">
                      {pattern.impact}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{pattern.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Predictions */}
          <Card className="bg-gray-900/50 border-blue-500/20 p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Predicted Impact
            </h3>
            <div className="space-y-3">
              {predictions.map((pred, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white">{pred.metric}</span>
                    <span className="text-sm font-bold text-blue-400">{pred.value}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Probability: {pred.probability}%</span>
                    <span>{pred.timeframe}</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${pred.probability}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Suggested Actions */}
          <Card className="bg-gray-900/50 border-primary/10 p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              AI Suggested Actions
            </h3>
            <div className="space-y-2">
              {actions.map((action, i) => (
                <Button 
                  key={i}
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start text-left bg-black/40 border-primary/20 hover:bg-primary/10 text-xs"
                >
                  {action}
                </Button>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1 bg-primary/20 hover:bg-primary/30 border border-primary/30">
              Simulate Impact
            </Button>
            <Button variant="outline" className="flex-1 border-primary/20">
              Export Data
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
