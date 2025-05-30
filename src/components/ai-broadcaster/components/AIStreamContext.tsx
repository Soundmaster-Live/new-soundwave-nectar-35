
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Radio, RefreshCw } from 'lucide-react';
import { StreamMetadata } from '../../streaming/types';

interface AIStreamContextProps {
  streamMetadata: StreamMetadata | null;
  activeProvider: string | null;
  isInitializing: boolean;
  initializationError: boolean | null;
  handleRetryConnection: () => void;
}

const AIStreamContext: React.FC<AIStreamContextProps> = ({
  streamMetadata,
  activeProvider,
  isInitializing,
  initializationError,
  handleRetryConnection,
}) => {
  if (isInitializing) return null;

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">
        {initializationError ? 'Reconnecting...' : `Connected to ${activeProvider === 'gemini' ? 'Google Gemini' : 'OpenRouter'}`}
      </span>
      <div className="flex items-center gap-2">
        {streamMetadata && (
          <span className="text-xs bg-primary/10 px-2 py-1 rounded-md flex items-center gap-1">
            <Radio className="h-3 w-3" />
            <span className="truncate max-w-[120px]">
              {streamMetadata.title}
            </span>
          </span>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRetryConnection}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" /> Reconnect
        </Button>
      </div>
    </div>
  );
};

export default AIStreamContext;
