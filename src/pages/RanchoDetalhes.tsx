import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ImageGallery } from '@/components/ImageGallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, Users, Bed, Bath, Maximize, Star, 
  Wifi, Car, Waves, Utensils, Wind, Tv, 
  ArrowLeft, MessageCircle, Loader2, CheckCircle,
  Calendar, Play, CalendarDays, Navigation, Compass, ExternalLink, Copy
} from 'lucide-react';
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { useRanchoAnalytics, registrarEvento } from "@/hooks/useRanchoAnalytics";
import { RanchoFAQs } from '@/components/RanchoFAQs';
import { useRanchoBySlug } from '@/hooks/useOptimizedData';
import { ShareButtons } from '@/components/ShareButtons';
import { SITE_CONFIG } from '@/lib/constants';
import { extractYouTubeId } from '@/hooks/useVideoSettings';

const amenityIcons: { [key: string]: React.ReactNode } = {
  'Wi-Fi': <Wifi className="h-5 w-5" />,
  'Estacionamento': <Car className="h-5 w-5" />,
  'Piscina': <Waves className="h-5 w-5" />,
  'Churrasqueira': <Utensils className="h-5 w-5" />,
  'Deck de Pesca': <Waves className="h-5 w-5" />,
  'Ar Condicionado': <Wind className="h-5 w-5" />,
  'TV a Cabo': <Tv className="h-5 w-5" />,
  'Cozinha Completa': <Utensils className="h-5 w-5" />,
};

