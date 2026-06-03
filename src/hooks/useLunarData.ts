
import { useQuery } from '@tanstack/react-query';
import { getCurrentLunarPhase, PHASE_NAMES } from '@/lib/lunarEphemeris';

export interface LunarPhase {
  phase: string;
  date: string;
  timestamp: number;
  illumination: number;
  fishing: string;
  color: string;
}

export interface LunarData {
  currentPhase: {
    phase: string;
    illumination: number;
    age: number;
    distance: number;
  };
  phases: LunarPhase[];
  bestFishingTimes: {
    time: string;
    activity: string;
    quality: 'excellent' | 'good' | 'fair';
  }[];
}

const FISHING_QUALITIES: Record<string, string> = {
  'Nova': 'Excelente',
  'Crescente': 'Boa',
  'Cheia': 'Fraca',
  'Minguante': 'Boa',
};

const PHASE_COLORS: Record<string, string> = {
  'Nova': 'bg-green-600',
  'Crescente': 'bg-blue-500',
  'Cheia': 'bg-orange-500',
  'Minguante': 'bg-blue-600',
};

const getBestFishingTimes = (currentPhase: string) => [
  { time: "05:30 - 07:00", activity: "Nascente do Sol", quality: 'excellent' as const },
  { time: "17:30 - 19:00", activity: "Pôr do Sol", quality: 'excellent' as const },
  { time: "22:00 - 00:30", activity: "Lua Alta", quality: (currentPhase === 'Cheia' ? 'excellent' : currentPhase === 'Nova' ? 'good' : 'fair') as 'excellent' | 'good' | 'fair' },
  { time: "03:00 - 05:00", activity: "Madrugada", quality: (currentPhase === 'Nova' || currentPhase === 'Minguante' ? 'good' : 'fair') as 'excellent' | 'good' | 'fair' },
];

const calculateLunarData = (): LunarData => {
  const now = new Date();
  const result = getCurrentLunarPhase(now);

  if (!result) {
    // Fallback extremo: fora do range da tabela
    return {
      currentPhase: { phase: 'Indisponível', illumination: 0, age: 0, distance: 384400 },
      phases: [],
      bestFishingTimes: getBestFishingTimes('Nova'),
    };
  }

  const { currentPhaseName, illumination, upcomingPhases } = result;

  const phases: LunarPhase[] = upcomingPhases.map(entry => {
    const phaseName = PHASE_NAMES[entry.phase];
    const ts = new Date(entry.date).getTime();
    return {
      phase: phaseName,
      date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      timestamp: ts,
      illumination: entry.phase === 'new_moon' ? 0 : entry.phase === 'full_moon' ? 100 : 50,
      fishing: FISHING_QUALITIES[phaseName] || 'Regular',
      color: PHASE_COLORS[phaseName] || 'bg-gray-500',
    };
  });

  return {
    currentPhase: {
      phase: currentPhaseName,
      illumination,
      age: 0, // não relevante com efemérides
      distance: 384400,
    },
    phases,
    bestFishingTimes: getBestFishingTimes(currentPhaseName),
  };
};

export const useLunarData = () => {
  return useQuery<LunarData>({
    queryKey: ['lunar', 'ephemeris', 'v1'],
    queryFn: async () => calculateLunarData(),
    staleTime: 60 * 60 * 1000,
    refetchInterval: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
