# Portfólio (Nicolas Viana Alves)

Este é um site de portfólio pessoal construído com tecnologias web modernas, apresentando um design limpo, minimalista e interações suaves.

## Stack Tecnológica

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **Animações**: Framer Motion
- **Ícones**: Lucide React, React Icons

## Funcionalidades

- **Design Responsivo**: Layout totalmente adaptável para todos os dispositivos.
- **Suporte Multi-idioma**: Inglês e Português (Brasil).
- **Seção de Música**:
    - **Player em Tempo Real**: Exibe a música tocando no momento com uma barra de progresso ao vivo.
    - **Smart Polling**: Atualiza a cada segundo e recarrega inteligentemente quando a música termina.
    - **Integração com Spotify**: Busca perfil do usuário, dados de "ouvindo agora" e playlists públicas.
    - **Cache Otimizado**: Cache no lado do servidor para evitar limites de taxa da API (Rate Limiting).
- **Vitrine de Projetos**: Projetos em destaque e cartões de experiência detalhados.


## Guia de Configuração

Para copiar e rodar este portfólio localmente, siga estes passos:

### 1. Clone o repositório

```bash
git clone https://github.com/naicolas-dev/portfolio.git
cd portfolio
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configuração de Ambiente (Integração Spotify & Steam)

Para que a seção de música e estatísticas de jogos funcionem, você precisa configurar as variáveis de ambiente.

1.  Renomeie o arquivo `.env.local.example` para `.env.local`.
2.  Abra o `.env.local` e preencha com suas credenciais do Spotify e Steam.
    - **Spotify**:
        - [Documentação Web API](https://developer.spotify.com/documentation/web-api)
        - [Dashboard](https://developer.spotify.com/dashboard)
    - **Steam**:
        - [Chave de API](https://steamcommunity.com/dev/apikey)
        - [SteamID.io](https://steamid.io)
    - **Guia**: instruções detalhadas sobre como obter essas credenciais estão dentro do próprio arquivo `.env.local.example`.

### 4. Rode o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Build para Produção

Para criar uma build de produção:

```bash
npm run build
```
