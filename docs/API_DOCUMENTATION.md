
# API Documentation

This document provides detailed information about the APIs used in the SoundMaster Radio application.

## Table of Contents
1. [Authentication API](#authentication-api)
2. [AI Integration API](#ai-integration-api)
3. [Database API](#database-api)
4. [Storage API](#storage-api)
5. [Edge Functions API](#edge-functions-api)
6. [External API Integrations](#external-api-integrations)
7. [Error Handling](#error-handling)

## Authentication API

### Supabase Authentication

#### Sign Up
Creates a new user account.

**Request:**
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      first_name: 'John',
      last_name: 'Doe'
    }
  }
});
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "user_metadata": {
        "first_name": "John",
        "last_name": "Doe"
      }
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token",
      "expires_in": 3600
    }
  },
  "error": null
}
```

#### Sign In with Email
Authenticates a user with email and password.

**Request:**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token",
      "expires_in": 3600
    }
  },
  "error": null
}
```

#### Sign In with Provider (OAuth)
Authenticates a user with a third-party provider.

**Request:**
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
});
```

**Response:**
Redirects to the OAuth provider's authentication page.

#### Sign Out
Logs out the current user.

**Request:**
```typescript
const { error } = await supabase.auth.signOut();
```

**Response:**
```json
{
  "error": null
}
```

#### Get Current Session
Retrieves the current user session.

**Request:**
```typescript
const { data, error } = await supabase.auth.getSession();
```

**Response:**
```json
{
  "data": {
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token",
      "expires_in": 3600,
      "user": {
        "id": "user-uuid",
        "email": "user@example.com"
      }
    }
  },
  "error": null
}
```

### Firebase Authentication (Alternative)

#### Sign Up with Email
```typescript
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../integrations/firebase/client";

const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};
```

#### Sign In with Email
```typescript
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../integrations/firebase/client";

const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};
```

## AI Integration API

### Google Gemini API

#### Generate Text Response
Generates AI text responses using the Google Gemini API.

**Request:**
```typescript
const generateGeminiResponse = async (
  userInput: string, 
  conversationContext: string = ""
) => {
  try {
    const apiKey = await getApiKey('GOOGLE_API_KEY', DEFAULT_API_KEYS.GOOGLE_API_KEY);
    if (!apiKey) throw new Error('Gemini API key not configured');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const fullPrompt = conversationContext 
      ? `${conversationContext}\n\n${userInput}` 
      : userInput;
      
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      content: text,
      success: true
    };
  } catch (error) {
    console.error('Gemini Response error:', error);
    throw error;
  }
};
```

**Response:**
```json
{
  "content": "This is the AI generated text response.",
  "success": true
}
```

### OpenRouter API

#### Generate Text Response
Generates AI text responses using OpenRouter as a fallback.

**Request:**
```typescript
const generateOpenRouterResponse = async (
  userInput: string, 
  conversationContext: string = ""
) => {
  try {
    const apiKey = await getApiKey('OPENROUTER_API_KEY', DEFAULT_API_KEYS.OPENROUTER_API_KEY);
    if (!apiKey) throw new Error('OpenRouter API key not configured');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: "system",
            content: "You are a South African DJ on SoundMaster Radio."
          },
          {
            role: "user",
            content: conversationContext ? `${conversationContext}\n\n${userInput}` : userInput
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      })
    });

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      success: true
    };
  } catch (error) {
    console.error('OpenRouter Response error:', error);
    throw error;
  }
};
```

**Response:**
```json
{
  "content": "This is the AI generated text response from OpenRouter.",
  "success": true
}
```

### ElevenLabs API

#### Generate Speech
Converts text to speech using ElevenLabs API.

**Request:**
```typescript
const generateSpeech = async (
  text: string,
  voiceId: string = "EXAVITQu4vr4xnSDxMaL",
  options = {}
) => {
  try {
    const apiKey = await getApiKey('elevenlabs_api_key');
    if (!apiKey) throw new Error('ElevenLabs API key not found');
    
    const defaultOptions = {
      optimize_streaming_latency: 0,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      }
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          ...mergedOptions
        }),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${errorText}`);
    }
    
    return response;
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    throw error;
  }
};
```

**Response:**
An audio stream in MP3 format.

#### Get Voice List
Retrieves available voices from ElevenLabs.

**Request:**
```typescript
const getVoices = async () => {
  try {
    const apiKey = await getApiKey('elevenlabs_api_key');
    if (!apiKey) throw new Error('ElevenLabs API key not found');
    
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': apiKey,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch voices from ElevenLabs');
    }
    
    const data = await response.json();
    return data.voices;
  } catch (error) {
    console.error('Error fetching ElevenLabs voices:', error);
    throw error;
  }
};
```

