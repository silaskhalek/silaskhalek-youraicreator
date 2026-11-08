# Silas Khalek · Your AI Creator

Site pessoal do Silas Khalek: consultoria de IA e serviços personalizados com a equipe BLDRX.

Site estático (HTML + CSS + JS puro), sem build. Para ver localmente:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Configuração

Edite o objeto `CONFIG` no topo de `script.js`:

- `instagram`: seu @ sem o "@". Vazio esconde os links do Instagram.
- `whatsapp`: número com DDI e DDD (ex.: `5511999999999`). Os botões de contato abrem uma conversa no WhatsApp com a mensagem pronta.

## Comandos dos terminais

Os pedidos que aparecem digitando nos terminais ficam na lista `SCENARIOS` em `script.js`
(ferramenta, pasta, comando, etapas e resultado). A ordem bate com as abas da seção "O método":
Claude, ChatGPT, Gemini e Higgsfield.

## Foto

A foto do topo fica em `assets/silas-hero.jpg` (computador) e `assets/silas-hero-sm.jpg` (celular). Para trocar, substitua os arquivos mantendo os nomes.

## Publicar

Funciona direto na Vercel, Netlify ou GitHub Pages: é só apontar para a raiz do repositório, sem comando de build.

## Preloader

A abertura com a galáxia fica em `preloader.js`. Na primeira visita da sessão ela dura cerca de 4 segundos; nas seguintes, uma versão curta. Um clique pula a animação, e quem usa "reduzir movimento" no sistema não vê a abertura.

## Logo

O logo SK fica em `assets/logo-sk.svg` e também dentro do `index.html` (no `<symbol id="sk-logo">`, usado no menu, no rodapé e na abertura, onde as partículas formam o logo). O ícone da aba é o `favicon.svg` e o do iPhone, `assets/apple-touch-icon.png`.

## Idiomas (português e inglês)

O botão com as bandeiras no menu troca o site entre português e inglês, e a escolha fica salva no navegador da pessoa. O site abre em português por padrão.

As traduções ficam em `i18n.js`, num dicionário "texto em português → texto em inglês". Ao mudar ou incluir um texto no `index.html`, adicione a tradução lá também; o que não estiver no dicionário continua em português. Os comandos dos terminais em inglês ficam em `SCENARIOS_EN`, no `script.js`.

## Prévia de compartilhamento

A imagem que aparece ao mandar o link (`assets/og-image.jpg`, 1200×630) é um print do topo do site. Se o topo mudar, gere de novo e aumente o número em `?v=` nas tags `og:image` do `index.html`, pra o WhatsApp buscar a imagem nova.

## Vídeo do tabuleiro (Como funciona)

A seção "Como funciona" fica presa na tela e o vídeo do tabuleiro (`assets/xadrez*.mp4/.webm`) avança com a rolagem. Os vídeos foram gerados com um quadro-chave por quadro (`-g 1` no ffmpeg) pra rolar liso pra frente e pra trás; o `-m` é a versão recortada em pé pro celular. Se trocar o vídeo, gere de novo com essas mesmas opções.

## Rolagem suave

A rolagem com inércia vem do [Lenis](https://github.com/darkroomengineering/lenis) (1,2 s de deslize), integrado ao GSAP no começo do `script.js`. Atenção: o arquivo do Lenis cria variáveis globais de uma letra (`t`, `i`, `e`, `s`, `o`, `n`, `r`), então não use esses nomes no nível de cima do `script.js`. Quem ativa "reduzir movimento" no sistema fica com a rolagem normal.
