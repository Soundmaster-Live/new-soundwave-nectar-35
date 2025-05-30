
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Message } from './types';
import { User, Radio } from 'lucide-react';

interface BroadcasterMessageProps {
  message: Message;
  isActive?: boolean;
}

const BroadcasterMessage: React.FC<BroadcasterMessageProps> = ({ 
  message,
  isActive = false
}) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex items-start gap-2 max-w-[85%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Radio className="h-4 w-4" />}
        </div>
        
        <div className={cn(
          "rounded-lg p-3",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-accent/20 text-foreground",
          isActive && "border border-green-500/50"
        )}>
          {isActive && (
            <Badge 
              variant="outline" 
              className="mb-2 bg-green-500/10 text-green-500 border-green-500/50"
            >
              <span className="mr-1 h-2 w-2 rounded-full bg-green-500 animate-ping inline-block"></span>
              Live
            </Badge>
          )}
          
          {message.content.split('\n').map((paragraph, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BroadcasterMessage;
