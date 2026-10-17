// api/dam-data.js - Vercel Serverless Function com Edge Caching
export default async function handler(req, res) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // EDGE CACHE DA VERCEL: 30 minutos em cache, 1 hora de stale-while-revalidate
  // Isso garante que milhares de visitas NÃO pesam o servidor nem a CEMIG
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const cemigRes = await fetch('https://www.cemig.com.br/wp-json/api-busca-usinas/v1/send-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: 'action=buscar_dados_usina&usina_id=UHE_TRES_MARIAS'
    });

    if (!cemigRes.ok) {
      throw new Error(`CEMIG status: ${cemigRes.status}`);
    }

    const raw = await cemigRes.json();

    const getLatest = (arr) => (arr && arr.length > 0 ? arr[arr.length - 1] : null);

    const latestNivel = getLatest(raw.VAL_NIVEL);
    const latestVol = getLatest(raw.VAL_VOLUTIL);
    const latestAflu = getLatest(raw.VAL_VAZAOAFLU);
    const latestDeflu = getLatest(raw.VAL_VAZAODEFLU);
    const latestChuva = getLatest(raw.VAL_CHUVA);

    // Formatar data em horário de Brasília
    const formatTimestampBR = (iso) => {
      if (!iso) return '';
      const d = new Date(iso);
      const day = String(d.getUTCDate()).padStart(2, '0');
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const year = d.getUTCFullYear();
      const hours = String(d.getUTCHours()).padStart(2, '0');
      const minutes = String(d.getUTCMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const formatDateBR = (iso) => {
      if (!iso) return '';
      const d = new Date(iso);
      const day = String(d.getUTCDate()).padStart(2, '0');
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const year = d.getUTCFullYear();
      return `${day}/${month}/${year}`;
    };

    const nivelAtualNum = latestNivel ? Number(latestNivel.Value.toFixed(2)) : 568.24;
    const volumeUtilNum = latestVol ? Number(latestVol.Value.toFixed(2)) : 72.48;
    const afluenciaNum = latestAflu ? Number(latestAflu.Value.toFixed(2)) : 54.74;
    const defluenciaNum = latestDeflu ? Number(latestDeflu.Value.toFixed(2)) : 1174.77;
    const chuvaNum = latestChuva ? Number(latestChuva.Value.toFixed(1)) : 0;

    // Histórico de medições recentes de nível
    const historicoMedicoes = (raw.VAL_NIVEL || []).slice(-6).map((item) => {
      const d = new Date(item.Timestamp);
      const hora = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
      return {
        timestamp: item.Timestamp,
        hora,
        nivel: Number(item.Value.toFixed(2))
      };
    });

    // Histórico de 48h de vazão defluente
    const historicoDefluencia48h = (raw.VAL_VAZAODEFLUGRAF || []).map((item) => {
      const d = new Date(item.Timestamp);
      const hora = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
      const dataFormatada = `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      return {
        timestamp: item.Timestamp,
        hora,
        dataFormatada,
        defluencia: Number(item.Value.toFixed(2))
      };
    });

    // Formato compatível com o app existente (tipo: tempo_real)
    const dadosLegados = [
      {
        tipo: 'tempo_real',
        data_leitura: formatTimestampBR(latestNivel?.Timestamp),
        nivel_atual: nivelAtualNum.toString().replace('.', ','),
        volume_percentual: volumeUtilNum.toString().replace('.', ','),
        afluencia: afluenciaNum.toString().replace('.', ','),
        defluencia: defluenciaNum.toString().replace('.', ','),
        nivel_inicial: nivelAtualNum.toString().replace('.', ','),
        volume_inicial: volumeUtilNum.toString().replace('.', ',')
      }
    ];

    // Adicionar dias do histórico se disponível em VAL_FECHAMENTO
    if (raw.VAL_FECHAMENTO?.CotaFinal) {
      const dates = Object.keys(raw.VAL_FECHAMENTO.CotaFinal).sort().slice(-7);
      for (const dt of dates) {
        const cota = raw.VAL_FECHAMENTO.CotaFinal[dt];
        const vol = raw.VAL_FECHAMENTO.VolumeFinal?.[dt] || volumeUtilNum;
        const [y, m, d] = dt.split('-');
        dadosLegados.push({
          tipo: 'historico',
          data_leitura: `${d}/${m}/${y}`,
          nivel_atual: cota.toString().replace('.', ','),
          volume_percentual: vol.toString().replace('.', ','),
          afluencia: afluenciaNum.toString().replace('.', ','),
          defluencia: defluenciaNum.toString().replace('.', ','),
          nivel_inicial: cota.toString().replace('.', ','),
          volume_inicial: vol.toString().replace('.', ',')
        });
      }
    }

    const payload = {
      sucesso: true,
      origem: 'CEMIG UHE Três Marias',
      atualizado_em: latestNivel?.Timestamp || new Date().toISOString(),
      leitura_formatada: formatTimestampBR(latestNivel?.Timestamp),
      dados_usina: {
        nivel_atual: nivelAtualNum,
        volume_util: volumeUtilNum,
        afluencia: afluenciaNum,
        defluencia: defluenciaNum,
        chuva: chuvaNum,
        cota_minima: raw.VAL_NAMIN || 549.2,
        cota_maxima: raw.VAL_NAMAX || 572.5,
        cota_maximorum: raw.VAL_NAMAXIMORUM || 573.4
      },
      historico_medicoes: historicoMedicoes,
      historico_defluencia_48h: historicoDefluencia48h,
      dados: dadosLegados
    };

    return res.status(200).json(payload);
  } catch (error) {
    console.error('Erro ao buscar dados da CEMIG:', error);
    return res.status(500).json({
      sucesso: false,
      erro: error.message
    });
  }
}
