import { createClient } from '@supabase/supabase-js';

const OLD_URL = 'https://elteoovghevwrefykkyh.supabase.co';
const OLD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdGVvb3ZnaGV2d3JlZnlra3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTMwODMsImV4cCI6MjA5NTc2OTA4M30.rlNr3KOMAH-QlwUwsbNQZYiW6W66HMiUnSG1ZuZpvb0';

const NEW_URL = 'https://ranchoprado.vendopro.com.br';
const NEW_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogInNlcnZpY2Vfcm9sZSIsCiAgImlzcyI6ICJzdXBhYmFzZSIsCiAgImlhdCI6IDE3MTUwNTA4MDAsCiAgImV4cCI6IDE4NzI4MTcyMDAKfQ.O5VK2jG17UYT_PHvXJQV--DGaYPOuAgigi0RRhfJrj0';

const oldSupabase = createClient(OLD_URL, OLD_KEY);
const newSupabase = createClient(NEW_URL, NEW_SERVICE_KEY);

const tables = [
  'ranchos',
  'rancho_imagens',
  'rancho_analytics',
  'pacotes',
  'pacote_imagens',
  'pacote_analytics',
  'depoimentos',
  'blog_posts',
  'blog_analytics',
  'faqs',
  'faq_votes',
  'avaliacoes',
  'anuncios',
  'site_settings',
  'configuracoes',
  'dam_data',
  'whatsapp_analytics',
  'categorias',
  'produtos',
  'produto_imagens',
  'propriedades_venda',
  'user_roles'
];

async function migrateTable(tableName) {
  console.log(`\n⏳ Migrando tabela: ${tableName}...`);
  
  // 1. Puxar todos os dados do Supabase antigo
  const { data, error } = await oldSupabase.from(tableName).select('*');
  
  if (error) {
    console.error(`❌ Erro ao ler da tabela ${tableName}:`, error.message);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log(`ℹ️ Tabela ${tableName} está vazia no banco de origem.`);
    return;
  }
  
  console.log(`📋 Encontrados ${data.length} registros para migrar.`);
  
  // 2. Inserir no novo Supabase
  const { error: insertError } = await newSupabase.from(tableName).upsert(data, { onConflict: 'id' });
  
  if (insertError) {
    console.error(`❌ Erro ao inserir na tabela ${tableName}:`, insertError.message);
  } else {
    console.log(`✅ Tabela ${tableName} migrada com sucesso!`);
  }
}

async function main() {
  console.log('🏁 Iniciando migração de dados do Supabase antigo para o novo via API REST...\n');
  for (const table of tables) {
    try {
      await migrateTable(table);
    } catch (e) {
      console.error(`❌ Falha crítica na tabela ${table}:`, e);
    }
  }
  console.log('\n🎉 Processo de migração de dados concluído!');
}

main().catch(console.error);
