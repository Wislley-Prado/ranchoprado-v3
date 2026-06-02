/**
 * Script para corrigir políticas de storage do Supabase
 * Adiciona SELECT policies que estavam faltando nos buckets
 * Uso: node scripts/fix-storage-policies.mjs
 */

const SUPABASE_URL = 'https://elteoovghevwrefykkyh.supabase.co';
const PROJECT_ID = 'elteoovghevwrefykkyh';

// SQL para corrigir as policies
const SQL = `
-- Adicionar políticas SELECT públicas para os buckets que estavam sem elas
-- Sem SELECT, o Supabase não consegue fazer upload (upsert = INSERT + SELECT + UPDATE)

-- BUCKET: configuracoes
DROP POLICY IF EXISTS "Imagens de configuracoes são públicas" ON storage.objects;
CREATE POLICY "Imagens de configuracoes são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'configuracoes');

-- BUCKET: pacotes
DROP POLICY IF EXISTS "Imagens de pacotes são públicas" ON storage.objects;
CREATE POLICY "Imagens de pacotes são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'pacotes');

-- BUCKET: blog
DROP POLICY IF EXISTS "Imagens do blog são públicas" ON storage.objects;
CREATE POLICY "Imagens do blog são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog');

-- Garantir que o bucket configuracoes existe e é público
INSERT INTO storage.buckets (id, name, public)
VALUES ('configuracoes', 'configuracoes', true)
ON CONFLICT (id) DO UPDATE SET public = true;
`;

// Tentar usar a Management API do Supabase com token pessoal
// OU mostrar o SQL para o usuário executar manualmente

console.log('\n====================================================');
console.log('🔧 CORREÇÃO DE POLÍTICAS DE STORAGE DO SUPABASE');
console.log('====================================================\n');

console.log('❌ PROBLEMA IDENTIFICADO:');
console.log('   Os buckets "configuracoes", "pacotes" e "blog" não têm');
console.log('   política SELECT, o que impede uploads no Supabase Storage.\n');

console.log('✅ SOLUÇÃO:');
console.log('   Execute o SQL abaixo no Supabase SQL Editor:\n');
console.log('   URL: https://supabase.com/dashboard/project/' + PROJECT_ID + '/sql/new\n');
console.log('------- COPIE O SQL ABAIXO -------\n');
console.log(SQL);
console.log('-----------------------------------\n');
console.log('Após executar o SQL, o upload de imagens deve funcionar normalmente.\n');
