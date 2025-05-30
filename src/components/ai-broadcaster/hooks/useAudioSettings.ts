
import { useState, useCallback, useEffect } from 'react';
import { useVoiceSettings } from '@/hooks/useVoiceSettings';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

/**
 * Hook for managing audio settings and state
 */
export const useAudioSettings = () => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTTSSettings, setShowTTSSettings] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Explicitly typed as boolean
  
  const navigate = useNavigate();
  const voiceSettings = useVoiceSettings();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await voiceSettings.isUserAuthenticated();
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [voiceSettings]);

  // Get voice name from voice settings
  const getVoiceName = useCallback(() => {
    return voiceSettings.voiceName;
  }, [voiceSettings]);

  // Get usage metrics from voice settings
  const getUsageMetrics = useCallback(() => {
    return voiceSettings.getUsageMetrics();
  }, [voiceSettings]);

  // Toggle mute state
  const toggleMute = useCallback(() => {
    setAudioEnabled(prev => !prev);
    
    toast({
      title: audioEnabled ? "Voice Muted" : "Voice Unmuted",
      description: audioEnabled ? "AI DJ voice is now muted." : "AI DJ voice is now unmuted.",
      variant: "default",
    });
  }, [audioEnabled]);

  // Open voice settings dialog
  const openTTSSettings = useCallback(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to configure voice settings.",
        variant: "default",
      });
      
      // Delay navigation to allow toast to be seen
      setTimeout(() => {
        navigate('/auth');
      }, 1500);
      
      return;
    }
    
    setShowTTSSettings(true);
  }, [isAuthenticated, navigate]);

  // Check if user is authenticated
  const isUserAuthenticated = useCallback(async () => {
    return await voiceSettings.isUserAuthenticated();
  }, [voiceSettings]);

  return {
    audioEnabled,
    isSpeaking,
    showTTSSettings,
    isAuthenticated, // This is explicitly a boolean
    setAudioEnabled,
    setIsSpeaking,
    setShowTTSSettings,
    toggleMute,
    openTTSSettings,
    getVoiceName,
    getUsageMetrics,
    isUserAuthenticated
  };
};

export default useAudioSettings;
