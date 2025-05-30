
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useStreamAnalytics = (isPlaying: boolean) => {
  const [listeningStartTime, setListeningStartTime] = useState<Date | null>(null);
  
  useEffect(() => {
    if (isPlaying && !listeningStartTime) {
      setListeningStartTime(new Date());
      updateListenerCount(1);
    } else if (!isPlaying && listeningStartTime) {
      const duration = Math.floor((new Date().getTime() - listeningStartTime.getTime()) / 1000);
      updateAnalytics(duration);
      setListeningStartTime(null);
      updateListenerCount(-1);
    }
  }, [isPlaying, listeningStartTime]);

  const updateListenerCount = async (change: number) => {
    try {
      const { data: station, error } = await supabase
        .from('stations')
        .select('id, current_listeners')
        .eq('id', '1')
        .maybeSingle();

      if (error) throw error;

      if (station) {
        const newCount = Math.max(0, (station.current_listeners || 0) + change);
        
        const { error: updateError } = await supabase
          .from('stations')
          .update({ current_listeners: newCount })
          .eq('id', station.id);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error updating listener count:', error);
    }
  };

  const updateAnalytics = async (duration: number) => {
    try {
      const { error } = await supabase
        .from('station_analytics')
        .insert({
          station_id: '1',
          date: new Date().toISOString().split('T')[0],
          broadcast_duration: duration
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  };

  return { listeningStartTime };
};
