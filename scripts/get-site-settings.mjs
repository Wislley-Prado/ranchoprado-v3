import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://elteoovghevwrefykkyh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdGVvb3ZnaGV2d3JlZnlra3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTMwODMsImV4cCI6MjA5NTc2OTA4M30.rlNr3KOMAH-QlwUwsbNQZYiW6W66HMiUnSG1ZuZpvb0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const { data, error } = await supabase
    .from('site_settings_public' as any)
    .select('youtube_live_url, youtube_video_url, youtube_institucional_url')
    .single();

  if (error) {
    console.error('Error fetching settings:', error);
  } else {
    console.log('Site settings:', JSON.stringify(data, null, 2));
  }
}

main().catch(console.error);
