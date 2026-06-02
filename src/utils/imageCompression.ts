export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85,
  maxSizeMB: 1,
};

/**
 * Comprime uma imagem usando canvas
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Não comprime SVGs ou ICOs (preserva qualidade vetorial e formato de ícone)
  if (
    file.type === 'image/svg+xml' || 
    file.type === 'image/x-icon' || 
    file.name.endsWith('.svg') || 
    file.name.endsWith('.ico')
  ) {
    console.log(`Skipping compression for vector/icon file: ${file.name}`);
    return file;
  }

  // Se a imagem já é pequena o suficiente, retorna o arquivo original
  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB < (opts.maxSizeMB || 1) * 0.8) {
    console.log(`Image ${file.name} is already small enough (${fileSizeMB.toFixed(2)}MB)`);
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Calcular novas dimensões mantendo aspect ratio
          let { width, height } = img;
          const maxWidth = opts.maxWidth || 1920;
          const maxHeight = opts.maxHeight || 1920;

          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;

            if (width > height) {
              width = maxWidth;
              height = Math.round(width / aspectRatio);
            } else {
              height = maxHeight;
              width = Math.round(height * aspectRatio);
            }
          }

          // Criar canvas e comprimir
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Desenhar imagem no canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Converter para blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              const compressedSizeMB = blob.size / 1024 / 1024;
              console.log(
                `Compressed ${file.name}: ${fileSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB (${((1 - compressedSizeMB / fileSizeMB) * 100).toFixed(1)}% reduction)`
              );

              // Criar novo arquivo com o blob comprimido
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            file.type,
            opts.quality || 0.85
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Comprime múltiplas imagens em paralelo
 */
export const compressImages = async (
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<File[]> => {
  const results: File[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const compressed = await compressImage(files[i], options);
      results.push(compressed);
      onProgress?.(i + 1, files.length);
    } catch (error) {
      console.error(`Failed to compress ${files[i].name}:`, error);
      // Em caso de erro, usa o arquivo original
      results.push(files[i]);
      onProgress?.(i + 1, files.length);
    }
  }

  return results;
};
