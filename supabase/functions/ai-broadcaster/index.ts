
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// Get API keys from environment
const GOOGLE_API_KEYS = [
  Deno.env.get("GOOGLE_API_KEY_1") || 'AIzaSyCXXP_JjQfRPMkSeIBp5Aq1wU5ztK13zRM',
  Deno.env.get("GOOGLE_API_KEY_2") || 'AIzaSyCGVeBiY3xgF29dWgjdV2WAE7BtQbAbYoE',
  Deno.env.get("GOOGLE_API_KEY_3") || 'AIzaSyCInkT7suD_qNtCe2f3xs0O02f0GQGnJJY',
  Deno.env.get("GOOGLE_API_KEY_4") || 'AIzaSyDNbQUc-sLeGngV6rJha3Izvppcb3Ytb3w'
];

// Get OpenRouter API keys
const OPENROUTER_API_KEYS = [
  Deno.env.get("OPENROUTER_API_KEY_1") || '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',
  Deno.env.get("OPENROUTER_API_KEY_2") || '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'
];

// Hugging Face API token
const HUGGING_FACE_TOKEN = Deno.env.get("HUGGING_FACE_TOKEN") || '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';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to try different API keys
async function tryWithMultipleKeys(apiCall: (key: string) => Promise<Response>, keys: string[]): Promise<Response> {
  let lastError: Error | null = null;
  
  for (const key of keys) {
    try {
      return await apiCall(key);
    } catch (error: unknown) {
      console.warn(`API key ${key.substring(0, 8)}... failed:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      // Continue to next key
    }
  }
  
  // If we get here, all keys failed
  throw lastError || new Error('All API keys failed');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, topic, currentTrack, previousTrack, mood } = await req.json();
    
    // Create appropriate prompt based on available data
    let effectivePrompt = prompt || "";
    let systemMessage = "You are a friendly South African radio DJ on SoundMaster Radio.";
    
    // If we have track data, enhance the prompt for DJ commentary
    if (currentTrack) {
      systemMessage += " Keep commentary brief, engaging and natural. Focus on smooth transitions between songs.";
      effectivePrompt = `Generate a DJ transition. Current track: "${currentTrack}". ${previousTrack ? `Previous track: "${previousTrack}".` : ''} ${mood ? `Mood: ${mood}` : ''}`;
    } else {
      // Create system message based on topic if no specific track data
      switch (topic) {
        case "welcome":
          systemMessage += " Introduce yourself with a name you choose, mention it's a great day for music, and invite listeners to enjoy the stream. Keep it brief and enthusiastic.";
          break;
        case "news":
          systemMessage += " Deliver a brief news update with 2-3 current headlines related to music, entertainment or pop culture. Be engaging and conversational.";
          break;
        case "weather":
          systemMessage += " Give a quick weather update for today and tomorrow. Keep it brief and casual like real radio banter.";
          break;
        case "events":
          systemMessage += " Mention 1-2 upcoming events at SoundMaster. These could be live shows, special guests, or listener events.";
          break;
        case "music":
          systemMessage += " Give a quick update about music. Mention a song that just finished or is coming up next. Be enthusiastic.";
          break;
        default:
          systemMessage += " Provide a brief, engaging update for listeners in a conversational tone.";
      }
      
      effectivePrompt = effectivePrompt || "What's new today?";
    }

    // Try Gemini API first
    try {
      console.log("Using Gemini API for AI broadcasting");
      
      const geminiCall = (key: string) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        return fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemMessage}\n\nUser: ${effectivePrompt}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300,
            },
          })
        });
      };
      
      const response = await tryWithMultipleKeys(geminiCall, GOOGLE_API_KEYS);
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract the text from Gemini's response format
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "Sorry, I couldn't generate a proper response right now.";
      
      // Log AI content
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      await supabase.from('ai_content_logs').insert({
        content_type: topic || 'dj',
        content: aiResponse,
        provider: 'gemini'
      });
      
      return new Response(
        JSON.stringify({
          text: aiResponse,
          topic: topic || "general",
          provider: "gemini"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (geminiError) {
      console.error("Gemini API failed, trying OpenRouter:", geminiError);
      
      // Try OpenRouter as backup
      try {
        console.log("Using OpenRouter for AI broadcasting");
        
        const openrouterCall = (key: string) => {
          return fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`,
              'HTTP-Referer': 'https://soundmaster-radio.app',
              'X-Title': 'SoundMaster Radio'
            },
            body: JSON.stringify({
              model: 'mistralai/mistral-7b-instruct',
              messages: [
                {
                  role: 'system',
                  content: systemMessage
                },
                {
                  role: 'user',
                  content: effectivePrompt
                }
              ],
              temperature: 0.7,
              max_tokens: 300
            })
          });
        };
        
        const response = await tryWithMultipleKeys(openrouterCall, OPENROUTER_API_KEYS);
        
        if (!response.ok) {
          throw new Error(`OpenRouter API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract the text from OpenRouter's response format
        const aiResponse = data.choices?.[0]?.message?.content || 
          "Sorry, I couldn't generate a proper response right now.";
        
        // Log AI content
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        await supabase.from('ai_content_logs').insert({
          content_type: topic || 'dj',
          content: aiResponse,
          provider: 'openrouter'
        });
        
        return new Response(
          JSON.stringify({
            text: aiResponse,
            topic: topic || "general",
            provider: "openrouter"
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } catch (openrouterError) {
        console.error("OpenRouter API failed:", openrouterError);
        throw new Error('All AI providers failed');
      }
    }
  } catch (error) {
    console.error("AI Broadcasting error:", error);
    
    // Generate fallback content
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? "morning" : currentHour < 18 ? "afternoon" : "evening";
    
    let fallbackResponse = `Hey there, listeners! Welcome to this beautiful ${timeOfDay} on SoundMaster Radio. We're experiencing some technical difficulties with our AI DJ, but the music keeps playing! Stay tuned for great tracks coming up next.`;
    
    return new Response(
      JSON.stringify({ 
        text: fallbackResponse,
        topic: "general",
        provider: "fallback"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
