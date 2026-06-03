import { 
  BookOpen, 
  Home, 
  Package, 
  Star, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  HelpCircle, 
  MessageSquare,
  MessageCircle,
  Settings,
  Search,
  Calendar,
  Image,
  Eye,
  MousePointer,
  Filter,
  Upload,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  ExternalLink,
  Download,
  ShieldAlert,
  Building2,
  MapPin,
  Share2,
  Moon,
  Waves,
  Cloud,
  Fish,
  Globe,
  Camera,
  Play,
  Users,
  DollarSign,
  CreditCard,
  Clock,
  Smartphone,
  Monitor,
  Mail,
  Youtube,
  Instagram,
  Facebook,
  Bell,
  Zap,
  RefreshCw,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Ajuda = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    // ===== SEÇÃO: VISÃO GERAL DO SITE =====
    {
      id: 'visao-geral',
      icon: Globe,
      title: 'Visão Geral do Rancho Prado',
      color: 'text-blue-600',
      category: 'Sobre o Sistema',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            O Rancho Prado é uma plataforma completa de turismo de pesca esportiva no Rio São Francisco, 
            região de Três Marias/MG, oferecendo ranchos para hospedagem, pacotes de pescaria e 
            informações em tempo real para pescadores.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold">🎯 Objetivo do Site:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Facilitar reservas de hospedagem em ranchos de pesca</li>
              <li>Vender pacotes de pescaria com guias especializados</li>
              <li>Fornecer informações úteis para pescadores (clima, represa, lua)</li>
              <li>Criar conteúdo educativo através do blog</li>
              <li>Gerar leads qualificados via WhatsApp</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">📱 Páginas Públicas Disponíveis:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Home (/):</strong> Página principal com todas as seções</li>
              <li><strong>Ranchos (/rancho/[slug]):</strong> Detalhes de cada rancho</li>
              <li><strong>Pacotes (/pacotes):</strong> Lista de todos os pacotes</li>
              <li><strong>Pacote (/pacote/[slug]):</strong> Detalhes de cada pacote</li>
              <li><strong>Blog (/blog):</strong> Lista de artigos</li>
              <li><strong>Post (/blog/[slug]):</strong> Artigo individual</li>
              <li><strong>Live (/live):</strong> Transmissão ao vivo do rio</li>
              <li><strong>Galeria (/galeria):</strong> Fotos e vídeos</li>
              <li><strong>Privacidade (/privacidade):</strong> Política de privacidade</li>
              <li><strong>Termos (/termos):</strong> Termos de uso</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">🔧 Tecnologias Utilizadas:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Frontend:</strong> React + TypeScript + Tailwind CSS</li>
              <li><strong>Backend:</strong> Supabase (PostgreSQL + Edge Functions)</li>
              <li><strong>Hospedagem:</strong> Hostinger (domínio ranchoprado.com.br)</li>
              <li><strong>Analytics:</strong> Google Analytics + Facebook Pixel</li>
              <li><strong>PWA:</strong> Funciona como aplicativo instalável</li>
            </ul>
          </div>

          <Badge variant="secondary">Plataforma Completa de Turismo de Pesca</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: DASHBOARD =====
    {
      id: 'dashboard',
      icon: BarChart3,
      title: 'Dashboard',
      color: 'text-blue-500',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            O Dashboard é sua central de controle, mostrando estatísticas em tempo real do sistema.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold">📊 Estatísticas Exibidas:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Ranchos:</strong> Total cadastrados / Disponíveis para reserva</li>
              <li><strong>Pacotes:</strong> Total cadastrados / Ativos para venda</li>
              <li><strong>Blog:</strong> Total de posts / Publicados</li>
              <li><strong>Depoimentos:</strong> Total cadastrados / Ativos</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">⚡ Ações Rápidas:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Novo Rancho:</strong> Cadastrar propriedade para hospedagem</li>
              <li><strong>Novo Pacote:</strong> Criar pacote de pescaria</li>
              <li><strong>Novo Post:</strong> Escrever artigo para o blog</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Atualização de Dados:
            </h4>
            <p className="text-sm text-muted-foreground">
              Os dados são cacheados por 1 hora para melhor performance. Use o botão 
              "Atualizar" no canto superior direito para forçar atualização imediata.
            </p>
          </div>
          <Badge variant="secondary">Ponto de partida para navegação rápida</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: RANCHOS =====
    {
      id: 'ranchos',
      icon: Home,
      title: 'Ranchos',
      color: 'text-green-500',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Gerencie todas as propriedades de hospedagem disponíveis para pescaria no Rio São Francisco.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" /> Como Criar um Rancho:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Clique em "Novo Rancho"</li>
              <li>Preencha a aba <strong>Básico</strong>:
                <ul className="list-disc list-inside ml-4">
                  <li>Nome do rancho (obrigatório)</li>
                  <li>Slug será gerado automaticamente da URL</li>
                  <li>Localização (ex: "Rio São Francisco, Prado - MG")</li>
                  <li>Descrição detalhada da propriedade</li>
                  <li>Preço por diária e avaliação (1-5 estrelas)</li>
                  <li>Número de WhatsApp específico (opcional)</li>
                </ul>
              </li>
              <li>Configure a aba <strong>Estrutura</strong>:
                <ul className="list-disc list-inside ml-4">
                  <li>Capacidade (número de hóspedes)</li>
                  <li>Quantidade de quartos e banheiros</li>
                  <li>Área total da propriedade</li>
                </ul>
              </li>
              <li>Selecione <strong>Comodidades</strong>:
                <ul className="list-disc list-inside ml-4">
                  <li>Wi-Fi, Ar-condicionado, Piscina, Churrasqueira</li>
                  <li>Barco, Motor, Caiaque, Equipamentos de pesca</li>
                  <li>Adicione comodidades personalizadas</li>
                </ul>
              </li>
              <li>Configure a aba <strong>Mídia</strong>:
                <ul className="list-disc list-inside ml-4">
                  <li>Link do YouTube para vídeo (opcional)</li>
                  <li>Link do Google Calendar para disponibilidade</li>
                  <li>Código de tracking específico (opcional)</li>
                </ul>
              </li>
              <li>Faça upload de <strong>Imagens</strong>:
                <ul className="list-disc list-inside ml-4">
                  <li>Mínimo 1 imagem, recomendado 5-10</li>
                  <li>Marque qual é a imagem principal (capa)</li>
                  <li>Imagens são otimizadas automaticamente</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filtros e Gerenciamento:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Busca:</strong> Pesquisar por nome do rancho</li>
              <li><strong>Disponibilidade:</strong> Filtrar disponíveis/indisponíveis</li>
              <li><strong>Destaque:</strong> Ver apenas ranchos em destaque na home</li>
              <li><strong>Switch Ativar/Desativar:</strong> Ocultar rancho sem excluir</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Localização no Mapa:
            </h4>
            <p className="text-sm text-muted-foreground">
              Configure latitude e longitude para exibir o rancho no Google Maps. 
              A página do rancho mostrará mapa interativo e botão "Como Chegar" para navegação.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Google Calendar:
            </h4>
            <p className="text-sm text-muted-foreground">
              Incorpore um Google Calendar público para mostrar disponibilidade em tempo real. 
              Os visitantes podem ver datas ocupadas/livres diretamente na página do rancho.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4" /> Analytics por Rancho:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Visualizações totais da página do rancho</li>
              <li>Cliques no botão de WhatsApp</li>
              <li>Cliques em "Reservar Agora"</li>
              <li>Taxa de conversão (interesse/visualizações)</li>
            </ul>
          </div>

          <Badge variant="secondary">Funcionalidade Principal do Sistema</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: PACOTES =====
    {
      id: 'pacotes',
      icon: Package,
      title: 'Pacotes',
      color: 'text-purple-500',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Crie e gerencie pacotes de pescaria com diferentes níveis de serviço, preços e benefícios.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" /> Criar Novo Pacote:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Clique em "Novo Pacote"</li>
              <li>Preencha a aba <strong>Básico</strong>:
                <ul className="list-disc list-inside ml-4">
                  <li>Nome e slug (URL)</li>
                  <li>Tipo (VIP, Luxo, Diamante, Personalizado)</li>
                  <li>Descrição completa do pacote</li>
                  <li>Marcar como Popular ou Destaque</li>
                </ul>
              </li>
              <li>Configure a aba <strong>Detalhes</strong>:
                <ul className="list-disc list-inside ml-4">
                  <li>Preço total do pacote</li>
                  <li>Configuração de parcelamento (até 12x)</li>
                  <li>Desconto à vista (0-20%)</li>
                  <li>Duração (dias/noites)</li>
                  <li>Número de pessoas incluídas</li>
                  <li>Vagas disponíveis (cria urgência)</li>
                  <li>Lista de inclusos (guia, alimentação, etc.)</li>
                  <li>Características especiais</li>
                </ul>
              </li>
              <li>Faça upload de <strong>Imagens</strong> atrativas</li>
              <li>Configure <strong>Tracking</strong> específico (opcional)</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Sistema de Preços:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Preço Total:</strong> Valor completo do pacote</li>
              <li><strong>Parcelamento:</strong> Exibe "10x de R$ XX" nos cards</li>
              <li><strong>Desconto à Vista:</strong> Mostra preço com desconto aplicado</li>
              <li><strong>Vagas Limitadas:</strong> Badge de urgência quando poucas vagas</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Analytics de Pacotes:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Ver total de visualizações por pacote</li>
              <li>Cliques em botões de ação (WhatsApp, Reservar)</li>
              <li>Taxa de conversão individual</li>
              <li>Comparar performance entre pacotes</li>
            </ul>
          </div>

          <Badge variant="secondary">Produtos Principais do Negócio</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: AVALIAÇÕES =====
    {
      id: 'avaliacoes',
      icon: Star,
      title: 'Avaliações',
      color: 'text-yellow-500',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Modere e responda avaliações de clientes sobre os ranchos. As avaliações incluem 
            texto, nota (1-5 estrelas) e até 5 fotos anexadas.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Como Moderar:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Acesse a aba "Avaliações"</li>
              <li>Filtre por status: Pendente, Aprovada, Reprovada</li>
              <li>Filtre por rancho específico ou nota</li>
              <li>Leia o comentário e verifique as fotos anexadas</li>
              <li>Aprove avaliações legítimas clicando no botão verde</li>
              <li>Reprove spam ou conteúdo inapropriado</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Camera className="w-4 h-4" /> Fotos nas Avaliações:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Clientes podem enviar até 5 fotos por avaliação</li>
              <li>Fotos aparecem em galeria na página do rancho</li>
              <li>Excelente para prova social e credibilidade</li>
              <li>Verifique se as imagens são apropriadas antes de aprovar</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Estados de Avaliação:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Pendente:</strong> Aguardando aprovação do admin</li>
              <li><strong>Aprovada:</strong> Visível no site para visitantes</li>
              <li><strong>Reprovada:</strong> Oculta, não aparece publicamente</li>
            </ul>
          </div>

          <Badge variant="secondary">Gerenciamento de Reputação</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: ESTATÍSTICAS AVALIAÇÕES =====
    {
      id: 'estatisticas',
      icon: TrendingUp,
      title: 'Estatísticas de Avaliações',
      color: 'text-orange-500',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Visualize métricas consolidadas de satisfação dos clientes por rancho e geral.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold">📊 Métricas Disponíveis:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Média Geral:</strong> Nota média de todas as avaliações (1-5 estrelas)</li>
              <li><strong>Total de Avaliações:</strong> Quantidade total de reviews recebidas</li>
              <li><strong>Distribuição de Notas:</strong> Quantas avaliações de cada estrela</li>
              <li><strong>Por Rancho:</strong> Ranking de satisfação por propriedade</li>
              <li><strong>Taxa de Aprovação:</strong> Percentual de avaliações aprovadas</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">💡 Como Usar:</h4>
            <p className="text-sm text-muted-foreground">
              Use essas métricas para identificar ranchos com melhor performance e aqueles 
              que precisam de melhorias. Avaliações baixas indicam oportunidades de aprimoramento.
            </p>
          </div>
          <Badge variant="secondary">Indicadores de Qualidade</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: ANALYTICS RANCHOS =====
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytics (Ranchos)',
      color: 'text-cyan-500',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Análise detalhada de performance e engajamento dos ranchos com gráficos e tabelas.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold">📈 Métricas Principais:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Visualizações:</strong> Quantas vezes a página foi acessada</li>
              <li><strong>Cliques WhatsApp:</strong> Interesse direto em contato</li>
              <li><strong>Cliques Reserva:</strong> Intenção de reservar</li>
              <li><strong>Taxa de Conversão:</strong> (Cliques / Visualizações) × 100</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Gráficos e Tabelas:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Gráfico de linha: evolução temporal das visualizações</li>
              <li>Tabela comparativa: todos os ranchos lado a lado</li>
              <li>Ranking: ranchos mais visualizados</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">🎯 Interpretação:</h4>
            <p className="text-sm text-muted-foreground">
              <strong>Alta visualização + Baixa conversão:</strong> Melhorar fotos ou descrição<br />
              <strong>Baixa visualização:</strong> Melhorar SEO ou destacar na home<br />
              <strong>Alta conversão:</strong> Rancho está otimizado
            </p>
          </div>
          <Badge variant="secondary">Tomada de Decisão Baseada em Dados</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: BLOG =====
    {
      id: 'blog',
      icon: FileText,
      title: 'Blog',
      color: 'text-indigo-500',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Crie conteúdo educativo sobre pesca para atrair visitantes através do blog e melhorar SEO.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" /> Criar Novo Post:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Clique em "Novo Post"</li>
              <li>Defina título atrativo e slug (URL amigável para SEO)</li>
              <li>Escreva resumo curto (aparece nas listagens)</li>
              <li>Use o editor de texto rico com formatação:
                <ul className="list-disc list-inside ml-4">
                  <li>Negrito, itálico, sublinhado</li>
                  <li>Títulos (H1, H2, H3)</li>
                  <li>Listas numeradas e com marcadores</li>
                  <li>Links e imagens</li>
                  <li>Citações e código</li>
                </ul>
              </li>
              <li>Escolha categoria (Dicas, Notícias, Tutoriais)</li>
              <li>Adicione tags para facilitar busca</li>
              <li>Upload de imagem de destaque (capa)</li>
              <li>Configure data de publicação ou agende</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Compartilhamento Automático:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Botões de compartilhamento em cada post</li>
              <li>Facebook, WhatsApp, Twitter/X, LinkedIn</li>
              <li>Instagram: copia link para o usuário colar</li>
              <li>URLs geradas com domínio ranchoprado.com.br</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Image className="w-4 h-4" /> Banner de Mídia Paga:
            </h4>
            <p className="text-sm text-muted-foreground">
              Adicione banners promocionais dentro do post para divulgar pacotes ou ranchos específicos.
              Configure título, descrição, link e imagem do banner.
            </p>
          </div>

          <Badge variant="secondary">Marketing de Conteúdo e SEO</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: FAQs =====
    {
      id: 'faqs',
      icon: HelpCircle,
      title: 'FAQs (Perguntas Frequentes)',
      color: 'text-pink-500',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Crie perguntas e respostas para ajudar visitantes e reduzir dúvidas repetitivas.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" /> Adicionar FAQ:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Clique em "Nova FAQ"</li>
              <li>Digite a pergunta de forma clara e direta</li>
              <li>Escreva resposta completa e informativa</li>
              <li>Associe a um Pacote específico (ex: "FAQ do Pacote VIP")</li>
              <li>Ou associe a um Rancho específico</li>
              <li>Ou deixe geral (aparece em todas as páginas)</li>
              <li>Defina ordem de exibição (menores aparecem primeiro)</li>
              <li>Ative ou desative conforme necessário</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Estatísticas de Utilidade:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Visitantes podem votar se a resposta foi útil (👍/👎)</li>
              <li>Taxa de utilidade: % de votos positivos</li>
              <li>Identifique FAQs que precisam ser melhoradas</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">💡 Dica:</h4>
            <p className="text-sm text-muted-foreground">
              Monitore as perguntas que clientes fazem no WhatsApp e transforme as mais frequentes 
              em FAQs para reduzir tempo de atendimento.
            </p>
          </div>

          <Badge variant="secondary">Redução de Atrito e Suporte</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: DEPOIMENTOS =====
    {
      id: 'depoimentos',
      icon: MessageSquare,
      title: 'Depoimentos',
      color: 'text-teal-500',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Adicione depoimentos de clientes satisfeitos para aumentar credibilidade e conversão.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" /> Criar Depoimento:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Clique em "Novo Depoimento"</li>
              <li>Digite nome do cliente</li>
              <li>Cargo ou cidade (ex: "Empresário de SP")</li>
              <li>Escreva o depoimento completo</li>
              <li>Upload de foto do cliente (recomendado)</li>
              <li>Defina nota de 1 a 5 estrelas</li>
              <li>Associe a um pacote específico (opcional)</li>
              <li>Defina ordem de exibição no carrossel</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">📍 Onde Aparecem:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Home page: carrossel de depoimentos principais</li>
              <li>Páginas de pacotes: depoimentos relacionados</li>
              <li>Seção "O que dizem nossos clientes"</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">💡 Dica de Qualidade:</h4>
            <p className="text-sm text-muted-foreground">
              Use depoimentos específicos e detalhados. Prefira "Peguei um dourado de 15kg 
              com o guia João!" ao invés de "Foi ótimo!".
            </p>
          </div>

          <Badge variant="secondary">Prova Social e Conversão</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: WHATSAPP CONFIG =====
    {
      id: 'whatsapp-config',
      icon: MessageCircle,
      title: 'WhatsApp Config',
      color: 'text-green-600',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Configure o widget de WhatsApp flutuante que aparece em todas as páginas do site.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" /> Configurações Principais:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Número WhatsApp:</strong> Com código do país (ex: +5537999999999)</li>
              <li><strong>Título do Chat:</strong> "Fale Conosco" ou personalizado</li>
              <li><strong>Saudação:</strong> Mensagem inicial quando widget abre</li>
              <li><strong>Mensagem Padrão:</strong> Texto pré-preenchido ao clicar "Enviar"</li>
              <li><strong>Horário de Atendimento:</strong> Informativo (ex: "Seg-Sáb 7h-20h")</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4" /> Mensagens Rápidas (Botões):
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Crie até 6 botões de atalho com mensagens pré-definidas:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>"💰 Consultar Preços"</li>
              <li>"📅 Verificar Disponibilidade"</li>
              <li>"🎣 Informações sobre Pacotes"</li>
              <li>"📍 Como Chegar"</li>
              <li>"🏠 Acomodações"</li>
              <li>"❓ Outras Dúvidas"</li>
            </ul>
          </div>

          <Badge variant="secondary">Atendimento e Conversão</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: WHATSAPP ANALYTICS =====
    {
      id: 'whatsapp-analytics',
      icon: TrendingUp,
      title: 'WhatsApp Analytics',
      color: 'text-green-700',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Monitore o uso do widget de WhatsApp e otimize conversões com dados detalhados.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold">📊 Métricas Disponíveis:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Widget Aberto:</strong> Quantas vezes visitantes clicaram no ícone</li>
              <li><strong>Botão WhatsApp Clicado:</strong> Cliques no botão principal "Enviar"</li>
              <li><strong>Mensagens Rápidas:</strong> Cliques em cada botão de atalho</li>
              <li><strong>Taxa de Conversão:</strong> (Mensagens / Widget aberto) × 100</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Download className="w-4 h-4" /> Exportação e Limpeza:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Exportar para CSV ou PDF</li>
              <li>Filtrar por período personalizado</li>
              <li>Limpar dados antigos mensalmente (recomendado)</li>
            </ul>
          </div>

          <Badge variant="secondary">Otimização de Atendimento</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: ANÚNCIOS =====
    {
      id: 'anuncios',
      icon: Building2,
      title: 'Anúncios',
      color: 'text-blue-600',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Crie e gerencie anúncios rotativos de imóveis, pacotes ou ofertas especiais no site.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" /> Criar Novo Anúncio:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Escolha um template pré-configurado ou configure manualmente</li>
              <li>Preencha título e subtítulo</li>
              <li>Adicione descrição do anúncio</li>
              <li>Upload da imagem principal</li>
              <li>Configure link de destino e texto do botão</li>
              <li>Defina período de exibição (data início e fim)</li>
              <li>Configure duração de exibição (3-60 segundos)</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Sistema de Rotação:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Múltiplos anúncios alternam automaticamente</li>
              <li>Cada anúncio tem duração configurável</li>
              <li>Barra de progresso mostra tempo restante</li>
              <li>Navegação manual com setas e indicadores</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">📍 Posicionamento:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Topo:</strong> Primeira seção da página</li>
              <li><strong>Meio:</strong> Entre conteúdos principais</li>
              <li><strong>Rodapé:</strong> Antes do footer</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Anúncios de Imóveis:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Ative "Informações de Imóvel" para terrenos/propriedades</li>
              <li>Configure área (m², hectares), preço e localização</li>
              <li>Badges destacados aparecem automaticamente no card</li>
            </ul>
          </div>

          <Badge variant="secondary">Promoção e Vendas</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: CONFIGURAÇÕES GERAIS =====
    {
      id: 'configuracoes',
      icon: Settings,
      title: 'Configurações (Tracking)',
      color: 'text-gray-600',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Configure ferramentas de rastreamento, análise de marketing e informações do site.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold">🔗 Códigos de Rastreamento:</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>Facebook Pixel ID:</strong> Para anúncios no Facebook/Instagram
                <span className="block text-xs ml-4 mt-1">Formato: 15-16 dígitos numéricos</span>
              </li>
              <li>
                <strong>Google Analytics (GA4):</strong> Análise de tráfego
                <span className="block text-xs ml-4 mt-1">Formato: G-XXXXXXXXXX</span>
              </li>
              <li>
                <strong>Google Tag Manager:</strong> Gerenciador de tags
                <span className="block text-xs ml-4 mt-1">Formato: GTM-XXXXXXX</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">🌐 Informações do Site:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Redes sociais (Facebook, Instagram, YouTube, TikTok)</li>
              <li>Email e telefone de contato</li>
              <li>Texto de copyright no rodapé</li>
              <li>Link do botão "Reservar" no header</li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-500">
              <strong>⚠️ Atenção:</strong> Apenas adicione scripts de fontes confiáveis 
              no campo de scripts personalizados.
            </p>
          </div>

          <Badge variant="secondary">Marketing e Análise</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: CALENDÁRIO LUNAR =====
    {
      id: 'calendario-lunar',
      icon: Moon,
      title: 'Calendário Lunar',
      color: 'text-yellow-600',
      category: 'Funcionalidades Públicas',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Exibe as fases da lua em tempo real, informação crucial para pescadores que 
            planejam suas pescarias baseados na atividade lunar.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold">🌙 Informações Exibidas:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Fase Atual:</strong> Lua Nova, Crescente, Cheia ou Minguante</li>
              <li><strong>Percentual de Iluminação:</strong> 0-100%</li>
              <li><strong>Próximas Fases:</strong> Datas das próximas transições</li>
              <li><strong>Índice de Pesca:</strong> Recomendação baseada na lua</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Fish className="w-4 h-4" /> Relação Lua × Pesca:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Lua Nova/Cheia:</strong> Maior atividade dos peixes</li>
              <li><strong>Quarto Crescente/Minguante:</strong> Atividade moderada</li>
              <li>Pescadores experientes preferem lua nova ou cheia</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">📍 Onde Aparece:</h4>
            <p className="text-sm text-muted-foreground">
              Seção na página inicial (Home), abaixo das informações da represa.
            </p>
          </div>

          <Badge variant="secondary">Informação Automática - Sem Configuração</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: INFORMAÇÕES DA REPRESA =====
    {
      id: 'represa',
      icon: Waves,
      title: 'Informações da Represa',
      color: 'text-blue-700',
      category: 'Funcionalidades Públicas',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Exibe dados em tempo real da Usina de Três Marias/CEMIG, essenciais para 
            pescadores que precisam saber as condições da água.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold">💧 Dados Exibidos:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Nível da Água:</strong> Cota atual em metros</li>
              <li><strong>Vazão Defluente:</strong> Volume de água liberada (m³/s)</li>
              <li><strong>Status do Vertedouro:</strong> Aberto ou fechado</li>
              <li><strong>Tendência:</strong> Subindo, descendo ou estável</li>
              <li><strong>Volume Útil:</strong> Percentual do reservatório</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Impacto na Pesca:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Vertedouro Aberto:</strong> Água mais turva, peixes mais difíceis</li>
              <li><strong>Nível Baixo:</strong> Peixes concentrados em locais específicos</li>
              <li><strong>Vazão Alta:</strong> Corrente forte, ajustar técnicas de pesca</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">🔄 Atualização:</h4>
            <p className="text-sm text-muted-foreground">
              Dados buscados automaticamente de fonte oficial (CEMIG). 
              Atualização a cada hora com cache local.
            </p>
          </div>

          <Badge variant="secondary">Dados Oficiais da CEMIG</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: PREVISÃO DO TEMPO =====
    {
      id: 'clima',
      icon: Cloud,
      title: 'Previsão do Tempo',
      color: 'text-sky-500',
      category: 'Funcionalidades Públicas',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Dashboard completo de clima para a região de Três Marias, incluindo previsão 
            horária e condições ideais para pesca.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold">☀️ Informações Disponíveis:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Temperatura:</strong> Atual, sensação térmica, máx/mín</li>
              <li><strong>Vento:</strong> Velocidade, direção e rajadas</li>
              <li><strong>Umidade:</strong> Percentual do ar</li>
              <li><strong>Pressão:</strong> Pressão atmosférica (hPa)</li>
              <li><strong>Visibilidade:</strong> Distância de visão</li>
              <li><strong>UV:</strong> Índice de radiação ultravioleta</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Fish className="w-4 h-4" /> Aba "Pesca":
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Índice de condições para pesca (0-100%)</li>
              <li>Melhores horários baseados no clima</li>
              <li>Alerta de condições adversas</li>
              <li>Recomendações específicas para o dia</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">📅 Previsão Estendida:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Previsão horária para próximas 24h</li>
              <li>Previsão diária para próximos 7 dias</li>
              <li>Chance de chuva por período</li>
            </ul>
          </div>

          <Badge variant="secondary">Dados Meteorológicos em Tempo Real</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: TRANSMISSÃO AO VIVO =====
    {
      id: 'live',
      icon: Play,
      title: 'Transmissão ao Vivo',
      color: 'text-red-500',
      category: 'Funcionalidades Públicas',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Página dedicada à transmissão ao vivo do Rio São Francisco, integrada com 
            YouTube Live e informações em tempo real.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Youtube className="w-4 h-4" /> Funcionalidades:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Player YouTube integrado com autoplay</li>
              <li>Contador de espectadores</li>
              <li>Qualidade HD configurável</li>
              <li>Botão de atualizar stream</li>
              <li>Indicador "AO VIVO" pulsante</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">🎛️ Informações Paralelas:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Condições climáticas atuais</li>
              <li>Dados da represa</li>
              <li>Fase da lua</li>
              <li>Estatísticas do stream</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">⚙️ Configuração (Admin):</h4>
            <p className="text-sm text-muted-foreground">
              O link do YouTube Live pode ser configurado em: Admin → Configurações → Vídeos. 
              Use o formato padrão do YouTube (youtube.com/watch?v=ID ou youtu.be/ID).
            </p>
          </div>

          <Badge variant="secondary">Engajamento em Tempo Real</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: COMPARTILHAMENTO =====
    {
      id: 'compartilhamento',
      icon: Share2,
      title: 'Sistema de Compartilhamento',
      color: 'text-indigo-600',
      category: 'Funcionalidades Públicas',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Botões de compartilhamento integrados em todas as páginas de detalhe 
            (ranchos, pacotes e posts do blog).
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold">🔗 Redes Suportadas:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Facebook:</strong> Compartilha com preview da imagem</li>
              <li><strong>WhatsApp:</strong> Envia link com texto personalizado</li>
              <li><strong>Twitter/X:</strong> Tweet com título e link</li>
              <li><strong>LinkedIn:</strong> Compartilha como post</li>
              <li><strong>Instagram:</strong> Copia link para colar nos stories/bio</li>
              <li><strong>Copiar Link:</strong> Copia URL para área de transferência</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Image className="w-4 h-4" /> Open Graph (Preview):
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Imagem destacada aparece no preview do link</li>
              <li>Título e descrição otimizados para cada rede</li>
              <li>URLs usam domínio ranchoprado.com.br</li>
              <li>Edge Function proxy garante preview correto</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">📍 Onde Aparecem:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Página de cada rancho (rodapé)</li>
              <li>Página de cada pacote (rodapé)</li>
              <li>Posts do blog (após conteúdo e no rodapé)</li>
            </ul>
          </div>

          <Badge variant="secondary">Viralização e Alcance Orgânico</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: PWA =====
    {
      id: 'pwa',
      icon: Smartphone,
      title: 'PWA (App Instalável)',
      color: 'text-violet-500',
      category: 'Funcionalidades Públicas',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            O Rancho Prado funciona como Progressive Web App, permitindo instalação 
            no celular como um aplicativo nativo.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold">📱 Benefícios do PWA:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Ícone na tela inicial do celular</li>
              <li>Abre em tela cheia (sem barra do navegador)</li>
              <li>Funciona offline com dados em cache</li>
              <li>Carregamento mais rápido</li>
              <li>Notificações push (futuro)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">📲 Como Instalar:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Android:</strong> Banner aparece automaticamente ou menu → "Instalar app"</li>
              <li><strong>iPhone:</strong> Safari → Compartilhar → "Adicionar à Tela de Início"</li>
              <li><strong>Desktop:</strong> Ícone de instalar na barra de endereço</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">🔄 Atualizações:</h4>
            <p className="text-sm text-muted-foreground">
              Quando há uma nova versão, aparece um popup "Atualização Disponível" 
              pedindo para o usuário atualizar o app.
            </p>
          </div>

          <Badge variant="secondary">Experiência Nativa no Celular</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: GALERIA =====
    {
      id: 'galeria',
      icon: Image,
      title: 'Galeria de Imagens',
      color: 'text-amber-500',
      category: 'Funcionalidades Públicas',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Componente de galeria com visualização em lightbox, presente nas páginas 
            de ranchos e pacotes.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold">🖼️ Funcionalidades:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Grid responsivo de miniaturas</li>
              <li>Clique para abrir em tela cheia</li>
              <li>Navegação com setas (esquerda/direita)</li>
              <li>Navegação por teclado</li>
              <li>Contador de fotos (1/10)</li>
              <li>Zoom nas imagens</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">📏 Otimização de Imagens:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Imagens são comprimidas no upload</li>
              <li>Lazy loading para melhor performance</li>
              <li>Formatos WebP quando suportado</li>
              <li>Miniaturas geradas automaticamente</li>
            </ul>
          </div>

          <Badge variant="secondary">Exibição Visual de Qualidade</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: COOKIES =====
    {
      id: 'cookies',
      icon: Bell,
      title: 'Cookie Consent (LGPD)',
      color: 'text-gray-500',
      category: 'Funcionalidades Públicas',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Banner de consentimento de cookies para conformidade com LGPD, 
            aparece na primeira visita do usuário.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold">⚖️ Funcionamento:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Banner aparece no rodapé da página</li>
              <li>Opção "Aceitar" ou "Recusar"</li>
              <li>Link para Política de Privacidade</li>
              <li>Preferência salva em localStorage</li>
              <li>Não aparece novamente após aceitar/recusar</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">🔒 Cookies Utilizados:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Analytics (Google Analytics, Facebook Pixel)</li>
              <li>Preferências do usuário (tema, idioma)</li>
              <li>Sessão de autenticação (admin)</li>
              <li>Cache de dados (performance)</li>
            </ul>
          </div>

          <Badge variant="secondary">Conformidade Legal</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: SEGURANÇA =====
    {
      id: 'seguranca',
      icon: ShieldAlert,
      title: 'Segurança e Boas Práticas',
      color: 'text-red-600',
      category: 'Admin',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Diretrizes de segurança e boas práticas para manter o sistema protegido.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Proteções Implementadas:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>RLS (Row Level Security):</strong> Todas as tabelas protegidas</li>
              <li><strong>Autenticação Admin:</strong> Verificação server-side de permissões</li>
              <li><strong>Sanitização HTML:</strong> Conteúdo do blog sanitizado contra XSS</li>
              <li><strong>Validação de Formulários:</strong> Schemas Zod validam entradas</li>
              <li><strong>Edge Functions Seguras:</strong> Funções serverless com validação</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg space-y-2">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <strong>ℹ️ Nota sobre Analytics Públicos:</strong>
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Os sistemas de analytics permitem inserts públicos para tracking sem autenticação. 
              Use os dados como indicadores, não como verdade absoluta. 
              Combine com Google Analytics para validação cruzada.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">🔐 Recomendações:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Nunca compartilhe suas credenciais de administrador</li>
              <li>Use senhas fortes e únicas</li>
              <li>Revise regularmente logs de atividades</li>
              <li>Mantenha backups regulares do banco de dados</li>
              <li>Monitore métricas de segurança no Supabase Dashboard</li>
            </ul>
          </div>

          <Badge variant="secondary">Proteção e Conformidade</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: SEO =====
    {
      id: 'seo',
      icon: Search,
      title: 'SEO e Otimização',
      color: 'text-emerald-500',
      category: 'Técnico',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Recursos de otimização para mecanismos de busca implementados no site.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold">🔍 Meta Tags Dinâmicas:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Title e description únicos por página</li>
              <li>Open Graph para compartilhamento social</li>
              <li>Twitter Cards configurados</li>
              <li>Canonical URLs para evitar conteúdo duplicado</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">📄 Arquivos SEO:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>robots.txt:</strong> Instrui bots de busca</li>
              <li><strong>sitemap.xml:</strong> Mapa do site (gerar manualmente)</li>
              <li><strong>manifest.json:</strong> Configuração PWA</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">⚡ Performance:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Imagens otimizadas e lazy loading</li>
              <li>CSS crítico inline</li>
              <li>Cache de dados com React Query</li>
              <li>Code splitting por rota</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">💡 Dicas para Blog:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Use palavras-chave no título e slug</li>
              <li>Escreva meta descriptions de 150-160 caracteres</li>
              <li>Use headings (H1, H2, H3) hierarquicamente</li>
              <li>Adicione alt text nas imagens</li>
              <li>Links internos para outros conteúdos</li>
            </ul>
          </div>

          <Badge variant="secondary">Visibilidade no Google</Badge>
        </div>
      )
    },

    // ===== SEÇÃO: HOSPEDAGEM =====
    {
      id: 'hospedagem',
      icon: Globe,
      title: 'Hospedagem e Deploy',
      color: 'text-slate-600',
      category: 'Técnico',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Informações sobre a infraestrutura de hospedagem e processo de deploy do site.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold">🏗️ Arquitetura:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Frontend:</strong> Lovable (desenvolvimento) → Hostinger (produção)</li>
              <li><strong>Backend:</strong> Supabase (PostgreSQL + Edge Functions)</li>
              <li><strong>Domínio:</strong> ranchoprado.com.br (Hostinger)</li>
              <li><strong>SSL:</strong> HTTPS configurado automaticamente</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">🚀 Processo de Deploy:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Desenvolvimento feito no Lovable</li>
              <li>Código exportado para GitHub</li>
              <li>Build gerado e enviado para Hostinger</li>
              <li>Arquivos servidos via servidor Apache</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">📁 Arquivos Importantes:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>.htaccess:</strong> Configuração do Apache (SPA routing)</li>
              <li><strong>manifest.json:</strong> Configuração PWA</li>
              <li><strong>index.html:</strong> Ponto de entrada da aplicação</li>
            </ul>
          </div>

          <Badge variant="secondary">Infraestrutura Profissional</Badge>
        </div>
      )
    }
  ];

  // Categorias para agrupamento
  const categories = [
    { id: 'Sobre o Sistema', color: 'bg-blue-100 text-blue-800' },
    { id: 'Admin', color: 'bg-green-100 text-green-800' },
    { id: 'Funcionalidades Públicas', color: 'bg-purple-100 text-purple-800' },
    { id: 'Técnico', color: 'bg-gray-100 text-gray-800' }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedSections = categories.map(cat => ({
    ...cat,
    sections: filteredSections.filter(s => s.category === cat.id)
  })).filter(group => group.sections.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Manual Completo do Rancho Prado
        </h1>
        <p className="text-muted-foreground mt-2">
          Documentação completa de todas as funcionalidades do site e painel administrativo
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Seções Documentadas</CardDescription>
            <CardTitle className="text-3xl">{sections.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Categorias</CardDescription>
            <CardTitle className="text-3xl">{categories.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Funcionalidades Admin</CardDescription>
            <CardTitle className="text-3xl">
              {sections.filter(s => s.category === 'Admin').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Links Rápidos</CardDescription>
            <CardTitle className="text-3xl">
              <Link to="/admin" className="text-primary hover:underline text-base">
                Voltar ao Dashboard →
              </Link>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar no Manual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Digite o que você procura... (ex: blog, whatsapp, represa, pacotes)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xl"
          />
          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-2">
              {filteredSections.length} resultado(s) encontrado(s)
            </p>
          )}
        </CardContent>
      </Card>

      {/* Grouped Sections */}
      {groupedSections.map((group) => (
        <Card key={group.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Badge className={group.color}>{group.id}</Badge>
              <span className="text-muted-foreground text-sm font-normal">
                ({group.sections.length} seções)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {group.sections.map((section) => {
                const Icon = section.icon;
                return (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${section.color}`} />
                        <span className="text-lg font-semibold">{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      {section.content}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      ))}

      {filteredSections.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma seção encontrada para "{searchTerm}"</p>
              <p className="text-sm mt-2">Tente outro termo de busca</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Help */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Ainda com Dúvidas?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Se você não encontrou a resposta que procurava, entre em contato com o suporte técnico.
          </p>
          <p className="text-sm">
            <strong>Dica:</strong> Ao solicitar ajuda, mencione qual funcionalidade você está usando 
            e descreva o problema com detalhes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ajuda;
