
# Custom Hooks Documentation

## Audio Streaming Hooks

### useAudioStream (`src/components/streaming/hooks/useAudioStream.ts`)

A custom hook that provides audio streaming functionality using the Howler.js library.

#### Parameters:
- `streamUrl`: URL of the audio stream
- `defaultVolume`: Default volume level (0-1), defaults to 0.7

#### Returns:
- `isPlaying`: Boolean indicating if the stream is playing
- `setIsPlaying`: Function to set the playing state
- `volume`: Current volume level (0-1)
- `isMuted`: Boolean indicating if the stream is muted
- `togglePlayback`: Function to toggle play/pause
- `play`: Function to start playback
- `pause`: Function to pause playback
- `handleVolumeChange`: Function to handle volume changes
- `changeVolume`: Function to set volume directly
- `toggleMute`: Function to toggle mute state
- `streamMetadata`: Object containing metadata about the current stream
- `isBuffering`: Boolean indicating if the stream is buffering
- `quality`: Current audio quality setting ('low', 'medium', 'high')
- `changeQuality`: Function to change audio quality
- `format`: Current audio format ('mp3', 'aac', 'ogg')
- `changeFormat`: Function to change audio format
- `bitrate`: Current bitrate in kbps

#### Usage Example:
```jsx
const { 
  isPlaying, 
  togglePlayback, 
  volume, 
  handleVolumeChange,
  toggleMute,
  isMuted,
  streamMetadata,
  isBuffering,
  quality,
  changeQuality
} = useAudioStream('https://example.com/stream.mp3', 0.5);
```

### useAudioQuality (`src/components/streaming/hooks/useAudioQuality.ts`)

A custom hook for managing audio quality and format settings.

#### Parameters:
- `initialQuality`: Initial quality setting ('low', 'medium', 'high'), defaults to 'medium'
- `onQualityChange`: Optional callback function triggered when quality changes

#### Returns:
- `quality`: Current audio quality setting ('low', 'medium', 'high')
- `format`: Current audio format ('mp3', 'aac', 'ogg')
- `bitrate`: Current bitrate in kbps
- `changeQuality`: Function to change audio quality with a toast notification
- `changeFormat`: Function to change audio format
- `qualitySettings`: Object containing all available quality presets

#### Usage Example:
```jsx
const { 
  quality, 
  format, 
  bitrate, 
  changeQuality 
} = useAudioQuality('medium', (newSettings) => {
  console.log(`Quality changed to ${newSettings.bitrate}kbps ${newSettings.format}`);
});
```

#### Implementation Details:
The hook includes:
- Predefined quality settings with corresponding bitrates and formats
- Toast notifications when quality is changed
- Format autodetection based on quality selection
- Console logging for debugging

#### Error Handling:
The hook includes comprehensive error handling:
- Retries stream connection up to 3 times on failure
- Displays toast notifications for persistent errors
- Logs detailed error information to console
- Manages buffering states to provide visual feedback

#### Limitations:
- Requires a valid stream URL for proper functionality
- Some streaming formats may not be supported in all browsers
- Stream metadata is currently simulated and would need to be connected to actual stream metadata in production
