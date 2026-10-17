/**
 * Script para habilitar email auth e criar usuário admin via GoTrue Admin API
 */

const SUPABASE_URL = 'https://ranchoprado.vendopro.com.br';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogInNlcnZpY2Vfcm9sZSIsCiAgImlzcyI6ICJzdXBhYmFzZSIsCiAgImlhdCI6IDE3MTUwNTA4MDAsCiAgImV4cCI6IDE4NzI4MTcyMDAKfQ.O5VK2jG17UYT_PHvXJQV--DGaYPOuAgigi0RRhfJrj0';

const headers = {
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'apikey': SERVICE_KEY,
};

async function run() {
  console.log('🔧 Tentando criar usuário admin via GoTrue Admin API...\n');

  // 1. Tentar criar o usuário via admin API (bypass das restrições de login)
  const createUserRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: 'wislleyprado7@gmail.com',
      password: 'prado2026',
      email_confirm: true,
      user_metadata: { role: 'admin' },
    }),
  });

  const createUserBody = await createUserRes.json();

  if (!createUserRes.ok) {
    console.error('❌ Erro ao criar usuário:', JSON.stringify(createUserBody, null, 2));
    
    // Se o usuário já existe, tenta atualizar a senha
    if (createUserBody.message?.includes('already') || createUserBody.code === 422) {
      console.log('⚠️ Usuário já existe. Buscando e atualizando senha...');
      
      // Listar usuários para encontrar o ID
      const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=100`, {
        headers,
      });
      const listBody = await listRes.json();
      const user = listBody.users?.find(u => u.email === 'wislleyprado7@gmail.com');
      
      if (user) {
        console.log(`✅ Usuário encontrado: ${user.id}`);
        
        // Atualiza senha
        const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            password: 'prado2026',
            email_confirm: true,
          }),
        });
        const updateBody = await updateRes.json();
        if (updateRes.ok) {
          console.log('✅ Senha atualizada com sucesso!');
        } else {
          console.error('❌ Erro ao atualizar senha:', JSON.stringify(updateBody, null, 2));
        }
        
        // Garante role admin no banco
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
        await supabase.from('user_roles').delete().eq('user_id', user.id);
        await supabase.from('user_roles').insert({ user_id: user.id, role: 'admin' });
        console.log('✅ Role admin configurada!');
      }
    }
  } else {
    const userId = createUserBody.id;
    console.log(`✅ Usuário criado com sucesso! ID: ${userId}`);
    
    // Atribui role admin
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    await supabase.from('user_roles').delete().eq('user_id', userId);
    await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });
    console.log('✅ Role admin configurada!');
  }

  // 2. Verificar se email login está ativo
  console.log('\n🔍 Verificando configurações de autenticação...');
  const configRes = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
    headers,
  });
  const configBody = await configRes.json();
  console.log('📋 Configurações auth:', JSON.stringify(configBody, null, 2));
}

run().catch(console.error);
