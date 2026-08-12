import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEFAULT_WEBHOOK_URL = 'https://webhook.v1.vendopro.com.br/webhook/v1.represa.online';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🚀 [PROXY] Iniciando requisição para webhook da represa...');

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar configurações do site (webhook URL e flag de pausa)
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('dam_webhook_url, dam_webhook_pausado')
      .limit(1)
      .single();

    if (settingsError) {
      console.warn('⚠️ [PROXY] Erro ao buscar configurações:', settingsError.message);
    }

    // Verificar se o webhook está pausado
    if (settings?.dam_webhook_pausado === true) {
      console.log('⏸️ [PROXY] Webhook PAUSADO pelo admin. Dados manuais preservados.');
      return new Response(JSON.stringify({
        pausado: true,
        message: 'Webhook pausado pelo admin. Dados manuais estão protegidos.',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let webhookUrl = DEFAULT_WEBHOOK_URL;
    if (settings?.dam_webhook_url) {
      webhookUrl = settings.dam_webhook_url;
      console.log('📌 [PROXY] URL do webhook carregada do banco:', webhookUrl);
    } else {
      console.log('📌 [PROXY] Usando URL padrão do webhook');
    }

    let data;
    let fetchedDirectly = false;

    console.log('🔌 Tentando buscar dados diretamente da API da CEMIG...');
    try {
      const cemigResponse = await fetch('https://www.cemig.com.br/wp-json/api-busca-usinas/v1/send-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=buscar_dados_usina&usina_id=UHE_TRES_MARIAS',
      });

      if (cemigResponse.ok) {
        const rawJson = await cemigResponse.json();
        
        // Helper para formatar a data de ISO/UTC da CEMIG para DD/MM/YYYY HH:mm
        const formatDate = (isoStr: string) => {
          if (!isoStr) return "";
          const date = new Date(isoStr);
          const day = String(date.getUTCDate()).padStart(2, '0');
          const month = String(date.getUTCMonth() + 1).padStart(2, '0');
          const year = date.getUTCFullYear();
          const hours = String(date.getUTCHours()).padStart(2, '0');
          const minutes = String(date.getUTCMinutes()).padStart(2, '0');
          return `${day}/${month}/${year} ${hours}:${minutes}`;
        };

        const getLatest = (arr: any[]) => arr && arr.length > 0 ? arr[arr.length - 1] : null;

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

        // Alinhar histórico de medições por Timestamp
        const historyMap: Record<string, any> = {};

        const processArray = (arr: any[], fieldName: string) => {
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

        // Formatar para a lista esperada pelo hook da aplicação
        const historicoItems = Object.keys(historyMap)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
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

        // Combinar os itens no array que o hook espera
        data = [tempoRealItem, ...historicoItems];
        fetchedDirectly = true;
        console.log('✅ [PROXY] Sucesso ao buscar e mapear dados diretamente da CEMIG!');
      } else {
        console.warn(`⚠️ [PROXY] Falha ao consultar CEMIG (${cemigResponse.status}). Usando fallback para webhook.`);
      }
    } catch (err) {
      console.error('⚠️ [PROXY] Erro ao consultar CEMIG diretamente:', err);
    }

    // Se a busca direta falhou, usa o webhook do n8n como fallback
    if (!fetchedDirectly) {
      console.log('📡 [PROXY] Usando fallback para o webhook do n8n...');
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro no webhook: ${response.status}. Detalhes: ${errorText}`);
      }

      data = await response.json();
      console.log(`✅ [PROXY] Dados recebidos do webhook:`, JSON.stringify(data).substring(0, 200));
    }

    // Salvar dados na tabela dam_data
    const { error: upsertError } = await supabase
      .from('dam_data')
      .upsert({
        id: 1,
        data: data,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (upsertError) {
      console.error('❌ [PROXY] Erro ao salvar dados no banco:', upsertError.message);
    } else {
      console.log('💾 [PROXY] Dados salvos no banco com sucesso!');
    }

    return new Response(JSON.stringify({ 
      ...data, 
      saved_to_db: !upsertError,
      updated_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ [PROXY] Erro na requisição:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        hint: 'Verifique a URL do webhook nas configurações do admin.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
