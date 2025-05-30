
import { useState, useEffect } from "react";
import PlayButton from "./PlayButton";
import PlayerControls from "./PlayerControls";
import StatusIndicator from "./StatusIndicator";
import { useAudioStream, AudioQuality } from "../hooks/useAudioStream";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ExternalLink, MusicIcon, Settings } from "lucide-react";
import KickStreamModal from "./KickStreamModal";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LiveStreamPlayerProps {
  streamUrl?: string;
}

// Default reliable stream URL
const DEFAULT_STREAM_URL = "https://stream.radioparadise.com/mp3-128";

export const LiveStreamPlayer = ({ streamUrl = DEFAULT_STREAM_URL }: LiveStreamPlayerProps) => {
  const [showStreamInfo, setShowStreamInfo] = useState(false);
  
  const { 
    isPlaying, 
    volume, 
    play, 
    pause, 
    handleVolumeChange,
    toggleMute,
    isMuted,
    isBuffering,
    streamMetadata,
    quality,
    changeQuality,
    bitrate
  } = useAudioStream(streamUrl, 0.7);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4 justify-between">
        <div className="flex items-center space-x-4">
          <PlayButton
            isPlaying={isPlaying}
            isBuffering={isBuffering}
            onClick={() => isPlaying ? pause() : play()}
            onPlay={play}
            onPause={pause}
          />
          <StatusIndicator 
            isPlaying={isPlaying} 
            isBuffering={isBuffering} 
            streamType={streamMetadata?.title || "Live Stream"}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Select
            value={quality}
            onValueChange={(value) => changeQuality(value as AudioQuality)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (64kbps)</SelectItem>
              <SelectItem value="medium">Medium (128kbps)</SelectItem>
              <SelectItem value="high">High (320kbps)</SelectItem>
            </SelectContent>
          </Select>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Stream Options
              </Button>
            </SheetTrigger>
            <SheetContent>
              <KickStreamModal 
                isVisible={true} 
                streamUrl="https://player.kick.com/soundmasterlive" 
                onClose={() => {}} 
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <PlayerControls
        isAudioStream={true}
        volume={volume}
        handleVolumeChange={handleVolumeChange}
        toggleMute={toggleMute}
        isMuted={isMuted}
      />
      
      {streamMetadata && (
        <div className="mt-2 px-4 py-2 bg-primary/10 rounded">
          <div className="flex items-center gap-2">
            <MusicIcon className="h-4 w-4 text-primary" />
            <div className="flex-1 truncate">
              <p className="font-medium text-sm">{streamMetadata.title || "Live Stream"}</p>
              {streamMetadata.artist && (
                <p className="text-muted-foreground text-xs truncate">{streamMetadata.artist}</p>
              )}
            </div>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            <p>Stream: {streamMetadata.title || "Live Stream"}</p>
            <p>Quality: {quality} ({bitrate}kbps)</p>
            <p>Genre: Various</p>
          </div>
        </div>
      )}
    </div>
  );
};
