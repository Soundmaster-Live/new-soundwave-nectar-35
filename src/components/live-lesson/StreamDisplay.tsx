
import { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";

interface StreamDisplayProps {
  isLoading: boolean;
  error: string | null;
  streamUrl: string;
  platform: 'kick' | 'youtube';
  onLoad: () => void;
  onError: () => void;
  onRetry: () => void;
}

const StreamDisplay = ({
  isLoading,
  error,
  streamUrl,
  platform,
  onLoad,
  onError,
  onRetry
}: StreamDisplayProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Re-initialize iframe when URL changes
    if (iframeRef.current && streamUrl) {
      iframeRef.current.src = streamUrl;
    }
  }, [streamUrl]);

  // Handle iframe load and error events
  const handleIframeLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    if (onLoad) onLoad();
  };

  const handleIframeError = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    if (onError) onError();
  };

  return (
    <div className="w-full">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner className="h-8 w-8" />
            <p className="text-muted-foreground">Loading live stream...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Stream Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={onRetry}
              variant="destructive"
              className="shadow-sm hover:shadow"
            >
              Retry Connection
            </Button>
          </div>
        </Alert>
      )}

      {/* Stream Player with maintained aspect ratio */}
      <div className="relative w-full overflow-hidden rounded-lg shadow-lg" style={{ paddingTop: '56.25%' }}>
        <iframe
          ref={iframeRef}
          src={streamUrl}
          className={`absolute top-0 left-0 w-full h-full ${
            isLoading ? 'hidden' : 'block'
          }`}
          title={`${platform === 'kick' ? 'Kick.com' : 'YouTube'} Live Stream`}
          frameBorder="0"
          scrolling="no"
          allowFullScreen={true}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="autoplay; fullscreen; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

export default StreamDisplay;
