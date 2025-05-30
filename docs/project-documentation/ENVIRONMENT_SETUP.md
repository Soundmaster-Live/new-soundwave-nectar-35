
# Environment Configuration

This document outlines the environment variables and configuration options for the SoundMaster Radio application.

## Required Environment Variables

The following environment variables are required for the application to function properly:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| VITE_SUPABASE_URL | Supabase project URL | https://fyfrrrwmrjgqbvseqqje.supabase.co |
| VITE_SUPABASE_ANON_KEY | Supabase anonymous key | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... |

## API Keys

The following API keys are required for full functionality:

| API Key | Used For | Storage Location | Current Value |
|---------|----------|------------------|---------------|
| GOOGLE_API_KEY | Google Gemini AI | Supabase settings table | AIzaSyCXXP_JjQfRPMkSeIBp5Aq1wU5ztK13zRM |
| OPENROUTER_API_KEY | OpenRouter AI fallback | Supabase settings table | - |
| ELEVENLABS_API_KEY | Text-to-speech | Supabase settings or localStorage | - |

## Environment Files

For supporting multiple environments, create different configuration files:

- `.env.development` for local development
- `.env.staging` for staging environment
- `.env.production` for production environment

Example `.env.development` file:

```
VITE_SUPABASE_URL=https://your-development-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-development-anon-key
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
```

## Environment-Specific Configuration

Different environments may require different configuration settings:

### Development Environment

```typescript
// src/config/development.ts
export const config = {
  apiUrl: 'http://localhost:3000',
  debug: true,
  analytics: false,
  mockServices: true,
  loggingLevel: 'debug',
};
```

### Staging Environment

```typescript
// src/config/staging.ts
export const config = {
  apiUrl: 'https://staging-api.soundmaster.com',
  debug: true,
  analytics: true,
  mockServices: false,
  loggingLevel: 'info',
};
```

### Production Environment

```typescript
// src/config/production.ts
export const config = {
  apiUrl: 'https://api.soundmaster.com',
  debug: false,
  analytics: true,
  mockServices: false,
  loggingLevel: 'error',
};
```

## Configuration Loading

The application loads configuration based on the current environment:

```typescript
// src/config/index.ts
import { developmentConfig } from './development';
import { stagingConfig } from './staging';
import { productionConfig } from './production';

const env = import.meta.env.VITE_APP_ENV || 'development';

const configs = {
  development: developmentConfig,
  staging: stagingConfig,
  production: productionConfig,
};

export const config = configs[env];
```

## Feature Flags

Feature flags allow enabling or disabling features based on environment:

```typescript
// src/config/featureFlags.ts
export const featureFlags = {
  enableAIBroadcaster: true,
  enableLiveLesson: true,
  enableAdminDashboard: true,
  enableUserProfile: true,
  enableNewPlayerUI: import.meta.env.VITE_APP_ENV !== 'production',
};
```

## Setting Up API Keys

### Supabase Settings Table

API keys should be stored in the Supabase `settings` table:

1. Navigate to the Supabase dashboard
2. Go to the SQL Editor
3. Run the following SQL to insert API keys:

```sql
-- Insert Google Gemini API key
INSERT INTO public.settings (key, value)
VALUES ('google_api_key', 'your-api-key-here');

-- Insert OpenRouter API key
INSERT INTO public.settings (key, value)
VALUES ('openrouter_api_key', 'your-api-key-here');

-- Insert ElevenLabs API key
INSERT INTO public.settings (key, value)
VALUES ('elevenlabs_api_key', 'your-api-key-here');
```

### Local Development Keys

For local development, you can store keys in localStorage:

```javascript
// In browser console or setup script
localStorage.setItem('elevenlabs_api_key', 'your-api-key-here');
```

## Retrieving API Keys

The application uses utility functions to retrieve API keys:

```typescript
// src/utils/ai/apiKeyHelpers.ts
export const getApiKey = async (keyName: string): Promise<string | null> => {
  // First check localStorage (for development)
  const localKey = localStorage.getItem(keyName);
  if (localKey) return localKey;
  
  // Otherwise check Supabase settings table
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', keyName)
    .single();
  
  if (error || !data) {
    console.error(`Failed to retrieve ${keyName}:`, error);
    return null;
  }
  
  return data.value;
};
```

## Environment Variable Validation

On application startup, validate required environment variables:

```typescript
// src/utils/environmentValidation.ts
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];
  
  const missingVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
  );
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};
```

## Development Tools

Additional development tools can be configured:

```typescript
// src/utils/devTools.ts
export const devTools = {
  enabled: import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true',
  
  log: (message: string, data?: any) => {
    if (!devTools.enabled) return;
    console.log(`[DEV] ${message}`, data);
  },
  
  profile: (label: string, action: () => any) => {
    if (!devTools.enabled) return action();
    console.time(label);
    const result = action();
    console.timeEnd(label);
    return result;
  },
};
```
