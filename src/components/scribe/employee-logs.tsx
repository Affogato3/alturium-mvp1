import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Employee {
  id: string;
  name: string;
  talkTime: number;
  keyActions: number;
  sentiment: number;
  attendanceScore: number;
  keywords: string[];
}

interface EmployeeLogsProps {
  employees: Employee[];
}

export const EmployeeLogs = ({ employees }: EmployeeLogsProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.7) return "text-emerald-400";
    if (sentiment >= 0.4) return "text-[hsl(var(--scribe-accent))]";
    return "text-amber-400";
  };

  const isExceptional = (value: number, type: "high" | "low") => {
    const threshold = type === "high" ? 0.8 : 0.3;
    return type === "high" ? value >= threshold : value <= threshold;
  };

  return (
    <>
      <Card className="bg-[hsl(var(--scribe-card))] border-0 shadow-lg p-6">
        <h3 className="text-lg font-semibold text-[hsl(var(--scribe-text))] mb-4">
          Employee Activity Log
        </h3>
        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[hsl(var(--scribe-text))]/10 hover:bg-transparent">
                <TableHead className="text-[hsl(var(--scribe-text))]/70">Employee</TableHead>
                <TableHead className="text-[hsl(var(--scribe-text))]/70">Talk Time</TableHead>
                <TableHead className="text-[hsl(var(--scribe-text))]/70">Key Actions</TableHead>
                <TableHead className="text-[hsl(var(--scribe-text))]/70">Sentiment</TableHead>
                <TableHead className="text-[hsl(var(--scribe-text))]/70">Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow
                  key={employee.id}
                  className="border-b border-[hsl(var(--scribe-text))]/5 hover:bg-black/20 cursor-pointer transition-colors"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <TableCell className="text-[hsl(var(--scribe-text))]/80">
                    {employee.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`${
                        isExceptional(employee.talkTime / 100, "high")
                          ? "border-b-2 border-[hsl(var(--scribe-accent))]"
                          : ""
                      } text-[hsl(var(--scribe-text))]/70`}
                    >
                      {employee.talkTime}%
                    </span>
                  </TableCell>
                  <TableCell className="text-[hsl(var(--scribe-text))]/70">
                    {employee.keyActions}
                  </TableCell>
                  <TableCell>
                    <span className={getSentimentColor(employee.sentiment)}>
                      {employee.sentiment.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`${
                        isExceptional(employee.attendanceScore / 100, "high")
                          ? "border-b-2 border-[hsl(var(--scribe-accent))]"
                          : ""
                      } text-[hsl(var(--scribe-text))]/70`}
                    >
                      {employee.attendanceScore}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="bg-[hsl(var(--scribe-card))] border-[hsl(var(--scribe-text))]/10">
          <DialogHeader>
            <DialogTitle className="text-[hsl(var(--scribe-text))]">
              {selectedEmployee?.name} - Performance Trends
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-[hsl(var(--scribe-text))]/70 mb-2">
                Key Contribution Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedEmployee?.keywords.map((keyword, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-[hsl(var(--scribe-accent))]/10 text-[hsl(var(--scribe-accent))] border-[hsl(var(--scribe-accent))]/20"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-black/20 rounded-lg">
                <div className="text-2xl font-semibold text-[hsl(var(--scribe-text))]">
                  {selectedEmployee?.talkTime}%
                </div>
                <div className="text-xs text-[hsl(var(--scribe-text))]/60">Talk Time</div>
              </div>
              <div className="p-3 bg-black/20 rounded-lg">
                <div className="text-2xl font-semibold text-[hsl(var(--scribe-text))]">
                  {selectedEmployee?.keyActions}
                </div>
                <div className="text-xs text-[hsl(var(--scribe-text))]/60">Key Actions</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
