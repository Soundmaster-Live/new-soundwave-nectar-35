# Audio Streaming Hooks

This directory contains a collection of focused React hooks that work together to provide audio streaming functionality.

## Main Hook

- `useAudioStream`: The main hook that combines all other hooks to provide a complete streaming solution.

## Supporting Hooks

- `useStreamInitializer`: Handles the initialization and lifecycle of the audio stream.
- `useStreamFallback`: Manages fallback URLs when a stream fails to load, with automatic recovery.
- `useStreamMetadata`: Handles fetching and updating stream metadata (artist, title, etc.).
- `useAudioStreamError`: Provides error handling and retry logic for stream errors.
- `usePlaybackControls`: Controls for play, pause, and toggle functionality with enhanced state monitoring.
- `useVolumeControls`: Controls for volume adjustment and muting.
- `useAudioQuality`: Manages audio quality and format selection for optimal streaming.

## Usage Example

```tsx
import { useAudioStream } from '@/components/streaming/hooks/useAudioStream';

function AudioPlayer() {
  const { 
    isPlaying, 
    togglePlayback, 
    volume, 
    handleVolumeChange,
    toggleMute,
    isMuted,
    streamMetadata,
    isBuffering,
    changeQuality,
    quality
  } = useAudioStream('https://example.com/stream', 0.7);

  return (
    <div>
      <button onClick={togglePlayback}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      {/* Quality selector */}
      <select 
        value={quality} 
        onChange={(e) => changeQuality(e.target.value as 'low' | 'medium' | 'high')}
      >
        <option value="low">Low Quality</option>
        <option value="medium">Medium Quality</option>
        <option value="high">High Quality</option>
      </select>
      {/* Other player controls */}
    </div>
  );
}
```

## How These Hooks Work Together

1. `useAudioStream` serves as the main hook that combines all functionality
2. `useStreamInitializer` handles setting up and tearing down the Howler.js audio stream
3. `useStreamFallback` provides alternative stream URLs if the primary stream fails, with automatic retry
4. `useAudioStreamError` handles error scenarios with retries
5. `usePlaybackControls` and `useVolumeControls` provide user interaction functionality with enhanced state tracking
6. `useStreamMetadata` keeps track of what's playing on the stream
7. `useAudioQuality` manages streaming quality settings for optimal performance

This modular approach makes the code more maintainable and allows for easier testing and future enhancements.
