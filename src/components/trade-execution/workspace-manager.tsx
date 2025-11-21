import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Save, Trash2, Layout, Plus } from "lucide-react";
import { toast } from "sonner";

interface Workspace {
  id: string;
  name: string;
  layout: string;
  indicators: string[];
  symbols: string[];
  createdAt: Date;
}

export const WorkspaceManager = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: "1",
      name: "Morning Analysis",
      layout: "standard",
      indicators: ["MA20", "RSI", "MACD"],
      symbols: ["AAPL", "MSFT", "GOOGL"],
      createdAt: new Date()
    }
  ]);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const saveWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      toast.error("Please enter a workspace name");
      return;
    }

    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name: newWorkspaceName,
      layout: "standard",
      indicators: ["MA20", "RSI"],
      symbols: ["AAPL"],
      createdAt: new Date()
    };

    setWorkspaces([...workspaces, newWorkspace]);
    setNewWorkspaceName("");
    toast.success(`Workspace "${newWorkspaceName}" saved`);
  };

  const deleteWorkspace = (id: string) => {
    const workspace = workspaces.find(w => w.id === id);
    setWorkspaces(workspaces.filter(w => w.id !== id));
    toast.success(`Workspace "${workspace?.name}" deleted`);
  };

  const loadWorkspace = (workspace: Workspace) => {
    toast.success(`Loading workspace: ${workspace.name}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#E9E9E9] mb-4 flex items-center gap-2">
          <Layout className="h-5 w-5 text-[#D5B65C]" />
          Workspace Manager
        </h3>

        {/* Create New Workspace */}
        <div className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg mb-6">
          <h4 className="text-sm font-medium text-[#E9E9E9] mb-3">Save Current Workspace</h4>
          <div className="flex gap-2">
            <Input
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="Workspace name (e.g., Earnings Season)"
              className="bg-[#0B0B0D] border-[#272A40]"
            />
            <Button 
              onClick={saveWorkspace}
              className="bg-[#D5B65C] text-[#0B0B0D] hover:bg-[#C5A64C]"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-2">
            Saves your current chart layout, indicators, and watchlist
          </p>
        </div>

        {/* Saved Workspaces */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[#E9E9E9]">Saved Workspaces ({workspaces.length})</h4>
          
          {workspaces.length === 0 ? (
            <div className="p-6 text-center text-[#9CA3AF] bg-[#1A1A1A] border border-[#272A40] rounded-lg">
              <Layout className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No saved workspaces yet. Create one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="p-4 bg-[#1A1A1A] border border-[#272A40] rounded-lg hover:border-[#D5B65C]/30 transition-colors cursor-pointer"
                  onClick={() => loadWorkspace(workspace)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-medium text-[#E9E9E9]">{workspace.name}</h5>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        {workspace.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWorkspace(workspace.id);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-[#9CA3AF] mb-1">Indicators:</p>
                      <div className="flex flex-wrap gap-1">
                        {workspace.indicators.map((indicator) => (
                          <Badge 
                            key={indicator}
                            variant="outline"
                            className="bg-[#D5B65C]/10 text-[#D5B65C] border-[#D5B65C]/20 text-xs"
                          >
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-[#9CA3AF] mb-1">Symbols:</p>
                      <div className="flex flex-wrap gap-1">
                        {workspace.symbols.map((symbol) => (
                          <Badge 
                            key={symbol}
                            variant="outline"
                            className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs"
                          >
                            {symbol}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-3 bg-[#D5B65C]/20 text-[#D5B65C] hover:bg-[#D5B65C]/30"
                    size="sm"
                    onClick={() => loadWorkspace(workspace)}
                  >
                    Load Workspace
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
