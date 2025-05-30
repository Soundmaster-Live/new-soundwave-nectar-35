
import { useEffect, useCallback } from 'react';
import { CloudRain, Sun, Calendar, Music, Radio, MessageSquare } from 'lucide-react';
import { BroadcastTopic } from '../types';
import { clearAudioCache } from '@/utils/ai/elevenlabs/ttsApi';
import { useAIProvider } from './useAIProvider';
import { useAudioSettings } from './useAudioSettings';
import { useMessageManagement } from './useMessageManagement';
import { toast } from '@/hooks/use-toast';

/**
 * Main hook for AI broadcaster functionality
 */
export const useBroadcaster = () => {
  const aiProvider = useAIProvider();
  const audioSettings = useAudioSettings();
  
  const messageManagement = useMessageManagement(
    {
      audioEnabled: audioSettings.audioEnabled,
      setIsSpeaking: audioSettings.setIsSpeaking,
      getVoiceName: audioSettings.getVoiceName,
      getUsageMetrics: audioSettings.getUsageMetrics,
      isUserAuthenticated: audioSettings.isUserAuthenticated
    },
    {
      activeProvider: aiProvider.activeProvider,
      setActiveProvider: aiProvider.setActiveProvider,
      isInitializing: aiProvider.isInitializing,
      initializationError: aiProvider.initializationError,
      forceReconnect: aiProvider.forceReconnect
    }
  );

  // Force reconnection if the user interacts with the component
  const resetConnection = useCallback(() => {
    console.log("Resetting AI provider connection...");
    // We need to use the provided method from aiProvider instead of directly setting the state
    aiProvider.forceReconnect();
    clearAudioCache();
    
    toast({
      title: "Reconnecting...",
      description: "Attempting to reconnect to AI service.",
      variant: "default",
    });
  }, [aiProvider]);

  // Always initialize on mount
  useEffect(() => {
    console.log("Initializing AI broadcaster...");
    aiProvider.initializeBroadcaster().then(result => {
      console.log("Broadcaster initialization result:", result);
      if (result.error) {
        toast({
          title: "Connection Issue",
          description: "AI broadcaster encountered an issue during setup. Try reconnecting if needed.",
          variant: "default",
        });
      }
    }).catch(error => {
      console.error("Broadcaster initialization error:", error);
    });
    
    // Add a click handler to retry connection on user interaction
    const handleUserInteraction = () => {
      if (aiProvider.initializationError) {
        console.log("User interaction detected with initialization error, resetting connection");
        resetConnection();
      }
    };
    
    document.addEventListener('click', handleUserInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [aiProvider.initializeBroadcaster, aiProvider.initializationError, resetConnection]);

  // Handle reconnection attempts if initialization fails
  useEffect(() => {
    if (aiProvider.initializationError && aiProvider.connectionAttempts < 3) {
      console.log(`Auto-retrying connection (attempt ${aiProvider.connectionAttempts + 1}/3)...`);
      const timer = setTimeout(() => {
        aiProvider.setConnectionAttempts(prev => prev + 1);
        resetConnection();
      }, 3000); // Reduced from 5000 to make reconnection faster
      
      return () => clearTimeout(timer);
    }
  }, [aiProvider.initializationError, aiProvider.connectionAttempts, resetConnection, aiProvider]);

  const getBroadcastTypeIcon = useCallback((topic: BroadcastTopic) => {
    switch (topic) {
      case 'weather':
        return <CloudRain className="h-3 w-3" />;
      case 'news':
        return <Sun className="h-3 w-3" />;
      case 'events':
        return <Calendar className="h-3 w-3" />;
      case 'music':
        return <Music className="h-3 w-3" />;
      case 'welcome':
        return <Radio className="h-3 w-3" />;
      case 'conversation':
        return <MessageSquare className="h-3 w-3" />;
      default:
        return <Radio className="h-3 w-3" />;
    }
  }, []);

  return {
    // AI provider state
    activeProvider: aiProvider.activeProvider,
    isInitializing: aiProvider.isInitializing,
    initializationError: aiProvider.initializationError,
    forceReconnect: aiProvider.forceReconnect,
    resetConnection,
    
    // Audio settings
    audioEnabled: audioSettings.audioEnabled,
    isSpeaking: audioSettings.isSpeaking,
    showTTSSettings: audioSettings.showTTSSettings,
    setShowTTSSettings: audioSettings.setShowTTSSettings,
    openTTSSettings: audioSettings.openTTSSettings,
    toggleMute: audioSettings.toggleMute,
    isAuthenticated: audioSettings.isAuthenticated as boolean, // Explicitly cast to boolean for type safety
    isUserAuthenticated: audioSettings.isUserAuthenticated,
    
    // Message management
    messages: messageManagement.messages,
    currentTopic: messageManagement.currentTopic,
    isGenerating: messageManagement.isGenerating,
    sendMessage: messageManagement.sendMessage,
    generateBroadcast: messageManagement.generateBroadcast,
    
    // UI helpers
    getBroadcastTypeIcon
  };
};

export default useBroadcaster;
