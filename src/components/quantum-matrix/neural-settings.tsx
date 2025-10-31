import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Zap } from "lucide-react";

interface NeuralSettingsProps {
  activeMode: 'conservative' | 'balanced' | 'offensive';
  onModeChange: (mode: 'conservative' | 'balanced' | 'offensive') => void;
  autoExecute: boolean;
  onAutoExecuteChange: (enabled: boolean) => void;
}

export function NeuralSettings({
  activeMode,
  onModeChange,
  autoExecute,
  onAutoExecuteChange,
}: NeuralSettingsProps) {
  return (
    <Card className="bg-[#121318]/80 border border-[#00E6F6]/30 backdrop-blur-sm">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#00E6F6]" />
              <span className="text-sm font-semibold text-[#E6E8EB]">Neural Settings</span>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={activeMode === 'conservative' ? 'default' : 'outline'}
                onClick={() => onModeChange('conservative')}
                className={
                  activeMode === 'conservative'
                    ? 'bg-[#43FF6B]/20 hover:bg-[#43FF6B]/30 text-[#43FF6B] border-[#43FF6B]/30'
                    : 'bg-transparent hover:bg-[#43FF6B]/10 text-[#E6E8EB]/60 border-[#00E6F6]/20'
                }
              >
                Conservative
              </Button>
              <Button
                size="sm"
                variant={activeMode === 'balanced' ? 'default' : 'outline'}
                onClick={() => onModeChange('balanced')}
                className={
                  activeMode === 'balanced'
                    ? 'bg-[#00E6F6]/20 hover:bg-[#00E6F6]/30 text-[#00E6F6] border-[#00E6F6]/30'
                    : 'bg-transparent hover:bg-[#00E6F6]/10 text-[#E6E8EB]/60 border-[#00E6F6]/20'
                }
              >
                Balanced
              </Button>
              <Button
                size="sm"
                variant={activeMode === 'offensive' ? 'default' : 'outline'}
                onClick={() => onModeChange('offensive')}
                className={
                  activeMode === 'offensive'
                    ? 'bg-[#FF3366]/20 hover:bg-[#FF3366]/30 text-[#FF3366] border-[#FF3366]/30'
                    : 'bg-transparent hover:bg-[#FF3366]/10 text-[#E6E8EB]/60 border-[#00E6F6]/20'
                }
              >
                Offensive
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={autoExecute}
                onCheckedChange={onAutoExecuteChange}
                className="data-[state=checked]:bg-[#43FF6B]"
              />
              <span className="text-sm text-[#E6E8EB]">Auto-Execute</span>
            </div>
            {autoExecute && (
              <Badge variant="outline" className="bg-[#FFA500]/10 text-[#FFA500] border-[#FFA500]/30 animate-pulse">
                <Zap className="w-3 h-3 mr-1" />
                LIVE
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-3 text-xs text-[#E6E8EB]/60">
          {activeMode === 'conservative' && 'Lower risk tolerance • Capital preservation focus • Reduced position sizing'}
          {activeMode === 'balanced' && 'Moderate risk-reward • Diversified approach • Standard allocation'}
          {activeMode === 'offensive' && 'Higher risk tolerance • Growth focused • Concentrated positions'}
        </div>
      </div>
    </Card>
  );
}