// api/mcp.js - Servidor MCP (Model Context Protocol) do Rancho Prado para Google Gemini
// Permite que o Gemini publique no Blog, crie Anúncios e faça Upload de Imagens

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ranchoprado.vendopro.com.br';
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogInNlcnZpY2Vfcm9sZSIsCiAgImlzcyI6ICJzdXBhYmFzZSIsCiAgImlhdCI6IDE3MTUwNTA4MDAsCiAgImV4cCI6IDE4NzI4MTcyMDAKfQ.O5VK2jG17UYT_PHvXJQV--DGaYPOuAgigi0RRhfJrj0';

// Token secreto para proteger o endpoint
const EXPECTED_TOKEN = process.env.MCP_AUTH_TOKEN || 'rancho_gemini_2026';

// Função para gerar slug amigável a partir do título
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Lista de Ferramentas disponíveis para o Gemini
const TOOLS = [
  {
    name: 'criar_post_blog',
    description:
      'Cria e publica um artigo completo no blog do Rancho Prado. Suporta título, conteúdo rico em HTML/Markdown, resumo, categoria, tags e imagem de capa.',
    inputSchema: {
      type: 'object',
      properties: {
        titulo: {
          type: 'string',
          description: 'Título atraente do artigo do blog (ex: Guia Completo de Pesca de Dourado no Rio São Francisco)'
        },
        conteudo: {
          type: 'string',
          description: 'Conteúdo completo do artigo formatado com títulos, parágrafos e listas (HTML ou Markdown)'
        },
        resumo: {
          type: 'string',
          description: 'Breve resumo / descrição do artigo para visualização nos cards (opcional)'
        },
        categoria: {
          type: 'string',
          description: 'Categoria do artigo (ex: Pesca Esportiva, Dicas, Ecoturismo, Gastronomia, Três Marias)'
        },
        imagem_destaque: {
          type: 'string',
          description: 'URL pública da imagem de capa do post (opcional)'
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Lista de tags relevantes (ex: ["dourado", "rio sao francisco", "pesca esportiva"])'
        },
        publicado: {
          type: 'boolean',
          description: 'Se o post deve ficar visível imediatamente (padrão true)'
        }
      },
      required: ['titulo', 'conteudo']
    }
  },
  {
    name: 'criar_anuncio',
    description:
      'Cria um novo anúncio, banner ou classificado de imóvel/rancho/serviço no Rancho Prado.',
    inputSchema: {
      type: 'object',
      properties: {
        titulo: {
          type: 'string',
          description: 'Título do anúncio (ex: Rancho Beira Rio com Tablado para Pesca)'
        },
        descricao: {
          type: 'string',
          description: 'Descrição detalhada com informações do rancho, barco, guia ou produto'
        },
        subtitulo: {
          type: 'string',
          description: 'Subtítulo do anúncio (opcional)'
        },
        tipo: {
          type: 'string',
          enum: ['banner_principal', 'card_destaque', 'imovel', 'servico'],
          description: 'Tipo do anúncio: banner_principal, card_destaque, imovel ou servico (padrão card_destaque)'
        },
        posicao: {
          type: 'string',
          enum: ['topo', 'meio', 'lateral', 'rodape'],
          description: 'Posição onde o anúncio aparecerá na página (padrão meio)'
        },
        imagem_url: {
          type: 'string',
          description: 'URL pública da imagem do anúncio'
        },
        link_url: {
          type: 'string',
          description: 'Link de destino (link do WhatsApp ou página de reserva)'
        },
        texto_botao: {
          type: 'string',
          description: 'Texto do botão (ex: "Falar no WhatsApp", "Reservar Agora", "Saiba Mais")'
        },
        imovel_preco: {
          type: 'string',
          description: 'Preço formatado (ex: "R$ 450.000" ou "R$ 800/diária") se for rancho/imóvel'
        },
        imovel_localizacao: {
          type: 'string',
          description: 'Localização (ex: "Três Marias - Pontal do Abaeté") se aplicável'
        },
        ativo: {
          type: 'boolean',
          description: 'Se o anúncio já deve entrar no ar ativo (padrão true)'
        },
        destaque: {
          type: 'boolean',
          description: 'Se deve ter destaque especial (padrão false)'
        }
      },
      required: ['titulo', 'descricao']
    }
  },
  {
    name: 'upload_imagem',
    description:
      'Faz upload de uma imagem (via URL da internet ou base64) diretamente para o Storage do Rancho Prado e retorna a URL pública permanente.',
    inputSchema: {
      type: 'object',
      properties: {
        imagem_url_ou_base64: {
          type: 'string',
          description: 'URL da imagem na internet para baixar e salvar, ou string no formato base64'
        },
        nome_arquivo: {
          type: 'string',
          description: 'Nome desejado para o arquivo (ex: pescaria-dourado.jpg)'
        },
        bucket: {
          type: 'string',
          enum: ['blog', 'propriedades-venda', 'ranchos', 'pacotes'],
          description: 'Bucket de destino no Supabase (padrão "blog")'
        }
      },
      required: ['imagem_url_ou_base64']
    }
  },
  {
    name: 'listar_posts_blog',
    description: 'Lista os posts publicados no blog do Rancho Prado para consulta do Gemini.',
    inputSchema: {
      type: 'object',
      properties: {
        limite: {
          type: 'number',
          description: 'Quantidade de posts a listar (padrão 5)'
        }
      }
    }
  },
  {
    name: 'listar_anuncios',
    description: 'Lista os anúncios ativos no Rancho Prado para consulta do Gemini.',
    inputSchema: {
      type: 'object',
      properties: {
        limite: {
          type: 'number',
          description: 'Quantidade de anúncios a listar (padrão 5)'
        }
      }
    }
  },
  {
    name: 'obter_status_site',
    description: 'Retorna estatísticas gerais do Rancho Prado (posts, anúncios, represa).',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

// Utilitário para chamadas REST ao Supabase
async function supabaseFetch(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Supabase Error (${res.status}): ${errorText}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Handlers das ferramentas
async function executarFerramenta(nome, args = {}) {
  switch (nome) {
    case 'criar_post_blog': {
      const {
        titulo,
        conteudo,
        resumo,
        categoria = 'Pesca Esportiva',
        tags = ['pesca', 'tres marias', 'rio sao francisco'],
        imagem_destaque = null,
        publicado = true
      } = args;

      if (!titulo || !conteudo) {
        throw new Error('Título e conteúdo são obrigatórios para criar um post.');
      }

      const baseSlug = slugify(titulo);
      const uniqueSuffix = Math.floor(Math.random() * 1000);
      const slug = `${baseSlug}-${uniqueSuffix}`;
      const postResumo =
        resumo ||
        conteudo
          .replace(/<[^>]*>?/gm, '')
          .slice(0, 160)
          .trim() + '...';

      const postData = {
        titulo,
        slug,
        conteudo,
        resumo: postResumo,
        categoria,
        tags: Array.isArray(tags) ? tags : [tags],
        imagem_destaque,
        publicado,
        data_publicacao: new Date().toISOString()
      };

      const result = await supabaseFetch('/blog_posts', {
        method: 'POST',
        body: JSON.stringify(postData)
      });

      const criado = Array.isArray(result) ? result[0] : result;
      return {
        sucesso: true,
        mensagem: 'Post criado com sucesso no Blog do Rancho Prado!',
        post: {
          id: criado?.id,
          titulo: criado?.titulo,
          slug: criado?.slug,
          categoria: criado?.categoria,
          publicado: criado?.publicado,
          url_post: `https://ranchoprado.com.br/blog/${criado?.slug}`
        }
      };
    }

    case 'criar_anuncio': {
      const {
        titulo,
        descricao,
        subtitulo = '',
        tipo = 'card_destaque',
        posicao = 'meio',
        imagem_url = '',
        link_url = '',
        texto_botao = 'Saiba Mais',
        imovel_preco = '',
        imovel_area = '',
        imovel_localizacao = '',
        ativo = true,
        destaque = false
      } = args;

      if (!titulo || !descricao) {
        throw new Error('Título e descrição são obrigatórios para criar um anúncio.');
      }

      const anuncioData = {
        titulo,
        subtitulo,
        descricao,
        tipo,
        posicao,
        imagem_url,
        link_url,
        texto_botao,
        imovel_preco,
        imovel_area,
        imovel_localizacao,
        ativo,
        destaque,
        ordem: 0,
        duracao_exibicao: 8
      };

      const result = await supabaseFetch('/anuncios', {
        method: 'POST',
        body: JSON.stringify(anuncioData)
      });

      const criado = Array.isArray(result) ? result[0] : result;
      return {
        sucesso: true,
        mensagem: 'Anúncio cadastrado com sucesso no Rancho Prado!',
        anuncio: {
          id: criado?.id,
          titulo: criado?.titulo,
          tipo: criado?.tipo,
          posicao: criado?.posicao,
          ativo: criado?.ativo
        }
      };
    }

    case 'upload_imagem': {
      const { imagem_url_ou_base64, nome_arquivo, bucket = 'blog' } = args;

      if (!imagem_url_ou_base64) {
        throw new Error('imagem_url_ou_base64 é obrigatória.');
      }

      let buffer;
      let contentType = 'image/jpeg';
      let extension = 'jpg';

      if (imagem_url_ou_base64.startsWith('http://') || imagem_url_ou_base64.startsWith('https://')) {
        // Baixar imagem da internet
        const imgRes = await fetch(imagem_url_ou_base64);
        if (!imgRes.ok) {
          throw new Error(`Falha ao baixar imagem remota: ${imgRes.status}`);
        }
        contentType = imgRes.headers.get('content-type') || 'image/jpeg';
        const arrayBuf = await imgRes.arrayBuffer();
        buffer = Buffer.from(arrayBuf);
      } else {
        // Formato base64 (ex: data:image/png;base64,...)
        let base64Data = imagem_url_ou_base64;
        const match = imagem_url_ou_base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (match) {
          contentType = match[1];
          base64Data = match[2];
        }
        buffer = Buffer.from(base64Data, 'base64');
      }

      if (contentType.includes('png')) extension = 'png';
      else if (contentType.includes('webp')) extension = 'webp';
      else if (contentType.includes('gif')) extension = 'gif';

      const cleanName = nome_arquivo ? slugify(nome_arquivo.replace(/\.[^/.]+$/, '')) : 'imagem';
      const finalFileName = `${cleanName}-${Date.now()}.${extension}`;

      // Upload para o Storage do Supabase
      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${finalFileName}`;
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SERVICE_KEY}`,
          apikey: SERVICE_KEY,
          'Content-Type': contentType
        },
        body: buffer
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Erro ao salvar imagem no Storage: ${errText}`);
      }

      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${finalFileName}`;
      return {
        sucesso: true,
        mensagem: 'Upload de imagem realizado com sucesso!',
        arquivo: finalFileName,
        bucket,
        url_publica: publicUrl
      };
    }

    case 'listar_posts_blog': {
      const limite = Number(args.limite) || 5;
      const posts = await supabaseFetch(
        `/blog_posts?select=id,titulo,slug,categoria,resumo,imagem_destaque,data_publicacao,publicado&order=created_at.desc&limit=${limite}`
      );
      return {
        sucesso: true,
        quantidade: posts?.length || 0,
        posts: posts || []
      };
    }

    case 'listar_anuncios': {
      const limite = Number(args.limite) || 5;
      const anuncios = await supabaseFetch(
        `/anuncios?select=id,titulo,subtitulo,tipo,posicao,imagem_url,imovel_preco,ativo&order=created_at.desc&limit=${limite}`
      );
      return {
        sucesso: true,
        quantidade: anuncios?.length || 0,
        anuncios: anuncios || []
      };
    }

    case 'obter_status_site': {
      const [postsCount, anunciosCount] = await Promise.all([
        supabaseFetch('/blog_posts?select=id', { prefer: 'count=exact' }),
        supabaseFetch('/anuncios?select=id', { prefer: 'count=exact' })
      ]);
      return {
        sucesso: true,
        site: 'Rancho Prado - Rio São Francisco',
        total_posts: postsCount?.length || 0,
        total_anuncios: anunciosCount?.length || 0,
        servidor_mcp: 'Online e Operacional'
      };
    }

    default:
      throw new Error(`Ferramenta desconhecida: "${nome}"`);
  }
}

// Handler da Serverless Function na Vercel
export default async function handler(req, res) {
  // Configuração completa de CORS para o Google Gemini
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-api-key, mcp-session-id, Accept'
  );

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verificação de autenticação (se o Gemini enviar token)
  const headers = req.headers || {};
  const authHeader = headers.authorization || headers['x-api-key'];
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (token !== EXPECTED_TOKEN && EXPECTED_TOKEN !== 'rancho_gemini_2026') {
      return res.status(401).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Não autorizado: Token inválido.' }
      });
    }
  }

  // Suporte a handshake GET (ex: quando Gemini testa a URL ou SSE)
  if (req.method === 'GET' || req.method === 'HEAD') {
    const accept = req.headers.accept || '';

    // Se o cliente pedir Server-Sent Events (SSE)
    if (accept.includes('text/event-stream')) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.write(`event: endpoint\ndata: /api/mcp\n\n`);
      return res.end();
    }

    // Resposta padrão informativa de status
    return res.status(200).json({
      status: 'online',
      name: 'Rancho Prado MCP Server',
      protocolVersion: '2024-11-05',
      description:
        'Servidor MCP oficial do Rancho Prado para publicação no Blog, Anúncios e Upload de Imagens pelo Google Gemini.',
      tools_available: TOOLS.map((t) => t.name)
    });
  }

  // Requisições POST (Protocolo JSON-RPC 2.0 do MCP)
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { jsonrpc = '2.0', id, method, params = {} } = body || {};

      // 1. Handshake inicial MCP
      if (method === 'initialize') {
        return res.status(200).json({
          jsonrpc: '2.0',
          id: id ?? 1,
          result: {
            protocolVersion: params.protocolVersion || '2024-11-05',
            capabilities: {
              tools: {
                listChanged: false
              }
            },
            serverInfo: {
              name: 'rancho-prado-mcp',
              version: '1.0.0'
            }
          }
        });
      }

      // 2. Confirmação de inicialização
      if (method === 'notifications/initialized' || method === 'initialized') {
        if (id !== undefined && id !== null) {
          return res.status(200).json({ jsonrpc: '2.0', id, result: {} });
        }
        return res.status(200).end();
      }

      // 3. Ping / Liveness
      if (method === 'ping') {
        return res.status(200).json({ jsonrpc: '2.0', id, result: {} });
      }

      // 4. Listagem de Ferramentas disponíveis
      if (method === 'tools/list') {
        return res.status(200).json({
          jsonrpc: '2.0',
          id,
          result: {
            tools: TOOLS
          }
        });
      }

      // 5. Execução de Ferramentas
      if (method === 'tools/call') {
        const toolName = params.name;
        const toolArgs = params.arguments || {};

        try {
          const resultado = await executarFerramenta(toolName, toolArgs);
          return res.status(200).json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(resultado, null, 2)
                }
              ],
              isError: false
            }
          });
        } catch (execError) {
          console.error(`Erro ao executar ferramenta ${toolName}:`, execError);
          return res.status(200).json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `Erro na execução: ${execError.message}`
                }
              ],
              isError: true
            }
          });
        }
      }

      // Método não suportado
      return res.status(200).json({
        jsonrpc: '2.0',
        id: id ?? null,
        error: {
          code: -32601,
          message: `Método MCP não encontrado: ${method}`
        }
      });
    } catch (parseError) {
      console.error('Erro ao processar JSON-RPC MCP:', parseError);
      return res.status(400).json({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: `Erro ao analisar JSON: ${parseError.message}`
        }
      });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
