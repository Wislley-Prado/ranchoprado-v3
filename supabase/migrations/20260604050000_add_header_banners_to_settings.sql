-- Adicionar colunas de banner de cabeçalho na tabela site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS banner_blog_url text,
ADD COLUMN IF NOT EXISTS banner_ranchos_url text,
ADD COLUMN IF NOT EXISTS banner_pacotes_url text;

-- Recriar a view site_settings_public para incluir os novos campos de banner
DROP VIEW IF EXISTS public.site_settings_public;

CREATE VIEW public.site_settings_public AS
SELECT 
  id, created_at, updated_at,
  autor_avatar_url, copyright_text, email_contato,
  facebook_url, favicon_url, instagram_url,
  reserva_button_link, reserva_button_text,
  telefone_contato, tiktok_url, twitter_url,
  whatsapp_horario, whatsapp_instrucao, whatsapp_mensagem_padrao,
  whatsapp_numero, whatsapp_opcoes, whatsapp_saudacao, whatsapp_titulo,
  youtube_institucional_url, youtube_live_url, youtube_url, youtube_video_url,
  og_image_url, pwa_icon_url, logo_url,
  banner_blog_url, banner_ranchos_url, banner_pacotes_url
FROM public.site_settings;

GRANT SELECT ON public.site_settings_public TO anon, authenticated;
