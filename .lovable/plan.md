

## Problema: Imagens demoram ~5s para aparecer e causam "pulo" na página

### Causa raiz

O `LazySection` com `fallback={<SectionSkeleton />}` renderiza um skeleton de **256px** (`h-64`). Quando a seção real monta (com 3+ cards de ~500px cada), a página pula. Além disso, o fluxo atual é:

1. Scroll chega perto → LazySection monta o componente
2. React.lazy baixa o chunk JS → Suspense exibe skeleton
3. Componente monta → React Query busca dados do Supabase (mesmo com cache, leva 100-300ms)
4. Dados chegam → Imagens começam a baixar (~2-5s no celular)

São **4 etapas sequenciais** antes da imagem aparecer.

### Solução: Remover LazySection dos Ranchos e Pacotes

Essas são seções **críticas para o negócio** - o usuário quer vê-las imediatamente. O LazySection fazia sentido para reduzir DOM inicial, mas está prejudicando a experiência.

### Arquivos a editar

**1. `src/pages/Index.tsx`**
- Remover `LazySection` wrapper de `RanchosSection` e `PackagesSection`
- Manter apenas o `Suspense` com fallback
- Isso permite que o chunk JS e os dados comecem a carregar **imediatamente** ao montar a página, não apenas quando o usuário scrolla

**2. `src/components/LazySection.tsx`**
- Adicionar `min-height` no div do fallback para evitar layout shift nas seções que continuam lazy

**3. `src/components/RanchCard.tsx`**
- Adicionar `fetchpriority="high"` na imagem para que o browser priorize o download

### Resultado esperado
- Ranchos e Pacotes já estarão com dados carregados quando o usuário scrollar
- Imagens começam a baixar antes, aparecendo instantaneamente ao scrollar
- Sem "pulo" na página

