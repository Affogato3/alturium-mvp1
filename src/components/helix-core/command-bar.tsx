import { useState, useEffect } from "react";
import { Command, CommandInput } from "@/components/ui/command";
import { Search } from "lucide-react";

export const CognitiveCommandBar = ({ onCommand }: { onCommand: (cmd: string) => void }) => {
  const [value, setValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value.length > 0) {
        setIsTyping(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onCommand(value);
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Command className="relative border-primary/30 bg-card/80 backdrop-blur-xl overflow-visible">
          <div className="flex items-center px-3 border-b border-primary/20">
            <Search className="mr-2 h-4 w-4 shrink-0 text-primary animate-pulse" />
            <CommandInput
              value={value}
              onValueChange={(val) => {
                setValue(val);
                setIsTyping(true);
              }}
              placeholder="Type a command... (e.g., 'Show liquidity forecast for next 10 days')"
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0"
            />
          </div>
          {isTyping && value.length > 0 && (
            <div className="p-2 text-xs text-muted-foreground border-t border-primary/10">
              <span className="inline-flex items-center gap-1">
                <span className="animate-pulse">●</span> AI processing command...
              </span>
            </div>
          )}
        </Command>
      </div>
      <div className="mt-2 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setValue("/liquidity forecast")}
          className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          /liquidity
        </button>
        <button
          type="button"
          onClick={() => setValue("/risk simulate")}
          className="px-3 py-1 text-xs rounded-full bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
        >
          /risk
        </button>
        <button
          type="button"
          onClick={() => setValue("/reconcile auto")}
          className="px-3 py-1 text-xs rounded-full bg-success/10 text-success hover:bg-success/20 transition-colors"
        >
          /reconcile
        </button>
      </div>
    </form>
  );
};
