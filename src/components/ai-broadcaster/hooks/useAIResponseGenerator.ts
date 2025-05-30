
import { useCallback } from 'react';
import { BroadcastTopic } from '../types';

interface AIProviderState {
  activeProvider: string | null;
  isInitializing: boolean;
  initializationError: boolean;
}

/**
 * Hook for generating AI responses
 */
export const useAIResponseGenerator = (aiProvider: AIProviderState) => {
  // Generate AI response based on topic
  const generateAIResponse = useCallback(async (topic: string): Promise<string> => {
    try {
      if (aiProvider.isInitializing || aiProvider.initializationError) {
        throw new Error('AI provider not ready');
      }
      
      // Create prompt based on topic
      let prompt = '';
      
      switch (topic) {
        case 'welcome':
          prompt = 'Introduce yourself as a radio DJ and welcome listeners to the stream';
          break;
        case 'weather':
          prompt = 'Give a brief weather update for today as a radio DJ';
          break;
        case 'news':
          prompt = 'Share a brief music industry news update as a radio DJ';
          break;
        case 'music':
          prompt = 'Talk about a trending song or artist as a radio DJ';
          break;
        case 'events':
          prompt = 'Mention upcoming music events as a radio DJ';
          break;
        default:
          prompt = `Talk about ${topic} as a radio DJ`;
          break;
      }
      
      // Select API endpoint based on active provider
      let endpoint;
      let body;
      
      switch (aiProvider.activeProvider) {
        case 'gemini':
          endpoint = '/api/ai/gemini';
          body = { prompt };
          break;
        case 'openrouter':
          endpoint = '/api/ai/openrouter';
          body = { prompt };
          break;
        case 'cloudflare':
          endpoint = '/api/ai/cloudflare';
          body = { prompt };
          break;
        default:
          // Local fallback
          return `Hey there, SoundMaster listeners! This is your AI DJ coming at you with some ${topic} vibes. The stream is pumping and we're keeping the energy high today! 🎵 Stay tuned for more great music and updates!`;
      }
      
      // Fake the API response for now since we're in the Lovable environment
      // In a real environment, this would be an actual fetch to the API endpoint
      console.log(`Generating AI response for ${topic} using ${aiProvider.activeProvider}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return a canned response based on the topic
      let response;
      
      switch (topic) {
        case 'welcome':
          response = "Heyyy SoundMaster fam! DJ Max on the mic, sliding into your day with the FRESHEST beats and smoothest vibes! 🎧 Whether you're crushing that workout, cruising the streets, or just chilling at home, we've got the perfect soundtrack locked and loaded! Keep it right here - the energy's just getting started! 🔊";
          break;
        case 'weather':
          response = "Quick weather check for ya, SoundMaster crew! ☀️ Looks like we're riding a perfect wave of sunshine today with temps in the mid-20s! Perfect weather to crank those windows down and blast our afternoon mix coming up next! 🎵 If you're heading out later, might want to grab a light jacket as we're cooling down after sunset! Keep those good vibes flowing! 🌈";
          break;
        case 'news':
          response = "Breaking music news alert, SoundMaster nation! 📰 The charts are SHAKING today with that surprise collab track dropping from DJ Shimza and Black Coffee! And listen up festival heads - Ultra just announced their full lineup for next month and it is STACKED! 🔥 I'll be spinning some of those headliners in the next hour, so don't touch that dial! Music world's buzzing and we've got all the sounds right here! 🎧";
          break;
        case 'music':
          response = "Alright SoundMaster fam, that track you just heard was the absolute FIRE new single from Amapiano king Kabza De Small! 🔥 The baseline on that one hits so deep I can feel it in my SOUL! If you're digging those vibes, hold tight because I've got a whole hour of fresh Amapiano coming up after the news! Drop me a message if you've got requests! 🎵";
          break;
        case 'events':
          response = "Listen up, party people! 🎪 SoundMaster's Sunset Sessions are kicking off this Friday at Shimmy Beach Club! We've got Black Coffee headlining with support from DJ Zinhle and Kyle Watson! Tickets moving FAST so grab yours on our website now! I'll be there mixing at the pre-party, so come say hi! This weekend is gonna be LEGENDARY! 🎧";
          break;
        default:
          response = `Hey SoundMaster crew! DJ Max dropping in with some thoughts about ${topic}! The studio is buzzing with energy today as we explore all things ${topic}! Keep those messages coming in - what's YOUR take on this hot topic? Next up, we've got an absolute BANGER that matches today's vibe perfectly! 🎵`;
      }
      
      return response;
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Return a fallback response
      return "Hey SoundMaster listeners! We're experiencing some technical difficulties with our AI DJ system, but the music keeps flowing! Stay tuned for more great tracks coming up next! 🎧";
    }
  }, [aiProvider.activeProvider, aiProvider.isInitializing, aiProvider.initializationError]);

  return { generateAIResponse };
};

export default useAIResponseGenerator;
