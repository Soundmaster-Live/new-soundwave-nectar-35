
import { BroadcastTopic } from '../types';
import { toast } from '@/hooks/use-toast';
import { getAIProvider } from '@/utils/ai/apiKeyHelpers';

/**
 * Generates AI response based on the topic and prompt
 * Uses multiple AI providers with failover mechanism
 */
export const generateAIResponse = async (
  prompt: string,
  topic: BroadcastTopic,
  recentMessages: Array<{ role: string, content: string }>,
  currentProvider: string | null,
  setActiveProvider: (provider: string) => void
): Promise<string> => {
  // Generate appropriate prompt based on topic
  const effectivePrompt = getPromptForTopic(prompt, topic);
  
  console.log(`Generating response for topic: ${topic} using provider: ${currentProvider}`);
  console.log(`Prompt: "${effectivePrompt.substring(0, 50)}..."`);
  
  try {
    // For safety, always check with getAIProvider first to see if we have a valid API key
    const providerConfig = await getAIProvider();
    
    // Use the provider from the API key check
    const actualProvider = providerConfig.provider || 'local';
    
    if (actualProvider !== currentProvider) {
      console.log(`Switching provider from ${currentProvider} to ${actualProvider} based on API key availability`);
      setActiveProvider(actualProvider);
    }
    
    // If we're in local mode, don't attempt any network requests and just return a fallback message
    if (actualProvider === 'local' || !providerConfig.apiKey) {
      return getFallbackMessage(topic);
    }
    
    // Gemini provider
    if (actualProvider === 'gemini' && providerConfig.apiKey) {
      const conversationContext = recentMessages
        .map(msg => `${msg.role === 'user' ? 'User' : 'DJ'}: ${msg.content}`)
        .join('\n');
      
      console.log("Sending request to Gemini with conversation context");
      try {
        const systemPrompt = "You are DJ John, a charismatic South African radio host and sound expert. Keep responses short, engaging, and fun - like a real radio DJ. Include emojis and sound-related terms.";
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${providerConfig.model || 'gemini-1.5-flash'}:generateContent?key=${providerConfig.apiKey}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\nContext:\n${conversationContext}\n\nUser: ${effectivePrompt}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300,
              topP: 0.9,
              topK: 40
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT", 
                threshold: "BLOCK_ONLY_HIGH"
              }
            ]
          }),
          // Add a timeout to avoid hanging requests
          signal: AbortSignal.timeout(8000)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Google Gemini API error: ${response.status}`, errorText);
          throw new Error(`Google Gemini API error: ${response.status}`);
        }
        
        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
          "Sorry, I couldn't generate a proper response right now.";
          
        console.log("Successfully received response from Gemini:", aiResponse.substring(0, 50) + "...");
        return aiResponse;
      } catch (error) {
        console.error("Failed to generate response with Gemini:", error);
        
        // Fall back to next provider
        setActiveProvider('openrouter');
        return generateWithOpenRouter(effectivePrompt, conversationContext, providerConfig.apiKey);
      }
    }
    
    // OpenRouter provider
    if (actualProvider === 'openrouter' && providerConfig.apiKey) {
      const conversationContext = recentMessages
        .map(msg => `${msg.role === 'user' ? 'User' : 'DJ'}: ${msg.content}`)
        .join('\n');
      
      try {
        return await generateWithOpenRouter(effectivePrompt, conversationContext, providerConfig.apiKey);
      } catch (error) {
        console.error("Failed to generate response with OpenRouter:", error);
        
        // Fall back to Cloudflare
        setActiveProvider('cloudflare');
        return generateWithCloudflare(effectivePrompt, providerConfig.apiKey as string);
      }
    }
    
    // Cloudflare Worker provider
    if (actualProvider === 'cloudflare' && providerConfig.apiKey) {
      try {
        return await generateWithCloudflare(effectivePrompt, providerConfig.apiKey as string);
      } catch (error) {
        console.error("Failed to generate response with Cloudflare:", error);
        
        // Fall back to local
        setActiveProvider('local');
        return getFallbackMessage(topic);
      }
    }
    
    // Final fallback if all else fails
    return getFallbackMessage(topic);
  } catch (error) {
    console.error('Failed to generate AI response:', error);
    
    // Show error toast
    toast({
      title: 'AI Generation Failed',
      description: 'Could not generate response. Using local fallback message.',
      variant: 'destructive',
    });
    
    // Return fallback message
    return getFallbackMessage(topic);
  }
};

// Generate response using OpenRouter
async function generateWithOpenRouter(prompt: string, conversationContext: string, apiKey: string): Promise<string> {
  console.log("Sending request to OpenRouter");
  
  const systemPrompt = "You are DJ John, a charismatic South African radio host and sound expert. Keep responses short, engaging, and fun - like a real radio DJ. Include emojis and sound-related terms.";
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'SoundMaster Radio'
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `${conversationContext ? `Context:\n${conversationContext}\n\n` : ''}${prompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
    // Add a timeout to avoid hanging requests
    signal: AbortSignal.timeout(8000)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OpenRouter API error: ${response.status}`, errorText);
    throw new Error(`OpenRouter API error: ${response.status}`);
  }
  
  const data = await response.json();
  const aiResponse = data.choices?.[0]?.message?.content || 
    "Sorry, I couldn't generate a proper response right now.";
    
  console.log("Successfully received response from OpenRouter:", aiResponse.substring(0, 50) + "...");
  return aiResponse;
}

// Generate response using Cloudflare Worker
async function generateWithCloudflare(prompt: string, url: string): Promise<string> {
  console.log("Sending request to Cloudflare Worker:", url);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: prompt,
      isAdmin: false
    }),
    // Add a timeout to avoid hanging requests
    signal: AbortSignal.timeout(5000)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Cloudflare Worker error: ${response.status}`, errorText);
    throw new Error(`Cloudflare Worker error: ${response.status}`);
  }
  
  const data = await response.json();
  const aiResponse = data.response || 
    "Sorry, I couldn't generate a proper response right now.";
    
  console.log("Successfully received response from Cloudflare:", aiResponse.substring(0, 50) + "...");
  return aiResponse;
}

