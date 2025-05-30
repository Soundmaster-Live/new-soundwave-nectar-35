
import React from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface PlayerControlsProps {
  isAudioStream: boolean;
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  handleVolumeChange: (newVolume: number[]) => void;
}

const PlayerControls = ({
  isAudioStream,
  isMuted,
  volume,
  toggleMute,
  handleVolumeChange
}: PlayerControlsProps) => {
  if (!isAudioStream) return null;
  
  return (
    <div className="flex items-center gap-4 max-w-[200px] w-full">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="h-8 w-8"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      <Slider
        value={[volume]}
        max={1}
        step={0.01}
        onValueChange={handleVolumeChange}
        className="w-full"
      />
    </div>
  );
};

export default PlayerControls;
