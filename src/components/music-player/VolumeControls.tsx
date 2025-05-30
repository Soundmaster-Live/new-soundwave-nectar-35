import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";

interface VolumeControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onMuteToggle: () => void;
}

const VolumeControls = ({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}: VolumeControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={onMuteToggle}>
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      <Slider
        value={[isMuted ? 0 : volume]}
        min={0}
        max={1}
        step={0.1}
        onValueChange={onVolumeChange}
        className="w-24"
      />
    </div>
  );
};

export default VolumeControls;