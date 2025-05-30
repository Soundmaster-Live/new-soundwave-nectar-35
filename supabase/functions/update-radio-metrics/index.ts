
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get current radio metrics
    const { data: stations } = await supabase
      .from('stations')
      .select('id, current_listeners');

    if (!stations) {
      throw new Error('No stations found');
    }

    // Update metrics for each station
    for (const station of stations) {
      // Insert hourly metrics
      await supabase.from('radio_metrics').insert({
        station_id: station.id,
        peak_listeners: station.current_listeners,
        average_listeners: station.current_listeners,
        total_unique_listeners: await getUniqueListeners(station.id),
        period: 'hourly'
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating radio metrics:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getUniqueListeners(stationId: string): Promise<number> {
  const { data } = await supabase
    .from('station_listeners')
    .select('user_id')
    .eq('station_id', stationId)
    .distinct();
  
  return data?.length || 0;
}
