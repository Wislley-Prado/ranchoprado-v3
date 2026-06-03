import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Eye, Database, Lock, UserCheck, Mail, Calendar, Cookie } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 'coleta',
      title: 'Informações que Coletamos',
      icon: Database,
      content: [
        'Dados pessoais fornecidos voluntariamente (nome, e-mail, telefone)',
        'Informações de navegação e uso do site',
        'Dados de localização quando permitido',
        'Preferências de pesca e interesses relacionados',
        'Histórico de reservas e interações com nossos serviços'
      ]
    },
    {
      id: 'uso',
      title: 'Como Usamos suas Informações',
      icon: Eye,
      content: [
        'Processar reservas e fornecer nossos serviços',
        'Enviar confirmações e atualizações sobre sua reserva',
        'Melhorar nossos serviços e experiência do usuário',
        'Enviar comunicações de marketing (com seu consentimento)',
        'Cumprir obrigações legais e regulamentares',
        'Prevenir fraudes e garantir a segurança da plataforma'
      ]
    },
    {
      id: 'cookies',
      title: 'Política de Cookies',
      icon: Cookie,
      content: [
        'Cookies necessários: Essenciais para o funcionamento do site',
        'Cookies de análise: Para entender como você usa nosso site',
        'Cookies de marketing: Para personalizar anúncios e ofertas',
        'Cookies de personalização: Para lembrar suas preferências',
        'Você pode gerenciar suas preferências de cookies a qualquer momento'
      ]
    },
    {
      id: 'compartilhamento',
      title: 'Compartilhamento de Dados',
      icon: UserCheck,
      content: [
        'Não vendemos suas informações pessoais para terceiros',
        'Compartilhamos dados apenas quando necessário para fornecer nossos serviços',
        'Parceiros de ranchos recebem apenas informações necessárias para sua reserva',
        'Provedores de serviços terceirizados (com contratos de confidencialidade)',
        'Autoridades legais quando exigido por lei'
      ]
    },
    {
      id: 'seguranca',
      title: 'Segurança dos Dados',
      icon: Lock,
      content: [
        'Criptografia SSL/TLS para proteger dados em trânsito',
        'Armazenamento seguro com controle de acesso restrito',
        'Monitoramento contínuo de segurança',
        'Backups regulares e planos de recuperação',
        'Treinamento regular da equipe sobre proteção de dados',
        'Auditorias de segurança periódicas'
      ]
    },
    {
      id: 'direitos',
      title: 'Seus Direitos (LGPD)',
      icon: Shield,
      content: [
        'Direito de acesso aos seus dados pessoais',
        'Direito de correção de dados incorretos ou desatualizados',
        'Direito de eliminação de dados desnecessários',
        'Direito de portabilidade dos dados',
        'Direito de revogar consentimento a qualquer momento',
        'Direito de ser informado sobre uso e compartilhamento',
        'Direito de não consentir e de ser informado sobre as consequências'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-rio-blue text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 text-sand-beige" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Política de Privacidade
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Transparência total sobre como coletamos, usamos e protegemos suas informações pessoais
          </p>
          <div className="mt-6 text-sm text-blue-200">
            <Calendar className="inline h-4 w-4 mr-1" />
            Última atualização: Janeiro de 2024
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            A <strong>Rancho Prado</strong> está comprometida em proteger sua privacidade e dados pessoais. 
            Esta política explica como coletamos, usamos, armazenamos e protegemos suas informações 
            quando você utiliza nossos serviços de reserva de pesca no Rio São Francisco.
          </p>
          <p className="text-muted-foreground">
            Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) 
            e outras regulamentações aplicáveis de proteção de dados.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card key={section.id} className="border-l-4 border-l-rio-blue">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <IconComponent className="h-6 w-6 text-rio-blue" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-rio-blue rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 bg-gray-50 dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Mail className="h-6 w-6 text-rio-blue" />
              Contato e Exercício de Direitos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Para exercer seus direitos de proteção de dados ou esclarecer dúvidas sobre esta política, 
              entre em contato conosco:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Encarregado de Dados (DPO)</h4>
                <p className="text-sm text-muted-foreground">
                  E-mail: privacidade@ranchoprado.com.br<br />
                  Telefone: (38) 99999-9999<br />
                  Horário: Segunda a Sexta, 8h às 18h
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tempo de Resposta</h4>
                <p className="text-sm text-muted-foreground">
                  Solicitações de exercício de direitos: até 15 dias<br />
                  Dúvidas gerais: até 72 horas<br />
                  Incidentes de segurança: imediato
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changes Notice */}
        <Card className="mt-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  Alterações nesta Política
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças 
                  significativas por e-mail ou através de avisos em nosso site. A data da última 
                  atualização está sempre indicada no topo desta página.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;