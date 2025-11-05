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
    const { extractedData, originalText } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Verifying extracted data");

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
            content: `You are a data verification AI. Verify extracted financial data against source text. Return ONLY a JSON object:
{
  "verified_fields": 3,
  "total_fields": 5,
  "mismatches": [
    {"field": "amount", "reason": "Amount in text is 1500 but extracted 1400"}
  ],
  "confidence": 0.85,
  "recommendation": "approve|review|reject"
}`
          },
          {
            role: "user",
            content: `Verify this extracted data:\n${JSON.stringify(extractedData, null, 2)}\n\nAgainst source text:\n${originalText.substring(0, 1500)}`
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error(`AI verification failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log("AI verification response:", content);
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      verified_fields: 0,
      total_fields: 0,
      mismatches: [],
      confidence: 0.5,
      recommendation: "review"
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in document-verify:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      verified_fields: 0,
      total_fields: 0,
      mismatches: [],
      confidence: 0.3,
      recommendation: "review"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});