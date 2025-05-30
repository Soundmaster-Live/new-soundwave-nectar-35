
import React, { useEffect, useRef } from 'react';
import { BroadcastTopic } from '../types';
import { StreamMetadata } from '../../streaming/types';

interface BroadcasterStateProps {
  isStreamOnline: boolean;
  streamMetadata: StreamMetadata | null;
  isGenerating: boolean;
  isSpeaking: boolean;
  autoGenEnabled: boolean;
  generateBroadcast: (topic: BroadcastTopic) => void;
  sendMessage: (message: string) => Promise<void>;
}

const BroadcasterState: React.FC<BroadcasterStateProps> = ({
  isStreamOnline,
  streamMetadata,
  isGenerating,
  isSpeaking,
  autoGenEnabled,
  generateBroadcast,
  sendMessage,
}) => {
  const lastStreamMetadata = useRef<StreamMetadata | null>(null);
  const lastTrackAnnounced = useRef<string | null>(null);

  // Monitor stream metadata for track changes and announce new tracks
  useEffect(() => {
    if (!streamMetadata || !isStreamOnline || isGenerating || isSpeaking) return;
    
    // Check if this is a new track
    const currentTrackId = `${streamMetadata.artist}-${streamMetadata.title}`;
    const previousTrackId = lastStreamMetadata.current ? 
      `${lastStreamMetadata.current.artist}-${lastStreamMetadata.current.title}` : null;
    
    if (currentTrackId !== previousTrackId && 
        currentTrackId !== lastTrackAnnounced.current &&
        autoGenEnabled) {
      
      // Store the current track so we don't announce it again
      lastTrackAnnounced.current = currentTrackId;
      
      // Wait a moment before announcing the new track
      setTimeout(() => {
        if (!isGenerating && !isSpeaking) {
          const message = `Announce the next track: "${streamMetadata.title}" by ${streamMetadata.artist}`;
          sendMessage(message);
        }
      }, 5000);
    }
    
    // Update the last metadata
    lastStreamMetadata.current = streamMetadata;
  }, [streamMetadata, isStreamOnline, isGenerating, isSpeaking, autoGenEnabled, sendMessage]);

  // Component doesn't render anything, just handles state
  return null;
};

export default BroadcasterState;
