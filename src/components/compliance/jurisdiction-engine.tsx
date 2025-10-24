import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface JurisdictionEngineProps {
  onUpdate: () => void;
}

export const JurisdictionEngine = ({ onUpdate }: JurisdictionEngineProps) => {
  const [jurisdictions, setJurisdictions] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    region: '',
    compliance_status: 'pending_update' as const,
  });

  useEffect(() => {
    loadJurisdictions();
  }, []);

  const loadJurisdictions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('jurisdictions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setJurisdictions(data);
    } catch (error) {
      console.error('Error loading jurisdictions:', error);
    }
  };

  const addJurisdiction = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('jurisdictions').insert({
        user_id: user.id,
        ...formData,
      });

      if (error) throw error;

      toast.success('Jurisdiction added successfully');
      setShowAddForm(false);
      setFormData({
        code: '',
        name: '',
        region: '',
        compliance_status: 'pending_update',
      });
      loadJurisdictions();
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteJurisdiction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('jurisdictions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Jurisdiction removed');
      loadJurisdictions();
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="bg-[#1A1A1A] border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Jurisdiction Engine</h3>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-cyan-500 hover:bg-cyan-600 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Jurisdiction
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-[#0B0B0B] border-gray-800 p-4 mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Code</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="US, EU, UK..."
                  className="bg-[#1A1A1A] border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="United States"
                  className="bg-[#1A1A1A] border-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Region</Label>
              <Select value={formData.region} onValueChange={(v) => setFormData({ ...formData, region: v })}>
                <SelectTrigger className="bg-[#1A1A1A] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                  <SelectItem value="Middle East">Middle East</SelectItem>
                  <SelectItem value="Africa">Africa</SelectItem>
                  <SelectItem value="South America">South America</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={addJurisdiction} className="w-full bg-emerald-500 hover:bg-emerald-600 text-black">
              Add Jurisdiction
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {jurisdictions.map((jurisdiction) => (
          <Card key={jurisdiction.id} className="bg-[#0B0B0B] border-gray-800/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-cyan-400">{jurisdiction.code}</span>
                  <span className="font-semibold text-white">{jurisdiction.name}</span>
                  <span className="text-sm text-gray-400">({jurisdiction.region})</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteJurisdiction(jurisdiction.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}

        {jurisdictions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No jurisdictions added yet.</p>
            <p className="text-sm mt-2">Click "Add Jurisdiction" to get started.</p>
          </div>
        )}
      </div>
    </Card>
  );
};