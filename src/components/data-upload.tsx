import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Check, 
  AlertTriangle, 
  X,
  FileSpreadsheet,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  insights?: {
    records: number;
    anomalies: number;
    riskScore: number;
  };
}

interface DataUploadProps {
  onAnalysisComplete: (results: any) => void;
}

export function DataUpload({ onAnalysisComplete }: DataUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  }, []);

  const processFiles = async (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate file processing
    for (const file of newFiles) {
      // Upload simulation
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ));
      }

      // Processing simulation
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: "processing", progress: 0 } : f
      ));

      for (let progress = 0; progress <= 100; progress += 25) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ));
      }

      // Generate mock insights
      const insights = {
        records: Math.floor(Math.random() * 10000) + 1000,
        anomalies: Math.floor(Math.random() * 50) + 1,
        riskScore: Math.floor(Math.random() * 40) + 60
      };

      setFiles(prev => prev.map(f => 
        f.id === file.id ? { 
          ...f, 
          status: "completed", 
          progress: 100,
          insights 
        } : f
      ));

      // Trigger analysis complete callback
      onAnalysisComplete({
        fileName: file.name,
        insights
      });
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('spreadsheet') || type.includes('excel')) {
      return FileSpreadsheet;
    }
    if (type.includes('csv')) {
      return Database;
    }
    return FileText;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground";
      case "error": return "bg-danger text-danger-foreground";
      case "processing": return "bg-warning text-warning-foreground";
      default: return "bg-primary text-primary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Data Upload & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              "hover:border-primary/50 hover:bg-primary/5"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Drag & drop your files here
            </h3>
            <p className="text-muted-foreground mb-4">
              Supports CSV, Excel, JSON, and other data formats
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept=".csv,.xlsx,.xls,.json,.txt"
              onChange={handleFileSelect}
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.type);
                return (
                  <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <FileIcon className="h-8 w-8 text-primary flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium truncate">{file.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(file.status)}>
                            {file.status === "uploading" && "Uploading"}
                            {file.status === "processing" && "Analyzing"}
                            {file.status === "completed" && <><Check className="h-3 w-3 mr-1" />Complete</>}
                            {file.status === "error" && <><AlertTriangle className="h-3 w-3 mr-1" />Error</>}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>{formatFileSize(file.size)}</span>
                        {file.status !== "completed" && (
                          <span>{file.progress}%</span>
                        )}
                      </div>
                      
                      {file.status !== "completed" ? (
                        <Progress value={file.progress} className="h-2" />
                      ) : (
                        file.insights && (
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div className="text-center p-2 bg-muted rounded">
                              <div className="font-semibold text-primary">{file.insights.records.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">Records</div>
                            </div>
                            <div className="text-center p-2 bg-muted rounded">
                              <div className="font-semibold text-warning">{file.insights.anomalies}</div>
                              <div className="text-xs text-muted-foreground">Anomalies</div>
                            </div>
                            <div className="text-center p-2 bg-muted rounded">
                              <div className="font-semibold text-success">{file.insights.riskScore}%</div>
                              <div className="text-xs text-muted-foreground">Risk Score</div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}