import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2, Fish, Home, Map, Utensils, Wifi, Car, Shield, Play, MapPin, Navigation, Compass, ExternalLink, Copy } from 'lucide-react';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { usePacoteAnalytics, dispararPixel } from '@/hooks/usePacoteAnalytics';
import { PacoteFAQs } from '@/components/PacoteFAQs';
import { PackagePageLayout } from '@/components/packages/PackagePageLayout';
import { PackageHero } from '@/components/packages/PackageHero';
import { PackageQuickInfo } from '@/components/packages/PackageQuickInfo';
import { PackageAbout } from '@/components/packages/PackageAbout';
import { PackageFeatures } from '@/components/packages/PackageFeatures';
import { PackagePricing } from '@/components/packages/PackagePricing';
import { PackageTestimonials } from '@/components/packages/PackageTestimonials';
import { ImageGallery } from '@/components/ImageGallery';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { usePacoteBySlug } from '@/hooks/useOptimizedData';
import { ShareButtons } from '@/components/ShareButtons';
import { SITE_CONFIG } from '@/lib/constants';

const PacoteDetalhes = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Use optimized hook with cache
  const { data: pacoteData, isLoading: loading } = usePacoteBySlug(slug);
  
  // Transform to expected format
  const pacote = useMemo(() => {
    if (!pacoteData) return null;
    return {
      id: pacoteData.id,
      nome: pacoteData.nome,
      slug: pacoteData.slug,
      descricao: pacoteData.descricao,
      preco: pacoteData.preco,
      duracao: pacoteData.duracao,
      pessoas: pacoteData.pessoas,
      rating: pacoteData.rating,
      tipo: pacoteData.tipo || '',
      caracteristicas: pacoteData.caracteristicas,
      inclusos: pacoteData.inclusos,
      ativo: pacoteData.ativo,
      popular: pacoteData.popular,
      destaque: pacoteData.destaque,
      parcelas_quantidade: pacoteData.parcelas_quantidade,
      parcela_valor: pacoteData.parcela_valor,
      desconto_avista: pacoteData.desconto_avista,
      vagas_disponiveis: pacoteData.vagas_disponiveis,
      video_youtube: pacoteData.video_youtube,
      tracking_code: pacoteData.tracking_code,
      telefone_whatsapp: pacoteData.telefone_whatsapp,
      endereco_completo: pacoteData.endereco_completo,
      latitude: pacoteData.latitude,
      longitude: pacoteData.longitude,
      imagens: pacoteData.imagens.map(img => ({
        url: img.url,
        alt_text: img.alt_text || '',
        principal: img.principal,
      })),
    };
  }, [pacoteData]);

  // WhatsApp padrão do site, usado se o pacote não tiver um específico
  const whatsappPadrao = "5538999755886";

  // Hook de analytics - SEMPRE deve ser chamado no nível superior
  usePacoteAnalytics(pacote?.id || '', 'visualizacao');

  // Registra visualização automaticamente quando o pacote for carregado
  useEffect(() => {
    if (pacote?.id) {
      // Disparar pixel personalizado se configurado
      if (pacote.tracking_code) {
        dispararPixel(pacote.tracking_code, 'ViewContent', {
          content_name: pacote.nome,
          content_id: pacote.id,
          content_type: 'product',
          value: pacote.preco,
          currency: 'BRL'
        });
      }
    }
  }, [pacote]);

  // Redirect if pacote not found
  useEffect(() => {
    if (!loading && !pacote) {
      toast.error('Pacote não encontrado');
      navigate('/pacotes');
    }
  }, [loading, pacote, navigate]);


  const handleWhatsAppClick = () => {
    if (pacote) {
      // Disparar pixel personalizado se configurado
      if (pacote.tracking_code) {
        dispararPixel(pacote.tracking_code, 'Contact', {
          content_name: pacote.nome,
          content_id: pacote.id,
          content_type: 'product'
        });
      }
    }

    const telefone = pacote?.telefone_whatsapp || whatsappPadrao;
    const mensagem = `Olá! Gostaria de saber mais informações sobre o pacote "${pacote?.nome}"`;
    const whatsappUrl = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleReservarClick = () => {
    if (pacote) {
      // Disparar pixel personalizado se configurado
      if (pacote.tracking_code) {
        dispararPixel(pacote.tracking_code, 'InitiateCheckout', {
          content_name: pacote.nome,
          content_id: pacote.id,
          content_type: 'product',
          value: pacote.preco,
          currency: 'BRL'
        });
      }
    }
    handleWhatsAppClick();
  };

  // Mapear ícones para features
  const iconMap: Record<string, any> = {
    'pesca': Fish,
    'acomodação': Home,
    'localização': Map,
    'refeições': Utensils,
    'wifi': Wifi,
    'transporte': Car,
    'seguro': Shield,
  };

  const getFeatureIcon = (title: string) => {
    const key = Object.keys(iconMap).find(k => 
      title.toLowerCase().includes(k)
    );
    return iconMap[key] || Fish;
  };

  // Converter características em features
  const features = pacote?.caracteristicas.slice(0, 8).map((carac) => ({
    icon: getFeatureIcon(carac),
    title: carac.split(':')[0] || carac,
    description: carac.split(':')[1]?.trim() || 'Incluso no pacote'
  })) || [];

  // Determinar tier baseado no preço
  const getTier = (): 'vip' | 'luxo' | 'diamante' => {
    if (!pacote) return 'vip';
    if (pacote.preco > 2000) return 'diamante';
    if (pacote.preco > 1500) return 'luxo';
    return 'vip';
  };

  // Imagem principal
  const mainImage = pacote?.imagens.find(img => img.principal)?.url || 
                   pacote?.imagens[0]?.url || 
                   '/placeholder.svg';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pacote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Pacote não encontrado</p>
      </div>
    );
  }

  const tier = getTier();
  const badge = pacote.popular ? 'popular' : pacote.destaque ? 'destaque' : undefined;

  const heroImage = pacote.imagens.find(img => img.principal)?.url || pacote.imagens[0]?.url || '/og-image.png';
  // Always use production domain for sharing URLs
  const pageUrl = `${SITE_CONFIG.PRODUCTION_DOMAIN}/pacote/${pacote.slug}`;

  return (
    <>
      <Helmet>
        <title>{pacote.nome} | Pacote de Pesca - Rancho Prado</title>
        <meta name="description" content={pacote.descricao?.substring(0, 160) || `Pacote ${pacote.nome}. ${pacote.duracao} para ${pacote.pessoas} pessoas.`} />
        <meta property="og:title" content={`${pacote.nome} | Rancho Prado`} />
        <meta property="og:description" content={pacote.descricao?.substring(0, 160) || `Pacote de pesca: ${pacote.duracao}`} />
        <meta property="og:image" content={heroImage} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${pacote.nome} | Rancho Prado`} />
        <meta name="twitter:image" content={heroImage} />
        <link rel="canonical" href={pageUrl} />
      </Helmet>
      
      <Header />
      <PackagePageLayout
        sidebar={
          <PackagePricing
            price={pacote.preco}
            tier={tier}
            installments={pacote.parcela_valor || pacote.parcelas_quantidade ? {
              count: pacote.parcelas_quantidade || 10,
              value: pacote.parcela_valor || (pacote.preco / (pacote.parcelas_quantidade || 10))
            } : undefined}
            discount={pacote.desconto_avista}
            spotsLeft={pacote.vagas_disponiveis}
            onReserveClick={handleReservarClick}
            onWhatsAppClick={handleWhatsAppClick}
          />
        }
      >
        <PackageHero
          title={pacote.nome}
          subtitle={pacote.tipo}
          imageUrl={mainImage}
          rating={pacote.rating}
          reviewsCount={127}
          badge={badge}
          tier={tier}
          onCtaClick={handleReservarClick}
        />

        <PackageQuickInfo
          duration={pacote.duracao}
          people={pacote.pessoas}
          location={pacote.endereco_completo || 'Rio São Francisco'}
          price={`R$ ${pacote.preco.toFixed(2)}`}
        />

        <PackageAbout
          description={pacote.descricao}
          highlights={pacote.caracteristicas?.slice(0, 6)}
        />

        {features.length > 0 && (
          <PackageFeatures features={features} tier={tier} />
        )}

        {/* Galeria Premium */}
        {pacote.imagens.length > 0 && (
          <section className="py-12">
            <div className="container max-w-7xl mx-auto px-4">
              <ImageGallery 
                images={pacote.imagens.map(img => ({
                  url: img.url,
                  alt_text: img.alt_text,
                  principal: img.principal
                }))} 
                title={pacote.nome} 
              />
            </div>
          </section>
        )}

        <Separator className="my-4" />

        {/* Seção de Vídeo Premium */}
        {pacote.video_youtube && (
          <section className="py-12">
            <div className="container max-w-7xl mx-auto px-4">
              {/* Header com ícone gradiente */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25">
                  <Play className="h-6 w-6 text-white fill-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Conheça o Pacote</h2>
                  <p className="text-sm text-muted-foreground">Assista ao vídeo e veja tudo que te espera</p>
                </div>
              </div>
              
              <Card className="overflow-hidden shadow-xl border-0">
                <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium flex items-center gap-2">
                      <Play className="h-4 w-4 fill-white" />
                      Vídeo do Pacote
                    </span>
                    <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
                      🎬 Exclusivo
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-0">
                  <YouTubePlayer videoUrl={pacote.video_youtube} title={pacote.nome} />
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        <Separator className="my-4" />

        {/* Seção de Localização Premium */}
        {pacote.latitude && pacote.longitude && (
          <section className="py-12 bg-muted/30">
            <div className="container max-w-7xl mx-auto px-4">
              {/* Header com ícone gradiente */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Localização</h2>
                  <p className="text-sm text-muted-foreground">Veja como chegar ao local da pescaria</p>
                </div>
              </div>

              {/* Card de Endereço */}
              {pacote.endereco_completo && (
                <Card className="mb-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{pacote.endereco_completo}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            onClick={() => {
                              const mapsUrl = `https://www.google.com/maps?q=${pacote.latitude},${pacote.longitude}`;
                              window.open(mapsUrl, '_blank');
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Abrir no Maps
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            onClick={() => {
                              navigator.clipboard.writeText(pacote.endereco_completo || '');
                              toast.success('Endereço copiado!');
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mapa com Visual Premium */}
              <Card className="overflow-hidden shadow-xl border-0">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium flex items-center gap-2">
                      <Compass className="h-4 w-4" />
                      {Math.abs(pacote.latitude).toFixed(4)}°S, {Math.abs(pacote.longitude).toFixed(4)}°W
                    </span>
                    <Badge className="bg-white/20 text-white border-0 hover:bg-white/30 animate-pulse">
                      📍 Localização exata
                    </Badge>
                  </div>
                </div>
                <div className="relative w-full h-[400px]">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${pacote.longitude}!3d${pacote.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa - ${pacote.nome}`}
                    className="absolute inset-0"
                  />
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Depoimentos */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                O Que Nossos Clientes Dizem
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experiências reais de quem já viveu momentos inesquecíveis
              </p>
            </div>
            <PackageTestimonials 
              pacoteId={pacote.id}
              tipoPacote={pacote.tipo as 'pescaria' | 'completo' | 'personalizado'}
              maxItems={4}
            />
          </div>
        </section>

        {/* Seção de Compartilhamento */}
        <section className="py-8">
          <div className="container max-w-4xl mx-auto px-4">
            <ShareButtons
              titulo={pacote.nome}
              url={pageUrl}
              descricao={`Pacote ${pacote.duracao} para ${pacote.pessoas} pessoas`}
            />
          </div>
        </section>

        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Perguntas Frequentes
            </h2>
            <div className="max-w-3xl mx-auto">
              <PacoteFAQs pacoteId={pacote.id} />
            </div>
          </div>
        </section>
      </PackagePageLayout>
      <Footer />
    </>
  );
};

export default PacoteDetalhes;
