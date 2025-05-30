import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface InfoSectionProps {
  isPlaying?: boolean;
}

const InfoSection = ({ isPlaying }: InfoSectionProps = {}) => {
  const { data: streamStatus, error } = useQuery({
    queryKey: ['stream-status'],
    queryFn: async () => {
      try {
        // For now, we'll assume the stream is always available since we're using Kick.com
        // In a production environment, you'd want to implement proper status checking
        return true;
      } catch (error) {
        console.error("Error checking stream status:", error);
        return false;
      }
    },
    refetchInterval: 30000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 10000),
  });

  const getStreamStatusBadge = () => {
    if (error) return <Badge variant="destructive">Error</Badge>;
    if (streamStatus) return <Badge className="bg-green-500 hover:bg-green-600">Live</Badge>;
    return <Badge variant="secondary">Offline</Badge>;
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">Live Stream Status</h2>
        {getStreamStatusBadge()}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Unable to check stream status. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      )}

      {!streamStatus && !error && (
        <Alert>
          <AlertDescription>
            No live stream is currently active. Please check back soon!
          </AlertDescription>
        </Alert>
      )}

      {streamStatus && (
        <Alert>
          <AlertDescription>
            Successfully connected to live stream! Enjoy your session.
          </AlertDescription>
        </Alert>
      )}

      <div className="prose dark:prose-invert max-w-none">
        <h3>About Live Broadcasting</h3>
        <p>
          Experience real-time DJ sessions and interactive music streaming. 
          When a broadcast is live, you'll be able to watch and interact through our Kick.com stream.
          Stay tuned for upcoming live sessions and events!
        </p>
      </div>
    </div>
  );
};

export default InfoSection;