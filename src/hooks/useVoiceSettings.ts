
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { getVoiceUsageMetrics, resetVoiceUsageMetrics } from '@/utils/audio/voiceUtils';

// Hook for managing voice settings
export const useVoiceSettings = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceName, setVoiceName] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

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

  // Initialize available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Initialize voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        
        // Set default voice if not already set
        if (!voiceName) {
          const userPrefix = getUserPrefix();
          const savedVoice = localStorage.getItem(`${userPrefix}voice_name`);
          if (savedVoice) {
            setVoiceName(savedVoice);
          } else {
            // Try to find an English voice
            const englishVoice = voices.find(v => v.lang.includes('en'));
            if (englishVoice) {
              setVoiceName(englishVoice.name);
              localStorage.setItem(`${userPrefix}voice_name`, englishVoice.name);
            }
          }
        }
      }
    };
    
    // Load voices
    loadVoices();
    
    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [voiceName]);

  // Get user prefix for storage keys
  const getUserPrefix = useCallback((): string => {
    return userId ? `user_${userId}_` : '';
  }, [userId]);

  // Toggle voice enabled/disabled
  const toggleVoice = useCallback(() => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    const userPrefix = getUserPrefix();
    localStorage.setItem(`${userPrefix}voice_enabled`, newState.toString());
    return newState;
  }, [voiceEnabled, getUserPrefix]);

  // Set voice name
  const setVoice = useCallback((name: string) => {
    setVoiceName(name);
    const userPrefix = getUserPrefix();
    localStorage.setItem(`${userPrefix}voice_name`, name);
  }, [getUserPrefix]);

  // Get usage metrics
  const getUsageMetrics = useCallback(() => {
    const userPrefix = getUserPrefix();
    return getVoiceUsageMetrics(userPrefix);
  }, [getUserPrefix]);

  // Reset usage metrics
  const resetUserMetrics = useCallback(() => {
    const userPrefix = getUserPrefix();
    resetVoiceUsageMetrics(userPrefix);
  }, [getUserPrefix]);

  // Check if user is authenticated
  const isUserAuthenticated = useCallback(async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
  }, []);

  return {
    voiceEnabled,
    voiceName,
    availableVoices,
    toggleVoice,
    setVoice,
    getUsageMetrics,
    resetUsageMetrics: resetUserMetrics,
    isUserAuthenticated
  };
};

export default useVoiceSettings;