**Response:**
```json
[
  {
    "voice_id": "EXAVITQu4vr4xnSDxMaL",
    "name": "Sarah",
    "preview_url": "https://api.elevenlabs.io/v1/voices/EXAVITQu4vr4xnSDxMaL/preview"
  },
  {
    "voice_id": "TX3LPaxmHKxFdv7VOQHJ",
    "name": "Liam",
    "preview_url": "https://api.elevenlabs.io/v1/voices/TX3LPaxmHKxFdv7VOQHJ/preview"
  }
]
```

## Database API

### User Profiles

#### Get User Profile
Retrieves user profile information.

**Request:**
```typescript
const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};
```

**Response:**
```json
{
  "data": {
    "id": "user-uuid",
    "username": "johndoe",
    "is_admin": false,
    "created_at": "2023-01-01T00:00:00.000Z",
    "avatar_url": "https://example.com/avatar.jpg"
  },
  "error": null
}
```

#### Update User Profile
Updates user profile information.

**Request:**
```typescript
const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return { data, error };
};
```

**Response:**
```json
{
  "data": [
    {
      "id": "user-uuid",
      "username": "updated_username",
      "is_admin": false,
      "created_at": "2023-01-01T00:00:00.000Z",
      "avatar_url": "https://example.com/new-avatar.jpg"
    }
  ],
  "error": null
}
```

### Radio Stations

#### Get Radio Stations
Retrieves all active radio stations.

**Request:**
```typescript
const getRadioStations = async () => {
  const { data, error } = await supabase
    .from('radio_stations')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  return { data, error };
};
```

**Response:**
```json
{
  "data": [
    {
      "id": "station-uuid-1",
      "name": "Chill FM",
      "stream_url": "https://example.com/stream/chill",
      "description": "Relaxing music 24/7",
      "genre": "Ambient",
      "listeners_count": 120,
      "is_active": true
    },
    {
      "id": "station-uuid-2",
      "name": "Dance FM",
      "stream_url": "https://example.com/stream/dance",
      "description": "Electronic dance music",
      "genre": "Electronic",
      "listeners_count": 350,
      "is_active": true
    }
  ],
  "error": null
}
```

#### Get Station Details
Retrieves details for a specific radio station.

**Request:**
```typescript
const getStationDetails = async (stationId: string) => {
  const { data, error } = await supabase
    .from('radio_stations')
    .select('*, radio_shows(*)')
    .eq('id', stationId)
    .single();
  
  return { data, error };
};
```

**Response:**
```json
{
  "data": {
    "id": "station-uuid-1",
    "name": "Chill FM",
    "stream_url": "https://example.com/stream/chill",
    "description": "Relaxing music 24/7",
    "genre": "Ambient",
    "listeners_count": 120,
    "is_active": true,
    "radio_shows": [
      {
        "id": "show-uuid-1",
        "title": "Morning Chill",
        "description": "Start your day with relaxing tunes",
        "day": 1,
        "start_time": "08:00",
        "end_time": "10:00",
        "dj": "Alex"
      }
    ]
  },
  "error": null
}
```

### Songs and Playlists

#### Get Songs
Retrieves songs with optional filtering.

**Request:**
```typescript
const getSongs = async (filters = {}) => {
  let query = supabase
    .from('songs')
    .select('*')
    .order('title');
  
  // Apply filters
  if (filters.title) {
    query = query.ilike('title', `%${filters.title}%`);
  }
  if (filters.artist) {
    query = query.ilike('artist', `%${filters.artist}%`);
  }
  if (filters.genre) {
    query = query.eq('genre', filters.genre);
  }
  
  const { data, error } = await query;
  return { data, error };
};
```

**Response:**
```json
{
  "data": [
    {
      "id": "song-uuid-1",
      "title": "Chill Vibes",
      "artist": "Ambient Artist",
      "album": "Relaxation",
      "genre": "Ambient",
      "year": 2022
    },
    {
      "id": "song-uuid-2",
      "title": "Dance Party",
      "artist": "DJ Electronic",
      "album": "Club Mix",
      "genre": "Electronic",
      "year": 2023
    }
  ],
  "error": null
}
```

## Storage API

### File Upload

#### Upload File
Uploads a file to Supabase Storage.

**Request:**
```typescript
const uploadFile = async (bucketName: string, filePath: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });
  
  return { data, error };
};
```

**Response:**
```json
{
  "data": {
    "path": "avatars/user-123/profile.jpg"
  },
  "error": null
}
```

#### Get Public URL
Retrieves the public URL for a file.

**Request:**
```typescript
const getPublicUrl = (bucketName: string, filePath: string) => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};
```

**Response:**
```
"https://fyfrrrwmrjgqbvseqqje.supabase.co/storage/v1/object/public/avatars/user-123/profile.jpg"
```

#### Delete File
Deletes a file from storage.

**Request:**
```typescript
const deleteFile = async (bucketName: string, filePath: string) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);
  
  return { data, error };
};
```

**Response:**
```json
{
  "data": [
    "avatars/user-123/profile.jpg"
  ],
  "error": null
}
```

