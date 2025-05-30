
import { useCallback } from "react";

interface UseStreamUrlsProps {
  streamUrl: string;
  quality: string;
  platform: 'kick' | 'youtube';
}

export const useStreamUrls = ({ streamUrl, quality, platform }: UseStreamUrlsProps) => {
  const getStreamUrl = useCallback(() => {
    if (platform === 'kick' && quality !== 'auto' && streamUrl.includes('player.kick.com')) {
      return `${streamUrl}?quality=${quality}`;
    }
    
    if (platform === 'youtube') {
      // For YouTube, we can add quality parameters if available
      try {
        const url = new URL(streamUrl);
        if (quality !== 'auto') {
          // Map quality names to YouTube format
          const ytQuality = quality === '1080p' ? 'hd1080' : 
                          quality === '720p' ? 'hd720' : 
                          quality === '480p' ? 'large' : 
                          quality === '360p' ? 'medium' : 'auto';
          
          url.searchParams.set('vq', ytQuality);
        }
        return url.toString();
      } catch (error) {
        console.error('Error parsing YouTube URL:', error);
        return streamUrl;
      }
    }
    
    return streamUrl;
  }, [quality, streamUrl, platform]);

  const getChatUrl = useCallback(() => {
    if (platform === 'kick') {
      // Extract channel name from URL
      const channelMatch = streamUrl.match(/player\.kick\.com\/([^?&]+)/);
      const channel = channelMatch ? channelMatch[1] : 'soundmasterlive';
      return `https://kick.com/${channel}/chatroom`;
    } else if (platform === 'youtube') {
      // For YouTube, extract video ID and use YouTube's chat embed
      try {
        const url = new URL(streamUrl);
        let videoId = '';
        
        if (url.searchParams.has('v')) {
          videoId = url.searchParams.get('v') || '';
        } else if (url.pathname.includes('embed/')) {
          videoId = url.pathname.split('embed/')[1].split('/')[0].split('?')[0];
        } else if (url.pathname.includes('live_stream')) {
          // For live streams, use the channel ID
          const channelId = url.searchParams.get('channel') || '';
          return `https://www.youtube.com/live_chat?v=live_stream&embed_domain=${window.location.hostname}&channel=${channelId}`;
        }
        
        if (videoId) {
          return `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${window.location.hostname}`;
        }
      } catch (error) {
        console.error('Error parsing YouTube URL:', error);
      }
      
      // Fallback
      return '';
    }
    
    return '';
  }, [streamUrl, platform]);

  return {
    getStreamUrl,
    getChatUrl
  };
};
