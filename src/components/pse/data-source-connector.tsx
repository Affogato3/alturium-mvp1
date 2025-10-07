import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Database, Mail, FileText, Cloud } from "lucide-react";

const dataSources = [
  { id: "slack", name: "Slack", icon: Database, enabled: true },
  { id: "gmail", name: "Gmail", icon: Mail, enabled: true },
  { id: "gdrive", name: "Google Drive", icon: Cloud, enabled: false },
  { id: "onedrive", name: "OneDrive", icon: FileText, enabled: false },
];

export const DataSourceConnector = () => {
  return (
    <Card className="bg-black/40 backdrop-blur-sm border-primary/20 p-4">
      <h3 className="text-sm font-bold text-white mb-3">Auto Data Integration</h3>
      <div className="grid grid-cols-4 gap-3">
        {dataSources.map((source) => {
          const Icon = source.icon;
          return (
            <div key={source.id} className="flex items-center justify-between bg-black/60 p-3 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-xs text-white">{source.name}</span>
              </div>
              <Switch checked={source.enabled} />
            </div>
          );
        })}
      </div>
    </Card>
  );
};
