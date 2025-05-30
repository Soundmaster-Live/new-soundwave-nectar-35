
import React, { useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAudioStream } from '@/components/streaming/hooks/useAudioStream';
import { useStreamHealth } from '@/components/live-lesson/useStreamHealth';
import { useStreamUrls } from '@/components/live-lesson/useStreamUrls';
import ErrorAlert from '@/components/live-radio/ErrorAlert';
import StreamHeader from '@/components/live-radio/StreamHeader';
import NotificationSystem from '@/components/live-radio/NotificationSystem';
import RadioContent from '@/components/live-radio/RadioContent';
import { NotificationManager } from '@/components/live-radio/NotificationManager';
import { StreamStateManager } from '@/components/live-radio/StreamStateManager';
import { QualityManager } from '@/components/live-radio/QualityManager';
import { ChatToggle } from '@/components/live-radio/ChatToggle';
import { SouthAfricanTime } from '@/components/live-radio/SouthAfricanTime';
import { useAdmin } from '@/contexts/AdminContext';
import { useTTSSettings } from '@/utils/ai/elevenlabs';
import { useNavigate } from 'react-router-dom';

// Updated HTTPS streaming alternatives for audio with reliable fallbacks
// Note: Using direct HTTPS streams without CORS proxies where possible
const AUDIO_STREAM_URLS = {
  PRIMARY: "http://160.226.161.31:8000/Soundmasterlive",  // Reliable primary stream
  FALLBACK1: "http://160.226.161.31:8000/Soundmasterlive", // Reliable fallback
  FALLBACK2: "http://160.226.161.31:8000/Soundmasterlive", // Another reliable fallback
  FALLBACK3: "http://160.226.161.31:8000/Soundmasterlive" // Additional quality backup
};

