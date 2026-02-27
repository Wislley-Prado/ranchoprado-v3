

## Diagnóstico corrigido (Supabase Pro - transformações funcionam)

### Problemas reais

**1. Rancho novo não aparece no celular**
- Cache localStorage com TTL de **15 minutos** (`TTL.LISTS = 15 * 60 * 1000`)
- `refetchOnMount: false` + `refetchOnWindowFocus: false` = dados nunca atualizam enquanto cache é válido
- No celular, abas ficam em background mais tempo, mantendo o cache stale
- Solução: reduzir `staleTime` para 5 minutos e habilitar `refetchOnMount: true`

**2. Imagens demoram a renderizar no celular**
- O `srcSet` com `getOptimizedUrl` está correto para o plano Pro
- Porém `loading="lazy"` nos RanchCards dentro de um `LazySection` com `rootMargin="300px"` cria **double lazy**: a seção só monta quando está a 300px do viewport, e depois as imagens só carregam quando estão no viewport novamente
- Resultado: as imagens começam a baixar muito tarde no mobile
- Solução: usar `loading="eager"` nos cards (já que o LazySection controla quando montar) e aumentar rootMargin para 500px

**3. LazySection atrasa a seção de Ranchos**
- No mobile, há muitas seções antes (Hero, Anúncios, Dam, Lunar, Weather, Anúncios meio) que empurram Ranchos para longe
- `rootMargin="300px"` pode não ser suficiente para iniciar o carregamento antes do scroll chegar

### Plano de correção

#### 1. Reduzir cache e habilitar refetch (`src/hooks/useOptimizedData.ts`)
- `useRanchos`: mudar `staleTime` de `TTL.LISTS` (15min) para `5 * 60 * 1000` (5min)
- Mudar `refetchOnMount: false` para `refetchOnMount: true`
- Manter `refetchOnWindowFocus: false` para não gastar egress

#### 2. Remover double-lazy do RanchCard (`src/components/RanchCard.tsx`)
- Mudar `loading="lazy"` para `loading="eager"` na imagem (o LazySection já controla quando o componente monta)
- Manter `srcSet` e `getOptimizedUrl` (funciona no Pro)

#### 3. Aumentar rootMargin do Ranchos (`src/pages/Index.tsx`)
- Mudar `rootMargin="300px"` para `rootMargin="600px"` na LazySection de RanchosSection para que comece a carregar mais cedo no scroll

### Arquivos a editar

| Arquivo | Mudança |
|---------|---------|
| `src/hooks/useOptimizedData.ts` | staleTime 5min, refetchOnMount true no useRanchos |
| `src/components/RanchCard.tsx` | `loading="eager"` na img |
| `src/pages/Index.tsx` | rootMargin="600px" na LazySection de Ranchos |

