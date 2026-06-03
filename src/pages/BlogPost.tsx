import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSiteSettings } from '@/hooks/useOptimizedData';
import { Skeleton } from '@/components/ui/skeleton';
import DOMPurify from 'dompurify';
import { SocialShareButtons } from '@/components/blog/SocialShareButtons';
import { AutoShareButtons } from '@/components/blog/AutoShareButtons';
import { PaidMediaBannerDisplay } from '@/components/blog/PaidMediaBannerDisplay';
import RelatedPosts from '@/components/blog/RelatedPosts';
import RecentPostsCarousel from '@/components/blog/RecentPostsCarousel';
import { SITE_CONFIG } from '@/lib/constants';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: siteSettings } = useSiteSettings();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('publicado', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // View count removed - using Google Analytics for accurate tracking

  // Sanitize HTML content
  const sanitizedContent = React.useMemo(() => {
    if (!post?.conteudo) return '';
    return DOMPurify.sanitize(post.conteudo);
  }, [post?.conteudo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-96 w-full mb-8 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </article>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post não encontrado</h1>
            <p className="text-muted-foreground mb-8">O post que você está procurando não existe.</p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Always use production domain for sharing URLs
  const pageUrl = `${SITE_CONFIG.PRODUCTION_DOMAIN}/blog/${post.slug}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{post.titulo} | Blog Rancho Prado</title>
        <meta name="description" content={post.resumo || post.titulo} />
        <meta property="og:title" content={post.titulo} />
        <meta property="og:description" content={post.resumo || post.titulo} />
        <meta property="og:image" content={post.imagem_destaque || '/og-image.png'} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.titulo} />
        <meta name="twitter:description" content={post.resumo || post.titulo} />
        <meta name="twitter:image" content={post.imagem_destaque || '/og-image.png'} />
        <link rel="canonical" href={pageUrl} />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 bg-background">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Button variant="ghost" asChild>
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Blog
            </Link>
          </Button>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Badge */}
          {post.categoria && (
            <Badge className="mb-4">{post.categoria}</Badge>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.titulo}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time>
                {new Date(post.data_publicacao || post.created_at).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={siteSettings?.autor_avatar_url || undefined} alt="Rancho Prado" />
                <AvatarFallback className="text-xs">RP</AvatarFallback>
              </Avatar>
              <span>Rancho Prado</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.imagem_destaque && (
            <div className="aspect-video mb-8 rounded-lg overflow-hidden">
              <img
                src={post.imagem_destaque}
                alt={post.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          {post.resumo && (
            <div className="bg-muted/50 border-l-4 border-primary p-6 rounded-r-lg mb-8">
              <p className="text-lg leading-relaxed">{post.resumo}</p>
            </div>
          )}

          <Separator className="my-8" />

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Paid Media Banner */}
          <PaidMediaBannerDisplay 
            postId={post.id}
            banner_midia_paga={post.banner_midia_paga as any} 
          />

          {/* Auto Share Buttons - Always visible */}
          <AutoShareButtons 
            postId={post.id}
            titulo={post.titulo}
            url={pageUrl}
            resumo={post.resumo || undefined}
          />

          {/* Manual Social Media Links - Only if configured */}
          {post.redes_sociais && (
            <SocialShareButtons 
              postId={post.id}
              redes_sociais={post.redes_sociais as any} 
            />
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <>
              <Separator className="my-8" />
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </>
          )}

        </article>

        {/* Related Posts Section */}
        <RelatedPosts 
          currentPostId={post.id}
          categoria={post.categoria}
          tags={post.tags}
        />
      </main>

      {/* Recent Posts Carousel */}
      <RecentPostsCarousel currentPostId={post.id} />

      <Footer />
    </div>
  );
};

export default BlogPost;
