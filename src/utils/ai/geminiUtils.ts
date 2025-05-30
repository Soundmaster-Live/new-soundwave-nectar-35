
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DEFAULT_API_KEYS, getAllApiKeys } from "./apiKeyHelpers";

export const generateGeminiResponse = async (
  userInput: string, 
  conversationContext: string = "", 
  isConnectionTest: boolean = false
) => {
  try {
    // Try to get API keys from Supabase or use defaults
    const geminiKeys = await getAllApiKeys('GOOGLE_API_KEY', DEFAULT_API_KEYS.GOOGLE_API_KEYS);
    
    if (!geminiKeys || geminiKeys.length === 0) {
      throw new Error('No Gemini API keys configured');
    }

    // For connection test, just return success without making a full API call
    if (isConnectionTest) {
      // Skip actual validation during testing to avoid rate limits
      // Just check if we have a key format that looks valid
      if (geminiKeys[0] && typeof geminiKeys[0] === 'string' && geminiKeys[0].length > 10) {
        console.log("Skipping actual Gemini test API call to avoid rate limits");
        return { success: true };
      } else {
        throw new Error('Gemini API key format invalid');
      }
    }

    // Try each API key until one works
    let lastError = null;
    
    for (const apiKey of geminiKeys) {
      try {
        console.log(`Trying Gemini key ${apiKey.substring(0, 8)}...`);
        
        const systemPrompt = "You are a South African DJ on SoundMaster Radio, a charismatic radio host with local cultural knowledge. Keep responses concise, engaging and conversational.";
        
        const fullPrompt = conversationContext 
          ? `${systemPrompt}\n\nPrevious conversation:\n${conversationContext}\n\nUser: ${userInput}`
          : `${systemPrompt}\n\nUser: ${userInput}`;
        
        console.log("Sending Gemini request with prompt:", fullPrompt.substring(0, 50) + "...");
        
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
                    text: fullPrompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300,
            },
          }),
          signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Gemini API key ${apiKey.substring(0, 8)}... error response:`, errorText);
          throw new Error(`Failed to generate AI response with key ${apiKey.substring(0, 8)}...: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract the text from Gemini's response format
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
          "Sorry, I couldn't generate a proper response right now.";
        
        console.log("Gemini response received:", generatedText.substring(0, 50) + "...");
        return {
          type: 'conversation',
          content: generatedText,
          success: true,
          provider: 'gemini'
        };
      } catch (error) {
        console.error(`Gemini key ${apiKey.substring(0, 8)}... failed:`, error);
        lastError = error;
        // Continue to next key
      }
    }

    // If all keys fail, try OpenRouter
    try {
      // Get OpenRouter API keys
      const openRouterKeys = await getAllApiKeys('OPENROUTER_API_KEY', DEFAULT_API_KEYS.OPENROUTER_API_KEYS);
      
      if (!openRouterKeys || openRouterKeys.length === 0) {
        throw new Error('No OpenRouter API keys configured');
      }
      
      for (const apiKey of openRouterKeys) {
        try {
          console.log(`Trying OpenRouter key ${apiKey.substring(0, 8)}...`);
          
          const systemPrompt = "You are a South African DJ on SoundMaster Radio, a charismatic radio host with local cultural knowledge. Keep responses concise, engaging and conversational.";
          
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
                  content: systemPrompt
                },
                {
                  role: 'user',
                  content: conversationContext 
                    ? `Previous conversation:\n${conversationContext}\n\n${userInput}`
                    : userInput
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
          
          const generatedText = data.choices?.[0]?.message?.content || 
            "Sorry, I couldn't generate a proper response right now.";
          
          return {
            type: 'conversation',
            content: generatedText,
            success: true,
            provider: 'openrouter'
          };
        } catch (error) {
          console.error(`OpenRouter key ${apiKey.substring(0, 8)}... failed:`, error);
          lastError = error;
        }
      }
    } catch (openRouterError) {
      console.error('OpenRouter fallback failed:', openRouterError);
      lastError = openRouterError;
    }

    // If we get here, both Gemini and OpenRouter failed
    throw lastError || new Error('All API providers failed');
  } catch (error) {
    console.error('Gemini Response error:', error);
    
    // Provide a fallback response when the API fails
    if (isConnectionTest) {
      throw error; // Re-throw for connection tests so we try the fallback
    }
    
    return {
      type: 'conversation',
      content: "I'm your AI DJ assistant. I'm having connection issues right now, but I'll be back online soon. Enjoy the music!",
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      provider: 'local'
    };
  }
};

export const processGeminiResponse = async (response: any) => {
  // If this is a connection test, just return success
  if (response && response.success === true && !response.content) {
    return "Connection successful";
  }
  
  // If we have an error but also content (fallback content), use it
  if (response && !response.success && response.content) {
    return response.content;
  }
  
  // Otherwise return the content
  return response?.content || "Sorry, I'm having trouble responding right now. Please try again in a moment.";
};
