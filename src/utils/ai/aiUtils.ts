import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DEFAULT_API_KEYS } from "./apiKeyHelpers";

export interface AIResponse {
  text: string;
  type: 'text' | 'song' | 'event' | 'booking' | 'support';
  data?: any;
}

export const generateAIResponse = async (topic: string, context?: string): Promise<AIResponse> => {
  try {
    console.log('Generating AI response for:', topic);
    
    // First try with Gemini API - make this the primary path
    try {
      const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'GOOGLE_API_KEY')
        .maybeSingle();
  
      // Use API key from settings or fallback to default
      // Use the first API key from the GOOGLE_API_KEYS array
      const apiKey = settings?.value || DEFAULT_API_KEYS.GOOGLE_API_KEYS[0];
  
      if (!apiKey) {
        throw new Error('Google API key not configured');
      }
  
      console.log("Sending request to Google Gemini...");
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      const systemPrompt = "You are DJ John, a charismatic South African radio host and sound expert. Keep responses short, engaging, and fun - like a real radio DJ. Include emojis and sound-related terms.";
      
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
                  text: `${systemPrompt}\n\nUser: Tell me about ${topic} in an entertaining radio DJ style.${context ? "\n\nContext: " + context : ""}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
            topP: 0.8,
            topK: 40
          },
          // Add a safety setting to avoid content being filtered
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
      
      return processResponseType(aiResponse, topic);
    
    } catch (error) {
      // If Gemini fails, use a robust local fallback instead of unreliable Cloudflare Workers
      console.log("Gemini API failed, using local fallback mechanism", error);
      
      // Create a context-aware local fallback response
      let fallbackResponse = getLocalFallbackResponse(topic);
      
      return processResponseType(fallbackResponse, topic);
    }
  } catch (error) {
    console.error('AI Response error:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate AI response",
      variant: "destructive",
    });
    
    // Return a fallback response
    return {
      text: "Hey there! I'm experiencing a bit of technical difficulty at the moment. Please try again in a few moments! 🎧",
      type: 'text'
    };
  }
};

// Helper function to get a realistic context-aware local fallback response
const getLocalFallbackResponse = (topic: string): string => {
  const currentHour = new Date().getHours();
  const timeOfDay = currentHour < 12 ? "morning" : currentHour < 18 ? "afternoon" : "evening";
  
  // Create responses based on common topics
  if (topic.toLowerCase().includes('music') || topic.toLowerCase().includes('song')) {
    return `Hey there, music lovers! DJ John with you this ${timeOfDay}! 🎵 ${topic} is absolutely rocking the airwaves right now! The beats are fresh, the vibes are hot, and we're keeping the energy HIGH today! Keep it locked to SoundMaster Radio for the absolute best tunes! 🎧`;
  }
  
  if (topic.toLowerCase().includes('weather')) {
    return `Good ${timeOfDay}, SoundMaster family! 🌤️ DJ John checking in with your weather vibes! It's looking like we've got some beautiful sunshine ahead - perfect weather for cranking up those summer anthems! Whatever you're doing today, make sure your playlist matches the brightness outside! 🌈`;
  }
  
  if (topic.toLowerCase().includes('news')) {
    return `Breaking it down with some hot news for you this ${timeOfDay}! 📰 DJ John here on SoundMaster Radio! The music world is BUZZING today - did you hear about that surprise album drop? The charts are being absolutely shaken up! I'll be playing some of those fresh tracks in the next hour, so stay tuned! 🎧`;
  }
  
  if (topic.toLowerCase().includes('event') || topic.toLowerCase().includes('festival')) {
    return `Ayyyy! DJ John coming at you with the HOTTEST event news! 🔥 The SoundMaster Festival lineup just dropped and it is MASSIVE this year! Block out your calendar for next month because we're bringing the absolute biggest names to the stage! Tickets drop this Friday - don't snooze on this one! 🎪🎵`;
  }
  
  // Default response for other topics
  return `Hey hey hey! DJ John on the decks this beautiful ${timeOfDay}! 🎧 Thanks for tuning into SoundMaster Radio! We're talking all about ${topic} today and I've got some ABSOLUTE BANGERS lined up for you! Keep those good vibes flowing, and don't touch that dial! 🔊`;
};

// Helper function to determine response type
const processResponseType = async (aiResponse: string, topic: string): Promise<AIResponse> => {
  // Check for technical support queries
  if (topic.toLowerCase().includes('help') || 
      topic.toLowerCase().includes('problem') || 
      topic.toLowerCase().includes('issue')) {
    return {
      text: aiResponse,
      type: 'support',
      data: {
        category: 'technical',
        priority: topic.toLowerCase().includes('urgent') ? 'high' : 'normal'
      }
    };
  }

  // Check if response contains song-related content
  if (topic.toLowerCase().includes('song') || topic.toLowerCase().includes('music')) {
    try {
      const { data: songs, error: songsError } = await supabase
        .from('songs')
        .select('*')
        .textSearch('title', topic);

      if (songsError) {
        console.error('Error fetching songs:', songsError);
      }

      if (songs && songs.length > 0) {
        return {
          text: aiResponse,
          type: 'song',
          data: songs
        };
      }
    } catch (err) {
      console.error("Error fetching songs data:", err);
    }
  }

  // Check if response is about booking
  if (topic.toLowerCase().includes('book') || topic.toLowerCase().includes('appointment')) {
    return {
      text: aiResponse,
      type: 'booking'
    };
  }

  // Check if response is about events
  if (topic.toLowerCase().includes('event')) {
    try {
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(3);

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
      }

      if (events && events.length > 0) {
        return {
          text: aiResponse,
          type: 'event',
          data: events
        };
      }
    } catch (err) {
      console.error("Error fetching events data:", err);
    }
  }

  return {
    text: aiResponse,
    type: 'text'
  };
};

// Modified to be a synchronous function since we're awaiting the result in WelcomeSection
export const processAIResponse = (response: AIResponse): string => {
  switch (response.type) {
    case 'song':
      return `${response.text}\n\nFound these songs:\n${response.data.map((song: any) => 
        `- ${song.title} by ${song.artist}`).join('\n')}`;
    
    case 'booking':
      return `${response.text}\n\nWould you like me to help you schedule an appointment?`;
    
    case 'event':
      return `${response.text}\n\nUpcoming events:\n${response.data.map((event: any) => 
        `- ${event.title} on ${new Date(event.date).toLocaleDateString()}`).join('\n')}`;
    
    case 'support':
      return `${response.text}\n\nI'll help you troubleshoot this issue. Can you provide more details about what you're experiencing?`;
    
    default:
      return response.text;
  }
};
