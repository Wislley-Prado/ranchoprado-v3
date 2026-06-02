-- Agendar cron job para atualizar dados da represa 4x ao dia (06h, 12h, 18h, 00h BRT = 09h, 15h, 21h, 03h UTC)
SELECT cron.schedule(
  'atualizar-dados-represa',
  '0 9,15,21,3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://elteoovghevwrefykkyh.supabase.co/functions/v1/dam-data-proxy',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdGVvb3ZnaGV2d3JlZnlra3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTMwODMsImV4cCI6MjA5NTc2OTA4M30.rlNr3KOMAH-QlwUwsbNQZYiW6W66HMiUnSG1ZuZpvb0"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);