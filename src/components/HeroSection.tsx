import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Calendar, MapPin, Waves } from 'lucide-react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useDamData } from '@/hooks/useDamData';
import { useVideoSettings, extractYouTubeId } from '@/hooks/useVideoSettings';

const HeroSection = () => {
  const navigate = useNavigate();
  const { data: weatherData } = useWeatherData();
  const { data: damData } = useDamData();
  const { settings } = useVideoSettings();
  const [showVideo, setShowVideo] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    // Element may not be in DOM yet (lazy loaded) — scroll down to trigger Suspense, then retry
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    const retries = 10;
    let attempt = 0;
    const interval = setInterval(() => {
      const target = document.getElementById(id);
      if (target) {
        clearInterval(interval);
        target.scrollIntoView({ behavior: 'smooth' });
      } else if (++attempt >= retries) {
        clearInterval(interval);
      } else {
        window.scrollBy({ top: window.innerHeight / 2, behavior: 'smooth' });
      }
    }, 400);
  };

  const videoId = settings?.youtube_video_url 
    ? extractYouTubeId(settings.youtube_video_url)
    : 'cN_BspPR2gg';
  const temperature = weatherData?.current.temperature || 24;
  const damLevel = damData?.volume_util_percentual ? parseFloat(damData.volume_util_percentual).toFixed(1) : '86.0';
  const windSpeed = weatherData?.current.wind_speed || 12;
  const conditions = weatherData?.current.weather_description || 'Excelente';

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const sunrise = weatherData?.current.sunrise ? formatTime(weatherData.current.sunrise) : '06:00';
  const sunset = weatherData?.current.sunset ? formatTime(weatherData.current.sunset) : '18:30';

  return <section id="home" className="relative min-h-screen bg-river-gradient flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRINHY0aC00djJoNHY0aDJWNmg0VjRoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] animate-wave"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-white space-y-6 sm:space-y-8 animate-fade-in order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Sua experiência de pesca no{' '}
                <span className="text-sand-beige">Rio São Francisco</span>{' '}
                começa aqui!
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 leading-relaxed">
                Ranchos exclusivos, pacotes de pesca personalizados e a melhor estrutura 
                às margens do Rio São Francisco em Três Marias/MG.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 sm:pt-8">
              <button
                type="button"
                onClick={() => navigate('/live')}
                className="text-center group cursor-pointer"
                aria-label="Ir para Transmissão Ao Vivo"
              >
                <div className="bg-white bg-opacity-20 rounded-full p-2 sm:p-3 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 flex items-center justify-center group-hover:scale-110 group-hover:bg-opacity-30 transition-all duration-300">
                  <Waves className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-medium group-hover:text-sand-beige transition-colors">Transmissão Ao Vivo</p>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('calendario-lunar')}
                className="text-center group cursor-pointer"
                aria-label="Ver Calendário Lunar"
              >
                <div className="bg-white bg-opacity-20 rounded-full p-2 sm:p-3 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 flex items-center justify-center group-hover:scale-110 group-hover:bg-opacity-30 transition-all duration-300">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-medium group-hover:text-sand-beige transition-colors">Calendário Lunar</p>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('represa')}
                className="text-center group cursor-pointer"
                aria-label="Ver Dados em Tempo Real"
              >
                <div className="bg-white bg-opacity-20 rounded-full p-2 sm:p-3 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 flex items-center justify-center group-hover:scale-110 group-hover:bg-opacity-30 transition-all duration-300">
                  <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-medium group-hover:text-sand-beige transition-colors">Dados em Tempo Real</p>
              </button>
            </div>
          </div>

          <div className="animate-fade-in order-1 lg:order-2">
            <Card className="bg-white bg-opacity-10 backdrop-blur-md border-white border-opacity-20">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-lg sm:text-xl font-semibold">
                      Rio São Francisco - Ao Vivo
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-xs sm:text-sm">LIVE</span>
                    </div>
                  </div>
                  
                  {/* YouTube Facade - loads iframe only on click */}
                  <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                    {showVideo ? (
                      <iframe 
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1`} 
                        title="Vídeo do Rio São Francisco" 
                        className="w-full h-full" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                      />
                    ) : (
                      <button 
                        onClick={() => setShowVideo(true)}
                        className="w-full h-full relative group cursor-pointer"
                        aria-label="Reproduzir vídeo"
                      >
                        <img 
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                          alt="Vídeo do Rio São Francisco"
                          className="w-full h-full object-cover"
                          loading="eager"
                          fetchPriority="high"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white" onClick={() => navigate('/live')}>
                      <Play className="mr-2 h-4 w-4" />
                      Rio São Francisco Online
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-white text-xs sm:text-sm">
                    <div>
                      <p className="opacity-80">Temperatura da Água</p>
                      <p className="font-semibold">{temperature}°C</p>
                    </div>
                    <div>
                      <p className="opacity-80">Nível da Represa</p>
                      <p className="font-semibold">{damLevel}%</p>
                    </div>
                    <div>
                      <p className="opacity-80">Condições</p>
                      <p className="font-semibold text-sand-beige capitalize">{conditions}</p>
                    </div>
                    <div>
                      <p className="opacity-80">Vento</p>
                      <p className="font-semibold">{windSpeed} km/h</p>
                    </div>
                    <div>
                      <p className="opacity-80">Nascer do Sol</p>
                      <p className="font-semibold text-sunset-orange">{sunrise}</p>
                    </div>
                    <div>
                      <p className="opacity-80">Pôr do Sol</p>
                      <p className="font-semibold text-sunset-orange">{sunset}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;