-- 1. Remover políticas antigas sem qualificação de schema
DROP POLICY IF EXISTS "Admins podem gerenciar configurações do site" ON public.site_settings;
DROP POLICY IF EXISTS "Visitantes podem ver configurações públicas do site" ON public.site_settings;

-- 2. Criar novas políticas com qualificações explícitas de schema
-- Isso previne problemas de resolução de tipo do app_role e da função has_role
CREATE POLICY "Admins podem gerenciar configurações do site"
ON public.site_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Visitantes podem ver configurações públicas do site"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

-- 3. Garantir que o registro inicial de configurações padrão com ID fixo existe
INSERT INTO public.site_settings (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;
