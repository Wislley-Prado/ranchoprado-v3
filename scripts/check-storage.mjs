import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://elteoovghevwrefykkyh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdGVvb3ZnaGV2d3JlZnlra3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTMwODMsImV4cCI6MjA5NTc2OTA4M30.rlNr3KOMAH-QlwUwsbNQZYiW6W66HMiUnSG1ZuZpvb0';

const ADMIN_EMAIL = 'wislleyprado@gmail.com';
const ADMIN_PASSWORD = '1902Prado#2026';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log('🏁 Starting Supabase storage diagnostic...\n');

  // 1. Login
  console.log('1. Attempting login...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (loginError) {
    console.error('❌ Login failed:', loginError.message);
    return;
  }
  
  const userId = loginData.user.id;
  console.log(`✅ Login successful! User ID: ${userId}`);

  // 2. Check roles
  console.log('\n2. Checking roles for user...');
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId);

  if (rolesError) {
    console.error('❌ Error checking roles:', rolesError.message);
  } else {
    console.log('✅ Roles in database:', roles);
  }

  // 3. List buckets
  console.log('\n3. Checking visible storage buckets...');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error('❌ Error listing buckets:', bucketsError.message);
  } else {
    console.log('✅ Visible buckets:');
    buckets.forEach(b => console.log(`   - Name: "${b.name}" | ID: "${b.id}" | Public: ${b.public}`));
  }

  // 4. Try upload
  console.log('\n4. Attempting test file upload to "configuracoes" bucket...');
  const testContent = 'diagnostic-test-' + Date.now();
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('configuracoes')
    .upload('test-diagnostic.txt', Buffer.from(testContent), {
      contentType: 'text/plain',
      upsert: true
    });

  if (uploadError) {
    console.error('❌ Upload to "configuracoes" failed:', uploadError);
  } else {
    console.log('✅ Upload to "configuracoes" successful!', uploadData);
    
    // Clean up
    console.log('\n5. Cleaning up test file...');
    const { error: removeError } = await supabase.storage
      .from('configuracoes')
      .remove(['test-diagnostic.txt']);
      
    if (removeError) {
      console.error('❌ Error cleaning up test file:', removeError.message);
    } else {
      console.log('✅ Clean up successful!');
    }
  }
}

main().catch(console.error);
