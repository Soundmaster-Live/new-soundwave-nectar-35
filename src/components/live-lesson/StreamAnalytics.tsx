
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Clock, Users, Gauge, AlertTriangle } from "lucide-react";

interface StreamAnalyticsProps {
  streamStats: {
    duration: number;
    peakViewers: number;
    qualityChanges: number;
    bufferingEvents: number;
    viewCount: number;
  }
}

const StreamAnalytics = ({ streamStats }: StreamAnalyticsProps) => {
  // Format duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          Stream Analytics
        </CardTitle>
        <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
          Live
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Duration</h3>
            </div>
            <p className="text-base font-semibold">{formatDuration(streamStats.duration)}</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Peak Viewers</h3>
            </div>
            <p className="text-base font-semibold">{streamStats.peakViewers}</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Quality Changes</h3>
            </div>
            <p className="text-base font-semibold">{streamStats.qualityChanges}</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Buffering</h3>
            </div>
            <p className="text-base font-semibold">{streamStats.bufferingEvents}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamAnalytics;
