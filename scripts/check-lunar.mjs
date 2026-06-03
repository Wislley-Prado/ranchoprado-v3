const PHASE_NAMES = {
  new_moon: 'Nova',
  first_quarter: 'Quarto Crescente',
  full_moon: 'Cheia',
  last_quarter: 'Quarto Minguante',
};

const INTERMEDIATE_PHASES = {
  'new_moon->first_quarter': 'Crescente',
  'first_quarter->full_moon': 'Crescente Gibosa',
  'full_moon->last_quarter': 'Minguante Gibosa',
  'last_quarter->new_moon': 'Minguante Crescente',
};

const LUNAR_EPHEMERIS = [
  { date: '2026-05-23T11:10:00Z', phase: 'first_quarter' },
  { date: '2026-05-31T08:45:00Z', phase: 'full_moon' },
  { date: '2026-06-08T10:00:00Z', phase: 'last_quarter' },
  { date: '2026-06-15T02:54:00Z', phase: 'new_moon' },
];

function calculateIllumination(prevPhase, nextPhase, progress) {
  const phaseIllumination = {
    new_moon: 0,
    first_quarter: 50,
    full_moon: 100,
    last_quarter: 50,
  };

  const startIllum = phaseIllumination[prevPhase];
  const endIllum = phaseIllumination[nextPhase];

  const t = (1 - Math.cos(Math.PI * progress)) / 2;
  return Math.round(startIllum + (endIllum - startIllum) * t);
}

function getCurrentLunarPhase(now = new Date()) {
  const nowMs = now.getTime();
  const entries = LUNAR_EPHEMERIS;

  let prevIndex = -1;
  for (let i = 0; i < entries.length; i++) {
    if (new Date(entries[i].date).getTime() <= nowMs) {
      prevIndex = i;
    } else {
      break;
    }
  }

  if (prevIndex === -1 || prevIndex >= entries.length - 1) {
    return null;
  }

  const prev = entries[prevIndex];
  const next = entries[prevIndex + 1];
  const prevTime = new Date(prev.date).getTime();
  const nextTime = new Date(next.date).getTime();

  const progress = (nowMs - prevTime) / (nextTime - prevTime);

  const transitionKey = `${prev.phase}->${next.phase}`;
  const intermediateName = INTERMEDIATE_PHASES[transitionKey];

  const hoursFromPrev = (nowMs - prevTime) / (1000 * 60 * 60);
  const hoursToNext = (nextTime - nowMs) / (1000 * 60 * 60);

  let currentPhaseName;
  if (hoursFromPrev < 12) {
    currentPhaseName = PHASE_NAMES[prev.phase];
  } else if (hoursToNext < 12) {
    currentPhaseName = PHASE_NAMES[next.phase];
  } else {
    currentPhaseName = intermediateName || PHASE_NAMES[prev.phase];
  }

  const illumination = calculateIllumination(prev.phase, next.phase, progress);

  return {
    currentPhaseName,
    illumination,
    prevPhase: prev,
    nextPhase: next,
    progress,
    hoursFromPrev,
    hoursToNext,
  };
}

const testDate = new Date("2026-06-02T22:06:48-03:00");
console.log("Test Date Local:", testDate.toString());
console.log("Test Date UTC:", testDate.toISOString());

const result = getCurrentLunarPhase(testDate);
console.log("Calculation Result:", JSON.stringify(result, null, 2));
