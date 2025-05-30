
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X, Shield, ExternalLink, RefreshCw } from "lucide-react";
import { Badge } from '@/components/ui/badge';

interface KickStreamModalProps {
  isVisible: boolean;
  streamUrl: string;
  onClose: () => void;
}

const KickStreamModal = ({ isVisible = true, streamUrl, onClose }: KickStreamModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [iframeKey, setIframeKey] = useState(Date.now());
  
  const handleRetry = () => {
    setIsLoading(true);
    setRetryCount(prev => prev + 1);
    setIframeKey(Date.now()); // Force iframe reload
  };
  
  // Reset loading state when iframe loads or errors
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  const handleIframeError = () => {
    setIsLoading(false);
  };
  
  // Auto-retry if loading takes too long
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        if (isLoading && retryCount < 2) {
          handleRetry();
        }
      }, 10000); // 10 seconds timeout
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, retryCount]);

  if (!isVisible) return null;
  
  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Kick.com Stream</h2>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">
              Live
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="icon"
              onClick={handleRetry}
              disabled={isLoading}
              title="Refresh stream"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-lg bg-black" style={{ position: 'relative', paddingTop: '56.25%' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-8 w-8 animate-spin text-white" />
                <p className="text-white">Loading stream...</p>
              </div>
            </div>
          )}
          <iframe 
            key={iframeKey}
            src={streamUrl}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            scrolling="no"
            allowFullScreen={true}
            title="Kick.com Live Stream"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <p>Stream provided by Kick.com - SoundMaster Live channel</p>
          </div>
          
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <a 
              href="https://kick.com/soundmasterlive" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View on Kick.com
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KickStreamModal;
