import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Paperclip, Calendar, User } from "lucide-react";

interface KnowledgeItem {
  id: string;
  title: string;
  summary: string;
  attachments: { name: string; type: string }[];
  linkedMeetings: number;
  lastUpdated: string;
  owner: string;
}

interface KnowledgeDocumentationProps {
  items: KnowledgeItem[];
  onViewItem: (id: string) => void;
}

export const KnowledgeDocumentation = ({ items, onViewItem }: KnowledgeDocumentationProps) => {
  return (
    <Card className="bg-scribe-card border-scribe-card/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-scribe-text">
          Knowledge Continuity
        </CardTitle>
        <p className="text-sm text-scribe-text/60 mt-2">
          Contextual notes and referenced data from this meeting
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onViewItem(item.id)}
            className="p-4 rounded-lg bg-scribe-bg/50 border border-scribe-card/30 hover:border-scribe-accent/30 transition-colors cursor-pointer space-y-3"
          >
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-scribe-accent mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-scribe-text text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-scribe-text/60 line-clamp-2">{item.summary}</p>
              </div>
            </div>

            {item.attachments.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Paperclip className="h-3 w-3 text-scribe-text/50" />
                {item.attachments.map((attachment, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded bg-scribe-bg/80 text-scribe-text/70 border border-scribe-card/20"
                  >
                    {attachment.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-scribe-text/50">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{item.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{item.owner}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{item.linkedMeetings} linked meetings</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
