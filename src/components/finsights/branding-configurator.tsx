import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const BrandingConfigurator = () => {
  const { toast } = useToast();
  const [branding, setBranding] = useState({
    company_name: "",
    logo_url: "",
    primary_color: "#667eea",
    secondary_color: "#764ba2",
    accent_color: "#f093fb",
    font_heading: "Inter",
    font_body: "Inter",
    include_logo: true,
    include_watermark: true,
    include_page_numbers: true,
    include_toc: true,
    include_signature: false,
    signature_name: "",
    signature_image_url: "",
  });

  useEffect(() => {
    // Load existing branding config
    const saved = localStorage.getItem("finsights_branding");
    if (saved) {
      setBranding(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("finsights_branding", JSON.stringify(branding));
    toast({
      title: "Branding Saved",
      description: "Your branding configuration has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Branding Configuration</h2>
          <p className="text-slate-400 mt-1">
            Customize the appearance of your reports
          </p>
        </div>
        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Identity */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-400" />
            Company Identity
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Company Name</Label>
              <Input
                value={branding.company_name}
                onChange={(e) => setBranding({ ...branding, company_name: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <Label className="text-slate-300">Logo URL</Label>
              <Input
                value={branding.logo_url}
                onChange={(e) => setBranding({ ...branding, logo_url: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="https://..."
              />
            </div>
          </div>
        </Card>

        {/* Color Scheme */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Color Scheme</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={branding.primary_color}
                  onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={branding.primary_color}
                  onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                  className="flex-1 bg-slate-900/50 border-slate-700 text-slate-300"
                />
              </div>
            </div>
            <div>
              <Label className="text-slate-300">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={branding.secondary_color}
                  onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={branding.secondary_color}
                  onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                  className="flex-1 bg-slate-900/50 border-slate-700 text-slate-300"
                />
              </div>
            </div>
            <div>
              <Label className="text-slate-300">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={branding.accent_color}
                  onChange={(e) => setBranding({ ...branding, accent_color: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={branding.accent_color}
                  onChange={(e) => setBranding({ ...branding, accent_color: e.target.value })}
                  className="flex-1 bg-slate-900/50 border-slate-700 text-slate-300"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Typography */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Typography</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Heading Font</Label>
              <Input
                value={branding.font_heading}
                onChange={(e) => setBranding({ ...branding, font_heading: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="Inter"
              />
            </div>
            <div>
              <Label className="text-slate-300">Body Font</Label>
              <Input
                value={branding.font_body}
                onChange={(e) => setBranding({ ...branding, font_body: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="Inter"
              />
            </div>
          </div>
        </Card>

        {/* Report Preferences */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Report Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-logo"
                checked={branding.include_logo}
                onCheckedChange={(checked) =>
                  setBranding({ ...branding, include_logo: checked as boolean })
                }
              />
              <Label htmlFor="include-logo" className="text-slate-300 cursor-pointer">
                Include logo in header
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-watermark"
                checked={branding.include_watermark}
                onCheckedChange={(checked) =>
                  setBranding({ ...branding, include_watermark: checked as boolean })
                }
              />
              <Label htmlFor="include-watermark" className="text-slate-300 cursor-pointer">
                Include "CONFIDENTIAL" watermark
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-page-numbers"
                checked={branding.include_page_numbers}
                onCheckedChange={(checked) =>
                  setBranding({ ...branding, include_page_numbers: checked as boolean })
                }
              />
              <Label htmlFor="include-page-numbers" className="text-slate-300 cursor-pointer">
                Include page numbers
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-toc"
                checked={branding.include_toc}
                onCheckedChange={(checked) =>
                  setBranding({ ...branding, include_toc: checked as boolean })
                }
              />
              <Label htmlFor="include-toc" className="text-slate-300 cursor-pointer">
                Include table of contents
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-signature"
                checked={branding.include_signature}
                onCheckedChange={(checked) =>
                  setBranding({ ...branding, include_signature: checked as boolean })
                }
              />
              <Label htmlFor="include-signature" className="text-slate-300 cursor-pointer">
                Include executive signature
              </Label>
            </div>

            {branding.include_signature && (
              <div className="space-y-3 pl-6 border-l-2 border-indigo-500">
                <div>
                  <Label className="text-slate-300">Signature Name</Label>
                  <Input
                    value={branding.signature_name}
                    onChange={(e) => setBranding({ ...branding, signature_name: e.target.value })}
                    className="bg-slate-900/50 border-slate-700 text-slate-300"
                    placeholder="Jane Smith, CFO"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Signature Image URL</Label>
                  <Input
                    value={branding.signature_image_url}
                    onChange={(e) => setBranding({ ...branding, signature_image_url: e.target.value })}
                    className="bg-slate-900/50 border-slate-700 text-slate-300"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Preview */}
      <Card className="bg-slate-800/50 border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
        <div
          className="p-8 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${branding.primary_color} 0%, ${branding.secondary_color} 100%)`,
          }}
        >
          <h1 className="text-white text-3xl font-bold mb-2" style={{ fontFamily: branding.font_heading }}>
            {branding.company_name || "Your Company"}
          </h1>
          <p className="text-white/80" style={{ fontFamily: branding.font_body }}>
            Board Meeting Presentation
          </p>
        </div>
      </Card>
    </div>
  );
};
