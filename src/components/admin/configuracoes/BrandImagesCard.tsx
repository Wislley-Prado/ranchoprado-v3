import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { compressImage } from '@/utils/imageCompression';
import { Loader2, Upload, Image, Trash2 } from 'lucide-react';

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

interface BrandImagesCardProps {
  faviconUrl: string;
  ogImageUrl: string;
  pwaIconUrl: string;
  logoUrl: string;
  onUpdate: () => void;
}

interface ImageUploaderProps {
  label: string;
  description: string;
  currentUrl: string;
  bucket: string;
  path: string;
  field: string;
  maxWidth: number;
  maxHeight: number;
  onUpdate: () => void;
  previewSize?: string;
}

const ImageUploader = ({ label, description, currentUrl, bucket, path, field, maxWidth, maxHeight, onUpdate, previewSize = 'w-16 h-16' }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem válida');
      return;
    }

    setUploading(true);
    try {
      const compressed = await compressImage(file, { maxWidth, maxHeight, quality: 0.9 });
      
      const ext = file.name.split('.').pop() || 'png';
      const fileName = `${path}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, compressed, { upsert: true, cacheControl: '3600' });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ [field]: publicUrl } as any)
        .eq('id', SETTINGS_ID);

      if (updateError) throw updateError;

      toast.success(`${label} atualizado com sucesso!`);
      onUpdate();
    } catch (error) {
      console.error(`Erro ao fazer upload de ${label}:`, error);
      toast.error(`Erro ao fazer upload de ${label}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ [field]: null } as any)
        .eq('id', SETTINGS_ID);

      if (error) throw error;
      toast.success(`${label} removido`);
      onUpdate();
    } catch (error) {
      toast.error(`Erro ao remover ${label}`);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
      <div>
        <Label className="font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>

      {currentUrl && (
        <div className="flex items-center gap-3">
          <img
            src={currentUrl}
            alt={`Preview ${label}`}
            className={`${previewSize} rounded border object-contain bg-background`}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={removing}
            className="text-destructive hover:text-destructive"
          >
            {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        </div>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
          onChange={handleUpload}
          className="hidden"
          id={`upload-${field}`}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {currentUrl ? 'Trocar imagem' : 'Enviar imagem'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export const BrandImagesCard = ({ faviconUrl, ogImageUrl, pwaIconUrl, logoUrl, onUpdate }: BrandImagesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Imagens do Site
        </CardTitle>
        <CardDescription>
          Logo do header, favicon, imagem de compartilhamento (OG Image) e ícones PWA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ImageUploader
          label="Logo do Header"
          description="Logo exibida no cabeçalho do site (PNG com fundo transparente, recomendado: 512x512px)"
          currentUrl={logoUrl}
          bucket="configuracoes"
          path="logo-header"
          field="logo_url"
          maxWidth={512}
          maxHeight={512}
          onUpdate={onUpdate}
          previewSize="w-16 h-16"
        />
        <ImageUploader
          label="Favicon"
          description="Ícone que aparece na aba do navegador (recomendado: 64x64px, PNG)"
          currentUrl={faviconUrl}
          bucket="configuracoes"
          path="favicon"
          field="favicon_url"
          maxWidth={128}
          maxHeight={128}
          onUpdate={onUpdate}
          previewSize="w-8 h-8"
        />

        <ImageUploader
          label="OG Image (Compartilhamento)"
          description="Imagem exibida ao compartilhar o site em redes sociais (recomendado: 1200x630px)"
          currentUrl={ogImageUrl}
          bucket="configuracoes"
          path="og-image"
          field="og_image_url"
          maxWidth={1200}
          maxHeight={630}
          onUpdate={onUpdate}
          previewSize="w-32 h-16"
        />

        <ImageUploader
          label="Ícone PWA"
          description="Ícone do app no celular (recomendado: 512x512px, PNG quadrado)"
          currentUrl={pwaIconUrl}
          bucket="configuracoes"
          path="pwa-icon"
          field="pwa_icon_url"
          maxWidth={512}
          maxHeight={512}
          onUpdate={onUpdate}
          previewSize="w-12 h-12"
        />
      </CardContent>
    </Card>
  );
};
