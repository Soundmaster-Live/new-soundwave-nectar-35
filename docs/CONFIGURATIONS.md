
# Configuration Documentation

## Environment Variables

The application uses the following environment variables:

```
VITE_CLERK_PUBLISHABLE_KEY    # (If using Clerk for auth)
SUPABASE_URL                  # Supabase project URL
SUPABASE_ANON_KEY             # Supabase anonymous key
```

## Build Configuration

### Vite Configuration (`vite.config.ts`)

The application uses Vite as its build tool with the following configuration:

- Path aliases: `@` points to the `src` directory
- React SWC plugin for fast compilation
- Development server runs on port 8080
- Component tagger for development mode

### TypeScript Configuration (`tsconfig.json`)

Key TypeScript configurations:

- Target: ES2020
- Module: ESNext
- React JSX handling
- Strict type checking
- Path aliases matching Vite configuration

## Supabase Configuration

### Authentication

Authentication is handled by Supabase with:

- Email/password authentication
- Row Level Security (RLS) policies
- User profiles table for additional user data

### Database Tables

Main database tables:

- `profiles`: User profile information
- `songs`: Music tracks information
- `stations`: Radio station information
- `playlists`: Music playlists
- `radio_shows`: Scheduled radio shows
- `notifications`: User notifications

### Edge Functions

Supabase Edge Functions:

- `send-notification`: Sends notifications to users
- `update-radio-metrics`: Updates radio station metrics

## React Router Configuration

Routes are defined in `src/components/routing/AppRoutes.tsx` with the following structure:

- Public routes:
  - Home (`/`)
  - About (`/about`)
  - Contact (`/contact`)
  - Services (`/services`)
  - Auth (`/auth`)
  - Live Radio (`/live-radio`)

- Protected routes:
  - Admin (`/admin`)
  - Admin Dashboard (`/admin/dashboard`)
  - Live Lesson (`/live-lesson`)

## TailwindCSS Configuration

TailwindCSS is configured in `tailwind.config.ts` with:

- Custom color palette
- Extended theme configuration
- Custom plugins
- Integration with shadcn/ui
