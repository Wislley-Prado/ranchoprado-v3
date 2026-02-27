
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Wifi, Car, Waves, Utensils, Star, Eye } from 'lucide-react';
import { getOptimizedUrl, getOriginalUrl } from '@/lib/imageUtils';

interface Ranch {
  id: string | number;
  name: string;
  slug?: string;
  description: string;
  location: string;
  capacity: number;
  price: number;
  rating: number;
  images: string[];
  amenities: string[];
  available: boolean;
  features: {
    bedrooms: number;
    bathrooms: number;
    area: string;
  };
}

interface RanchCardProps {
  ranch: Ranch;
}

const RanchCard = ({ ranch }: RanchCardProps) => {
  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wi-Fi': <Wifi className="h-4 w-4" />,
    'Estacionamento': <Car className="h-4 w-4" />,
    'Piscina': <Waves className="h-4 w-4" />,
    'Churrasqueira': <Utensils className="h-4 w-4" />,
    'Deck de Pesca': <Waves className="h-4 w-4" />,
    'Ar Condicionado': <Wifi className="h-4 w-4" />,
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative">
          {ranch.images && ranch.images.length > 0 ? (
            <img 
              src={getOptimizedUrl(ranch.images[0], 800)} 
              srcSet={`${getOptimizedUrl(ranch.images[0], 400)} 400w, ${getOptimizedUrl(ranch.images[0], 800)} 800w`}
              sizes="(max-width: 768px) 400px, 800px"
              alt={ranch.name}
              loading="lazy"
              decoding="async"
              width={400}
              height={192}
              className="h-48 w-full object-cover"
              onError={(e) => {
                const original = getOriginalUrl(ranch.images[0]);
                if (e.currentTarget.src !== original) {
                  e.currentTarget.src = original;
                }
              }}
            />
          ) : (
            <div className="h-48 bg-gradient-to-br from-rio-blue to-water-green" />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute top-4 right-4">
            {ranch.available ? (
              <Badge className="bg-green-500 text-white">Disponível</Badge>
            ) : (
              <Badge className="bg-red-500 text-white">Ocupado</Badge>
            )}
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center space-x-1 mb-2">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="text-sm font-medium">{ranch.rating}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{ranch.name}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{ranch.location}</span>
          </div>
          <p className="text-gray-600 text-sm">{ranch.description}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="font-semibold text-gray-900">{ranch.features.bedrooms}</div>
            <div className="text-xs text-gray-600">Quartos</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{ranch.features.bathrooms}</div>
            <div className="text-xs text-gray-600">Banheiros</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{ranch.features.area}</div>
            <div className="text-xs text-gray-600">Área</div>
          </div>
        </div>

        {/* Capacity and Amenities */}
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <Users className="h-4 w-4 mr-2 text-water-green" />
            <span className="text-sm text-gray-600">Até {ranch.capacity} pessoas</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {ranch.amenities.slice(0, 4).map((amenity, index) => (
              <div key={index} className="flex items-center bg-blue-50 px-2 py-1 rounded text-xs text-rio-blue">
                {amenityIcons[amenity] || <Wifi className="h-3 w-3 mr-1" />}
                <span className="ml-1">{amenity}</span>
              </div>
            ))}
            {ranch.amenities.length > 4 && (
              <span className="text-xs text-gray-500">+{ranch.amenities.length - 4} mais</span>
            )}
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-rio-blue">R$ {ranch.price.toFixed(2)}</div>
              <div className="text-xs text-gray-500">por dia</div>
            </div>
          </div>
          {ranch.slug && (
            <Link to={`/rancho/${ranch.slug}`} className="w-full">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={!ranch.available}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RanchCard;
