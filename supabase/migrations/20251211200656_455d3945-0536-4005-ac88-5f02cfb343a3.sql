-- Agendar cron job para atualizar dados da represa 4x ao dia (06h, 12h, 18h, 00h BRT = 09h, 15h, 21h, 03h UTC)
SELECT cron.schedule(
  'atualizar-dados-represa',
  '0 9,15,21,3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://ranchoprado.vendopro.com.br/functions/v1/dam-data-proxy',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.0if6RmuwClXzN1FBo0qE4a8TNRrKEuVMPDC4PVK9O2A"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);