
import React, { useEffect } from 'react';
import { BroadcastTopic, Message } from '../types';

interface AutoGenerateContentProps {
  isStreamOnline: boolean;
  autoGenEnabled: boolean;
  isInitializing: boolean;
  initializationError: boolean | string | null;
  isGenerating: boolean;
  isSpeaking: boolean;
  messages: Message[];
  generateBroadcast: (topic: BroadcastTopic) => void;
}

const AutoGenerateContent: React.FC<AutoGenerateContentProps> = ({
  isStreamOnline,
  autoGenEnabled,
  isInitializing,
  initializationError,
  isGenerating,
  isSpeaking,
  messages,
  generateBroadcast,
}) => {
  // Auto-generate content periodically if enabled
  useEffect(() => {
    if (!isStreamOnline || !autoGenEnabled || isInitializing || initializationError) return;
    
    const lastUserMessageTime = messages.findIndex(m => m.role === 'user');
    const shouldAutoGenerate = lastUserMessageTime === -1 || 
      (messages.length > lastUserMessageTime + 1 && messages.length < 10);
    
    if (shouldAutoGenerate && !isGenerating && !isSpeaking) {
      const interval = setTimeout(() => {
        const topics: BroadcastTopic[] = ['news', 'weather', 'events', 'music'];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        generateBroadcast(randomTopic);
      }, 30000); // 30 seconds for more frequent updates
      
      return () => clearTimeout(interval);
    }
  }, [messages, isGenerating, isSpeaking, isStreamOnline, autoGenEnabled, generateBroadcast, isInitializing, initializationError]);

  // Component doesn't render anything, just handles auto-generation
  return null;
};

export default AutoGenerateContent;
