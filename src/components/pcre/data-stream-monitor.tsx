import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, TrendingUp, Globe, Users, DollarSign, Activity, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function DataStreamMonitor() {
  const dataStreams = [
    {
      category: "Internal Systems",
      streams: [
        { name: "ERP (SAP)", status: "active", latency: 120, dataRate: "2.4 MB/s", lastSync: "2s ago", icon: Database },
        { name: "CRM (Salesforce)", status: "active", latency: 95, dataRate: "1.8 MB/s", lastSync: "1s ago", icon: Users },
        { name: "Finance System", status: "active", latency: 140, dataRate: "3.1 MB/s", lastSync: "3s ago", icon: DollarSign },
        { name: "HR Platform", status: "degraded", latency: 380, dataRate: "0.9 MB/s", lastSync: "12s ago", icon: Users },
        { name: "Project Management", status: "active", latency: 110, dataRate: "1.2 MB/s", lastSync: "2s ago", icon: Activity },
      ]
    },
    {
      category: "External Data",
      streams: [
        { name: "Market News API", status: "active", latency: 250, dataRate: "4.2 MB/s", lastSync: "5s ago", icon: Globe },
        { name: "Competitor Intelligence", status: "active", latency: 320, dataRate: "1.5 MB/s", lastSync: "8s ago", icon: TrendingUp },
        { name: "Supply Chain Feed", status: "active", latency: 180, dataRate: "2.1 MB/s", lastSync: "4s ago", icon: Database },
        { name: "Social Trends API", status: "error", latency: 0, dataRate: "0 MB/s", lastSync: "2m ago", icon: Globe },
        { name: "Financial Markets", status: "active", latency: 95, dataRate: "5.8 MB/s", lastSync: "1s ago", icon: DollarSign },
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs"><AlertCircle className="w-3 h-3 mr-1" />Degraded</Badge>;
      case "error":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return null;
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency === 0) return "text-red-400";
    if (latency < 200) return "text-emerald-400";
    if (latency < 300) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Data Stream Monitor</h2>
          <p className="text-sm text-white/60 mt-1">Real-time ingestion from internal and external sources</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            9 of 10 streams active
          </Badge>
          <Button className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
            Configure Streams
          </Button>
        </div>
      </div>

      {/* Overall Health */}
      <Card className="bg-gradient-to-r from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-6">
        <div className="grid grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Total Throughput</div>
            <div className="text-2xl font-bold text-cyan-400">22.9 MB/s</div>
            <Progress value={78} className="h-1" />
          </div>
          <div className="space-y-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Avg Latency</div>
            <div className="text-2xl font-bold text-emerald-400">156ms</div>
            <Progress value={65} className="h-1" />
          </div>
          <div className="space-y-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Data Quality</div>
            <div className="text-2xl font-bold text-emerald-400">97.8%</div>
            <Progress value={98} className="h-1" />
          </div>
          <div className="space-y-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Prediction Accuracy</div>
            <div className="text-2xl font-bold text-cyan-400">94.2%</div>
            <Progress value={94} className="h-1" />
          </div>
        </div>
      </Card>

      {/* Stream Categories */}
      {dataStreams.map((category, idx) => (
        <div key={idx} className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="w-1 h-6 bg-cyan-500 rounded" />
            {category.category}
          </h3>
          
          <div className="grid gap-4">
            {category.streams.map((stream, streamIdx) => {
              const Icon = stream.icon;
              return (
                <Card key={streamIdx} className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-4 hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                        <Icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-white">{stream.name}</span>
                          {getStatusBadge(stream.status)}
                        </div>
                        <div className="flex items-center gap-6 text-xs text-white/60">
                          <span className={`${getLatencyColor(stream.latency)} font-mono`}>
                            Latency: {stream.latency}ms
                          </span>
                          <span className="text-cyan-400 font-mono">
                            {stream.dataRate}
                          </span>
                          <span className="text-white/40">
                            Last sync: {stream.lastSync}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-white/60 hover:text-white">
                        Details
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white/60 hover:text-white">
                        Configure
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {/* Integration Status */}
      <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Integration Health</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-sm text-white/60">Data Freshness</div>
            <div className="text-2xl font-bold text-emerald-400">Real-time</div>
            <div className="text-xs text-white/40">95% of data less than 5s old</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-white/60">Error Rate</div>
            <div className="text-2xl font-bold text-emerald-400">0.02%</div>
            <div className="text-xs text-white/40">Well within acceptable threshold</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-white/60">Redundancy</div>
            <div className="text-2xl font-bold text-cyan-400">99.9%</div>
            <div className="text-xs text-white/40">Failover systems active</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
