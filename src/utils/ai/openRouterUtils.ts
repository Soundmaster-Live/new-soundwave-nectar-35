
// This file is being kept for reference but is no longer used in the application
// We now exclusively use Google Gemini and Cloudflare Workers AI

import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_API_KEYS } from "./apiKeyHelpers";

// This function is deprecated and should not be used
// Use generateGeminiResponse from geminiUtils.ts instead
export const generateOpenRouterResponse = async (
  prompt: string,
  conversationContext: string = "",
  isConnectionTest: boolean = false
) => {
  console.warn('OpenRouter is no longer supported. Using Gemini or Cloudflare Workers AI instead.');
  
  try {
    // For connection test, just do a light validation
    if (isConnectionTest) {
      return { 
        success: false,
        error: 'OpenRouter is no longer supported. Please use Gemini or Cloudflare Workers AI instead.'
      };
    }
    
    // Return fallback message since this service is deprecated
    return {
      type: 'conversation',
      content: "I'm your AI DJ assistant. I'm using Gemini or Cloudflare Workers AI for responses now.",
      success: false,
      error: 'OpenRouter service is deprecated'
    };
  } catch (error) {
    console.error('OpenRouter Response error:', error);
    
    return {
      type: 'conversation',
      content: "I'm your AI DJ assistant. I'm having connection issues right now, but I'll be back online soon. Enjoy the music!",
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const processOpenRouterResponse = async (response: any) => {
  console.warn('OpenRouter is no longer supported. Using Gemini or Cloudflare Workers AI instead.');
  
  // Return a default message directing to use other AI providers
  return "This service has been updated to use Google Gemini or Cloudflare Workers AI. Please refresh your page.";
};
