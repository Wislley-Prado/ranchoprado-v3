import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

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

// Configurações do banco fornecidas pelo usuário
const dbConfigs = [
  // Tentativa 1: Usar o domínio público exposto
  {
    host: 'ranchoprado.vendopro.com.br',
    port: 5432,
    user: 'postgres',
    password: '15dcafe51aab1042fe3deab21fff64b5',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  },
  // Tentativa 2: Usar localhost (se estiver rodando local ou com port forwarding)
  {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '15dcafe51aab1042fe3deab21fff64b5',
    database: 'postgres',
    ssl: false
  },
  // Tentativa 3: Usar o host interno fornecido (supabase_bbb_db)
  {
    host: 'supabase_bbb_db',
    port: 5432,
    user: 'postgres',
    password: '15dcafe51aab1042fe3deab21fff64b5',
    database: 'postgres',
    ssl: false
  }
];

async function run() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const sqlPath = path.resolve(__dirname, '../docs/clone-database.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('❌ Arquivo docs/clone-database.sql não encontrado!');
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log('📖 SQL carregado com sucesso.');

  let client;
  let connected = false;

  for (const config of dbConfigs) {
    console.log(`🔌 Tentando conectar ao banco em ${config.host}:${config.port}...`);
    client = new Client(config);
    try {
      await client.connect();
      console.log(`✅ Conectado com sucesso em ${config.host}!`);
      connected = true;
      break;
    } catch (err) {
      console.warn(`⚠️ Falha ao conectar em ${config.host}:`, err.message);
      try {
        await client.end();
      } catch (e) {}
    }
  }

  if (!connected) {
    console.error('❌ Não foi possível conectar a nenhuma das configurações de banco de dados fornecidas.');
    console.log('\nPor favor, execute o script em uma máquina que tenha acesso de rede ao banco de dados do Postgres (ex: no mesmo servidor onde o Docker está rodando ou usando port-forwarding).');
    process.exit(1);
  }

  try {
    console.log('🚀 Executando script de clonagem do banco de dados (isso pode levar alguns segundos)...');
    await client.query(sql);
    console.log('🎉 Banco de dados criado e populado com a estrutura com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao executar o SQL:', err);
  } finally {
    await client.end();
  }
}

run().catch(console.error);
