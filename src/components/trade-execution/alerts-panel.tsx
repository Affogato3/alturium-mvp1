import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Alert {
  id: string;
  type: string;
  condition: string;
  value: number;
  status: "active" | "triggered";
  channel: string;
}

interface AlertsPanelProps {
  symbol: string;
}

export const AlertsPanel = ({ symbol }: AlertsPanelProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "price",
      condition: "above",
      value: 200,
      status: "active",
      channel: "email"
    }
  ]);
  const [newAlertType, setNewAlertType] = useState("price");
  const [newCondition, setNewCondition] = useState("above");
  const [newValue, setNewValue] = useState(0);
  const [newChannel, setNewChannel] = useState("email");

  const addAlert = () => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      type: newAlertType,
      condition: newCondition,
      value: newValue,
      status: "active",
      channel: newChannel
    };

    setAlerts([...alerts, newAlert]);
    toast.success("Alert created successfully");
    
    // Reset form
    setNewValue(0);
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success("Alert deleted");
  };

  const getAlertDescription = (alert: Alert) => {
    const types: Record<string, string> = {
      price: "Price",
      volume: "Volume",
      rsi: "RSI",
      macd: "MACD"
    };
    
    return `${types[alert.type]} ${alert.condition} ${alert.value}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#E9E9E9] mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#D5B65C]" />
          Custom Alerts
        </h3>

        {/* Create New Alert */}
        <div className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg space-y-4 mb-6">
          <h4 className="text-sm font-medium text-[#E9E9E9]">Create New Alert</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Alert Type</Label>
              <Select value={newAlertType} onValueChange={setNewAlertType}>
                <SelectTrigger className="bg-[#0B0B0D] border-[#272A40]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="rsi">RSI</SelectItem>
                  <SelectItem value="macd">MACD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Condition</Label>
              <Select value={newCondition} onValueChange={setNewCondition}>
                <SelectTrigger className="bg-[#0B0B0D] border-[#272A40]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Above</SelectItem>
                  <SelectItem value="below">Below</SelectItem>
                  <SelectItem value="crosses">Crosses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Value</Label>
            <Input
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(Number(e.target.value))}
              className="bg-[#0B0B0D] border-[#272A40]"
              placeholder="Enter threshold value"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Notification Channel</Label>
            <Select value={newChannel} onValueChange={setNewChannel}>
              <SelectTrigger className="bg-[#0B0B0D] border-[#272A40]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={addAlert}
            className="w-full bg-[#D5B65C] text-[#0B0B0D] hover:bg-[#C5A64C]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>

        {/* Active Alerts List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[#E9E9E9]">Active Alerts ({alerts.length})</h4>
          
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-[#9CA3AF] bg-[#1A1A1A] border border-[#272A40] rounded-lg">
              No active alerts. Create one above.
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg flex items-center justify-between hover:border-[#D5B65C]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${alert.status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
                  <div>
                    <p className="text-sm font-medium text-[#E9E9E9]">{symbol}</p>
                    <p className="text-xs text-[#9CA3AF]">{getAlertDescription(alert)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={alert.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"}
                  >
                    {alert.status === "active" ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      "Triggered"
                    )}
                  </Badge>
                  <Badge variant="outline" className="bg-[#D5B65C]/10 text-[#D5B65C] border-[#D5B65C]/20">
                    {alert.channel}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAlert(alert.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
