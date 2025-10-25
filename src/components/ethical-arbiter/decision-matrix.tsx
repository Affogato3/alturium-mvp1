import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, RefreshCw, Flag, GitCompare, Filter } from "lucide-react";
import { toast } from "sonner";

interface Decision {
  id: string;
  domain: string;
  ethicalScore: number;
  status: "Executed" | "Blocked" | "Under Review";
  timestamp: string;
}

export const DecisionMatrix = ({ overrideActive }: { overrideActive: boolean }) => {
  const [decisions] = useState<Decision[]>([
    { id: "DEC-2401", domain: "Privacy", ethicalScore: 0.94, status: "Executed", timestamp: "2m ago" },
    { id: "DEC-2402", domain: "Legal", ethicalScore: 0.87, status: "Executed", timestamp: "5m ago" },
    { id: "DEC-2403", domain: "Environmental", ethicalScore: 0.62, status: "Under Review", timestamp: "8m ago" },
    { id: "DEC-2404", domain: "Reputational", ethicalScore: 0.45, status: "Blocked", timestamp: "12m ago" },
    { id: "DEC-2405", domain: "Privacy", ethicalScore: 0.91, status: "Executed", timestamp: "15m ago" },
  ]);

  const getStatusBadge = (status: Decision["status"]) => {
    switch (status) {
      case "Executed":
        return <Badge variant="outline" className="border-green-500/50 text-green-400">Executed</Badge>;
      case "Blocked":
        return <Badge variant="outline" className="border-red-500/50 text-red-400">Blocked</Badge>;
      case "Under Review":
        return <Badge variant="outline" className="border-amber-500/50 text-amber-400">Review</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-400";
    if (score >= 0.6) return "text-amber-400";
    return "text-red-400";
  };

  const handleReSimulate = (id: string) => {
    toast.success(`Re-running simulation for ${id}`);
  };

  const handleFlag = (id: string) => {
    toast.info(`Decision ${id} flagged for human review`);
  };

  const handleCompare = (id: string) => {
    toast.info(`Loading version comparison for ${id}`);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Decision Matrix
            </span>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              Last 50 Decisions
            </Badge>
          </div>
          <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-cyan-500/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-black/40 border-cyan-500/20 hover:bg-black/40">
                <TableHead className="text-cyan-400">Decision ID</TableHead>
                <TableHead className="text-cyan-400">Domain</TableHead>
                <TableHead className="text-cyan-400">Ethical Score</TableHead>
                <TableHead className="text-cyan-400">Status</TableHead>
                <TableHead className="text-cyan-400">Time</TableHead>
                <TableHead className="text-cyan-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decisions.map((decision) => (
                <TableRow
                  key={decision.id}
                  className="border-cyan-500/10 hover:bg-cyan-500/5 transition-colors"
                >
                  <TableCell className="font-mono text-sm">{decision.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-600">
                      {decision.domain}
                    </Badge>
                  </TableCell>
                  <TableCell className={`font-semibold ${getScoreColor(decision.ethicalScore)}`}>
                    {(decision.ethicalScore * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell>{getStatusBadge(decision.status)}</TableCell>
                  <TableCell className="text-slate-400 text-sm">{decision.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                        onClick={() => handleReSimulate(decision.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                        onClick={() => handleFlag(decision.id)}
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10"
                        onClick={() => handleCompare(decision.id)}
                      >
                        <GitCompare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
