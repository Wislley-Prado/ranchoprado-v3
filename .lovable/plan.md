

## Análise do PageSpeed - Nota 84

### O que está bom
- **TBT 20ms** e **CLS 0** - excelentes, JavaScript e layout estáveis
- Code-splitting, lazy loading e YouTube facade já implementados

### Problemas principais

| Métrica | Atual | Ideal | Causa provável |
|---------|-------|-------|----------------|
| FCP | 2.6s | <1.8s | CSS do Tailwind grande + JS inicial |
| LCP | 3.6s | <2.5s | Thumbnail YouTube (`hqdefault.jpg`) como elemento LCP |
| Speed Index | 4.5s | <3.4s | Consequência do FCP/LCP altos |

### Plano de otimização para subir para 90+

#### 1. Preload da imagem LCP (thumbnail YouTube)
O LCP é a thumbnail do YouTube no Hero. Adicionar `<link rel="preload">` no `index.html` para que o browser comece a baixar antes de processar o JS. Alternativa: usar `sddefault.jpg` (menor) ao invés de `hqdefault.jpg`.

#### 2. Inline critical CSS / reduzir CSS não usado
O Tailwind gera um CSS grande. Adicionar `content` mais restritivo no `tailwind.config.ts` para reduzir CSS morto. Considerar `cssnano` no PostCSS.

#### 3. Preload do chunk principal
Adicionar `modulepreload` para o chunk do Hero no `index.html` para acelerar o FCP.

#### 4. Otimizar o Hero para renderizar sem esperar dados
O Hero já usa placeholders, mas ainda importa 3 hooks (`useWeatherData`, `useDamData`, `useVideoSettings`). Mover esses hooks para serem carregados após a primeira renderização usando `useEffect` com estado lazy.

#### 5. Adicionar `font-display: swap` e preconnect
Embora não haja fontes externas, garantir que fontes do sistema sejam usadas sem bloqueio.

### Arquivos a editar

| Arquivo | Mudança |
|---------|---------|
| `index.html` | Adicionar `<link rel="preload" as="image">` para thumbnail YouTube |
| `src/components/HeroSection.tsx` | Usar `sddefault.jpg` (menor) + defer hooks de dados |
| `postcss.config.js` | Adicionar `cssnano` para minificar CSS em produção |
| `vite.config.ts` | Habilitar `cssMinify` e `rollupOptions.output.manualChunks` para separar vendor |

### Impacto esperado
- FCP: 2.6s → ~1.8s (preload + CSS menor)
- LCP: 3.6s → ~2.2s (preload thumbnail + imagem menor)
- Score: 84 → ~90-92

