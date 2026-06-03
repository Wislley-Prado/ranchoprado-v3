import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Fish, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Download } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useOptimizedData';
import { usePWALifecycle } from '@/hooks/usePWALifecycle';

const Footer = () => {
  const navigate = useNavigate();
  const { data: settings } = useSiteSettings();
  const location = useLocation();
  const { isInstallable, isInstalled, canInstallNatively, installApp, isIOS } = usePWALifecycle();

  const handleNavClick = (href: string, hash: string) => {
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

  return <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Fish className="h-8 w-8 text-rio-blue" />
              <div>
                <h3 className="text-xl font-bold">Rancho Prado</h3>
                <p className="text-sm text-gray-400">Rio São Francisco</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Sua experiência de pesca no Rio São Francisco começa aqui. 
              Oferecemos os melhores ranchos e pacotes para uma pescaria inesquecível.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleNavClick('/', '')}
                  className="text-gray-300 hover:text-rio-blue transition-colors bg-transparent border-none cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('/', 'ranchos')}
                  className="text-gray-300 hover:text-rio-blue transition-colors bg-transparent border-none cursor-pointer"
                >
                  Ranchos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('/pacotes', '')}
                  className="text-gray-300 hover:text-rio-blue transition-colors bg-transparent border-none cursor-pointer"
                >
                  Pacotes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('/blog', '')}
                  className="text-gray-300 hover:text-rio-blue transition-colors bg-transparent border-none cursor-pointer"
                >
                  Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('/live', '')}
                  className="text-gray-300 hover:text-rio-blue transition-colors bg-transparent border-none cursor-pointer"
                >
                  Transmissão Ao Vivo
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-rio-blue" />
                <span className="text-gray-300">{settings?.telefone_contato || '(38) 98832-0108'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-rio-blue" />
                <span className="text-gray-300">{settings?.email_contato || 'contato@ranchoprado.com.br'}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-rio-blue mt-0.5" />
                <span className="text-gray-300">
                  Rio São Francisco<br />
                  Minas Gerais, Brasil
                </span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Redes Sociais</h4>
            <div className="flex space-x-4">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-rio-blue transition-colors" aria-label="Facebook">
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-rio-blue transition-colors" aria-label="Instagram">
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-rio-blue transition-colors" aria-label="YouTube">
                  <Youtube className="h-6 w-6" />
                </a>
              )}
              {settings?.tiktok_url && (
                <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-rio-blue transition-colors" aria-label="TikTok">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-rio-blue transition-colors" aria-label="X (Twitter)">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {/* Fallback se nenhuma rede estiver configurada */}
              {!settings?.facebook_url && !settings?.instagram_url && !settings?.youtube_url && !settings?.tiktok_url && !settings?.twitter_url && (
                <span className="text-gray-500 text-sm">Nenhuma rede social configurada</span>
              )}
            </div>
            {/* Botão Instalar App - só aparece quando possível */}
            {isInstallable && !isInstalled && canInstallNatively && (
              <button
                onClick={() => installApp()}
                className="mt-4 flex items-center gap-2 text-sm text-gray-300 hover:text-rio-blue transition-colors bg-transparent border border-gray-700 rounded-lg px-4 py-2"
              >
                <Download className="h-4 w-4" />
                Instalar App
              </button>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              {settings?.copyright_text || '© 2026 Rancho Prado. Todos os direitos reservados.'}
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link to="/politica-privacidade" className="text-gray-300 hover:text-rio-blue transition-colors">
                Política de Privacidade
              </Link>
              <a href="#termos" className="text-gray-300 hover:text-rio-blue transition-colors">
                Termos de Uso
              </a>
              <a href="#cookies" className="text-gray-300 hover:text-rio-blue transition-colors" onClick={e => {
              e.preventDefault();
              // Reset cookie consent to show banner again
              localStorage.removeItem('cookie-consent');
              window.location.reload();
            }}>
                Configurar Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;