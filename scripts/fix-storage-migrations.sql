-- =============================================================
-- SCRIPT: Aplicar migrações pendentes de imagens e storage
-- Execute este script no SQL Editor do Supabase Dashboard:
-- https://supabase.com/dashboard/project/elteoovghevwrefykkyh/sql/new
-- =============================================================

-- 1. Adicionar colunas de imagens na tabela site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS favicon_url text,
ADD COLUMN IF NOT EXISTS og_image_url text,
ADD COLUMN IF NOT EXISTS pwa_icon_url text;

-- 2. Recriar a view site_settings_public com os novos campos
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
  og_image_url, pwa_icon_url, logo_url
FROM public.site_settings;

GRANT SELECT ON public.site_settings_public TO anon, authenticated;

-- 3. Criar o bucket 'configuracoes' no storage (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('configuracoes', 'configuracoes', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Remover políticas antigas (evitar conflitos de nome)
DROP POLICY IF EXISTS "Todos podem visualizar arquivos do bucket configuracoes" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem fazer upload no bucket configuracoes" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem atualizar arquivos no bucket configuracoes" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem deletar arquivos no bucket configuracoes" ON storage.objects;

-- 5. Criar políticas RLS do storage para o bucket configuracoes

-- Leitura pública (bucket já é público, mas a policy RLS também precisa existir)
CREATE POLICY "Todos podem visualizar arquivos do bucket configuracoes"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'configuracoes');

-- Upload apenas por admins
CREATE POLICY "Admins podem fazer upload no bucket configuracoes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'configuracoes'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Atualização apenas por admins
CREATE POLICY "Admins podem atualizar arquivos no bucket configuracoes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'configuracoes'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'configuracoes'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Exclusão apenas por admins
CREATE POLICY "Admins podem deletar arquivos no bucket configuracoes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'configuracoes'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- =============================================================
-- Verificação final: confirmar que as colunas foram criadas
-- =============================================================
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'site_settings'
  AND column_name IN ('logo_url', 'favicon_url', 'og_image_url', 'pwa_icon_url');
