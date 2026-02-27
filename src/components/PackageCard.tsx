
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Fish, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOptimizedUrl, getOriginalUrl } from '@/lib/imageUtils';

interface Package {
  id: number;
  title: string;
  description: string;
  price: string;
  duration: string;
  people: string;
  rating: number;
  features: string[];
  image: string;
  popular: boolean;
  slug?: string;
}

interface PackageCardProps {
  pkg: Package;
}

const PackageCard = ({ pkg }: PackageCardProps) => {
  const packageRoute = pkg.slug ? `/pacote/${pkg.slug}` : '/pacotes';

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
        pkg.popular 
          ? 'ring-2 ring-sunset-orange shadow-xl scale-105' 
          : 'hover:shadow-lg'
      }`}
    >
      {pkg.popular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-sunset-orange text-white">
            Mais Popular
          </Badge>
        </div>
      )}

      <CardHeader className="p-0">
        <div className="h-48 relative overflow-hidden">
          <img 
            src={getOptimizedUrl(pkg.image, 800)} 
            srcSet={`${getOptimizedUrl(pkg.image, 400)} 400w, ${getOptimizedUrl(pkg.image, 800)} 800w`}
            sizes="(max-width: 768px) 400px, 800px"
            alt={pkg.title}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={400}
            height={192}
            onError={(e) => {
              const original = getOriginalUrl(pkg.image);
              if (e.currentTarget.src !== original) {
                e.currentTarget.src = original;
              } else {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-rio-blue', 'to-water-green');
              }
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center space-x-1 mb-2">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="text-sm font-medium">{pkg.rating}</span>
            </div>
            <CardTitle className="text-2xl font-bold">{pkg.title}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <p className="text-gray-600 mb-4">{pkg.description}</p>

        {/* Package Info */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-3xl font-bold text-rio-blue">{pkg.price}</div>
          <div className="text-right text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {pkg.duration}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {pkg.people}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {pkg.features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <Fish className="h-4 w-4 mr-2 text-water-green" />
              {feature}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button 
          className={`w-full ${
            pkg.popular 
              ? 'bg-sunset-orange hover:bg-orange-600' 
              : 'bg-rio-blue hover:bg-blue-600'
          } text-white`}
          asChild
        >
          <Link to={packageRoute}>
            <Calendar className="mr-2 h-4 w-4" />
            Ver Detalhes
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PackageCard;
