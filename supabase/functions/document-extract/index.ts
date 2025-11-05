import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, docType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Extracting fields from document type:", docType);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a financial document data extractor. Extract key fields and return ONLY a JSON object with this structure:
{
  "vendor_name": "Company Name",
  "amount": 1234.56,
  "currency": "USD",
  "issue_date": "2025-01-15",
  "due_date": "2025-02-15",
  "description": "Brief description",
  "confidence": 0.95
}
If a field is not found, use null. Amount should be a number. Dates should be in YYYY-MM-DD format.`
          },
          {
            role: "user",
            content: `Extract financial data from this ${docType}:\n\n${text.substring(0, 2000)}`
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error(`AI extraction failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log("AI extraction response:", content);
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      vendor_name: null,
      amount: null,
      currency: "USD",
      issue_date: null,
      due_date: null,
      description: null,
      confidence: 0.3
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in document-extract:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      vendor_name: null,
      amount: null,
      currency: "USD",
      confidence: 0.1
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});