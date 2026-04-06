

## Diagnóstico: Imagens dos ranchos não atualizam no admin

### Causa raiz encontrada

O problema é de **cache**, tanto no React Query quanto no localStorage.

1. **Query keys desalinhadas**: A página admin de ranchos (`Ranchos.tsx`) usa `queryKey: ['admin-ranchos']`, mas quando você salva um rancho no `RanchoEditar.tsx`, o `handleSuccess` invalida apenas `['rancho', id]` e `['ranchos']` — nunca invalida `['admin-ranchos']`. Resultado: ao voltar para a listagem, o React Query serve os dados antigos.

2. **Cache localStorage persistente**: O `cachedQuery` no `useOptimizedData` salva dados no localStorage com TTL de 15 minutos (`TTL.LISTS`). Mesmo que o React Query seja invalidado, o localStorage pode servir dados velhos na próxima navegação.

3. **`refetchOnMount: false`** nos hooks públicos: Se o admin navega para a página pública para verificar, os dados também ficam estáticos.

### Plano de correção

| # | Arquivo | Ação |
|---|---------|------|
| 1 | `src/pages/admin/RanchoEditar.tsx` | Adicionar invalidação de `['admin-ranchos']` + limpar cache localStorage com `invalidateCacheByPrefix('ranchos')` |
| 2 | `src/pages/admin/Ranchos.tsx` | Mesma coisa no `refetch` — garantir que ao deletar um rancho, o cache localStorage também seja limpo |
| 3 | `src/components/admin/rancho/DeleteRanchoDialog.tsx` | Verificar se `onSuccess` também limpa cache localStorage |

A correção é simples: ao salvar/deletar um rancho no admin, invalidar **todas** as query keys relacionadas (`admin-ranchos`, `ranchos`, `rancho`) E limpar o cache do localStorage para garantir dados frescos.

