
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Shield, Key } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  isAdminMode?: boolean;
  isPatriotMode?: boolean;
  placeholder?: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

const ChatInput = ({ 
  message, 
  isLoading, 
  isAdminMode = false,
  isPatriotMode = false,
  placeholder = "Ask me anything about music...",
  onMessageChange, 
  onSendMessage 
}: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && message.trim()) {
      onSendMessage();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        {isAdminMode && (
          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
        )}
        {isPatriotMode && (
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-600" />
        )}
        <Input
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading}
          className={cn(
            "dark:bg-gray-700",
            isAdminMode && "pl-10 border-amber-500/50 focus-visible:ring-amber-500/50",
            isPatriotMode && "pl-10 border-red-500/50 focus-visible:ring-red-500/50"
          )}
        />
      </div>
      <Button
        onClick={onSendMessage}
        disabled={isLoading || !message.trim()}
        className={cn(
          "px-3",
          isAdminMode && "bg-amber-600 hover:bg-amber-700",
          isPatriotMode && "bg-red-600 hover:bg-red-700"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ChatInput;
