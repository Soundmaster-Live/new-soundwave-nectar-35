/**
 * Types for stream-related functionality
 */

/**
 * Represents metadata for an audio stream
 */
export interface StreamMetadata {
  /**
   * The title of the currently playing track
   */
  title?: string;
  
  /**
   * The artist of the currently playing track
   */
  artist?: string;
  
  /**
   * The album of the currently playing track (if available)
   */
  album?: string;
  
  /**
   * URL to the album artwork (if available)
   */
  artwork?: string;
  
  /**
   * Timestamp when this metadata was last updated
   */
  timestamp?: number;
  
  /**
   * Any additional metadata properties
   */
  [key: string]: any;
}

/**
 * Stream status information
 */
export interface StreamStatus {
  /**
   * Whether the stream is currently online
   */
  isOnline: boolean;
  
  /**
   * Current number of listeners
   */
  listeners?: number;
  
  /**
   * Current peak listeners
   */
  peakListeners?: number;
  
  /**
   * Server status information
   */
  serverInfo?: {
    name?: string;
    description?: string;
    genre?: string;
    url?: string;
  };
}
