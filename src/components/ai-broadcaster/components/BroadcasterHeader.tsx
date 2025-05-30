
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BroadcastTopic } from '../types';
import { Badge } from '@/components/ui/badge';
import { VolumeX, Volume2 } from 'lucide-react';

interface BroadcasterHeaderProps {
  currentTopic?: BroadcastTopic;
  audioEnabled: boolean;
  isSpeaking: boolean;
  activeProvider?: string;
  toggleMute: () => void;
  openTTSSettings: () => void;
  getBroadcastTypeIcon: (topic: BroadcastTopic) => React.ReactNode;
  isAuthenticated: boolean;  // Explicitly defined as boolean to match the type from useBroadcaster
}

const BroadcasterHeader: React.FC<BroadcasterHeaderProps> = ({
  currentTopic,
  audioEnabled,
  isSpeaking,
  activeProvider,
  toggleMute,
  openTTSSettings,
  getBroadcastTypeIcon,
  isAuthenticated
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-semibold">AI DJ</h3>
        {currentTopic && (
          <Badge variant="outline" className="text-xs">
            <span className="mr-1">{getBroadcastTypeIcon(currentTopic)}</span>
            {currentTopic.charAt(0).toUpperCase() + currentTopic.slice(1)}
          </Badge>
        )}
        {isSpeaking && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        )}
      </div>
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={toggleMute}
          title={audioEnabled ? "Mute" : "Unmute"}
        >
          {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={openTTSSettings}
          title="Voice Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BroadcasterHeader;
