import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Calendar } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useOptimizedData';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: settings } = useSiteSettings();

  const navItems = [
    { name: 'Início', href: '/', hash: '' },
    { name: 'Ranchos', href: '/', hash: 'ranchos' },
    { name: 'Pacotes', href: '/pacotes', hash: '' },
    { name: 'Blog', href: '/blog', hash: '' },
    { name: 'Transmissão', href: '/live', hash: '' },
    { name: 'Represa', href: '/', hash: 'represa' },
  ];

  const handleNavClick = (href: string, hash: string) => {
    setIsMenuOpen(false);
    
    if (hash) {
      if (location.pathname === '/') {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(hash);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header className="bg-rio-blue shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={(settings as any)?.logo_url || '/logo-rancho-prado.png'}
              alt="Rancho Prado"
              className="h-14 w-14 object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
            />
            <div className="text-white">
              <h1 className="text-2xl font-bold tracking-tight">Rancho Prado</h1>
              <p className="text-xs text-sand-beige font-medium">Rio São Francisco</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href, item.hash)}
                className="text-white hover:text-sand-beige font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              size="sm"
              className="bg-sunset-orange text-premium-graphite font-bold border-none hover:bg-opacity-90 shadow-md transition-all duration-300"
              onClick={() => {
                const link = settings?.reserva_button_link || 'https://wa.me/5538988320108';
                window.open(link, '_blank', 'noopener,noreferrer');
              }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Reservar
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white hover:bg-opacity-10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href, item.hash)}
                  className="text-white hover:text-sand-beige transition-colors duration-200 py-2 bg-transparent border-none cursor-pointer text-left font-medium"
                >
                  {item.name}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Button
                  size="sm"
                  className="bg-sunset-orange text-premium-graphite font-bold border-none hover:bg-opacity-90 shadow-md transition-all duration-300"
                  onClick={() => {
                    const link = settings?.reserva_button_link || 'https://wa.me/5538988320108';
                    window.open(link, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Reservar
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
