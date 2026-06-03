
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, X, Phone, Clock } from 'lucide-react';
import { registrarEventoWhatsApp } from '@/hooks/useWhatsAppAnalytics';
import { useSiteSettings } from '@/hooks/useOptimizedData';

interface QuickMessage {
  text: string;
  message: string;
}

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: siteSettings } = useSiteSettings();

  // Cast to any to access raw Supabase field names which differ from SiteSettings interface
  const raw = siteSettings as any;
  const settings = {
    whatsapp_numero: raw?.whatsapp_numero || "5531999999999",
    whatsapp_titulo: raw?.whatsapp_titulo || "Rancho Prado - Atendimento",
    whatsapp_mensagem_padrao: raw?.whatsapp_mensagem_padrao || "Olá! Gostaria de saber mais sobre os pacotes de pesca no Rancho Prado.",
    whatsapp_saudacao: raw?.whatsapp_saudacao || "👋 Olá! Como podemos ajudar você hoje?",
    whatsapp_instrucao: raw?.whatsapp_instrucao || "Escolha uma opção abaixo ou digite sua mensagem:",
    whatsapp_horario: raw?.whatsapp_horario || "Seg-Dom: 6h às 22h",
    whatsapp_opcoes: (raw?.whatsapp_opcoes || [
      { text: "Quero fazer uma reserva", message: "Olá! Gostaria de fazer uma reserva para pesca no Rio São Francisco." },
      { text: "Consultar disponibilidade", message: "Oi! Podem me informar a disponibilidade para os próximos finais de semana?" },
      { text: "Informações sobre pacotes", message: "Olá! Gostaria de saber mais detalhes sobre os pacotes de pesca disponíveis." },
      { text: "Condições atuais do rio", message: "Oi! Como estão as condições de pesca no rio hoje?" }
    ]) as QuickMessage[],
  };

  const handleWhatsAppClick = () => {
    registrarEventoWhatsApp("botao_whatsapp");
    const url = `https://wa.me/${settings.whatsapp_numero}?text=${encodeURIComponent(settings.whatsapp_mensagem_padrao)}`;
    window.open(url, '_blank');
  };

  const handleQuickMessage = (msg: string, index: number) => {
    registrarEventoWhatsApp("mensagem_rapida", settings.whatsapp_opcoes[index].text);
    const url = `https://wa.me/${settings.whatsapp_numero}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const handleToggleWidget = () => {
    if (!isOpen) {
      registrarEventoWhatsApp("widget_aberto");
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 animate-fade-in">
          <Card className="w-80 shadow-2xl border-2 border-green-500">
            <div className="bg-green-500 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{settings.whatsapp_titulo}</h3>
                    <div className="flex items-center space-x-1 text-green-100 text-xs">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <span>Online agora</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                <p className="text-gray-700 mb-2">
                  {settings.whatsapp_saudacao}
                </p>
                <p className="text-xs text-gray-500">
                  {settings.whatsapp_instrucao}
                </p>
              </div>

              <div className="space-y-2">
                {settings.whatsapp_opcoes.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-3 hover:bg-green-50 hover:border-green-300"
                    onClick={() => handleQuickMessage(item.message, index)}
                  >
                    <span className="text-sm">{item.text}</span>
                  </Button>
                ))}
              </div>

              <div className="border-t pt-3">
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Abrir WhatsApp
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{settings.whatsapp_horario}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-3 w-3" />
                  <span>Resposta rápida</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleToggleWidget}
          size="lg"
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl animate-float"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
        
        {/* Notification Badge */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">1</span>
          </div>
        )}
      </div>
    </>
  );
};

export default WhatsAppButton;
