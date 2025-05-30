
import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVoiceSettings } from '@/hooks/useVoiceSettings';
import { Slider } from '@/components/ui/slider';
import { generateSpeech } from '@/utils/audio/voiceUtils';

interface TTSSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TTSSettingsDialog: React.FC<TTSSettingsDialogProps> = ({
  open,
  onOpenChange
}) => {
  const {
    voiceName,
    availableVoices,
    setVoice,
    resetUsageMetrics
  } = useVoiceSettings();
  
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(voiceName);
  
  // Group voices by language
  const groupedVoices = useMemo(() => {
    const groups: Record<string, SpeechSynthesisVoice[]> = {};
    
    availableVoices.forEach(voice => {
      const lang = voice.lang.split('-')[0].toUpperCase();
      if (!groups[lang]) {
        groups[lang] = [];
      }
      groups[lang].push(voice);
    });
    
    return groups;
  }, [availableVoices]);
  
  // Test the selected voice
  const testVoice = () => {
    if (!selectedVoice) return;
    
    generateSpeech(
      "Hello! This is a test of the selected voice. How does it sound?", 
      { voice: selectedVoice, rate, pitch }
    );
  };
  
  // Save the settings
  const saveSettings = () => {
    if (selectedVoice) {
      setVoice(selectedVoice);
    }
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Voice Settings</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Voice:</label>
            <Select
              value={selectedVoice || ''}
              onValueChange={setSelectedVoice}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(groupedVoices).map(([lang, voices]) => (
                  <div key={lang}>
                    <div className="text-xs font-bold text-muted-foreground py-1 px-2">
                      {lang}
                    </div>
                    {voices.map(voice => (
                      <SelectItem 
                        key={voice.voiceURI} 
                        value={voice.name}
                      >
                        {voice.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Speech Rate:</label>
            <Slider
              value={[rate]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={(values) => setRate(values[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slow</span>
              <span>{rate.toFixed(1)}x</span>
              <span>Fast</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Pitch:</label>
            <Slider
              value={[pitch]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={(values) => setPitch(values[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>{pitch.toFixed(1)}x</span>
              <span>High</span>
            </div>
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button variant="outline" onClick={resetUsageMetrics}>
              Reset Usage Limits
            </Button>
            <Button onClick={testVoice}>
              Test Voice
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={saveSettings}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TTSSettingsDialog;
