
import { useNavigate } from "react-router-dom";
import { Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveRadioButtonProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export const LiveRadioButton = ({ isMobile = false, onItemClick }: LiveRadioButtonProps) => {
  const navigate = useNavigate();

  if (isMobile) {
    return (
      <Button
        onClick={() => {
          navigate('/live-radio');
          onItemClick?.();
        }}
        variant="gradient"
        className="w-full text-white flex items-center gap-2 justify-center"
      >
        <Radio className="h-4 w-4" />
        Live Radio
      </Button>
    );
  }

  return (
    <Button
      onClick={() => navigate('/live-radio')}
      variant="gradient"
      className="text-white flex items-center gap-2"
    >
      <Radio className="h-4 w-4" />
      Live Radio
    </Button>
  );
};
