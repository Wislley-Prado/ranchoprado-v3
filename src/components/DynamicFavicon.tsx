import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const updateLink = (rel: string, href: string, sizes?: string, type?: string) => {
  let selector = `link[rel="${rel}"]`;
  if (sizes) selector += `[sizes="${sizes}"]`;
  
  let link = document.querySelector(selector) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    if (sizes) link.setAttribute('sizes', sizes);
    document.head.appendChild(link);
  }
  if (type) link.type = type;
  link.href = href;
};

export const DynamicFavicon = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings-favicon'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings_public')
        .select('favicon_url, pwa_icon_url')
        .limit(1)
        .single();
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    const faviconUrl =
      settings?.favicon_url && !settings.favicon_url.includes('pradoaqui')
        ? settings.favicon_url
        : '/icons/icon-32x32.png';

    const pwaIconUrl =
      (settings as any)?.pwa_icon_url && !(settings as any).pwa_icon_url.includes('pradoaqui')
        ? (settings as any).pwa_icon_url
        : '/icons/icon-192x192.png';

    updateLink('icon', faviconUrl, undefined, 'image/png');
    updateLink('icon', faviconUrl, '32x32', 'image/png');
    updateLink('icon', faviconUrl, '16x16', 'image/png');
    updateLink('apple-touch-icon', faviconUrl);
    updateLink('icon', pwaIconUrl, '192x192', 'image/png');
  }, [settings]);

  return null;
};
