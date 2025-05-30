import { useCallback, useState, useEffect } from "react";
import { Howl } from "howler";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";

const MAX_RETRIES = 5;
const INITIAL_BACKOFF = 1000; // 1 second
const MAX_BACKOFF = 30000; // 30 seconds

export const useAudioStreamError = (
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  setIsBuffering: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  // Reset retry count when component unmounts
  useEffect(() => {
    return () => {
      setRetryCount(0);
      setLastError(null);
    };
  }, []);

  const calculateBackoff = (attempt: number): number => {
    const backoff = Math.min(INITIAL_BACKOFF * Math.pow(2, attempt), MAX_BACKOFF);
    return backoff + Math.random() * 1000; // Add jitter
  };

  const handleStreamError = useCallback((error: any) => {
    const errorMessage = error?.message || 'Unknown stream error';
    setLastError(errorMessage);
    
    if (retryCount < MAX_RETRIES) {
      const backoffTime = calculateBackoff(retryCount);
      setRetryCount(prev => prev + 1);
      
      console.log(`Retrying stream load (${retryCount + 1}/${MAX_RETRIES}) in ${backoffTime}ms...`);
      
      toast({
        title: "Stream Error",
        description: `Connection issue detected. Retrying in ${Math.round(backoffTime/1000)} seconds...`,
        variant: "default",
      });

      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, backoffTime);
      });
    } else {
      // Show final error to all users
      toast({
        title: "Stream Error",
        description: "Unable to connect to the radio stream. Please check your internet connection and try again later.",
        variant: "destructive",
      });
      
      setIsPlaying(false);
      setIsBuffering(false);
      setRetryCount(0);
      return Promise.resolve(false);
    }
  }, [retryCount, toast, setIsPlaying, setIsBuffering]);

  const handlePlaybackError = useCallback((error: any) => {
    const errorMessage = error?.message || 'Unknown playback error';
    setLastError(errorMessage);
    
    if (retryCount < MAX_RETRIES) {
      const backoffTime = calculateBackoff(retryCount);
      setRetryCount(prev => prev + 1);
      
      console.log(`Retrying stream playback (${retryCount + 1}/${MAX_RETRIES}) in ${backoffTime}ms...`);
      
      toast({
        title: "Playback Error",
        description: `Playback issue detected. Retrying in ${Math.round(backoffTime/1000)} seconds...`,
        variant: "default",
      });

      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, backoffTime);
      });
    } else {
      // Show final error to all users
      toast({
        title: "Playback Error",
        description: "Unable to play the radio stream. Please try refreshing the page.",
        variant: "destructive",
      });
      
      setIsPlaying(false);
      setIsBuffering(false);
      setRetryCount(0);
      return Promise.resolve(false);
    }
  }, [retryCount, toast, setIsPlaying, setIsBuffering]);

  const resetErrorState = useCallback(() => {
    setRetryCount(0);
    setLastError(null);
  }, []);

  return {
    handleStreamError,
    handlePlaybackError,
    resetErrorState,
    retryCount,
    lastError,
    isRetrying: retryCount > 0
  };
};
