import SunCalc from 'suncalc';

const phases = [];
let lastPhase = -1;
for (let d = new Date('2024-01-01T00:00:00Z'); d < new Date('2025-01-01T00:00:00Z'); d.setUTCHours(d.getUTCHours() + 1)) {
    const illum = SunCalc.getMoonIllumination(d);
    const p = illum.phase; // 0 to 1
    
    let currentPhase = -1;
    if (p < 0.03 || p > 0.97) currentPhase = 0; // new
    else if (p > 0.22 && p < 0.28) currentPhase = 1; // first quarter
    else if (p > 0.47 && p < 0.53) currentPhase = 2; // full
    else if (p > 0.72 && p < 0.78) currentPhase = 3; // last quarter
    
    if (currentPhase !== -1 && currentPhase !== lastPhase) {
        // Find exact minimum/maximum within this hour
        let exactTime = new Date(d);
        let bestDiff = 1;
        for (let m = 0; m < 60; m++) {
            const testD = new Date(d.getTime() + m * 60000);
            const tp = SunCalc.getMoonIllumination(testD).phase;
            let target = currentPhase * 0.25;
            let diff = Math.abs(tp - target);
            if (currentPhase === 0 && tp > 0.5) diff = Math.abs(tp - 1.0); // Wrap around for new moon
            
            if (diff < bestDiff) {
                bestDiff = diff;
                exactTime = testD;
            }
        }
        
        const phaseNames = ['new_moon', 'first_quarter', 'full_moon', 'last_quarter'];
        phases.push(`{ date: '${exactTime.toISOString().substring(0, 16)}:00Z', phase: '${phaseNames[currentPhase]}' }`);
        lastPhase = currentPhase;
    }
}
console.log(phases.join(',\n'));
