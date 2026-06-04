import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Users, Star, Sparkles, CheckCircle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useOptimizedData';

interface Pacote {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  duracao: string;
  pessoas: number;
  rating: number;
  tipo: string;
  ativo: boolean;
  popular: boolean;
  destaque: boolean;
  caracteristicas: string[];
  inclusos: string[];
  imagens: {
    url: string;
    principal: boolean;
  }[];
}

const PackagesIndexDynamic = () => {
  const { data: settings } = useSiteSettings();
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacotes = async () => {
      try {
        const { data: pacotesData, error } = await supabase
          .from('pacotes')
          .select('*, pacote_imagens(url, principal)')
          .eq('ativo', true)
          .order('popular', { ascending: false })
          .order('preco', { ascending: true });

        if (error) throw error;

        const pacotesFormatados = pacotesData?.map(p => ({
          ...p,
          imagens: p.pacote_imagens || []
        })) || [];

        setPacotes(pacotesFormatados);
      } catch (error) {
        console.error('Erro ao buscar pacotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPacotes();
  }, []);

  const getMainImage = (pacote: Pacote) => {
    const mainImg = pacote.imagens.find(img => img.principal);
    return mainImg?.url || pacote.imagens[0]?.url || '/placeholder.svg';
  };

  const getTipoIcon = (tipo: string) => {
    return Package;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground bg-cover bg-center overflow-hidden"
        style={{ 
          backgroundImage: settings?.banner_pacotes_url 
            ? `url(${settings.banner_pacotes_url})` 
            : 'none' 
        }}
      >
        <div className={`absolute inset-0 ${settings?.banner_pacotes_url ? 'bg-black/40 backdrop-blur-[1px]' : 'bg-black/10'}`}></div>
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-md">
            Pacotes de Pescaria Personalizados
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-foreground/90 drop-shadow-md">
            Escolha o pacote perfeito para sua aventura no Rio São Francisco
          </p>
        </div>
      </section>

      {/* Pacotes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <Skeleton className="h-64 w-full rounded-t-lg" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : pacotes.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Nenhum pacote disponível</h3>
              <p className="text-muted-foreground">
                Em breve teremos novos pacotes de pescaria disponíveis
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pacotes.map((pacote) => {
                const Icon = getTipoIcon(pacote.tipo);
                
                return (
                  <Card key={pacote.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    {/* Imagem */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={getMainImage(pacote)}
                        alt={pacote.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {pacote.popular && (
                          <Badge className="gap-1">
                            <Sparkles className="h-3 w-3" />
                            Popular
                          </Badge>
                        )}
                        {pacote.destaque && (
                          <Badge variant="secondary">Destaque</Badge>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{pacote.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      {/* Título e Tipo */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <Badge variant="outline" className="capitalize">{pacote.tipo}</Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {pacote.nome}
                        </h3>
                      </div>

                      {/* Descrição */}
                      <p className="text-muted-foreground line-clamp-2">
                        {pacote.descricao}
                      </p>

                      {/* Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {pacote.duracao}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {pacote.pessoas} pessoa{pacote.pessoas > 1 ? 's' : ''}
                        </div>
                      </div>

                      {/* Features Highlight */}
                      {pacote.inclusos.length > 0 && (
                        <div className="space-y-2">
                          {pacote.inclusos.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </div>
                          ))}
                          {pacote.inclusos.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              + {pacote.inclusos.length - 3} itens inclusos
                            </p>
                          )}
                        </div>
                      )}

                      {/* Preço e CTA */}
                      <div className="pt-4 border-t space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">A partir de</p>
                          <p className="text-3xl font-bold text-foreground">
                            R$ {pacote.preco.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">por pessoa</p>
                        </div>

                        <Button asChild className="w-full" size="lg">
                          <Link to={`/pacote/${pacote.slug}`}>
                            Ver Detalhes
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Não encontrou o pacote ideal?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Criamos pacotes personalizados de acordo com suas necessidades e preferências
          </p>
          <Button size="lg" asChild>
            <Link to="/#contato">
              Solicitar Pacote Personalizado
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PackagesIndexDynamic;
