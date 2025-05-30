import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { StreamMetadata } from '../../../types/stream';

const detectFormat = (url: string): string[] => {
  if (url.includes('.aac')) return ['aac'];
  if (url.includes('.mp3')) return ['mp3'];
  return ['mp3', 'aac']; // Try both formats
};

/**
 * Hook to handle stream initialization
 */
export const useStreamInitializer = (
  currentStreamUrl: string,
  defaultVolume: number,
  soundRef: React.MutableRefObject<Howl | null>,
  setSound: (sound: Howl) => void,
  setIsPlaying: (isPlaying: boolean) => void,
  setIsBuffering: (isBuffering: boolean) => void,
  handleStreamError: (error: any) => void,
  handlePlaybackError: (error: any) => void,
  updateStreamMetadata: (metadata: StreamMetadata) => void,
  tryFallbackStream: () => void,
  format: string
) => {
  useEffect(() => {
    const initializeStream = () => {
      setIsBuffering(true);

      // Create a new Howl instance with enhanced configuration
      try {
        const sound = new Howl({
          src: [currentStreamUrl],
          html5: true,
          format: detectFormat(currentStreamUrl),
          volume: defaultVolume,
          preload: true,
          xhr: {
            timeout: 10000, // 10 second timeout
            withCredentials: false
          }
        });

        // Enhanced event handlers
        sound.on('load', () => {
          console.log('Stream loaded successfully');
          setIsBuffering(false);
          updateStreamMetadata({
            title: 'Live Stream',
            artist: 'SoundMaster Radio',
            status: 'connected'
          });
        });

        sound.on('loaderror', (id, error) => {
          console.error('Stream load error:', error);
          setIsBuffering(false);
          setIsPlaying(false);
          handleStreamError(error);
          tryFallbackStream();
        });

        sound.on('playerror', (id, error) => {
          console.error('Stream play error:', error);
          setIsBuffering(false);
          setIsPlaying(false);
          handlePlaybackError(error);
          tryFallbackStream();
        });

        sound.on('end', () => {
          console.log('Stream ended');
          setIsPlaying(false);
          setIsBuffering(false);
          updateStreamMetadata({
            title: 'Stream Ended',
            artist: 'SoundMaster Radio',
            status: 'disconnected'
          });
        });

        sound.on('play', () => {
          console.log('Stream playing');
          setIsPlaying(true);
          setIsBuffering(false);
          updateStreamMetadata({
            title: 'Live Stream',
            artist: 'SoundMaster Radio',
            status: 'playing'
          });
        });

        sound.on('pause', () => {
          console.log('Stream paused');
          setIsPlaying(false);
          updateStreamMetadata({
            title: 'Stream Paused',
            artist: 'SoundMaster Radio',
            status: 'paused'
          });
        });

        // Save the sound instance
        soundRef.current = sound;
        setSound(sound);

      } catch (error) {
        console.error('Error initializing stream:', error);
        setIsBuffering(false);
        handleStreamError(error);
        tryFallbackStream();
      }
    };

    // Initialize on mount or URL change
    initializeStream();

    // Clean up on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [currentStreamUrl, defaultVolume, format]);
};

