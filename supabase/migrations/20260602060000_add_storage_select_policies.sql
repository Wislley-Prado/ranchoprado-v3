-- Adicionar políticas SELECT públicas para os buckets que estavam sem elas
-- Sem SELECT, o Supabase não consegue fazer o upload (upsert requer INSERT + SELECT + UPDATE)

-- BUCKET: configuracoes
DROP POLICY IF EXISTS "Imagens de configuracoes são públicas" ON storage.objects;
CREATE POLICY "Imagens de configuracoes são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'configuracoes');

-- BUCKET: pacotes
DROP POLICY IF EXISTS "Imagens de pacotes são públicas" ON storage.objects;
CREATE POLICY "Imagens de pacotes são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'pacotes');

-- BUCKET: blog
DROP POLICY IF EXISTS "Imagens do blog são públicas" ON storage.objects;
CREATE POLICY "Imagens do blog são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog');

-- Garantir que o bucket configuracoes existe e é público
INSERT INTO storage.buckets (id, name, public)
VALUES ('configuracoes', 'configuracoes', true)
ON CONFLICT (id) DO UPDATE SET public = true;
