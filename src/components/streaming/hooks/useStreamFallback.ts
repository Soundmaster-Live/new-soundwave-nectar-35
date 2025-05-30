
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Default fallback URLs if none are provided
const DEFAULT_FALLBACK_STREAM_URLS = {
  PRIMARY: "https://stream.radioparadise.com/aac-128",
  FALLBACK1: "https://stream.radioparadise.com/mp3-128",
  FALLBACK2: "https://ice1.somafm.com/groovesalad-128-mp3"
};

export const useStreamFallback = (
  setCurrentStreamUrl: React.Dispatch<React.SetStateAction<string>>,
  currentStreamUrl: string,
  streamUrls = DEFAULT_FALLBACK_STREAM_URLS
) => {
  const [fallbackIndex, setFallbackIndex] = useState(-1); // -1 means using primary URL
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const { toast } = useToast();

  // Get an array of fallback URLs from the provided object
  const fallbackUrls = Object.values(streamUrls).filter(url => url !== streamUrls.PRIMARY);

  // Automatic retry with primary stream after some time
  useEffect(() => {
    if (fallbackIndex >= 0) {
      const RETRY_PRIMARY_AFTER = 5 * 60 * 1000; // 5 minutes
      const retryTimer = setTimeout(() => {
        console.log("Attempting to retry primary stream after timeout");
        restorePrimaryStream();
      }, RETRY_PRIMARY_AFTER);
      
      return () => clearTimeout(retryTimer);
    }
  }, [fallbackIndex]);

  // Restore to primary stream
  const restorePrimaryStream = useCallback(() => {
    if (fallbackIndex >= 0) {
      console.log("Restoring primary stream");
      setFallbackIndex(-1);
      setCurrentStreamUrl(streamUrls.PRIMARY);
      
      toast({
        title: "Reconnecting to Primary Stream",
        description: "Attempting to connect to the primary stream again.",
        variant: "default",
      });
    }
  }, [fallbackIndex, streamUrls.PRIMARY, setCurrentStreamUrl, toast]);

  // Try fallback URL when primary fails
  const tryFallbackStream = useCallback(() => {
    // Prevent rapid fallback attempts
    const now = Date.now();
    if (now - lastAttemptTime < 5000) {
      console.log("Ignoring fallback attempt - too soon after last attempt");
      return false;
    }
    setLastAttemptTime(now);
    
    const nextIndex = fallbackIndex + 1;
    if (nextIndex < fallbackUrls.length) {
      setFallbackIndex(nextIndex);
      const fallbackUrl = fallbackUrls[nextIndex];
      console.log(`Primary stream failed, trying fallback #${nextIndex+1}: ${fallbackUrl}`);
      setCurrentStreamUrl(fallbackUrl);
      toast({
        title: "Stream Connection Issue",
        description: "Primary stream unavailable. Trying alternative source...",
        variant: "default",
      });
      return true;
    }
    
    // If we've exhausted all fallbacks, try the primary again
    if (nextIndex >= fallbackUrls.length) {
      console.log("All fallbacks exhausted, returning to primary stream");
      setFallbackIndex(-1); // Reset to primary
      setCurrentStreamUrl(streamUrls.PRIMARY);
      toast({
        title: "Reconnecting to Primary Stream",
        description: "All fallbacks exhausted. Attempting primary stream again.",
        variant: "default",
      });
    }
    
    return false;
  }, [fallbackIndex, lastAttemptTime, fallbackUrls, streamUrls.PRIMARY, toast, setCurrentStreamUrl]);

  return {
    fallbackIndex,
    tryFallbackStream,
    restorePrimaryStream,
    fallbackUrls,
    isUsingFallback: fallbackIndex >= 0
  };
};
