import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, GitCompare, RotateCcw, Sparkles, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Version {
  id: string;
  created: string;
  creator: string;
  impact: string;
  description: string;
  changes: number;
}

export const VersionHistory = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rollbackImpact, setRollbackImpact] = useState<any>(null);
  const [showRollbackConfirm, setShowRollbackConfirm] = useState(false);
  const { toast } = useToast();

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("data-version", {
        body: { action: "list", dataset: "all" }
      });

      if (error) throw error;

      setVersions(data.versions || []);
      setShowDialog(true);
    } catch (error: any) {
      toast({
        title: "Failed to Load Versions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const compareVersions = async () => {
    if (selectedVersions.length !== 2) {
      toast({
        title: "Select Two Versions",
        description: "Please select exactly two versions to compare",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("data-version", {
        body: {
          action: "compare",
          versionA: selectedVersions[0],
          versionB: selectedVersions[1]
        }
      });

      if (error) throw error;

      toast({
        title: "Comparison Ready",
        description: data.summary,
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "Comparison Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeRollback = async (versionId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("version-rollback", {
        body: { action: "analyze", versionId }
      });

      if (error) throw error;

      setRollbackImpact(data);
      setShowRollbackConfirm(true);
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeRollback = async () => {
    if (!rollbackImpact) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("version-rollback", {
        body: {
          action: "execute",
          versionId: rollbackImpact.versionId
        }
      });

      if (error) throw error;

      toast({
        title: "Rollback Complete",
        description: data.message,
      });

      setShowRollbackConfirm(false);
      setRollbackImpact(null);
      loadVersions();
    } catch (error: any) {
      toast({
        title: "Rollback Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVersionSelection = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else if (prev.length < 2) {
        return [...prev, versionId];
      } else {
        return [prev[1], versionId];
      }
    });
  };

  return (
    <>
      <Card className="bg-[#0B0B0D] border-[#272A40]/40 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D5B65C]" />
            <h3 className="text-lg font-semibold text-[#E9E9E9]">Version History</h3>
          </div>
          <Button
            onClick={loadVersions}
            disabled={isLoading}
            variant="outline"
            className="bg-[#272A40]/40 border-[#D5B65C]/30 text-[#D5B65C] hover:bg-[#D5B65C]/10"
          >
            <Clock className="w-4 h-4 mr-2" />
            View Versions
          </Button>
        </div>
      </Card>

      {/* Version History Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl bg-[#0B0B0D] border-[#272A40] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#E9E9E9] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D5B65C]" />
              Version Timeline
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Compare Button */}
            {selectedVersions.length === 2 && (
              <Button
                onClick={compareVersions}
                disabled={isLoading}
                className="w-full bg-[#D5B65C] hover:bg-[#D5B65C]/90 text-[#0B0B0D]"
              >
                <GitCompare className="w-4 h-4 mr-2" />
                Compare Selected Versions
              </Button>
            )}

            {/* Timeline */}
            <div className="relative pl-8 space-y-6">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#272A40]" />

              {versions.map((version, idx) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  <motion.div
                    className={`absolute left-[-1.8rem] top-2 w-4 h-4 rounded-full border-2 transition-all ${
                      selectedVersions.includes(version.id)
                        ? 'bg-[#D5B65C] border-[#D5B65C]'
                        : 'bg-[#0B0B0D] border-[#272A40]'
                    }`}
                    whileHover={{ scale: 1.2, boxShadow: '0 0 12px rgba(213, 182, 92, 0.5)' }}
                  />

                  <Card
                    className={`bg-[#272A40]/40 border-[#272A40] p-4 cursor-pointer transition-all hover:border-[#D5B65C]/40 ${
                      selectedVersions.includes(version.id) ? 'border-[#D5B65C]/60 bg-[#272A40]/60' : ''
                    }`}
                    onClick={() => toggleVersionSelection(version.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-[#E9E9E9]">{version.description}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            version.impact.startsWith('+') 
                              ? 'bg-green-500/20 text-green-400' 
                              : version.impact.startsWith('-')
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-[#D5B65C]/20 text-[#D5B65C]'
                          }`}>
                            {version.impact}
                          </span>
                        </div>
                        <p className="text-xs text-[#BFBFBF]">
                          {version.created} • {version.creator} • {version.changes} changes
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            analyzeRollback(version.id);
                          }}
                          className="text-[#D5B65C] hover:bg-[#D5B65C]/10"
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          AI Impact
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            analyzeRollback(version.id);
                          }}
                          className="text-[#E9E9E9] hover:bg-[#272A40]"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Rollback
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rollback Confirmation Dialog */}
      <Dialog open={showRollbackConfirm} onOpenChange={setShowRollbackConfirm}>
        <DialogContent className="bg-[#0B0B0D] border-[#272A40]">
          <DialogHeader>
            <DialogTitle className="text-[#E9E9E9] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D5B65C]" />
              Confirm Rollback
            </DialogTitle>
          </DialogHeader>

          {rollbackImpact && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="bg-[#272A40]/40 border-[#D5B65C]/30 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#D5B65C] mt-1" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#E9E9E9] mb-2">AI Impact Analysis</h4>
                    <p className="text-sm text-[#BFBFBF]">{rollbackImpact.analysis}</p>
                  </div>
                </div>
              </Card>

              <div className="bg-[#272A40]/20 rounded-lg p-4 space-y-2">
                <p className="text-sm text-[#E9E9E9]">
                  <span className="font-semibold">Affected Metrics:</span> {rollbackImpact.affectedMetrics?.join(', ')}
                </p>
                <p className="text-sm text-[#E9E9E9]">
                  <span className="font-semibold">Expected Impact:</span>{' '}
                  <span className={rollbackImpact.expectedImpact?.startsWith('-') ? 'text-red-400' : 'text-green-400'}>
                    {rollbackImpact.expectedImpact}
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowRollbackConfirm(false)}
                  variant="outline"
                  className="flex-1 border-[#272A40] text-[#E9E9E9]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={executeRollback}
                  disabled={isLoading}
                  className="flex-1 bg-[#D5B65C] hover:bg-[#D5B65C]/90 text-[#0B0B0D]"
                >
                  <RotateCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Confirm Rollback
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
