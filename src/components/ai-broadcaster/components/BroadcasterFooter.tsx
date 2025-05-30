
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CloudRain, Sun, Calendar, Mic, Radio, Send, Loader } from 'lucide-react';
import { BroadcastTopic } from '../types';

interface BroadcasterFooterProps {
  userMessage: string;
  setUserMessage: (message: string) => void;
  handleSendMessage: () => void;
  generateBroadcast: (topic: BroadcastTopic) => void;
  toggleAutoGen: () => void;
  autoGenEnabled: boolean;
  isGenerating: boolean;
  isInitializing: boolean;
  initializationError: string | boolean | null;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const BroadcasterFooter: React.FC<BroadcasterFooterProps> = ({
  userMessage,
  setUserMessage,
  handleSendMessage,
  generateBroadcast,
  toggleAutoGen,
  autoGenEnabled,
  isGenerating,
  isInitializing,
  initializationError,
  handleKeyPress
}) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="grid grid-cols-5 gap-2 w-full">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 col-span-1"
          onClick={() => generateBroadcast('weather')}
          disabled={isGenerating || isInitializing || !!initializationError}
        >
          <CloudRain className="h-3.5 w-3.5" />
          <span className="text-xs">Weather</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 col-span-1"
          onClick={() => generateBroadcast('news')}
          disabled={isGenerating || isInitializing || !!initializationError}
        >
          <Sun className="h-3.5 w-3.5" />
          <span className="text-xs">News</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 col-span-1"
          onClick={() => generateBroadcast('events')}
          disabled={isGenerating || isInitializing || !!initializationError}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span className="text-xs">Events</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 col-span-1"
          onClick={() => generateBroadcast('music')}
          disabled={isGenerating || isInitializing || !!initializationError}
        >
          <Mic className="h-3.5 w-3.5" />
          <span className="text-xs">Updates</span>
        </Button>
        <Button 
          variant={autoGenEnabled ? "default" : "outline"}
          size="sm" 
          className="flex items-center gap-1 col-span-1"
          onClick={toggleAutoGen}
          disabled={isInitializing || !!initializationError}
        >
          <Radio className="h-3.5 w-3.5" />
          <span className="text-xs">Auto</span>
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Send a message to the broadcaster..."
          className="resize-none"
          disabled={isGenerating || isInitializing || !!initializationError}
        />
        <Button 
          className="shrink-0"
          onClick={handleSendMessage}
          disabled={!userMessage.trim() || isGenerating || isInitializing || !!initializationError}
        >
          {isGenerating ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default BroadcasterFooter;
