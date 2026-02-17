# Portfolio (Nicolas Viana Alves)

👉 **[Veja este README em Português 🇧🇷](README.pt-BR.md)**

This is a personal portfolio website built with modern web technologies, featuring a clean, minimal design and smooth interactions.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons

## Features

- **Responsive Design**: Fully responsive layout for all devices.
- **Multi-language Support**: English and Portuguese (Brazil).
- **Music Section**:
    - **Real-time Player**: Displays currently playing song with a live progress bar.
    - **Smart Polling**: Updates every second and intelligently refreshes when a song ends.
    - **Spotify Integration**: Fetches user profile, now playing data, and public playlists.
    - **Optimized Caching**: Server-side caching to prevent API rate limiting.
- **Project Showcase**: Featured projects and detailed experience cards.


## Setup Guide

To copy and run this portfolio locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/naicolas-dev/portfolio.git
cd portfolio
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

3.  Environment Configuration (Spotify & Steam)

To make the music section and game stats work, you need to set up your environment variables.

1.  Rename `.env.local.example` to `.env.local`.
2.  Open `.env.local` and fill in your Spotify and Steam Credentials.
    - **Spotify**:
        - [Web API Documentation](https://developer.spotify.com/documentation/web-api)
        - [Dashboard](https://developer.spotify.com/dashboard)
    - **Steam**:
        - [API Key](https://steamcommunity.com/dev/apikey)
        - [SteamID.io](https://steamid.io)
    - **Guide**: detailed instructions on how to get these credentials are inside the `.env.local.example` file itself.

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To create a production build:

```bash
npm run build
```