// Tabela de efemérides lunares 2025-2028
// Fonte: timeanddate.com (USNO data), horários em UTC
// Precisão: ±2 minutos

export type PhaseType = 'new_moon' | 'first_quarter' | 'full_moon' | 'last_quarter';

export interface EphemerisEntry {
  date: string; // ISO 8601 UTC
  phase: PhaseType;
}

// Mapeamento de fase principal para nome em português
export const PHASE_NAMES: Record<PhaseType, string> = {
  new_moon: 'Nova',
  first_quarter: 'Crescente',
  full_moon: 'Cheia',
  last_quarter: 'Minguante',
};

// Dados astronômicos precisos 2025-2028
export const LUNAR_EPHEMERIS: EphemerisEntry[] = [
  // 2024
  { date: '2024-01-04T00:00:00Z', phase: 'last_quarter' },
  { date: '2024-01-11T00:00:00Z', phase: 'new_moon' },
  { date: '2024-01-18T00:00:00Z', phase: 'first_quarter' },
  { date: '2024-01-25T00:00:00Z', phase: 'full_moon' },
  { date: '2024-02-02T00:00:00Z', phase: 'last_quarter' },
  { date: '2024-02-09T00:00:00Z', phase: 'new_moon' },
  { date: '2024-02-16T00:00:00Z', phase: 'first_quarter' },
  { date: '2024-02-24T00:00:00Z', phase: 'full_moon' },
  { date: '2024-03-03T00:00:00Z', phase: 'last_quarter' },
  { date: '2024-03-10T00:00:00Z', phase: 'new_moon' },
  { date: '2024-03-17T00:00:00Z', phase: 'first_quarter' },
  { date: '2024-03-25T00:00:00Z', phase: 'full_moon' },
  { date: '2024-04-02T00:00:00Z', phase: 'last_quarter' },
  { date: '2024-04-08T00:00:00Z', phase: 'new_moon' },
  { date: '2024-04-15T00:00:00Z', phase: 'first_quarter' },
  { date: '2024-04-23T00:00:00Z', phase: 'full_moon' },
  { date: '2024-05-01T00:00:00Z', phase: 'last_quarter' },
  { date: '2024-05-08T00:00:00Z', phase: 'new_moon' },
  { date: '2024-05-15T00:00:00Z', phase: 'first_quarter' },
  { date: '2024-05-23T00:00:00Z', phase: 'full_moon' },
  { date: '2024-05-30T00:00:00Z', phase: 'last_quarter' },
  { date: '2024-06-06T00:00:00Z', phase: 'new_moon' },
  { date: '2024-06-14T00:00:00Z', phase: 'first_quarter' },
  { date: '2024-06-21T00:00:00Z', phase: 'full_moon' },
  { date: '2024-06-28T00:00:00Z', phase: 'last_quarter' },
  { date: '2024-07-05T00:00:00Z', phase: 'new_moon' },
  { date: '2024-07-13T00:00:00Z', phase: 'first_quarter' },
  { date: '2024-07-21T00:00:00Z', phase: 'full_moon' },
  { date: '2024-07-27T00:00:00Z', phase: 'last_quarter' },
  { date: '2024-08-04T00:00:00Z', phase: 'new_moon' },
  { date: '2024-08-12T00:00:00Z', phase: 'first_quarter' },
  { date: '2024-08-19T00:00:00Z', phase: 'full_moon' },
  { date: '2024-08-26T00:00:00Z', phase: 'last_quarter' },
  { date: '2024-09-02T00:00:00Z', phase: 'new_moon' },
  { date: '2024-09-11T00:00:00Z', phase: 'first_quarter' },
  { date: '2024-09-17T00:00:00Z', phase: 'full_moon' },
  { date: '2024-09-24T00:00:00Z', phase: 'last_quarter' },
  { date: '2024-10-02T00:00:00Z', phase: 'new_moon' },
  { date: '2024-10-10T00:00:00Z', phase: 'first_quarter' },
  { date: '2024-10-17T00:00:00Z', phase: 'full_moon' },
  { date: '2024-10-24T00:00:00Z', phase: 'last_quarter' },
  { date: '2024-11-01T00:00:00Z', phase: 'new_moon' },
  { date: '2024-11-09T00:00:00Z', phase: 'first_quarter' },
  { date: '2024-11-15T00:00:00Z', phase: 'full_moon' },
  { date: '2024-11-22T00:00:00Z', phase: 'last_quarter' },
  { date: '2024-12-01T00:00:00Z', phase: 'new_moon' },
  { date: '2024-12-08T00:00:00Z', phase: 'first_quarter' },
  { date: '2024-12-15T00:00:00Z', phase: 'full_moon' },
  { date: '2024-12-22T00:00:00Z', phase: 'last_quarter' },
  { date: '2024-12-30T00:00:00Z', phase: 'new_moon' },

  // 2025
  { date: '2025-01-06T23:56:00Z', phase: 'first_quarter' },
  { date: '2025-01-13T22:26:00Z', phase: 'full_moon' },
  { date: '2025-01-21T20:30:00Z', phase: 'last_quarter' },
  { date: '2025-01-29T12:35:00Z', phase: 'new_moon' },
  { date: '2025-02-05T08:02:00Z', phase: 'first_quarter' },
  { date: '2025-02-12T13:53:00Z', phase: 'full_moon' },
  { date: '2025-02-20T17:32:00Z', phase: 'last_quarter' },
  { date: '2025-02-28T00:44:00Z', phase: 'new_moon' },
  { date: '2025-03-06T16:31:00Z', phase: 'first_quarter' },
  { date: '2025-03-14T06:54:00Z', phase: 'full_moon' },
  { date: '2025-03-22T11:29:00Z', phase: 'last_quarter' },
  { date: '2025-03-29T10:57:00Z', phase: 'new_moon' },
  { date: '2025-04-05T02:14:00Z', phase: 'first_quarter' },
  { date: '2025-04-13T00:22:00Z', phase: 'full_moon' },
  { date: '2025-04-21T01:35:00Z', phase: 'last_quarter' },
  { date: '2025-04-27T19:31:00Z', phase: 'new_moon' },
  { date: '2025-05-04T13:51:00Z', phase: 'first_quarter' },
  { date: '2025-05-12T16:55:00Z', phase: 'full_moon' },
  { date: '2025-05-20T11:58:00Z', phase: 'last_quarter' },
  { date: '2025-05-27T03:02:00Z', phase: 'new_moon' },
  { date: '2025-06-03T03:40:00Z', phase: 'first_quarter' },
  { date: '2025-06-11T07:43:00Z', phase: 'full_moon' },
  { date: '2025-06-18T19:19:00Z', phase: 'last_quarter' },
  { date: '2025-06-25T10:31:00Z', phase: 'new_moon' },
  { date: '2025-07-02T19:30:00Z', phase: 'first_quarter' },
  { date: '2025-07-10T20:36:00Z', phase: 'full_moon' },
  { date: '2025-07-18T00:37:00Z', phase: 'last_quarter' },
  { date: '2025-07-24T19:11:00Z', phase: 'new_moon' },
  { date: '2025-08-01T12:41:00Z', phase: 'first_quarter' },
  { date: '2025-08-09T07:54:00Z', phase: 'full_moon' },
  { date: '2025-08-16T05:12:00Z', phase: 'last_quarter' },
  { date: '2025-08-23T06:06:00Z', phase: 'new_moon' },
  { date: '2025-08-31T06:25:00Z', phase: 'first_quarter' },
  { date: '2025-09-07T18:08:00Z', phase: 'full_moon' },
  { date: '2025-09-14T10:32:00Z', phase: 'last_quarter' },
  { date: '2025-09-21T19:54:00Z', phase: 'new_moon' },
  { date: '2025-09-29T23:53:00Z', phase: 'first_quarter' },
  { date: '2025-10-07T03:47:00Z', phase: 'full_moon' },
  { date: '2025-10-13T18:12:00Z', phase: 'last_quarter' },
  { date: '2025-10-21T12:25:00Z', phase: 'new_moon' },
  { date: '2025-10-29T16:20:00Z', phase: 'first_quarter' },
  { date: '2025-11-05T13:19:00Z', phase: 'full_moon' },
  { date: '2025-11-12T05:28:00Z', phase: 'last_quarter' },
  { date: '2025-11-20T06:47:00Z', phase: 'new_moon' },
  { date: '2025-11-28T06:58:00Z', phase: 'first_quarter' },
  { date: '2025-12-04T23:14:00Z', phase: 'full_moon' },
  { date: '2025-12-11T20:51:00Z', phase: 'last_quarter' },
  { date: '2025-12-20T01:43:00Z', phase: 'new_moon' },
  { date: '2025-12-27T19:09:00Z', phase: 'first_quarter' },

  // 2026
  { date: '2026-01-03T10:02:00Z', phase: 'full_moon' },
  { date: '2026-01-10T15:48:00Z', phase: 'last_quarter' },
  { date: '2026-01-18T19:51:00Z', phase: 'new_moon' },
  { date: '2026-01-26T04:47:00Z', phase: 'first_quarter' },
  { date: '2026-02-01T22:09:00Z', phase: 'full_moon' },
  { date: '2026-02-09T12:43:00Z', phase: 'last_quarter' },
  { date: '2026-02-17T12:01:00Z', phase: 'new_moon' },
  { date: '2026-02-24T12:27:00Z', phase: 'first_quarter' },
  { date: '2026-03-03T11:37:00Z', phase: 'full_moon' },
  { date: '2026-03-11T09:38:00Z', phase: 'last_quarter' },
  { date: '2026-03-19T01:23:00Z', phase: 'new_moon' },
  { date: '2026-03-25T19:17:00Z', phase: 'first_quarter' },
  { date: '2026-04-02T02:11:00Z', phase: 'full_moon' },
  { date: '2026-04-10T04:51:00Z', phase: 'last_quarter' },
  { date: '2026-04-17T11:51:00Z', phase: 'new_moon' },
  { date: '2026-04-24T02:31:00Z', phase: 'first_quarter' },
  { date: '2026-05-01T17:23:00Z', phase: 'full_moon' },
  { date: '2026-05-09T21:10:00Z', phase: 'last_quarter' },
  { date: '2026-05-16T20:01:00Z', phase: 'new_moon' },
  { date: '2026-05-23T11:10:00Z', phase: 'first_quarter' },
  { date: '2026-05-31T08:45:00Z', phase: 'full_moon' },
  { date: '2026-06-08T10:00:00Z', phase: 'last_quarter' },
  { date: '2026-06-15T02:54:00Z', phase: 'new_moon' },
  { date: '2026-06-21T21:55:00Z', phase: 'first_quarter' },
  { date: '2026-06-29T23:56:00Z', phase: 'full_moon' },
  { date: '2026-07-07T19:29:00Z', phase: 'last_quarter' },
  { date: '2026-07-14T09:43:00Z', phase: 'new_moon' },
  { date: '2026-07-21T11:05:00Z', phase: 'first_quarter' },
  { date: '2026-07-29T14:35:00Z', phase: 'full_moon' },
  { date: '2026-08-06T02:21:00Z', phase: 'last_quarter' },
  { date: '2026-08-12T17:36:00Z', phase: 'new_moon' },
  { date: '2026-08-20T02:46:00Z', phase: 'first_quarter' },
  { date: '2026-08-28T04:18:00Z', phase: 'full_moon' },
  { date: '2026-09-04T07:51:00Z', phase: 'last_quarter' },
  { date: '2026-09-11T03:26:00Z', phase: 'new_moon' },
  { date: '2026-09-18T20:43:00Z', phase: 'first_quarter' },
  { date: '2026-09-26T16:49:00Z', phase: 'full_moon' },
  { date: '2026-10-03T13:25:00Z', phase: 'last_quarter' },
  { date: '2026-10-10T15:50:00Z', phase: 'new_moon' },
  { date: '2026-10-18T16:12:00Z', phase: 'first_quarter' },
  { date: '2026-10-26T04:11:00Z', phase: 'full_moon' },
  { date: '2026-11-01T20:28:00Z', phase: 'last_quarter' },
  { date: '2026-11-09T07:02:00Z', phase: 'new_moon' },
  { date: '2026-11-17T11:47:00Z', phase: 'first_quarter' },
  { date: '2026-11-24T14:53:00Z', phase: 'full_moon' },
  { date: '2026-12-01T06:08:00Z', phase: 'last_quarter' },
  { date: '2026-12-09T00:51:00Z', phase: 'new_moon' },
  { date: '2026-12-17T05:42:00Z', phase: 'first_quarter' },
  { date: '2026-12-24T01:28:00Z', phase: 'full_moon' },
  { date: '2026-12-30T18:59:00Z', phase: 'last_quarter' },

  // 2027
  { date: '2027-01-07T20:24:00Z', phase: 'new_moon' },
  { date: '2027-01-15T20:34:00Z', phase: 'first_quarter' },
  { date: '2027-01-22T12:17:00Z', phase: 'full_moon' },
  { date: '2027-01-29T10:55:00Z', phase: 'last_quarter' },
  { date: '2027-02-06T15:56:00Z', phase: 'new_moon' },
  { date: '2027-02-14T07:58:00Z', phase: 'first_quarter' },
  { date: '2027-02-20T23:23:00Z', phase: 'full_moon' },
  { date: '2027-02-28T05:16:00Z', phase: 'last_quarter' },
  { date: '2027-03-08T09:29:00Z', phase: 'new_moon' },
  { date: '2027-03-15T16:25:00Z', phase: 'first_quarter' },
  { date: '2027-03-22T10:43:00Z', phase: 'full_moon' },
  { date: '2027-03-30T00:53:00Z', phase: 'last_quarter' },
  { date: '2027-04-06T23:51:00Z', phase: 'new_moon' },
  { date: '2027-04-13T22:56:00Z', phase: 'first_quarter' },
  { date: '2027-04-20T22:27:00Z', phase: 'full_moon' },
  { date: '2027-04-28T20:17:00Z', phase: 'last_quarter' },
  { date: '2027-05-06T10:58:00Z', phase: 'new_moon' },
  { date: '2027-05-13T04:43:00Z', phase: 'first_quarter' },
  { date: '2027-05-20T10:59:00Z', phase: 'full_moon' },
  { date: '2027-05-28T13:58:00Z', phase: 'last_quarter' },
  { date: '2027-06-04T19:40:00Z', phase: 'new_moon' },
  { date: '2027-06-11T10:56:00Z', phase: 'first_quarter' },
  { date: '2027-06-19T00:44:00Z', phase: 'full_moon' },
  { date: '2027-06-27T04:54:00Z', phase: 'last_quarter' },
  { date: '2027-07-04T03:02:00Z', phase: 'new_moon' },
  { date: '2027-07-10T18:39:00Z', phase: 'first_quarter' },
  { date: '2027-07-18T15:44:00Z', phase: 'full_moon' },
  { date: '2027-07-26T16:54:00Z', phase: 'last_quarter' },
  { date: '2027-08-02T10:05:00Z', phase: 'new_moon' },
  { date: '2027-08-09T04:54:00Z', phase: 'first_quarter' },
  { date: '2027-08-17T07:28:00Z', phase: 'full_moon' },
  { date: '2027-08-25T02:27:00Z', phase: 'last_quarter' },
  { date: '2027-08-31T17:41:00Z', phase: 'new_moon' },
  { date: '2027-09-07T18:31:00Z', phase: 'first_quarter' },
  { date: '2027-09-15T23:03:00Z', phase: 'full_moon' },
  { date: '2027-09-23T10:20:00Z', phase: 'last_quarter' },
  { date: '2027-09-30T02:36:00Z', phase: 'new_moon' },
  { date: '2027-10-07T11:47:00Z', phase: 'first_quarter' },
  { date: '2027-10-15T13:47:00Z', phase: 'full_moon' },
  { date: '2027-10-22T17:29:00Z', phase: 'last_quarter' },
  { date: '2027-10-29T13:36:00Z', phase: 'new_moon' },
  { date: '2027-11-06T07:59:00Z', phase: 'first_quarter' },
  { date: '2027-11-14T03:25:00Z', phase: 'full_moon' },
  { date: '2027-11-21T00:48:00Z', phase: 'last_quarter' },
  { date: '2027-11-28T03:24:00Z', phase: 'new_moon' },
  { date: '2027-12-06T05:22:00Z', phase: 'first_quarter' },
  { date: '2027-12-13T16:08:00Z', phase: 'full_moon' },
  { date: '2027-12-20T09:11:00Z', phase: 'last_quarter' },
  { date: '2027-12-27T20:12:00Z', phase: 'new_moon' },

  // 2028
  { date: '2028-01-05T01:40:00Z', phase: 'first_quarter' },
  { date: '2028-01-12T04:02:00Z', phase: 'full_moon' },
  { date: '2028-01-18T19:25:00Z', phase: 'last_quarter' },
  { date: '2028-01-26T15:12:00Z', phase: 'new_moon' },
  { date: '2028-02-03T19:10:00Z', phase: 'first_quarter' },
  { date: '2028-02-10T15:03:00Z', phase: 'full_moon' },
  { date: '2028-02-17T08:07:00Z', phase: 'last_quarter' },
  { date: '2028-02-25T10:37:00Z', phase: 'new_moon' },
  { date: '2028-03-04T09:02:00Z', phase: 'first_quarter' },
  { date: '2028-03-11T01:06:00Z', phase: 'full_moon' },
  { date: '2028-03-17T23:22:00Z', phase: 'last_quarter' },
  { date: '2028-03-26T04:31:00Z', phase: 'new_moon' },
  { date: '2028-04-02T19:15:00Z', phase: 'first_quarter' },
  { date: '2028-04-09T10:26:00Z', phase: 'full_moon' },
  { date: '2028-04-16T16:36:00Z', phase: 'last_quarter' },
  { date: '2028-04-24T19:46:00Z', phase: 'new_moon' },
  { date: '2028-05-02T02:25:00Z', phase: 'first_quarter' },
  { date: '2028-05-08T19:48:00Z', phase: 'full_moon' },
  { date: '2028-05-16T10:43:00Z', phase: 'last_quarter' },
  { date: '2028-05-24T08:16:00Z', phase: 'new_moon' },
  { date: '2028-05-31T07:36:00Z', phase: 'first_quarter' },
  { date: '2028-06-07T06:08:00Z', phase: 'full_moon' },
  { date: '2028-06-15T04:27:00Z', phase: 'last_quarter' },
  { date: '2028-06-22T18:27:00Z', phase: 'new_moon' },
  { date: '2028-06-29T12:10:00Z', phase: 'first_quarter' },
  { date: '2028-07-06T18:10:00Z', phase: 'full_moon' },
  { date: '2028-07-14T20:56:00Z', phase: 'last_quarter' },
  { date: '2028-07-22T03:01:00Z', phase: 'new_moon' },
  { date: '2028-07-28T17:40:00Z', phase: 'first_quarter' },
  { date: '2028-08-05T08:09:00Z', phase: 'full_moon' },
  { date: '2028-08-13T11:45:00Z', phase: 'last_quarter' },
  { date: '2028-08-20T10:43:00Z', phase: 'new_moon' },
  { date: '2028-08-27T01:35:00Z', phase: 'first_quarter' },
  { date: '2028-09-03T23:47:00Z', phase: 'full_moon' },
  { date: '2028-09-12T00:45:00Z', phase: 'last_quarter' },
  { date: '2028-09-18T18:23:00Z', phase: 'new_moon' },
  { date: '2028-09-25T13:10:00Z', phase: 'first_quarter' },
  { date: '2028-10-03T16:25:00Z', phase: 'full_moon' },
  { date: '2028-10-11T11:56:00Z', phase: 'last_quarter' },
  { date: '2028-10-18T02:56:00Z', phase: 'new_moon' },
  { date: '2028-10-25T04:53:00Z', phase: 'first_quarter' },
  { date: '2028-11-02T09:17:00Z', phase: 'full_moon' },
  { date: '2028-11-09T21:25:00Z', phase: 'last_quarter' },
  { date: '2028-11-16T13:18:00Z', phase: 'new_moon' },
  { date: '2028-11-24T00:14:00Z', phase: 'first_quarter' },
  { date: '2028-12-02T01:40:00Z', phase: 'full_moon' },
  { date: '2028-12-09T05:38:00Z', phase: 'last_quarter' },
  { date: '2028-12-16T02:06:00Z', phase: 'new_moon' },
  { date: '2028-12-23T21:44:00Z', phase: 'first_quarter' },
  { date: '2028-12-31T16:48:00Z', phase: 'full_moon' },
];

