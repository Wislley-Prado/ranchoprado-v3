-- Criar bucket de storage para configuracoes se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('configuracoes', 'configuracoes', true)
ON CONFLICT (id) DO NOTHING;
