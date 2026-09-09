# Luiz Eduardo OS — Portfólio

Portfólio pessoal em HTML/CSS/JavaScript com estética inspirada no Windows 7/Aero.

## Estrutura

```
index.html                 marcação da área de trabalho
404.html                   página de erro no mesmo tema
.nojekyll                  publica os arquivos sem processamento do Jekyll
assets/css/styles.css      estilos
assets/js/portfolio-data.js  conteúdo (window.PORTFOLIO)
assets/js/app.js           janelas, menu iniciar, busca e media player
assets/img/                foto, ícones e imagem de compartilhamento
assets/docs/               PDF do currículo Lattes (opcional)
```

Editar o conteúdo do portfólio significa, na prática, editar `assets/js/portfolio-data.js`.

## Publicação no GitHub Pages

1. Envie os arquivos para o branch `main`.
2. Em **Settings → Pages**, selecione *Deploy from a branch*, branch `main` e pasta `/ (root)`.
3. O site fica disponível em `https://luizeduardocosta.github.io/portifolio/`.

Se o repositório for renomeado ou passar a usar domínio próprio, atualize as URLs absolutas do `<head>` do `index.html` (`canonical`, `og:url`, `og:image`, `twitter:image`) e o link de retorno do `404.html`.

## Uso local
Por causa das requisições relativas, abrir `index.html` direto pelo sistema de arquivos funciona parcialmente. Prefira um servidor local — por exemplo `npx serve .` — ou a própria publicação por HTTPS.

## Currículo Lattes em PDF
A janela **Currículo Lattes** incorpora `assets/docs/curriculo-lattes-luiz-eduardo.pdf`. Enquanto o arquivo não for publicado, a janela exibe um aviso e mantém o link para a versão online do Lattes.

## Conteúdo incorporado
- trajetória profissional e acadêmica do Currículo Lattes;
- projetos e produção técnica;
- livro **Entre a Lâmina e o Espelho**, com dados editoriais e link oficial da UICLAP;
- ISNI de Luiz Eduardo de Carvalho Costa;
- perfis dos projetos artísticos **Dado Ziul**, **Cicatriz Invisível** e **Filho Pródigo**;
- discografia detalhada com capas, UPCs, datas, gêneros, gravadoras, durações, faixas, ISRCs e créditos autorais/técnicos;
- links públicos de streaming, YouTube, redes e Letras.com quando informados.

## Discografia documentada
A seção **Produção Criativa** reúne atualmente **18 lançamentos** e **124 faixas** nas edições documentadas, distribuídos entre Dado Ziul, Cicatriz Invisível e Filho Pródigo.

### Dado Ziul
6 lançamentos detalhados: **Reflexo**, **Última Nota**, **Banquete de Ratos (O Algoritmo da Fome)**, **O CEP do Sistema**, **Sangue de Manequim** e **Favela Federal**.

### Cicatriz Invisível
6 lançamentos detalhados: **2002**, **2003**, **Onde a Luz Não Chega**, **Pensamentos Confusos**, **Ao Apagar das Luzes** e **O Rastro de Giz**.

O mini álbum **Ao Apagar das Luzes** está identificado como versão ao vivo e possui ISRCs próprios das performances, além de créditos por faixa.

### Filho Pródigo
6 lançamentos detalhados e 31 faixas:
- **Faz Novo em Mim** — álbum;
- **O Coração Que Clama** — álbum;
- **Na Tua Mesa** — single, versão demo;
- **Ainda Há Tempo** — álbum;
- **Quem fez o Céu?** — single, versão demo;
- **No Silêncio, Te Encontro** — mini álbum, versão ao vivo.

Os créditos informados incluem composição, letras, vocais, guitarra, baixo e produção, conforme cada fonograma. Todas as faixas de Filho Pródigo listadas nesta versão estão marcadas como não explícitas.

## Letras publicadas
O portfólio referencia páginas públicas de letras sem reproduzir letras integrais:
- Dado Ziul: https://www.letras.com/dado-ziul/
- Cicatriz Invisível: https://www.letras.com/cicatriz-invisivel/
- Filho Pródigo: https://www.letras.com/filho-prodigo/

## Observações técnicas
As capas do livro e dos lançamentos musicais são carregadas a partir dos endereços públicos informados e, portanto, exigem conexão com a internet para serem exibidas.

## Media Player Classic / Deezer

O portfólio inclui uma janela inspirada no **Media Player Classic**, mas a reprodução musical interna passa a usar o **widget oficial do Deezer**. A biblioteca, as capas e a tracklist continuam sendo controladas pelo próprio portfólio; dentro da área de reprodução, play, pause, volume e seleção de faixa ficam a cargo dos controles oficiais do Deezer.

Cada lançamento pode receber uma URL/ID do Deezer no nível do álbum/single. Não é necessário cadastrar as faixas individualmente quando o lançamento está disponível como álbum no Deezer. O formato esperado é, por exemplo, `https://www.deezer.com/br/album/123456789` ou apenas o ID numérico do álbum.

Enquanto os IDs dos lançamentos ainda não estiverem cadastrados no código, o modo de curadoria local pode ser aberto com `?curadoria=1`. Selecione um lançamento, clique em **Vincular Deezer** e cole a URL/ID; o vínculo fica salvo no `localStorage` do navegador. Depois da conferência, os IDs podem ser incorporados definitivamente em `assets/js/portfolio-data.js`.

Os links do YouTube permanecem apenas como referências externas nos perfis dos projetos artísticos quando informados; eles não são mais usados como mecanismo de reprodução do Media Player interno.

O widget do Deezer depende de conexão com a internet e das regras de disponibilidade do próprio serviço. Para música, o widget pode disponibilizar apenas uma prévia, conforme as regras da Deezer e da conta/região do visitante.
