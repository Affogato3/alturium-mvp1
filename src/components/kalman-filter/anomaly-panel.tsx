import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle, Eye, Clock, Zap } from 'lucide-react';

interface AnomalyPanelProps {
  anomalies: any[];
  metric: string;
}

export const AnomalyPanel: React.FC<AnomalyPanelProps> = ({ anomalies, metric }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'severe_outlier': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'measurement_outlier': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Eye className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Anomaly List */}
      <Card className="col-span-2 bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Detected Anomalies
          </CardTitle>
          <CardDescription>
            Statistical outliers detected by the Kalman filter innovation sequence
          </CardDescription>
        </CardHeader>
        <CardContent>
          {anomalies.length > 0 ? (
            <div className="space-y-4">
              {anomalies.map((anomaly, i) => (
                <Card key={i} className={`border ${getSeverityColor(anomaly.severity)}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getTypeIcon(anomaly.type)}
                        <div>
                          <p className="font-medium capitalize">
                            {anomaly.type?.replace(/_/g, ' ') || 'Unknown Anomaly'}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Innovation: {anomaly.innovation?.toFixed(2) || 'N/A'} | 
                            {' '}{anomaly.std_deviations?.toFixed(2) || 'N/A'}σ deviation
                          </p>
                          {anomaly.source && (
                            <Badge variant="outline" className="mt-2">
                              Source: {anomaly.source}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getSeverityColor(anomaly.severity)}>
                          {anomaly.severity || 'unknown'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {anomaly.timestamp ? new Date(anomaly.timestamp).toLocaleString() : 'Just now'}
                        </span>
                      </div>
                    </div>

                    {anomaly.ai_classification && Object.keys(anomaly.ai_classification).length > 0 && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-500" />
                          AI Classification
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {anomaly.ai_classification.likely_cause || 'Analysis pending'}
                        </p>
                        {anomaly.ai_classification.recommended_action && (
                          <p className="text-sm mt-2">
                            <strong>Action:</strong> {anomaly.ai_classification.recommended_action}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Resolved
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <p className="text-lg font-medium">No Anomalies Detected</p>
              <p className="text-muted-foreground mt-1">
                All recent observations are within expected statistical bounds
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Anomaly Stats */}
      <div className="space-y-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Detection Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Detected</span>
              <Badge variant="outline">{anomalies.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">High Severity</span>
              <Badge className="bg-red-500/20 text-red-400">
                {anomalies.filter(a => a.severity === 'high').length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Medium Severity</span>
              <Badge className="bg-amber-500/20 text-amber-400">
                {anomalies.filter(a => a.severity === 'medium').length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Resolved</span>
              <Badge variant="secondary">
                {anomalies.filter(a => a.status === 'resolved').length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Detection Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Anomalies are detected using the <strong>innovation sequence</strong> from the Kalman filter:
            </p>
            <div className="bg-muted/50 p-3 rounded-lg">
              <code className="text-xs">
                z_normalized = (z - H·x_pred) / √S
              </code>
            </div>
            <p className="text-xs text-muted-foreground">
              When normalized innovation exceeds ±2.5σ, an anomaly is flagged. Values beyond ±4σ are marked as severe.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium">Monitoring Status</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">Active</p>
            <p className="text-xs text-muted-foreground mt-2">
              Real-time anomaly detection enabled. New observations are automatically screened.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
