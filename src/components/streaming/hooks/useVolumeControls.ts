
import { useCallback } from "react";
import { Howl } from "howler";

export const useVolumeControls = (
  sound: Howl | null,
  volume: number,
  setVolume: React.Dispatch<React.SetStateAction<number>>,
  isMuted: boolean,
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleVolumeChange = useCallback((newVolume: number[]) => {
    if (!sound) return;
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    sound.volume(volumeValue);
    console.log("Volume changed to:", volumeValue);
  }, [sound, setVolume]);

  const changeVolume = useCallback((volumeValue: number) => {
    if (!sound) return;
    setVolume(volumeValue);
    sound.volume(volumeValue);
    console.log("Volume set to:", volumeValue);
  }, [sound, setVolume]);

  const toggleMute = useCallback(() => {
    if (!sound) return;
    setIsMuted(!isMuted);
    sound.mute(!isMuted);
    console.log("Mute toggled:", !isMuted);
  }, [sound, isMuted, setIsMuted]);

  return { handleVolumeChange, changeVolume, toggleMute };
};
