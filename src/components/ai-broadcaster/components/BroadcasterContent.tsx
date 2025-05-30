
import React from 'react';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Message } from '../types';

interface BroadcasterContentProps {
  initializationError: boolean;
  isInitializing: boolean;
  connectionAttempts: number;
  messages: Message[];
  isSpeaking: boolean;
  handleRetryConnection: () => void;
}

const BroadcasterContent: React.FC<BroadcasterContentProps> = ({
  initializationError,
  isInitializing,
  connectionAttempts,
  messages,
  isSpeaking,
  handleRetryConnection,
}) => {
  // Fix for the stuck "Connecting to broadcaster" issue
  // If there are no messages and isInitializing stays true for too long,
  // We'll show an option to retry the connection
  const shouldShowRetry = initializationError || (isInitializing && connectionAttempts > 0);
  
  return (
    <ScrollArea className="h-[320px] pr-4">
      {/* Loading State */}
      {isInitializing && messages.length === 0 && !shouldShowRetry && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            Connecting to broadcaster...
          </p>
        </div>
      )}

      {/* Error State */}
      {shouldShowRetry && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connection issue detected. Unable to connect to the AI broadcaster service.
            </AlertDescription>
          </Alert>
          <p className="text-muted-foreground mb-4">
            This could be due to a network issue or service unavailability.
          </p>
          <Button onClick={handleRetryConnection} variant="outline">
            Retry Connection
          </Button>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.role === 'assistant'
                  ? 'bg-primary/10 text-primary-foreground'
                  : 'bg-muted'
              } ${isSpeaking && index === messages.length - 1 && message.role === 'assistant'
                  ? 'border border-primary/50 shadow-sm'
                  : ''
              }`}
            >
              <p className="text-xs font-medium mb-1">
                {message.role === 'assistant' ? 'DJ' : 'You'}
              </p>
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default BroadcasterContent;
