import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SongCard from './songs/SongCard';
import EmptySongList from './songs/EmptySongList';

interface SongListProps {
  searchQuery: string;
}

const SongList = ({ searchQuery }: SongListProps) => {
  const { toast } = useToast();

  const { data: songs, isLoading, error } = useQuery({
    queryKey: ['songs', searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('is_karaoke', true);

      if (error) {
        toast({
          title: "Error fetching songs",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
  });

  if (isLoading) {
    return <div>Loading songs...</div>;
  }

  if (error) {
    return <div>Error loading songs</div>;
  }

  if (!songs?.length) {
    return <EmptySongList />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} />
      ))}
    </div>
  );
};

export default SongList;