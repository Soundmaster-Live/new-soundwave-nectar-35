
# Architecture Documentation

## Application Structure

The SoundMaster application follows a component-based architecture with clear separation of concerns:

```
/src
  /components     # Reusable UI components
  /contexts       # React context providers
  /hooks          # Custom React hooks
  /integrations   # External service integrations
  /lib            # Utility functions
  /pages          # Main application pages
  /types          # TypeScript type definitions
  /utils          # Helper functions
```

## Key Design Patterns

### Component Composition
The application uses component composition to build complex UI elements from smaller, focused components. For example, the `LiveStreamPlayer` combines several smaller components like `PlayButton` and `StatusIndicator`.

### Custom Hooks
Custom hooks are used to encapsulate and reuse stateful logic across components. For example, `useAudioStream` provides all the functionality needed for audio streaming.

### Context Providers
React Context is used for global state management. For example, `AdminProvider` manages the admin status across the application.

### Protected Routes
The application implements protected routes using wrapper components that check authentication status before rendering protected content.

## Data Flow

1. **User Authentication**:
   - User credentials flow through the Auth components to Supabase
   - Authentication state is managed by Supabase and reflected in the UI
   - Protected routes check authentication status before rendering

2. **Audio Streaming**:
   - Stream URLs are provided to the `useAudioStream` hook
   - The hook initializes Howler.js for audio playback
   - Play/pause controls update the Howler instance
   - Stream status flows back to UI components

3. **Admin Features**:
   - Admin status is checked through the Supabase profiles table
   - Admin-specific routes and features are conditionally rendered
   - Admin operations are secured through Row Level Security in Supabase

## API Integration

The application integrates with several external services:

1. **Supabase**:
   - Authentication
   - Database storage
   - Edge functions

2. **Kick.com**:
   - Embedded video streaming

3. **Audio Streaming Services**:
   - Integration with audio streaming APIs

## State Management

The application uses a combination of state management approaches:

1. **Local Component State**:
   - Used for UI-specific state like form input values

2. **React Context**:
   - Used for global state like authentication and theme

3. **React Query**:
   - Used for server state management and data fetching

4. **URL State**:
   - Used for navigation and preserving UI state across page refreshes
