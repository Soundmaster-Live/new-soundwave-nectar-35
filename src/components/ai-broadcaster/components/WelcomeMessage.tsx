
import React, { useEffect } from 'react';
import { BroadcastTopic, Message } from '../types';

interface WelcomeMessageProps {
  messages: Message[];
  isStreamOnline: boolean;
  isInitializing: boolean;
  initializationError: boolean | null;
  generateBroadcast: (topic: BroadcastTopic) => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  messages,
  isStreamOnline,
  isInitializing,
  initializationError,
  generateBroadcast,
}) => {
  // Auto-generate welcome message on mount (but only once)
  useEffect(() => {
    // Important: we still want to auto-generate welcome regardless of auth status
    if (messages.length === 0 && isStreamOnline && !isInitializing && !initializationError) {
      console.log("Attempting to generate welcome message");
      const timer = setTimeout(() => {
        generateBroadcast('welcome');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isStreamOnline, isInitializing, initializationError, messages.length, generateBroadcast]);

  // Component doesn't render anything, just handles welcome message generation
  return null;
};

export default WelcomeMessage;
