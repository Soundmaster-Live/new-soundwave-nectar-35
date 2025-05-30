
import { updateTTSUsageMetrics } from './usageMetrics';
import { toast } from '@/components/ui/use-toast';

export interface TTSOptions {
  apiKey: string;
  voiceId?: string;
  modelId?: string;
  characterLimit?: number;
}

// Cache for storing generated audio to prevent duplicate API calls
let cachedAudio: Map<string, ArrayBuffer> = new Map();

/**
 * Validates API key format without making an actual API call
 */
const validateApiKey = (apiKey: string | null): boolean => {
  // Simple format validation to avoid unnecessary API calls
  return !!apiKey && typeof apiKey === 'string' && apiKey.length > 10;
};

/**
 * Generates text-to-speech audio using ElevenLabs API with credit-saving features
 */
export const generateSpeech = async (
  text: string, 
  options: TTSOptions
): Promise<ArrayBuffer | null> => {
  if (!text.trim()) {
    console.error('Missing text for TTS');
    return null;
  }

  // If no API key is provided, silently return null without showing errors
  if (!validateApiKey(options.apiKey)) {
    console.log('No valid ElevenLabs API key provided, skipping TTS generation');
    return null;
  }

  try {
    // Default values if not provided
    const voiceId = options.voiceId || 'CwhRBWXzGAHq8TQ4Fs17'; // Roger voice
    const modelId = options.modelId || 'eleven_monolingual_v1';
    
    // Apply character limit if provided (default to 100 for short responses)
    const characterLimit = options.characterLimit || 100;
    const trimmedText = text.length > characterLimit 
      ? text.substring(0, characterLimit) + "..." 
      : text;
    
    // Generate cache key based on text and voice
    const cacheKey = `${trimmedText}_${voiceId}`;
    
    // Check if we already have this audio cached
    if (cachedAudio.has(cacheKey)) {
      console.log('Using cached audio to save API credits');
      return cachedAudio.get(cacheKey) as ArrayBuffer;
    }
    
    // Check usage metrics before making API call
    if (!updateTTSUsageMetrics(trimmedText.length)) {
      // Return null if we've hit the usage limit
      return null;
    }
    
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': options.apiKey
      },
      body: JSON.stringify({
        text: trimmedText,
        model_id: modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', errorText);
      
      // Only show toast for non-auth errors to avoid spamming user
      if (!errorText.includes('invalid_api_key')) {
        toast({
          title: "Text-to-Speech Error",
          description: "Could not generate speech. Please try again later.",
          variant: "destructive",
        });
      }
      
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const audioData = await response.arrayBuffer();
    
    // Cache the audio for future use
    cachedAudio.set(cacheKey, audioData);
    
    // Limit cache size to prevent memory issues
    if (cachedAudio.size > 20) {
      const oldestKey = cachedAudio.keys().next().value;
      cachedAudio.delete(oldestKey);
    }
    
    return audioData;
  } catch (error) {
    console.error('Error generating speech:', error);
    return null;
  }
};

/**
 * Plays TTS audio from ArrayBuffer
 */
export const playTTSAudio = (audioData: ArrayBuffer): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      
      audio.onerror = (error) => {
        URL.revokeObjectURL(url);
        reject(error);
      };
      
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        reject(error);
      });
      
    } catch (error) {
      console.error('Error setting up audio playback:', error);
      reject(error);
    }
  });
};

export const clearAudioCache = () => {
  cachedAudio.clear();
};
