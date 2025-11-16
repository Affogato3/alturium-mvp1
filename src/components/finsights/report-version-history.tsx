import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, GitCompare, Clock } from "lucide-react";

interface ReportVersion {
  id: string;
  type: string;
  generated_at: string;
  format: string;
  slide_count: number;
  file_size: string;
}

export const ReportVersionHistory = () => {
  const [versions] = useState<ReportVersion[]>([
    {
      id: "1",
      type: "Board Deck",
      generated_at: "2025-01-15T14:30:00Z",
      format: "pdf",
      slide_count: 18,
      file_size: "2.4 MB",
    },
    {
      id: "2",
      type: "Board Deck",
      generated_at: "2024-12-15T09:00:00Z",
      format: "pptx",
      slide_count: 20,
      file_size: "3.1 MB",
    },
    {
      id: "3",
      type: "Board Deck",
      generated_at: "2024-11-15T09:00:00Z",
      format: "pdf",
      slide_count: 17,
      file_size: "2.2 MB",
    },
  ]);

  const [compareMode, setCompareMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const toggleVersionSelection = (id: string) => {
    if (selectedVersions.includes(id)) {
      setSelectedVersions(selectedVersions.filter((v) => v !== id));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Report Version History</h2>
          <p className="text-slate-400 mt-1">
            Access and compare previous board decks
          </p>
        </div>
        <Button
          onClick={() => setCompareMode(!compareMode)}
          variant={compareMode ? "default" : "outline"}
          className={compareMode ? "bg-indigo-600" : "border-slate-700"}
        >
          <GitCompare className="w-4 h-4 mr-2" />
          {compareMode ? "Exit Compare Mode" : "Compare Versions"}
        </Button>
      </div>

      {compareMode && selectedVersions.length === 2 && (
        <Card className="bg-indigo-600/20 border-indigo-500/50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-white">
              <GitCompare className="w-4 h-4 inline mr-2" />
              2 versions selected for comparison
            </p>
            <Button
              onClick={() => {
                // Implement comparison logic
                alert("Version comparison feature coming soon!");
              }}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Compare Selected
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {versions.map((version) => (
          <Card
            key={version.id}
            className={`bg-slate-800/50 border-slate-700/50 p-6 transition-all ${
              selectedVersions.includes(version.id)
                ? "border-indigo-500 bg-indigo-900/20"
                : ""
            } ${compareMode ? "cursor-pointer" : ""}`}
            onClick={() => compareMode && toggleVersionSelection(version.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="w-10 h-10 text-indigo-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{version.type}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="border-slate-600">
                      {version.format.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="border-slate-600">
                      {version.slide_count} slides
                    </Badge>
                    <Badge variant="outline" className="border-slate-600">
                      {version.file_size}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(version.generated_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {compareMode ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedVersions.includes(version.id)}
                      onChange={() => toggleVersionSelection(version.id)}
                      className="w-5 h-5"
                      disabled={
                        selectedVersions.length === 2 &&
                        !selectedVersions.includes(version.id)
                      }
                    />
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {versions.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700/50 p-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Reports Generated Yet</h3>
              <p className="text-slate-400">
                Generated reports will appear here for easy access and comparison
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
