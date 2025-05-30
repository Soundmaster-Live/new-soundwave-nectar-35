import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const PlaybackControls = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}: PlaybackControlsProps) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <Button variant="ghost" size="icon" onClick={onPrevious}>
        <SkipBack className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onPlayPause}>
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <Button variant="ghost" size="icon" onClick={onNext}>
        <SkipForward className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PlaybackControls;