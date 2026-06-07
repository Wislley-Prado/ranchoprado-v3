import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Video, Radio, Film, X } from 'lucide-react';
import { useVideoSettings, extractYouTubeId, isValidYouTubeUrl } from '@/hooks/useVideoSettings';
import { YouTubePlayer } from '@/components/YouTubePlayer';

const ConfiguracoesVideos = () => {
  const { settings, isLoading, updateSettings, isUpdating } = useVideoSettings();
  const [liveUrl, setLiveUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [institucionalUrl, setInstitucionalUrl] = useState('');
  const [liveUrlError, setLiveUrlError] = useState('');
  const [videoUrlError, setVideoUrlError] = useState('');
  const [institucionalUrlError, setInstitucionalUrlError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (settings && !isInitialized) {
      setLiveUrl(settings.youtube_live_url || '');
      setVideoUrl(settings.youtube_video_url || '');
      setInstitucionalUrl(settings.youtube_institucional_url || '');
      setIsInitialized(true);
    }
  }, [settings, isInitialized]);

  const validateLiveUrl = (url: string) => {
    if (url && !isValidYouTubeUrl(url)) {
      setLiveUrlError('URL do YouTube inválida');
      return false;
    }
    setLiveUrlError('');
    return true;
  };

  const validateVideoUrl = (url: string) => {
    if (url && !isValidYouTubeUrl(url)) {
      setVideoUrlError('URL do YouTube inválida');
      return false;
    }
    setVideoUrlError('');
    return true;
  };

  const validateInstitucionalUrl = (url: string) => {
    if (url && !isValidYouTubeUrl(url)) {
      setInstitucionalUrlError('URL do YouTube inválida');
      return false;
    }
    setInstitucionalUrlError('');
    return true;
  };

  const handleSave = () => {
    const isLiveValid = validateLiveUrl(liveUrl);
    const isVideoValid = validateVideoUrl(videoUrl);
    const isInstitucionalValid = validateInstitucionalUrl(institucionalUrl);

    if (!isLiveValid || !isVideoValid || !isInstitucionalValid) {
      return;
    }

    updateSettings({
      youtube_live_url: liveUrl || null,
      youtube_video_url: videoUrl || null,
      youtube_institucional_url: institucionalUrl || null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const liveVideoId = extractYouTubeId(liveUrl);
  const videoId = extractYouTubeId(videoUrl);
  const institucionalVideoId = extractYouTubeId(institucionalUrl);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurações de Vídeos</h1>
        <p className="text-muted-foreground">
          Configure as URLs dos vídeos do YouTube do Rio São Francisco
        </p>
      </div>

      <div className="grid gap-6">
        {/* Live Stream Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-red-500" />
              Transmissão ao Vivo
            </CardTitle>
            <CardDescription>
              URL da live do YouTube que será exibida na página de transmissão ao vivo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="live-url">URL da Live no YouTube</Label>
              <div className="relative">
                <Input
                  id="live-url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={liveUrl}
                  onChange={(e) => {
                    setLiveUrl(e.target.value);
                    validateLiveUrl(e.target.value);
                  }}
                  onFocus={(e) => e.target.select()}
                  className={`pr-10 ${liveUrlError ? 'border-destructive' : ''}`}
                />
                {liveUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setLiveUrl('');
                      setLiveUrlError('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Limpar URL"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {liveUrlError && (
                <p className="text-sm text-destructive">{liveUrlError}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Formatos aceitos: youtube.com/watch?v=..., youtu.be/..., youtube.com/live/..., youtube.com/shorts/...
              </p>
            </div>

            {liveVideoId && (
              <div className="space-y-2">
                <Label>Preview da Live</Label>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${liveVideoId}?autoplay=0&mute=1`}
                    title="Preview da Live"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recorded Video Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="h-5 w-5" />
              Vídeo Gravado
            </CardTitle>
            <CardDescription>
              URL do vídeo gravado do YouTube do Rio São Francisco
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-url">URL do Vídeo Gravado</Label>
              <div className="relative">
                <Input
                  id="video-url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    validateVideoUrl(e.target.value);
                  }}
                  onFocus={(e) => e.target.select()}
                  className={`pr-10 ${videoUrlError ? 'border-destructive' : ''}`}
                />
                {videoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl('');
                      setVideoUrlError('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Limpar URL"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {videoUrlError && (
                <p className="text-sm text-destructive">{videoUrlError}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Este vídeo pode ser usado em outras páginas do site
              </p>
            </div>

            {videoId && (
              <div className="space-y-2">
                <Label>Preview do Vídeo</Label>
                <YouTubePlayer videoUrl={videoUrl} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Institutional Video Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Vídeo Institucional
            </CardTitle>
            <CardDescription>
              URL do vídeo institucional/apresentação do Rancho Prado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institucional-url">URL do Vídeo Institucional</Label>
              <div className="relative">
                <Input
                  id="institucional-url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={institucionalUrl}
                  onChange={(e) => {
                    setInstitucionalUrl(e.target.value);
                    validateInstitucionalUrl(e.target.value);
                  }}
                  onFocus={(e) => e.target.select()}
                  className={`pr-10 ${institucionalUrlError ? 'border-destructive' : ''}`}
                />
                {institucionalUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setInstitucionalUrl('');
                      setInstitucionalUrlError('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Limpar URL"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {institucionalUrlError && (
                <p className="text-sm text-destructive">{institucionalUrlError}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Vídeo de apresentação do rancho para ser usado na página inicial e outras seções
              </p>
            </div>

            {institucionalVideoId && (
              <div className="space-y-2">
                <Label>Preview do Vídeo</Label>
                <YouTubePlayer videoUrl={institucionalUrl} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setLiveUrl(settings?.youtube_live_url || '');
              setVideoUrl(settings?.youtube_video_url || '');
              setInstitucionalUrl(settings?.youtube_institucional_url || '');
              setLiveUrlError('');
              setVideoUrlError('');
              setInstitucionalUrlError('');
            }}
            disabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUpdating || !!liveUrlError || !!videoUrlError || !!institucionalUrlError}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesVideos;
