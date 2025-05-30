import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useBroadcaster } from './hooks/useBroadcaster';
import TTSSettingsDialog from './TTSSettingsDialog';
import BroadcasterHeader from './components/BroadcasterHeader';
import BroadcasterContent from './components/BroadcasterContent';
import BroadcasterFooter from './components/BroadcasterFooter';
import { StreamMetadata } from '../streaming/types';
import { BroadcastTopic } from './types';
import AIStreamContext from './components/AIStreamContext';
import BroadcasterState from './components/BroadcasterState';
import AutoGenerateContent from './components/AutoGenerateContent';
import WelcomeMessage from './components/WelcomeMessage';

interface AIBroadcasterProps {
  isStreamOnline?: boolean;
  streamMetadata?: StreamMetadata | null;
  streamVolume?: number;
}

export const AIBroadcaster: React.FC<AIBroadcasterProps> = ({ 
  isStreamOnline = true, 
  streamMetadata = null,
  streamVolume = 0.7
}) => {
  const [userMessage, setUserMessage] = useState('');
  const [autoGenEnabled, setAutoGenEnabled] = useState(false); // Default to false to reduce API calls
  const [broadcastVolume, setBroadcastVolume] = useState(0.85); // Slightly louder than stream
  const { toast } = useToast();
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  const { 
    messages, 
    currentTopic,
    isGenerating,
    isSpeaking,
    isInitializing,
    initializationError,
    audioEnabled,
    showTTSSettings,
    setShowTTSSettings,
    toggleMute,
    openTTSSettings,
    generateBroadcast,
    getBroadcastTypeIcon,
    activeProvider,
    forceReconnect,
    resetConnection,
    isAuthenticated  // This is explicitly typed as boolean in useBroadcaster
  } = useBroadcaster();

  // Set broadcaster volume slightly higher than stream
  useEffect(() => {
    if (streamVolume) {
      // Set broadcaster volume 15% higher than stream, but max 1.0
      const newBroadcastVolume = Math.min(streamVolume * 1.15, 1.0);
      setBroadcastVolume(newBroadcastVolume);
    }
  }, [streamVolume]);

  // Handle reconnection after error
  useEffect(() => {
    if (initializationError && connectionAttempts > 0) {
      const timer = setTimeout(() => {
        resetConnection();
        toast({
          title: "Reconnecting",
          description: "Attempting to reconnect to AI broadcaster...",
        });
      }, 5000); // Wait 5 seconds before trying to reconnect
      
      return () => clearTimeout(timer);
    }
  }, [initializationError, connectionAttempts, resetConnection]);

  const sendMessage = async (message: string) => {
    if (message.trim() && !isGenerating) {
      try {
        // Add the user message
        const userInputMessage = message;
        setUserMessage('');
        
        // Then have the AI respond to the conversation
        await generateBroadcast('conversation');
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isGenerating) return;
    
    const message = userMessage;
    setUserMessage('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRetryConnection = () => {
    setConnectionAttempts(prev => prev + 1);
    forceReconnect();
    
    toast({
      title: "Reconnecting to broadcaster",
      description: "Attempting to restore the AI DJ connection...",
      duration: 3000,
    });
  };

  const toggleAutoGen = () => {
    setAutoGenEnabled(prev => !prev);
    
    toast({
      title: autoGenEnabled ? "Auto-generation disabled" : "Auto-generation enabled",
      description: autoGenEnabled 
        ? "AI DJ will no longer generate content automatically" 
        : "AI DJ will now generate content periodically",
      duration: 3000,
    });
  };

  return (
    <Card className="flex flex-col h-full shadow-lg border-primary/20">
      <CardHeader className="px-4 py-3 border-b">
        <BroadcasterHeader 
          isAuthenticated={isAuthenticated}
          currentTopic={currentTopic}
          audioEnabled={audioEnabled}
          toggleMute={toggleMute}
          openTTSSettings={openTTSSettings}
          getBroadcastTypeIcon={getBroadcastTypeIcon}
          activeProvider={activeProvider}
          isSpeaking={isSpeaking}
        />
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto pb-0 px-4">
        <BroadcasterContent
          initializationError={initializationError}
          isInitializing={isInitializing}
          connectionAttempts={connectionAttempts}
          messages={messages}
          isSpeaking={isSpeaking}
          handleRetryConnection={handleRetryConnection}
        />
      </CardContent>
      
      <div className="p-4 pt-2">
        <BroadcasterFooter
          userMessage={userMessage}
          setUserMessage={setUserMessage}
          handleSendMessage={handleSendMessage}
          generateBroadcast={generateBroadcast}
          toggleAutoGen={toggleAutoGen}
          autoGenEnabled={autoGenEnabled}
          isGenerating={isGenerating}
          isInitializing={isInitializing}
          initializationError={initializationError ? "Failed to initialize broadcaster" : null}
          handleKeyPress={handleKeyPress}
        />
      </div>
      
      {/* These components handle state but don't render UI */}
      <BroadcasterState
        isStreamOnline={isStreamOnline}
        streamMetadata={streamMetadata}
        isGenerating={isGenerating}
        isSpeaking={isSpeaking}
        autoGenEnabled={autoGenEnabled}
        generateBroadcast={generateBroadcast}
        sendMessage={sendMessage}
      />
      
      <AutoGenerateContent
        isStreamOnline={isStreamOnline}
        autoGenEnabled={autoGenEnabled}
        isInitializing={isInitializing}
        initializationError={initializationError ? "Failed to initialize broadcaster" : null}
        isGenerating={isGenerating}
        isSpeaking={isSpeaking}
        messages={messages}
        generateBroadcast={generateBroadcast}
      />
      
      <WelcomeMessage
        isInitializing={isInitializing}
        isStreamOnline={isStreamOnline}
        initializationError={initializationError}
        messages={messages}
        generateBroadcast={generateBroadcast}
      />
      
      {/* Settings dialog */}
      {showTTSSettings && (
        <TTSSettingsDialog
          open={showTTSSettings}
          onOpenChange={setShowTTSSettings}
        />
      )}
      
      {/* Stream context for audio visualization */}
      <AIStreamContext
        streamMetadata={null}
        activeProvider={activeProvider}
        isInitializing={isInitializing}
        initializationError={initializationError}
        handleRetryConnection={() => resetConnection()}
      />
    </Card>
  );
};

export default AIBroadcaster;
