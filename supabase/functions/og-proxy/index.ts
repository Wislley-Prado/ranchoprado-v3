import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "";
    const baseUrl = url.searchParams.get("baseUrl") || "https://ranchoprado.com.br";

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://elteoovghevwrefykkyh.supabase.co";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdGVvb3ZnaGV2d3JlZnlra3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTMwODMsImV4cCI6MjA5NTc2OTA4M30.rlNr3KOMAH-QlwUwsbNQZYiW6W66HMiUnSG1ZuZpvb0";
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    let title = "Rancho Prado | Rio São Francisco ao Vivo";
    let description = "Sua experiência de pesca no Rio São Francisco começa no Rancho Prado! Ranchos exclusivos e pacotes personalizados em Três Marias/MG.";
    let image = `${baseUrl}/og-image.png`;
    let pageUrl = baseUrl;

    // Parse the path to determine content type
    const pathParts = path.split("/").filter(Boolean);
    
    if (pathParts[0] === "blog" && pathParts[1]) {
      // Blog post
      const slug = pathParts[1];
      const { data: post } = await supabase
        .from("blog_posts")
        .select("titulo, resumo, imagem_destaque, slug")
        .eq("slug", slug)
        .eq("publicado", true)
        .single();

      if (post) {
        title = `${post.titulo} | Blog Rancho Prado`;
        description = post.resumo || post.titulo;
        image = post.imagem_destaque || `${baseUrl}/og-image.png`;
        pageUrl = `${baseUrl}/blog/${post.slug}`;
      }
    } else if (pathParts[0] === "rancho" && pathParts[1]) {
      // Rancho
      const slug = pathParts[1];
      const { data: rancho } = await supabase
        .from("ranchos")
        .select("id, nome, descricao, localizacao, slug")
        .eq("slug", slug)
        .single();

      if (rancho) {
        // Get main image
        const { data: imagens } = await supabase
          .from("rancho_imagens")
          .select("url")
          .eq("rancho_id", rancho.id)
          .eq("principal", true)
          .limit(1);

        title = `${rancho.nome} | Rancho em ${rancho.localizacao} - Rancho Prado`;
        description = rancho.descricao?.substring(0, 160) || `Rancho ${rancho.nome} em ${rancho.localizacao}`;
        image = imagens?.[0]?.url || `${baseUrl}/og-image.png`;
        pageUrl = `${baseUrl}/rancho/${rancho.slug}`;
      }
    } else if (pathParts[0] === "pacote" && pathParts[1]) {
      // Pacote
      const slug = pathParts[1];
      const { data: pacote } = await supabase
        .from("pacotes")
        .select("id, nome, descricao, duracao, pessoas, slug")
        .eq("slug", slug)
        .single();

      if (pacote) {
        // Get main image
        const { data: imagens } = await supabase
          .from("pacote_imagens")
          .select("url")
          .eq("pacote_id", pacote.id)
          .eq("principal", true)
          .limit(1);

        title = `${pacote.nome} | Pacote de Pesca - Rancho Prado`;
        description = pacote.descricao?.substring(0, 160) || `Pacote ${pacote.nome}. ${pacote.duracao} para ${pacote.pessoas} pessoas.`;
        image = imagens?.[0]?.url || `${baseUrl}/og-image.png`;
        pageUrl = `${baseUrl}/pacote/${pacote.slug}`;
      }
    }

    // Generate HTML with proper OG tags
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Rancho Prado">
  <meta property="og:locale" content="pt_BR">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${pageUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  
  <!-- WhatsApp specific -->
  <meta property="og:image:secure_url" content="${image}">
  
  <!-- Redirect to the actual page after crawlers read the meta tags -->
  <meta http-equiv="refresh" content="0;url=${pageUrl}">
  <link rel="canonical" href="${pageUrl}">
</head>
<body>
  <p>Redirecionando para <a href="${pageUrl}">${title}</a>...</p>
  <script>window.location.href = "${pageUrl}";</script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
