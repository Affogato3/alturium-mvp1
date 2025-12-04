import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Database, Plus, RefreshCw, CheckCircle, AlertCircle, 
  Clock, Zap, Settings, Link2, Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface DataSourcesPanelProps {
  metric: string;
}

export const DataSourcesPanel: React.FC<DataSourcesPanelProps> = ({ metric }) => {
  const [sources, setSources] = useState([
    { 
      id: '1', 
      name: 'Stripe', 
      type: 'payment_processor', 
      status: 'connected',
      confidence: 0.95,
      latency: 0,
      lastSync: new Date().toISOString(),
      metrics: ['mrr', 'arr', 'churn']
    },
    { 
      id: '2', 
      name: 'Salesforce', 
      type: 'crm', 
      status: 'connected',
      confidence: 0.80,
      latency: 3600,
      lastSync: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      metrics: ['mrr', 'ltv', 'cac']
    },
    { 
      id: '3', 
      name: 'QuickBooks', 
      type: 'accounting', 
      status: 'pending',
      confidence: 0.98,
      latency: 86400,
      lastSync: null,
      metrics: ['mrr', 'arr']
    }
  ]);

  const [newSource, setNewSource] = useState({ name: '', type: '' });

  const addSource = () => {
    if (!newSource.name || !newSource.type) {
      toast.error('Please fill in all fields');
      return;
    }

    setSources([...sources, {
      id: Date.now().toString(),
      name: newSource.name,
      type: newSource.type,
      status: 'pending',
      confidence: 0.85,
      latency: 3600,
      lastSync: null,
      metrics: [metric]
    }]);

    setNewSource({ name: '', type: '' });
    toast.success('Data source added');
  };

  const removeSource = (id: string) => {
    setSources(sources.filter(s => s.id !== id));
    toast.success('Data source removed');
  };

  const syncSource = (id: string) => {
    setSources(sources.map(s => 
      s.id === id ? { ...s, lastSync: new Date().toISOString(), status: 'connected' } : s
    ));
    toast.success('Sync initiated');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return <Badge className="bg-emerald-500/20 text-emerald-400">Connected</Badge>;
      case 'pending': return <Badge className="bg-amber-500/20 text-amber-400">Pending</Badge>;
      case 'error': return <Badge className="bg-red-500/20 text-red-400">Error</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getLatencyLabel = (seconds: number) => {
    if (seconds === 0) return 'Real-time';
    if (seconds < 3600) return `${Math.round(seconds / 60)} min delay`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hour delay`;
    return `${Math.round(seconds / 86400)} day delay`;
  };

  // Calculate combined confidence
  const connectedSources = sources.filter(s => s.status === 'connected' && s.metrics.includes(metric));
  const combinedConfidence = connectedSources.length > 0
    ? 1 - connectedSources.reduce((acc, s) => acc * (1 - s.confidence), 1)
    : 0;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Data Sources List */}
      <Card className="col-span-2 bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-500" />
            Connected Data Sources
          </CardTitle>
          <CardDescription>
            Configure data inputs for Kalman filter observations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sources.map(source => (
            <Card key={source.id} className="bg-muted/30 border-border">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      source.status === 'connected' ? 'bg-emerald-500/20' :
                      source.status === 'pending' ? 'bg-amber-500/20' : 'bg-red-500/20'
                    }`}>
                      {source.status === 'connected' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : source.status === 'pending' ? (
                        <Clock className="w-5 h-5 text-amber-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{source.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {source.type.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(source.status)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={source.confidence * 100} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{(source.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Latency</p>
                    <p className="text-sm mt-1">{getLatencyLabel(source.latency)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Sync</p>
                    <p className="text-sm mt-1">
                      {source.lastSync 
                        ? new Date(source.lastSync).toLocaleTimeString()
                        : 'Never'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex-1 flex gap-1">
                    {source.metrics.map(m => (
                      <Badge key={m} variant="outline" className="text-xs">
                        {m.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => syncSource(source.id)}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeSource(source.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Source */}
          <Card className="bg-muted/20 border-dashed border-2">
            <CardContent className="pt-4">
              <div className="flex items-center gap-4">
                <Input 
                  placeholder="Source name (e.g., HubSpot)"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  className="flex-1"
                />
                <Select 
                  value={newSource.type} 
                  onValueChange={(v) => setNewSource({ ...newSource, type: v })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment_processor">Payment Processor</SelectItem>
                    <SelectItem value="crm">CRM</SelectItem>
                    <SelectItem value="accounting">Accounting</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="custom_api">Custom API</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addSource}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Source
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Data Quality Summary */}
      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Combined Data Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {(combinedConfidence * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <p className="font-medium">
                  {combinedConfidence > 0.9 ? 'Excellent' :
                   combinedConfidence > 0.7 ? 'Good' :
                   combinedConfidence > 0.5 ? 'Moderate' : 'Needs Improvement'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on {connectedSources.length} connected sources
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Data Fusion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The Kalman filter intelligently fuses data from multiple sources:
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Higher confidence sources weighted more
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                Latency-adjusted for timing accuracy
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Outliers automatically detected
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Noise Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Process Noise (Q)</span>
              <Badge variant="outline">Auto-calibrated</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Measurement Noise (R)</span>
              <Badge variant="outline">Source-dependent</Badge>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Noise parameters are dynamically adjusted based on source confidence and historical accuracy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
