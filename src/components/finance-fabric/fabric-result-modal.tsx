import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface FabricResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data: any;
}

export const FabricResultModal = ({
  open,
  onOpenChange,
  title,
  data,
}: FabricResultModalProps) => {
  if (!data) return null;

  const renderContent = () => {
    if (!data.success) {
      return (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-400">Error</p>
            <p className="text-sm text-gray-400">{data.error || "Operation failed"}</p>
          </div>
        </div>
      );
    }

    // Handle different response types
    if (Array.isArray(data.data)) {
      return (
        <div className="space-y-3">
          {data.data.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <Info className="h-6 w-6 text-cyan-400 flex-shrink-0" />
              <p className="text-gray-400">No items found</p>
            </div>
          ) : (
            data.data.map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-4 bg-[#141414] border border-[#2a2a2a] rounded-lg hover:border-cyan-500/50 transition-all"
              >
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-[#2a2a2a] last:border-0">
                    <span className="text-gray-500 capitalize">{key.replace(/_/g, " ")}:</span>
                    <span className="font-mono text-sm text-cyan-400">
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      );
    }

    if (typeof data.data === "object") {
      // Special rendering for specific data types
      if (data.data.api_key) {
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-400 font-semibold">API Key Generated Successfully</p>
            </div>

            <div className="p-4 bg-[#141414] border border-[#2a2a2a] rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Your API Key:</p>
              <div className="p-3 bg-[#0A0A0A] rounded border border-cyan-500/30">
                <code className="text-cyan-400 text-sm break-all">{data.data.api_key}</code>
              </div>
              <p className="text-xs text-amber-400 mt-2">
                Save this key securely. It will not be shown again.
              </p>
            </div>

            <div className="space-y-2">
              {Object.entries(data.data)
                .filter(([key]) => key !== "api_key")
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 px-4 bg-[#141414] rounded">
                    <span className="text-gray-500 capitalize">{key.replace(/_/g, " ")}:</span>
                    <span className="font-mono text-sm text-gray-300">
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        );
      }

      // Reconciliation report
      if (data.data.matched !== undefined && data.data.discrepancies !== undefined) {
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-[#141414] border border-[#2a2a2a] rounded-lg text-center">
                <p className="text-gray-500 text-sm">Total Accounts</p>
                <p className="text-3xl font-bold text-cyan-400 mt-2">{data.data.total_accounts}</p>
              </div>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
                <p className="text-gray-500 text-sm">Matched</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">{data.data.matched}</p>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
                <p className="text-gray-500 text-sm">Discrepancies</p>
                <p className="text-3xl font-bold text-amber-400 mt-2">{data.data.discrepancies}</p>
              </div>
            </div>

            {data.data.details?.discrepancies && data.data.details.discrepancies.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-400">Discrepancies Found:</h4>
                {data.data.details.discrepancies.map((disc: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-amber-500/5 border border-amber-500/30 rounded-lg"
                  >
                    <p className="font-mono text-sm text-cyan-400 mb-2">{disc.account_number}</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Expected</p>
                        <p className="text-white font-semibold">${disc.expected_balance}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Actual</p>
                        <p className="text-white font-semibold">${disc.actual_balance}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Difference</p>
                        <p className="text-amber-400 font-semibold">${disc.difference}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      // Compliance scan
      if (data.data.compliance_rate !== undefined) {
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#141414] border border-[#2a2a2a] rounded-lg text-center">
                <p className="text-gray-500 text-sm">Scanned</p>
                <p className="text-3xl font-bold text-cyan-400 mt-2">{data.data.total_scanned}</p>
              </div>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
                <p className="text-gray-500 text-sm">Compliance Rate</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">{data.data.compliance_rate}%</p>
              </div>
            </div>

            {data.data.details?.alerts && data.data.details.alerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-400 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Alerts ({data.data.alerts})
                </h4>
                {data.data.details.alerts.map((alert: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-amber-500/5 border border-amber-500/30 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-mono text-sm text-cyan-400">{alert.tx_number}</p>
                      <Badge className={`${
                        alert.severity === "high" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">{alert.rule}</p>
                    <p className="text-sm text-gray-500">{alert.recommendation}</p>
                    <p className="text-xs text-gray-600 mt-2">Risk Score: {(alert.risk_score * 100).toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      // Generic object display
      return (
        <div className="space-y-2">
          {Object.entries(data.data).map(([key, value]) => (
            <div key={key} className="flex justify-between py-3 px-4 bg-[#141414] rounded-lg">
              <span className="text-gray-500 capitalize">{key.replace(/_/g, " ")}:</span>
              <span className="font-mono text-sm text-cyan-400">
                {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="p-4 bg-[#141414] border border-[#2a2a2a] rounded-lg">
        <pre className="text-sm text-gray-400 whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-[#0A0A0A] border-[#2a2a2a] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
            {title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};