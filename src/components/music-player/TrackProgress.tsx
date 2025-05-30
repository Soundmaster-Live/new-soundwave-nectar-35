import { Slider } from "@/components/ui/slider";

interface TrackProgressProps {
  currentTime: number;
  duration: number;
  onTimeChange: (value: number[]) => void;
}

const TrackProgress = ({
  currentTime,
  duration,
  onTimeChange,
}: TrackProgressProps) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      <Slider
        value={[currentTime]}
        min={0}
        max={duration || 100}
        step={1}
        onValueChange={onTimeChange}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default TrackProgress;