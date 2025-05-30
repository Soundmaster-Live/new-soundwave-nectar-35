
export type BroadcastTopic = 'welcome' | 'weather' | 'news' | 'music' | 'events' | 'conversation';

export interface Message {
  content: string;
  role: 'user' | 'assistant' | 'system';
  topic?: BroadcastTopic;
}

// Alias BroadcasterMessage to Message for backward compatibility
export type BroadcasterMessage = Message;

export interface AIResponse {
  text: string;
  type: string;
  provider: string;
}
