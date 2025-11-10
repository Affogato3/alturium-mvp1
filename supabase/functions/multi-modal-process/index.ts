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
    const { action, fileType, content } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "process_file":
        systemPrompt = "You are a multi-modal data extraction specialist. Extract structured information from various file types.";
        userPrompt = `Extract data from this ${fileType} content:\n\n${content}\n\nReturn JSON with: fields array {name, value, confidence}`;
        break;
      
      case "summarize":
        systemPrompt = "You are an AI content summarizer. Analyze extracted data and provide key insights and risks.";
        userPrompt = `Summarize this data: ${JSON.stringify(content)}\n\nProvide a concise summary highlighting major risks, opportunities, and key findings.`;
        break;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI processing failed: ${response.status}`);
    }

    const data = await response.json();
    const content_result = data.choices[0].message.content;

    let result;
    if (action === "summarize") {
      result = { summary: content_result };
    } else {
      try {
        const jsonMatch = content_result.match(/\{[\s\S]*\}/);
        result = jsonMatch ? JSON.parse(jsonMatch[0]) : { fields: [] };
      } catch {
        result = { fields: [] };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in multi-modal-process:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
