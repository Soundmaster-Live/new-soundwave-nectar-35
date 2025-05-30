
import { useCallback } from 'react';
import { BroadcastTopic, Message } from '../types';
import useMessageState from './useMessageState';
import useAIResponseGenerator from './useAIResponseGenerator';
import useSpeechPlayback from './useSpeechPlayback';

interface AudioSettings {
  audioEnabled: boolean;
  setIsSpeaking: (isSpeaking: boolean) => void;
  getVoiceName: () => string | null;
  getUsageMetrics: () => { dailyCharCount: number; dailyRequestCount: number };
  isUserAuthenticated: () => Promise<boolean>;
}

interface AIProvider {
  activeProvider: string | null;
  setActiveProvider: (provider: string | null) => void;
  isInitializing: boolean;
  initializationError: boolean;
  forceReconnect: () => void;
}

/**
 * Hook for managing AI broadcaster messages
 */
export const useMessageManagement = (
  audioSettings: AudioSettings,
  aiProvider: AIProvider
) => {
  const {
    messages,
    isGenerating,
    currentTopic,
    setIsGenerating,
    setCurrentTopic,
    addMessage
  } = useMessageState();
  
  const { generateAIResponse } = useAIResponseGenerator(aiProvider);
  const { playTextToSpeech } = useSpeechPlayback(audioSettings);
  
  // Generate a broadcast message based on the selected topic
  const generateBroadcast = useCallback(async (topic: BroadcastTopic) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setCurrentTopic(topic);
    
    try {
      const response = await generateAIResponse(topic);
      
      // Add message to the list
      const newMessage: Message = {
        content: response,
        role: 'assistant',
        topic
      };
      
      addMessage(newMessage);
      
      // Play speech if enabled
      await playTextToSpeech(response);
    } catch (error) {
      console.error('Error generating broadcast:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [
    isGenerating,
    generateAIResponse,
    addMessage,
    playTextToSpeech,
    setIsGenerating,
    setCurrentTopic
  ]);

  // Send a user message and generate a response
  const sendMessage = useCallback(async (content: string) => {
    if (isGenerating || !content.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Add user message
      const userMessage: Message = {
        content,
        role: 'user',
        topic: 'conversation'
      };
      
      addMessage(userMessage);
      
      // Generate response
      const response = await generateAIResponse(content);
      
      // Add assistant message
      const assistantMessage: Message = {
        content: response,
        role: 'assistant',
        topic: 'conversation'
      };
      
      addMessage(assistantMessage);
      
      // Play speech if enabled
      await playTextToSpeech(response);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [
    isGenerating, 
    generateAIResponse, 
    addMessage,
    playTextToSpeech,
    setIsGenerating
  ]);

  return {
    messages,
    currentTopic,
    isGenerating,
    sendMessage,
    generateBroadcast
  };
};

export default useMessageManagement;
