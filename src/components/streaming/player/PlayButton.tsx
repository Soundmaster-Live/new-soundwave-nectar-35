
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Loader2 } from "lucide-react";

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  isBuffering?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
}

const PlayButton = ({ 
  isPlaying, 
  onClick, 
  isBuffering = false,
  onPlay,
  onPause
}: PlayButtonProps) => {
  
  const handleClick = () => {
    if (isPlaying && onPause) {
      onPause();
    } else if (!isPlaying && onPlay) {
      onPlay();
    } else {
      onClick();
    }
  };
  
  return (
    <Button
      variant={isPlaying ? "default" : "secondary"}
      size="icon"
      onClick={handleClick}
      className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
      disabled={isBuffering}
    >
      {isBuffering ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isPlaying ? (
        <Pause className="h-5 w-5" />
      ) : (
        <Play className="h-5 w-5 ml-0.5" />
      )}
    </Button>
  );
};

export default PlayButton;
