import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InstallPromptProps {
  onInstall: () => Promise<boolean>;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ onInstall }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);
  const { toast } = useToast();

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await onInstall();
      if (success) {
        toast({
          title: "App Instalado!",
          description: "Rancho Prado foi instalado com sucesso no seu dispositivo.",
        });
        setIsVisible(false);
      } else {
        toast({
          title: "Instalação cancelada",
          description: "A instalação do app foi cancelada.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na instalação",
        description: "Não foi possível instalar o app. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if user dismissed recently (within 7 days)
  React.useEffect(() => {
    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setIsVisible(false);
      }
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:max-w-sm">
      <Card className="bg-primary text-primary-foreground shadow-lg border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Download className="h-5 w-5" />
                <h3 className="font-semibold text-sm">Instalar Rancho Prado</h3>
              </div>
              <p className="text-sm text-primary-foreground/90 mb-3">
                Instale o app para acesso rápido e experiência offline
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  size="sm"
                  variant="secondary"
                  className="text-xs"
                >
                  {isInstalling ? 'Instalando...' : 'Instalar'}
                </Button>
                <Button
                  onClick={handleDismiss}
                  size="sm"
                  variant="ghost"
                  className="text-xs text-primary-foreground/70 hover:text-primary-foreground"
                >
                  Agora não
                </Button>
              </div>
            </div>
            <Button
              onClick={handleDismiss}
              size="sm"
              variant="ghost"
              className="p-1 h-auto text-primary-foreground/70 hover:text-primary-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};