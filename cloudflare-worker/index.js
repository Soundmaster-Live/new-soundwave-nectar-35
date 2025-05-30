import { corsHeaders } from './cors';

export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          ...corsHeaders,
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    try {
      const url = new URL(request.url);
      const targetUrl = url.searchParams.get('url');
      const checkOnly = url.searchParams.get('checkOnly') === 'true';

      if (!targetUrl) {
        throw new Error('No target URL provided');
      }

      // Set a timeout for the fetch request
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout for status checks

      try {
        const response = await fetch(targetUrl, {
          method: request.method,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Cloudflare-Worker)',
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'Icy-MetaData': '1',
            'Range': checkOnly ? 'bytes=0-0' : (request.headers.get('Range') || 'bytes=0-'),
          },
          signal: controller.signal,
          cf: {
            cacheTtl: 0,
            cacheEverything: false,
            minify: false,
            mirage: false,
          },
        });

        clearTimeout(timeout);

        // If this is just a status check, return a simple response
        if (checkOnly) {
          return new Response(JSON.stringify({ 
            status: response.status,
            isLive: response.status === 200 || response.status === 206 
          }), {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
          });
        }

        // Otherwise return the full stream response
        const modifiedResponse = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: {
            ...corsHeaders,
            'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Connection': 'keep-alive',
            'Access-Control-Expose-Headers': '*',
            'Accept-Ranges': 'bytes',
          },
        });

        return modifiedResponse;
      } catch (fetchError) {
        clearTimeout(timeout);
        throw fetchError;
      }
    } catch (error) {
      console.error('Proxy error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }
  },
};