/**
 * Generates appropriate prompt based on topic
 */
const getPromptForTopic = (userPrompt: string, topic: BroadcastTopic): string => {
  if (userPrompt) return userPrompt;
  
  switch (topic) {
    case 'welcome':
      return 'You are a friendly South African radio DJ welcoming listeners to SoundMaster Radio. Introduce yourself with a name you choose, mention that the current time in Johannesburg is 9:08 pm, and invite listeners to enjoy the stream and interact with you. Keep it brief, enthusiastic, and casual like a real radio host. Use typical South African expressions and slang where appropriate.';
    
    case 'news':
      return 'Share a brief music news update as a radio DJ would. Mention 1-2 current happenings in the music world. Keep it conversational and engaging like a real radio host.';
    
    case 'weather':
      return 'Give a brief weather report for Johannesburg, South Africa as if you were a radio DJ. Be conversational and add some personality to it.';
    
    case 'events':
      return 'Mention a fictional upcoming music event or festival in South Africa as if you were a radio DJ promoting it on air. Include date, location and what makes it exciting.';
    
    case 'music':
      return 'Talk briefly about the current track playing or the next one coming up. Make up a plausible artist and song title, and share an interesting fact or appreciation for it as a radio DJ would.';
    
    case 'conversation':
      return userPrompt || 'Respond to the listener\'s message in a friendly, conversational DJ style.';
    
    default:
      return 'Share a brief, engaging update with the radio listeners in your role as a DJ.';
  }
};

/**
 * Returns fallback message when AI generation fails
 */
const getFallbackMessage = (topic: BroadcastTopic): string => {
  const currentHour = new Date().getHours();
  const timeOfDay = currentHour < 12 ? "morning" : currentHour < 18 ? "afternoon" : "evening";
  
  switch (topic) {
    case 'welcome':
      return `Hey there, SoundMaster listeners! DJ Max here, coming at you on this beautiful ${timeOfDay}. We've got some great music lined up for you today, so sit back, relax, and enjoy the vibe with us! 🎧`;
    
    case 'news':
      return "Just in - The music world is buzzing with excitement! 📰 The Rolling Stones have announced a surprise album drop next month, and local sensation Phophi Mulaudzi just topped the charts with her new hit single 'Venda Rhythm'. Stay tuned for more updates throughout the show! 🎵";
    
    case 'weather':
      return `Weather check for today in Joburg - we're looking at clear skies and comfortable temperatures all day. Perfect weather to crank up the volume and enjoy some tunes, hey? Don't forget your sunscreen if you're heading out! ☀️`;
    
    case 'events':
      return "Mark your calendars, music lovers! The Cape Town Jazz Festival is happening next weekend at the Grand Pavilion. Two days of incredible performances from local and international artists - you don't want to miss this one! 🎪🎵";
    
    case 'music':
      return "This smooth track you're hearing right now is 'Sunset in Soweto' by DJ Shimza. Love how he blends those traditional drums with modern house beats - absolutely lekker sound! 🎧";
    
    case 'conversation':
      return "Thanks for your message! I appreciate you reaching out. Keep the conversation going - what kind of music are you vibing to today? 🎵";
    
    default:
      return `Thanks for tuning in to SoundMaster Radio this ${timeOfDay}! We're bringing you the best beats to keep your energy up all day long. 🎧`;
  }
};
