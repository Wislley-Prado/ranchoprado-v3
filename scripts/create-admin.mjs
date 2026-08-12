/**
 * Script para criar usuário admin no Supabase
 * Uso: node scripts/create-admin.mjs
 */

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
      console.log('   https://ranchoprado.vendopro.com.br');
      console.log('   → Auth → Users → Add user → Create new user → confirmar');
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
