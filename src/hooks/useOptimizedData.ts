/**
 * useOptimizedData - Hooks centralizados com cache persistente
 * Elimina queries duplicadas e reduz egress em 60-70%
 */

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cachedQuery, TTL, invalidateCacheByPrefix } from '@/lib/cacheService';

// ============= TYPES =============

export interface RanchoWithImages {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  localizacao: string;
  capacidade: number;
  preco: number;
  rating: number;
  quartos: number;
  banheiros: number;
  area: number | null;
  comodidades: string[];
  disponivel: boolean;
  destaque: boolean;
  telefone_whatsapp?: string;
  mensagem_whatsapp?: string;
  video_youtube?: string;
  google_calendar_url?: string;
  tracking_code?: string;
  latitude?: number;
  longitude?: number;
  endereco_completo?: string;
  imagens: Array<{
    id: string;
    url: string;
    alt_text?: string;
    principal: boolean;
    ordem: number;
  }>;
}

export interface PacoteWithImages {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  duracao: string;
  pessoas: number;
  rating: number;
  tipo?: string;
  caracteristicas: string[];
  inclusos: string[];
  ativo: boolean;
  popular: boolean;
  destaque: boolean;
  parcelas_quantidade?: number;
  parcela_valor?: number;
  desconto_avista?: number;
  vagas_disponiveis?: number;
  video_youtube?: string;
  tracking_code?: string;
  telefone_whatsapp?: string;
  endereco_completo?: string;
  latitude?: number;
  longitude?: number;
  imagens: Array<{
    id: string;
    url: string;
    alt_text?: string;
    principal: boolean;
    ordem: number;
  }>;
}

export interface Anuncio {
  id: string;
  titulo: string;
  subtitulo?: string;
  descricao?: string;
  imagem_url: string;
  link_url?: string;
  texto_botao?: string;
  tipo: string;
  posicao: string;
  ativo: boolean;
  destaque: boolean;
  ordem: number;
  visualizacoes: number;
  cliques: number;
  duracao_exibicao: number;
  data_inicio?: string;
  data_fim?: string;
  imovel_preco?: number;
  imovel_area?: number;
  imovel_localizacao?: string;
  imovel_unidade_area?: string;
}

export interface BlogPost {
  id: string;
  titulo: string;
  slug: string;
  resumo?: string;
  conteudo: string;
  imagem_destaque?: string;
  categoria?: string;
  tags?: string[];
  publicado: boolean;
  data_publicacao?: string;
  visualizacoes: number;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  youtube_live_url?: string;
  youtube_video_url?: string;
  youtube_institucional_url?: string;
  facebook_pixel?: string;
  google_analytics?: string;
  google_tag_manager?: string;
  whatsapp_numero?: string;
  whatsapp_titulo?: string;
  whatsapp_mensagem_padrao?: string;
  whatsapp_saudacao?: string;
  whatsapp_instrucoes?: string;
  whatsapp_horario?: string;
  whatsapp_mensagens_rapidas?: Array<{ text: string; message: string }>;
  autor_avatar_url?: string;
  // Redes sociais
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  twitter_url?: string;
  // Contato
  telefone_contato?: string;
  email_contato?: string;
  // Footer e Header
  copyright_text?: string;
  reserva_button_link?: string;
}

export interface Depoimento {
  id: string;
  nome: string;
  cargo?: string;
  foto_url?: string;
  depoimento: string;
  rating: number;
  ativo: boolean;
  ordem: number;
}

export interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
  ativo: boolean;
  ordem: number;
  pacote_id?: string;
  rancho_id?: string;
}

// ============= RANCHOS =============

