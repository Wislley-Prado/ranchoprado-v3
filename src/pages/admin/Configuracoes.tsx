import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Code2, TrendingUp, Webhook, AlertCircle, RefreshCw, Database, Clock, User, Share2, Phone, Mail, Facebook, Instagram, Youtube, Calendar, FileText, Link2, Trash2, HardDrive, Pause, Play } from 'lucide-react';
import { BrandImagesCard } from '@/components/admin/configuracoes/BrandImagesCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { clearAllCache, getCacheStats, resetCacheStats, invalidateCacheByPrefix } from '@/lib/cacheService';
import { useQueryClient } from '@tanstack/react-query';

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

const Configuracoes = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [savingManual, setSavingManual] = useState(false);
  const [webhookPausado, setWebhookPausado] = useState(false);
  const [togglingPause, setTogglingPause] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [manualDam, setManualDam] = useState({
    nivel: '',
    volume: '',
    afluencia: '',
    defluencia: '',
    data: new Date().toLocaleDateString('pt-BR'),
  });
  const [brandImages, setBrandImages] = useState({ favicon_url: '', og_image_url: '', pwa_icon_url: '', logo_url: '' });
  const [settings, setSettings] = useState({
    facebook_pixel: '',
    google_analytics: '',
    google_tag_manager: '',
    custom_head_scripts: '',
    dam_webhook_url: '',
    autor_avatar_url: '',
    // Redes sociais
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    tiktok_url: '',
    twitter_url: '',
    // Contato
    telefone_contato: '',
    email_contato: '',
    // Footer e Header
    copyright_text: '',
    reserva_button_link: ''
  });

  useEffect(() => {
    fetchSettings();
    fetchLastDamUpdate();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', SETTINGS_ID)
        .single();

      if (error) throw error;

      if (data) {
        setWebhookPausado((data as any).dam_webhook_pausado === true);
        setBrandImages({
          favicon_url: (data as any).favicon_url || '',
          og_image_url: (data as any).og_image_url || '',
          pwa_icon_url: (data as any).pwa_icon_url || '',
          logo_url: (data as any).logo_url || '',
        });
        setSettings({
          facebook_pixel: data.facebook_pixel || '',
          google_analytics: data.google_analytics || '',
          google_tag_manager: data.google_tag_manager || '',
          custom_head_scripts: data.custom_head_scripts || '',
          dam_webhook_url: (data as any).dam_webhook_url || '',
          autor_avatar_url: (data as any).autor_avatar_url || '',
          facebook_url: (data as any).facebook_url || '',
          instagram_url: (data as any).instagram_url || '',
          youtube_url: (data as any).youtube_url || '',
          tiktok_url: (data as any).tiktok_url || '',
          twitter_url: (data as any).twitter_url || '',
          telefone_contato: (data as any).telefone_contato || '',
          email_contato: (data as any).email_contato || '',
          copyright_text: (data as any).copyright_text || '',
          reserva_button_link: (data as any).reserva_button_link || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const fetchLastDamUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('dam_data')
        .select('updated_at')
        .eq('id', 1)
        .single();

      if (!error && data?.updated_at) {
        setLastUpdate(data.updated_at);
      }
    } catch (error) {
      console.log('Sem dados da represa ainda');
    }
  };

  const handleToggleWebhookPause = async () => {
    setTogglingPause(true);
    try {
      const newValue = !webhookPausado;
      const { error } = await supabase
        .from('site_settings')
        .update({ dam_webhook_pausado: newValue } as any)
        .eq('id', SETTINGS_ID);

      if (error) throw error;

      setWebhookPausado(newValue);
      toast.success(newValue ? 'Webhook PAUSADO! Dados manuais protegidos.' : 'Webhook RETOMADO! Automação ativa.');
    } catch (error) {
      console.error('Erro ao alterar pausa do webhook:', error);
      toast.error('Erro ao alterar estado do webhook');
    } finally {
      setTogglingPause(false);
    }
  };

  const handleSettingsUpdate = async () => {
    // Limpar cache local (localStorage e memória)
    invalidateCacheByPrefix('site_settings');
    
    // Invalida no React Query para forçar recarregamento em todo o app
    queryClient.invalidateQueries(['site-settings']);
    queryClient.invalidateQueries(['site-settings-favicon']);
    
    // Atualizar o estado local
    await fetchSettings();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', SETTINGS_ID);

      if (error) throw error;

      // Limpar cache local (localStorage e memória)
      invalidateCacheByPrefix('site_settings');
      
      // Invalida no React Query para forçar recarregamento em todo o app
      queryClient.invalidateQueries(['site-settings']);

      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshDamData = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('dam-data-proxy', {
        method: 'POST',
      });

      if (error) {
        throw new Error(error.message || 'Erro ao atualizar dados');
      }

      if (data?.saved_to_db) {
        toast.success('Dados da represa atualizados com sucesso!');
        setLastUpdate(new Date().toISOString());
      } else {
        toast.warning('Dados recebidos mas não salvos no banco');
      }
    } catch (error) {
      console.error('Erro ao atualizar dados da represa:', error);
      toast.error('Erro ao atualizar dados da represa. Verifique se o workflow n8n está ativo.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleManualDamData = async () => {
    if (!manualDam.nivel || !manualDam.volume || !manualDam.afluencia || !manualDam.defluencia) {
      toast.error('Preencha todos os campos');
      return;
    }

    setSavingManual(true);
    try {
      const damPayload = [{
        tipo: 'tempo_real',
        data_leitura: manualDam.data,
        afluencia: manualDam.afluencia,
        nivel_inicial: manualDam.nivel,
        volume_inicial: manualDam.volume,
        defluencia: manualDam.defluencia,
        nivel_atual: manualDam.nivel,
        volume_percentual: manualDam.volume,
      }];

      const { error } = await supabase
        .from('dam_data')
        .upsert({ id: 1, data: damPayload, updated_at: new Date().toISOString() });

      if (error) throw error;

      toast.success('Dados da represa salvos manualmente!');
      setLastUpdate(new Date().toISOString());
    } catch (error) {
      console.error('Erro ao salvar dados manuais:', error);
      toast.error('Erro ao salvar dados manuais');
    } finally {
      setSavingManual(false);
    }
  };

  const formatLastUpdate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações de Tracking</h1>
        <p className="text-muted-foreground mt-1">
          Configure códigos de rastreamento globais para todo o site
        </p>
      </div>

      <div className="grid gap-6">
        {/* Card de Imagens do Site */}
        <BrandImagesCard
          faviconUrl={brandImages.favicon_url}
          ogImageUrl={brandImages.og_image_url}
          pwaIconUrl={brandImages.pwa_icon_url}
          logoUrl={brandImages.logo_url}
          onUpdate={handleSettingsUpdate}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Pixels e Analytics
            </CardTitle>
            <CardDescription>
              Configure Facebook Pixel, Google Analytics e Google Tag Manager
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook_pixel">Facebook Pixel ID</Label>
              <Input
                id="facebook_pixel"
                placeholder="Ex: 1234567890123456"
                value={settings.facebook_pixel}
                onChange={(e) => setSettings({ ...settings, facebook_pixel: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Cole apenas o ID do pixel (números)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_analytics">Google Analytics ID (GA4)</Label>
              <Input
                id="google_analytics"
                placeholder="Ex: G-XXXXXXXXXX"
                value={settings.google_analytics}
                onChange={(e) => setSettings({ ...settings, google_analytics: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Measurement ID do Google Analytics 4
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_tag_manager">Google Tag Manager ID</Label>
              <Input
                id="google_tag_manager"
                placeholder="Ex: GTM-XXXXXXX"
                value={settings.google_tag_manager}
                onChange={(e) => setSettings({ ...settings, google_tag_manager: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Container ID do Google Tag Manager
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="w-5 h-5" />
              Integrações Externas
            </CardTitle>
            <CardDescription>
              Configure URLs de webhooks e integrações com sistemas externos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dam_webhook_url">URL do Webhook da Represa (n8n)</Label>
              <Input
                id="dam_webhook_url"
                placeholder="https://webhook.exemplo.com/webhook/represa"
                value={settings.dam_webhook_url}
                onChange={(e) => setSettings({ ...settings, dam_webhook_url: e.target.value })}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                URL do webhook n8n que retorna os dados da represa de Três Marias
              </p>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Importante:</strong> O workflow no n8n deve estar <strong>ativo</strong> para funcionar. 
                Ative usando o toggle no canto superior direito do editor do n8n.
              </AlertDescription>
            </Alert>

            {/* Controle de Pausa do Webhook */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {webhookPausado ? (
                    <Pause className="w-4 h-4 text-destructive" />
                  ) : (
                    <Play className="w-4 h-4 text-green-600" />
                  )}
                  <span className="font-medium text-sm">Controle do Webhook</span>
                </div>
                <Badge variant={webhookPausado ? 'destructive' : 'default'} className="text-xs">
                  {webhookPausado ? '⏸️ PAUSADO' : '▶️ ATIVO'}
                </Badge>
              </div>

              {webhookPausado && (
                <Alert className="mb-4 border-destructive">
                  <Pause className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-xs text-destructive">
                    <strong>Webhook PAUSADO</strong> — O cron job continua rodando mas NÃO sobrescreve os dados manuais.
                    Clique em "Retomar Webhook" quando a automação estiver corrigida.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                variant={webhookPausado ? 'default' : 'destructive'}
                onClick={handleToggleWebhookPause}
                disabled={togglingPause}
                className="flex items-center gap-2"
              >
                {togglingPause ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Alterando...
                  </>
                ) : webhookPausado ? (
                  <>
                    <Play className="w-4 h-4" />
                    Retomar Webhook
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    Pausar Webhook
                  </>
                )}
              </Button>
            </div>

            {/* Seção de Dados da Represa */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Dados da Represa no Banco</span>
                </div>
                {lastUpdate && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Atualizado: {formatLastUpdate(lastUpdate)}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefreshDamData}
                  disabled={refreshing || webhookPausado}
                  className="flex items-center gap-2"
                >
                  {refreshing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Atualizar Agora
                    </>
                  )}
                </Button>
                <span className="text-xs text-muted-foreground">
                  {webhookPausado ? 'Desabilitado enquanto o webhook está pausado' : 'Força uma atualização imediata dos dados da represa'}
                </span>
              </div>

              <Alert className="mt-4">
                <Database className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Os dados são atualizados automaticamente <strong>4x ao dia</strong> (06h, 12h, 18h, 00h).
                  Use o botão acima apenas para atualizações emergenciais.
                </AlertDescription>
              </Alert>
            </div>

            {/* Formulário de Entrada Manual */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <HardDrive className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm">Entrada Manual de Dados</span>
              </div>

              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Use este formulário para inserir dados manualmente enquanto o webhook não estiver funcionando.
                  Quando o webhook voltar, os dados automáticos substituirão os manuais.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manual_nivel">Nível Atual (m)</Label>
                  <Input
                    id="manual_nivel"
                    placeholder="Ex: 570,02"
                    value={manualDam.nivel}
                    onChange={(e) => setManualDam({ ...manualDam, nivel: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual_volume">Volume Útil (%)</Label>
                  <Input
                    id="manual_volume"
                    placeholder="Ex: 83,37"
                    value={manualDam.volume}
                    onChange={(e) => setManualDam({ ...manualDam, volume: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual_afluencia">Afluência (m³/s)</Label>
                  <Input
                    id="manual_afluencia"
                    placeholder="Ex: 1121,93"
                    value={manualDam.afluencia}
                    onChange={(e) => setManualDam({ ...manualDam, afluencia: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual_defluencia">Defluência (m³/s)</Label>
                  <Input
                    id="manual_defluencia"
                    placeholder="Ex: 246,37"
                    value={manualDam.defluencia}
                    onChange={(e) => setManualDam({ ...manualDam, defluencia: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual_data">Data da Leitura</Label>
                  <Input
                    id="manual_data"
                    placeholder="Ex: 22/02/2026"
                    value={manualDam.data}
                    onChange={(e) => setManualDam({ ...manualDam, data: e.target.value })}
                  />
                </div>
              </div>

              <Button
                onClick={handleManualDamData}
                disabled={savingManual}
                className="mt-4 flex items-center gap-2"
              >
                {savingManual ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Dados Manuais
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Avatar do Autor (Rancho Prado)
            </CardTitle>
            <CardDescription>
              Configure a imagem do avatar que aparece nos posts do blog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="autor_avatar_url">URL do Avatar</Label>
              <Input
                id="autor_avatar_url"
                placeholder="https://exemplo.com/avatar.jpg"
                value={settings.autor_avatar_url}
                onChange={(e) => setSettings({ ...settings, autor_avatar_url: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                URL da imagem do avatar do Rancho Prado (recomendado: 100x100px)
              </p>
            </div>
            {settings.autor_avatar_url && (
              <div className="flex items-center gap-3">
                <img 
                  src={settings.autor_avatar_url} 
                  alt="Preview do avatar" 
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <span className="text-sm text-muted-foreground">Preview do avatar</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card de Redes Sociais e Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Redes Sociais e Contato
            </CardTitle>
            <CardDescription>
              Configure os links das redes sociais e informações de contato do footer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Redes Sociais */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Redes Sociais</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook_url" className="flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook_url"
                    placeholder="https://facebook.com/ranchoprado"
                    value={settings.facebook_url}
                    onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram_url" className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram_url"
                    placeholder="https://instagram.com/ranchoprado"
                    value={settings.instagram_url}
                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube_url" className="flex items-center gap-2">
                    <Youtube className="w-4 h-4" />
                    YouTube (Canal)
                  </Label>
                  <Input
                    id="youtube_url"
                    placeholder="https://youtube.com/@ranchoprado"
                    value={settings.youtube_url}
                    onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiktok_url" className="flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                    TikTok
                  </Label>
                  <Input
                    id="tiktok_url"
                    placeholder="https://tiktok.com/@ranchoprado"
                    value={settings.tiktok_url}
                    onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter_url" className="flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X (Twitter)
                  </Label>
                  <Input
                    id="twitter_url"
                    placeholder="https://x.com/ranchoprado"
                    value={settings.twitter_url}
                    onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Informações de Contato */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Informações de Contato</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone_contato" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefone
                  </Label>
                  <Input
                    id="telefone_contato"
                    placeholder="(38) 98832-0108"
                    value={settings.telefone_contato}
                    onChange={(e) => setSettings({ ...settings, telefone_contato: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_contato" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    E-mail
                  </Label>
                  <Input
                    id="email_contato"
                    type="email"
                    placeholder="contato@ranchoprado.com.br"
                    value={settings.email_contato}
                    onChange={(e) => setSettings({ ...settings, email_contato: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Alert>
              <Share2 className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Deixe em branco os campos de redes sociais que não deseja exibir no footer. 
                Apenas as redes com URL preenchida serão mostradas.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Card de Footer e Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Footer e Cabeçalho
            </CardTitle>
            <CardDescription>
              Configure textos do footer e links do cabeçalho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="copyright_text" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Texto de Copyright (Footer)
                </Label>
                <Input
                  id="copyright_text"
                  placeholder="© 2026 Rancho Prado. Todos os direitos reservados."
                  value={settings.copyright_text}
                  onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Texto que aparece no rodapé do site
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="reserva_button_link" className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Link do Botão "Reservar" (Cabeçalho)
                </Label>
                <Input
                  id="reserva_button_link"
                  placeholder="https://wa.me/5538988320108"
                  value={settings.reserva_button_link}
                  onChange={(e) => setSettings({ ...settings, reserva_button_link: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  URL de destino ao clicar no botão "Reservar" no cabeçalho. Pode ser WhatsApp, formulário, etc.
                </p>
              </div>
            </div>

            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription className="text-xs">
                O botão "Reservar" pode apontar para qualquer link: WhatsApp, Google Forms, página de reservas, etc.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              Scripts Personalizados
            </CardTitle>
            <CardDescription>
              Adicione scripts personalizados que serão inseridos no &lt;head&gt; do site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="custom_head_scripts">Scripts Personalizados</Label>
              <Textarea
                id="custom_head_scripts"
                placeholder="<script>&#10;  // Seu código aqui&#10;</script>"
                value={settings.custom_head_scripts}
                onChange={(e) => setSettings({ ...settings, custom_head_scripts: e.target.value })}
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Cole scripts completos incluindo as tags &lt;script&gt;
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card de Gerenciamento de Cache */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Gerenciamento de Cache
            </CardTitle>
            <CardDescription>
              Limpe o cache do site para forçar atualização dos dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Estatísticas de Cache */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(() => {
                const stats = getCacheStats();
                return (
                  <>
                    <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.hits}</div>
                      <div className="text-xs text-green-600 dark:text-green-400">Cache Hits</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-950 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.misses}</div>
                      <div className="text-xs text-red-600 dark:text-red-400">Cache Misses</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.supabaseCalls}</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">API Calls</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.hitRate}</div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">Taxa de Cache</div>
                    </div>
                  </>
                );
              })()}
            </div>

            <Separator />

            {/* Ações de Cache */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Ações de Cache</h4>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    invalidateCacheByPrefix('ranchos');
                    toast.success('Cache de ranchos limpo!');
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Limpar Ranchos
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    invalidateCacheByPrefix('pacotes');
                    toast.success('Cache de pacotes limpo!');
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Limpar Pacotes
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    invalidateCacheByPrefix('depoimentos');
                    toast.success('Cache de depoimentos limpo!');
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Limpar Depoimentos
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    invalidateCacheByPrefix('blog');
                    toast.success('Cache do blog limpo!');
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Limpar Blog
                </Button>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    clearAllCache();
                    toast.success('Todo o cache foi limpo! A página será recarregada.');
                    setTimeout(() => window.location.reload(), 1000);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Todo Cache
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    resetCacheStats();
                    toast.success('Estatísticas de cache resetadas!');
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resetar Estatísticas
                </Button>
              </div>
            </div>

            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription className="text-xs">
                O cache é usado para reduzir chamadas ao banco de dados e melhorar a performance. 
                Limpe apenas quando necessário forçar a atualização dos dados no site.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
