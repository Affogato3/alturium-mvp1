import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RebalanceProposal {
  fromDepartment: string;
  toDepartment: string;
  amount: number;
  reason: string;
  aiConfidence: number;
}

interface AutoRebalanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposal: RebalanceProposal | null;
  onConfirm: () => Promise<void>;
}

export const AutoRebalanceModal = ({
  open,
  onOpenChange,
  proposal,
  onConfirm,
}: AutoRebalanceModalProps) => {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleConfirm = async () => {
    setIsExecuting(true);
    try {
      await onConfirm();
      toast.success('Budget rebalanced successfully', {
        description: `Transferred ₹${proposal?.amount.toLocaleString()} from ${proposal?.fromDepartment} to ${proposal?.toDepartment}`,
      });
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to rebalance budget');
    } finally {
      setIsExecuting(false);
    }
  };

  if (!proposal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary animate-pulse" />
            Auto-Rebalance Proposal
          </DialogTitle>
          <DialogDescription>
            AI has identified an opportunity to optimize your budget allocation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-6">
          {/* Transfer visualization */}
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground mb-1">From</p>
              <p className="font-semibold text-amber-400">{proposal.fromDepartment}</p>
              <p className="text-xs text-muted-foreground mt-1">Under budget by 12%</p>
            </div>

            <div className="px-4">
              <ArrowRight className="w-6 h-6 text-cyan-400" />
            </div>

            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground mb-1">To</p>
              <p className="font-semibold text-cyan-400">{proposal.toDepartment}</p>
              <p className="text-xs text-muted-foreground mt-1">Over budget by 9%</p>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-cyan-500/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">Transfer Amount</p>
            <p className="text-3xl font-bold text-primary">
              ₹{proposal.amount.toLocaleString()}
            </p>
          </div>

          {/* AI Analysis */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-muted-foreground">AI Confidence:</span>
              <span className="font-semibold text-cyan-400">{(proposal.aiConfidence * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5" />
              <span className="text-muted-foreground">{proposal.reason}</span>
            </div>
          </div>

          {/* Expected Impact */}
          <div className="bg-card/80 border border-green-500/20 rounded-lg p-4">
            <p className="text-sm font-medium text-green-400 mb-2">Expected Impact</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Variance reduced to +0.3% across departments</li>
              <li>• Improved budget efficiency by +3.8%</li>
              <li>• Maintains compliance with spending policies</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExecuting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isExecuting}
            className="bg-primary hover:bg-primary/90"
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                Executing...
              </>
            ) : (
              'Confirm Rebalance'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};