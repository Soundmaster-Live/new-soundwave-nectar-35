
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, ExternalLink, MessageCircle, RefreshCw } from "lucide-react";
import { LiveStreamPlayer } from "@/components/streaming/player/LiveStreamPlayer";
import { useToast } from "@/hooks/use-toast";

// Default reliable stream URL
const DEFAULT_STREAM_URL = "https://160.226.161.31:8000/Soundmasterlive";

interface AudioPlayerCardProps {
  audioStreamUrl: string;
  kickChannel: string;
  isChatOpen: boolean;
  onToggleChat: () => void;
  onRetryStreams?: () => void;
}

const AudioPlayerCard = ({ 
  audioStreamUrl = DEFAULT_STREAM_URL, 
  kickChannel, 
  isChatOpen, 
  onToggleChat,
  onRetryStreams
}: AudioPlayerCardProps) => {
  const { toast } = useToast();
  
  const handleRetryClick = () => {
    if (onRetryStreams) {
      onRetryStreams();
      toast({
        title: "Refreshing Streams",
        description: "Attempting to reconnect to available audio streams...",
        variant: "default",
      });
    }
  };
  
  return (
    <Card className="shadow-lg lg:col-span-3">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" />
          Live Stream
        </h2>
        <p className="text-muted-foreground mb-6">
          High-quality audio streaming. Enjoy the music while our AI DJ provides commentary and track information.
        </p>
        
        <LiveStreamPlayer streamUrl={audioStreamUrl} />
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto" 
            asChild
          >
            <a 
              href={`https://kick.com/${kickChannel}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open on Kick.com
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={onToggleChat}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {isChatOpen ? 'Hide Chat' : 'Show Chat'}
          </Button>
          
          {onRetryStreams && (
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={handleRetryClick}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Streams
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayerCard;