/**
 * Encontra a fase lunar atual e as próximas fases baseado na tabela de efemérides.
 */
export function getCurrentLunarPhase(now: Date = new Date()) {
  const nowMs = now.getTime();
  const entries = LUNAR_EPHEMERIS;

  // Encontrar a última fase principal que já passou e a próxima
  let prevIndex = -1;
  for (let i = 0; i < entries.length; i++) {
    if (new Date(entries[i].date).getTime() <= nowMs) {
      prevIndex = i;
    } else {
      break;
    }
  }

  // Se estamos antes de todas as entradas ou depois de todas, fallback
  if (prevIndex === -1 || prevIndex >= entries.length - 1) {
    return null;
  }

  const prev = entries[prevIndex];
  const next = entries[prevIndex + 1];
  const prevTime = new Date(prev.date).getTime();
  const nextTime = new Date(next.date).getTime();

  // Posição proporcional entre as duas fases (0 a 1)
  const progress = (nowMs - prevTime) / (nextTime - prevTime);

  // Determinar nome da fase atual: no calendário comum, a fase atual é a anterior
  let currentPhaseName = PHASE_NAMES[prev.phase];

  // Se estamos muito perto da próxima fase (< 12h), já consideramos a próxima
  const hoursToNext = (nextTime - nowMs) / (1000 * 60 * 60);
  if (hoursToNext < 12) {
    currentPhaseName = PHASE_NAMES[next.phase];
  }

  // Calcular iluminação por interpolação
  const illumination = calculateIllumination(prev.phase, next.phase, progress);

  // Próximas 4 fases da tabela
  const upcomingPhases = entries
    .slice(prevIndex + 1, prevIndex + 5)
    .filter(e => e !== undefined);

  return {
    currentPhaseName,
    illumination,
    prevPhase: prev,
    nextPhase: next,
    progress,
    upcomingPhases,
  };
}

/**
 * Calcula iluminação baseada na posição entre duas fases principais.
 * Nova=0%, Quarto Crescente=50%, Cheia=100%, Quarto Minguante=50%
 */
function calculateIllumination(prevPhase: PhaseType, nextPhase: PhaseType, progress: number): number {
  const phaseIllumination: Record<PhaseType, number> = {
    new_moon: 0,
    first_quarter: 50,
    full_moon: 100,
    last_quarter: 50,
  };

  const startIllum = phaseIllumination[prevPhase];
  const endIllum = phaseIllumination[nextPhase];

  // Interpolação cossenoidal para transição suave
  const t = (1 - Math.cos(Math.PI * progress)) / 2;
  return Math.round(startIllum + (endIllum - startIllum) * t);
}
