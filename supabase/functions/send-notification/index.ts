import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Allow any origin to call this function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1) Initialize Supabase client (anon key is fine for inserts under RLS)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // 2) Parse the incoming JSON
    const { type, message, userId } = await req.json()

    // 3) Insert a new row into "notifications"
    const { error: insertError } = await supabaseClient
      .from('notifications')
      .insert({ user_id: userId, type, message, read: false })
    if (insertError) throw insertError

    // 4) Look up the user's Expo push token from your "profiles" table
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('expo_push_token')
      .eq('id', userId)
      .single()
    if (profileError) throw profileError

    // 5) If they have a token, call the Expo Push API
    if (profile?.expo_push_token) {
      const expoRes = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Deno.env.get('EXPO_ACCESS_TOKEN')}`,
        },
        body: JSON.stringify({
          to: profile.expo_push_token,
          sound: 'default',
          body: message,
          data: { type },
        }),
      })
      const expoJson = await expoRes.json()
      console.log('Expo push response:', expoJson)
    } else {
      console.log(`No push token for user ${userId}, skipping push send`)
    }

    // 6) Return success
    return new Response(
      JSON.stringify({ message: 'Notification sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: unknown) {
    console.error('Error in notification function:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
