import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, FileSpreadsheet, Loader2 } from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: "pdf" | "word") => void;
  isGenerating: boolean;
}

export function ExportDialog({ open, onOpenChange, onExport, isGenerating }: ExportDialogProps) {
  const [format, setFormat] = useState<"pdf" | "word">("pdf");

  const handleExport = () => {
    onExport(format);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Analysis Report</DialogTitle>
          <DialogDescription>
            Choose your preferred format for the AI-generated comprehensive report (2+ pages with detailed analysis and graphs).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup value={format} onValueChange={(v) => setFormat(v as "pdf" | "word")}>
            <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="flex items-center gap-3 cursor-pointer flex-1">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">PDF Document</p>
                  <p className="text-sm text-muted-foreground">
                    Portable format, ideal for sharing and viewing
                  </p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="word" id="word" />
              <Label htmlFor="word" className="flex items-center gap-3 cursor-pointer flex-1">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Word Document</p>
                  <p className="text-sm text-muted-foreground">
                    Editable format, perfect for customization
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            className="flex-1"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Export Report"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
