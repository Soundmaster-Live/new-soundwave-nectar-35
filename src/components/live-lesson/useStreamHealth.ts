
import { useState, useCallback, useEffect } from "react";

interface HealthStatus {
  bitrate: number;
  fps: number;
  buffering: boolean;
  latency: number;
  dropped_frames: number;
}

interface StreamStats {
  duration: number;
  viewCount: number;
  peakViewers: number;
  bufferingEvents: number;
  qualityChanges: number;
}

export const useStreamHealth = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    bitrate: 0,
    fps: 0,
    buffering: false,
    latency: 0,
    dropped_frames: 0
  });
  
  const [streamStats, setStreamStats] = useState<StreamStats>({
    duration: 0,
    viewCount: 0,
    peakViewers: 0,
    bufferingEvents: 0,
    qualityChanges: 0
  });

  // Simulate stream health monitoring
  const monitorStreamHealth = useCallback(() => {
    const startTime = new Date().getTime();
    
    const interval = setInterval(() => {
      // Simulate stream health metrics (replace with actual metrics in production)
      const newHealth = {
        bitrate: Math.floor(Math.random() * 5000) + 3000,
        fps: Math.floor(Math.random() * 10) + 50,
        buffering: Math.random() > 0.95,
        latency: Math.floor(Math.random() * 1000),
        dropped_frames: Math.floor(Math.random() * 10)
      };

      setHealthStatus(newHealth);
      
      // Update stream stats
      const currentTime = new Date().getTime();
      const elapsedSeconds = (currentTime - startTime) / 1000;
      
      setStreamStats(prev => {
        const newViewCount = Math.floor(Math.random() * 100) + 50; // Simulate viewer count
        return {
          ...prev,
          duration: elapsedSeconds,
          bufferingEvents: prev.bufferingEvents + (newHealth.buffering ? 1 : 0),
          viewCount: newViewCount,
          peakViewers: Math.max(prev.peakViewers, newViewCount)
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Start monitoring when component mounts
  useEffect(() => {
    const cleanup = monitorStreamHealth();
    return () => cleanup();
  }, [monitorStreamHealth]);

  // Function to update quality change stats
  const trackQualityChange = useCallback(() => {
    setStreamStats(prev => ({
      ...prev,
      qualityChanges: prev.qualityChanges + 1
    }));
  }, []);

  return {
    healthStatus,
    streamStats,
    trackQualityChange
  };
};
