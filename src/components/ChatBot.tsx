import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Loader2, Settings, Shield, LogOut, Key } from "lucide-react";
import ChatMessage from "./chat/ChatMessage";
import ChatInput from "./chat/ChatInput";
import { useChatBot } from "@/hooks/useChatBot";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";

const QUICK_ACTIONS = [
  { label: "Book an Event", query: "I'd like to book an event" },
  { label: "Request a Song", query: "Can I request a song?" },
  { label: "Services & Pricing", query: "What are your services and pricing?" },
  { label: "Live Lessons", query: "Tell me about live lessons" },
];

const ADMIN_ACTIONS = [
  { label: "View Stats", query: "/admin stats" },
  { label: "User List", query: "/admin users" },
  { label: "Settings", query: "/admin settings" },
];

const ADMIN_COMMANDS = [
  { label: "Update Gallery", query: "update gallery" },
  { label: "Modify Settings", query: "modify site settings" },
  { label: "List Users", query: "list users" },
  { label: "Enable Maintenance", query: "enable maintenance mode" },
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useAdmin();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { 
    message, 
    messages, 
    isLoading, 
    isAdminMode,
    isPatriotMode,
    activeProvider,
    setMessage, 
    handleSendMessage,
    setIsAdminMode
  } = useChatBot();
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuickAction = (query: string) => {
    setMessage(query);
    handleSendMessage();
  };

  const handleAdminLogin = () => {
    setMessage("admin:");
  };

  const handleAdminLogout = () => {
    handleQuickAction("exit admin");
  };

  const handlePatriotMode = () => {
    handleQuickAction("Activate Patriot Mode");
  };

  // Determine the current mode for styling
  const chatBgColor = isAdminMode 
    ? "bg-amber-600" 
    : isPatriotMode 
      ? "bg-red-600" 
      : "bg-primary";
  
  const chatTextColor = (isAdminMode || isPatriotMode) 
    ? "text-white" 
    : "text-primary-foreground";
  
  const cardBgColor = isAdminMode 
    ? "dark:bg-amber-950" 
    : isPatriotMode 
      ? "dark:bg-red-950" 
      : "dark:bg-gray-800";

  return (
    <>
      {isOpen && (
        <Card 
          className={cn(
            "fixed bottom-20 right-4 w-80 md:w-96 shadow-xl flex flex-col",
            cardBgColor,
            "transition-all duration-300 z-50",
            isMinimized ? "h-[60px]" : "h-[500px]"
          )}
        >
          <div className={cn(
            "p-4 border-b flex justify-between items-center rounded-t-lg",
            chatBgColor,
            chatTextColor
          )}>
            <div className="flex items-center gap-2">
              {isAdminMode ? (
                <Shield className="h-5 w-5" />
              ) : isPatriotMode ? (
                <Key className="h-5 w-5" />
              ) : (
                <MessageCircle className="h-5 w-5" />
              )}
              <h3 className="font-semibold">
                {isAdminMode 
                  ? "Admin Control Panel" 
                  : isPatriotMode 
                    ? "Patriot Mode Setup" 
                    : "AI DJ Assistant"}
              </h3>
              {activeProvider && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {activeProvider === 'gemini' ? 'Gemini' : 'OpenRouter'}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && !isPatriotMode && !isAdminMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAdminLogin}
                  className="hover:bg-primary-dark"
                  title="Admin Login"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              {isAdminMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAdminLogout}
                  className="hover:bg-amber-700"
                  title="Exit Admin Mode"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className={cn(
                  "hover:bg-primary-dark",
                  isAdminMode && "hover:bg-amber-700",
                  isPatriotMode && "hover:bg-red-700"
                )}
              >
                {isMinimized ? "+" : "-"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "hover:bg-primary-dark",
                  isAdminMode && "hover:bg-amber-700",
                  isPatriotMode && "hover:bg-red-700"
                )}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <ScrollArea ref={scrollRef} className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && !isAdminMode && !isPatriotMode && (
                    <div className="text-center text-muted-foreground p-4">
                      <p>🎧 Hey! I'm your AI DJ assistant.</p>
                      <p className="mt-2">How can I help you with music today?</p>
                      {isAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePatriotMode}
                          className="mt-4 text-sm border-dashed border-gray-400"
                        >
                          Activate Patriot Mode
                        </Button>
                      )}
                    </div>
                  )}
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={index}
                      content={msg.content}
                      type={msg.type}
                      isAdmin={msg.isAdmin}
                      isPatriotMode={isPatriotMode && msg.type === 'system'}
                    />
                  ))}
                  {isLoading && (
                    <div className="flex justify-center">
                      <Loader2 className={cn(
                        "h-6 w-6 animate-spin",
                        isAdminMode ? "text-amber-500" : isPatriotMode ? "text-red-500" : "text-primary"
                      )} />
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {!isAdminMode && !isPatriotMode && QUICK_ACTIONS.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.query)}
                      className="text-sm"
                    >
                      {action.label}
                    </Button>
                  ))}
                  {isAdmin && !isPatriotMode && !isAdminMode && ADMIN_ACTIONS.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.query)}
                      className="text-sm bg-primary/10"
                    >
                      {action.label}
                    </Button>
                  ))}
                  {isAdminMode && ADMIN_COMMANDS.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.query)}
                      className="text-sm bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
                <ChatInput
                  message={message}
                  isLoading={isLoading}
                  onMessageChange={setMessage}
                  onSendMessage={handleSendMessage}
                  isAdminMode={isAdminMode}
                  isPatriotMode={isPatriotMode}
                  placeholder={
                    isAdminMode 
                      ? "Enter admin command..." 
                      : isPatriotMode 
                        ? "Enter setup information..." 
                        : "Ask me anything about music..."
                  }
                />
              </div>
            </>
          )}
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg z-50",
          isAdminMode 
            ? "bg-amber-600 hover:bg-amber-700" 
            : "bg-primary hover:bg-primary/90"
        )}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </>
  );
};

export default ChatBot;
