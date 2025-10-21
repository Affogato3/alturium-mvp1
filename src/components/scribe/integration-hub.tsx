import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

interface Integration {
  id: string;
  name: string;
  icon: string;
  status: "connected" | "disconnected" | "sending";
  lastSync: string;
}

interface IntegrationHubProps {
  integrations: Integration[];
  onSend: (integrationId: string) => Promise<void>;
}

export const IntegrationHub = ({ integrations, onSend }: IntegrationHubProps) => {
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  const handleSend = async (integrationId: string) => {
    setSendingTo(integrationId);
    await onSend(integrationId);
    setSendingTo(null);
  };

  return (
    <Card className="bg-scribe-card border-scribe-card/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-scribe-text">
          Distribution & Collaboration
        </CardTitle>
        <p className="text-sm text-scribe-text/60 mt-2">
          Auto-distribute MoMs, tasks, and insights to your workspace tools
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="p-4 rounded-lg bg-scribe-bg/50 border border-scribe-card/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{integration.icon}</div>
              <div>
                <h4 className="font-medium text-scribe-text text-sm">{integration.name}</h4>
                <p className="text-xs text-scribe-text/50">
                  {integration.status === "connected" ? `Last sync: ${integration.lastSync}` : "Not connected"}
                </p>
              </div>
            </div>

            {integration.status === "connected" && (
              <Button
                size="sm"
                onClick={() => handleSend(integration.id)}
                disabled={sendingTo === integration.id}
                className="bg-scribe-accent hover:bg-scribe-accent/90 text-white h-8"
              >
                {sendingTo === integration.id ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3 mr-1" />
                    Send
                  </>
                )}
              </Button>
            )}

            {integration.status === "disconnected" && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-scribe-text/60 border-scribe-card/30"
              >
                Connect
              </Button>
            )}
          </div>
        ))}

        <div className="pt-3 border-t border-scribe-card/20">
          <Button
            className="w-full bg-scribe-accent/10 hover:bg-scribe-accent/20 text-scribe-accent"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Send to All Connected Tools
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
