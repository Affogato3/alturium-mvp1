import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Unlock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface GuardianOverrideProps {
  overrideActive: boolean;
  setOverrideActive: (active: boolean) => void;
}

export const GuardianOverride = ({ overrideActive, setOverrideActive }: GuardianOverrideProps) => {
  const [showJustificationDialog, setShowJustificationDialog] = useState(false);
  const [justification, setJustification] = useState("");

  const handleActivateOverride = () => {
    setShowJustificationDialog(true);
  };

  const handleConfirmOverride = () => {
    if (!justification.trim()) {
      toast.error("Justification is required to activate override");
      return;
    }
    
    setOverrideActive(true);
    setShowJustificationDialog(false);
    toast.warning("Guardian Override activated - Sandbox Mode enabled", {
      description: "All ethical checks are bypassed. Use with caution.",
    });
    setJustification("");
  };

  const handleDeactivateOverride = () => {
    setOverrideActive(false);
    toast.success("Guardian Override deactivated - Normal mode restored");
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
            <p className="text-sm text-slate-400">
              You are about to bypass the Ethical AI Arbiter. This action will be logged immutably.
              Please provide a detailed justification.
            </p>
            
            <Textarea
              placeholder="Enter your justification for activating Guardian Override..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={6}
              className="bg-black/40 border-amber-500/30 text-white"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowJustificationDialog(false)}
              className="border-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOverride}
              className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500"
            >
              Confirm Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
