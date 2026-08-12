import { createClient } from '@supabase/supabase-js';

const NEW_URL = 'https://ranchoprado.vendopro.com.br';
const NEW_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogInNlcnZpY2Vfcm9sZSIsCiAgImlzcyI6ICJzdXBhYmFzZSIsCiAgImlhdCI6IDE3MTUwNTA4MDAsCiAgImV4cCI6IDE4NzI4MTcyMDAKfQ.O5VK2jG17UYT_PHvXJQV--DGaYPOuAgigi0RRhfJrj0';

const supabase = createClient(NEW_URL, NEW_SERVICE_KEY);

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

  try {
    console.log('💾 Enviando dados para o Supabase via API HTTP (Porta 443)...');
    const { error: upsertError } = await supabase
      .from('dam_data')
      .upsert({
        id: 1,
        data: finalData,
        updated_at: new Date().toISOString()
      });

    if (upsertError) {
      throw new Error(upsertError.message);
    }
    console.log('🎉 Dados da represa salvos e atualizados com sucesso no banco de dados!');
  } catch (err) {
    console.error('❌ Erro ao salvar dados no Supabase:', err.message);
  }
}

run().catch(console.error);
