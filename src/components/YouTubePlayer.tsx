import { useState } from 'react';
import { Play } from 'lucide-react';
import { extractYouTubeId } from '@/hooks/useVideoSettings';

interface YouTubePlayerProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

export const YouTubePlayer = ({ videoUrl, title = 'Vídeo', className = '' }: YouTubePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extrair ID do vídeo de diferentes formatos de URL do YouTube
  const getVideoId = (url: string): string | null => {
    return extractYouTubeId(url);
  };

  // Verificar se é um Short
  const isShorts = videoUrl?.includes('/shorts/') || false;

  const videoId = getVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className={`rounded-lg bg-muted flex items-center justify-center p-8 ${className}`}>
        <p className="text-muted-foreground">Vídeo inválido</p>
      </div>
    );
  }

  // URL da thumbnail de alta qualidade
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  // URL do embed
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className={`relative w-full ${className}`}>
      <div 
        className={`relative overflow-hidden rounded-lg shadow-lg ${
          isShorts ? 'aspect-[9/16] max-w-[400px] mx-auto' : 'aspect-video'
        }`}
      >
        {!isPlaying ? (
          <>
            {/* Thumbnail com overlay */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback para thumbnail de qualidade média
                e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            
            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-black/30 transition-all duration-300 group-hover:bg-black/40" />
            
            {/* Botão de play */}
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label={`Reproduzir ${title}`}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-red-700 shadow-xl">
                <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" />
              </div>
            </button>

            {/* Badge de Shorts */}
            {isShorts && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Shorts
              </div>
            )}

            {/* Indicador de YouTube */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-medium">
              YouTube
            </div>
          </>
        ) : (
          /* Player do YouTube */
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* Título do vídeo (opcional) */}
      {title && !isPlaying && (
        <div className="mt-3">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
      )}
    </div>
  );
};

// Componente simplificado para preview no admin
export const YouTubePreview = ({ videoUrl, className = '' }: { videoUrl: string; className?: string }) => {
  const getVideoId = (url: string): string | null => {
    return extractYouTubeId(url);
  };

  const isShorts = videoUrl?.includes('/shorts/') || false;
  const videoId = getVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className={`rounded-lg bg-muted flex items-center justify-center p-4 ${className}`}>
        <p className="text-sm text-muted-foreground">Preview não disponível</p>
      </div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <div className={`relative ${className}`}>
      <div className={`relative overflow-hidden rounded-lg border ${
        isShorts ? 'aspect-[9/16] max-w-[200px]' : 'aspect-video'
      }`}>
        <img
          src={thumbnailUrl}
          alt="Preview do vídeo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <Play className="w-8 h-8 text-white fill-white" />
        </div>
        {isShorts && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
            Shorts
          </div>
        )}
      </div>
    </div>
  );
};
