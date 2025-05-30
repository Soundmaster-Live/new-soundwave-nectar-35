
# API Reference

This document provides reference information for the APIs used in the SoundMaster Radio application.

## Authentication API

### Sign Up
```typescript
const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};
```

### Sign In
```typescript
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};
```

### Sign Out
```typescript
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
```

### Password Reset
```typescript
const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};
```

### Update User
```typescript
const updateUser = async (updates: UserAttributes) => {
  const { data, error } = await supabase.auth.updateUser(updates);
  return { data, error };
};
```

## Profile API

### Get Profile
```typescript
const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};
```

### Update Profile
```typescript
const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return { data, error };
};
```

### Upload Avatar
```typescript
const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });
  
  if (uploadError) {
    return { error: uploadError };
  }
  
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
  
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: urlData.publicUrl })
    .eq('id', userId);
  
  return { data: urlData, error: updateError };
};
```

## Radio Station API

### Fetch Radio Stations
```typescript
const fetchRadioStations = async () => {
  const { data, error } = await supabase
    .from('radio_stations')
    .select('*')
    .eq('is_active', true);
  
  return { data, error };
};
```

### Get Station Details
```typescript
const getStationDetails = async (stationId: string) => {
  const { data, error } = await supabase
    .from('radio_stations')
    .select('*')
    .eq('id', stationId)
    .single();
  
  return { data, error };
};
```

### Update Station
```typescript
const updateStation = async (stationId: string, updates: any) => {
  const { data, error } = await supabase
    .from('radio_stations')
    .update(updates)
    .eq('id', stationId);
  
  return { data, error };
};
```

### Create Station
```typescript
const createStation = async (stationData: any) => {
  const { data, error } = await supabase
    .from('radio_stations')
    .insert([stationData]);
  
  return { data, error };
};
```

### Delete Station
```typescript
const deleteStation = async (stationId: string) => {
  const { error } = await supabase
    .from('radio_stations')
    .delete()
    .eq('id', stationId);
  
  return { error };
};
```

## Song API

### Fetch Songs
```typescript
const fetchSongs = async () => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};
```

### Get Song Details
```typescript
const getSongDetails = async (songId: string) => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('id', songId)
    .single();
  
  return { data, error };
};
```

### Create Song
```typescript
const createSong = async (songData: any) => {
  const { data, error } = await supabase
    .from('songs')
    .insert([songData]);
  
  return { data, error };
};
```

### Update Song
```typescript
const updateSong = async (songId: string, updates: any) => {
  const { data, error } = await supabase
    .from('songs')
    .update(updates)
    .eq('id', songId);
  
  return { data, error };
};
```

### Delete Song
```typescript
const deleteSong = async (songId: string) => {
  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', songId);
  
  return { error };
};
```

## AI API

### Generate AI Response
```typescript
const generateAIResponse = async (
  userInput: string,
  conversationContext: string = ""
) => {
  const { provider, apiKey } = await getAIProvider();
  
  if (provider === 'gemini') {
    return generateGeminiResponse(userInput, conversationContext);
  } else if (provider === 'openrouter') {
    return generateOpenRouterResponse(userInput, conversationContext);
  }
  
  throw new Error('No AI provider available');
};
```

### Generate Speech
```typescript
const generateSpeech = async (
  text: string,
  voiceId: string = "EXAVITQu4vr4xnSDxMaL"
) => {
  const apiKey = await getApiKey('elevenlabs_api_key');
  if (!apiKey) throw new Error('ElevenLabs API key not found');
  
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });
  
  return response;
};
```

## Edge Functions API

### AI Broadcaster
```typescript
const invokeAIBroadcaster = async (input: string, context: string) => {
  const { data, error } = await supabase.functions.invoke('ai-broadcaster', {
    body: { input, context }
  });
  
  return { data, error };
};
```

### Send Notification
```typescript
const sendNotification = async (userId: string, message: string, type: string) => {
  const { data, error } = await supabase.functions.invoke('send-notification', {
    body: { userId, message, type }
  });
  
  return { data, error };
};
```

### Update Radio Metrics
```typescript
const updateRadioMetrics = async (stationId: string, metrics: any) => {
  const { data, error } = await supabase.functions.invoke('update-radio-metrics', {
    body: { stationId, metrics }
  });
  
  return { data, error };
};
```

## Storage API

### Upload File
```typescript
const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  
  return { data, error };
};
```

### Download File
```typescript
const downloadFile = async (bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path);
  
  return { data, error };
};
```

### Get Public URL
```typescript
const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};
```

### List Files
```typescript
const listFiles = async (bucket: string, path: string = '') => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path);
  
  return { data, error };
};
```

### Delete File
```typescript
const deleteFile = async (bucket: string, paths: string[]) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove(paths);
  
  return { data, error };
};
```

## Real-time Subscriptions

### Subscribe to Channel
```typescript
const subscribeToChannel = (channel: string, event: string, callback: Function) => {
  const subscription = supabase
    .channel(channel)
    .on('broadcast', { event }, (payload) => {
      callback(payload);
    })
    .subscribe();
  
  return subscription;
};
```

### Subscribe to Table Changes
```typescript
const subscribeToTableChanges = (table: string, event: string, callback: Function) => {
  const subscription = supabase
    .channel('table-changes')
    .on('postgres_changes', {
      event,
      schema: 'public',
      table,
    }, (payload) => {
      callback(payload);
    })
    .subscribe();
  
  return subscription;
};
```

