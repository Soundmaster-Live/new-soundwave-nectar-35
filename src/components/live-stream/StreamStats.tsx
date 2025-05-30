
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StreamStatsProps {
  healthStatus: {
    bitrate: number;
    fps: number;
    latency: number;
  };
  streamStats: {
    duration: number;
    peakViewers: number;
    qualityChanges: number;
    bufferingEvents: number;
  };
}

const StreamStats = ({ healthStatus, streamStats }: StreamStatsProps) => {
  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stream Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-1">Bitrate</h3>
              <p className="text-lg">{(healthStatus.bitrate / 1000).toFixed(1)} Mbps</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">FPS</h3>
              <p className="text-lg">{healthStatus.fps}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Latency</h3>
              <p className="text-lg">{healthStatus.latency}ms</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stream Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-1">Duration</h3>
              <p>{Math.floor(streamStats.duration)}s</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Peak Viewers</h3>
              <p>{streamStats.peakViewers}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Quality Changes</h3>
              <p>{streamStats.qualityChanges}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Buffering Events</h3>
              <p>{streamStats.bufferingEvents}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreamStats;
