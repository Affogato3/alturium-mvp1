import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Pin, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: Date;
  pinned?: boolean;
}

interface Decision {
  id: string;
  title: string;
  status: "approved" | "rejected" | "pending";
  timestamp: Date;
  user: string;
}

export const CollaborationPanel = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: "Sarah Chen",
      avatar: "SC",
      message: "The Q3 revenue spike correlates with our new enterprise deals. Great insight!",
      timestamp: new Date(Date.now() - 3600000),
      pinned: true,
    },
    {
      id: "2",
      user: "Mike Johnson",
      avatar: "MJ",
      message: "Should we increase marketing budget based on this CAC improvement?",
      timestamp: new Date(Date.now() - 1800000),
    },
  ]);

  const [decisions, setDecisions] = useState<Decision[]>([
    {
      id: "1",
      title: "Increase marketing budget by 15%",
      status: "approved",
      timestamp: new Date(Date.now() - 7200000),
      user: "John Doe",
    },
    {
      id: "2",
      title: "Reduce LinkedIn ad spend",
      status: "pending",
      timestamp: new Date(Date.now() - 3600000),
      user: "Sarah Chen",
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState<"comments" | "decisions">("comments");

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: "You",
      avatar: "YO",
      message: newComment,
      timestamp: new Date(),
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
    toast.success("Comment added");
  };

  const togglePin = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  };

  const updateDecisionStatus = (
    id: string,
    status: "approved" | "rejected" | "pending"
  ) => {
    setDecisions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
    toast.success(`Decision ${status}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-3 h-3" />;
      case "rejected":
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <Card className="bg-background/60 backdrop-blur-xl border-primary/10 p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Team Collaboration</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === "comments" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("comments")}
          className="flex-1"
        >
          Comments ({comments.length})
        </Button>
        <Button
          variant={activeTab === "decisions" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("decisions")}
          className="flex-1"
        >
          Decisions ({decisions.length})
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "comments" ? (
          <motion.div
            key="comments"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {comments
                .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
                .map((comment) => (
                  <motion.div
                    key={comment.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      comment.pinned
                        ? "bg-primary/5 border-primary/30"
                        : "bg-card/50 border-border/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {comment.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {comment.user}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {comment.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePin(comment.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Pin
                          className={`w-4 h-4 ${
                            comment.pinned ? "text-primary fill-primary" : ""
                          }`}
                        />
                      </Button>
                    </div>
                    <p className="text-sm text-foreground/80">{comment.message}</p>
                  </motion.div>
                ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Add your comment or annotation..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addComment();
                  }
                }}
                className="min-h-[80px] bg-background/50"
              />
              <Button onClick={addComment} size="icon" className="shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="decisions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {decisions.map((decision) => (
              <motion.div
                key={decision.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-card/50 border border-border/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {decision.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      by {decision.user} • {decision.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(decision.status)}>
                    {getStatusIcon(decision.status)}
                    <span className="ml-1.5 capitalize">{decision.status}</span>
                  </Badge>
                </div>

                {decision.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateDecisionStatus(decision.id, "approved")}
                      className="flex-1 border-emerald-500/30 hover:bg-emerald-500/10"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateDecisionStatus(decision.id, "rejected")}
                      className="flex-1 border-red-500/30 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
