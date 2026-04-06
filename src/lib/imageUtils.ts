/**
 * Otimiza URLs de imagens do Supabase Storage.
 * 
 * NOTA: Transformações de imagem (/render/image/) requerem plano Pro do Supabase.
 * No plano gratuito, retornamos a URL original para evitar 404.
 * Se o projeto migrar para Pro, basta descomentar a transformação abaixo.
 */
export const getOptimizedUrl = (url: string, _width?: number, _quality?: number): string => {
  if (!url) return url;
  
  // Retorna a URL original sem transformação para garantir que imagens sempre carreguem.
  // Supabase image transformations (/render/image/) requerem plano Pro.
  return url;
};

/**
 * Retorna a URL original (sem transformação) para uso como fallback.
 */
export const getOriginalUrl = (url: string): string => {
  if (!url) return url;
  // Reverte /render/image/ para /object/ se necessário
  return url.replace('/storage/v1/render/image/', '/storage/v1/object/');
};
