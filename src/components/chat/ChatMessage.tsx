
import { cn } from "@/lib/utils";
import { Shield, Key, AlertTriangle } from "lucide-react";

interface ChatMessageProps {
  content: string;
  type: 'user' | 'assistant' | 'system';
  isAdmin?: boolean;
  isPatriotMode?: boolean;
}

const ChatMessage = ({ content, type, isAdmin = false, isPatriotMode = false }: ChatMessageProps) => {
  // System messages are centered and highlighted
  if (type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className={cn(
          "px-4 py-2 rounded-lg font-medium text-white flex items-center gap-2",
          isPatriotMode 
            ? "bg-red-600" 
            : isAdmin 
              ? "bg-amber-600" 
              : "bg-blue-600"
        )}>
          {isPatriotMode ? (
            <Key className="h-4 w-4" />
          ) : isAdmin ? (
            <Shield className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex", type === 'user' ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          "max-w-[80%] p-3 rounded-lg",
          type === 'user'
            ? isAdmin
              ? 'bg-amber-600 text-white'
              : 'bg-primary text-primary-foreground'
            : isAdmin
              ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30'
              : 'bg-muted text-muted-foreground dark:bg-gray-700'
        )}
      >
        {isAdmin && type === 'assistant' && (
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-500/30">
            <Shield className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-500">Admin Response</span>
          </div>
        )}
        
        {content.split('\n').map((line, index) => (
          <p key={index} className={index > 0 ? 'mt-2' : ''}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ChatMessage;
