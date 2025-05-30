import React from 'react';
import { Settings, MessageCircle, Activity, BarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StreamControlsProps {
  quality: string;
  onQualityChange: (quality: string) => void;
  isChatOpen: boolean;
  onToggleChat: () => void;
  healthStatus: {
    buffering: boolean;
    viewCount: number;
  };
}

const StreamControls = ({
  quality,
  onQualityChange,
  isChatOpen,
  onToggleChat,
  healthStatus
}: StreamControlsProps) => {
  return (
    <div className="flex items-center justify-between mb-4 p-4 bg-background rounded-lg border">
      <div className="flex items-center gap-4">
        <Select value={quality} onValueChange={onQualityChange}>
          <SelectTrigger className="w-[180px]">
            <Settings className="h-4 w-4 mr-2" />
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

        <Button
          variant="outline"
          onClick={onToggleChat}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          {isChatOpen ? 'Hide Chat' : 'Show Chat'}
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className={`h-5 w-5 ${healthStatus.buffering ? 'text-destructive' : 'text-success'}`} />
          <span className="text-sm">{healthStatus.buffering ? 'Buffering...' : 'Stable'}</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            {healthStatus.viewCount} viewers
          </span>
        </div>
      </div>
    </div>
  );
};

export default StreamControls;