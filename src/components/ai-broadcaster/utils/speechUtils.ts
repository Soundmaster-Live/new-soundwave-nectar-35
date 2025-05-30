
import { generateSpeech } from '@/utils/audio/voiceUtils';
import { toast } from '@/hooks/use-toast';

/**
 * Handles speech generation and playback
 */
export const playSpeech = async (
  text: string, 
  audioEnabled: boolean, 
  getVoiceName: () => string | null,
  getUsageMetrics: () => { dailyCharCount: number; dailyRequestCount: number },
  isUserAuthenticated: boolean = false
): Promise<boolean> => {
  if (!audioEnabled) return false;
  
  // Check if user is authenticated (if required)
  if (!isUserAuthenticated) {
    console.log("User not authenticated for voice");
    // Only show toast if they actually try to use voice
    toast({
      title: "Authentication Required",
      description: "Please log in to use voice features.",
      variant: "default",
    });
    return false;
  }
  
  const voiceName = getVoiceName();
  if (!voiceName) {
    console.log("No voice selected");
    return false;
  }
  
  const metrics = getUsageMetrics();
  const MAX_DAILY_CHAR_LIMIT = 1000;
  const MAX_DAILY_REQUESTS = 10;
  
  if (metrics.dailyCharCount >= MAX_DAILY_CHAR_LIMIT || metrics.dailyRequestCount >= MAX_DAILY_REQUESTS) {
    toast({
      title: "Daily Voice Limit Reached",
      description: "Voice has been disabled for today. You can still see text responses.",
      variant: "default",
    });
    return false;
  }
  
  try {
    const characterLimit = parseInt(localStorage.getItem('voice_character_limit') || '100');
    console.log(`Generating speech for text (limit: ${characterLimit} chars)`);
    
    // Use browser's built-in speech synthesis
    const success = await generateSpeech(text, { 
      voice: voiceName, 
      rate: 1.0,
      pitch: 1.0
    });
    
    return success;
  } catch (error) {
    console.error("Speech playback error:", error);
    toast({
      title: "Speech Error",
      description: "Failed to generate or play speech. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};
