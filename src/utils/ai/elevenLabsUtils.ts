
// This file re-exports all the functions from the new modular structure
// to maintain backward compatibility with existing code.
// New code should import directly from the elevenlabs folder instead.

import { 
  generateSpeech, 
  playTTSAudio,
  TTSOptions
} from './elevenlabs/ttsApi';

import { 
  useTTSSettings 
} from './elevenlabs/useTTSSettings';

import {
  getTTSUsageMetrics,
  updateTTSUsageMetrics,
  resetUsageMetrics
} from './elevenlabs/usageMetrics';

export {
  generateSpeech,
  playTTSAudio,
  useTTSSettings,
  getTTSUsageMetrics,
  updateTTSUsageMetrics,
  resetUsageMetrics
};

export type { TTSOptions };
