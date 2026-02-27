

## Problema: Imagens borradas no PC

As imagens estão sendo servidas com `width=400` via `getOptimizedUrl`. No celular, cards são ~350px de largura, então 400px é suficiente. No PC, os cards têm ~450-500px de largura, e com telas Retina (2x pixel ratio), precisam de pelo menos 800px para ficarem nítidas.

## Correção

Aumentar a largura de otimização nos componentes de card para 800px (suficiente para desktop Retina) e manter thumbnails menores onde apropriado:

| Arquivo | Mudança |
|---------|---------|
| `src/components/RanchCard.tsx` | `getOptimizedUrl(url, 400)` → `getOptimizedUrl(url, 800)` |
| `src/components/PackageCard.tsx` | `getOptimizedUrl(url, 400)` → `getOptimizedUrl(url, 800)` |
| `src/components/BlogCard.tsx` | `getOptimizedUrl(url, 400)` → `getOptimizedUrl(url, 800)` |
| `src/components/FeaturedPackagesCarousel.tsx` | `getOptimizedUrl(url, 400)` → `getOptimizedUrl(url, 800)` |
| `src/components/AnunciosSection.tsx` | Manter 800 (já está correto) |

Isso dobra a resolução servida, mantendo a otimização (800px com quality=80 é ~60-70% menor que o original full-size).

