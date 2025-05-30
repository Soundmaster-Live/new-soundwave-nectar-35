# AI Integration Guide

This document provides detailed information on how AI is integrated into the SoundMaster Radio application.

## Table of Contents
1. [Overview](#overview)
2. [AI Providers](#ai-providers)
3. [Text-to-Speech Integration](#text-to-speech-integration)
4. [AI DJ Broadcaster](#ai-dj-broadcaster)
5. [API Key Management](#api-key-management)
6. [Implementation Details](#implementation-details)
7. [Extending AI Capabilities](#extending-ai-capabilities)
8. [Migrating to Different AI Providers](#migrating-to-different-ai-providers)
9. [Troubleshooting](#troubleshooting)

## Overview

The SoundMaster Radio application leverages AI technologies to enhance the user experience with:

1. **AI DJ Broadcaster**: A virtual DJ that creates engaging radio-style banter and commentary
2. **Text-to-Speech**: Converts AI-generated text into natural-sounding speech
3. **Fallback Mechanisms**: Multiple AI providers to ensure reliability

## AI Providers

### Google Gemini API

The primary AI provider used for text generation is Google Gemini, specifically the `gemini-pro` model.

**Features**:
- High-quality text generation
- Fast response times
- Supports detailed prompts and context

**Implementation File**: `src/utils/ai/geminiUtils.ts`

**Usage Example**:
```typescript
import { generateGeminiResponse } from '@/utils/ai/geminiUtils';

const response = await generateGeminiResponse(
  "Tell me about the latest music trends",
  "Previous conversation context here..."
);
```

### OpenRouter API (Fallback)

When the Google Gemini API is unavailable or fails, the application falls back to OpenRouter, which provides access to various models including Mistral.

**Features**:
- Fallback mechanism for reliability
- Access to alternative models
- Similar API interface to maintain consistency

**Implementation File**: `src/utils/ai/openRouterUtils.ts`

**Usage Example**:
```typescript
import { generateOpenRouterResponse } from '@/utils/ai/openRouterUtils';

const response = await generateOpenRouterResponse(
  "Tell me about the latest music trends",
  "Previous conversation context here..."
);
```

## Text-to-Speech Integration

### ElevenLabs Integration

The application uses ElevenLabs for converting AI-generated text to natural-sounding speech.

**Features**:
- High-quality voice synthesis
- Multiple voice options
- Adjustable speech parameters

**Implementation Files**:
- `src/utils/ai/elevenlabs/ttsApi.ts`: Core API integration
- `src/utils/ai/elevenlabs/usageMetrics.ts`: Usage tracking
- `src/utils/ai/elevenlabs/useTTSSettings.ts`: Settings management

**Usage Example**:
```typescript
import { generateSpeech, playAudio, stopAudio } from '@/utils/ai/elevenlabs/ttsApi';

// Generate and play speech
const audioResponse = await generateSpeech(
  "This is the DJ speaking!",
  "EXAVITQu4vr4xnSDxMaL", // Voice ID for Sarah
  {
    optimize_streaming_latency: 0,
    model_id: "eleven_multilingual_v2"
  }
);

// Play the audio
if (audioResponse) {
  await playAudio(audioResponse);
}

// Stop audio playback
stopAudio();
```

### Voice Options

The application includes several pre-configured voices:

| Voice Name | Voice ID | Description |
|------------|----------|-------------|
| Sarah | EXAVITQu4vr4xnSDxMaL | Female voice with a warm, professional tone |
| Liam | TX3LPaxmHKxFdv7VOQHJ | Male voice with a friendly, casual tone |
| Roger | CwhRBWXzGAHq8TQ4Fs17 | Male voice with an authoritative tone |
| Charlie | IKne3meq5aSn9XLyUdCD | Male voice with a dynamic, energetic tone |
| Jessica | cgSgspJ2msm6clMCkdW9 | Female voice with a soft, gentle tone |

## AI DJ Broadcaster

The AI DJ Broadcaster combines text generation with speech synthesis to create a virtual radio DJ experience.

### Architecture

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│               │     │               │     │               │
│  User Input   │────►│  Text AI      │────►│  TTS Engine   │
│  (Optional)   │     │  (Gemini/OR)  │     │  (ElevenLabs) │
│               │     │               │     │               │
└───────────────┘     └───────────────┘     └───────────────┘
                                                   │
                                                   ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│               │     │               │     │               │
│  Audio Player │◄────┤  Audio Cache  │◄────┤  Audio Stream │
│               │     │               │     │               │
└───────────────┘     └───────────────┘     └───────────────┘
```

### Implementation

The AI DJ Broadcaster is implemented in the `useBroadcaster` hook (`src/components/ai-broadcaster/useBroadcaster.tsx`), which:

1. Generates topics for the DJ to talk about
2. Sends prompts to the AI text generation service
3. Receives text responses
4. Converts text to speech using ElevenLabs
5. Plays the audio through the speaker

### Topic Generation

The DJ can discuss various topics:

- **Welcome**: Introduction and greeting
- **Music**: Comments about songs and artists
- **Weather**: Weather updates
- **News**: Current events related to music
- **Events**: Upcoming events
- **General**: Miscellaneous banter

### Auto-Generation

The broadcaster includes an auto-generation feature that creates content automatically at regular intervals:

```typescript
// Auto-generation logic (simplified)
useEffect(() => {
  if (!isAutoGenerating) return;
  
  const interval = setInterval(() => {
    if (!isSpeaking && !isGenerating && isConnected) {
      const randomTopic = getRandomTopic();
      generateBroadcasterMessage(randomTopic);
    }
  }, 10000); // Check every 10 seconds
  
  return () => clearInterval(interval);
}, [isSpeaking, isGenerating, isConnected, isAutoGenerating]);
```

## API Key Management

### Key Storage Strategy

API keys are stored in multiple locations with fallbacks:

1. **Supabase Settings Table**: Primary storage for API keys
2. **Local Storage**: Backup for ElevenLabs API key
3. **Default Keys**: Hardcoded fallback keys for development/testing

### Implementation

The `getApiKey` function in `src/utils/ai/apiKeyHelpers.ts` handles key retrieval:

```typescript
import { supabase } from "@/integrations/supabase/client";

// Helper function to get API key from Supabase or fallback to defaults
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

### Provider Selection

The `getAIProvider` function determines which AI provider to use based on available API keys:

```typescript
import { getApiKey, DEFAULT_API_KEYS } from "@/utils/ai/apiKeyHelpers";

// Get API key with provider preference order
export const getAIProvider = async (): Promise<{provider: string, apiKey: string | null}> => {
  // Try Gemini first (now the primary provider)
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

## Implementation Details

### Error Handling

The AI integration includes comprehensive error handling:

1. **Connection Retries**: Automatically retries API calls with exponential backoff
2. **Fallback Providers**: Switches to alternative providers when primary fails
3. **User Feedback**: Provides clear error messages and reconnection options
4. **Graceful Degradation**: Falls back to simpler functionality when advanced features aren't available

### Audio Caching

To improve performance and reduce API calls, the application caches TTS audio:

```typescript
// Audio caching implementation (simplified)
const audioCache = new Map<string, AudioBuffer>();

export const generateSpeech = async (text: string, voiceId: string, options = {}) => {
  // Generate cache key
  const cacheKey = `${text}_${voiceId}_${JSON.stringify(options)}`;
  
  // Check if audio is cached
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey);
  }
  
  // Generate speech from API
  const audioBuffer = await callTTSApi(text, voiceId, options);
  
  // Cache the result
  if (audioBuffer) {
    audioCache.set(cacheKey, audioBuffer);
  }
  
  return audioBuffer;
};

export const clearAudioCache = () => {
  audioCache.clear();
};
```

### Conversation Context

The AI maintains conversation context to create more coherent interactions:

```typescript
// Conversation context management (simplified)
const [messages, setMessages] = useState<BroadcasterMessage[]>([]);

const getConversationContext = () => {
  // Get the last few messages for context
  const contextMessages = messages.slice(-4);
  return contextMessages
    .map(msg => `${msg.role === 'user' ? 'User' : 'DJ'}: ${msg.content}`)
    .join('\n');
};

const generateAIResponse = async (userInput: string) => {
  const conversationContext = getConversationContext();
  return await generateGeminiResponse(userInput, conversationContext);
};
```

## Extending AI Capabilities

### Adding New AI Providers

To add a new AI provider, follow these steps:

1. Create a new utility file for the provider:
   ```typescript
   // src/utils/ai/newProviderUtils.ts
   export const generateNewProviderResponse = async (
     userInput: string, 
     conversationContext: string = ""
   ) => {
     try {
       // API key management
       const apiKey = await getApiKey('NEW_PROVIDER_API_KEY');
       if (!apiKey) throw new Error('New Provider API key not configured');
       
       // Make API call
       const response = await fetch('https://api.newprovider.com/v1/generate', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${apiKey}`
         },
         body: JSON.stringify({
           prompt: conversationContext ? `${conversationContext}\n\n${userInput}` : userInput,
           // Provider-specific parameters
         })
       });
       
       const data = await response.json();
       
       // Process response
       return {
         content: data.output.text,
         success: true
       };
     } catch (error) {
       console.error('New Provider Response error:', error);
       throw error;
     }
   };
   ```

2. Update the API key helpers:
   ```typescript
   // src/utils/ai/apiKeyHelpers.ts
   export const DEFAULT_API_KEYS = {
     // Existing keys
     GOOGLE_API_KEY: '...',
     OPENROUTER_API_KEY: '...',
     // New provider
     NEW_PROVIDER_API_KEY: '...'
   };
   
   export const getAIProvider = async () => {
     // Try Gemini first
     const geminiKey = await getApiKey('GOOGLE_API_KEY', DEFAULT_API_KEYS.GOOGLE_API_KEY);
     if (geminiKey) return { provider: 'gemini', apiKey: geminiKey };
     
     // Try new provider
     const newProviderKey = await getApiKey('NEW_PROVIDER_API_KEY', DEFAULT_API_KEYS.NEW_PROVIDER_API_KEY);
     if (newProviderKey) return { provider: 'newprovider', apiKey: newProviderKey };
     
     // Then OpenRouter
     const openrouterKey = await getApiKey('OPENROUTER_API_KEY', DEFAULT_API_KEYS.OPENROUTER_API_KEY);
     if (openrouterKey) return { provider: 'openrouter', apiKey: openrouterKey };
     
     return { provider: 'none', apiKey: null };
   };
   ```

3. Update the response generation logic:
   ```typescript
   // src/utils/ai/generateAIResponse.ts
   import { getAIProvider } from './apiKeyHelpers';
   import { generateGeminiResponse } from './geminiUtils';
   import { generateOpenRouterResponse } from './openRouterUtils';
   import { generateNewProviderResponse } from './newProviderUtils';
   
   export const generateAIResponse = async (
     userInput: string, 
     conversationContext: string = ""
   ) => {
     const { provider } = await getAIProvider();
     
     switch (provider) {
       case 'gemini':
         return generateGeminiResponse(userInput, conversationContext);
       case 'newprovider':
         return generateNewProviderResponse(userInput, conversationContext);
       case 'openrouter':
         return generateOpenRouterResponse(userInput, conversationContext);
       default:
         throw new Error('No AI provider available');
     }
   };
   ```

### Adding New TTS Providers

To add a new text-to-speech provider:

1. Create a new TTS API utility:
   ```typescript
   // src/utils/ai/newTTSProvider/ttsApi.ts
   export const generateSpeech = async (
     text: string,
     voiceId: string = "default-voice",
     options = {}
   ) => {
     try {
       const apiKey = await getApiKey('NEW_TTS_API_KEY');
       if (!apiKey) throw new Error('New TTS API key not found');
       
       const response = await fetch(
         `https://api.newtts.com/v1/synthesize`,
         {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${apiKey}`
           },
           body: JSON.stringify({
             text,
             voice_id: voiceId,
             // Provider-specific options
             ...options
           })
         }
       );
       
       if (!response.ok) {
         throw new Error(`New TTS API error: ${await response.text()}`);
       }
       
       return response;
     } catch (error) {
       console.error('New TTS API error:', error);
       throw error;
     }
   };
   
   export const playAudio = async (audioResponse: Response) => {
     try {
       const audioBlob = await audioResponse.blob();
       const audioUrl = URL.createObjectURL(audioBlob);
       const audio = new Audio(audioUrl);
       audio.play();
       return audio;
     } catch (error) {
       console.error('Error playing audio:', error);
       throw error;
     }
   };
   ```

2. Update the TTS provider selection logic:
   ```typescript
   // src/utils/ai/ttsProviderSelector.ts
   import { generateSpeech as generateElevenLabsSpeech } from './elevenlabs/ttsApi';
   import { generateSpeech as generateNewTTSSpeech } from './newTTSProvider/ttsApi';
   
   export const getTTSProvider = async () => {
     // Try ElevenLabs first
     const elevenLabsKey = await getApiKey('elevenlabs_api_key');
     if (elevenLabsKey) return { provider: 'elevenlabs', apiKey: elevenLabsKey };
     
     // Try new TTS provider
     const newTTSKey = await getApiKey('NEW_TTS_API_KEY');
     if (newTTSKey) return { provider: 'newtts', apiKey: newTTSKey };
     
     return { provider: 'none', apiKey: null };
   };
   
   export const generateSpeech = async (text: string, voiceId: string, options = {}) => {
     const { provider } = await getTTSProvider();
     
     switch (provider) {
       case 'elevenlabs':
         return generateElevenLabsSpeech(text, voiceId, options);
       case 'newtts':
         return generateNewTTSSpeech(text, voiceId, options);
       default:
         throw new Error('No TTS provider available');
     }
   };
   ```

## Migrating to Different AI Providers

### Migrating from Google Gemini to OpenAI

1. Create OpenAI utility file:
   ```typescript
   // src/utils/ai/openaiUtils.ts
   export const generateOpenAIResponse = async (
     userInput: string, 
     conversationContext: string = ""
   ) => {
     try {
       const apiKey = await getApiKey('OPENAI_API_KEY');
       if (!apiKey) throw new Error('OpenAI API key not configured');
       
       const response = await fetch('https://api.openai.com/v1/chat/completions', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${apiKey}`
         },
         body: JSON.stringify({
           model: 'gpt-4o-mini',
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
           max_tokens: 300
         })
       });
       
       const data = await response.json();
       
       return {
         content: data.choices[0].message.content,
         success: true
       };
     } catch (error) {
       console.error('OpenAI Response error:', error);
       throw error;
     }
   };
   ```

2. Update API key helpers:
   ```typescript
   // src/utils/ai/apiKeyHelpers.ts
   export const DEFAULT_API_KEYS = {
     // Add OpenAI key
     OPENAI_API_KEY: 'your-default-key-here',
     // Existing keys
     GOOGLE_API_KEY: '...',
     OPENROUTER_API_KEY: '...'
   };
   
   export const getAIProvider = async () => {
     // Try OpenAI first
     const openaiKey = await getApiKey('OPENAI_API_KEY', DEFAULT_API_KEYS.OPENAI_API_KEY);
     if (openaiKey) return { provider: 'openai', apiKey: openaiKey };
     
     // Then Gemini
     const geminiKey = await getApiKey('GOOGLE_API_KEY', DEFAULT_API_KEYS.GOOGLE_API_KEY);
     if (geminiKey) return { provider: 'gemini', apiKey: geminiKey };
     
     // Then OpenRouter
     const openrouterKey = await getApiKey('OPENROUTER_API_KEY', DEFAULT_API_KEYS.OPENROUTER_API_KEY);
     if (openrouterKey) return { provider: 'openrouter', apiKey: openrouterKey };
     
     return { provider: 'none', apiKey: null };
   };
   ```

3. Update response generation logic:
   ```typescript
   // src/utils/ai/generateAIResponse.ts
   import { getAIProvider } from './apiKeyHelpers';
   import { generateGeminiResponse } from './geminiUtils';
   import { generateOpenRouterResponse } from './openRouterUtils';
   import { generateOpenAIResponse } from './openaiUtils';
   
   export const generateAIResponse = async (
     userInput: string, 
     conversationContext: string = ""
   ) => {
     const { provider } = await getAIProvider();
     
     switch (provider) {
       case 'openai':
         return generateOpenAIResponse(userInput, conversationContext);
       case 'gemini':
         return generateGeminiResponse(userInput, conversationContext);
       case 'openrouter':
         return generateOpenRouterResponse(userInput, conversationContext);
       default:
         throw new Error('No AI provider available');
     }
   };
   ```

### Migrating from ElevenLabs to AWS Polly

1. Create AWS Polly utility file:
   ```typescript
   // src/utils/ai/awsPolly/ttsApi.ts
   import AWS from 'aws-sdk';
   
   let audioElement: HTMLAudioElement | null = null;
   
   export const generateSpeech = async (
     text: string,
     voiceId: string = "Joanna",
     options = {}
   ) => {
     try {
       // Configure AWS
       AWS.config.update({
         accessKeyId: await getApiKey('AWS_ACCESS_KEY_ID'),
         secretAccessKey: await getApiKey('AWS_SECRET_ACCESS_KEY'),
         region: 'us-east-1'
       });
       
       const polly = new AWS.Polly();
       
       // Set up Polly parameters
       const params = {
         Text: text,
         OutputFormat: 'mp3',
         VoiceId: voiceId,
         Engine: 'neural',
         ...options
       };
       
       // Synthesize speech
       const data = await polly.synthesizeSpeech(params).promise();
       
       // Convert to Response object for compatibility
       const audioBlob = new Blob([data.AudioStream as Buffer], { type: 'audio/mpeg' });
       const response = new Response(audioBlob);
       
       return response;
     } catch (error) {
       console.error('AWS Polly API error:', error);
       throw error;
     }
   };
   
   export const playAudio = async (audioResponse: Response) => {
     try {
       // Stop any currently playing audio
       stopAudio();
       
       const audioBlob = await audioResponse.blob();
       const audioUrl = URL.createObjectURL(audioBlob);
       
       audioElement = new Audio(audioUrl);
       audioElement.play();
       
       return audioElement;
     } catch (error) {
       console.error('Error playing audio:', error);
       throw error;
     }
   };
   
   export const stopAudio = () => {
     if (audioElement) {
       audioElement.pause();
       audioElement = null;
     }
   };
   ```

2. Create a voice mapping utility:
   ```typescript
   // src/utils/ai/awsPolly/voiceMapping.ts
   
   // Map ElevenLabs voice IDs to AWS Polly voices
   export const voiceMapping: Record<string, string> = {
     // Female voices
     'EXAVITQu4vr4xnSDxMaL': 'Joanna', // Sarah -> Joanna
     'FGY2WhTYpPnrIDTdsKH5': 'Amy',    // Laura -> Amy
     'XB0fDUnXU5powFXDhCwa': 'Emma',   // Charlotte -> Emma
     
     // Male voices
     'TX3LPaxmHKxFdv7VOQHJ': 'Matthew', // Liam -> Matthew
     'CwhRBWXzGAHq8TQ4Fs17': 'Brian',   // Roger -> Brian
     'IKne3meq5aSn9XLyUdCD': 'Kevin',   // Charlie -> Kevin
     
     // Default fallback
     'default': 'Joanna'
   };
   
   export const mapVoiceId = (elevenLabsVoiceId: string): string => {
     return voiceMapping[elevenLabsVoiceId] || voiceMapping.default;
   };
   ```

3. Update the TTS integration in the broadcaster:
   ```typescript
   // src/components/ai-broadcaster/useBroadcaster.tsx
   
   // Import AWS Polly utilities
   import { generateSpeech, playAudio, stopAudio } from '@/utils/ai/awsPolly/ttsApi';
   import { mapVoiceId } from '@/utils/ai/awsPolly/voiceMapping';
   
   // Update the text-to-speech conversion
   const convertTextToSpeech = async (text: string, voiceId: string) => {
     try {
       setIsSpeaking(true);
       
       // Map ElevenLabs voice ID to AWS Polly voice
       const pollyVoiceId = mapVoiceId(voiceId);
       
       // Generate speech using AWS Polly
       const speechResponse = await generateSpeech(text, pollyVoiceId);
       
       if (speechResponse) {
         // Play the audio
         await playAudio(speechResponse);
       }
     } catch (error) {
       console.error('Text-to-speech error:', error);
       setTtsError(true);
     } finally {
       setIsSpeaking(false);
     }
   };
   ```

## Troubleshooting

### Common Issues and Solutions

#### AI Response Generation Fails

**Issue**: The application fails to generate AI responses
**Solution**:
1. Check API key configuration in the Supabase settings table
2. Verify network connectivity to the AI provider
3. Check browser console for specific error messages
4. Try using a different AI provider

#### Text-to-Speech Fails

**Issue**: Text is generated but speech synthesis fails
**Solution**:
1. Check ElevenLabs API key configuration
2. Verify remaining character quota in ElevenLabs account
3. Check browser audio permissions
4. Try using a different voice ID

#### API Keys Not Found

**Issue**: API keys are not being retrieved correctly
**Solution**:
1. Check the Supabase settings table for the correct key names
2. Verify that the getApiKey function is working correctly
3. For ElevenLabs, check localStorage as well
4. Ensure that the default keys are correctly configured

#### AI Content Not Appropriate

**Issue**: AI generates content that is not appropriate for a radio DJ
**Solution**:
1. Improve the system prompt to be more specific about the DJ persona
2. Add content filtering to the AI response processing
3. Use models that have better content filtering built in
4. Implement a moderation API to check content before synthesis

### Debugging Tools

#### API Response Checker

```typescript
// src/utils/debug/apiResponseChecker.ts
export const checkAIResponse = async (
  prompt: string,
  provider: 'gemini' | 'openrouter' | 'openai'
) => {
  try {
    let response;
    
    switch (provider) {
      case 'gemini':
        response = await generateGeminiResponse(prompt);
        break;
      case 'openrouter':
        response = await generateOpenRouterResponse(prompt);
        break;
      case 'openai':
        response = await generateOpenAIResponse(prompt);
        break;
    }
    
    console.log(`${provider} response:`, response);
    return response;
  } catch (error) {
    console.error(`${provider} error:`, error);
    return null;
  }
};
```

#### TTS Voice Tester

```typescript
// src/utils/debug/ttsTester.ts
export const testVoice = async (
  text: string = "This is a test of the text-to-speech system.",
  voiceId: string = "EXAVITQu4vr4xnSDxMaL"
) => {
  try {
    const response = await generateSpeech(text, voiceId);
    if (response) {
      await playAudio(response);
      return true;
    }
    return false;
  } catch (error) {
    console.error('TTS test error:', error);
    return false;
  }
};
```

#### API Key Validator

```typescript
// src/utils/debug/keyValidator.ts
import { getApiKey } from "@/utils/ai/apiKeyHelpers";

export const validateApiKeys = async () => {
  const keys = [
    'GOOGLE_API_KEY',
    'OPENROUTER_API_KEY',
    'elevenlabs_api_key'
  ];
  
  const results = {};
  
  for (const key of keys) {
    const value = await getApiKey(key);
    results[key] = {
      found: !!value,
      source: value ? (
        key === 'elevenlabs_api_key' && localStorage.getItem(key)
          ? 'localStorage'
          : 'Supabase'
      ) : 'Not found',
      value: value ? '***' + value.slice(-4) : null
    };
  }
  
  console.log('API Key Validation Results:', results);
  return results;
};
```
