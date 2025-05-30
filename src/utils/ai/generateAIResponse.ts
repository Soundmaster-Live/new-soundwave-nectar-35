
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { getAIProvider, DEFAULT_API_KEYS } from "./apiKeyHelpers";

export const generateAIResponse = async (topic: string): Promise<any> => {
  try {
    console.log("Getting AI provider configuration");
    const providerConfig = await getAIProvider();
    const provider = providerConfig.provider;
    const apiKey = providerConfig.apiKey;

    // Check if we should use Gemini
    if (provider === 'gemini' && apiKey) {
      console.log("Sending request to Google Gemini...");
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are DJ John, a charismatic South African radio host and sound expert. Keep responses short, engaging, and fun - like a real radio DJ. Include emojis and sound-related terms.\n\nUser: Tell me about ${topic} in an entertaining radio DJ style.`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300,
            }
          }),
          signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
          console.error(`Google Gemini API error: ${response.status}`, await response.text());
          throw new Error(`Google Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        return {
          text: data.candidates?.[0]?.content?.parts?.[0]?.text || 
            "Sorry, I couldn't generate a proper response right now.",
          type: 'conversation',
          provider: 'gemini'
        };
      } catch (error) {
        console.error("Gemini failed, trying OpenRouter:", error);
        
        // Try OpenRouter as fallback for Gemini
        try {
          // When falling back, we'll implement our own OpenRouter call
          // rather than checking provider type which is already 'gemini'
          if (apiKey) {
            // Try to get an OpenRouter API key
            const { data: openRouterSettings } = await supabase
              .from('settings')
              .select('value')
              .eq('key', 'OPENROUTER_API_KEY')
              .maybeSingle();
            
            const openRouterKey = openRouterSettings?.value || 
              (DEFAULT_API_KEYS && DEFAULT_API_KEYS.OPENROUTER_API_KEYS 
                ? DEFAULT_API_KEYS.OPENROUTER_API_KEYS[0] 
                : null);
            
            if (openRouterKey) {
              console.log("Using OpenRouter as fallback...");
              
              const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${openRouterKey}`,
                  'HTTP-Referer': window.location.origin,
                  'X-Title': 'SoundMaster Radio'
                },
                body: JSON.stringify({
                  model: 'mistralai/mistral-7b-instruct',
                  messages: [
                    {
                      role: 'system',
                      content: "You are DJ John, a charismatic South African radio host and sound expert. Keep responses short, engaging, and fun - like a real radio DJ. Include emojis and sound-related terms."
                    },
                    {
                      role: 'user',
                      content: `Tell me about ${topic} in an entertaining radio DJ style.`
                    }
                  ],
                  temperature: 0.7,
                  max_tokens: 300
                }),
                signal: AbortSignal.timeout(5000)
              });
              
              if (!response.ok) {
                throw new Error(`OpenRouter API error: ${response.status}`);
              }
              
              const data = await response.json();
              return {
                text: data.choices?.[0]?.message?.content || 
                  "Sorry, I couldn't generate a proper response right now.",
                type: 'conversation',
                provider: 'openrouter'
              };
            }
          }
        } catch (openrouterError) {
          console.error("OpenRouter failed, trying Cloudflare:", openrouterError);
          throw error; // Let it continue to Cloudflare fallback
        }
      }
    }
    
    // Use OpenRouter as primary fallback
    if (provider === 'openrouter' && apiKey) {
      console.log("Using OpenRouter for AI generation...");
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'SoundMaster Radio'
          },
          body: JSON.stringify({
            model: 'mistralai/mistral-7b-instruct',
            messages: [
              {
                role: 'system',
                content: "You are DJ John, a charismatic South African radio host and sound expert. Keep responses short, engaging, and fun - like a real radio DJ. Include emojis and sound-related terms."
              },
              {
                role: 'user',
                content: `Tell me about ${topic} in an entertaining radio DJ style.`
              }
            ],
            temperature: 0.7,
            max_tokens: 300
          }),
          signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) {
          throw new Error(`OpenRouter API error: ${response.status}`);
        }
        
        const data = await response.json();
        return {
          text: data.choices?.[0]?.message?.content || 
            "Sorry, I couldn't generate a proper response right now.",
          type: 'conversation',
          provider: 'openrouter'
        };
      } catch (error) {
        console.error("OpenRouter failed, falling back to Cloudflare:", error);
        // Continue to Cloudflare
      }
    }
    
    // Use Cloudflare Worker as second fallback
    if (provider === 'cloudflare' && apiKey) {
      console.log("Using Cloudflare Worker for AI generation...");
      
      try {
        const response = await fetch(apiKey as string, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Tell me about ${topic} in an entertaining radio DJ style.`,
            isAdmin: false
          }),
          signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) {
          throw new Error(`Cloudflare Worker error: ${response.status}`);
        }
        
        const data = await response.json();
        return {
          text: data.response || "Sorry, I couldn't generate a proper response right now.",
          type: 'conversation',
          provider: 'cloudflare'
        };
      } catch (error) {
        console.error("Cloudflare Worker failed:", error);
        // Fall back to local
      }
    }
    
    // Final fallback - generate response locally
    console.log("All AI providers failed, using local response");
    const timeOfDay = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening";
    return {
      text: `Hey there! 🎧 DJ Max coming to you on this beautiful ${timeOfDay}! Let me tell you about ${topic}... Well, I'd love to give you all the details, but my internet connection is a bit spotty right now! Keep those good vibes flowing and I'll be back with more info soon! 🎵`,
      type: 'conversation',
      provider: 'local'
    };
  } catch (error) {
    console.error('AI Response error:', error);
    
    // Provide a helpful fallback response
    const fallbackResponse = {
      text: `Hey there! 🎧 I'm your AI DJ, but I'm having a bit of technical trouble right now. Let me tell you about ${topic} when I'm back online! Keep the music playing! 🎵`,
      type: 'conversation',
      provider: 'local'
    };
    
    toast({
      title: "Connection Issue",
      description: "Couldn't connect to our AI DJ right now. Please try again later!",
      variant: "destructive",
    });
    
    return fallbackResponse;
  }
};

export const processAIResponse = (response: any) => {
  return response?.text || "Sorry, I'm having trouble responding right now. Please try again in a moment.";
};
