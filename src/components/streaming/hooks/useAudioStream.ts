
import { useState, useEffect, useCallback, useRef } from "react";
import { Howl } from "howler";
import { useToast } from "@/hooks/use-toast";
import { useStreamMetadata } from "./useStreamMetadata";
import { useAudioStreamError } from "./useAudioStreamError";
import { useStreamInitializer } from "./useStreamInitializer";
import { useStreamFallback } from "./useStreamFallback";
import { useAudioQuality, AudioQuality } from "./useAudioQuality";
import { StreamMetadata } from "../types";
import { usePlaybackControls } from "./usePlaybackControls";
import { useVolumeControls } from "./useVolumeControls";

// Use 'export type' for re-exporting types to fix the isolatedModules error
export type { StreamMetadata } from "../types";
export type { AudioQuality, AudioFormat } from "./useAudioQuality";

// Updated stream URLs to use HTTPS and reliable sources
const DEFAULT_STREAM_URL = "https://stream.radioparadise.com/mp3-128";
const STREAM_URLS = {
  PRIMARY: "https://stream.radioparadise.com/aac-128",
  FALLBACK1: "https://stream.radioparadise.com/mp3-128",
  FALLBACK2: "https://ice1.somafm.com/groovesalad-128-mp3"
};

export const useAudioStream = (streamUrl: string = DEFAULT_STREAM_URL, defaultVolume: number = 0.7) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);
  const [currentStreamUrl, setCurrentStreamUrl] = useState(streamUrl);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Use a ref for the sound instance to prevent useEffect dependency issues
  const soundRef = useRef<Howl | null>(null);
  
  // Memoize the streamUrl to prevent unnecessary re-renders
  const memoizedStreamUrl = useRef(streamUrl);
  
  useEffect(() => {
    // Only update if the streamUrl has actually changed
    if (memoizedStreamUrl.current !== streamUrl) {
      memoizedStreamUrl.current = streamUrl;
      setCurrentStreamUrl(streamUrl);
    }
  }, [streamUrl]);
  
  const { streamMetadata, updateStreamMetadata } = useStreamMetadata(isPlaying);
  const { handleStreamError, handlePlaybackError } = useAudioStreamError(setIsPlaying, setIsBuffering);
  
  // Use the dedicated fallback hook
  const { 
    fallbackIndex, 
    tryFallbackStream, 
    restorePrimaryStream,
    fallbackUrls,
    isUsingFallback
  } = useStreamFallback(
    setCurrentStreamUrl,
    currentStreamUrl,
    STREAM_URLS // Pass the stream URLs as a constant
  );
  
  // Use the audio quality hook
  const { 
    quality, 
    format, 
    bitrate, 
    changeQuality, 
    changeFormat 
  } = useAudioQuality();
  
  // Initialize stream with the new hook
  useStreamInitializer(
    currentStreamUrl,
    defaultVolume,
    soundRef,
    setSound,
    setIsPlaying,
    setIsBuffering,
    handleStreamError,
    handlePlaybackError,
    updateStreamMetadata,
    tryFallbackStream,
    format
  );

  // Create the playback and volume control hooks
  const playbackControls = usePlaybackControls(sound, isPlaying, setIsPlaying);
  const volumeControls = useVolumeControls(sound, volume, setVolume, isMuted, setIsMuted);
  
  // Add a function to switch to a specific stream
  const switchToStream = useCallback((newStreamUrl: string) => {
    console.log(`Switching to stream: ${newStreamUrl}`);
    setIsInitializing(true);
    
    // Stop the current stream if it exists
    if (soundRef.current) {
      soundRef.current.unload();
    }
    
    // Update the current stream URL
    setCurrentStreamUrl(newStreamUrl);
    memoizedStreamUrl.current = newStreamUrl;
    
    // Reset initialization state after a delay
    setTimeout(() => {
      setIsInitializing(false);
    }, 1000);
    
    return true;
  }, []);
  
  return {
    // Playback state
    isPlaying,
    setIsPlaying,
    
    // Volume controls
    volume,
    isMuted,
    handleVolumeChange: volumeControls.handleVolumeChange,
    changeVolume: volumeControls.changeVolume,
    toggleMute: volumeControls.toggleMute,
    
    // Playback controls
    togglePlayback: playbackControls.togglePlayback,
    play: playbackControls.play,
    pause: playbackControls.pause,
    
    // Stream info
    streamMetadata,
    isBuffering,
    currentStreamUrl,
    setCurrentStreamUrl,
    
    // Fallback handling
    tryFallbackStream,
    fallbackIndex,
    restorePrimaryStream,
    isUsingFallback,
    
    // Quality settings
    quality,
    format,
    bitrate,
    changeQuality,
    changeFormat,
    
    // Stream switching
    switchToStream,
    isInitializing
  };
};
