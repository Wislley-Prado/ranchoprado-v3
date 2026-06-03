
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Star } from 'lucide-react';
import { useLunarData } from '@/hooks/useLunarData';

const LunarCalendar = () => {
  const { data: lunarData, isLoading, error } = useLunarData();

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Moon className="h-8 w-8 animate-pulse text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Carregando dados lunares...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !lunarData) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar dados lunares</p>
          </div>
        </div>
      </section>
    );
  }

  const getMoonIcon = (phase: string, illumination: number) => {
    const baseClasses = "w-6 h-6 rounded-full shadow-sm";
    
    switch (phase) {
      case 'Nova':
        return <div className={`${baseClasses} bg-gray-800`}></div>;
      case 'Crescente':
        return <div className={`${baseClasses} bg-gradient-to-r from-gray-800 via-yellow-200 to-yellow-200`}></div>;
      case 'Cheia':
        return <div className={`${baseClasses} bg-yellow-100 border-2 border-yellow-300`}></div>;
      case 'Minguante':
        return <div className={`${baseClasses} bg-gradient-to-l from-gray-800 via-yellow-200 to-yellow-200`}></div>;
      default:
        return <div className={`${baseClasses} bg-gray-500`}></div>;
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />;
      case 'good':
        return <Star className="h-5 w-5 fill-blue-400 text-blue-400" />;
      default:
        return <Star className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCurrentMoonIcon = (phase: string, illumination: number) => {
    const baseClasses = "w-12 h-12 rounded-full mx-auto my-2 shadow-lg";
    
    switch (phase) {
      case 'Nova':
        return <div className={`${baseClasses} bg-gray-800`}></div>;
      case 'Crescente':
        return <div className={`${baseClasses} bg-gradient-to-r from-gray-800 via-yellow-200 to-yellow-200`}></div>;
      case 'Cheia':
        return <div className={`${baseClasses} bg-yellow-100 border-2 border-yellow-300`}></div>;
      case 'Minguante':
        return <div className={`${baseClasses} bg-gradient-to-l from-gray-800 via-yellow-200 to-yellow-200`}></div>;
      default:
        return <div className={`${baseClasses} bg-gray-500`}></div>;
    }
  };

  const nextPhase = lunarData.phases[0];

  return (
    <section id="calendario-lunar" className="py-8 md:py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-6 lg:space-y-8">
          {/* TODAY'S MOON - Destaque */}
          <Card className="shadow-xl border-0 overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-lg md:text-xl font-bold flex items-center">
                <Moon className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
                <span className="text-sm md:text-base">
                  Lua de Hoje - {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long',
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  }).replace(/^\w/, (c) => c.toUpperCase())}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-4 md:pb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3 md:space-x-4">
                  {getCurrentMoonIcon(lunarData.currentPhase.phase, lunarData.currentPhase.illumination)}
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl md:text-2xl font-bold">Lua {lunarData.currentPhase.phase}</h3>
                    <p className="text-blue-100 text-sm md:text-base">{lunarData.currentPhase.illumination}% iluminada</p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <Badge className="bg-white text-blue-700 text-sm md:text-lg px-3 md:px-4 py-1 md:py-2">
                    {
                    lunarData.currentPhase.phase === 'Nova'
                        ? 'Excelente' 
                        : lunarData.currentPhase.phase === 'Crescente' || lunarData.currentPhase.phase === 'Minguante'
                        ? 'Boa' 
                        : 'Fraca'
                    }
                  </Badge>
                  <p className="text-blue-100 text-xs md:text-sm mt-1">condição para pesca</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Lunar Calendar */}
          <Card className="shadow-xl border-0 overflow-hidden bg-white">
            <CardHeader className="bg-white border-b border-gray-100 pb-4 md:pb-6">
              <CardTitle className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
                <Moon className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                <span className="text-sm md:text-base">Próximas Fases Lunares</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 bg-white">
              <div className="space-y-3 md:space-y-4">
                {lunarData.phases.map((phase, index) => (
                  <div key={index} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                      {getMoonIcon(phase.phase, phase.illumination)}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">Lua {phase.phase}</h4>
                        <p className="text-xs md:text-sm text-gray-600">{phase.date}</p>
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <Badge className={`${phase.color} text-white text-xs md:text-sm px-2 md:px-3 py-1`}>
                        {phase.fishing}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1 hidden sm:block">para pesca</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h5 className="font-semibold text-blue-700 mb-2 flex items-center text-sm md:text-base">
                  <Star className="mr-2 h-3 w-3 md:h-4 md:w-4 fill-blue-400 text-blue-400" />
                  Dica dos Especialistas
                </h5>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  As fases da lua nova e minguante são ideais para a pesca de espécies maiores. 
                  A pressão atmosférica e luminosidade favorecem a atividade dos peixes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Best Fishing Times */}
          <Card className="shadow-xl border-0 overflow-hidden bg-white">
            <CardHeader className="bg-white border-b border-gray-100 pb-4 md:pb-6">
              <CardTitle className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
                <Sun className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                <span className="text-sm md:text-base">Melhores Horários - Hoje</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 bg-white">
              <div className="space-y-3">
                {lunarData.bestFishingTimes.map((time, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between p-3 md:p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400 hover:shadow-sm transition-all duration-200">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm md:text-base">{time.time}</h4>
                        <p className="text-xs md:text-sm text-gray-600 font-medium">{time.activity}</p>
                      </div>
                      <div className="ml-3 md:ml-4 flex-shrink-0">
                        {getQualityIcon(time.quality)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Conditions */}
              <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h5 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Lua Atual</h5>
                  {getCurrentMoonIcon(lunarData.currentPhase.phase, lunarData.currentPhase.illumination)}
                  <p className="text-xs md:text-sm text-gray-600 font-medium">
                    {lunarData.currentPhase.phase}
                  </p>
                  <p className="text-xs text-gray-500">
                    {lunarData.currentPhase.illumination}% iluminada
                  </p>
                </div>
                <div className="text-center p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h5 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Próxima Fase</h5>
                  {getMoonIcon(nextPhase.phase, nextPhase.illumination)}
                  <p className="text-xs md:text-sm text-gray-600 font-medium mt-2 md:mt-3">{nextPhase.phase}</p>
                  <p className="text-xs text-gray-500">{nextPhase.date}</p>
                </div>
              </div>

              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-green-50 rounded-lg border border-green-100">
                <h5 className="font-bold text-green-700 mb-2 text-sm md:text-base">
                  Condição Atual: {
                    lunarData.currentPhase.phase === 'Nova'
                      ? 'Excelente' 
                      : lunarData.currentPhase.phase === 'Crescente' || lunarData.currentPhase.phase === 'Minguante'
                      ? 'Boa' 
                      : 'Fraca'
                  }
                </h5>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  {lunarData.currentPhase.phase === 'Nova'
                    ? 'Condições ideais para pesca de tucunaré e dourado. Recomendamos iscas artificiais no período da manhã.'
                    : lunarData.currentPhase.phase === 'Crescente' || lunarData.currentPhase.phase === 'Minguante'
                    ? 'Boa atividade dos peixes. Horários de madrugada e entardecer são mais promissores.'
                    : 'Lua cheia pode reduzir a atividade diurna. Concentre na pesca noturna e madrugada.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LunarCalendar;
