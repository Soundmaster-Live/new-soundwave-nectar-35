import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export type AudioQuality = 'low' | 'medium' | 'high';
export type AudioFormat = 'mp3' | 'aac' | 'ogg';

interface AudioQualitySetting {
  bitrate: number;
  format: AudioFormat;
}

const QUALITY_SETTINGS: Record<AudioQuality, AudioQualitySetting> = {
  low: { bitrate: 64, format: 'mp3' },
  medium: { bitrate: 128, format: 'mp3' },
  high: { bitrate: 320, format: 'mp3' }
};

export const useAudioQuality = (
  initialQuality: AudioQuality = 'medium',
  onQualityChange?: (quality: AudioQualitySetting) => void
) => {
  const [quality, setQuality] = useState<AudioQuality>(initialQuality);
  const [format, setFormat] = useState<AudioFormat>(QUALITY_SETTINGS[initialQuality].format);
  const { toast } = useToast();

  // Update format when quality changes
  useEffect(() => {
    const newFormat = QUALITY_SETTINGS[quality].format;
    setFormat(newFormat);
    
    // Call the callback if provided
    if (onQualityChange) {
      onQualityChange(QUALITY_SETTINGS[quality]);
    }
    
    console.log(`Audio quality changed to: ${quality} (${QUALITY_SETTINGS[quality].bitrate}kbps ${newFormat})`);
  }, [quality, onQualityChange]);

  // Change quality with UI feedback
  const changeQuality = useCallback((newQuality: AudioQuality) => {
    if (newQuality === quality) return;
    
    setQuality(newQuality);
    toast({
      title: "Audio Quality Changed",
      description: `Streaming at ${QUALITY_SETTINGS[newQuality].bitrate}kbps ${QUALITY_SETTINGS[newQuality].format.toUpperCase()}`,
      variant: "default",
    });
  }, [quality, toast]);

  // Change format directly
  const changeFormat = useCallback((newFormat: AudioFormat) => {
    if (newFormat === format) return;
    
    setFormat(newFormat);
    console.log(`Audio format changed to: ${newFormat}`);
    
    // Find a quality preset that matches this format, or keep current quality
    const matchingQuality = Object.entries(QUALITY_SETTINGS).find(
      ([_, settings]) => settings.format === newFormat
    );
    
    if (matchingQuality) {
      setQuality(matchingQuality[0] as AudioQuality);
    }
  }, [format]);

  return {
    quality,
    format,
    bitrate: QUALITY_SETTINGS[quality].bitrate,
    changeQuality,
    changeFormat,
    qualitySettings: QUALITY_SETTINGS
  };
};
