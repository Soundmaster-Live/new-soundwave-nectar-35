
# AI Integration Documentation

This document provides detailed information about the AI services integrated into the SoundMaster Radio application.

## AI Providers

The application uses multiple AI providers with fallback mechanisms:

1. **Primary: Google Gemini API**
   - Implementation: `/src/utils/ai/geminiUtils.ts`
   - Used for: AI text generation for the broadcaster
   - Configuration: API key stored in Supabase settings
   - Model: `gemini-1.5-flash`

2. **Secondary: Cloudflare Workers AI**
   - Implementation: `cloudflare-worker/ai-chatbot.js`
   - Used for: Fallback text generation when Gemini is unavailable
   - Configuration: Cloudflare environment variables
   - Model: `@cf/meta/llama-3.1-8b-instruct`

3. **Text-to-Speech: ElevenLabs**
   - Implementation: `/src/utils/ai/elevenlabs/` directory
   - Used for: Converting AI text responses to speech
   - Configuration: API key can be stored in localStorage or Supabase

## Integration Architecture

```
┌───────────────┐     ┌───────────────────────┐     ┌────────────────┐
│               │     │                       │     │                │
│ User Interface│────►│ AI Orchestration Layer│────►│ AI Providers   │
│               │     │                       │     │                │
└───────┬───────┘     └───────────┬───────────┘     └────────┬───────┘
        │                         │                          │
        │                         │                          │
        │                         ▼                          │
        │             ┌───────────────────────┐              │
        │             │                       │              │
        └────────────►│ Audio Playback System │◄─────────────┘
                      │                       │
                      └───────────────────────┘
```

## Integration Flow

1. User interacts with the AI DJ
2. The system attempts to generate a response using Gemini
3. If Gemini fails, the system falls back to Cloudflare Workers AI
4. The text response is converted to speech using ElevenLabs
5. The audio is played through the streaming components

## Server-Side AI Integration

For server-side AI processing, the application uses:

1. **Google Gemini API (Edge Functions)**
   - Implementation: `/supabase/functions/ai-broadcaster/index.ts`
   - Used for: Generating AI broadcaster content
   - Model: `gemini-1.5-flash`
   - Configuration: API key stored in Supabase secrets

2. **Cloudflare Workers AI**
   - Implementation: `/cloudflare-worker/ai-chatbot.js`
   - Used for: Providing AI chat responses
   - Model: `@cf/meta/llama-3.1-8b-instruct`
   - Configuration: Configured through Cloudflare

## API Key Management

API keys are managed securely:

1. **Settings Table Storage**: API keys are stored in the Supabase `settings` table
2. **Key Retrieval**: Keys are fetched only when needed
3. **Default Keys**: Fallback public keys for development environments
4. **Client-Side Storage Option**: ElevenLabs keys can be stored in localStorage for development

## Error Handling

The AI integration includes comprehensive error handling:
- Connection retries for API failures
- User-initiated reconnection when persistent failures occur
- Graceful degradation when services are unavailable
- Detailed error logging for troubleshooting
- Fallback mechanisms between different AI providers

## Configuration Options

The AI integration can be configured through:

1. **TTSSettingsDialog**: User interface for configuring text-to-speech settings
2. **API Provider Selection**: Configuration for which AI provider to use
3. **Voice Selection**: Options for different voice models
4. **Generation Parameters**: Controls for response generation (temperature, etc.)

## Best Practices

When working with the AI integration:

1. **API Keys**: Always use your own API keys in production
2. **Error Handling**: Plan for API failures and implement fallbacks
3. **Rate Limiting**: Be aware of rate limits on AI service providers
4. **Testing**: Thoroughly test AI functionality with different inputs
5. **Model Selection**: Use the most appropriate models for your use case
   - Text generation: `gemini-1.5-flash` or Cloudflare Workers AI
   - Audio generation: ElevenLabs voices

## Troubleshooting

Common issues and solutions:

1. **API Key Errors**: Ensure API keys are correctly set in Supabase settings
2. **Model Not Found**: Verify you're using a currently supported model
3. **Rate Limiting**: Implement backoff strategies for rate limit errors
4. **Audio Playback Issues**: Check browser audio permissions and context state
