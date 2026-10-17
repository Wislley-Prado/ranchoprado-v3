import { useQuery } from '@tanstack/react-query';
import { DamData } from '@/types/damData';
import { supabase } from '@/integrations/supabase/client';

// Interface para o formato da API do n8n
interface NewApiResponseItem {
  tipo: 'tempo_real' | 'historico';
  data_leitura: string;
  afluencia: string;
  nivel_inicial: string;
  volume_inicial: string;
  defluencia: string;
  nivel_atual: string;
  volume_percentual: string;
}

// Converter número brasileiro para float (564,24 → 564.24)
const parseNumberBR = (value: string): number => {
  if (!value || value === '--' || 
      value.toLowerCase().includes('verificar') || 
      value.toLowerCase().includes('detectado')) {
    return 0;
  }
  return parseFloat(value.replace(',', '.')) || 0;
};

// Converter data BR para ISO (01/12/2025 → 2025-12-01)
const parseDateBR = (dateStr: string): string => {
  if (!dateStr || !dateStr.includes('/')) return dateStr;
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

// Verificar se os dados são válidos
const isValidData = (item: NewApiResponseItem): boolean => {
  return item.nivel_atual !== 'Não detectado' && 
         item.nivel_atual !== '--' &&
         item.volume_percentual !== '--';
};

// Calcular tendência baseada no histórico
const calcularTendencia = (historico: NewApiResponseItem[]): string => {
  if (historico.length < 2) return 'estável';
  
  const volumeRecente = parseNumberBR(historico[0].volume_percentual);
  const volumeAnterior = parseNumberBR(historico[1].volume_percentual);
  
  if (volumeRecente > volumeAnterior + 0.3) return 'subindo';
  if (volumeRecente < volumeAnterior - 0.3) return 'descendo';
  return 'estável';
};

// Mapear dados do formato da API para DamData
const mapNewApiDataToDamData = (apiData: NewApiResponseItem[]): DamData => {
  if (import.meta.env.DEV) console.log('🔄 [MAPPING] Processando dados da API:', apiData?.length || 0, 'itens');
  
  const tempoReal = apiData.find(item => item.tipo === 'tempo_real');
  const historico = apiData.filter(item => item.tipo === 'historico');
  
  const dadosAtuais = (tempoReal && isValidData(tempoReal)) 
    ? tempoReal 
    : historico[0];
  
  const usandoHistorico = !tempoReal || !isValidData(tempoReal);
  
  const nivelAtual = parseNumberBR(dadosAtuais?.nivel_atual || '0');
  const volumePercentual = parseNumberBR(dadosAtuais?.volume_percentual || '0');
  const afluencia = parseNumberBR(dadosAtuais?.afluencia || '0');
  const defluencia = parseNumberBR(dadosAtuais?.defluencia || '0');
  
  const historicoDias = historico.map(item => ({
    dia: parseDateBR(item.data_leitura),
    data_original: item.data_leitura,
    vazao_afl: parseNumberBR(item.afluencia).toString(),
    cota_inicial: parseNumberBR(item.nivel_inicial).toString(),
    vol_util_inicial: parseNumberBR(item.volume_inicial).toString(),
    vazao_def: parseNumberBR(item.defluencia).toString(),
    cota_final: parseNumberBR(item.nivel_atual).toString(),
    vol_util_final: parseNumberBR(item.volume_percentual).toString(),
  }));
  
  const tendencia = calcularTendencia(historico);
  const dataAtualizacao = dadosAtuais?.data_leitura || new Date().toLocaleDateString('pt-BR');
  
  return {
    nivel_atual: nivelAtual.toFixed(2),
    volume_util_percentual: volumePercentual.toFixed(1),
    afluencia: afluencia.toString(),
    defluencia: defluencia.toString(),
    data_atualizacao: dataAtualizacao,
    hora_atualizacao: new Date().toLocaleTimeString('pt-BR'),
    historico_dias: historicoDias,
    tendencia_represa: tendencia,
    usando_dados_historicos: usandoHistorico,
  };
};

// Buscar dados com Edge Caching (sem sobrecarregar banco de dados)
const fetchDamData = async (): Promise<DamData> => {
  // 1. Tenta buscar da Edge API da Vercel (com cache de 30 minutos na CDN)
  try {
    const apiRes = await fetch('/api/dam-data', {
      headers: { 'Accept': 'application/json' }
    });
    if (apiRes.ok) {
      const json = await apiRes.json();
      if (json.sucesso && Array.isArray(json.dados) && json.dados.length > 0) {
        const mapped = mapNewApiDataToDamData(json.dados);
        if (json.dados_usina) {
          mapped.dados_usina = json.dados_usina;
          mapped.chuva = json.dados_usina.chuva !== undefined ? json.dados_usina.chuva.toString() : '0';
          mapped.cota_minima = (json.dados_usina.cota_minima || 549.2).toString();
          mapped.cota_maxima = (json.dados_usina.cota_maxima || 572.5).toString();
          mapped.cota_maximorum = (json.dados_usina.cota_maximorum || 573.4).toString();
        }
        if (json.historico_medicoes) {
          mapped.historico_medicoes = json.historico_medicoes;
        }
        if (json.historico_defluencia_48h) {
          mapped.historico_defluencia_48h = json.historico_defluencia_48h;
        }
        if (json.leitura_formatada) {
          mapped.data_atualizacao = json.leitura_formatada;
        }
        return mapped;
      }
    }
  } catch (apiErr) {
    if (import.meta.env.DEV) console.warn('Rota /api/dam-data não acessível diretamente, recorrendo ao banco...', apiErr);
  }

  // 2. Fallback de contingência: Buscar diretamente do Supabase
  if (import.meta.env.DEV) console.log('🔧 [FETCH] Buscando dados da represa do banco Supabase...');
  
  const { data, error } = await supabase
    .from('dam_data')
    .select('data, updated_at')
    .eq('id', 1)
    .single();

  if (error) {
    if (import.meta.env.DEV) console.error('❌ [FETCH] Erro ao buscar do banco:', error);
    throw new Error('Erro ao buscar dados da represa');
  }

  if (!data?.data || Object.keys(data.data as object).length === 0) {
    throw new Error('Dados da represa não disponíveis no momento.');
  }

  const responseData = data.data as { sucesso?: boolean; dados?: NewApiResponseItem[] } | NewApiResponseItem[];

  if (responseData && 'sucesso' in responseData && Array.isArray(responseData.dados)) {
    return mapNewApiDataToDamData(responseData.dados);
  }
  
  if (Array.isArray(responseData) && responseData.length > 0) {
    return mapNewApiDataToDamData(responseData);
  }
  
  throw new Error('Formato de dados não reconhecido');
};

export const useDamData = () => {
  return useQuery({
    queryKey: ['damData', 'cached'],
    queryFn: fetchDamData,
    refetchInterval: 30 * 60 * 1000, // Revalida a cada 30 min (alinhado ao ciclo da CEMIG)
    staleTime: 15 * 60 * 1000,      // Permanece fresco no navegador por 15 min
    retry: 2,
    retryDelay: 3000,
  });
};
