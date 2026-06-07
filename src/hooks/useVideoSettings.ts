import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/useOptimizedData';
import { invalidateCacheByPrefix } from '@/lib/cacheService';

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

export interface VideoSettings {
  youtube_live_url: string | null;
  youtube_video_url: string | null;
  youtube_institucional_url: string | null;
}

/**
 * useVideoSettings - Reutiliza dados de useSiteSettings (elimina query duplicada)
 */
export const useVideoSettings = () => {
  const queryClient = useQueryClient();
  const { data: siteSettings, isLoading } = useSiteSettings();

  // Extrair video settings dos site settings já carregados
  const settings: VideoSettings | null = siteSettings ? {
    youtube_live_url: siteSettings.youtube_live_url || null,
    youtube_video_url: siteSettings.youtube_video_url || null,
    youtube_institucional_url: siteSettings.youtube_institucional_url || null,
  } : null;

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<VideoSettings>) => {
      const { error } = await supabase
        .from('site_settings')
        .update(newSettings)
        .eq('id', SETTINGS_ID);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateCacheByPrefix('site_settings');
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['video-settings'] });
      toast.success('Configurações de vídeo atualizadas com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Erro ao atualizar configurações de vídeo');
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
    isUpdating: updateSettings.isPending,
  };
};

export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  try {
    const cleanUrl = url.trim();
    
    // Se for apenas o ID de 11 caracteres do YouTube
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
      return cleanUrl;
    }
    
    const urlToParse = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
    const parsed = new URL(urlToParse);
    const hostname = parsed.hostname.replace('www.', '');
    
    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      const v = parsed.searchParams.get('v');
      if (v) return v;
      
      const pathParts = parsed.pathname.split('/');
      if (pathParts[1] === 'shorts' && pathParts[2]) return pathParts[2];
      if (pathParts[1] === 'embed' && pathParts[2]) return pathParts[2];
      if (pathParts[1] === 'live' && pathParts[2]) return pathParts[2];
      if (pathParts[1] === 'v' && pathParts[2]) return pathParts[2];
    } else if (hostname === 'youtu.be') {
      const pathParts = parsed.pathname.split('/');
      if (pathParts[1]) return pathParts[1];
    }
  } catch (e) {
    // Fallback para Regex se falhar o parser de URL
  }
  
  const patterns = [
    /[?&]v=([^#&?]+)/,
    /youtube\.com\/embed\/([^#&?]+)/,
    /youtube\.com\/shorts\/([^#&?]+)/,
    /youtube\.com\/live\/([^#&?]+)/,
    /youtube\.com\/v\/([^#&?]+)/,
    /youtu\.be\/([^#&?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

export const isValidYouTubeUrl = (url: string): boolean => {
  if (!url) return true;
  return extractYouTubeId(url) !== null;
};
