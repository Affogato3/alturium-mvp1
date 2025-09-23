import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckSquare, 
  Clock, 
  User, 
  AlertCircle, 
  TrendingUp, 
  MessageSquare,
  Calendar,
  Filter
} from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "review" | "completed" | "overdue";
  dueDate: string;
  category: "audit" | "compliance" | "risk" | "governance";
  alertId?: string;
  estimatedHours: number;
  completedHours: number;
  department: string;
}

const mockTasks: TaskItem[] = [
  {
    id: "task_001",
    title: "Investigate Vendor Payment Anomaly",
    description: "Review unauthorized payment to TechCorp shell company and implement controls",
    assignee: "Sarah Chen",
    priority: "critical",
    status: "in_progress", 
    dueDate: "2024-01-18",
    category: "audit",
    alertId: "alert_001",
    estimatedHours: 16,
    completedHours: 8,
    department: "Finance"
  },
  {
    id: "task_002",
    title: "SOX Control Documentation Update",
    description: "Update segregation of duties documentation and training materials",
    assignee: "Michael Torres",
    priority: "high",
    status: "pending",
    dueDate: "2024-01-22",
    category: "compliance",
    estimatedHours: 12,
    completedHours: 0,
    department: "Finance"
  },
  {
    id: "task_003",
    title: "IT Access Controls Remediation",
    description: "Revoke unauthorized admin privileges and implement role-based permissions",
    assignee: "Jennifer Wu",
    priority: "high", 
    status: "in_progress",
    dueDate: "2024-01-20",
    category: "risk",
    estimatedHours: 20,
    completedHours: 15,
    department: "IT"
  },
  {
    id: "task_004",
    title: "Quarterly Board Report Preparation",
    description: "Compile Q1 governance metrics and risk assessment for board presentation",
    assignee: "David Kumar",
    priority: "medium",
    status: "review",
    dueDate: "2024-01-25", 
    category: "governance",
    estimatedHours: 8,
    completedHours: 8,
    department: "Legal"
  },
  {
    id: "task_005",
    title: "Vendor Authorization Process Review",
    description: "Redesign vendor approval workflow to prevent unauthorized setups",
    assignee: "Lisa Park",
    priority: "medium",
    status: "completed",
    dueDate: "2024-01-15",
    category: "compliance",
    estimatedHours: 10,
    completedHours: 10,
    department: "Procurement"
  }
];

export function TaskManagement() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const filteredTasks = selectedCategory === "all" 
    ? mockTasks 
    : mockTasks.filter(task => task.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-50 border-red-200 text-red-800";
      case "high": return "bg-orange-50 border-orange-200 text-orange-800";
      case "medium": return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "low": return "bg-green-50 border-green-200 text-green-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "review": return "bg-purple-100 text-purple-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "audit": return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case "compliance": return <AlertCircle className="h-4 w-4 text-green-500" />;
      case "risk": return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case "governance": return <User className="h-4 w-4 text-purple-500" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getTaskProgress = (task: TaskItem) => {
    return Math.round((task.completedHours / task.estimatedHours) * 100);
  };

  const taskStats = {
    total: mockTasks.length,
    completed: mockTasks.filter(t => t.status === "completed").length,
    inProgress: mockTasks.filter(t => t.status === "in_progress").length,
    overdue: mockTasks.filter(t => isOverdue(t.dueDate) && t.status !== "completed").length,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Task Stats & Filters */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <CheckSquare className="h-5 w-5 text-accent" />
              Task Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-accent/5 rounded-lg">
                <div className="text-2xl font-bold text-accent">{taskStats.total}</div>
                <div className="text-xs text-muted-foreground">Total Tasks</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4" />
              Filter by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["all", "audit", "compliance", "risk", "governance"].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedCategory(category)}
              >
                {category !== "all" && getCategoryIcon(category)}
                {category === "all" ? "All Tasks" : category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Task List & Details */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Task List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4 space-y-3">
            {filteredTasks.map((task) => (
              <Card 
                key={task.id}
                className={`cursor-pointer transition-all hover:border-accent/50 ${
                  selectedTask?.id === task.id ? "border-accent bg-accent/5" : ""
                }`}
                onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getCategoryIcon(task.category)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1">{task.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs font-medium">
                            {getInitials(task.assignee)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">{task.assignee}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className={isOverdue(task.dueDate) && task.status !== "completed" ? "text-red-600" : "text-muted-foreground"}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className="text-muted-foreground">{task.department}</span>
                  </div>

                  {task.status === "in_progress" && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{getTaskProgress(task)}%</span>
                      </div>
                      <Progress value={getTaskProgress(task)} className="h-2" />
                    </div>
                  )}

                  {selectedTask?.id === task.id && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Estimated Hours:</span>
                          <div className="font-semibold">{task.estimatedHours}h</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Completed Hours:</span>
                          <div className="font-semibold">{task.completedHours}h</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="default" className="text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Comment
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Log Time
                        </Button>
                        {task.status === "pending" && (
                          <Button size="sm" variant="outline" className="text-xs">
                            Start Task
                          </Button>
                        )}
                        {task.status === "in_progress" && (
                          <Button size="sm" variant="outline" className="text-xs">
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="calendar" className="mt-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-medium mb-2">Calendar Integration</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your calendar to view tasks in timeline format
                </p>
                <Button size="sm">Connect Calendar</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}