## Edge Functions API

### AI Broadcaster Function

#### Generate AI Content
Generates content for the AI broadcaster.

**Request:**
```typescript
const generateBroadcasterContent = async (prompt: string, topic: string) => {
  const { data, error } = await supabase.functions.invoke('ai-broadcaster', {
    body: { prompt, topic }
  });
  
  return { data, error };
};
```

**Response:**
```json
{
  "data": {
    "text": "Hey music lovers! This is DJ Max coming at you with the freshest beats on SoundMaster Radio. Up next we've got an amazing track that's been climbing the charts...",
    "topic": "music"
  },
  "error": null
}
```

### Notification Function

#### Send Notification
Sends a notification to a user.

**Request:**
```typescript
const sendNotification = async (userId: string, message: string, type: string) => {
  const { data, error } = await supabase.functions.invoke('send-notification', {
    body: { userId, message, type }
  });
  
  return { data, error };
};
```

**Response:**
```json
{
  "data": {
    "message": "Notification sent successfully"
  },
  "error": null
}
```

## External API Integrations

### API Key Management

#### Get API Key
Retrieves an API key from Supabase settings or fallback source.

**Implementation:**
```typescript
export const getApiKey = async (keyName: string, fallbackKey?: string): Promise<string | null> => {
  try {
    // First try localStorage as a quick check (for ElevenLabs keys)
    if (keyName === 'elevenlabs_api_key') {
      const localKey = localStorage.getItem(keyName);
      if (localKey) return localKey;
    }
    
    // Then try Supabase
    const { data: settings, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', keyName)
      .maybeSingle();
    
    if (error) {
      console.warn(`Error fetching API key for ${keyName}:`, error);
    }
    
    if (settings?.value) {
      return settings.value;
    }
    
    // Return fallback key if provided and no key was found in Supabase
    return fallbackKey || null;
  } catch (error) {
    console.error(`Failed to get API key for ${keyName}:`, error);
    return fallbackKey || null;
  }
};
```

#### Get AI Provider
Determines the preferred AI provider based on available API keys.

**Implementation:**
```typescript
export const getAIProvider = async (): Promise<{provider: string, apiKey: string | null}> => {
  // Try Gemini first (primary provider)
  const geminiKey = await getApiKey('GOOGLE_API_KEY', DEFAULT_API_KEYS.GOOGLE_API_KEY);
  
  if (geminiKey) {
    return { provider: 'gemini', apiKey: geminiKey };
  }
  
  // Fall back to OpenRouter if Gemini key is not available
  const openrouterKey = await getApiKey('OPENROUTER_API_KEY', DEFAULT_API_KEYS.OPENROUTER_API_KEY);
  
  if (openrouterKey) {
    return { provider: 'openrouter', apiKey: openrouterKey };
  }
  
  // If no keys are available
  return { provider: 'none', apiKey: null };
};
```

## Error Handling

### API Error Structure

Standard error response format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      // Additional error details if available
    }
  }
}
```

### Common Error Codes

| Error Code | Description | HTTP Status |
|------------|-------------|-------------|
| auth/invalid-credentials | Invalid email or password | 401 |
| auth/email-already-in-use | Email is already registered | 400 |
| auth/weak-password | Password doesn't meet requirements | 400 |
| db/not-found | Requested resource not found | 404 |
| db/constraint-violation | Database constraint violation | 400 |
| api/rate-limit | API rate limit exceeded | 429 |
| api/key-invalid | Invalid API key | 401 |
| ai/generation-failed | Failed to generate AI content | 500 |
| tts/speech-generation-failed | Failed to generate speech | 500 |

### Error Handling Best Practices

1. **Client-Side Error Handling**
   ```typescript
   try {
     const { data, error } = await apiCall();
     if (error) {
       // Handle specific error types
       if (error.code === 'auth/invalid-credentials') {
         // Show invalid credentials message
       } else {
         // Show generic error message
       }
       return null;
     }
     return data;
   } catch (error) {
     // Handle unexpected errors
     console.error('Unexpected error:', error);
     // Show fallback error message
     return null;
   }
   ```

2. **API Response Error Handling**
   ```typescript
   // Server-side error response
   if (!isValidRequest) {
     return new Response(
       JSON.stringify({
         error: {
           code: 'invalid-request',
           message: 'The request is invalid',
           details: { missing: ['required_field'] }
         }
       }),
       {
         status: 400,
         headers: { 'Content-Type': 'application/json' }
       }
     );
   }
   ```

3. **Network Error Recovery**
   ```typescript
   const fetchWithRetry = async (url, options, retries = 3) => {
     try {
       return await fetch(url, options);
     } catch (error) {
       if (retries > 0) {
         console.log(`Retrying... (${retries} attempts left)`);
         await new Promise(r => setTimeout(r, 1000));
         return fetchWithRetry(url, options, retries - 1);
       }
       throw error;
     }
   };
   ```
