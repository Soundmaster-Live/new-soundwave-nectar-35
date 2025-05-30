
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Activity, Clock } from "lucide-react";

interface StreamHealthStatsProps {
  healthStatus: {
    bitrate: number;
    fps: number;
    latency: number;
    buffering: boolean;
  }
}

const StreamHealthStats = ({ healthStatus }: StreamHealthStatsProps) => {
  // Function to determine bitrate status color
  const getBitrateColor = (bitrate: number) => {
    if (bitrate > 4000) return "text-green-500";
    if (bitrate > 2000) return "text-yellow-500";
    return "text-red-500";
  };
  
  // Function to determine FPS status color
  const getFpsColor = (fps: number) => {
    if (fps >= 50) return "text-green-500";
    if (fps >= 30) return "text-yellow-500";
    return "text-red-500";
  };
  
  // Function to determine latency status color
  const getLatencyColor = (latency: number) => {
    if (latency < 500) return "text-green-500";
    if (latency < 1000) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Stream Health
        </CardTitle>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${healthStatus.buffering ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {healthStatus.buffering ? 'Buffering' : 'Stable'}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Wifi className={`h-4 w-4 ${getBitrateColor(healthStatus.bitrate)}`} />
              <h3 className="text-sm font-semibold">Bitrate</h3>
            </div>
            <p className={`text-lg font-medium ${getBitrateColor(healthStatus.bitrate)}`}>
              {(healthStatus.bitrate / 1000).toFixed(1)} Mbps
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Activity className={`h-4 w-4 ${getFpsColor(healthStatus.fps)}`} />
              <h3 className="text-sm font-semibold">FPS</h3>
            </div>
            <p className={`text-lg font-medium ${getFpsColor(healthStatus.fps)}`}>
              {healthStatus.fps}
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Clock className={`h-4 w-4 ${getLatencyColor(healthStatus.latency)}`} />
              <h3 className="text-sm font-semibold">Latency</h3>
            </div>
            <p className={`text-lg font-medium ${getLatencyColor(healthStatus.latency)}`}>
              {healthStatus.latency}ms
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamHealthStats;
