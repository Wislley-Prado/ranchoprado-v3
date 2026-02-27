import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Star, Clock, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { getOptimizedUrl, getOriginalUrl } from '@/lib/imageUtils';

interface FeaturedPackage {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  people: string;
  rating: number;
  image: string;
  badge: string;
  badgeColor: string;
  popular: boolean;
  destaque: boolean;
}

interface FeaturedPackagesCarouselProps {
  packages: FeaturedPackage[];
}

const FeaturedPackagesCarousel = ({ packages }: FeaturedPackagesCarouselProps) => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  // Filtrar apenas pacotes populares ou em destaque
  const featuredPackages = packages.filter(pkg => pkg.popular || pkg.destaque);

  if (featuredPackages.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 via-white to-sky-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sunset-orange to-yellow-500 text-white px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold">Pacotes em Destaque</span>
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Ofertas Especiais
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conheça nossos pacotes mais procurados e exclusivos para uma experiência inesquecível
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full max-w-6xl mx-auto"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {featuredPackages.map((pkg) => (
              <CarouselItem key={pkg.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 h-full">
                    {/* Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className={`${pkg.badgeColor} text-white shadow-lg`}>
                        {pkg.badge}
                      </Badge>
                    </div>

                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={getOptimizedUrl(pkg.image, 800)}
                        srcSet={`${getOptimizedUrl(pkg.image, 400)} 400w, ${getOptimizedUrl(pkg.image, 800)} 800w`}
                        sizes="(max-width: 768px) 400px, 800px"
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const original = getOriginalUrl(pkg.image);
                          if (e.currentTarget.src !== original) {
                            e.currentTarget.src = original;
                          } else {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.classList.add(
                              'bg-gradient-to-br',
                              'from-rio-blue',
                              'to-water-green'
                            );
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-gray-900">{pkg.rating}</span>
                        </div>
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                          {pkg.title}
                        </h3>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {pkg.description}
                      </p>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-rio-blue" />
                          <span>{pkg.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4 text-rio-blue" />
                          <span>{pkg.people}</span>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">A partir de</p>
                          <p className="text-2xl font-bold text-rio-blue">{pkg.price}</p>
                        </div>
                        <Button
                          size="sm"
                          className={`${
                            pkg.destaque
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                              : pkg.popular
                              ? 'bg-sunset-orange hover:bg-orange-600'
                              : 'bg-rio-blue hover:bg-blue-700'
                          } text-white shadow-lg`}
                          asChild
                        >
                          <Link to={`/pacote/${pkg.slug}`}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Ver Mais
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {/* Indicator Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {featuredPackages.map((_, index) => (
            <div
              key={index}
              className="h-2 w-2 rounded-full bg-gray-300 transition-colors"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackagesCarousel;
