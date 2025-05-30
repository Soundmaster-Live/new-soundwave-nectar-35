
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, BarChart, MessageCircle, Settings } from "lucide-react";

interface StreamControlsProps {
  quality: string;
  onQualityChange: (quality: string) => void;
  isChatOpen: boolean;
  onToggleChat: () => void;
  platform: 'kick' | 'youtube';
  hasChatUrl: boolean;
  healthStatus: {
    buffering: boolean;
  };
  viewCount: number;
}

const StreamControls = ({
  quality,
  onQualityChange,
  isChatOpen,
  onToggleChat,
  platform,
  hasChatUrl,
  healthStatus,
  viewCount
}: StreamControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card rounded-lg shadow-sm gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Quality:</span>
          <Select value={quality} onValueChange={onQualityChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="1080p">1080p</SelectItem>
              <SelectItem value="720p">720p</SelectItem>
              <SelectItem value="480p">480p</SelectItem>
              <SelectItem value="360p">360p</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(platform === 'kick' || hasChatUrl) && (
          <Button 
            variant="outline" 
            onClick={onToggleChat}
            className="flex items-center gap-2"
            disabled={platform === 'youtube' && !hasChatUrl}
          >
            <MessageCircle className="h-4 w-4" />
            {isChatOpen ? 'Hide Chat' : 'Show Chat'}
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full">
          <Activity className={`h-5 w-5 ${healthStatus.buffering ? 'text-destructive' : 'text-lime-500'}`} />
          <span className="text-sm">{healthStatus.buffering ? 'Buffering...' : 'Stable'}</span>
        </div>
        <div className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full">
          <BarChart className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm">
            {viewCount} <span className="hidden sm:inline">viewers</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default StreamControls;
