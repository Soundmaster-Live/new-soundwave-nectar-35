
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import InfoSection from "@/components/live-lesson/InfoSection";
import StreamControls from "@/components/live-lesson/StreamControls";
import StreamDisplay from "@/components/live-lesson/StreamDisplay";
import StreamHealthStats from "@/components/live-lesson/StreamHealthStats";
import StreamAnalytics from "@/components/live-lesson/StreamAnalytics";
import ChatPanel from "@/components/live-lesson/ChatPanel";
import { useStreamHealth } from "@/components/live-lesson/useStreamHealth";
import { useStreamUrls } from "@/components/live-lesson/useStreamUrls";

type StreamPlatform = 'kick' | 'youtube';

const LiveLesson = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState('auto');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [streamUrl, setStreamUrl] = useState("https://player.kick.com/soundmasterlive");
  const [platform, setPlatform] = useState<StreamPlatform>('kick');
  
  // Use custom hooks for stream health monitoring and URL generation
  const { healthStatus, streamStats, trackQualityChange } = useStreamHealth();
  const { getStreamUrl, getChatUrl } = useStreamUrls({
    streamUrl,
    quality,
    platform
  });

  // Fetch stream settings from database
  useEffect(() => {
    const fetchStreamSettings = async () => {
      try {
        // Fetch stream URL
        const { data: urlData, error: urlError } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'live_lesson_url')
          .single();
          
        if (urlError && urlError.code !== 'PGRST116') {
          throw urlError;
        }
        
        // Fetch platform setting
        const { data: platformData, error: platformError } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'live_lesson_platform')
          .single();
        
        if (platformError && platformError.code !== 'PGRST116') {
          throw platformError;
        }
        
        // Set stream URL with default fallback
        if (urlData?.value) {
          setStreamUrl(urlData.value);
        } else {
          // Default to kick.com
          setStreamUrl("https://player.kick.com/soundmasterlive");
        }
        
        // Set platform
        if (platformData?.value) {
          setPlatform(platformData.value as StreamPlatform);
        } else {
          // Determine platform based on URL if platform setting not found
          if (urlData?.value?.includes('youtube.com') || urlData?.value?.includes('youtu.be')) {
            setPlatform('youtube');
          } else {
            setPlatform('kick');
          }
        }
      } catch (error) {
        console.error('Error fetching stream settings:', error);
        setError("Failed to load stream settings. Please try again later.");
      }
    };
    
    fetchStreamSettings();
  }, []);

  // Track quality changes
  useEffect(() => {
    if (quality !== 'auto') {
      trackQualityChange();
    }
  }, [quality, trackQualityChange]);

  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
    toast({
      title: "Quality Changed",
      description: `Stream quality set to ${newQuality}`,
    });
  };

  const handleIframeLoad = () => {
    console.log("Stream iframe loaded successfully");
    setIsLoading(false);
    setError(null);
    toast({
      title: "Stream Connected",
      description: `Successfully connected to the ${platform === 'kick' ? 'Kick.com' : 'YouTube'} live stream`,
    });
  };

  const handleIframeError = () => {
    console.error("Failed to load stream iframe");
    setIsLoading(false);
    setError(`Failed to load the ${platform === 'kick' ? 'Kick.com' : 'YouTube'} live stream. Please try refreshing the page.`);
    toast({
      variant: "destructive",
      title: "Stream Error",
      description: "Failed to connect to the live stream",
    });
  };

  const handleRetry = () => {
    console.log("Retrying stream connection");
    setIsLoading(true);
    setError(null);
    toast({
      title: "Retrying Connection",
      description: "Attempting to reconnect to the stream...",
    });
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    toast({
      title: isChatOpen ? "Chat Hidden" : "Chat Visible",
      description: isChatOpen ? "Chat panel has been hidden" : "Chat panel is now visible",
    });
  };

  const chatUrl = getChatUrl();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Stream Controls Card */}
      <Card className="border-none shadow-md">
        <CardContent className="p-0">
          <StreamControls
            quality={quality}
            onQualityChange={handleQualityChange}
            isChatOpen={isChatOpen}
            onToggleChat={toggleChat}
            platform={platform}
            hasChatUrl={!!chatUrl}
            healthStatus={healthStatus}
            viewCount={streamStats.viewCount}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Stream Container */}
        <div className="flex-1 space-y-6">
          <StreamDisplay
            isLoading={isLoading}
            error={error}
            streamUrl={getStreamUrl()}
            platform={platform}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            onRetry={handleRetry}
          />

          {/* Stream Health and Analytics Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <StreamHealthStats healthStatus={healthStatus} />
            <StreamAnalytics streamStats={streamStats} />
          </div>
          
          {/* Info Section */}
          <InfoSection isPlaying={!error && !isLoading} />
        </div>

        {/* Chat Container */}
        {isChatOpen && chatUrl && (
          <ChatPanel 
            chatUrl={chatUrl} 
            platform={platform} 
            onClose={toggleChat}
          />
        )}
      </div>
    </div>
  );
};

export default LiveLesson;
