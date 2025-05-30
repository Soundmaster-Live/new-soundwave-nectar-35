
import { useCallback } from 'react';
import { playSpeech } from '../utils/speechUtils';

interface AudioSettingsState {
  audioEnabled: boolean;
  setIsSpeaking: (isSpeaking: boolean) => void;
  getVoiceName: () => string | null;
  getUsageMetrics: () => { dailyCharCount: number; dailyRequestCount: number };
  isUserAuthenticated: () => Promise<boolean>;
}

/**
 * Hook for handling text-to-speech playback
 */
export const useSpeechPlayback = (audioSettings: AudioSettingsState) => {
  // Play speech using TTS
  const playTextToSpeech = useCallback(async (text: string): Promise<void> => {
    if (!audioSettings.audioEnabled) return;
    
    try {
      audioSettings.setIsSpeaking(true);
      
      await playSpeech(
        text,
        audioSettings.audioEnabled,
        audioSettings.getVoiceName,
        audioSettings.getUsageMetrics,
        await audioSettings.isUserAuthenticated()
      );
      
      audioSettings.setIsSpeaking(false);
    } catch (error) {
      console.error('Error playing speech:', error);
      audioSettings.setIsSpeaking(false);
    }
  }, [
    audioSettings.audioEnabled,
    audioSettings.setIsSpeaking,
    audioSettings.getVoiceName,
    audioSettings.getUsageMetrics,
    audioSettings.isUserAuthenticated
  ]);

  return { playTextToSpeech };
};

export default useSpeechPlayback;
