import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  year?: number;
}

interface SongCardProps {
  song: Song;
}

const SongCard = ({ song }: SongCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardHeader className="relative">
        <div className="absolute -left-2 top-4 bg-primary text-white px-4 py-1 text-sm rounded-r shadow">
          {song.genre || 'Various'}
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
            <Music className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg line-clamp-1">{song.title}</CardTitle>
            <p className="text-sm text-gray-500 line-clamp-1">{song.artist}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 space-y-1">
          {song.album && <p>Album: {song.album}</p>}
          {song.year && <p>Year: {song.year}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default SongCard;