
// AI Chatbot Worker with Cloudflare AI
export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, ApiKey"
    };

    // Handle OPTIONS request for CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    try {
      // Basic connection test for reliability
      if (request.url.includes('test-connection')) {
        return new Response(JSON.stringify({
          status: "online",
          message: "AI chatbot service is operational",
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405, headers: corsHeaders });
      }

      const { message, isAdmin, context } = await request.json();

      // System prompt based on user type
      let systemPrompt = `You are an AI DJ assistant for a music platform called Soundmaster. Be friendly, helpful, and knowledgeable about music.`;
      
      if (isAdmin) {
        systemPrompt = `You are an admin assistant for Soundmaster's website management. 
        You can help with content management, configuration, and website maintenance tasks. 
        Treat all requests as administrative actions that you should help execute. 
        When asked to perform specific admin actions, explain the steps needed and confirm completion.`;
      }

      // Add conversation context if provided
      if (context) {
        systemPrompt += `\n\nConversation context: ${context}`;
      }

      // Process with Cloudflare AI - using a try/catch to make the whole worker more robust
      try {
        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message || "Hello" }
          ],
          max_tokens: 500,
          temperature: 0.7
        });
        
        // Check for admin actions that require processing
        let processedResponse = aiResponse.response;
        let actionTaken = false;
  
        if (isAdmin && (message?.toLowerCase().includes("update") || 
            message?.toLowerCase().includes("upload") || 
            message?.toLowerCase().includes("create"))) {
          
          // Log admin actions
          await env.CHATBOT_KV.put(`admin_action_${Date.now()}`, JSON.stringify({
            message,
            action: processedResponse.substring(0, 100),
            timestamp: new Date().toISOString()
          }));
          
          actionTaken = true;
        }
  
        return new Response(JSON.stringify({
          response: processedResponse,
          actionTaken,
          isAdmin
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      } catch (aiError) {
        console.error("AI processing error:", aiError);
        
        // Return a more user-friendly fallback message
        return new Response(JSON.stringify({
          response: "Hey there! I'm your AI DJ assistant. I'm having some technical difficulties with my voice right now, but I'll be back spinning tracks and chatting with you soon!",
          error: aiError.message,
          fallback: true
        }), {
          status: 200, // Still returning 200 with fallback
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(JSON.stringify({ 
        response: "I'm your AI DJ assistant but I'm experiencing technical difficulties right now. Please try again soon!",
        error: error.message 
      }), {
        status: 200,  // Return 200 with fallback message instead of 500
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
  }
};