const RanchoDetalhes = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Use optimized hook with cache
  const { data: ranchoData, isLoading: loading } = useRanchoBySlug(slug);
  
  // Transform to expected format
  const rancho = React.useMemo(() => {
    if (!ranchoData) return null;
    return {
      id: ranchoData.id,
      nome: ranchoData.nome,
      descricao: ranchoData.descricao,
      localizacao: ranchoData.localizacao,
      capacidade: ranchoData.capacidade,
      preco: ranchoData.preco,
      rating: ranchoData.rating,
      quartos: ranchoData.quartos,
      banheiros: ranchoData.banheiros,
      area: ranchoData.area || 0,
      comodidades: ranchoData.comodidades,
      disponivel: ranchoData.disponivel,
      telefone_whatsapp: ranchoData.telefone_whatsapp,
      mensagem_whatsapp: ranchoData.mensagem_whatsapp,
      video_youtube: ranchoData.video_youtube,
      google_calendar_url: ranchoData.google_calendar_url,
      tracking_code: ranchoData.tracking_code,
      latitude: ranchoData.latitude,
      longitude: ranchoData.longitude,
      endereco_completo: ranchoData.endereco_completo,
      imagens: ranchoData.imagens.map(img => ({
        url: img.url,
        alt_text: img.alt_text || '',
        principal: img.principal,
      })),
    };
  }, [ranchoData]);

  const whatsappNumber = rancho?.telefone_whatsapp || "5531999999999";

  // Redirect if rancho not found
  useEffect(() => {
    if (!loading && !rancho) {
      navigate('/');
    }
  }, [loading, rancho, navigate]);

  // Registrar visualização da página
  useRanchoAnalytics(rancho?.id || "", "visualizacao");

  // Injetar tracking code específico do rancho (sanitizado)
  useEffect(() => {
    if (rancho?.tracking_code) {
      const trackingDiv = document.createElement('div');
      // Sanitize HTML to prevent XSS attacks
      const sanitizedHTML = DOMPurify.sanitize(rancho.tracking_code, {
        ADD_TAGS: ['script', 'style', 'link'],
        ADD_ATTR: ['src', 'href', 'rel', 'type', 'async', 'defer'],
        ALLOW_DATA_ATTR: false
      });
      trackingDiv.innerHTML = sanitizedHTML;
      
      Array.from(trackingDiv.children).forEach((element) => {
        const clonedElement = element.cloneNode(true) as HTMLElement;
        
        if (clonedElement.tagName === 'SCRIPT') {
          const script = document.createElement('script');
          if ((element as HTMLScriptElement).src) {
            script.src = (element as HTMLScriptElement).src;
            script.async = true;
          } else {
            script.innerHTML = element.innerHTML;
          }
          document.head.appendChild(script);
        } else {
          document.head.appendChild(clonedElement);
        }
      });
    }
  }, [rancho]);

  const handleWhatsAppReserva = () => {
    if (!rancho) return;
    
    // Registrar clique no WhatsApp
    registrarEvento(rancho.id, "clique_whatsapp");
    
    const phone = rancho.telefone_whatsapp || "5531999999999";
    
    // Usar mensagem personalizada se existir, senão usa padrão
    let message: string;
    if (rancho.mensagem_whatsapp) {
      message = rancho.mensagem_whatsapp
        .replace(/{nome}/g, rancho.nome)
        .replace(/{localizacao}/g, rancho.localizacao);
    } else {
      message = `Olá! Gostaria de fazer uma reserva no ${rancho.nome} (${rancho.localizacao}). Pode me passar mais informações sobre disponibilidade e valores?`;
    }
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!rancho) {
    return null;
  }

  const mainImage = rancho.imagens.find(img => img.principal)?.url || rancho.imagens[0]?.url || '/og-image.png';
  // Always use production domain for sharing URLs
  const pageUrl = `${SITE_CONFIG.PRODUCTION_DOMAIN}/rancho/${slug}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{rancho.nome} | Rancho em {rancho.localizacao} - Rancho Prado</title>
        <meta name="description" content={rancho.descricao?.substring(0, 160) || `Rancho ${rancho.nome} em ${rancho.localizacao}. Capacidade para ${rancho.capacidade} pessoas.`} />
        <meta property="og:title" content={`${rancho.nome} | Rancho Prado`} />
        <meta property="og:description" content={rancho.descricao?.substring(0, 160) || `Rancho para pesca em ${rancho.localizacao}`} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${rancho.nome} | Rancho Prado`} />
        <meta name="twitter:image" content={mainImage} />
        <link rel="canonical" href={pageUrl} />
      </Helmet>
      
      <Header />
      
      <main className="pt-20">
        {/* Breadcrumb & Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Ranchos
          </Button>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <ImageGallery images={rancho.imagens} title={rancho.nome} />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Location */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                    {rancho.nome}
                  </h1>
                  {rancho.disponivel && (
                    <Badge className="bg-green-500 text-white">Disponível</Badge>
                  )}
                </div>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{rancho.localizacao}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{rancho.rating}</span>
                  <span className="text-muted-foreground">• Avaliação</span>
                </div>
              </div>

              <Separator />

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-xl">{rancho.capacidade}</div>
                    <div className="text-sm text-muted-foreground">Pessoas</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <Bed className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-xl">{rancho.quartos}</div>
                    <div className="text-sm text-muted-foreground">Quartos</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <Bath className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-xl">{rancho.banheiros}</div>
                    <div className="text-sm text-muted-foreground">Banheiros</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <Maximize className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-xl">{rancho.area}m²</div>
                    <div className="text-sm text-muted-foreground">Área</div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Sobre o Rancho</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {rancho.descricao}
                </p>
              </div>

              <Separator />

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Comodidades</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {rancho.comodidades.map((comodidade, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <div className="text-primary">
                        {amenityIcons[comodidade] || <CheckCircle className="h-5 w-5" />}
                      </div>
                      <span className="text-sm font-medium">{comodidade}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* YouTube Video */}
              {rancho.video_youtube && (
                <>
                  <Separator />
                  <div id="video-section">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Conheça o Rancho</h2>
                        <p className="text-sm text-muted-foreground">Assista ao vídeo e conheça cada detalhe</p>
                      </div>
                    </div>
                    {getYouTubeEmbedUrl(rancho.video_youtube) ? (
                      <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-b from-muted/50 to-background">
                        <CardContent className="p-4 md:p-6">
                          <div className="relative w-full max-w-lg mx-auto rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                            <div className="bg-gradient-to-b from-black to-zinc-900" style={{ paddingBottom: '177.78%' }}>
                              <iframe
                                src={getYouTubeEmbedUrl(rancho.video_youtube) || ''}
                                className="absolute top-0 left-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                title={`Vídeo ${rancho.nome}`}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="border-dashed">
                        <CardContent className="py-8 text-center">
                          <Play className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                          <p className="text-muted-foreground">URL do vídeo inválida. Verifique o formato.</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </>
              )}

              {/* Google Maps Location */}
              {rancho.latitude && rancho.longitude && (
                <>
                  <Separator />
                  <div id="map-section">
                    {/* Header com ícone */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Localização</h2>
                        <p className="text-sm text-muted-foreground">Veja como chegar ao rancho</p>
                      </div>
                    </div>

                    {/* Card de Endereço */}
                    {rancho.endereco_completo && (
                      <Card className="mb-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{rancho.endereco_completo}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-950/50"
                                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${rancho.latitude},${rancho.longitude}`, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Abrir no Maps
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="text-muted-foreground hover:text-foreground"
                                  onClick={() => {
                                    navigator.clipboard.writeText(rancho.endereco_completo || '');
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
                    <Card className="overflow-hidden shadow-xl border-0 rounded-2xl">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-white text-sm font-medium flex items-center gap-2">
                            <Compass className="h-4 w-4" />
                            {Math.abs(rancho.latitude).toFixed(4)}°S, {Math.abs(rancho.longitude).toFixed(4)}°W
                          </span>
                          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                            <span className="relative flex h-2 w-2 mr-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            Localização exata
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-0">
                        <div className="relative w-full h-[400px] bg-muted">
                          <iframe
                            src={`https://www.google.com/maps?q=${rancho.latitude},${rancho.longitude}&hl=pt-BR&z=14&output=embed`}
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Mapa ${rancho.nome}`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* Google Calendar Availability */}
              {rancho.google_calendar_url && (
                <>
                  <Separator />
                  <div id="calendar-section">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                        <CalendarDays className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Disponibilidade</h2>
                        <p className="text-sm text-muted-foreground">Confira as datas disponíveis para reserva</p>
                      </div>
                    </div>
                    <Card className="overflow-hidden shadow-2xl border border-border/50 rounded-2xl">
                      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-5">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Calendário de Reservas
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                              <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                              </span>
                              Tempo real
                            </Badge>
                          </div>
                        </div>
                        <p className="text-white/80 text-sm mt-2">
                          Datas marcadas indicam reservas confirmadas
                        </p>
                      </div>
                      <CardContent className="p-0">
                        {/* Container com overflow hidden para esconder o rodapé do Google Calendar */}
                        <div className="relative w-full h-[550px] overflow-hidden bg-background">
                          <iframe
                            src={`${rancho.google_calendar_url}&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=MONTH&wkst=1&bgcolor=%23ffffff&ctz=America/Sao_Paulo`}
                            className="w-full border-0"
                            style={{ height: '620px', marginBottom: '-70px' }}
                            frameBorder="0"
                            scrolling="no"
                            title={`Calendário de disponibilidade ${rancho.nome}`}
                          />
                        </div>
                      </CardContent>
                      {/* Legenda de cores */}
                      <div className="bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 px-5 py-4 border-t border-border/50">
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-[#4285f4] shadow-sm"></div>
                            <span className="text-sm text-foreground font-medium">Reservado</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-white border border-gray-300 shadow-sm"></div>
                            <span className="text-sm text-foreground font-medium">Disponível</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-foreground">
                      R$ {rancho.preco.toFixed(2)}
                    </div>
                    <div className="text-muted-foreground">por dia</div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Inclui:</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>Acomodação para até {rancho.capacidade} pessoas</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>{rancho.quartos} quartos e {rancho.banheiros} banheiros</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>Todas as comodidades listadas</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <Button 
                    onClick={handleWhatsAppReserva}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Reservar via WhatsApp
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Entre em contato para consultar disponibilidade e confirmar sua reserva
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Seção de Avaliações */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Avaliações dos Hóspedes</h2>
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reviews">Ver Avaliações</TabsTrigger>
                <TabsTrigger value="new">Deixar Avaliação</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews" className="mt-6">
                <ReviewsList ranchoId={rancho.id} />
              </TabsContent>
              <TabsContent value="new" className="mt-6">
                <ReviewForm ranchoId={rancho.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Seção de Compartilhamento */}
      {rancho && (
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <ShareButtons
              titulo={rancho.nome}
              url={pageUrl}
              descricao={`Rancho em ${rancho.localizacao} para ${rancho.capacidade} pessoas`}
            />
          </div>
        </section>
      )}

      {/* Seção de FAQs */}
      {rancho && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
                <RanchoFAQs ranchoId={rancho.id} />
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default RanchoDetalhes;
