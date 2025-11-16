import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AICommentarySettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    tone: "confident",
    detail_level: [70],
    include_risks: true,
    include_opportunities: true,
    include_recommendations: true,
    custom_instructions: "",
    model: "google/gemini-2.5-flash",
  });

  const handleSave = () => {
    localStorage.setItem("finsights_ai_settings", JSON.stringify(settings));
    toast({
      title: "AI Settings Saved",
      description: "Your AI commentary preferences have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Commentary Settings</h2>
          <p className="text-slate-400 mt-1">
            Customize how AI generates insights and commentary
          </p>
        </div>
        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Model Selection */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            AI Model
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Model Selection</Label>
              <Select
                value={settings.model}
                onValueChange={(value) => setSettings({ ...settings, model: value })}
              >
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="google/gemini-2.5-pro">
                    Gemini 2.5 Pro (Most Capable)
                  </SelectItem>
                  <SelectItem value="google/gemini-2.5-flash">
                    Gemini 2.5 Flash (Balanced)
                  </SelectItem>
                  <SelectItem value="google/gemini-2.5-flash-lite">
                    Gemini 2.5 Flash Lite (Fast)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400 mt-1">
                Higher capability models provide deeper analysis but may take longer
              </p>
            </div>
          </div>
        </Card>

        {/* Tone & Style */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tone & Style</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Commentary Tone</Label>
              <Select
                value={settings.tone}
                onValueChange={(value) => setSettings({ ...settings, tone: value })}
              >
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="confident">Confident & Analytical</SelectItem>
                  <SelectItem value="cautious">Cautious & Measured</SelectItem>
                  <SelectItem value="optimistic">Optimistic & Forward-looking</SelectItem>
                  <SelectItem value="balanced">Balanced & Objective</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-300">
                Detail Level: {settings.detail_level[0]}%
              </Label>
              <Slider
                value={settings.detail_level}
                onValueChange={(value) => setSettings({ ...settings, detail_level: value })}
                min={0}
                max={100}
                step={10}
                className="mt-2"
              />
              <p className="text-xs text-slate-400 mt-1">
                Lower = concise summaries, Higher = detailed analysis
              </p>
            </div>
          </div>
        </Card>

        {/* Content Options */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Content Options</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-risks"
                checked={settings.include_risks}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, include_risks: checked as boolean })
                }
              />
              <Label htmlFor="include-risks" className="text-slate-300 cursor-pointer">
                Include risk analysis
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-opportunities"
                checked={settings.include_opportunities}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, include_opportunities: checked as boolean })
                }
              />
              <Label htmlFor="include-opportunities" className="text-slate-300 cursor-pointer">
                Include opportunity identification
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-recommendations"
                checked={settings.include_recommendations}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, include_recommendations: checked as boolean })
                }
              />
              <Label htmlFor="include-recommendations" className="text-slate-300 cursor-pointer">
                Include actionable recommendations
              </Label>
            </div>
          </div>
        </Card>

        {/* Custom Instructions */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Custom Instructions</h3>
          <div className="space-y-4">
            <Textarea
              value={settings.custom_instructions}
              onChange={(e) =>
                setSettings({ ...settings, custom_instructions: e.target.value })
              }
              className="bg-slate-900/50 border-slate-700 text-slate-300 min-h-[120px]"
              placeholder="Add specific instructions for the AI, e.g., 'Focus on customer acquisition costs', 'Highlight international expansion metrics', etc."
            />
            <p className="text-xs text-slate-400">
              Provide context or specific areas to focus on in the commentary
            </p>
          </div>
        </Card>
      </div>

      {/* Example Preview */}
      <Card className="bg-slate-800/50 border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Example Commentary</h3>
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-300 leading-relaxed">
            {settings.tone === "confident" && (
              <>
                Our financial performance this quarter demonstrates strong momentum with revenue 
                reaching $1.85M, representing 12% month-over-month growth. The burn rate increase 
                of 8% is attributable to strategic investments in our enterprise sales team, which 
                has already begun yielding results with three new enterprise deals in the pipeline...
              </>
            )}
            {settings.tone === "cautious" && (
              <>
                While we achieved revenue of $1.85M this quarter, it's important to note that our 
                burn rate increased by 8% to $450K monthly. We're monitoring this closely to ensure 
                our runway remains healthy. The revenue growth is encouraging, but we should remain 
                vigilant about cost management as we scale...
              </>
            )}
            {settings.tone === "optimistic" && (
              <>
                We're excited to report exceptional progress this quarter with revenue hitting $1.85M, 
                a strong 12% increase month-over-month! This momentum, combined with our expanding 
                customer base and improving unit economics, positions us well for continued growth. 
                The strategic investments we've made are already paying dividends...
              </>
            )}
            {settings.tone === "balanced" && (
              <>
                This quarter's financial performance shows mixed signals that warrant careful analysis. 
                Revenue grew 12% to $1.85M, which is positive, while burn rate increased 8% to $450K 
                monthly. Our runway remains stable at 11.5 months. Key focus areas going forward include 
                optimizing customer acquisition costs while maintaining growth trajectory...
              </>
            )}
          </p>
        </div>
      </Card>
    </div>
  );
};
