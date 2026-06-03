-- Alter columns defaults for site_settings table to refer to Rancho Prado and ranchoprado.com.br
ALTER TABLE public.site_settings 
  ALTER COLUMN copyright_text SET DEFAULT '© 2026 Rancho Prado. Todos os direitos reservados.',
  ALTER COLUMN email_contato SET DEFAULT 'contato@ranchoprado.com.br',
  ALTER COLUMN whatsapp_titulo SET DEFAULT 'Rancho Prado - Atendimento',
  ALTER COLUMN whatsapp_mensagem_padrao SET DEFAULT 'Olá! Gostaria de saber mais sobre os pacotes de pesca no Rancho Prado.';

-- Update the existing settings row if it still has the old brand defaults
UPDATE public.site_settings
SET 
  copyright_text = CASE 
    WHEN copyright_text = '© 2025 PradoAqui. Todos os direitos reservados' THEN '© 2026 Rancho Prado. Todos os direitos reservados.'
    ELSE copyright_text 
  END,
  email_contato = CASE 
    WHEN email_contato = 'contato@pradoaqui.com.br' THEN 'contato@ranchoprado.com.br'
    ELSE email_contato 
  END,
  whatsapp_titulo = CASE 
    WHEN whatsapp_titulo = 'PradoAqui - Atendimento' THEN 'Rancho Prado - Atendimento'
    ELSE whatsapp_titulo 
  END,
  whatsapp_mensagem_padrao = CASE 
    WHEN whatsapp_mensagem_padrao = 'Olá! Gostaria de saber mais sobre os pacotes de pesca no PradoAqui.' THEN 'Olá! Gostaria de saber mais sobre os pacotes de pesca no Rancho Prado.'
    ELSE whatsapp_mensagem_padrao 
  END
WHERE id = '00000000-0000-0000-0000-000000000001';
