import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PlaybackControls from "./music-player/PlaybackControls";
import VolumeControls from "./music-player/VolumeControls";
import TrackProgress from "./music-player/TrackProgress";
import TrackInfo from "./music-player/TrackInfo";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface Track {
  id: string;
  title: string;
  artist: string;
  url?: string;
}

const MusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .limit(10);
      
      if (error) throw error;
      return data as Track[];
    },
  });

  const currentTrack = tracks[currentTrackIndex];

  const {
    audioRef,
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    handleTimeChange,
  } = useAudioPlayer({
    url: currentTrack?.url,
    onTrackEnd: () => setCurrentTrackIndex((prev) => (prev + 1) % tracks.length),
  });

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const playPrevious = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 shadow-lg">
      <CardContent className="p-4">
        <audio
          ref={audioRef}
          src={currentTrack?.url}
          className="hidden"
        />
        <div className="flex flex-col gap-4">
          <TrackInfo track={currentTrack} />
          
          <TrackProgress
            currentTime={currentTime}
            duration={duration}
            onTimeChange={handleTimeChange}
          />

          <PlaybackControls
            isPlaying={isPlaying}
            onPlayPause={togglePlay}
            onNext={playNext}
            onPrevious={playPrevious}
          />

          <VolumeControls
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={handleVolumeChange}
            onMuteToggle={toggleMute}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;