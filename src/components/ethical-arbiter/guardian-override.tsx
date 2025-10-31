import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, Unlock, AlertTriangle, FileText, Shield } from "lucide-react";
import { toast } from "sonner";

interface GuardianOverrideProps {
  overrideActive: boolean;
  setOverrideActive: (active: boolean) => void;
}

export const GuardianOverride = ({ overrideActive, setOverrideActive }: GuardianOverrideProps) => {
  const [showJustificationDialog, setShowJustificationDialog] = useState(false);
  const [justification, setJustification] = useState("");
  const [userHash, setUserHash] = useState("");
  const [overrideHistory, setOverrideHistory] = useState<Array<{
    timestamp: string;
    user: string;
    justification: string;
  }>>([]);

  const handleActivateOverride = () => {
    setShowJustificationDialog(true);
  };

  const handleConfirmOverride = () => {
    if (!justification.trim() || !userHash.trim()) {
      toast.error("Authorization required", {
        description: "Both authentication and justification are required"
      });
      return;
    }
    
    const newEntry = {
      timestamp: new Date().toLocaleString(),
      user: userHash,
      justification: justification
    };
    
    setOverrideHistory(prev => [newEntry, ...prev.slice(0, 9)]);
    setOverrideActive(true);
    setShowJustificationDialog(false);
    
    toast.warning("Guardian Override Activated", {
      description: "Sandbox Mode enabled • All decisions logged to immutable audit trail"
    });
    
    setJustification("");
    setUserHash("");

    // Auto-deactivate after 30 minutes
    setTimeout(() => {
      if (overrideActive) {
        handleDeactivateOverride();
      }
    }, 30 * 60 * 1000);
  };

  const handleDeactivateOverride = () => {
    setOverrideActive(false);
    toast.success("Guardian Override Deactivated", {
      description: "Normal ethical gatekeeping restored • All systems secure"
    });
  };

  return (
    <>
      <Card className="bg-black/60 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/10">
        <CardHeader>
          <CardTitle className="text-sm text-amber-400 flex items-center gap-2">
            {overrideActive ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            Guardian Override
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Warning Sigil */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-red-500/20 rounded-lg blur-xl" />
            <div className="relative bg-black/60 p-6 rounded-lg border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="h-16 w-16 text-amber-400 animate-pulse" />
            </div>
          </div>

          {/* Status */}
          <div className="text-center space-y-2">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Status</p>
            <p className={`text-sm font-bold ${overrideActive ? "text-amber-400" : "text-slate-400"}`}>
              {overrideActive ? "OVERRIDE ACTIVE" : "LOCKED"}
            </p>
          </div>

          {/* Action Button */}
          {!overrideActive ? (
            <Button
              onClick={handleActivateOverride}
              className="w-full bg-gradient-to-br from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-semibold"
            >
              <Unlock className="h-4 w-4 mr-2" />
              Activate Override
            </Button>
          ) : (
            <Button
              onClick={handleDeactivateOverride}
              className="w-full bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-semibold"
            >
              <Lock className="h-4 w-4 mr-2" />
              Deactivate
            </Button>
          )}

          {/* Warning Text */}
          <div className="text-xs text-center text-amber-400/70 space-y-1">
            <p className="font-semibold">⚠️ AUTHORIZED PERSONNEL ONLY</p>
            <p className="text-slate-500">
              Overriding Guardian bypasses all ethical safeguards
            </p>
          </div>

          {/* Override History */}
          {overrideHistory.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider">
                <FileText className="h-3 w-3" />
                <span>Override Audit Log</span>
              </div>
              <ScrollArea className="max-h-32">
                <div className="space-y-2 pr-2">
                  {overrideHistory.map((entry, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-black/30 border border-amber-500/20 hover:border-amber-500/40 transition-all text-xs animate-fade-in"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-amber-400/80 font-mono">{entry.user.substring(0, 12)}...</span>
                        <span className="text-white/30">{entry.timestamp}</span>
                      </div>
                      <p className="text-white/60 text-xs line-clamp-2">{entry.justification}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Justification Dialog */}
      <Dialog open={showJustificationDialog} onOpenChange={setShowJustificationDialog}>
        <DialogContent className="bg-slate-900 border-amber-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
              Override Justification Required
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <DialogDescription className="text-amber-400/80">
              This action requires authorization and will be logged to the immutable audit trail
            </DialogDescription>

            <div>
              <label className="text-sm font-semibold text-white/80 mb-2 block">
                User Authentication Hash
              </label>
              <Input
                type="password"
                value={userHash}
                onChange={(e) => setUserHash(e.target.value)}
                placeholder="Enter your authorization code"
                className="bg-black/40 border-amber-500/20 text-white placeholder:text-white/30 focus:border-amber-500/40"
              />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-white/80 mb-2 block">
                Justification (Required)
              </label>
              <Textarea
                placeholder="Provide detailed justification for override activation. This will be recorded in the audit log."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={6}
                className="bg-black/40 border-amber-500/30 text-white resize-none"
              />
            </div>

            <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-400/90">
                  <strong>Warning:</strong> Override activation bypasses ethical validation. 
                  All decisions and justifications are permanently logged and subject to compliance review.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowJustificationDialog(false);
                setJustification("");
                setUserHash("");
              }}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOverride}
              disabled={!justification.trim() || !userHash.trim()}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white"
            >
              <Unlock className="h-4 w-4 mr-2" />
              Activate Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.5);
        }
      `}</style>
    </>
  );
};
