
import { useState, useEffect, useCallback } from 'react';
import { StreamMetadata } from '../types';

/**
 * Hook to handle stream metadata parsing and updates
 */
export const useStreamMetadata = (isPlaying: boolean) => {
  const [streamMetadata, setStreamMetadata] = useState<StreamMetadata | null>(null);

  // Update metadata manually from the stream player
  const updateStreamMetadata = useCallback((metadata: StreamMetadata) => {
    setStreamMetadata(metadata);
  }, []);

  // Auto-update metadata from a connected stream (if supported by the stream)
  useEffect(() => {
    if (!isPlaying) return;

    const metadataInterval = setInterval(() => {
      // This would be connected to real metadata source in a production app
      // For demo purposes, we're not implementing the actual polling
    }, 30000);

    return () => clearInterval(metadataInterval);
  }, [isPlaying]);

  return { streamMetadata, updateStreamMetadata };
};
