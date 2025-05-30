
import { useState, useCallback } from 'react';
import { BroadcastTopic, Message } from '../types';

/**
 * Hook for managing message state
 */
export const useMessageState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<BroadcastTopic>('welcome');
  
  // Add a new message to the messages list
  const addMessage = useCallback((message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  }, []);
  
  return {
    messages,
    isGenerating,
    currentTopic,
    setIsGenerating,
    setCurrentTopic,
    addMessage
  };
};

export default useMessageState;
