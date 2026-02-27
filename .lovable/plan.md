

## PageSpeed Mobile: 80 → 90+ (LCP 4.3s, FCP 2.7s)

### Problemas identificados

**FCP 2.7s** - O bundle principal é grande. O `Index` importa eagerly `Header`, `HeroSection`, `WhatsAppButton`, `Footer`, e o `App.tsx` importa muitos componentes no nível raiz (`CookieConsent`, `TrackingScripts`, `PageViewTracker`, `DynamicFavicon`, `PWALifecycle`, `ScrollToTop`). Todos bloqueiam o primeiro paint.

**LCP 4.3s** - O LCP element no mobile é provavelmente o YouTube thumbnail. Está sendo preloaded no `index.html`, mas o `videoId` pode mudar via `useVideoSettings` (Supabase query), e o preload hardcoded aponta para `cN_BspPR2gg`. Se o ID mudou, o preload não ajuda. Além disso, o `PackageCard` ainda usa `loading="lazy"` (não foi atualizado como o `RanchCard`).

### Correções

#### 1. `src/components/PackageCard.tsx` - Corrigir loading das imagens
- Mudar `loading="lazy"` para `loading="eager"` (mesma correção do RanchCard)
- Adicionar `fetchPriority="high"` e `decoding="async"`
- Pacotes não estão mais em LazySection, então lazy causa atraso desnecessário

#### 2. `src/App.tsx` - Lazy load componentes não-críticos do layout
- Tornar `CookieConsent`, `TrackingScripts`, `PageViewTracker`, `PWALifecycle`, `DynamicFavicon` lazy-loaded
- Esses componentes não são visíveis no primeiro paint e bloqueiam o FCP
- Usar `React.lazy` + `Suspense` com fallback null

#### 3. `index.html` - Adicionar modulepreload do main chunk
- Adicionar `<link rel="modulepreload">` para o entry point `/src/main.tsx`
- Isso ajuda o browser a começar a parsear o JS mais cedo no mobile

#### 4. `src/components/HeroSection.tsx` - Reduzir complexidade inicial
- O `useLazyDataHooks` usa `Promise.all` com 3 dynamic imports que rodam após mount
- Mover o inline SVG background pattern para CSS (evita re-render)

### Arquivos a editar

| Arquivo | Mudança |
|---------|---------|
| `src/components/PackageCard.tsx` | `loading="eager"`, `fetchPriority="high"`, `decoding="async"` |
| `src/App.tsx` | Lazy load `CookieConsent`, `TrackingScripts`, `PageViewTracker`, `PWALifecycle`, `DynamicFavicon` |
| `src/main.tsx` | Nenhuma mudança |

### Resultado esperado
- FCP: ~2.7s → ~1.8s (menos JS bloqueante no primeiro paint)
- LCP: ~4.3s → ~3.0s (imagens dos pacotes carregam eager, menos componentes bloqueando)
- Score mobile: 80 → ~88-92

