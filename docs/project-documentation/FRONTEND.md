
# Frontend Documentation

This document provides detailed information about the frontend components and structure of the SoundMaster Radio application.

## Directory Structure
```
/src
  /components       # Reusable UI components
    /ui             # Base UI components from shadcn/ui
    /streaming      # Audio streaming components
    /ai-broadcaster # AI DJ components
    /navbar         # Navigation components
    /home           # Home page components
    /auth           # Authentication components
    /admin          # Admin dashboard components
  /hooks            # Custom React hooks
  /contexts         # React context providers
  /pages            # Page components
  /utils            # Utility functions
    /ai             # AI integration utilities
  /lib              # Library code and helpers
  /types            # TypeScript type definitions
  /integrations     # External service integrations
```

## Key Components

### Streaming Components
The audio streaming functionality is implemented in `/src/components/streaming` with:

- **LiveStreamPlayer**: Main player component that handles audio playback
- **PlayButton**: Controls for playing/pausing audio
- **StatusIndicator**: Visual indicator for stream status

These components use the `useAudioStream` hook (`/src/components/streaming/hooks/useAudioStream.ts`) which wraps Howler.js for audio playback.

### AI Broadcaster Components
The AI DJ functionality is implemented in `/src/components/ai-broadcaster` with:

- **AIBroadcaster**: Main component that renders the AI DJ interface
- **BroadcasterMessage**: Renders individual messages from the AI DJ
- **TTSSettingsDialog**: Dialog for configuring text-to-speech settings

These components use the `useBroadcaster` hook (`/src/components/ai-broadcaster/useBroadcaster.tsx`) which orchestrates AI text generation and speech synthesis.

### Authentication Components
Authentication UI is implemented in `/src/pages/Auth.tsx` with:

- Email/password authentication
- Google OAuth integration (configurable)
- Registration and login flows
- Password reset functionality

## Custom Hooks

### useAudioStream
Provides audio streaming functionality with:
- Playback controls (play, pause, volume)
- Stream status monitoring
- Error handling and retry logic
- Stream metadata updates

```typescript
// Example usage
const { 
  playing, 
  volume, 
  status, 
  play, 
  pause, 
  setVolume 
} = useAudioStream(streamUrl);
```

### useBroadcaster
Manages the AI broadcaster with:
- Text generation using AI models
- Speech synthesis using ElevenLabs
- Conversation history management
- Error handling and reconnection logic

```typescript
// Example usage
const {
  messages,
  isLoading,
  error,
  sendMessage,
  resetConversation
} = useBroadcaster();
```

### useAuth
Handles authentication state with:
- User session management
- Profile data fetching
- Role-based access control

```typescript
// Example usage
const {
  user,
  isAdmin,
  signIn,
  signOut,
  signUp
} = useAuth();
```

## Routing
The application uses React Router for navigation, with routes defined in `/src/components/routing/AppRoutes.tsx`:

- Public routes: Home, About, Services, Auth, Live Radio
- Protected routes: Dashboard, Live Lesson
- Admin routes: Admin Dashboard

## State Management

### Local Component State
Used for component-specific state that doesn't need to be shared.

```typescript
const [isOpen, setIsOpen] = useState(false);
```

### Context API
Used for global application state that needs to be accessed by multiple components.

```typescript
// Creating context
export const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Providing context
<AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
  {children}
</AdminContext.Provider>

// Consuming context
const { isAdmin } = useContext(AdminContext);
```

### React Query
Used for server state management and data fetching.

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['radioStations'],
  queryFn: fetchRadioStations
});
```

## UI Component Library

The application uses Shadcn UI components, which are based on Radix UI primitives. These components are imported from `/src/components/ui/`.

```typescript
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
```

## Styling

The application uses Tailwind CSS for styling components.

```tsx
<div className="flex flex-col items-center p-4 bg-slate-100 rounded-lg">
  <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Content */}
  </div>
</div>
```

## Error Handling

Frontend error handling is implemented using:

1. **Error boundaries**: For catching and displaying component errors
2. **Try/catch blocks**: For handling async operations
3. **Error states**: For displaying error messages to users

```tsx
// Example error state in a component
const [error, setError] = useState<string | null>(null);

// Displaying the error
{error && <Alert variant="destructive">{error}</Alert>}
```

