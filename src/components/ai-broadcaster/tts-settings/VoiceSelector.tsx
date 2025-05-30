
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoiceSelector {
  id: string;
  name: string;
}

interface VoiceSelectorProps {
  voiceId: string;
  onVoiceChange: (value: string) => void;
  onTestVoice?: () => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ 
  voiceId, 
  onVoiceChange,
  onTestVoice
}) => {
  // ElevenLabs default voices with their IDs
  const voices = [
    { id: "9BWtsMINqrJLrRacOk9x", name: "Aria - Conversational" },
    { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger - DJ Style" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah - Friendly" },
    { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam - Confident" },
    { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte - Professional" }
  ];

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="voice-select">Voice</Label>
        {onTestVoice && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onTestVoice}
            type="button"
            className="h-8 px-2 text-xs"
          >
            <PlayCircle className="h-3 w-3 mr-1" />
            Test
          </Button>
        )}
      </div>
      
      <Select
        value={voiceId}
        onValueChange={onVoiceChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              {voice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <p className="text-xs text-muted-foreground mt-1">
        Choose a voice for text-to-speech conversion
      </p>
    </div>
  );
};

export default VoiceSelector;
