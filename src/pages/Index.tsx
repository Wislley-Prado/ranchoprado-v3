import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import LazySection from '@/components/LazySection';

// Lazy load all below-the-fold sections
const AnunciosSection = React.lazy(() => import('@/components/AnunciosSection').then(m => ({ default: m.AnunciosSection })));
const DamInfo = React.lazy(() => import('@/components/DamInfo'));
const LunarCalendar = React.lazy(() => import('@/components/LunarCalendar'));
const WeatherDashboard = React.lazy(() => import('@/components/WeatherDashboard'));
const RanchosSection = React.lazy(() => import('@/components/RanchosSection'));
const PackagesSection = React.lazy(() => import('@/components/PackagesSection'));
const BlogSection = React.lazy(() => import('@/components/BlogSection'));
const TestimonialsSection = React.lazy(() => import('@/components/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const FAQSection = React.lazy(() => import('@/components/FAQSection').then(m => ({ default: m.FAQSection })));

const SectionSkeleton = () => (
  <div className="py-16 container mx-auto px-4">
    <Skeleton className="h-64 w-full rounded-xl" />
  </div>
);

const Index = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings-og'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings_public')
        .select('og_image_url')
        .limit(1)
        .single();
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });

  const ogImage = (settings as any)?.og_image_url || '/og-image.png';

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>PradoAqui | Rio São Francisco ao Vivo - Pesca em Três Marias/MG</title>
        <meta name="description" content="Sua experiência de pesca no Rio São Francisco começa aqui! Ranchos exclusivos, pacotes personalizados e estrutura completa em Três Marias/MG." />
        <meta property="og:title" content="PradoAqui | Rio São Francisco ao Vivo" />
        <meta property="og:description" content="Sua experiência de pesca no Rio São Francisco começa aqui! Ranchos exclusivos e pacotes personalizados em Três Marias/MG." />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content="https://pradoaqui.com" />
        <meta name="twitter:title" content="PradoAqui | Rio São Francisco ao Vivo" />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <Header />
      <HeroSection />
      
      {/* Anúncios topo - lazy render quando próximo */}
      <LazySection fallback={null} rootMargin="100px">
        <Suspense fallback={null}>
          <AnunciosSection posicao="topo" />
        </Suspense>
      </LazySection>
      
      {/* Dados em tempo real - defer until near viewport */}
      <LazySection fallback={<SectionSkeleton />} rootMargin="300px">
        <Suspense fallback={<SectionSkeleton />}>
          <DamInfo />
        </Suspense>
      </LazySection>

      <LazySection fallback={<SectionSkeleton />} rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <LunarCalendar />
        </Suspense>
      </LazySection>

      <LazySection fallback={<SectionSkeleton />} rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <WeatherDashboard />
        </Suspense>
      </LazySection>
      
      <LazySection fallback={null} rootMargin="200px">
        <Suspense fallback={null}>
          <AnunciosSection posicao="meio" />
        </Suspense>
      </LazySection>
      
      {/* Conteúdo principal - defer */}
      <LazySection fallback={<SectionSkeleton />} rootMargin="300px">
        <Suspense fallback={<SectionSkeleton />}>
          <RanchosSection />
        </Suspense>
      </LazySection>

      <LazySection fallback={<SectionSkeleton />} rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <PackagesSection />
        </Suspense>
      </LazySection>

      <LazySection fallback={<SectionSkeleton />} rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <BlogSection />
        </Suspense>
      </LazySection>
      
      {/* Seções de suporte */}
      <LazySection fallback={null} rootMargin="200px">
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>
      </LazySection>

      <LazySection fallback={null} rootMargin="200px">
        <Suspense fallback={null}>
          <FAQSection />
        </Suspense>
      </LazySection>
      
      <LazySection fallback={null} rootMargin="200px">
        <Suspense fallback={null}>
          <AnunciosSection posicao="rodape" />
        </Suspense>
      </LazySection>

      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Index;