const LiveRadio = () => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isUserAuthenticated } = useTTSSettings();
  
  // Stream platform and monitoring
  const platform = 'kick';
  const kickChannel = 'soundmasterlive';
  const kickStreamUrl = `https://player.kick.com/${kickChannel}`;
  const { healthStatus, streamStats, trackQualityChange } = useStreamHealth();

  // Use the secured stream URL
  const audioStreamUrl = AUDIO_STREAM_URLS.PRIMARY; // Start with reliable stream
  const { 
    isPlaying, 
    volume, 
    streamMetadata, 
    isBuffering, 
    currentStreamUrl, 
    tryFallbackStream, 
    restorePrimaryStream,
    isUsingFallback,
    switchToStream
  } = useAudioStream(audioStreamUrl, 0.7);

  // Check if user is authenticated for AI broadcaster features
  useEffect(() => {
    // This is just a check but doesn't force redirect
    // The AI Broadcaster component will handle restrictions internally
    if (!isUserAuthenticated()) {
      toast({
        title: "Limited functionality",
        description: "Login to access voice features of the AI broadcaster",
        variant: "default",
        duration: 5000,
      });
    }
  }, [isUserAuthenticated, toast]);

  // Show toast notification when stream changes to fallback
  useEffect(() => {
    if (currentStreamUrl && currentStreamUrl !== audioStreamUrl && isUsingFallback) {
      toast({
        title: "Using alternative stream",
        description: "Primary stream unavailable. Using fallback audio source.",
        variant: "default",
      });
    }
  }, [currentStreamUrl, audioStreamUrl, isUsingFallback, toast]);
  
  // Create a rotation of stream URLs to try
  const streamUrls = [
    AUDIO_STREAM_URLS.PRIMARY,
    AUDIO_STREAM_URLS.FALLBACK1,
    AUDIO_STREAM_URLS.FALLBACK2,
    AUDIO_STREAM_URLS.FALLBACK3
  ];
  
  // Handle retrying streams with improved cycling through available options
  const handleRetryStreams = useCallback(() => {
    if (switchToStream) {
      // Get current stream index and cycle to next one
      const currentIndex = streamUrls.indexOf(currentStreamUrl || audioStreamUrl);
      const nextIndex = (currentIndex + 1) % streamUrls.length;
      const nextStream = streamUrls[nextIndex];
      
      console.log(`Switching to alternate stream: ${nextStream}`);
      switchToStream(nextStream);
      toast({
        title: "Switching Audio Stream",
        description: "Attempting to connect to alternate audio stream...",
        variant: "default",
      });
    } else if (restorePrimaryStream) {
      restorePrimaryStream();
      toast({
        title: "Refreshing Audio Streams",
        description: "Attempting to reconnect to primary audio stream...",
        variant: "default",
      });
    }
  }, [switchToStream, restorePrimaryStream, toast, currentStreamUrl, audioStreamUrl, streamUrls]);

  return (
    <NotificationManager>
      {({ 
        notifications, 
        unreadCount, 
        notificationsEnabled, 
        addNotification, 
        markAllAsRead, 
        clearAllNotifications, 
        toggleNotifications 
      }) => (
        <StreamStateManager addNotification={addNotification}>
          {({ 
            error, 
            streamLoading, 
            isStreamOnline, 
            retryKey, 
            handleStreamLoad, 
            handleStreamError, 
            handleRetry 
          }) => (
            <QualityManager 
              trackQualityChange={trackQualityChange} 
              addNotification={addNotification}
            >
              {({ quality, handleQualityChange }) => (
                <ChatToggle>
                  {({ isChatOpen, toggleChat }) => {
                    const { getStreamUrl, getChatUrl } = useStreamUrls({ 
                      streamUrl: kickStreamUrl, 
                      quality, 
                      platform 
                    });

                    // Update notifications based on track changes
                    useEffect(() => {
                      if (streamMetadata && isPlaying) {
                        addNotification(`Now playing: ${streamMetadata.title} - ${streamMetadata.artist}`, 'info');
                      }
                    }, [streamMetadata?.title, isPlaying, addNotification]);

                    // Track buffering states
                    useEffect(() => {
                      if (isBuffering) {
                        addNotification("Audio stream is buffering...", 'info');
                      }
                    }, [isBuffering, addNotification]);

                    return (
                      <SouthAfricanTime>
                        {({ currentTime }) => (
                          <div className="container mx-auto px-4 py-8 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <StreamHeader 
                                title="Live Radio" 
                                isStreamOnline={isStreamOnline} 
                                southAfricanTime={currentTime} 
                              />
                              
                              {/* Notification dropdown */}
                              <NotificationSystem 
                                notifications={notifications}
                                unreadCount={unreadCount}
                                notificationsEnabled={notificationsEnabled}
                                onToggleNotifications={toggleNotifications}
                                onMarkAllAsRead={markAllAsRead}
                                onClearAllNotifications={clearAllNotifications}
                              />
                            </div>

                            <p className="text-muted-foreground max-w-2xl">
                              Experience high-quality music streaming with real-time updates from South Africa.
                              Current time in Johannesburg: {currentTime}
                            </p>

                            {/* Error Alert - Only visible for admin users */}
                            <ErrorAlert error={error} onRetry={handleRetry} />

                            {/* Radio Content */}
                            <RadioContent 
                              streamUrl={getStreamUrl()}
                              chatUrl={getChatUrl()}
                              handleStreamLoad={handleStreamLoad}
                              handleStreamError={handleStreamError}
                              handleRetry={handleRetry}
                              isStreamOnline={isStreamOnline}
                              error={error}
                              streamLoading={streamLoading}
                              quality={quality}
                              onQualityChange={handleQualityChange}
                              isChatOpen={isChatOpen}
                              toggleChat={toggleChat}
                              healthStatus={healthStatus}
                              streamStats={streamStats}
                              audioStreamUrl={currentStreamUrl || audioStreamUrl}
                              kickChannel={kickChannel}
                              volume={volume}
                              streamMetadata={streamMetadata}
                              retryKey={retryKey}
                              onRetryStreams={handleRetryStreams}
                            />
                          </div>
                        )}
                      </SouthAfricanTime>
                    );
                  }}
                </ChatToggle>
              )}
            </QualityManager>
          )}
        </StreamStateManager>
      )}
    </NotificationManager>
  );
};

export default LiveRadio;
