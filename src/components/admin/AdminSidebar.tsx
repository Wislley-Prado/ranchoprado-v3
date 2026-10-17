import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Home, 
  Package, 
  FileText, 
  LogOut,
  Fish,
  Settings,
  Star,
  BarChart3,
  TrendingUp,
  HelpCircle,
  MessageSquare,
  MessageCircle,
  BookOpen,
  Megaphone,
  Video
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Ranchos', href: '/admin/ranchos', icon: Home },
  { name: 'Pacotes', href: '/admin/pacotes', icon: Package },
  { name: 'Anúncios', href: '/admin/anuncios', icon: Megaphone },
  { name: 'Avaliações', href: '/admin/avaliacoes', icon: Star },
  { name: 'Estatísticas', href: '/admin/estatisticas-avaliacoes', icon: TrendingUp },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
  { name: 'Depoimentos', href: '/admin/depoimentos', icon: MessageSquare },
  { name: 'WhatsApp Config', href: '/admin/whatsapp-config', icon: MessageCircle },
  { name: 'WhatsApp Analytics', href: '/admin/whatsapp-analytics', icon: TrendingUp },
  { name: 'Manual', href: '/admin/ajuda', icon: BookOpen },
  { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
  { name: 'Vídeos', href: '/admin/videos', icon: Video },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b">
        <Link to="/admin" className="flex items-center gap-3">
          <img
            src="/logo-rancho-prado.png"
            alt="Rancho Prado"
            className="w-10 h-10 object-contain drop-shadow"
          />
          <div>
            <h1 className="font-bold text-lg text-foreground">Rancho Prado</h1>
            <p className="text-xs text-muted-foreground">Painel Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Logout Button */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={signOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </Button>
      </div>
    </aside>
  );
};
