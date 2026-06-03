-- =====================================================
-- SCRIPT DE CLONAGEM DO BANCO - Rancho Prado
-- Gerado em: 2026-02-25
-- IMPORTANTE: Este script cria apenas a ESTRUTURA.
-- Os dados NÃO são copiados.
-- =====================================================

-- 1. ENUM TYPES
-- =====================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'super_admin');

-- 2. TABELA user_roles (ANTES das functions que a referenciam)
-- =====================================================
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'super_admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 4. TABLES
-- =====================================================

-- ranchos
CREATE TABLE public.ranchos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  slug text NOT NULL UNIQUE,
  descricao text,
  localizacao text NOT NULL,
  endereco_completo text,
  preco numeric NOT NULL,
  capacidade integer NOT NULL,
  quartos integer NOT NULL DEFAULT 0,
  banheiros integer NOT NULL DEFAULT 0,
  area numeric,
  rating numeric NOT NULL DEFAULT 5.0,
  disponivel boolean NOT NULL DEFAULT true,
  destaque boolean NOT NULL DEFAULT false,
  comodidades text[],
  caracteristicas jsonb DEFAULT '{}'::jsonb,
  latitude numeric,
  longitude numeric,
  telefone_whatsapp text,
  mensagem_whatsapp text,
  video_youtube text,
  google_calendar_url text,
  tracking_code text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- rancho_imagens
CREATE TABLE public.rancho_imagens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rancho_id uuid NOT NULL REFERENCES public.ranchos(id),
  url text NOT NULL,
  alt_text text,
  ordem integer NOT NULL DEFAULT 0,
  principal boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- rancho_analytics
CREATE TABLE public.rancho_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rancho_id uuid NOT NULL REFERENCES public.ranchos(id),
  evento text NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- pacotes
CREATE TABLE public.pacotes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  slug text NOT NULL UNIQUE,
  descricao text,
  tipo text NOT NULL DEFAULT 'pescaria'::text,
  preco numeric NOT NULL,
  duracao text NOT NULL,
  pessoas integer NOT NULL DEFAULT 2,
  rating numeric NOT NULL DEFAULT 5.0,
  ativo boolean NOT NULL DEFAULT true,
  destaque boolean NOT NULL DEFAULT false,
  popular boolean NOT NULL DEFAULT false,
  inclusos text[],
  caracteristicas text[],
  endereco_completo text,
  latitude numeric,
  longitude numeric,
  telefone_whatsapp text,
  video_youtube text,
  desconto_avista numeric DEFAULT 0,
  parcela_valor numeric,
  parcelas_quantidade integer DEFAULT 10,
  vagas_disponiveis integer,
  tracking_code text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- pacote_imagens
CREATE TABLE public.pacote_imagens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pacote_id uuid NOT NULL REFERENCES public.pacotes(id),
  url text NOT NULL,
  alt_text text,
  ordem integer NOT NULL DEFAULT 0,
  principal boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- pacote_analytics
CREATE TABLE public.pacote_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pacote_id uuid NOT NULL REFERENCES public.pacotes(id),
  evento text NOT NULL,
  tipo text,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- depoimentos
CREATE TABLE public.depoimentos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  depoimento text NOT NULL,
  cargo text,
  foto_url text,
  rating integer NOT NULL DEFAULT 5,
  tipo_pacote text,
  pacote_id uuid REFERENCES public.pacotes(id),
  ativo boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- blog_posts
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo text NOT NULL,
  slug text NOT NULL UNIQUE,
  conteudo text NOT NULL,
  resumo text,
  imagem_destaque text,
  categoria text,
  tags text[],
  autor_id uuid,
  publicado boolean NOT NULL DEFAULT false,
  data_publicacao timestamp with time zone,
  visualizacoes integer NOT NULL DEFAULT 0,
  redes_sociais jsonb DEFAULT '{}'::jsonb,
  banner_midia_paga jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- blog_analytics
CREATE TABLE public.blog_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.blog_posts(id),
  evento text NOT NULL,
  tipo text,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- faqs
CREATE TABLE public.faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pergunta text NOT NULL,
  resposta text NOT NULL,
  pacote_id uuid REFERENCES public.pacotes(id),
  rancho_id uuid REFERENCES public.ranchos(id),
  ativo boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- faq_votes
CREATE TABLE public.faq_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faq_id uuid NOT NULL REFERENCES public.faqs(id),
  voto boolean NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- avaliacoes
