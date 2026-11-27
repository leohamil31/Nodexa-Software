# Site Nodexa Software

## O que tem nesta pasta
- `index.html`: o site completo (uma página só, já pronto para celular e computador)
- `app.js`: as animações e o formulário do site
- `_headers`: regras de segurança que a Netlify aplica sozinha (não precisa mexer)
- `politica-de-privacidade.html`: a política de privacidade (LGPD)
- `og.jpg`: a imagem que aparece quando alguém compartilha o link no WhatsApp, LinkedIn etc.
- `404.html`: página de "não encontrada" (a Netlify usa sozinha)
- `obrigado.html`: página de agradecimento depois do formulário
- `termos-de-uso.html`: os termos de uso
- `consent.js`: o aviso de cookies e o Google Analytics
- `favicon.ico`, `icons/` e `site.webmanifest`: ícones da aba, do iPhone, do Android e do atalho na tela inicial
- `llms.txt`: um resumo da empresa para ferramentas de IA (ChatGPT, Gemini, Perplexity) entenderem e citarem o site
- `favicon.svg`: o ícone que aparece na aba do navegador
- `logo/`: o logo em SVG (fundo claro, fundo escuro, símbolo e ícone de app)
- `robots.txt` e `sitemap.xml`: arquivos que ajudam o Google a encontrar o site

## Antes de publicar, troque no `index.html`
1. **WhatsApp:** procure `5511999999999` no `index.html`, no `app.js` **e** no `obrigado.html` e coloque o seu número (55 + DDD + número, só números).
   Troque também o texto `(11) 99999-9999`.
2. **E-mail:** procure `contato@nodexa.com.br` no `index.html`, na `politica-de-privacidade.html`, nos `termos-de-uso.html` e no `llms.txt` e coloque o seu.
3. **Redes sociais:** procure `https://instagram.com/` e `https://linkedin.com/` e coloque os links dos seus perfis.
4. Apague a linha "Telefone e e-mail de exemplo: troque pelos seus."

O site já está configurado para o endereço do GitHub Pages (`https://leohamil31.github.io/Nodexa-Software`). Quando tiver um domínio próprio, troque esse endereço pelo seu em **todos** estes arquivos: `index.html`, `politica-de-privacidade.html`, `termos-de-uso.html`, `obrigado.html`, `404.html`, `llms.txt`, `robots.txt` e `sitemap.xml`. Sem isso, a imagem de compartilhamento não aparece.

Leia a `politica-de-privacidade.html` e ajuste o que for diferente na sua empresa. Se tiver dúvida, peça a um advogado para revisar.

## Como colocar no ar (grátis)
1. Crie uma conta em https://app.netlify.com
2. Arraste esta pasta inteira para a área "Deploy" (Add new site → Deploy manually).
3. Em "Domain settings", ligue o seu domínio (comprado no https://registro.br).

## Como aparecer no Google
1. Cadastre o site no Google Search Console (https://search.google.com/search-console) e envie o `sitemap.xml`.
2. Crie o Perfil da Empresa no Google (https://business.google.com).
3. Coloque o link do site na bio do Instagram, do LinkedIn e no WhatsApp Business.

## Segurança (já incluída)
- **HTTPS:** a Netlify ativa o cadeado sozinha, e o `_headers` obriga o navegador a sempre usar HTTPS.
- **Cabeçalhos de proteção:** o `_headers` bloqueia scripts de fora, impede que o site seja colocado dentro de outro site (clickjacking) e desliga câmera, microfone e localização.
- **Formulário:** os campos têm limite de tamanho, o texto é limpo antes de ir para o WhatsApp e há uma "isca" invisível que barra robôs de spam.
- **Sem senhas nem chaves no site:** nada secreto fica no código.

**Atenção:** se você mudar o pequeno script que fica no `<head>` do `index.html`, o navegador vai bloqueá-lo. Nesse caso, me peça para atualizar o `_headers`. O `app.js` pode ser editado à vontade.

Quando o site ganhar login, banco de dados ou painel, entram os outros itens de segurança: senhas com hash, MFA, limite de tentativas, proteção contra SQL injection, backups e controle de acesso.

## Google Analytics + aviso de cookies
1. Crie uma conta em https://analytics.google.com e uma "propriedade" para o site.
2. Copie o ID que começa com `G-` (ex.: `G-AB12CD34EF`).
3. No arquivo `consent.js`, troque `G-XXXXXXXXXX` pelo seu ID.

Pronto: o aviso de cookies passa a aparecer, e o Analytics só liga para quem clicar em **Aceitar** (como pede a LGPD). Os pedidos de orçamento aparecem no Analytics como o evento `generate_lead`. Enquanto o ID não for colocado, o aviso fica escondido, porque o site não usa nenhum cookie.

## Publicado no GitHub Pages
O site está no ar em **https://leohamil31.github.io/Nodexa-Software/** e atualiza sozinho a cada envio (push) para a branch `main` do repositório.

Para usar um domínio próprio no GitHub Pages: em *Settings → Pages → Custom domain* coloque o domínio, aponte o DNS no registro.br como o GitHub indicar e marque *Enforce HTTPS*.

Observação: o GitHub Pages não lê o arquivo `_headers` (ele é da Netlify). Por isso as principais regras de segurança também estão dentro das páginas. Se um dia mudar para a Netlify, o `_headers` passa a valer sozinho.

## Créditos
Ícones do WhatsApp e do Instagram: Font Awesome Free (https://fontawesome.com), licença CC BY 4.0. As marcas pertencem aos seus donos e são usadas só para indicar os links de contato.
