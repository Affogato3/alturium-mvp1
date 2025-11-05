import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, CheckCircle, XCircle, CreditCard, Eye, 
  Sparkles, Calendar, DollarSign, Building2, Send 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentCardProps {
  document: any;
  onUpdate: () => void;
}

export const DocumentCard = ({ document, onUpdate }: DocumentCardProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const docTypeIcons: Record<string, any> = {
    invoice: FileText,
    receipt: FileText,
    contract: FileText,
    payment_proof: CreditCard,
    other: FileText
  };

  const docTypeColors: Record<string, string> = {
    invoice: "border-l-4 border-l-cyan-500",
    receipt: "border-l-4 border-l-purple-500",
    contract: "border-l-4 border-l-yellow-500",
    payment_proof: "border-l-4 border-l-green-500",
    other: "border-l-4 border-l-gray-500"
  };

  const Icon = docTypeIcons[document.doc_type] || FileText;

  const handleVerify = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('document-verify', {
        body: {
          extractedData: document.extracted_data,
          originalText: document.description || ''
        }
      });

      if (error) throw error;

      toast({
        title: "AI Verification Complete",
        description: `${data.verified_fields}/${data.total_fields} fields verified. Recommendation: ${data.recommendation}`,
      });

      if (data.mismatches?.length > 0) {
        toast({
          title: "Mismatches Found",
          description: data.mismatches.map((m: any) => `${m.field}: ${m.reason}`).join('\n'),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('financial_documents')
        .update({ status: 'approved' })
        .eq('id', document.id);

      if (error) throw error;

      // Auto-allocate to budget if it's an invoice
      if (document.doc_type === 'invoice' && document.amount) {
        try {
          const { data: allocationData, error: allocError } = await supabase.functions.invoke('budget-allocate', {
            body: { documentId: document.id, userId: user.id }
          });

          if (!allocError && allocationData?.success) {
            toast({
              title: "✅ Document Approved & Allocated",
              description: `Allocated to ${allocationData.department} budget`,
            });
          }
        } catch (allocError) {
          console.error('Allocation error:', allocError);
        }
      }

      // Log audit event
      await supabase.from('audit_events').insert({
        user_id: document.user_id,
        event_type: 'document_approved',
        entity_type: 'financial_document',
        entity_id: document.id,
        description: `Approved ${document.doc_type} from ${document.vendor_name || 'Unknown'}`
      });

      if (!document.amount || document.doc_type !== 'invoice') {
        toast({
          title: "✅ Document Approved",
          description: "Document moved to approved queue",
        });
      }

      onUpdate();
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('financial_documents')
        .update({ status: 'rejected' })
        .eq('id', document.id);

      if (error) throw error;

      await supabase.from('audit_events').insert({
        user_id: document.user_id,
        event_type: 'document_rejected',
        entity_type: 'financial_document',
        entity_id: document.id,
        description: `Rejected ${document.doc_type} from ${document.vendor_name || 'Unknown'}`
      });

      toast({
        title: "❌ Document Rejected",
        description: "Document moved to rejected queue",
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: "Rejection Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase.functions.invoke('payment-initiate', {
        body: {
          documentId: document.id,
          amount: parseFloat(document.amount),
          vendorName: document.vendor_name,
          paymentMethod: 'ach',
          scheduledDate: null,
          requestedBy: userData.user?.email
        }
      });

      if (error) throw error;

      toast({
        title: "💳 Payment Initiated",
        description: "Payment sent for approval",
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: "Payment Initiation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={`group hover:shadow-2xl transition-all duration-300 bg-card/40 backdrop-blur-xl ${docTypeColors[document.doc_type]} hover:-translate-y-1`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{document.vendor_name || 'Unknown Vendor'}</CardTitle>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {document.doc_type.replace('_', ' ')}
                </Badge>
                <Badge 
                  variant={document.status === 'pending' ? 'default' : document.status === 'approved' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {document.status}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {document.amount && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-success" />
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">${parseFloat(document.amount).toLocaleString()}</span>
              </div>
            )}
            {document.due_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-warning" />
                <span className="text-muted-foreground">Due:</span>
                <span className="font-semibold">{new Date(document.due_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Budget Allocation Badge */}
          {document.extracted_data?.allocated_to_budget && (
            <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-primary/20">
                  <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-primary">
                    Auto-Allocated to Budget
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {document.extracted_data.allocated_department} • {new Date(document.extracted_data.allocated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Expanded Details */}
          {isExpanded && (
            <div className="space-y-3 pt-3 border-t border-border animate-fade-in">
              {document.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{document.description}</p>
                </div>
              )}
              {document.category && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="text-sm">Category: <span className="font-semibold">{document.category}</span></span>
                </div>
              )}
              {document.ai_confidence && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">AI Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${document.ai_confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold">{Math.round(document.ai_confidence * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {document.status === 'pending' && (
            <div className="flex gap-2 pt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handleVerify}
                disabled={isProcessing}
                className="flex-1 group/btn hover:scale-105 transition-transform"
              >
                <Sparkles className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
                Verify
              </Button>
              <Button
                size="sm"
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 bg-success hover:bg-success/90 group/btn hover:scale-105 transition-transform"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1 group/btn hover:scale-105 transition-transform"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          )}

          {/* Pay Now Button for Approved Invoices */}
          {document.status === 'approved' && document.doc_type === 'invoice' && document.amount && (
            <div className="pt-3">
              <Button
                size="sm"
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary/90 group/btn hover:scale-105 transition-transform"
              >
                <Send className="h-4 w-4 mr-2" />
                Pay Now - ${parseFloat(document.amount).toLocaleString()}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};