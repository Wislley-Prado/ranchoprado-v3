/**
 * Script para criar usuário admin no Supabase
 * Uso: node scripts/create-admin.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://elteoovghevwrefykkyh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdGVvb3ZnaGV2d3JlZnlra3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTMwODMsImV4cCI6MjA5NTc2OTA4M30.rlNr3KOMAH-QlwUwsbNQZYiW6W66HMiUnSG1ZuZpvb0';

const ADMIN_EMAIL = 'wislleyprado@gmail.com';
const ADMIN_PASSWORD = '1902Prado#2026';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log('\n🚀 Criando usuário admin...\n');

  // 1. Tentar fazer login primeiro (usuário pode já existir)
  console.log('1️⃣  Verificando se usuário já existe (tentando login)...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  let userId;

  if (loginData?.user) {
    console.log(`✅ Usuário já existe! ID: ${loginData.user.id}`);
    userId = loginData.user.id;
  } else {
    // 2. Criar novo usuário
    console.log('2️⃣  Usuário não existe. Criando conta...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (signUpError) {
      console.error('❌ Erro ao criar usuário:', signUpError.message);
      console.log('\n⚠️  O usuário deve ser criado manualmente no Supabase Dashboard:');
      console.log('   https://supabase.com/dashboard/project/elteoovghevwrefykkyh/auth/users');
      console.log('   → Add user → Create new user → marcar "Auto Confirm User"');
      process.exit(1);
    }

    if (signUpData?.user) {
      userId = signUpData.user.id;
      console.log(`✅ Usuário criado! ID: ${userId}`);
      
      if (signUpData.user.email_confirmed_at === null) {
        console.log('⚠️  Email não confirmado. Confirme o email ou desative a verificação no Supabase.');
      }
    }
  }

  if (!userId) {
    console.error('❌ Não foi possível obter o ID do usuário.');
    process.exit(1);
  }

  // 3. Inserir role de admin
  console.log('\n3️⃣  Adicionando role de admin...');
  
  // Primeiro verifica se já existe
  const { data: existingRole } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();

  if (existingRole) {
    console.log('✅ Role de admin já existe para este usuário!');
  } else {
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' });

    if (roleError) {
      console.error('❌ Erro ao inserir role:', roleError.message);
      console.log('\n⚠️  Execute este SQL manualmente no Supabase SQL Editor:');
      console.log(`\nINSERT INTO public.user_roles (user_id, role) VALUES ('${userId}', 'admin');\n`);
    } else {
      console.log('✅ Role de admin inserida com sucesso!');
    }
  }

  console.log('\n🎉 Pronto! Tente logar em /admin/login com:');
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Senha: ${ADMIN_PASSWORD}\n`);
}

main().catch(console.error);
