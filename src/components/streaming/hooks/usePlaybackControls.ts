import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { useToast } from "@/hooks/use-toast";

interface PlaybackState {
  isPlaying: boolean;
  isBuffering: boolean;
  lastError: string | null;
}

export const usePlaybackControls = (
  sound: Howl | null,
  isPlaying: boolean,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();
  const playAttemptRef = useRef(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    isBuffering: false,
    lastError: null
  });
  
  // Monitor playback state
  useEffect(() => {
    if (!sound) return;
    
    const handlePlayEvent = () => {
      console.log("Stream playback started (event)");
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: true,
        isBuffering: false,
        lastError: null
      }));
      if (!isPlaying) setIsPlaying(true);
      playAttemptRef.current = false;
    };
    
    const handleStopEvent = () => {
      console.log("Stream playback stopped (event)");
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: false,
        isBuffering: false
      }));
      if (isPlaying) setIsPlaying(false);
    };

    const handleBufferEvent = () => {
      console.log("Stream buffering (event)");
      setPlaybackState(prev => ({
        ...prev,
        isBuffering: true
      }));
    };
    
    // Register the event handlers
    sound.on('play', handlePlayEvent);
    sound.on('stop', handleStopEvent);
    sound.on('pause', handleStopEvent);
    sound.on('end', handleStopEvent);
    sound.on('load', () => {
      setPlaybackState(prev => ({
        ...prev,
        isBuffering: false
      }));
    });
    sound.on('loaderror', (id, error) => {
      setPlaybackState(prev => ({
        ...prev,
        isBuffering: false,
        lastError: error?.message || 'Failed to load stream'
      }));
    });
    
    return () => {
      // Cleanup event listeners
      sound.off('play', handlePlayEvent);
      sound.off('stop', handleStopEvent);
      sound.off('pause', handleStopEvent);
      sound.off('end', handleStopEvent);
      sound.off('load');
      sound.off('loaderror');
    };
  }, [sound, isPlaying, setIsPlaying]);
  
  // Handle playback attempt timeout
  useEffect(() => {
    if (playAttemptRef.current) {
      const timeoutId = setTimeout(() => {
        if (playAttemptRef.current) {
          console.log("Playback attempt timed out, resetting state");
          playAttemptRef.current = false;
          setPlaybackState(prev => ({
            ...prev,
            isBuffering: false,
            lastError: 'Playback attempt timed out'
          }));
        }
      }, 5000); // 5 second timeout for play attempts
      
      return () => clearTimeout(timeoutId);
    }
  }, [playAttemptRef.current]);
  
  const togglePlayback = useCallback(() => {
    if (!sound) return;
    
    if (isPlaying) {
      console.log("Pausing stream playback");
      sound.pause(); // Use pause instead of stop for streams
      setIsPlaying(false);
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: false
      }));
    } else {
      console.log("Starting stream playback");
      if (sound.state() === 'unloaded') {
        sound.load();
      }
      sound.play();
      playAttemptRef.current = true;
      setPlaybackState(prev => ({
        ...prev,
        isBuffering: true
      }));
      
      toast({
        title: "Radio Stream Started",
        description: "Enjoy the music! 🎵",
      });
    }
  }, [sound, isPlaying, setIsPlaying, toast]);

  const play = useCallback(() => {
    if (!sound || isPlaying) return;
    console.log("Playing stream");
    if (sound.state() === 'unloaded') {
      sound.load();
    }
    sound.play();
    playAttemptRef.current = true;
    setPlaybackState(prev => ({
      ...prev,
      isBuffering: true
    }));
    
    toast({
      title: "Radio Stream Started",
      description: "Enjoy the music! 🎵",
    });
  }, [sound, isPlaying, toast]);

  const pause = useCallback(() => {
    if (!sound || !isPlaying) return;
    console.log("Pausing stream");
    sound.pause(); // Use pause instead of stop for streams
    setIsPlaying(false);
    setPlaybackState(prev => ({
      ...prev,
      isPlaying: false
    }));
  }, [sound, isPlaying, setIsPlaying]);

  return { 
    togglePlayback, 
    play, 
    pause,
    playbackState
  };
};
