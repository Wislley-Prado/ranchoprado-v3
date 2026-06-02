-- 1. DROP old unqualified policies
DROP POLICY IF EXISTS "Admins podem fazer upload no bucket configuracoes" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem atualizar arquivos no bucket configuracoes" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem deletar arquivos no bucket configuracoes" ON storage.objects;

DROP POLICY IF EXISTS "Admins podem fazer upload de imagens de pacotes" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem atualizar imagens de pacotes" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem deletar imagens de pacotes" ON storage.objects;

DROP POLICY IF EXISTS "Admins podem fazer upload de imagens" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem atualizar imagens" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem deletar imagens" ON storage.objects;

DROP POLICY IF EXISTS "Admins podem fazer upload de imagens do blog" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem atualizar imagens do blog" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem deletar imagens do blog" ON storage.objects;

DROP POLICY IF EXISTS "Admins podem deletar imagens de avaliacoes" ON storage.objects;


-- 2. CREATE new qualified policies using public.has_role and public.app_role

-- BUCKET: configuracoes
CREATE POLICY "Admins podem fazer upload no bucket configuracoes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'configuracoes' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

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

CREATE POLICY "Admins podem deletar arquivos no bucket configuracoes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'configuracoes' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);


-- BUCKET: pacotes
CREATE POLICY "Admins podem fazer upload de imagens de pacotes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pacotes' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins podem atualizar imagens de pacotes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pacotes' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'pacotes' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins podem deletar imagens de pacotes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'pacotes' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);


-- BUCKET: propriedades-venda
CREATE POLICY "Admins podem fazer upload de imagens"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'propriedades-venda' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins podem atualizar imagens"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'propriedades-venda' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'propriedades-venda' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins podem deletar imagens"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'propriedades-venda' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);


-- BUCKET: blog
CREATE POLICY "Admins podem fazer upload de imagens do blog"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins podem atualizar imagens do blog"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'blog' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins podem deletar imagens do blog"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);


-- BUCKET: avaliacoes (deletar apenas)
CREATE POLICY "Admins podem deletar imagens de avaliacoes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avaliacoes' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
