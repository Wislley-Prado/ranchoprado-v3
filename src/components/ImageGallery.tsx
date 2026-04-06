import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn, Expand } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOptimizedUrl, getOriginalUrl } from '@/lib/imageUtils';

interface ImageGalleryProps {
  images: {
    url: string;
    alt_text?: string;
    principal?: boolean;
  }[];
  title?: string;
}

export const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') setLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, goToPrevious, goToNext]);

  if (images.length === 0) {
    return (
      <div className="w-full h-[400px] lg:h-[500px] bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
        <span className="text-muted-foreground text-xl">Sem imagens disponíveis</span>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-3">
        {/* Main Image with Navigation */}
        <div className="relative group">
          <div 
            className="relative overflow-hidden rounded-2xl cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={getOptimizedUrl(images[selectedIndex]?.url, 800)}
              alt={images[selectedIndex]?.alt_text || title || 'Imagem'}
              className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
              loading="eager"
              /* fetchpriority handled natively by browser for eager images */
              onError={(e) => {
                const original = getOriginalUrl(images[selectedIndex]?.url);
                if (e.currentTarget.src !== original) {
                  e.currentTarget.src = original;
                }
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Zoom Hint */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Expand className="h-4 w-4" />
              <span className="text-sm font-medium">Clique para ampliar</span>
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>

          {/* Navigation Arrows - Main Gallery */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 dark:bg-black/70 hover:bg-white dark:hover:bg-black shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 dark:bg-black/70 hover:bg-white dark:hover:bg-black shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative flex-shrink-0 h-20 w-28 rounded-xl overflow-hidden transition-all duration-300",
                  selectedIndex === index 
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' 
                    : 'opacity-60 hover:opacity-100 hover:scale-102'
                )}
              >
                <img
                  src={getOptimizedUrl(img.url, 120)}
                  alt={img.alt_text || `${title || 'Imagem'} - Foto ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const original = getOriginalUrl(img.url);
                    if (e.currentTarget.src !== original) {
                      e.currentTarget.src = original;
                    }
                  }}
                />
                {selectedIndex === index && (
                  <div className="absolute inset-0 bg-primary/10" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-50 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {selectedIndex + 1} / {images.length}
            </div>

            {/* Main Image */}
            <img
              src={images[selectedIndex]?.url}
              alt={images[selectedIndex]?.alt_text || title || 'Imagem'}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />

            {/* Navigation Arrows - Lightbox */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Thumbnails in Lightbox */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-xl max-w-[90vw] overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={cn(
                      "relative flex-shrink-0 h-14 w-20 rounded-lg overflow-hidden transition-all duration-200",
                      selectedIndex === index 
                        ? 'ring-2 ring-white scale-110' 
                        : 'opacity-50 hover:opacity-100'
                    )}
                  >
                    <img
                      src={img.url}
                      alt={img.alt_text || `Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
