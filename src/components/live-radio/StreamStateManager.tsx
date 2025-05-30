
import { useState } from 'react';

interface StreamStateManagerProps {
  children: (streamProps: {
    error: string | null;
    streamLoading: boolean;
    isStreamOnline: boolean;
    retryKey: number;
    setError: (error: string | null) => void;
    setStreamLoading: (loading: boolean) => void;
    setIsStreamOnline: (online: boolean) => void;
    handleStreamLoad: () => void;
    handleStreamError: () => void;
    handleRetry: () => void;
  }) => React.ReactNode;
  addNotification: (message: string, type: 'error' | 'warning' | 'info' | 'success') => void;
}

export const StreamStateManager = ({ children, addNotification }: StreamStateManagerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(true);
  const [isStreamOnline, setIsStreamOnline] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const handleStreamLoad = () => {
    setStreamLoading(false);
    setError(null);
    setIsStreamOnline(true);
    addNotification('Successfully connected to SoundMaster live stream', 'success');
  };

  const handleStreamError = () => {
    setStreamLoading(false);
    const errorMessage = "Unable to load the Kick.com stream. This might be due to network restrictions or the stream being offline.";
    setError(errorMessage);
    setIsStreamOnline(false);
    addNotification(errorMessage, 'error');
  };

  const handleRetry = () => {
    setStreamLoading(true);
    setError(null);
    setRetryKey(prev => prev + 1);
    addNotification('Retrying stream connection...', 'info');
  };

  return (
    <>
      {children({
        error,
        streamLoading,
        isStreamOnline,
        retryKey,
        setError,
        setStreamLoading,
        setIsStreamOnline,
        handleStreamLoad,
        handleStreamError,
        handleRetry
      })}
    </>
  );
};
