import { useState, useEffect } from "react";
import { Inbox, FileText, TrendingUp, Settings, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FluidGradientBackground } from "./smart-inbox/fluid-gradient-background";
import { DocumentCard } from "./smart-inbox/document-card";
import { InsightPanel } from "./smart-inbox/insight-panel";

export const SmartInboxDashboard = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [forecast, setForecast] = useState<any>({});

  useEffect(() => {
    loadDocuments();
    loadForecast();
  }, [activeTab]);

  const loadDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('financial_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (activeTab === 'inbox') {
        query = query.eq('status', 'pending');
      } else if (activeTab === 'approved') {
        query = query.eq('status', 'approved');
      }

      const { data, error } = await query;

      if (error) throw error;

      setDocuments(data || []);
    } catch (error: any) {
      toast({
        title: "Error Loading Documents",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadForecast = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('inbox-forecast');

      if (error) throw error;

      setForecast(data);
    } catch (error: any) {
      console.error('Forecast error:', error);
    }
  };

  const handleUploadDocument = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.txt,.doc,.docx';
    
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Read file content (simplified - in production use proper file reading)
        const text = await file.text();

        // Classify document
        const { data: classifyData, error: classifyError } = await supabase.functions.invoke('document-classify', {
          body: { text, fileName: file.name }
        });

        if (classifyError) throw classifyError;

        // Extract fields
        const { data: extractData, error: extractError } = await supabase.functions.invoke('document-extract', {
          body: { text, docType: classifyData.doc_type }
        });

        if (extractError) throw extractError;

        // Insert document
        const { error: insertError } = await supabase
          .from('financial_documents')
          .insert({
            user_id: user.id,
            doc_type: classifyData.doc_type,
            category: classifyData.category,
            vendor_name: extractData.vendor_name,
            amount: extractData.amount,
            currency: extractData.currency || 'USD',
            issue_date: extractData.issue_date,
            due_date: extractData.due_date,
            description: extractData.description || file.name,
            ai_confidence: extractData.confidence,
            extracted_data: extractData,
            status: 'pending'
          });

        if (insertError) throw insertError;

        toast({
          title: "✨ Document Processed",
          description: `Classified as ${classifyData.doc_type} with ${Math.round(classifyData.confidence * 100)}% confidence`,
        });

        loadDocuments();
        loadForecast();
      } catch (error: any) {
        toast({
          title: "Upload Failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    input.click();
  };

  const handleGenerateSample = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const sampleDocs = [
        {
          user_id: user.id,
          doc_type: 'invoice',
          category: 'operations',
          vendor_name: 'AWS Cloud Services',
          amount: 2450.00,
          currency: 'USD',
          issue_date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: 'Monthly cloud infrastructure costs',
          ai_confidence: 0.95,
          status: 'pending'
        },
        {
          user_id: user.id,
          doc_type: 'receipt',
          category: 'marketing',
          vendor_name: 'Google Ads',
          amount: 1500.00,
          currency: 'USD',
          issue_date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: 'Q4 advertising campaign',
          ai_confidence: 0.92,
          status: 'pending'
        },
        {
          user_id: user.id,
          doc_type: 'invoice',
          category: 'finance',
          vendor_name: 'Office Supplies Inc',
          amount: 340.50,
          currency: 'USD',
          issue_date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: 'Monthly office supplies',
          ai_confidence: 0.88,
          status: 'pending'
        }
      ];

      const { error } = await supabase
        .from('financial_documents')
        .insert(sampleDocs);

      if (error) throw error;

      toast({
        title: "✅ Sample Data Generated",
        description: "3 sample documents added to your inbox",
      });

      loadDocuments();
      loadForecast();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#0B0E13] text-foreground overflow-hidden">
      <FluidGradientBackground />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-primary/20 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30">
                  <Inbox className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Smart Financial Inbox
                  </h1>
                  <p className="text-xs text-muted-foreground">AI-powered document intelligence</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleGenerateSample}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Sample
                </Button>
                <Button
                  onClick={handleUploadDocument}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-4">
              <Input
                placeholder="Search documents by vendor, amount, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card/50 backdrop-blur-xl border-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Document Feed */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-card/50 backdrop-blur-xl">
                  <TabsTrigger value="inbox" className="gap-2">
                    <Inbox className="h-4 w-4" />
                    Inbox
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Approved
                  </TabsTrigger>
                  <TabsTrigger value="history" className="gap-2">
                    <Clock className="h-4 w-4" />
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6 space-y-4">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-muted-foreground mt-4">Loading documents...</p>
                    </div>
                  ) : filteredDocuments.length === 0 ? (
                    <div className="text-center py-12">
                      <Inbox className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No documents found</p>
                      <Button
                        onClick={handleUploadDocument}
                        className="mt-4"
                        variant="outline"
                      >
                        Upload Your First Document
                      </Button>
                    </div>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onUpdate={() => {
                          loadDocuments();
                          loadForecast();
                        }}
                      />
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right: Insights */}
            <div>
              <InsightPanel
                summary={forecast.summary}
                forecast={forecast.forecast || []}
                recommendations={forecast.recommendations || []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};