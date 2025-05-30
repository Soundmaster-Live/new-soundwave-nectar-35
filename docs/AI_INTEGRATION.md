
# AI Integration Documentation

## Gemini and Cloudflare AI Integration

This application integrates with Google Gemini and Cloudflare Workers AI to provide AI-powered assistant capabilities.

### Configuration

The Gemini integration is configured in `src/utils/ai/geminiUtils.ts` with the following parameters:

- **API Key**: Stored in Supabase settings or falls back to a default key
- **Base URL**: `https://generativelanguage.googleapis.com/v1beta`
- **Model**: `gemini-1.5-flash`

The Cloudflare Workers AI integration is configured in `cloudflare-worker/ai-chatbot.js` and uses:
- **Model**: `@cf/meta/llama-3.1-8b-instruct`

### Implementation Details

#### Core Functionality

The AI integration provides:

1. **Chat Assistant**: Provides responses to user inquiries about music, events, and DJ services
2. **Response Classification**: Categorizes responses as text, song, event, booking, or support
3. **Context-Aware Replies**: Includes recent conversation history for more coherent responses
4. **Fallback Mechanism**: Falls back to Cloudflare Workers AI if Gemini is unavailable

#### Key Components

- `generateGeminiResponse`: Makes API calls to Google Gemini and processes responses
- `processGeminiResponse`: Post-processes responses based on their type
- `generateAIResponse`: Provides a unified interface for AI generation with fallback support

#### Usage in the Application

The AI functionality is integrated with:

- `useChatBot` hook: Manages conversation state and handles user interactions
- `ChatBot` component: Provides the UI for the assistant
- `AIBroadcaster` component: Implements the DJ broadcaster feature
- Main application features like music discovery and event booking

### Security Considerations

- API keys are stored in Supabase settings for better security
- Fallback mechanisms ensure the application remains functional even if one service is down
- Rate limiting handling is implemented to prevent excessive API usage

### Limitations

- Free models may have limitations on usage and capabilities
- Response quality depends on the specific model being used
- The classification system is based on simple keyword matching and may require refinement

### Future Enhancements

- More sophisticated response classification
- Integration with Supabase for stateful conversations
- Supporting more complex interaction patterns
