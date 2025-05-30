
# Components Documentation

## Core Components

### Navbar (`src/components/Navbar.tsx`)
The navigation bar component provides links to all major sections of the application.

#### Features:
- Responsive design with mobile menu
- Dynamic navigation links with icons
- Authentication buttons (Login/Register)
- Live Radio button

#### Key Props:
None - the component is self-contained

#### Usage Example:
```jsx
<Navbar />
```

### LiveStreamPlayer (`src/components/streaming/player/LiveStreamPlayer.tsx`)
The main audio player component for streaming live radio.

#### Features:
- Play/pause controls
- Volume adjustment
- Mute toggle
- Stream metadata display
- Status indicators
- Modal for video streaming

#### Key Props:
None - the component is self-contained and uses the useAudioStream hook internally

#### Usage Example:
```jsx
<LiveStreamPlayer />
```

### PlayButton (`src/components/streaming/player/PlayButton.tsx`)
Button component for controlling audio playback.

#### Features:
- Visual indication of playing state
- Loading state display
- Play/pause functionality

#### Key Props:
- `isPlaying`: Boolean indicating if audio is playing
- `onClick`: Function to handle click events
- `isBuffering`: Boolean indicating if audio is buffering
- `onPlay`: Optional function for play action
- `onPause`: Optional function for pause action

#### Usage Example:
```jsx
<PlayButton 
  isPlaying={isPlaying}
  onClick={handlePlayPause}
  isBuffering={isBuffering}
  onPlay={handlePlay}
  onPause={handlePause}
/>
```

### StatusIndicator (`src/components/streaming/player/StatusIndicator.tsx`)
Visual indicator for the current stream status.

#### Features:
- Displays stream type
- Shows playing/buffering/stopped status
- Visual indicator for live status

#### Key Props:
- `isPlaying`: Boolean indicating if audio is playing
- `streamType`: String describing the type of stream
- `isBuffering`: Boolean indicating if audio is buffering

#### Usage Example:
```jsx
<StatusIndicator 
  isPlaying={isPlaying}
  streamType="Live Radio"
  isBuffering={isBuffering}
/>
```
