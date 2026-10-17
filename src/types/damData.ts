
export interface DamHistoryDay {
  dia: string;
  data_original?: string;
  vazao_afl: string;
  cota_inicial: string;
  vol_util_inicial: string;
  vazao_def: string;
  cota_final: string;
  vol_util_final: string;
}

export interface DamData {
  nivel_atual: string;
  volume_util_percentual: string;
  afluencia: string;
  defluencia: string;
  data_atualizacao: string;
  hora_atualizacao: string;
  historico_dias: DamHistoryDay[];
  // Novos campos da API de produção e CEMIG
  tendencia_represa?: string;
  timestamp_atualizacao?: string;
  usando_dados_historicos?: boolean;
  chuva?: string;
  cota_minima?: string;
  cota_maxima?: string;
  cota_maximorum?: string;
  historico_medicoes?: { timestamp: string; hora: string; nivel: number }[];
  historico_defluencia_48h?: { timestamp: string; hora: string; dataFormatada: string; defluencia: number }[];
  dados_usina?: {
    nivel_atual: number;
    volume_util: number;
    afluencia: number;
    defluencia: number;
    chuva: number;
    cota_minima: number;
    cota_maxima: number;
    cota_maximorum: number;
  };
}

export interface StatusInfo {
  status: string;
  text: string;
  color: string;
}

export interface Condition {
  label: string;
  value: string;
  status: string;
  icon: React.ReactNode;
  trend: string;
}
