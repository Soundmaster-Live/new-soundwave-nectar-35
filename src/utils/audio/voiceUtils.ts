
import { toast } from '@/components/ui/use-toast';

// Voice utility constants
const MAX_DAILY_CHAR_LIMIT = 1000;
const MAX_DAILY_REQUESTS = 10;

// Get current date in YYYY-MM-DD format for key creation
const getCurrentDateKey = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Get metrics with proper date rotation and user prefix
export const getVoiceUsageMetrics = (userPrefix = '') => {
  const dateKey = getCurrentDateKey();
  const storageKey = `${userPrefix}voice_usage_${dateKey}`;
  
  let metrics = {
    dailyCharCount: 0,
    dailyRequestCount: 0
  };
  
  const savedMetrics = localStorage.getItem(storageKey);
  if (savedMetrics) {
    try {
      metrics = JSON.parse(savedMetrics);
    } catch (e) {
      console.error("Failed to parse saved metrics, using defaults");
    }
  }
  
  return metrics;
};

// Update metrics and save to localStorage
export const updateVoiceUsageMetrics = (charCount: number, userPrefix = '') => {
  const dateKey = getCurrentDateKey();
  const storageKey = `${userPrefix}voice_usage_${dateKey}`;
  
  const metrics = getVoiceUsageMetrics(userPrefix);
  
  metrics.dailyCharCount += charCount;
  metrics.dailyRequestCount += 1;
  
  localStorage.setItem(storageKey, JSON.stringify(metrics));
  
  return metrics;
};

// Reset usage metrics
export const resetVoiceUsageMetrics = (userPrefix = '') => {
  const dateKey = getCurrentDateKey();
  const storageKey = `${userPrefix}voice_usage_${dateKey}`;
  
  const metrics = {
    dailyCharCount: 0,
    dailyRequestCount: 0
  };
  
  localStorage.setItem(storageKey, JSON.stringify(metrics));
};

// Check if usage limits are exceeded
export const isVoiceUsageLimitExceeded = (userPrefix = ''): boolean => {
  const metrics = getVoiceUsageMetrics(userPrefix);
  return (
    metrics.dailyCharCount >= MAX_DAILY_CHAR_LIMIT || 
    metrics.dailyRequestCount >= MAX_DAILY_REQUESTS
  );
};

// Get usage limits
export const getVoiceUsageLimits = () => {
  return {
    MAX_DAILY_CHAR_LIMIT,
    MAX_DAILY_REQUESTS
  };
};

// Generate speech using the browser's built-in TTS
export const generateSpeech = async (text: string, options: any = {}): Promise<boolean> => {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) return false;
  
  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if specified
    if (options.voice) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => 
        v.name === options.voice || v.voiceURI === options.voice
      );
      if (selectedVoice) utterance.voice = selectedVoice;
    }
    
    // Set other options
    if (options.rate) utterance.rate = options.rate;
    if (options.pitch) utterance.pitch = options.pitch;
    if (options.volume) utterance.volume = options.volume;
    
    // Speak
    window.speechSynthesis.speak(utterance);
    
    return true;
  } catch (error) {
    console.error('Speech generation error:', error);
    toast({
      title: "Speech Error",
      description: "Failed to generate speech. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Play audio from a source
export const playAudio = async (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(src);
      
      audio.onended = () => {
        resolve();
      };
      
      audio.onerror = (error) => {
        reject(error);
      };
      
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        reject(error);
      });
      
    } catch (error) {
      console.error('Error setting up audio playback:', error);
      reject(error);
    }
  });
};

// Get available voices
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
};
