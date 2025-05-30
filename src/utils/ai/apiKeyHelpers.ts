
import { supabase } from "@/integrations/supabase/client";

// Helper function to get API key from Supabase or fallback to defaults
export const getApiKey = async (keyName: string, fallbackKey?: string | string[]): Promise<string | null> => {
  try {
    // First try localStorage as a quick check (for ElevenLabs keys)
    if (keyName === 'elevenlabs_api_key') {
      const localKey = localStorage.getItem(keyName);
      if (localKey) return localKey;
    }
    
    // Then try Supabase
    const { data: settings, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', keyName)
      .maybeSingle();
    
    if (error) {
      console.warn(`Error fetching API key for ${keyName}:`, error);
    }
    
    if (settings?.value) {
      return settings.value;
    }
    
    // Return fallback key if provided and no key was found in Supabase
    if (Array.isArray(fallbackKey) && fallbackKey.length > 0) {
      return fallbackKey[0]; // Return the first key in the array
    }
    return fallbackKey as string || null;
  } catch (error) {
    console.error(`Failed to get API key for ${keyName}:`, error);
    if (Array.isArray(fallbackKey) && fallbackKey.length > 0) {
      return fallbackKey[0]; // Return the first key in the array
    }
    return fallbackKey as string || null;
  }
};

// Get all API keys for a specific provider
export const getAllApiKeys = async (keyName: string, fallbackKeys?: string[]): Promise<string[]> => {
  try {
    const keys: string[] = [];
    
    // First try Supabase for array of keys
    const { data: settings, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', `${keyName}_ALL`)
      .maybeSingle();
    
    if (settings?.value && Array.isArray(JSON.parse(settings.value))) {
      return JSON.parse(settings.value);
    }
    
    // Try to get single key
    const singleKey = await getApiKey(keyName);
    if (singleKey) {
      keys.push(singleKey);
    }
    
    // Add fallback keys if provided and no keys were found
    if (keys.length === 0 && fallbackKeys && fallbackKeys.length > 0) {
      return fallbackKeys;
    }
    
    return keys.length > 0 ? keys : (fallbackKeys || []);
  } catch (error) {
    console.error(`Failed to get all API keys for ${keyName}:`, error);
    return fallbackKeys || [];
  }
};

// Default working fallback keys for development
// IMPORTANT: In production, these should be replaced with valid keys in Supabase settings
export const DEFAULT_API_KEYS = {
  // Multiple Google API keys for Gemini - ordered by priority
  GOOGLE_API_KEYS: [
    'AIzaSyCXXP_JjQfRPMkSeIBp5Aq1wU5ztK13zRM',
    'AIzaSyCGVeBiY3xgF29dWgjdV2WAE7BtQbAbYoE',
    'AIzaSyCInkT7suD_qNtCe2f3xs0O02f0GQGnJJY',
    'AIzaSyDNbQUc-sLeGngV6rJha3Izvppcb3Ytb3w'
  ],
  // OpenRouter API keys
  OPENROUTER_API_KEYS: [
    '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',
    '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'
  ],
  // Cloudflare Worker URLs - adding multiple options for better reliability
  CLOUDFLARE_WORKER_URLS: [
    'https://ai-chatbot.soundmaster-radio.workers.dev',
    'https://ai-chatbot-soundmaster.workers.dev',
    'https://soundmaster-ai-chatbot.workers.dev'
  ],
  // Hugging Face API key
  HUGGING_FACE_TOKEN: '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'
};

// Interface for provider configuration
interface ProviderConfig {
  provider: string;
  apiKey: string | null;
  model?: string;
  baseUrl?: string;
}

// Get API key with provider preference order and fallback mechanism
export const getAIProvider = async (): Promise<ProviderConfig> => {
  try {
    // Try Gemini first (primary provider)
    const geminiKeys = await getAllApiKeys('GOOGLE_API_KEY', DEFAULT_API_KEYS.GOOGLE_API_KEYS);
    
    if (geminiKeys.length > 0) {
      // Test each Gemini key until we find a working one
      for (const key of geminiKeys) {
        try {
          console.log(`Testing Gemini API key: ${key.substring(0, 10)}...`);
          
          // Simple validation of key format
          if (key && key.length > 20) {
            // Test the Gemini connection with this key
            const testResult = await testGeminiConnection(key);
            if (testResult) {
              console.log("Successfully connected to Gemini API");
              return { 
                provider: 'gemini', 
                apiKey: key,
                model: 'gemini-1.5-flash'
              };
            }
          }
        } catch (error) {
          console.log(`Gemini key ${key.substring(0, 8)}... failed:`, error);
          // Continue to next key
        }
      }
      
      console.log("All Gemini keys failed, trying OpenRouter...");
    }
    
    // Try OpenRouter next
    const openRouterKeys = await getAllApiKeys('OPENROUTER_API_KEY', DEFAULT_API_KEYS.OPENROUTER_API_KEYS);
    
    if (openRouterKeys.length > 0) {
      // Test each OpenRouter key
      for (const key of openRouterKeys) {
        try {
          console.log(`Testing OpenRouter API key: ${key.substring(0, 10)}...`);
          
          // Simple validation of key format
          if (key && key.length > 20) {
            // Test the OpenRouter connection with this key
            const testResult = await testOpenRouterConnection(key);
            if (testResult) {
              console.log("Successfully connected to OpenRouter API");
              return {
                provider: 'openrouter',
                apiKey: key,
                model: 'mistralai/mistral-7b-instruct',
                baseUrl: 'https://openrouter.ai/api/v1/chat/completions'
              };
            }
          }
        } catch (error) {
          console.log(`OpenRouter key ${key.substring(0, 8)}... failed:`, error);
          // Continue to next key
        }
      }
      
      console.log("All OpenRouter keys failed, trying Cloudflare Workers...");
    }
    
    // Try Cloudflare Workers
    const cloudflareUrls = await getAllApiKeys('CLOUDFLARE_WORKER_URL', DEFAULT_API_KEYS.CLOUDFLARE_WORKER_URLS);
    
    if (cloudflareUrls.length > 0) {
      // Test each Cloudflare Worker URL
      for (const url of cloudflareUrls) {
        try {
          console.log(`Testing Cloudflare Worker URL: ${url}`);
          
          // Test the Cloudflare Worker connection
          const testResult = await testCloudflareWorker(url);
          if (testResult) {
            console.log(`Successfully connected to Cloudflare Worker at ${url}`);
            return {
              provider: 'cloudflare',
              apiKey: url,
            };
          } else {
            console.log(`URL ${url} is not available`);
          }
        } catch (error) {
          console.log(`Cloudflare Worker ${url} failed:`, error);
          // Continue to next URL
        }
      }
      
      console.log("All Cloudflare Workers failed, using local fallback");
    }
    
    // If all online providers fail, use local fallback mode
    console.log("All AI providers failed, using local fallback mode");
    return { 
      provider: 'local', 
      apiKey: null
    };
  } catch (error) {
    // Even if we fail, return a fallback to avoid UI breakage
    console.error("Error in getAIProvider:", error);
    return { provider: 'local', apiKey: null };
  }
};

// Test connection to Gemini
const testGeminiConnection = async (apiKey: string): Promise<boolean> => {
  try {
    // Use a minimal request to test if the API key works
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const testResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Test connection"
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 1,
        }
      }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(3000)
    });
    
    return testResponse.ok;
  } catch (error) {
    console.warn("Error testing Gemini connection:", error);
    return false;
  }
};

// Test connection to OpenRouter
const testOpenRouterConnection = async (apiKey: string): Promise<boolean> => {
  try {
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    const testResponse = await fetch(url, {
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
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Test connection'
          }
        ],
        max_tokens: 1
      }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(3000)
    });
    
    return testResponse.ok;
  } catch (error) {
    console.warn("Error testing OpenRouter connection:", error);
    return false;
  }
};

// Test connection to Cloudflare Worker
const testCloudflareWorker = async (url: string): Promise<boolean> => {
  try {
    console.log(`Testing Cloudflare Worker URL: ${url}`);
    const testResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "Test connection",
        isAdmin: false
      }),
      signal: AbortSignal.timeout(2000)
    });
    
    if (!testResponse.ok) {
      console.log(`URL ${url} is not available: ${testResponse.status} ${testResponse.statusText}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.log(`URL ${url} is not available:`, error);
    return false;
  }
};
