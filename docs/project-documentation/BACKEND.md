
# Backend Documentation

The backend is currently implemented using Supabase, but is designed to be portable to other backend services.

## Supabase Integration

### Authentication
Authentication is implemented using Supabase Auth:
- Email/password authentication
- OAuth providers (Google)
- JWT token management
- Session management

### Database
The application uses Supabase PostgreSQL database with Row Level Security:
- Tables for users, profiles, songs, radio stations, etc.
- RLS policies for secure access control
- Database triggers for automation
- Foreign key relationships for data integrity

### Edge Functions
Serverless functions are located in `/supabase/functions/`:

- **ai-broadcaster**: Generates AI responses for the DJ broadcaster
```typescript
// Example edge function call
const { data, error } = await supabase.functions.invoke('ai-broadcaster', {
  body: { message: userInput, context: conversationHistory }
});
```

- **send-notification**: Sends notifications to users
```typescript
// Example edge function call
const { data, error } = await supabase.functions.invoke('send-notification', {
  body: { userId, message, type: 'broadcast' }
});
```

- **update-radio-metrics**: Updates radio station metrics
```typescript
// Example edge function call
const { data, error } = await supabase.functions.invoke('update-radio-metrics', {
  body: { stationId, listeners: currentListeners, duration }
});
```

### Storage
Supabase Storage is used for:
- User avatars
- Station logos
- Audio files
- Other media assets

```typescript
// Example storage usage
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}.jpg`, file);
```

## API Integration Points

### Backend API Structure

The application uses a RESTful API structure implemented through Supabase:

1. **Authentication API**: User registration, login, and session management
2. **Profile API**: User profile management
3. **Radio API**: Radio station management and streaming
4. **Content API**: Song and playlist management
5. **Admin API**: Administrative functions and dashboard data

### Data Flow

1. Client makes request to Supabase API
2. JWT token authenticates the request
3. Row Level Security policies validate access
4. Database operation is performed
5. Response is returned to the client

### Error Handling

Backend error handling includes:
- HTTP status codes for different error types
- Detailed error messages for debugging
- Error logging for monitoring
- Graceful failure modes for service interruptions

## External Service Integrations

### AI Services
- **OpenRouter**: Used as a fallback for AI text generation
- **Google Gemini API**: Primary AI provider for text generation
- **ElevenLabs**: Text-to-speech service for the AI broadcaster

#### AI Integration Flow
1. User interacts with the AI DJ
2. The system attempts to generate a response using Gemini
3. If Gemini fails, the system falls back to OpenRouter
4. The text response is converted to speech using ElevenLabs
5. The audio is played through the streaming components

### Database Operations
Main database operations are organized by feature:

#### User Management
```typescript
// Create user profile
const { data, error } = await supabase
  .from('profiles')
  .insert([{ id: user.id, username: username }]);

// Update user profile
const { data, error } = await supabase
  .from('profiles')
  .update({ username: newUsername })
  .eq('id', user.id);

// Get user profile
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();
```

#### Radio Stations
```typescript
// Get all radio stations
const { data, error } = await supabase
  .from('radio_stations')
  .select('*')
  .eq('is_active', true);

// Get specific radio station
const { data, error } = await supabase
  .from('radio_stations')
  .select('*')
  .eq('id', stationId)
  .single();

// Update radio station listener count
const { data, error } = await supabase
  .from('radio_stations')
  .update({ listeners_count: newCount })
  .eq('id', stationId);
```

#### Content Management
```typescript
// Get songs
const { data, error } = await supabase
  .from('songs')
  .select('*')
  .order('created_at', { ascending: false });

// Add new song
const { data, error } = await supabase
  .from('songs')
  .insert([{ title, artist, album, url, user_id: userId }]);

// Delete song
const { error } = await supabase
  .from('songs')
  .delete()
  .eq('id', songId);
```

## Potential Backend Alternatives

The application is designed to be portable to alternative backend services:

### Firebase Alternative
- Authentication: Firebase Authentication
- Database: Firestore
- Functions: Firebase Cloud Functions
- Storage: Firebase Storage

### Cloudflare Alternative
- Authentication: Custom JWT implementation
- Database: Cloudflare D1 or KV
- Functions: Cloudflare Workers
- Storage: Cloudflare R2

