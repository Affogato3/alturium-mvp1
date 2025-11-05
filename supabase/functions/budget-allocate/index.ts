import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId, userId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the document
    const { data: document, error: docError } = await supabase
      .from('financial_documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();

    if (docError) throw docError;
    if (!document) throw new Error('Document not found');

    // Map category to department
    const categoryToDepartment: Record<string, string> = {
      'operations': 'Operations',
      'marketing': 'Marketing',
      'rd': 'R&D',
      'finance': 'Finance',
      'legal': 'Legal',
      'hr': 'HR'
    };

    const department = categoryToDepartment[document.category] || 'Operations';

    // Find the appropriate budget for this fiscal year and period
    const currentDate = new Date();
    const fiscalYear = currentDate.getFullYear();
    const fiscalPeriod = `Q${Math.ceil((currentDate.getMonth() + 1) / 3)}`;

    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('department', department)
      .eq('fiscal_year', fiscalYear)
      .eq('fiscal_period', fiscalPeriod)
      .single();

    if (budgetError && budgetError.code !== 'PGRST116') {
      console.error('Budget error:', budgetError);
    }

    // Create budget actual entry
    const { error: actualError } = await supabase
      .from('budget_actuals')
      .insert({
        user_id: userId,
        budget_id: budget?.id || null,
        actual_amount: parseFloat(document.amount),
        transaction_date: document.issue_date || currentDate.toISOString().split('T')[0],
        vendor_name: document.vendor_name,
        description: document.description || `${document.doc_type} from ${document.vendor_name}`,
        metadata: {
          document_id: document.id,
          doc_type: document.doc_type,
          category: document.category,
          auto_allocated: true,
          allocated_at: new Date().toISOString()
        }
      });

    if (actualError) throw actualError;

    // Create AI insight about the allocation
    const variance = budget ? 
      ((parseFloat(document.amount) / parseFloat(budget.planned_amount)) * 100).toFixed(1) : 
      null;

    await supabase.from('ai_insights').insert({
      user_id: userId,
      insight_type: 'budget_allocation',
      message: budget 
        ? `Auto-allocated $${parseFloat(document.amount).toLocaleString()} invoice from ${document.vendor_name} to ${department} budget (${variance}% of planned amount)`
        : `Auto-allocated $${parseFloat(document.amount).toLocaleString()} invoice from ${document.vendor_name} to ${department} (no active budget found)`,
      priority: variance && parseFloat(variance) > 10 ? 'high' : 'low',
      confidence: 0.9,
      metadata: {
        document_id: documentId,
        department,
        amount: document.amount,
        budget_id: budget?.id
      }
    });

    // Update document with allocation info
    await supabase
      .from('financial_documents')
      .update({
        extracted_data: {
          ...document.extracted_data,
          allocated_to_budget: true,
          allocated_department: department,
          budget_id: budget?.id,
          allocated_at: new Date().toISOString()
        }
      })
      .eq('id', documentId);

    return new Response(
      JSON.stringify({
        success: true,
        department,
        amount: document.amount,
        budget_found: !!budget,
        variance: variance ? `${variance}%` : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Budget allocation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
