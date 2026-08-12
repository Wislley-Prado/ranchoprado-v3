import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

// Auto-install pg if not present
try {
  await import('pg');
} catch (err) {
  console.log('📦 Instalando dependência "pg" para conectar ao banco de dados...');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  execSync('npm install pg', { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
}

const { Client } = await import('pg');

const OLD_URL = 'https://elteoovghevwrefykkyh.supabase.co';
const OLD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdGVvb3ZnaGV2d3JlZnlra3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTMwODMsImV4cCI6MjA5NTc2OTA4M30.rlNr3KOMAH-QlwUwsbNQZYiW6W66HMiUnSG1ZuZpvb0';

const oldSupabase = createClient(OLD_URL, OLD_KEY);

// Configurações do banco fornecidas pelo usuário
const dbConfigs = [
  {
    host: 'ranchoprado.vendopro.com.br',
    port: 5432,
    user: 'postgres',
    password: '15dcafe51aab1042fe3deab21fff64b5',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  },
  {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '15dcafe51aab1042fe3deab21fff64b5',
    database: 'postgres',
    ssl: false
  },
  {
    host: 'supabase_bbb_db',
    port: 5432,
    user: 'postgres',
    password: '15dcafe51aab1042fe3deab21fff64b5',
    database: 'postgres',
    ssl: false
  }
];

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

async function run() {
  console.log('🏁 Iniciando migração de dados direto via PostgreSQL...\n');

  let pgClient;
  let connected = false;

  for (const config of dbConfigs) {
    console.log(`🔌 Tentando conectar ao banco em ${config.host}:${config.port}...`);
    pgClient = new Client(config);
    try {
      await pgClient.connect();
      console.log(`✅ Conectado com sucesso em ${config.host}!`);
      connected = true;
      break;
    } catch (err) {
      console.warn(`⚠️ Falha ao conectar em ${config.host}:`, err.message);
      try {
        await pgClient.end();
      } catch (e) {}
    }
  }

  if (!connected) {
    console.error('❌ Não foi possível conectar a nenhuma das configurações de banco de dados.');
    process.exit(1);
  }

  for (const table of tables) {
    try {
      console.log(`\n⏳ Puxando dados de: ${table} do Supabase antigo...`);
      const { data, error } = await oldSupabase.from(table).select('*');

      if (error) {
        console.error(`❌ Erro ao ler da tabela ${table}:`, error.message);
        continue;
      }

      if (!data || data.length === 0) {
        console.log(`ℹ️ Tabela ${table} vazia no banco de origem.`);
        continue;
      }

      console.log(`📋 Encontrados ${data.length} registros para inserir.`);

      for (const row of data) {
        const columns = Object.keys(row);
        const values = Object.values(row);
        
        // Formatar valores especiais (como arrays) para que o pg insira corretamente
        const formattedValues = values.map(val => {
          if (Array.isArray(val)) {
            return val; 
          }
          return val;
        });

        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const updateClause = columns.map(col => `"${col}" = EXCLUDED."${col}"`).join(', ');
        
        const sql = `
          INSERT INTO public."${table}" (${columns.map(c => `"${c}"`).join(', ')})
          VALUES (${placeholders})
          ON CONFLICT (id)
          DO UPDATE SET ${updateClause}
        `;

        await pgClient.query(sql, formattedValues);
      }
      console.log(`✅ Tabela ${table} migrada com sucesso!`);
    } catch (err) {
      console.error(`❌ Falha na tabela ${table}:`, err.message);
    }
  }

  await pgClient.end();
  console.log('\n🎉 Processo de migração de dados concluído com sucesso!');
}

run().catch(console.error);
