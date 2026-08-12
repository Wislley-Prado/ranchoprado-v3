import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Tentar carregar do arquivo .env
let envUrl = '';
let envKey = '';
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/);
    const keyMatch = envContent.match(/VITE_SUPABASE_PUBLISHABLE_KEY\s*=\s*["']?([^"'\r\n]+)["']?/);
    if (urlMatch) envUrl = urlMatch[1];
    if (keyMatch) envKey = keyMatch[1];
  }
} catch (e) {
  // Ignorar erros
}

const SUPABASE_URL = envUrl || 'https://ranchoprado.vendopro.com.br';
const SUPABASE_ANON_KEY = envKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.0if6RmuwClXzN1FBo0qE4a8TNRrKEuVMPDC4PVK9O2A';

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
