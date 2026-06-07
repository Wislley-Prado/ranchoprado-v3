import { useMemo } from 'react';
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
  const settings = useMemo(() => siteSettings ? {
    youtube_live_url: siteSettings.youtube_live_url || null,
    youtube_video_url: siteSettings.youtube_video_url || null,
    youtube_institucional_url: siteSettings.youtube_institucional_url || null,
  } : null, [siteSettings]);

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
    
    let id: string | null = null;
    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      const v = parsed.searchParams.get('v');
      if (v) id = v;
      else {
        const pathParts = parsed.pathname.split('/');
        if (pathParts[1] === 'shorts' && pathParts[2]) id = pathParts[2];
        else if (pathParts[1] === 'embed' && pathParts[2]) id = pathParts[2];
        else if (pathParts[1] === 'live' && pathParts[2]) id = pathParts[2];
        else if (pathParts[1] === 'v' && pathParts[2]) id = pathParts[2];
      }
    } else if (hostname === 'youtu.be') {
      const pathParts = parsed.pathname.split('/');
      if (pathParts[1]) id = pathParts[1];
    }

    if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
      return id;
    }
  } catch (e) {
    // Fallback para Regex se falhar o parser de URL
  }
  
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
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
