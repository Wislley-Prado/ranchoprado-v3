import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
import BlogCard from './BlogCard';
import { BookOpen, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBlogPosts, useSiteSettings } from '@/hooks/useOptimizedData';

const BlogSection = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const { data: settings } = useSiteSettings();
  // Fetch recent published posts with cache
  const { data: recentPosts, isLoading } = useBlogPosts(6);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  if (isLoading || !recentPosts || recentPosts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da Seção */}
        {settings?.banner_blog_url ? (
          <div 
            className="relative rounded-2xl overflow-hidden py-12 px-4 text-center text-white mb-12 bg-rio-blue bg-cover bg-center shadow-lg"
            style={{ backgroundImage: `url(${settings.banner_blog_url})` }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <BookOpen className="h-8 w-8 text-sunset-orange" />
                <h2 className="text-3xl font-bold drop-shadow-md">Blog Rancho Prado</h2>
              </div>
              <p className="text-lg opacity-90 max-w-2xl mx-auto drop-shadow-md">
                Fique por dentro das últimas novidades, dicas de pesca e informações sobre o Rio São Francisco
              </p>
              <div className="flex items-center justify-center space-x-1 mt-3 text-sm text-sunset-orange">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Posts mais recentes</span>
              </div>
              
              <div className="md:hidden mt-4 text-xs text-white/70 flex items-center justify-center space-x-2">
                <ChevronLeft className="h-3 w-3 animate-pulse" />
                <span>Deslize para ver mais posts</span>
                <ChevronRight className="h-3 w-3 animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-rio-blue" />
              <h2 className="text-3xl font-bold text-gray-900">Blog Rancho Prado</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fique por dentro das últimas novidades, dicas de pesca e informações sobre o Rio São Francisco
            </p>
            <div className="flex items-center justify-center space-x-1 mt-4 text-sm text-rio-blue">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Posts mais recentes</span>
            </div>
            
            <div className="md:hidden mt-4 text-xs text-gray-500 flex items-center justify-center space-x-2">
              <ChevronLeft className="h-3 w-3 animate-pulse" />
              <span>Deslize para ver mais posts</span>
              <ChevronRight className="h-3 w-3 animate-pulse" />
            </div>
          </div>
        )}

        {/* Carousel de Posts */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {recentPosts.map((post) => (
                <CarouselItem key={post.id} className="pl-2 md:pl-4 basis-4/5 sm:basis-3/5 md:basis-1/2 lg:basis-1/3">
                  <Link to={`/blog/${post.slug}`}>
                    <BlogCard 
                      post={{
                        id: post.id,
                        title: post.titulo,
                        excerpt: post.resumo || '',
                        author: 'Rancho Prado',
                        date: new Date(post.data_publicacao || post.created_at).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }),
                        image: post.imagem_destaque || '/placeholder.svg',
                        category: post.categoria || 'Geral'
                      }}
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Desktop Navigation */}
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
            
            {/* Mobile Navigation Buttons */}
            <CarouselPrevious className="md:hidden left-2 h-8 w-8 bg-white/80 hover:bg-white border shadow-lg" />
            <CarouselNext className="md:hidden right-2 h-8 w-8 bg-white/80 hover:bg-white border shadow-lg" />
          </Carousel>

          {/* Dots Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === current - 1 
                    ? 'bg-rio-blue w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir para post ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA para ver todos os posts */}
        <div className="text-center mt-12">
          <Button asChild size="lg" className="shadow-md hover:shadow-lg">
            <Link to="/blog">
              <BookOpen className="h-5 w-5 mr-2" />
              Ver Todos os Posts
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
