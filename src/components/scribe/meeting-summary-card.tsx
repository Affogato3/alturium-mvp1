import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface MeetingSummaryCardProps {
  meeting: {
    title: string;
    date: string;
    participants: string[];
    duration: number;
    summary: string[];
    sentimentScore: number;
  };
}

export const MeetingSummaryCard = ({ meeting }: MeetingSummaryCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return "from-emerald-500 to-green-400";
    if (score >= 0.4) return "from-blue-500 to-cyan-400";
    if (score >= 0) return "from-amber-500 to-yellow-400";
    return "from-red-500 to-rose-400";
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 0.7) return "Optimistic";
    if (score >= 0.4) return "Neutral";
    if (score >= 0) return "Caution";
    return "Negative";
  };

  return (
    <Card 
      className="bg-[hsl(var(--scribe-card))] border-0 shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-[hsl(var(--scribe-text))]">
              {meeting.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-[hsl(var(--scribe-text))]/60">
              <span>{meeting.date}</span>
              <span>•</span>
              <span>{meeting.participants.length} participants</span>
              <span>•</span>
              <span>{meeting.duration} min</span>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-[hsl(var(--scribe-text))]/60" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[hsl(var(--scribe-text))]/60" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-[hsl(var(--scribe-text))]/80">
            AI Summary
          </h3>
          <ul className="space-y-2">
            {meeting.summary.slice(0, expanded ? undefined : 3).map((point, idx) => (
              <li key={idx} className="text-[hsl(var(--scribe-text))]/70 text-sm flex items-start gap-2">
                <span className="text-[hsl(var(--scribe-accent))] mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[hsl(var(--scribe-text))]/80">Meeting Sentiment</span>
            <span className="text-[hsl(var(--scribe-text))]/60">
              {getSentimentLabel(meeting.sentimentScore)}
            </span>
          </div>
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getSentimentColor(meeting.sentimentScore)} transition-all duration-500`}
              style={{ width: `${meeting.sentimentScore * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
