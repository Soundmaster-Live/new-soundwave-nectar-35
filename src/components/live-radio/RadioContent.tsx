
import React from 'react';
import { Card } from "@/components/ui/card";
import { AIBroadcaster } from "@/components/ai-broadcaster/AIBroadcaster";
import StreamDisplay from '@/components/live-lesson/StreamDisplay';
import StreamControls from '@/components/live-lesson/StreamControls';
import StreamAnalytics from '@/components/live-lesson/StreamAnalytics';
import StreamHealthStats from '@/components/live-lesson/StreamHealthStats';
import AudioPlayerCard from '@/components/live-radio/AudioPlayerCard';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RadioContentProps {
  streamUrl: string;
  chatUrl: string | null;
  handleStreamLoad: () => void;
  handleStreamError: () => void;
  handleRetry: () => void;
  isStreamOnline: boolean;
  error: string | null;
  streamLoading: boolean;
  quality: string;
  onQualityChange: (quality: string) => void;
  isChatOpen: boolean;
  toggleChat: () => void;
  healthStatus: any;
  streamStats: any;
  audioStreamUrl: string;
  kickChannel: string;
  volume: number;
  streamMetadata: any;
  retryKey: number;
  onRetryStreams?: () => void;
}

const RadioContent = ({
  streamUrl,
  chatUrl,
  handleStreamLoad,
  handleStreamError,
  handleRetry,
  isStreamOnline,
  error,
  streamLoading,
  quality,
  onQualityChange,
  isChatOpen,
  toggleChat,
  healthStatus,
  streamStats,
  audioStreamUrl,
  kickChannel,
  volume,
  streamMetadata,
  retryKey,
  onRetryStreams
}: RadioContentProps) => {
  // Check if using fallback stream
  const isUsingFallback = audioStreamUrl && !audioStreamUrl.includes('Soundmaster');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Stream Player */}
      <Card className="lg:col-span-2 shadow-lg">
        <div className="p-6">
          {isUsingFallback && (
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Using alternative audio stream. SoundMaster stream is temporarily unavailable.
              </AlertDescription>
            </Alert>
          )}
          
          <StreamControls
            quality={quality}
            onQualityChange={onQualityChange}
            isChatOpen={isChatOpen}
            onToggleChat={toggleChat}
            platform="kick"
            hasChatUrl={true}
            healthStatus={healthStatus}
            viewCount={streamStats.viewCount}
          />
          
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-3 lg:col-span-2">
              <StreamDisplay
                isLoading={streamLoading}
                error={error}
                streamUrl={streamUrl}
                platform="kick"
                onLoad={handleStreamLoad}
                onError={handleStreamError}
                onRetry={handleRetry}
                key={retryKey}
              />
            </div>
            {isChatOpen && chatUrl && (
              <div className="lg:col-span-1 h-[400px] overflow-hidden rounded-lg border border-border">
                <iframe
                  src={chatUrl}
                  className="w-full h-full"
                  title="Kick.com Chat"
                  frameBorder="0"
                />
              </div>
            )}
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <StreamHealthStats healthStatus={healthStatus} />
            <StreamAnalytics streamStats={streamStats} />
          </div>
        </div>
      </Card>

      {/* AI Broadcaster */}
      <AIBroadcaster 
        isStreamOnline={isStreamOnline} 
        streamMetadata={streamMetadata}
        streamVolume={volume}
      />

      {/* Audio Player */}
      <AudioPlayerCard 
        audioStreamUrl={audioStreamUrl}
        kickChannel={kickChannel}
        isChatOpen={isChatOpen}
        onToggleChat={toggleChat}
        onRetryStreams={onRetryStreams}
      />
    </div>
  );
};

export default RadioContent;
