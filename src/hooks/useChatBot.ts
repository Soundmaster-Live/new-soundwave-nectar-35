
import { useState, useCallback } from "react";
import { generateGeminiResponse, processGeminiResponse } from "@/utils/ai/geminiUtils";
import { useToast } from "@/hooks/use-toast";
import { getAIProvider } from "@/utils/ai/apiKeyHelpers";

export type MessageType = {
  content: string;
  type: 'user' | 'assistant' | 'system';
  isAdmin?: boolean;
};

export const useChatBot = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPatriotMode, setIsPatriotMode] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const { toast } = useToast();

  const addMessage = useCallback((content: string, type: MessageType['type'], isAdmin = false) => {
    setMessages(prev => [...prev, { content, type, isAdmin }]);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || isLoading) return;

    const userInput = message;
    setMessage("");
    
    // Add user message to the chat
    addMessage(userInput, 'user', isAdminMode);
    setIsLoading(true);

    try {
      // Check for special commands
      if (userInput.toLowerCase() === 'admin:') {
        setIsAdminMode(true);
        addMessage('Entering admin mode...', 'system', true);
        addMessage('Welcome to Admin Mode. What would you like to manage today?', 'assistant', true);
        return;
      }

      if (userInput.toLowerCase() === 'exit admin' && isAdminMode) {
        setIsAdminMode(false);
        addMessage('Exiting admin mode...', 'system');
        addMessage('Returned to standard assistant mode. How can I help you with your music needs?', 'assistant');
        return;
      }

      if (userInput.toLowerCase() === 'activate patriot mode') {
        setIsPatriotMode(true);
        addMessage('Patriot Mode activated. Please provide your setup information...', 'system');
        return;
      }

      // Get context from previous messages for better responses
      const recentMessages = messages
        .slice(-4)
        .filter(msg => msg.type === 'user' || msg.type === 'assistant')
        .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      // Get the current AI provider
      const { provider } = await getAIProvider();
      setActiveProvider(provider);

      // Try to generate response with Gemini first
      try {
        const aiResponse = await generateGeminiResponse(userInput, recentMessages);
        const processedResponse = await processGeminiResponse(aiResponse);
        addMessage(processedResponse, 'assistant', isAdminMode);
      } catch (error) {
        console.error("Gemini error, trying Cloudflare AI fallback:", error);
        
        // Fall back to Cloudflare Workers AI
        try {
          const response = await fetch(
            "https://soundmaster-ai-chatbot.86e2b8822cebf8584cf942edb3103fae.workers.dev",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: userInput,
                isAdmin: isAdminMode,
                context: recentMessages
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`Cloudflare AI error: ${response.statusText}`);
          }

          const data = await response.json();
          addMessage(data.response, 'assistant', isAdminMode);
          setActiveProvider('cloudflare');
        } catch (cloudflareError) {
          console.error("Cloudflare AI error:", cloudflareError);
          addMessage("Sorry, I encountered an error. Please try again.", 'assistant', isAdminMode);
          
          toast({
            title: "Error",
            description: "Failed to generate a response. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      addMessage("Sorry, I encountered an error. Please try again.", 'assistant', isAdminMode);
      
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [message, isLoading, messages, addMessage, isAdminMode, isPatriotMode, toast]);

  return {
    message,
    messages,
    isLoading,
    isAdminMode,
    isPatriotMode,
    activeProvider,
    setMessage,
    handleSendMessage,
    setIsAdminMode,
    setIsPatriotMode,
  };
};
