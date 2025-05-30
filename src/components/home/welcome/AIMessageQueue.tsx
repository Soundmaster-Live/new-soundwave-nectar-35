import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export const useAIMessageQueue = () => {
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  useEffect(() => {
    if (messageQueue.length > 0 && !isProcessing) {
      processNextMessage();
    }
  }, [messageQueue, isProcessing]);

  const processNextMessage = async () => {
    setIsProcessing(true);
    const message = messageQueue[0];
    
    try {
      // Add typing animation delay for natural feel
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentMessage(message);
      setMessageQueue(prev => prev.slice(1));
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to process DJ message",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const addToQueue = (message: string) => {
    setMessageQueue(prev => [...prev, message]);
  };

  return {
    addToQueue,
    isProcessing,
    currentMessage,
  };
};