CREATE TABLE public.avaliacoes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rancho_id uuid NOT NULL REFERENCES public.ranchos(id),
  nome_usuario text NOT NULL,
  email text NOT NULL,
  comentario text NOT NULL,
  nota integer NOT NULL,
  imagens text[] DEFAULT '{}'::text[],
  verificado boolean NOT NULL DEFAULT false,
  resposta_admin text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- anuncios
CREATE TABLE public.anuncios (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo text NOT NULL,
  subtitulo text,
  descricao text,
  imagem_url text NOT NULL,
  link_url text,
  texto_botao text DEFAULT 'Saiba Mais'::text,
  tipo text NOT NULL,
  posicao text NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  destaque boolean NOT NULL DEFAULT false,
  ordem integer NOT NULL DEFAULT 0,
  duracao_exibicao integer NOT NULL DEFAULT 8,
  visualizacoes integer NOT NULL DEFAULT 0,
  cliques integer NOT NULL DEFAULT 0,
  data_inicio timestamp with time zone,
  data_fim timestamp with time zone,
  imovel_preco numeric,
  imovel_area numeric,
  imovel_unidade_area text,
  imovel_localizacao text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- site_settings
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telefone_contato text DEFAULT '(38) 98832-0108'::text,
  email_contato text DEFAULT 'contato@ranchoprado.com.br'::text,
  copyright_text text DEFAULT '© 2026 Rancho Prado. Todos os direitos reservados'::text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  tiktok_url text,
  twitter_url text,
  reserva_button_text text DEFAULT 'Reservar'::text,
  reserva_button_link text DEFAULT 'https://wa.me/5538988320108'::text,
  autor_avatar_url text,
  whatsapp_numero varchar DEFAULT '5531999999999'::varchar,
  whatsapp_titulo varchar DEFAULT 'Rancho Prado - Atendimento'::varchar,
  whatsapp_mensagem_padrao text DEFAULT 'Olá! Gostaria de saber mais sobre os pacotes de pesca no Rancho Prado.'::text,
  whatsapp_saudacao text DEFAULT '👋 Olá! Como podemos ajudar você hoje?'::text,
  whatsapp_instrucao text DEFAULT 'Escolha uma opção abaixo ou digite sua mensagem:'::text,
  whatsapp_horario varchar DEFAULT 'Seg-Dom: 6h às 22h'::varchar,
  whatsapp_opcoes jsonb DEFAULT '[{"text": "Quero fazer uma reserva", "message": "Olá! Gostaria de fazer uma reserva para pesca no Rio São Francisco."}, {"text": "Consultar disponibilidade", "message": "Oi! Podem me informar a disponibilidade para os próximos finais de semana?"}, {"text": "Informações sobre pacotes", "message": "Olá! Gostaria de saber mais detalhes sobre os pacotes de pesca disponíveis."}, {"text": "Condições atuais do rio", "message": "Oi! Como estão as condições de pesca no rio hoje?"}]'::jsonb,
  google_analytics text,
  google_tag_manager text,
  facebook_pixel text,
  custom_head_scripts text,
  youtube_live_url text,
  youtube_video_url text,
  youtube_institucional_url text,
  dam_webhook_url text DEFAULT 'https://webhook.v1.vendopro.com.br/webhook/v1.represa.online'::text,
  dam_webhook_pausado boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- configuracoes
CREATE TABLE public.configuracoes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chave text NOT NULL,
  valor text,
  tipo text NOT NULL DEFAULT 'text'::text,
  descricao text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- dam_data
CREATE TABLE public.dam_data (
  id integer NOT NULL DEFAULT 1 PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- whatsapp_analytics
CREATE TABLE public.whatsapp_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evento text NOT NULL,
  mensagem_tipo text,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- categorias
CREATE TABLE public.categorias (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  slug text NOT NULL UNIQUE,
  descricao text,
  ativo boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- produtos
CREATE TABLE public.produtos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  slug text NOT NULL UNIQUE,
  descricao text,
  preco numeric NOT NULL,
  preco_promocional numeric,
  estoque integer NOT NULL DEFAULT 0,
  categoria_id uuid REFERENCES public.categorias(id),
  ativo boolean NOT NULL DEFAULT true,
  destaque boolean NOT NULL DEFAULT false,
  tags text[],
  especificacoes jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- produto_imagens
CREATE TABLE public.produto_imagens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id uuid NOT NULL REFERENCES public.produtos(id),
  url text NOT NULL,
  alt_text text,
  ordem integer NOT NULL DEFAULT 0,
  principal boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- propriedades_venda
CREATE TABLE public.propriedades_venda (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo text NOT NULL,
  slug text NOT NULL UNIQUE,
  descricao text,
  tipo text NOT NULL,
  localizacao text NOT NULL,
  preco numeric NOT NULL,
  area numeric,
  unidade_area text DEFAULT 'hectares'::text,
  latitude numeric,
  longitude numeric,
  imagens text[] DEFAULT '{}'::text[],
  caracteristicas text[] DEFAULT '{}'::text[],
  telefone_contato text,
  whatsapp_contato text,
  ativo boolean NOT NULL DEFAULT true,
  destaque boolean NOT NULL DEFAULT false,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 4. VIEWS
-- =====================================================

CREATE OR REPLACE VIEW public.avaliacoes_public AS
SELECT
  id, rancho_id, nome_usuario, comentario, nota,
  imagens, verificado, resposta_admin, created_at, updated_at
FROM public.avaliacoes
WHERE verificado = true;

CREATE OR REPLACE VIEW public.site_settings_public AS
SELECT
  id, telefone_contato, email_contato, copyright_text,
  facebook_url, instagram_url, youtube_url, tiktok_url, twitter_url,
  reserva_button_text, reserva_button_link, autor_avatar_url,
  whatsapp_numero, whatsapp_titulo, whatsapp_mensagem_padrao,
  whatsapp_saudacao, whatsapp_instrucao, whatsapp_horario, whatsapp_opcoes,
  youtube_live_url, youtube_video_url, youtube_institucional_url,
  created_at, updated_at
FROM public.site_settings;

CREATE OR REPLACE VIEW public.faq_estatisticas AS
SELECT
  f.id, f.pergunta, f.pacote_id, f.rancho_id, f.ativo, f.ordem,
  COUNT(v.id) AS total_votos,
  COUNT(v.id) FILTER (WHERE v.voto = true) AS votos_uteis,
  COUNT(v.id) FILTER (WHERE v.voto = false) AS votos_nao_uteis,
  CASE WHEN COUNT(v.id) > 0
    THEN ROUND((COUNT(v.id) FILTER (WHERE v.voto = true))::numeric / COUNT(v.id) * 100, 1)
    ELSE 0
  END AS taxa_utilidade
FROM public.faqs f
LEFT JOIN public.faq_votes v ON v.faq_id = f.id
GROUP BY f.id, f.pergunta, f.pacote_id, f.rancho_id, f.ativo, f.ordem;

CREATE OR REPLACE VIEW public.rancho_estatisticas AS
SELECT
  r.id, r.nome, r.slug,
  COUNT(ra.id) FILTER (WHERE ra.evento = 'visualizacao') AS total_visualizacoes,
  COUNT(ra.id) FILTER (WHERE ra.evento = 'clique_whatsapp') AS total_cliques_whatsapp,
  COUNT(ra.id) FILTER (WHERE ra.evento = 'clique_reserva') AS total_cliques_reserva,
  COUNT(ra.id) FILTER (WHERE ra.evento = 'visualizacao' AND ra.created_at >= now() - interval '7 days') AS visualizacoes_7_dias,
  COUNT(ra.id) FILTER (WHERE ra.evento = 'visualizacao' AND ra.created_at >= now() - interval '30 days') AS visualizacoes_30_dias,
  CASE WHEN COUNT(ra.id) FILTER (WHERE ra.evento = 'visualizacao') > 0
    THEN ROUND(
      (COUNT(ra.id) FILTER (WHERE ra.evento IN ('clique_whatsapp', 'clique_reserva')))::numeric /
      COUNT(ra.id) FILTER (WHERE ra.evento = 'visualizacao') * 100, 1
    )
    ELSE 0
  END AS taxa_conversao
FROM public.ranchos r
LEFT JOIN public.rancho_analytics ra ON ra.rancho_id = r.id
GROUP BY r.id, r.nome, r.slug;

-- 5. ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranchos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rancho_imagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rancho_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacote_imagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacote_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depoimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anuncios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dam_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_imagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propriedades_venda ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES
-- =====================================================

-- user_roles
CREATE POLICY "Usuários podem ver suas próprias roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins podem visualizar todas as roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins podem gerenciar roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Super admins podem gerenciar todas as roles" ON public.user_roles FOR ALL USING (is_super_admin(auth.uid())) WITH CHECK (is_super_admin(auth.uid()));

-- ranchos
CREATE POLICY "Visitantes podem ver ranchos disponíveis" ON public.ranchos FOR SELECT USING (disponivel = true);
CREATE POLICY "Admins podem gerenciar ranchos" ON public.ranchos FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- rancho_imagens
CREATE POLICY "Visitantes podem ver imagens de ranchos disponíveis" ON public.rancho_imagens FOR SELECT USING (EXISTS (SELECT 1 FROM ranchos WHERE ranchos.id = rancho_imagens.rancho_id AND ranchos.disponivel = true));
CREATE POLICY "Admins podem gerenciar imagens de ranchos" ON public.rancho_imagens FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- rancho_analytics
CREATE POLICY "Admins podem ver analytics" ON public.rancho_analytics FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Permitir inserção de eventos de analytics" ON public.rancho_analytics FOR INSERT WITH CHECK (true);

-- pacotes
CREATE POLICY "Visitantes podem ver pacotes ativos" ON public.pacotes FOR SELECT USING (ativo = true);
CREATE POLICY "Admins podem gerenciar pacotes" ON public.pacotes FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- pacote_imagens
CREATE POLICY "Visitantes podem ver imagens de pacotes ativos" ON public.pacote_imagens FOR SELECT USING (EXISTS (SELECT 1 FROM pacotes WHERE pacotes.id = pacote_imagens.pacote_id AND pacotes.ativo = true));
CREATE POLICY "Admins podem gerenciar imagens de pacotes" ON public.pacote_imagens FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- pacote_analytics
CREATE POLICY "Admins podem ver analytics" ON public.pacote_analytics FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Visitantes podem registrar eventos" ON public.pacote_analytics FOR INSERT WITH CHECK (true);

-- depoimentos
CREATE POLICY "Visitantes podem ver depoimentos ativos" ON public.depoimentos FOR SELECT USING (ativo = true);
CREATE POLICY "Admins podem gerenciar depoimentos" ON public.depoimentos FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- blog_posts
CREATE POLICY "Visitantes podem ver posts publicados" ON public.blog_posts FOR SELECT USING (publicado = true);
CREATE POLICY "Autores podem ver seus rascunhos" ON public.blog_posts FOR SELECT USING (auth.uid() = autor_id);
CREATE POLICY "Autores podem editar seus posts" ON public.blog_posts FOR UPDATE USING (auth.uid() = autor_id) WITH CHECK (auth.uid() = autor_id);
CREATE POLICY "Admins podem gerenciar posts" ON public.blog_posts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- blog_analytics
CREATE POLICY "Admins podem ver analytics" ON public.blog_analytics FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Visitantes podem registrar eventos" ON public.blog_analytics FOR INSERT WITH CHECK (true);

-- faqs
CREATE POLICY "Visitantes podem ver FAQs ativos" ON public.faqs FOR SELECT USING (ativo = true);
CREATE POLICY "Admins podem gerenciar FAQs" ON public.faqs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- faq_votes
CREATE POLICY "Visitantes podem registrar votos" ON public.faq_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins podem ver todos os votos" ON public.faq_votes FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- avaliacoes
CREATE POLICY "Visitantes acessam via view pública" ON public.avaliacoes FOR SELECT USING (false);
CREATE POLICY "Visitantes podem criar avaliações" ON public.avaliacoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins podem gerenciar todas as avaliações" ON public.avaliacoes FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- anuncios
CREATE POLICY "Visitantes podem ver anúncios ativos" ON public.anuncios FOR SELECT USING (ativo = true AND (data_inicio IS NULL OR data_inicio <= now()) AND (data_fim IS NULL OR data_fim >= now()));
CREATE POLICY "Admins podem gerenciar anúncios" ON public.anuncios FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- site_settings
CREATE POLICY "Visitantes acessam via view pública" ON public.site_settings FOR SELECT USING (false);
CREATE POLICY "Admins podem gerenciar configurações do site" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- configuracoes
CREATE POLICY "Visitantes podem ver configurações públicas" ON public.configuracoes FOR SELECT USING (true);

-- dam_data
CREATE POLICY "Visitantes podem ver dados da represa" ON public.dam_data FOR SELECT USING (true);
CREATE POLICY "Service role pode atualizar dados" ON public.dam_data FOR ALL USING (true) WITH CHECK (true);

-- whatsapp_analytics
CREATE POLICY "Visitantes podem registrar eventos do WhatsApp" ON public.whatsapp_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins podem ver analytics do WhatsApp" ON public.whatsapp_analytics FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- categorias
CREATE POLICY "Visitantes podem ver categorias ativas" ON public.categorias FOR SELECT USING (ativo = true);

-- produtos
CREATE POLICY "Visitantes podem ver produtos ativos" ON public.produtos FOR SELECT USING (ativo = true);

-- produto_imagens
CREATE POLICY "Visitantes podem ver imagens de produtos ativos" ON public.produto_imagens FOR SELECT USING (EXISTS (SELECT 1 FROM produtos WHERE produtos.id = produto_imagens.produto_id AND produtos.ativo = true));

-- propriedades_venda
CREATE POLICY "Visitantes podem ver propriedades ativas" ON public.propriedades_venda FOR SELECT USING (ativo = true);
CREATE POLICY "Admins podem gerenciar propriedades" ON public.propriedades_venda FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 7. STORAGE BUCKETS
-- =====================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('ranchos', 'ranchos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('pacotes', 'pacotes', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('configuracoes', 'configuracoes', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avaliacoes', 'avaliacoes', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('produtos', 'produtos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('propriedades-venda', 'propriedades-venda', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('generated-media', 'generated-media', true) ON CONFLICT DO NOTHING;

-- 8. STORAGE POLICIES (acesso público para leitura)
-- =====================================================
CREATE POLICY "Acesso público leitura ranchos" ON storage.objects FOR SELECT USING (bucket_id = 'ranchos');
CREATE POLICY "Admins upload ranchos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ranchos' AND (SELECT has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins update ranchos" ON storage.objects FOR UPDATE USING (bucket_id = 'ranchos' AND (SELECT has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins delete ranchos" ON storage.objects FOR DELETE USING (bucket_id = 'ranchos' AND (SELECT has_role(auth.uid(), 'admin'::app_role)));

CREATE POLICY "Acesso público leitura pacotes" ON storage.objects FOR SELECT USING (bucket_id = 'pacotes');
CREATE POLICY "Admins upload pacotes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pacotes' AND (SELECT has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins update pacotes" ON storage.objects FOR UPDATE USING (bucket_id = 'pacotes' AND (SELECT has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins delete pacotes" ON storage.objects FOR DELETE USING (bucket_id = 'pacotes' AND (SELECT has_role(auth.uid(), 'admin'::app_role)));

CREATE POLICY "Acesso público leitura blog" ON storage.objects FOR SELECT USING (bucket_id = 'blog');
CREATE POLICY "Admins upload blog" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog' AND (SELECT has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins update blog" ON storage.objects FOR UPDATE USING (bucket_id = 'blog' AND (SELECT has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins delete blog" ON storage.objects FOR DELETE USING (bucket_id = 'blog' AND (SELECT has_role(auth.uid(), 'admin'::app_role)));

CREATE POLICY "Acesso público leitura configuracoes" ON storage.objects FOR SELECT USING (bucket_id = 'configuracoes');
CREATE POLICY "Admins upload configuracoes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'configuracoes' AND (SELECT has_role(auth.uid(), 'admin'::app_role)));

CREATE POLICY "Acesso público leitura avaliacoes" ON storage.objects FOR SELECT USING (bucket_id = 'avaliacoes');
CREATE POLICY "Qualquer um upload avaliacoes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avaliacoes');

CREATE POLICY "Acesso público leitura produtos" ON storage.objects FOR SELECT USING (bucket_id = 'produtos');
CREATE POLICY "Acesso público leitura propriedades" ON storage.objects FOR SELECT USING (bucket_id = 'propriedades-venda');
CREATE POLICY "Acesso público leitura generated-media" ON storage.objects FOR SELECT USING (bucket_id = 'generated-media');

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
-- Para usar:
-- 1. Crie um novo projeto no Supabase
-- 2. Vá em SQL Editor
-- 3. Cole este script inteiro
-- 4. Clique em Run
-- 5. Pronto!
-- 
-- LEMBRETE: Os dados (registros) NÃO são copiados.
-- Para copiar dados, use pg_dump.
-- =====================================================
