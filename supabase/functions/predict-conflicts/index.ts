import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const { action, taskId, tasks } = await req.json();

    if (action === "predict") {
      // Fetch all tasks and dependencies
      const { data: allTasks, error: tasksError } = await supabaseClient
        .from("interlock_tasks")
        .select("*")
        .eq("user_id", user.id);

      if (tasksError) throw tasksError;

      const { data: dependencies, error: depsError } = await supabaseClient
        .from("interlock_dependencies")
        .select("*");

      if (depsError) throw depsError;

      // AI-powered conflict detection using Lovable AI
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are an AI Conflict Detection Engine for enterprise task management. Analyze task dependencies, timelines, and resource allocations to predict potential conflicts. Return a JSON array of conflicts with: conflict_type, task_id, severity (low/medium/high/critical), description, affected_departments, predicted_impact_hours, and auto_resolution_suggested (JSON object with new_start_date, new_end_date, reason, confidence, stakeholders).`
            },
            {
              role: "user",
              content: `Analyze these tasks and dependencies for potential conflicts:\n\nTasks: ${JSON.stringify(allTasks)}\n\nDependencies: ${JSON.stringify(dependencies)}\n\nConsider: timing conflicts, resource overlaps, department dependencies, cascading delays, and priority conflicts.`
            }
          ],
          response_format: { type: "json_object" }
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error("AI API error:", aiResponse.status, errorText);
        throw new Error("AI prediction failed");
      }

      const aiData = await aiResponse.json();
      const conflictsData = JSON.parse(aiData.choices[0].message.content);
      const conflicts = conflictsData.conflicts || [];

      // Store conflicts in database
      for (const conflict of conflicts) {
        await supabaseClient.from("interlock_conflicts").insert({
          user_id: user.id,
          task_id: conflict.task_id,
          conflict_type: conflict.conflict_type,
          severity: conflict.severity,
          description: conflict.description,
          affected_departments: conflict.affected_departments,
          predicted_impact_hours: conflict.predicted_impact_hours,
          auto_resolution_suggested: conflict.auto_resolution_suggested,
          resolution_status: "detected"
        });
      }

      // Update task conflict probabilities
      for (const task of allTasks || []) {
        const taskConflicts = conflicts.filter((c: any) => c.task_id === task.id);
        const maxSeverity = taskConflicts.reduce((max: number, c: any) => {
          const severityMap: any = { low: 0.2, medium: 0.5, high: 0.75, critical: 0.95 };
          return Math.max(max, severityMap[c.severity] || 0);
        }, 0);

        await supabaseClient
          .from("interlock_tasks")
          .update({ conflict_probability: maxSeverity })
          .eq("id", task.id);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          conflicts,
          totalConflicts: conflicts.length,
          criticalConflicts: conflicts.filter((c: any) => c.severity === "critical").length
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "reschedule") {
      const { conflictId, resolution } = await req.json();

      // Fetch conflict and task
      const { data: conflict } = await supabaseClient
        .from("interlock_conflicts")
        .select("*")
        .eq("id", conflictId)
        .single();

      const { data: task } = await supabaseClient
        .from("interlock_tasks")
        .select("*")
        .eq("id", conflict.task_id)
        .single();

      // Record reschedule history
      await supabaseClient.from("interlock_reschedules").insert({
        user_id: user.id,
        task_id: task.id,
        conflict_id: conflictId,
        old_start_date: task.start_date,
        old_end_date: task.end_date,
        new_start_date: resolution.new_start_date,
        new_end_date: resolution.new_end_date,
        reason: resolution.reason,
        ai_confidence: resolution.confidence,
        stakeholders_notified: resolution.stakeholders
      });

      // Update task with new dates
      await supabaseClient
        .from("interlock_tasks")
        .update({
          start_date: resolution.new_start_date,
          end_date: resolution.new_end_date,
          conflict_probability: 0.1
        })
        .eq("id", task.id);

      // Mark conflict as resolved
      await supabaseClient
        .from("interlock_conflicts")
        .update({ 
          resolution_status: "resolved",
          resolved_at: new Date().toISOString()
        })
        .eq("id", conflictId);

      return new Response(
        JSON.stringify({ success: true, message: "Task rescheduled successfully" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});