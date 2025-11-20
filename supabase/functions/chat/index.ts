import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// Crisis keywords and patterns
const CRISIS_PATTERNS = [
  /\b(kill|hurt|harm)\s+(myself|my\s*self)\b/i,
  /\bsuicid(e|al)\b/i,
  /\bwant\s+to\s+die\b/i,
  /\bend(ing)?\s+(it|everything|my\s+life)\b/i,
  /\bno\s+reason\s+to\s+live\b/i,
  /\bcan'?t\s+go\s+on\b/i,
  /\bbetter\s+off\s+dead\b/i,
];

const SYSTEM_PROMPT = `You are a compassionate, non-clinical mental health support assistant. Your role is to:

1. Provide empathetic, validating, non-judgmental responses
2. Use reflective listening and name emotions you detect
3. Offer evidence-informed coping strategies when appropriate
4. Ask gentle follow-up questions to understand feelings better
5. Keep responses concise and warm (2-3 short paragraphs max)

Important guidelines:
- NEVER diagnose mental health conditions
- NEVER provide medical or prescription advice
- NEVER provide instructions for self-harm or harmful activities
- If you detect crisis language, acknowledge distress but remind user you're not an emergency service
- Suggest professional resources when appropriate (therapist directories, support groups)
- Provide step-by-step coping techniques (breathing exercises, grounding, journaling prompts)

Example coping strategies to offer:
- 5-4-3-2-1 grounding (name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste)
- Box breathing (inhale 4 counts, hold 4, exhale 4, hold 4)
- Brief journaling prompts
- Gentle physical movement

Your tone should be warm, calm, and human-like. Use short paragraphs and open-ended questions.`;

function detectCrisis(message: string): boolean {
  return CRISIS_PATTERNS.some(pattern => pattern.test(message));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { message, conversationId } = await req.json();

    // Check for crisis
    const isCrisis = detectCrisis(message);
    
    if (isCrisis) {
      // Log crisis event
      if (conversationId) {
        await supabase.from("crisis_flags").insert({
          conversation_id: conversationId,
          flag_type: "crisis_language_detected",
          metadata: { trigger: "pattern_match" },
        });
      }

      const crisisResponse = `I'm really concerned about what you're sharing. It sounds like you're in a lot of pain right now, and I want you to know that your life matters.

However, I'm not equipped to provide emergency support. Please reach out for immediate help:

**Emergency Services:**
- India: 112 (Emergency) or 1800-599-0019 (Mental Health Helpline - 24/7)
- International: Your local emergency number

**Crisis Resources:**
- National Suicide Prevention Helpline (India): 1800-599-0019 (24/7)
- Please also reach out to a trusted friend, family member, or mental health professional right now.

You don't have to face this alone. There are people who care and want to help.`;

      return new Response(
        JSON.stringify({
          response: crisisResponse,
          isCrisis: true,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get conversation history if available
    let messages = [{ role: "user", content: message }];
    
    if (conversationId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("save_chats")
        .eq("id", user.id)
        .single();

      if (profile?.save_chats) {
        const { data: history } = await supabase
          .from("messages")
          .select("sender, content")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true })
          .limit(20);

        if (history) {
          messages = [
            ...history.map(msg => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.content || "",
            })),
            { role: "user", content: message },
          ];
        }
      }
    }

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({
        response: aiResponse,
        isCrisis: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});