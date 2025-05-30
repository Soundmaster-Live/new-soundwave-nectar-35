
import { getTTSUsageMetrics, resetUsageMetrics } from './usageMetrics';
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from 'react';

// Hook for managing TTS settings
export const useTTSSettings = () => {
  const [userId, setUserId] = useState<string | null>(null);

  // Get the current user ID when the hook is initialized
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  // Get user prefix for storage keys
  const getUserPrefix = (): string => {
    return userId ? `user_${userId}_` : '';
  };

  // Get saved ElevenLabs API key from localStorage
  const getApiKey = (): string => {
    const userPrefix = getUserPrefix();
    return localStorage.getItem(`${userPrefix}elevenlabs_api_key`) || '';
  };

  // Save ElevenLabs API key to localStorage
  const saveApiKey = (apiKey: string): void => {
    const userPrefix = getUserPrefix();
    localStorage.setItem(`${userPrefix}elevenlabs_api_key`, apiKey);
  };

  // Get saved voice ID from localStorage
  const getVoiceId = (): string => {
    const userPrefix = getUserPrefix();
    return localStorage.getItem(`${userPrefix}elevenlabs_voice_id`) || 'CwhRBWXzGAHq8TQ4Fs17'; // Default to Roger
  };

  // Save voice ID to localStorage
  const saveVoiceId = (voiceId: string): void => {
    const userPrefix = getUserPrefix();
    localStorage.setItem(`${userPrefix}elevenlabs_voice_id`, voiceId);
  };

  // Get character limit from localStorage
  const getCharacterLimit = (): number => {
    const userPrefix = getUserPrefix();
    return parseInt(localStorage.getItem(`${userPrefix}elevenlabs_character_limit`) || '100');
  };

  // Save character limit to localStorage
  const saveCharacterLimit = (limit: number): void => {
    const userPrefix = getUserPrefix();
    localStorage.setItem(`${userPrefix}elevenlabs_character_limit`, limit.toString());
  };

  // Get usage metrics
  const getUsageMetrics = () => {
    const userPrefix = getUserPrefix();
    return getTTSUsageMetrics(userPrefix);
  };

  // Reset usage metrics
  const resetUserMetrics = () => {
    const userPrefix = getUserPrefix();
    resetUsageMetrics(userPrefix);
  };

  // Check if user is authenticated
  const isUserAuthenticated = async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
  };

  return {
    getApiKey,
    saveApiKey,
    getVoiceId,
    saveVoiceId,
    getCharacterLimit,
    saveCharacterLimit,
    getUsageMetrics,
    resetUsageMetrics: resetUserMetrics,
    isUserAuthenticated
  };
};