export const useRanchos = (onlyAvailable = true) => {
  return useQuery(
    ['ranchos', onlyAvailable ? 'available' : 'all'],
    () => cachedQuery<RanchoWithImages[]>(
      `ranchos_${onlyAvailable ? 'available' : 'all'}`,
      TTL.LISTS,
      async () => {
        let query = supabase
          .from('ranchos')
          .select(`
            *,
            rancho_imagens!rancho_imagens_rancho_id_fkey (
              id, url, alt_text, principal, ordem
            )
          `)
          .order('destaque', { ascending: false })
          .order('created_at', { ascending: false });

        if (onlyAvailable) {
          query = query.eq('disponivel', true);
        }

        const { data, error } = await query;
        if (error) throw error;

        return (data || []).map(rancho => ({
          id: rancho.id,
          nome: rancho.nome,
          slug: rancho.slug,
          descricao: rancho.descricao || '',
          localizacao: rancho.localizacao,
          capacidade: rancho.capacidade,
          preco: Number(rancho.preco),
          rating: Number(rancho.rating),
          quartos: rancho.quartos,
          banheiros: rancho.banheiros,
          area: rancho.area,
          comodidades: rancho.comodidades || [],
          disponivel: rancho.disponivel,
          destaque: rancho.destaque,
          telefone_whatsapp: rancho.telefone_whatsapp,
          mensagem_whatsapp: rancho.mensagem_whatsapp,
          video_youtube: rancho.video_youtube,
          google_calendar_url: rancho.google_calendar_url,
          tracking_code: rancho.tracking_code,
          latitude: rancho.latitude,
          longitude: rancho.longitude,
          endereco_completo: rancho.endereco_completo,
          imagens: (rancho.rancho_imagens || [])
            .sort((a: { ordem: number; principal: boolean }, b: { ordem: number; principal: boolean }) => {
              // Principal image always comes first
              if (a.principal && !b.principal) return -1;
              if (!a.principal && b.principal) return 1;
              // Then sort by ordem
              return a.ordem - b.ordem;
            })
            .map((img: { id: string; url: string; alt_text?: string; principal: boolean; ordem: number }) => ({
              id: img.id,
              url: img.url,
              alt_text: img.alt_text,
              principal: img.principal,
              ordem: img.ordem,
            })),
        }));
      }
    ),
    {
      staleTime: TTL.LISTS,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

export const useRanchoBySlug = (slug: string | undefined) => {
  const { data: ranchos } = useRanchos(false);
  
  return useQuery(
    ['rancho', slug],
    () => cachedQuery<RanchoWithImages | null>(
      `rancho_${slug}`,
      TTL.LISTS,
      async () => {
        // First check if we already have it from the list
        if (ranchos) {
          const found = ranchos.find(r => r.slug === slug);
          if (found) return found;
        }

        // Fetch individually if not in list
        const { data, error } = await supabase
          .from('ranchos')
          .select(`
            *,
            rancho_imagens!rancho_imagens_rancho_id_fkey (
              id, url, alt_text, principal, ordem
            )
          `)
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;
        if (!data) return null;

        return {
          id: data.id,
          nome: data.nome,
          slug: data.slug,
          descricao: data.descricao || '',
          localizacao: data.localizacao,
          capacidade: data.capacidade,
          preco: Number(data.preco),
          rating: Number(data.rating),
          quartos: data.quartos,
          banheiros: data.banheiros,
          area: data.area,
          comodidades: data.comodidades || [],
          disponivel: data.disponivel,
          destaque: data.destaque,
          telefone_whatsapp: data.telefone_whatsapp,
          mensagem_whatsapp: data.mensagem_whatsapp,
          video_youtube: data.video_youtube,
          google_calendar_url: data.google_calendar_url,
          tracking_code: data.tracking_code,
          latitude: data.latitude,
          longitude: data.longitude,
          endereco_completo: data.endereco_completo,
          imagens: (data.rancho_imagens || [])
            .sort((a: { ordem: number; principal: boolean }, b: { ordem: number; principal: boolean }) => {
              // Principal image always comes first
              if (a.principal && !b.principal) return -1;
              if (!a.principal && b.principal) return 1;
              // Then sort by ordem
              return a.ordem - b.ordem;
            })
            .map((img: { id: string; url: string; alt_text?: string; principal: boolean; ordem: number }) => ({
              id: img.id,
              url: img.url,
              alt_text: img.alt_text,
              principal: img.principal,
              ordem: img.ordem,
            })),
        };
      }
    ),
    {
      enabled: !!slug,
      staleTime: TTL.LISTS,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

// ============= PACOTES =============

export const usePacotes = (onlyActive = true) => {
  return useQuery(
    ['pacotes', onlyActive ? 'active' : 'all'],
    () => cachedQuery<PacoteWithImages[]>(
      `pacotes_${onlyActive ? 'active' : 'all'}`,
      TTL.LISTS,
      async () => {
        let query = supabase
          .from('pacotes')
          .select(`
            *,
            pacote_imagens (
              id, url, alt_text, principal, ordem
            )
          `)
          .order('popular', { ascending: false })
          .order('preco', { ascending: true });

        if (onlyActive) {
          query = query.eq('ativo', true);
        }

        const { data, error } = await query;
        if (error) throw error;

        return (data || []).map(pacote => ({
          id: pacote.id,
          nome: pacote.nome,
          slug: pacote.slug,
          descricao: pacote.descricao || '',
          preco: Number(pacote.preco),
          duracao: pacote.duracao,
          pessoas: pacote.pessoas,
          rating: Number(pacote.rating),
          tipo: pacote.tipo,
          caracteristicas: pacote.caracteristicas || [],
          inclusos: pacote.inclusos || [],
          ativo: pacote.ativo,
          popular: pacote.popular,
          destaque: pacote.destaque,
          parcelas_quantidade: pacote.parcelas_quantidade,
          parcela_valor: pacote.parcela_valor ? Number(pacote.parcela_valor) : undefined,
          desconto_avista: pacote.desconto_avista ? Number(pacote.desconto_avista) : undefined,
          vagas_disponiveis: pacote.vagas_disponiveis,
          video_youtube: pacote.video_youtube,
          tracking_code: pacote.tracking_code,
          telefone_whatsapp: pacote.telefone_whatsapp,
          endereco_completo: pacote.endereco_completo,
          latitude: pacote.latitude,
          longitude: pacote.longitude,
          imagens: (pacote.pacote_imagens || [])
            .sort((a: { ordem: number; principal: boolean }, b: { ordem: number; principal: boolean }) => {
              // Principal image always comes first
              if (a.principal && !b.principal) return -1;
              if (!a.principal && b.principal) return 1;
              // Then sort by ordem
              return a.ordem - b.ordem;
            })
            .map((img: { id: string; url: string; alt_text?: string; principal: boolean; ordem: number }) => ({
              id: img.id,
              url: img.url,
              alt_text: img.alt_text,
              principal: img.principal,
              ordem: img.ordem,
            })),
        }));
      }
    ),
    {
      staleTime: TTL.LISTS,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

export const usePacoteBySlug = (slug: string | undefined) => {
  const { data: pacotes } = usePacotes(false);
  
  return useQuery(
    ['pacote', slug],
    () => cachedQuery<PacoteWithImages | null>(
      `pacote_${slug}`,
      TTL.LISTS,
      async () => {
        // First check if we already have it from the list
        if (pacotes) {
          const found = pacotes.find(p => p.slug === slug);
          if (found) return found;
        }

        // Fetch individually if not in list
        const { data, error } = await supabase
          .from('pacotes')
          .select(`
            *,
            pacote_imagens (
              id, url, alt_text, principal, ordem
            )
          `)
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;
        if (!data) return null;

        return {
          id: data.id,
          nome: data.nome,
          slug: data.slug,
          descricao: data.descricao || '',
          preco: Number(data.preco),
          duracao: data.duracao,
          pessoas: data.pessoas,
          rating: Number(data.rating),
          tipo: data.tipo,
          caracteristicas: data.caracteristicas || [],
          inclusos: data.inclusos || [],
          ativo: data.ativo,
          popular: data.popular,
          destaque: data.destaque,
          parcelas_quantidade: data.parcelas_quantidade,
          parcela_valor: data.parcela_valor ? Number(data.parcela_valor) : undefined,
          desconto_avista: data.desconto_avista ? Number(data.desconto_avista) : undefined,
          vagas_disponiveis: data.vagas_disponiveis,
          video_youtube: data.video_youtube,
          tracking_code: data.tracking_code,
          telefone_whatsapp: data.telefone_whatsapp,
          endereco_completo: data.endereco_completo,
          latitude: data.latitude,
          longitude: data.longitude,
          imagens: (data.pacote_imagens || [])
            .sort((a: { ordem: number; principal: boolean }, b: { ordem: number; principal: boolean }) => {
              // Principal image always comes first
              if (a.principal && !b.principal) return -1;
              if (!a.principal && b.principal) return 1;
              // Then sort by ordem
              return a.ordem - b.ordem;
            })
            .map((img: { id: string; url: string; alt_text?: string; principal: boolean; ordem: number }) => ({
              id: img.id,
              url: img.url,
              alt_text: img.alt_text,
              principal: img.principal,
              ordem: img.ordem,
            })),
        };
      }
    ),
    {
      enabled: !!slug,
      staleTime: TTL.LISTS,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

// ============= ANÚNCIOS =============

/**
 * useAllAnuncios - Busca TODOS os anúncios ativos em 1 única query.
 * Filtra por posição no frontend, eliminando 3 requests separados.
 */
export const useAllAnuncios = () => {
  return useQuery(
    ['anuncios', 'all'],
    () => cachedQuery<Anuncio[]>(
      'anuncios_all',
      TTL.SEMI_DYNAMIC,
      async () => {
        const { data, error } = await supabase
          .from('anuncios')
          .select('*')
          .eq('ativo', true)
          .order('ordem', { ascending: true });

        if (error) throw error;
        return data || [];
      }
    ),
    {
      staleTime: TTL.SEMI_DYNAMIC,
      cacheTime: TTL.LISTS,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

/**
 * useAnuncios - Filtra anúncios por posição a partir da query consolidada.
 */
export const useAnuncios = (posicao: string) => {
  const { data: allAnuncios, isLoading, error } = useAllAnuncios();
  
  const filtered = React.useMemo(
    () => (allAnuncios || []).filter(a => a.posicao === posicao),
    [allAnuncios, posicao]
  );

  return {
    data: filtered,
    isLoading,
    error,
  };
};

// ============= BLOG =============

export const useBlogPosts = (limit?: number) => {
  return useQuery(
    ['blog-posts', limit || 'all'],
    () => cachedQuery<BlogPost[]>(
      `blog_posts_${limit || 'all'}`,
      TTL.LISTS,
      async () => {
        let query = supabase
          .from('blog_posts')
          .select('*')
          .eq('publicado', true)
          .order('data_publicacao', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      }
    ),
    {
      staleTime: TTL.LISTS,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

export const useBlogPostBySlug = (slug: string | undefined) => {
  return useQuery(
    ['blog-post', slug],
    () => cachedQuery<BlogPost | null>(
      `blog_post_${slug}`,
      TTL.LISTS,
      async () => {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('publicado', true)
          .maybeSingle();

        if (error) throw error;
        return data;
      }
    ),
    {
      enabled: !!slug,
      staleTime: TTL.LISTS,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

// ============= DEPOIMENTOS =============

export const useDepoimentos = () => {
  return useQuery(
    ['depoimentos'],
    () => cachedQuery<Depoimento[]>(
      'depoimentos_active',
      TTL.LISTS,
      async () => {
        const { data, error } = await supabase
          .from('depoimentos')
          .select('id, nome, cargo, foto_url, depoimento, rating, ativo, ordem')
          .eq('ativo', true)
          .order('ordem', { ascending: true });

        if (error) throw error;
        return (data || []).map(d => ({
          id: d.id,
          nome: d.nome,
          cargo: d.cargo,
          foto_url: d.foto_url,
          depoimento: d.depoimento,
          rating: d.rating,
          ativo: d.ativo,
          ordem: d.ordem,
        }));
      }
    ),
    {
      staleTime: TTL.LISTS,
      cacheTime: TTL.LISTS,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: true, // Permitir refetch ao montar
      retry: 2,
    }
  );
};

// ============= FAQs =============

export const useFAQs = (pacoteId?: string, ranchoId?: string) => {
  const key = pacoteId ? `pacote_${pacoteId}` : ranchoId ? `rancho_${ranchoId}` : 'general';
  
  return useQuery(
    ['faqs', key],
    () => cachedQuery<FAQ[]>(
      `faqs_${key}`,
      TTL.STATIC,
      async () => {
        let query = supabase
          .from('faqs')
          .select('*')
          .eq('ativo', true)
          .order('ordem', { ascending: true });

        if (pacoteId) {
          query = query.eq('pacote_id', pacoteId);
        } else if (ranchoId) {
          query = query.eq('rancho_id', ranchoId);
        } else {
          query = query.is('pacote_id', null).is('rancho_id', null);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      }
    ),
    {
      staleTime: TTL.STATIC,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

// ============= SITE SETTINGS =============

export const useSiteSettings = () => {
  return useQuery(
    ['site-settings'],
    () => cachedQuery<SiteSettings | null>(
      'site_settings',
      TTL.SETTINGS,
      async () => {
        // Usar view pública que não expõe tracking codes sensíveis
        const { data, error } = await supabase
          .from('site_settings_public' as any)
          .select('*')
          .maybeSingle();

        if (error) throw error;
        return data as unknown as SiteSettings | null;
      }
    ),
    {
      staleTime: TTL.SETTINGS,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

// ============= ADMIN STATISTICS (1 hora de cache) =============

export interface FAQEstatistica {
  id: string;
  pergunta: string;
  ordem: number;
  ativo: boolean;
  pacote_id?: string | null;
  rancho_id?: string | null;
  total_votos: number;
  votos_uteis: number;
  votos_nao_uteis: number;
  taxa_utilidade: number;
}

export interface RanchoEstatistica {
  id: string;
  nome: string;
  slug: string;
  total_visualizacoes: number;
  total_cliques_whatsapp: number;
  total_cliques_reserva: number;
  taxa_conversao: number;
  visualizacoes_7_dias: number;
  visualizacoes_30_dias: number;
}

export const useFAQEstatisticas = () => {
  return useQuery(
    ['faq-estatisticas'],
    () => cachedQuery<FAQEstatistica[]>(
      'faq_estatisticas',
      TTL.ADMIN_STATS,
      async () => {
        const { data, error } = await supabase
          .from('faq_estatisticas')
          .select('*');
        if (error) throw error;
        return data || [];
      }
    ),
    {
      staleTime: TTL.ADMIN_STATS,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

export const useRanchoEstatisticas = () => {
  return useQuery(
    ['rancho-estatisticas'],
    () => cachedQuery<RanchoEstatistica[]>(
      'rancho_estatisticas',
      TTL.ADMIN_STATS,
      async () => {
        const { data, error } = await supabase
          .from('rancho_estatisticas')
          .select('*');
        if (error) throw error;
        return data || [];
      }
    ),
    {
      staleTime: TTL.ADMIN_STATS,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

// ============= ADMIN HOOKS (1-HOUR CACHE) =============

export interface AdminDepoimento {
  id: string;
  nome: string;
  cargo: string | null;
  foto_url: string | null;
  depoimento: string;
  rating: number;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

export const useAdminDepoimentos = () => {
  return useQuery(
    ['admin-depoimentos'],
    () => cachedQuery<AdminDepoimento[]>(
      'admin_depoimentos',
      TTL.ADMIN_STATS,
      async () => {
        const { data, error } = await supabase
          .from('depoimentos')
          .select('*')
          .order('ordem', { ascending: true });
        if (error) throw error;
        return data || [];
      }
    ),
    {
      staleTime: TTL.ADMIN_STATS,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

// Use the Supabase type directly for admin blog posts
import type { Tables, Json } from '@/integrations/supabase/types';
export type AdminBlogPost = Tables<'blog_posts'>;

export const useAdminBlogPosts = () => {
  return useQuery(
    ['admin-blog-posts-cached'],
    () => cachedQuery<AdminBlogPost[]>(
      'admin_blog_posts',
      TTL.ADMIN_STATS,
      async () => {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      }
    ),
    {
      staleTime: TTL.ADMIN_STATS,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

export interface AdminPacote {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  preco: number;
  duracao: string;
  pessoas: number;
  rating: number;
  tipo: string | null;
  caracteristicas: string[] | null;
  inclusos: string[] | null;
  ativo: boolean;
  popular: boolean;
  destaque: boolean;
  created_at: string;
  pacote_imagens: Array<{
    id: string;
    url: string;
    alt_text: string | null;
    principal: boolean;
    ordem: number;
  }>;
}

export const useAdminPacotes = () => {
  return useQuery(
    ['admin-pacotes-cached'],
    () => cachedQuery<AdminPacote[]>(
      'admin_pacotes',
      TTL.ADMIN_STATS,
      async () => {
        const { data, error } = await supabase
          .from('pacotes')
          .select('*, pacote_imagens(*)')
          .order('nome', { ascending: true });
        if (error) throw error;
        return data || [];
      }
    ),
    {
      staleTime: TTL.ADMIN_STATS,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    }
  );
};

// ============= DASHBOARD STATS =============

export interface DashboardStats {
  totalRanchos: number;
  ranchosDisponiveis: number;
  totalPacotes: number;
  pacotesAtivos: number;
  totalBlogPosts: number;
  postsPublicados: number;
  totalDepoimentos: number;
  depoimentosAtivos: number;
}

export const useDashboardStats = () => {
  return useQuery(
    ['dashboard-stats'],
    () => cachedQuery<DashboardStats>(
      'dashboard_stats',
      TTL.ADMIN_STATS,
      async () => {
        const [ranchos, pacotes, blog, depoimentos] = await Promise.all([
          supabase.from('ranchos').select('disponivel'),
          supabase.from('pacotes').select('ativo'),
          supabase.from('blog_posts').select('publicado'),
          supabase.from('depoimentos').select('ativo'),
        ]);
        
        return {
          totalRanchos: ranchos.data?.length || 0,
          ranchosDisponiveis: ranchos.data?.filter(r => r.disponivel).length || 0,
          totalPacotes: pacotes.data?.length || 0,
          pacotesAtivos: pacotes.data?.filter(p => p.ativo).length || 0,
          totalBlogPosts: blog.data?.length || 0,
          postsPublicados: blog.data?.filter(b => b.publicado).length || 0,
          totalDepoimentos: depoimentos.data?.length || 0,
          depoimentosAtivos: depoimentos.data?.filter(d => d.ativo).length || 0,
        };
      }
    ),
    {
      staleTime: TTL.ADMIN_STATS,
      cacheTime: TTL.STATIC,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );
};

// ============= CACHE INVALIDATION HELPERS =============

export const useInvalidateCache = () => {
  const queryClient = useQueryClient();

  return {
    invalidateRanchos: () => {
      invalidateCacheByPrefix('ranchos');
      invalidateCacheByPrefix('rancho_');
      queryClient.invalidateQueries(['ranchos']);
      queryClient.invalidateQueries(['rancho']);
    },
    invalidatePacotes: () => {
      invalidateCacheByPrefix('pacotes');
      invalidateCacheByPrefix('pacote_');
      queryClient.invalidateQueries(['pacotes']);
      queryClient.invalidateQueries(['pacote']);
    },
    invalidateBlog: () => {
      invalidateCacheByPrefix('blog');
      queryClient.invalidateQueries(['blog-posts']);
      queryClient.invalidateQueries(['blog-post']);
    },
    invalidateAnuncios: () => {
      invalidateCacheByPrefix('anuncios');
      queryClient.invalidateQueries(['anuncios']);
    },
    invalidateAdminStats: () => {
      invalidateCacheByPrefix('faq_estatisticas');
      invalidateCacheByPrefix('rancho_estatisticas');
      queryClient.invalidateQueries(['faq-estatisticas']);
      queryClient.invalidateQueries(['rancho-estatisticas']);
    },
    invalidateDepoimentos: () => {
      invalidateCacheByPrefix('admin_depoimentos');
      queryClient.invalidateQueries(['admin-depoimentos']);
    },
    invalidateAdminBlog: () => {
      invalidateCacheByPrefix('admin_blog_posts');
      queryClient.invalidateQueries(['admin-blog-posts-cached']);
    },
invalidateAdminPacotes: () => {
      invalidateCacheByPrefix('admin_pacotes');
      queryClient.invalidateQueries(['admin-pacotes-cached']);
    },
    invalidateDashboard: () => {
      invalidateCacheByPrefix('dashboard_stats');
      queryClient.invalidateQueries(['dashboard-stats']);
    },
    invalidateAll: () => {
      invalidateCacheByPrefix('');
      queryClient.invalidateQueries();
    },
  };
};
