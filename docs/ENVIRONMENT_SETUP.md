# Environment Setup Guide

This guide provides instructions for setting up the environment variables for the SoundMaster Radio application.

## Required Environment Variables

Create a `.env` file in the root directory of your project with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# API Configuration
VITE_API_URL=http://localhost:8080/api
VITE_API_VERSION=v1

# Streaming Configuration
VITE_STREAM_URL=https://stream.radioparadise.com/mp3-128
VITE_STREAM_FALLBACK_URL=https://ice1.somafm.com/groovesalad-128-mp3
VITE_KICK_CHANNEL=soundmasterlive

# AI Services Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Map Configuration
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token

# Feature Flags
VITE_ENABLE_AI_BROADCASTER=true
VITE_ENABLE_LIVE_CHAT=true
VITE_ENABLE_MAP_FEATURES=true

# Analytics Configuration
VITE_ANALYTICS_ID=your_analytics_id
VITE_ENABLE_ANALYTICS=true

# Cache Configuration
VITE_CACHE_DURATION=3600
VITE_MAX_CACHE_ITEMS=100

# Security Configuration
VITE_ENABLE_HTTPS=true
VITE_ALLOWED_ORIGINS=http://localhost:8080,https://yourdomain.com

# Development Configuration
VITE_DEV_MODE=true
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info

# Performance Configuration
VITE_MAX_CONCURRENT_REQUESTS=5
VITE_REQUEST_TIMEOUT=30000
VITE_RETRY_ATTEMPTS=3

# Storage Configuration
VITE_MAX_UPLOAD_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=audio/mpeg,audio/aac,image/jpeg,image/png

# Notification Configuration
VITE_ENABLE_PUSH_NOTIFICATIONS=true
VITE_PUSH_PUBLIC_KEY=your_push_public_key

# Custom Configuration
VITE_APP_NAME=SoundMaster Radio
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=AI-powered radio streaming platform
VITE_CONTACT_EMAIL=support@soundmaster.com
```

## Getting Started

1. **Supabase Setup**
   - Create a new project at [Supabase](https://supabase.com)
   - Get your project URL and anon key from the project settings
   - Enable the following services:
     - Authentication
     - Database
     - Storage
     - Edge Functions

2. **AI Services Setup**
   - [Google Gemini](https://ai.google.dev/): Get API key for AI broadcasting
   - [OpenRouter](https://openrouter.ai/): Get API key for alternative AI services
   - [ElevenLabs](https://elevenlabs.io/): Get API key for text-to-speech

3. **Map Integration**
   - Create an account at [Mapbox](https://www.mapbox.com)
   - Generate an access token for map features

4. **Development Environment**
   - Set `VITE_DEV_MODE=true` for local development
   - Set `VITE_DEBUG_MODE=true` for detailed logging
   - Configure `VITE_ALLOWED_ORIGINS` for CORS

## Environment-Specific Configuration

### Development
```env
VITE_DEV_MODE=true
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
VITE_API_URL=http://localhost:8080/api
```

### Staging
```env
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info
VITE_API_URL=https://staging-api.soundmaster.com/api
```

### Production
```env
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=warn
VITE_API_URL=https://api.soundmaster.com/api
```

## Security Considerations

1. **API Keys**
   - Never commit `.env` files to version control
   - Use environment-specific keys for different deployments
   - Rotate keys regularly

2. **CORS Configuration**
   - Configure `VITE_ALLOWED_ORIGINS` with specific domains
   - Use HTTPS in production
   - Implement proper CORS headers

3. **Rate Limiting**
   - Configure `VITE_MAX_CONCURRENT_REQUESTS`
   - Set appropriate `VITE_REQUEST_TIMEOUT`
   - Implement retry logic with `VITE_RETRY_ATTEMPTS`

## Troubleshooting

1. **Missing Environment Variables**
   - Check if all required variables are set
   - Verify variable names match exactly
   - Ensure proper formatting (no spaces around =)

2. **API Connection Issues**
   - Verify API keys are correct
   - Check API endpoints are accessible
   - Confirm CORS settings

3. **Development Server**
   - Clear browser cache
   - Restart development server
   - Check console for errors

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Security Best Practices](https://docs.soundmaster.com/security)
