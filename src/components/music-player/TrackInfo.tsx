interface Track {
  id: string;
  title: string;
  artist: string;
}

interface TrackInfoProps {
  track: Track | undefined;
}

const TrackInfo = ({ track }: TrackInfoProps) => {
  return (
    <div className="text-center">
      <h3 className="font-semibold">{track?.title || 'No track selected'}</h3>
      <p className="text-sm text-gray-500">{track?.artist || 'Unknown artist'}</p>
    </div>
  );
};

export default TrackInfo;