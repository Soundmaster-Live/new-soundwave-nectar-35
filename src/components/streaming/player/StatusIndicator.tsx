
import React from 'react';
import { Radio } from "lucide-react";

interface StatusIndicatorProps {
  isPlaying: boolean;
  streamType: string;
  isBuffering?: boolean;
}

const StatusIndicator = ({ isPlaying, streamType, isBuffering = false }: StatusIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Radio className={`h-5 w-5 ${isPlaying ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
      <div className="flex flex-col">
        <span className="font-semibold">
          {streamType}
        </span>
        <span className="text-sm text-muted-foreground">
          {isBuffering ? "Buffering..." : isPlaying ? "Now Playing" : "Click to Play"}
        </span>
      </div>
    </div>
  );
};

export default StatusIndicator;
