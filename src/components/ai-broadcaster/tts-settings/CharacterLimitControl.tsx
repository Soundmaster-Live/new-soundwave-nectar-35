
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CharacterLimitControlProps {
  characterLimit: number;
  onCharacterLimitChange: (value: number) => void;
}

const CharacterLimitControl: React.FC<CharacterLimitControlProps> = ({ 
  characterLimit, 
  onCharacterLimitChange 
}) => {
  const handleSliderChange = (value: number[]) => {
    onCharacterLimitChange(value[0]);
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="character-limit">Character Limit</Label>
        <span className="text-sm text-muted-foreground">{characterLimit}</span>
      </div>
      <Slider 
        id="character-limit"
        min={50} 
        max={300} 
        step={10} 
        value={[characterLimit]} 
        onValueChange={handleSliderChange} 
      />
      <p className="text-xs text-muted-foreground mt-1">
        Sets the maximum character length for text-to-speech conversion
      </p>
    </div>
  );
};

export default CharacterLimitControl;
