import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Zap, Lock, Unlock, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvestorGodModeProps {
  unlocked: boolean;
}

export function InvestorGodMode({ unlocked }: InvestorGodModeProps) {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(unlocked);

  const handleUnlock = () => {
    if (password === "nexus2025") {
      setIsUnlocked(true);
      toast({
        title: "God Mode Activated",
        description: "You now have full control over AI decisions.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid credentials.",
        variant: "destructive",
      });
    }
  };

  const handleOverride = (action: string) => {
    toast({
      title: "AI Override",
      description: `Manual ${action} executed successfully.`,
    });
  };

  if (!isUnlocked) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-card via-danger/5 to-card border-danger/20 backdrop-blur-sm p-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="p-4 rounded-full bg-danger/20 w-20 h-20 mx-auto flex items-center justify-center">
            <Lock className="w-10 h-10 text-danger" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Investor God Mode</h3>
            <p className="text-muted-foreground">Executive access required</p>
          </div>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Enter access code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleUnlock()}
            />
            <Button onClick={handleUnlock} className="w-full">
              <Unlock className="w-4 h-4 mr-2" />
              Unlock God Mode
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-card via-warning/5 to-card border-warning/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        
        <div className="relative p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20 animate-pulse">
                <Zap className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-2xl">Investor God Mode</h3>
                <p className="text-sm text-muted-foreground">Manual AI Override Control</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-danger/10 text-danger border-danger/20">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Executive Access
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleOverride("portfolio rebalance")}
              className="h-24 bg-gradient-to-br from-primary to-accent"
            >
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Override AI Decision</p>
              </div>
            </Button>
            
            <Button
              onClick={() => handleOverride("parallel universe simulation")}
              className="h-24 bg-gradient-to-br from-accent to-warning"
            >
              <div className="text-center">
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Simulate Parallel Universe</p>
              </div>
            </Button>

            <Button
              onClick={() => handleOverride("synthetic asset creation")}
              className="h-24 bg-gradient-to-br from-warning to-danger"
            >
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Create Synthetic Asset</p>
              </div>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
