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

async function run() {
  console.log('🔌 Buscando dados em tempo real da represa de Três Marias no site da CEMIG...');
  
  let rawJson;
  try {
    const cemigResponse = await fetch('https://www.cemig.com.br/wp-json/api-busca-usinas/v1/send-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'action=buscar_dados_usina&usina_id=UHE_TRES_MARIAS',
    });

    if (!cemigResponse.ok) {
      throw new Error(`Erro na resposta da CEMIG: ${cemigResponse.status}`);
    }

    rawJson = await cemigResponse.json();
    console.log('✅ Dados obtidos com sucesso do site da CEMIG!');
  } catch (err) {
    console.error('❌ Erro ao consultar a API da CEMIG:', err.message);
    process.exit(1);
  }

  // Helper para formatar a data
  const formatDate = (isoStr) => {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getLatest = (arr) => arr && arr.length > 0 ? arr[arr.length - 1] : null;

  const latestNivel = getLatest(rawJson.VAL_NIVEL);
  const latestVol = getLatest(rawJson.VAL_VOLUTIL);
  const latestAflu = getLatest(rawJson.VAL_VAZAOAFLU);
  const latestDeflu = getLatest(rawJson.VAL_VAZAODEFLU);

  const tempoRealItem = {
    tipo: "tempo_real",
    data_leitura: formatDate(latestNivel?.Timestamp),
    nivel_inicial: "--",
    volume_inicial: "--",
    nivel_atual: latestNivel ? latestNivel.Value.toString() : "0",
    volume_percentual: latestVol ? latestVol.Value.toString() : "0",
    afluencia: latestAflu ? latestAflu.Value.toString() : "0",
    defluencia: latestDeflu ? latestDeflu.Value.toString() : "0"
  };

  const historyMap = {};

  const processArray = (arr, fieldName) => {
    if (!arr) return;
    for (const item of arr) {
      const ts = item.Timestamp;
      if (!historyMap[ts]) {
        historyMap[ts] = {};
      }
      historyMap[ts][fieldName] = item.Value;
    }
  };

  processArray(rawJson.VAL_NIVEL, 'nivel');
  processArray(rawJson.VAL_VOLUTIL, 'volume');
  processArray(rawJson.VAL_VAZAOAFLU, 'afluencia');
  processArray(rawJson.VAL_VAZAODEFLU, 'defluencia');

  const historicoItems = Object.keys(historyMap)
    .sort((a, b) => new Date(b) - new Date(a))
    .map(ts => {
      const val = historyMap[ts];
      return {
        tipo: "historico",
        data_leitura: formatDate(ts),
        nivel_inicial: "--",
        volume_inicial: "--",
        nivel_atual: val.nivel !== undefined ? val.nivel.toString() : "0",
        volume_percentual: val.volume !== undefined ? val.volume.toString() : "0",
        afluencia: val.afluencia !== undefined ? val.afluencia.toString() : "0",
        defluencia: val.defluencia !== undefined ? val.defluencia.toString() : "0"
      };
    });

  const finalData = [tempoRealItem, ...historicoItems];

  // Conectar ao Postgres e atualizar a tabela
  let pgClient;
  let connected = false;

  for (const config of dbConfigs) {
    console.log(`🔌 Tentando conectar ao banco em ${config.host}:${config.port}...`);
    pgClient = new Client(config);
    try {
      await pgClient.connect();
      console.log(`✅ Conectado ao Postgres em ${config.host}!`);
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
    console.error('❌ Não foi possível conectar ao banco para salvar os dados da represa.');
    process.exit(1);
  }

  try {
    console.log('💾 Salvando dados na tabela public.dam_data...');
    const sql = `
      INSERT INTO public.dam_data (id, data, updated_at)
      VALUES (1, $1::jsonb, $2)
      ON CONFLICT (id)
      DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
    `;
    await pgClient.query(sql, [JSON.stringify(finalData), new Date().toISOString()]);
    console.log('🎉 Dados da represa salvos e atualizados com sucesso no banco de dados!');
  } catch (err) {
    console.error('❌ Erro ao salvar dados no Postgres:', err.message);
  } finally {
    await pgClient.end();
  }
}

run().catch(console.error);
