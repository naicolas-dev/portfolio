'use client';

import React, { useState, useEffect } from 'react';
import { track } from '@vercel/analytics';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
  Github, Linkedin, Mail, ArrowRight, X, Download,
  Server, Code2,
  ChevronLeft, ChevronRight,
  Plus, Layers, ArrowUpRight
} from 'lucide-react';
import {
  SiPhp, SiLaravel, SiNextdotjs, SiReact,
  SiJavascript, SiTailwindcss, SiTypescript, SiAlpinedotjs,
  SiMysql, SiPostgresql, SiBootstrap, SiNodedotjs, SiHtml5, SiCss3, SiAndroid,
  SiFirebase, SiKotlin, SiJetpackcompose
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

import { TabTitleHandler } from './components/TabTitleHandler';
import Magnetic from './components/Magnetic';
import StaggeredText from './components/StaggeredText';
import { LanguageModal } from './components/LanguageModal';
import MobileMultimediaHub from './components/MobileMultimediaHub';
import Navbar from './components/Navbar';
import { useLanguage } from './context/LanguageContext';
import { cn } from '@/lib/utils';

// --- TYPES ---
interface Project {
  title: string;
  description: string;
  longDescription?: string;
  techs: string[];
  links: { github?: string; demo?: string };
  cta?: { text: string; link?: string };
  images: string[];
  period?: string; // Add period field
  isFeatured?: boolean;
}

interface Content {
  hero: {
    headline: string;
    subtext: string;
    status: string;
    aboutMe: string;
    viewProjects: string;
    contact: string;
  };
  sections: {
    projects: string;
    otherProjects: string;
    featured: string;
    heroCTA: string;
    downloadCV: string;
    exploreProject: string;
    letsConnect: string;
    experience: string;
    stack: string;
  };
  projects: {
    featured: Project;
    main: Project[];
    experience: Project[];
    other: { name: string; tech: string; link: string; image?: string }[];
    viewCode: string;
  };
  education: {
    title: string;
    items: {
      title: string;
      institution: string;
      image?: string;
      dotColor: string;
      textColor: string;
      description: string;
    }[];
  };
}

// --- DATA SOURCE ---

const techMap: Record<string, { icon: React.ReactNode; color: string }> = {
  PHP: { icon: <SiPhp size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  Laravel: { icon: <SiLaravel size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  MySQL: { icon: <SiMysql size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  PostgreSQL: { icon: <SiPostgresql size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  AlpineJS: { icon: <SiAlpinedotjs size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  Bootstrap: { icon: <SiBootstrap size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  MVC: { icon: <Code2 size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  React: { icon: <SiReact size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  TypeScript: { icon: <SiTypescript size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  'Node.js': { icon: <SiNodedotjs size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  Java: { icon: <FaJava size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  'Android SDK': { icon: <SiAndroid size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  'API Rest': { icon: <Server size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  HTML5: { icon: <SiHtml5 size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  CSS3: { icon: <SiCss3 size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  JavaScript: { icon: <SiJavascript size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  JS: { icon: <SiJavascript size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  'Next.js': { icon: <SiNextdotjs size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  Tailwind: { icon: <SiTailwindcss size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  Firebase: { icon: <SiFirebase size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  Kotlin: { icon: <SiKotlin size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
  'Jetpack Compose': { icon: <SiJetpackcompose size={18} />, color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800" },
};

// --- STACK DATA ---
const stackItems = [
  { name: "PHP", color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800", icon: <SiPhp size={28} /> },
  { name: "Laravel", color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800", icon: <SiLaravel size={28} /> },
  { name: "PostgreSQL", color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800", icon: <SiPostgresql size={28} /> },
  { name: "Next.js", color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800", icon: <SiNextdotjs size={28} /> },
  { name: "React", color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800", icon: <SiReact size={28} /> },
  { name: "JavaScript", color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800", icon: <SiJavascript size={28} /> },
  { name: "Tailwind", color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800", icon: <SiTailwindcss size={28} /> },
  { name: "TypeScript", color: "bg-[#5F6B7C]/10 text-zinc-500 border-zinc-800", icon: <SiTypescript size={28} /> },
];

const content: Record<'pt' | 'en', Content> = {
  pt: {
    hero: {
      status: "Disponível para estágio ou vaga júnior em desenvolvimento web",
      aboutMe: "Sobre mim",
      headline: "Desenvolvedor Full-Stack.",
      subtext: "Tenho experiência no desenvolvimento de aplicações web completas, atuando tanto no front-end quanto no back-end em projetos próprios e acadêmicos. Sou estudante de Sistemas de Informação na Universidade Estadual de Montes Claros (Unimontes) e possuo prática com Laravel, Next.js e PostgreSQL. Busco minha primeira oportunidade como desenvolvedor full-stack júnior, com interesse em contribuir de forma consistente, escrevendo código claro e organizado, com atenção à manutenção e ao desempenho das aplicações.",
      viewProjects: "Ver Projetos",
      contact: "Entrar em Contato"
    },
    sections: {
      experience: "Experiência",
      projects: "Meus Projetos",
      otherProjects: "Outros Projetos",
      featured: "Destaque",
      heroCTA: "ver meus projetos",
      downloadCV: "Baixar currículo",
      exploreProject: "Explorar Projeto",
      letsConnect: "Vamos Conversar",
      stack: "Stack Principal",
    },
    projects: {
      featured: {
        title: 'Frequência Certa',
        description: 'Solução para alunos visualizarem sua assiduidade escolar, visando a permanência na escola e a manutenção de benefícios sociais como o "Pé de Meia".',
        longDescription: 'Plataforma focada no aluno que simplifica o acompanhamento da frequência escolar. Ajuda estudantes a monitorar sua presença para garantir o cumprimento dos requisitos mínimos para aprovação e recebimento de auxílios governamentais, promovendo a transparência e a retenção escolar.',
        period: 'Dez 2025 - Fev 2026',
        techs: ['PHP', 'Laravel', 'PostgreSQL', 'Bootstrap', 'Tailwind', 'AlpineJS', 'JavaScript', 'Firebase'],
        links: { github: 'https://github.com/naicolas-dev/frequencia-certa' },
        cta: { text: "Visitar", link: "https://frequenciacerta.app.br" },
        images: [
          '/projects/frequencia certa/Captura de tela 2026-02-10 174439.png',
          '/projects/frequencia certa/Captura de tela 2026-02-10 174444.png',
          '/projects/frequencia certa/Captura de tela 2026-02-10 174450.png',
          '/projects/frequencia certa/Captura de tela 2026-02-10 174455.png',
          '/projects/frequencia certa/Captura de tela 2026-02-10 174459.png',
          '/projects/frequencia certa/Captura de tela 2026-02-10 174509.png'
        ],
        isFeatured: true,
      },
      experience: [
        {
          title: 'A Ordem Survived',
          description: 'Landing page de alta conversão projetada para transformar visitantes em jogadores ativos.',
          longDescription: 'Portal imersivo que reflete a atmosfera do jogo, centralizando regras, mapas e status do servidor. Otimizado para performance máxima, garante que novos jogadores tenham acesso instantâneo a todas as informações necessárias para começar a jogar.',
          period: 'Fev 2026',
          techs: ['HTML5', 'Tailwind', 'JS'],
          links: { demo: '#' },
          cta: { text: "Em breve" },
          images: [
            '/projects/aordem/Captura de tela 2026-02-08 201323.png',
            '/projects/aordem/Captura de tela 2026-02-08 201331.png',
            '/projects/aordem/Captura de tela 2026-02-08 201334.png',
            '/projects/aordem/Captura de tela 2026-02-08 201434.png',
            '/projects/aordem/Captura de tela 2026-02-08 201339.png',
            '/projects/aordem/Captura de tela 2026-02-08 201342.png',
            '/projects/aordem/Captura de tela 2026-02-08 201347.png'
          ],
        },
        {
          title: 'Sollux Engenharia',
          description: 'Presença digital estratégica desenvolvida para captar leads qualificados no setor de engenharia elétrica.',
          longDescription: 'Site institucional focado em autoridade e conversão. Estruturado com técnicas de SEO e UX para garantir que potenciais clientes encontrem os serviços rapidamente e entrem em contato através de formulários integrados e chamadas para ação claras.',
          period: 'Fev 2026',
          techs: ['HTML5', 'Tailwind', 'JS'],
          links: {},
          cta: { text: "Em breve" },
          images: [
            '/projects/eletricidade/Captura de tela 2026-02-10 174112.png',
            '/projects/eletricidade/Captura de tela 2026-02-10 174117.png',
            '/projects/eletricidade/Captura de tela 2026-02-10 174125.png',
            '/projects/eletricidade/Captura de tela 2026-02-10 174129.png',
            '/projects/eletricidade/Captura de tela 2026-02-10 174140.png'
          ],
        }
      ],
      main: [
        {
          title: 'Dashboard Financeiro',
          description: 'Aplicação de gestão financeira que simplifica o controle de gastos através de visualização de dados em tempo real.',
          longDescription: 'Transforma dados brutos de receitas e despesas em gráficos intuitivos e relatórios instantâneos. Permite ao usuário tomar decisões financeiras melhores através de uma interface responsiva e interativa, com atualizações em tempo real via Firebase.',
          period: 'Jul 2025 - Ago 2025',
          techs: ['React', 'JS', 'Firebase', 'Tailwind'],
          links: { github: 'https://github.com/naicolas-dev/dashboard-financeiro-irt' },
          cta: { text: "Visitar", link: "https://despesas-trabalho.vercel.app" },
          images: [
            '/projects/dashboard financeiro/WhatsApp Image 2026-01-14 at 19.24.58.jpeg',
            '/projects/dashboard financeiro/WhatsApp Image 2026-01-14 at 19.25.02.jpeg',
            '/projects/dashboard financeiro/WhatsApp Image 2026-01-14 at 19.25.07.jpeg'
          ],
        },
        {
          title: 'Social Media Downloader',
          description: 'Baixador de vídeos sem marca d\'água integrado ao sistema de compartilhamento do Android, eliminando a necessidade de usar sites no navegador.',
          longDescription: 'Resolve a fricção de ter que copiar links e abrir sites externos. O app recebe links diretamente do menu "Compartilhar" do TikTok, X ou Instagram e inicia o download automaticamente do conteúdo em background, permitindo salvar vídeos limpos com o mínimo de cliques possível.',
          period: 'Fev 2026',
          techs: ['Kotlin', 'Jetpack Compose', 'API Rest'],
          links: { github: 'https://github.com/naicolas-dev/tiktok-downloader' },
          cta: { text: "Baixar", link: "https://github.com/naicolas-dev/socialmedia-downloader/releases/tag/v.1.3.0" },
          images: [
            '/projects/socialmedia-downloader/preview.png',
          ],
        },
        {
          title: 'WhatsApp Portfolio',
          description: 'Experiência de portfólio gamificada que demonstra domínio avançado de interface e interatividade.',
          longDescription: 'Uma recriação pixel-perfect da interface do WhatsApp Web que serve como um "quebra-gelo" interativo. Demonstra atenção minuciosa aos detalhes de UI/UX e capacidade de construir interfaces complexas e familiares, engajando recrutadores e clientes de forma única.',
          period: 'Jan 2026',
          techs: ['Next.js', 'React', 'Tailwind', 'TypeScript'],
          links: { demo: 'https://whatsapp-portfolio.vercel.app', github: 'https://github.com/naicolas-dev/whatsapp-portfolio' },
          cta: { text: "Visitar", link: "https://whatsapp-portfolio.vercel.app" },
          images: [
            '/projects/whatsapp/Captura de tela 2026-02-15 193917.png',
            '/projects/whatsapp/Captura de tela 2026-02-15 193956.png',
            '/projects/whatsapp/Captura de tela 2026-02-15 194014.png',
            '/projects/whatsapp/Captura de tela 2026-02-15 194045.png',
            '/projects/whatsapp/Captura de tela 2026-02-15 194658.png',
            '/projects/whatsapp/Captura de tela 2026-02-15 194713.png',
            '/projects/whatsapp/Captura de tela 2026-02-15 194801.png',
          ],
        },
        {
          title: 'MyAi Recipes',
          description: 'API inteligente para encontrar o que cozinhar com os ingredientes disponíveis no momento.',
          longDescription: 'Backend robusto que resolve o dilema do "o que comer hoje". Integra lógica de negócios com Inteligência Artificial para analisar os ingredientes que o usuário tem em casa e sugerir receitas viáveis instantaneamente, demonstrando flexibilidade de integração com qualquer LLM.',
          period: 'Set 2025',
          techs: ['PHP', 'Laravel', 'JavaScript', 'MySQL', 'Tailwind'],
          links: { github: 'https://github.com/naicolas-dev/api-receitas' },
          cta: { text: "Código", link: "https://github.com/naicolas-dev/api-receitas" },
          images: [
            '/projects/myai-recipes/1-dark.png',
            '/projects/myai-recipes/2-dark.png',
            '/projects/myai-recipes/3-dark.png',
            '/projects/myai-recipes/1-light.png',
            '/projects/myai-recipes/2-light.png',
            '/projects/myai-recipes/3-light.png'
          ],
        }
      ],
      other: [
        { name: 'Dev CLT Timer', tech: '.NET 8 & WPF', link: 'https://github.com/naicolas-dev/DevCLTTimer/releases/tag/v1.0.0', image: '/other-projects/DevCLTTimer.png' },
        { name: 'Nutrika', tech: 'Next.js & React', link: 'https://github.com/naicolas-dev/nutrika', image: '/other-projects/nutrika.png' },
        { name: 'Kanban API', tech: 'PHP & Laravel', link: 'https://github.com/naicolas-dev/kanban-api', image: '/other-projects/kanban-api.png' },
        { name: 'Biblioteca API', tech: 'PHP & Laravel', link: 'https://github.com/naicolas-dev/biblioteca-api', image: '/other-projects/biblioteca-api.png' },
        { name: 'Gestor de Segurança', tech: 'PHP & CodeIgniter', link: 'https://github.com/naicolas-dev/GestorSeguranca', image: '/other-projects/gestor-seguranca.png' },
      ],
      viewCode: 'Abrir no GitHub',
    },
    education: {
      title: "Formação Acadêmica",
      items: [
        {
          title: "Bacharelado em Sistemas de Informação",
          institution: "Universidade Estadual de Montes Claros (Unimontes) • 2026 — 2029",
          image: "/education/unimontesmg_logo.jpg",
          dotColor: "bg-[#3B82F6]",
          textColor: "text-[#dedede]",
          description: "Graduação focada no desenvolvimento de soluções computacionais para negócios, abrangendo engenharia de software, banco de dados, governança de TI e gestão de projetos. Durante o curso, exploro aplicações práticas e me aprofundo em arquiteturas backend e frontend para construir sistemas escaláveis."
        },
        {
          title: "Técnico em Desenvolvimento de Sistemas",
          institution: "Proz Educação • 2024 — 2026",
          image: "/education/proz_logo.png",
          dotColor: "bg-zinc-800",
          textColor: "text-zinc-400",
          description: "Formação técnica que me introduziu aos fundamentos da programação, incluindo lógica, algoritmos e banco de dados. Aprendi as bases do desenvolvimento web com HTML, CSS, JavaScript e PHP, além de metodologias ágeis e controle de versão, desenvolvendo meus primeiros projetos práticos."
        }
      ]
    }
  },
  en: {
    hero: {
      status: "Available for internship or junior web development role",
      aboutMe: "About me",
      headline: "Full-Stack Developer.",
      subtext: "I have experience developing complete web applications, working on both front-end and back-end in personal and academic projects. I am an Information Systems student at the State University of Montes Claros (Unimontes) and I have practical experience with Laravel, Next.js, and PostgreSQL. I am seeking my first opportunity as a Junior Full-Stack Developer, looking to contribute consistently by writing clear and organized code, with a focus on maintainability and application performance.",
      viewProjects: "View Projects",
      contact: "Get in Touch"
    },
    sections: {
      experience: "Experience",
      projects: "My Projects",
      otherProjects: "Other Projects",
      featured: "Featured",
      heroCTA: "view my projects",
      downloadCV: "Download resume",
      exploreProject: "Explore Project",
      letsConnect: "Let's Connect",
      stack: "Main Stack",
    },
    projects: {
      featured: {
        title: 'Frequência Certa',
        description: 'Solution designed for students to track their school attendance, aiming to support school retention and social benefits eligibility.',
        longDescription: 'Student-focused platform that simplifies attendance tracking. Helps students monitor their presence to ensure they meet minimum requirements for approval and government aid programs like "Pé de Meia", promoting transparency and school retention.',
        period: 'Dec 2025 - Feb 2026',
        techs: ['PHP', 'Laravel', 'PostgreSQL', 'Bootstrap', 'Tailwind', 'AlpineJS', 'JavaScript', 'Firebase'],
        links: { github: 'https://github.com/naicolas-dev/frequencia-certa' },
        cta: { text: "Visit", link: "https://frequenciacerta.app.br" },
        images: [
          '/projects/frequencia certa/Captura de tela 2026-02-10 174439.png',
          '/projects/frequencia certa/Captura de tela 2026-02-10 174444.png',
          '/projects/frequencia certa/Captura de tela 2026-02-10 174450.png',
          '/projects/frequencia certa/Captura de tela 2026-02-10 174455.png',
          '/projects/frequencia certa/Captura de tela 2026-02-10 174459.png',
          '/projects/frequencia certa/Captura de tela 2026-02-10 174509.png'
        ],
        isFeatured: true,
      },
      experience: [
        {
          title: 'A Ordem Survived',
          description: 'High-conversion landing page designed to turn visitors into active players.',
          longDescription: 'Immersive portal reflecting the game\'s atmosphere, centralizing rules, maps, and server status. Optimized for maximum performance, ensuring new players have instant access to all necessary information to start playing.',
          period: 'Feb 2026',
          techs: ['HTML5', 'Tailwind', 'JS'],
          links: { demo: '#' },
          cta: { text: "Coming soon" },
          images: [
            '/projects/aordem/Captura de tela 2026-02-08 201323.png',
            '/projects/aordem/Captura de tela 2026-02-08 201331.png',
            '/projects/aordem/Captura de tela 2026-02-08 201334.png',
            '/projects/aordem/Captura de tela 2026-02-08 201434.png',
            '/projects/aordem/Captura de tela 2026-02-08 201339.png',
            '/projects/aordem/Captura de tela 2026-02-08 201342.png',
            '/projects/aordem/Captura de tela 2026-02-08 201347.png'
          ],
        },
        {
          title: 'Sollux Engineering',
          description: 'Strategic digital presence developed to capture qualified leads in the electrical engineering sector.',
          longDescription: 'Institutional site focused on authority and conversion. Structured with SEO and UX techniques to ensure potential clients find services quickly and get in touch through integrated forms and clear calls to action.',
          period: 'Feb 2026',
          techs: ['HTML5', 'Tailwind', 'JS'],
          links: {},
          cta: { text: "Coming soon" },
          images: [
            '/projects/eletricidade/Captura de tela 2026-02-10 174112.png',
            '/projects/eletricidade/Captura de tela 2026-02-10 174117.png',
            '/projects/eletricidade/Captura de tela 2026-02-10 174125.png',
            '/projects/eletricidade/Captura de tela 2026-02-10 174129.png',
            '/projects/eletricidade/Captura de tela 2026-02-10 174140.png'
          ],
        }
      ],
      main: [
        {
          title: 'Finance Dashboard',
          description: 'Financial management application that simplifies expense tracking through real-time data visualization.',
          longDescription: 'Transforms raw income and expense data into intuitive charts and instant reports. Enables users to make better financial decisions through a responsive, interactive interface with real-time updates via Firebase.',
          period: 'Jul 2025 - Aug 2025',
          techs: ['React', 'JS', 'Firebase', 'Tailwind'],
          links: { github: 'https://github.com/naicolas-dev/dashboard-financeiro-irt' },
          cta: { text: "Visit", link: "https://despesas-trabalho.vercel.app" },
          images: [
            '/projects/dashboard financeiro/WhatsApp Image 2026-01-14 at 19.24.58.jpeg',
            '/projects/dashboard financeiro/WhatsApp Image 2026-01-14 at 19.25.02.jpeg',
            '/projects/dashboard financeiro/WhatsApp Image 2026-01-14 at 19.25.07.jpeg'
          ],
        },
        {
          title: 'Social Media Downloader',
          description: 'Video downloader app integrated with Android\'s share system, eliminating the need to use external sites.',
          longDescription: 'Solves the friction of copying links and opening external sites. The app receives links directly from TikTok\'s, X or Instagram\'s "Share" menu and automatically starts the download in the background, allowing users to save clean videos with minimal clicks.',
          period: 'Feb 2026',
          techs: ['Kotlin', 'Jetpack Compose', 'API Rest'],
          links: { github: 'https://github.com/naicolas-dev/tiktok-downloader' },
          cta: { text: "Download", link: "https://github.com/naicolas-dev/socialmedia-downloader/releases/tag/v.1.3.0" },
          images: [
            '/projects/socialmedia-downloader/preview.png',
          ],
        },
        {
          title: 'WhatsApp Portfolio',
          description: 'Gamified portfolio experience demonstrating advanced mastery of interface and interactivity.',
          longDescription: 'A pixel-perfect recreation of the WhatsApp Web interface serving as an interactive "icebreaker". Demonstrates meticulous attention to UI/UX details and the ability to build complex, familiar interfaces, engaging recruiters and clients in a unique way.',
          period: 'Jan 2026',
          techs: ['Next.js', 'React', 'Tailwind', 'Typescript'],
          links: { demo: 'https://whatsapp-portfolio.vercel.app', github: 'https://github.com/naicolas-dev/whatsapp-portfolio' },
          cta: { text: "Visit", link: "https://whatsapp-portfolio.vercel.app" },
          images: [
            '/projects/whatsapp/Captura de tela 2026-02-15 193917.png',
            '/projects/whatsapp/Captura de tela 2026-02-15 193956.png',
            '/projects/whatsapp/Captura de tela 2026-02-15 194014.png',
            '/projects/whatsapp/Captura de tela 2026-02-15 194045.png'
          ],
        },
        {
          title: 'MyAi Recipes',
          description: 'Intelligent backend to find what to cook with currently available ingredients.',
          longDescription: 'Robust backend that solves the "what to eat today" dilemma. Integrates business logic with Artificial Intelligence to analyze ingredients the user has at home and suggest viable recipes instantly, demonstrating flexible integration with any LLM.',
          period: 'Sep 2025',
          techs: ['PHP', 'Laravel', 'JavaScript', 'MySQL', 'Tailwind'],
          links: { github: 'https://github.com/naicolas-dev/api-receitas' },
          cta: { text: "Code", link: "https://github.com/naicolas-dev/api-receitas" },
          images: [
            '/projects/myai-recipes/1-dark.png',
            '/projects/myai-recipes/2-dark.png',
            '/projects/myai-recipes/3-dark.png',
            '/projects/myai-recipes/1-light.png',
            '/projects/myai-recipes/2-light.png',
            '/projects/myai-recipes/3-light.png'
          ],
        }
      ],
      other: [
        { name: 'Dev CLT Timer', tech: '.NET 8 & WPF', link: 'https://github.com/naicolas-dev/DevCLTTimer', image: '/other-projects/DevCLTTimer.png' },
        { name: 'Nutrika', tech: 'Next.js & React', link: 'https://github.com/naicolas-dev/nutrika', image: '/other-projects/nutrika.png' },
        { name: 'Kanban API', tech: 'PHP & Laravel', link: 'https://github.com/naicolas-dev/kanban-api', image: '/other-projects/kanban-api.png' },
        { name: 'Library API', tech: 'PHP & Laravel', link: 'https://github.com/naicolas-dev/biblioteca-api', image: '/other-projects/biblioteca-api.png' },
        { name: 'Security Manager', tech: 'PHP & CodeIgniter', link: 'https://github.com/naicolas-dev/GestorSeguranca', image: '/other-projects/gestor-seguranca.png' },
      ],
      viewCode: 'View on GitHub',
    },
    education: {
      title: "Education",
      items: [
        {
          title: "Bachelor’s Degree in Information Systems",
          institution: "State University of Montes Claros (Unimontes) • 2026 — 2029",
          image: "/education/unimontesmg_logo.jpg",
          dotColor: "bg-[#3B82F6]",
          textColor: "text-[#dedede]",
          description: "Bachelor's program focused on developing computational solutions for businesses, covering software engineering, databases, IT governance, and project management. During the course, I explore practical applications and dive deep into backend and frontend architectures to build scalable systems."
        },
        {
          title: "Technical Degree in Systems Development",
          institution: "Proz Education • 2024 — 2026",
          image: "/education/proz_logo.png",
          dotColor: "bg-zinc-800",
          textColor: "text-zinc-400",
          description: "Technical education that introduced me to the fundamentals of programming, including logic, algorithms, and databases. I learned the basics of web development with HTML, CSS, JavaScript, and PHP, alongside agile methodologies and version control, developing my first practical projects."
        }
      ]
    }
  }
};

// --- COMPONENTS ---

const SectionHeading = ({ children, number }: { children: string, number: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-center gap-4 mb-12"
  >
    <span className="font-mono text-zinc-600 text-sm">0{number}</span>
    <h2 className="text-2xl font-bold text-[#dedede] tracking-tight flex items-center gap-4">
      <AnimatePresence mode="wait">
        <motion.span
          key={children}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
      <div className="h-px w-32 bg-[#30363D]" />
    </h2>
  </motion.div>
);

const StackBadge = ({ name, color, children }: { name: string, color: string, children: React.ReactNode }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-800/10 transition-all hover:bg-zinc-800/20 select-none cursor-default ${color}`}>
    {children}
    <span className="font-medium text-[11px] tracking-wide">{name}</span>
  </div>
);

const SocialButton = ({ icon, label, href, download = false, onClick }: { icon: React.ReactNode, label: string, href: string, download?: boolean, onClick?: () => void }) => (
  <a
    href={href}
    target={download ? undefined : "_blank"}
    rel={download ? undefined : "noopener noreferrer"}
    download={download}
    onClick={onClick}
    className="group flex items-center justify-center rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-[#dedede] hover:bg-zinc-800 transition-all hover:scale-110 overflow-hidden cursor-pointer"
  >
    <div className="p-4 flex items-center justify-center">
      {icon}
    </div>
    <span className="max-w-0 group-hover:max-w-[200px] overflow-hidden transition-all duration-500 whitespace-nowrap opacity-0 group-hover:opacity-100 font-medium pr-0 group-hover:pr-6">
      {label}
    </span>
  </a>
);



const HoverProjectRow = ({ project }: { project: { name: string; tech: string; link: string; image?: string } }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isHovered) {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  return (
    <>
      <motion.a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('Project Click', { project: project.name, type: 'Other' })}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="py-4 flex items-center justify-between group hover:bg-white/5 px-4 rounded-lg -mx-4 transition-colors cursor-pointer block relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h5 className="text-zinc-300 font-medium text-sm group-hover:text-[#dedede] transition-colors">{project.name}</h5>
        <div className="flex items-center gap-3">
          <p className="text-zinc-600 text-xs font-mono group-hover:text-zinc-400 transition-colors">{project.tech}</p>
          <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-[#dedede] transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
        </div>
      </motion.a>

      {/* Floating Image Component */}
      {project.image && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed pointer-events-none z-50 hidden sm:block shadow-2xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
              style={{
                top: mousePosition.y - 120, // Offset so image isn't exactly under cursor
                left: mousePosition.x + 20,
                width: '450px',
                aspectRatio: '16/9',
              }}
            >
              <img
                src={project.image}
                alt={`${project.name} preview`}
                className="w-full h-full object-contain bg-[#121212]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

// --- MAIN PAGE ---

const getProjectCountForTech = (techName: string): string => {
  const aliases = [techName.toLowerCase()];
  if (techName === 'JavaScript') aliases.push('js');

  const allProjects = [
    content.pt.projects.featured,
    ...content.pt.projects.experience,
    ...content.pt.projects.main
  ];

  let count = allProjects.filter(p =>
    p.techs.some(t => aliases.includes(t.toLowerCase()))
  ).length;

  content.pt.projects.other.forEach(p => {
    const techString = p.tech.toLowerCase();
    if (aliases.some(a => techString.includes(a))) {
      count++;
    }
  });

  return count > 9 ? '9+' : count.toString();
};

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0); // For slide animation direction
  const [isFullScreen, setIsFullScreen] = useState(false);
  const dragControls = useDragControls(); // For controlling bottom sheet drag
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [isStackHovered, setIsStackHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [ctaInView, setCtaInView] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [expandedEducationIndex, setExpandedEducationIndex] = useState<number | null>(null);

  const t = content[language];

  // Prevent hydration mismatch for checking local storage or random values if any (none here but good practice)
  useEffect(() => {
    setMounted(true);
    // Check initial mobile state
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial

    // Load language from localStorage or detect browser language
    const savedLang = localStorage.getItem('portfolio-language');
    if (savedLang === 'en' || savedLang === 'pt') {
      setLanguage(savedLang);
    } else {
      // Auto-detect browser language for initial display, but show modal for confirmation
      // const browserLang = navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
      // setLanguage(browserLang);
      if (!localStorage.getItem('portfolio-language')) {
        setShowLanguageModal(true);
      }
    }
    setIsLoading(false);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  const openProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  // Sync selectedProject when language changes
  useEffect(() => {
    if (selectedProject) {
      if (selectedProject.isFeatured) {
        setSelectedProject(t.projects.featured);
      } else {
        // Find index in the OLD language's main array to find the corresponding one in the NEW language's main array
        const oldLanguage = language === 'pt' ? 'en' : 'pt';
        // Find in MAIN
        const oldMain = content[oldLanguage].projects.main;
        const index = oldMain.findIndex(p => p.links.github === selectedProject.links.github || p.links.demo === selectedProject.links.demo);
        if (index !== -1) {
          setSelectedProject(t.projects.main[index]);
          return;
        }

        // Find in EXPERIENCE
        const oldExperience = content[oldLanguage].projects.experience;
        const expIndex = oldExperience.findIndex(p => p.links.github === selectedProject.links.github || p.links.demo === selectedProject.links.demo);
        if (expIndex !== -1) {
          setSelectedProject(t.projects.experience[expIndex]);
        }
      }
    }
  }, [language]);



  const prevImage = (e?: { stopPropagation: () => void }) => {
    e?.stopPropagation();
    if (!selectedProject) return;
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
  };

  const nextImage = (e?: { stopPropagation: () => void }) => {
    e?.stopPropagation();
    if (!selectedProject) return;
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95
    })
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          setSelectedProject(null);
        }
      }
    };

    if (selectedProject) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject, isFullScreen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject || showLanguageModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject, showLanguageModal]);

  return (
    <main className="min-h-screen relative font-sans selection:bg-[#3B82F6]/30 selection:text-zinc-100 overflow-x-hidden">
      <Navbar />
      <AnimatePresence>
        {showLanguageModal && (
          <LanguageModal
            onSelect={(lang) => {
              setLanguage(lang);
              setShowLanguageModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Content - No artificial opacity wrapper to prevent IntersectionObserver bugs */}
      <div className="w-full">
        <TabTitleHandler language={language} />
        {/* Background Texture & Lighting - Apple Style */}
        <div className="fixed inset-0 bg-[#0e1011] -z-20" />

        <div className="max-w-5xl mx-auto px-6 py-20 md:py-32 relative z-10">

          {/* --- 1. HERO --- */}
          <header id="hero" className="mb-32 md:mb-40 relative flex flex-col items-center text-center">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center max-w-4xl mx-auto mt-20 md:mt-32"
            >
              <StaggeredText
                text="Nicolas V. Alves"
                className="text-4xl md:text-7xl font-extrabold tracking-tight text-[#dedede] mb-4"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={language}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center px-4"
                >
                  {/* Status Line */}
                  <div className="inline-block px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-sm md:text-base text-emerald-400 font-medium tracking-wide">
                        {t.hero.status}
                      </span>
                    </div>
                  </div>

                  {/* Headline */}
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#dedede] mb-6 max-w-2xl leading-[1.15]">
                    {t.hero.headline}
                  </h2>

                  {/* Subtext (Collapsible) */}
                  <div className="flex flex-col items-center mb-10 w-full">
                    <button
                      onClick={() => setIsBioExpanded(!isBioExpanded)}
                      className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4 group"
                    >
                      <span className="text-sm font-medium uppercase tracking-wider">{t.hero.aboutMe}</span>
                      <motion.div
                        animate={{ rotate: isBioExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronLeft size={16} className="-rotate-90" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isBioExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-base md:text-lg text-zinc-400 font-normal leading-relaxed max-w-2xl text-balance pb-4">
                            {t.hero.subtext}
                          </p>

                          {/* Mobile Multimedia Hub (Spotify & Steam) - Visible only inside expanded bio on mobile */}
                          <MobileMultimediaHub />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Buttons Row */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">


                    <a
                      href={language === 'pt' ? '/Nicolas_Viana_Alves_Curriculo.pdf' : '/Nicolas_Viana_Alves_Resume.pdf'}
                      download
                      onClick={() => track('Download CV', { language })}
                      className="px-8 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[#dedede] font-medium hover:bg-[#1c2128] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Download size={18} />
                      {t.sections.downloadCV}
                    </a>

                    <a
                      href="https://www.linkedin.com/in/naicolas-dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track('Social Click', { platform: 'Linkedin', location: 'Hero' })}
                      className="px-8 py-3 rounded-lg bg-[#0A66C2] text-[#dedede] font-medium hover:bg-[#004182] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Linkedin size={18} />
                      LinkedIn
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </header>



          {/* --- 1. STACK --- */}
          <section id="stack" className="mb-32">
            <SectionHeading number="1">{t.sections.stack}</SectionHeading>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stackItems.map((item, i) => {
                const projectCount = getProjectCountForTech(item.name);
                const [isHovered, setIsHovered] = useState(false);
                const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

                useEffect(() => {
                  const handleMouseMove = (e: MouseEvent) => {
                    if (isHovered) {
                      setMousePosition({
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }
                  };

                  if (isHovered) {
                    window.addEventListener('mousemove', handleMouseMove);
                  }

                  return () => {
                    window.removeEventListener('mousemove', handleMouseMove);
                  };
                }, [isHovered]);

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`
                        group relative overflow-hidden p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 
                        hover:bg-zinc-900 hover:border-zinc-700 transition-colors duration-300
                        flex flex-col items-center justify-center gap-4 text-center cursor-default
                        hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]
                      `}
                  >

                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Tooltip that follows mouse */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="fixed pointer-events-none z-50 bg-zinc-800/90 backdrop-blur-md border border-zinc-700/50 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl"
                          style={{
                            top: mousePosition.y + 15,
                            left: mousePosition.x + 15,
                          }}
                        >
                          <div className="text-zinc-400 w-3 h-3 flex items-center justify-center">
                            {React.cloneElement(item.icon as React.ReactElement<any>, { size: 12 })}
                          </div>
                          <span className="text-xs font-medium text-zinc-300">
                            {language === 'pt'
                              ? `Usado em ${projectCount} ${projectCount === '1' ? 'projeto' : 'projetos'}`
                              : `Used in ${projectCount} ${projectCount === '1' ? 'project' : 'projects'}`}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="p-4 rounded-full bg-zinc-900/80 border border-zinc-800 group-hover:scale-110 group-hover:border-zinc-700 transition-all duration-300 relative z-10 text-zinc-400 group-hover:text-zinc-100">
                      {item.icon}
                    </div>

                    <span className="font-medium text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors z-10 relative">
                      {item.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* --- 2. EXPERIENCE --- */}
          <section className="mb-32" id="experience-section">
            <SectionHeading number="2">{t.sections.experience}</SectionHeading>

            <AnimatePresence mode="wait">
              <motion.div
                key={language}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {t.projects.experience.map((project, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => {
                      track('Project Click', { project: project.title, type: 'Experience' });
                      openProject(project);
                    }}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-800 transition-colors duration-300 group cursor-pointer flex flex-col overflow-hidden"
                  >
                    {/* Image Preview */}
                    <div className="relative h-48 w-full overflow-hidden border-b border-zinc-800">
                      <div className="absolute inset-0 bg-[#0e1011]" />
                      {project.images[0] && (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0"
                        />
                      )}
                    </div>

                    <div className="p-8 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-semibold text-zinc-400 group-hover:text-[#dedede] transition-colors tracking-tight">{project.title}</h4>
                          <div className="p-2 rounded-full bg-[#1c1c1e] text-zinc-500 group-hover:text-[#dedede] transition-colors">
                            <ArrowRight size={16} className="-rotate-45" />
                          </div>
                        </div>
                        {project.period && (
                          <p className="text-xs font-medium text-zinc-500 mb-6 italic">{project.period}</p>
                        )}

                        <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-light line-clamp-3">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.techs.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 border border-white/5 px-2 py-1 rounded-full">
                            {t}
                          </span>
                        ))}
                        {project.techs.length > 3 && (
                          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 border border-white/5 px-2 py-1 rounded-full">
                            +{project.techs.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </section>


          {/* --- 3. PROJETOS (Main) --- */}
          <section id="projects-section" className="mb-32">
            <SectionHeading number="3">{t.sections.projects}</SectionHeading>

            <AnimatePresence mode="wait">
              <motion.div
                key={language}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-16"
              >

                {/* DESTAQUE: TCC */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative cursor-pointer rounded-3xl overflow-hidden border border-blue-500/20 bg-zinc-900/50 transition-colors duration-300 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                  onClick={() => {
                    track('Project Click', { project: t.projects.featured.title, type: 'Featured' });
                    openProject(t.projects.featured);
                  }}
                >

                  <div className="relative p-8 md:p-12 z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 block">{t.sections.featured}</span>
                      <h3 className="text-4xl font-bold text-zinc-100 mb-1 tracking-tight">{t.projects.featured.title}</h3>
                      {t.projects.featured.period && (
                        <span className="text-sm font-medium text-blue-300 mb-4 block italic">{t.projects.featured.period}</span>
                      )}
                      <p className="text-zinc-300 leading-relaxed mb-8 text-lg font-light">
                        {t.projects.featured.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {t.projects.featured.techs.slice(0, 3).map(t => {
                          const tech = techMap[t] || { icon: <Code2 size={18} />, color: "bg-zinc-800/10 text-zinc-400" };
                          return (
                            <StackBadge key={t} name={t} color="bg-white/5 border-white/5 text-zinc-300">
                              {tech.icon}
                            </StackBadge>
                          );
                        })}
                        {t.projects.featured.techs.length > 3 && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 text-zinc-300">
                            <span className="font-medium text-[11px] tracking-wide">+{t.projects.featured.techs.length - 3}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4">
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                          {language === 'pt' ? 'Explorar Projeto' : 'Explore Project'} <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>

                    <div className="relative h-64 md:h-full min-h-[250px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-inner">
                      {/* Background decorative gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#161B22] to-[#0e1011]" />
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#3B82F6_0%,transparent_100%)]" />

                      {t.projects.featured.images[0] && (
                        <img
                          src={t.projects.featured.images[0]}
                          alt="Project Preview"
                          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 transform filter brightness-75 group-hover:brightness-100"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>


                {/* OUTROS PROJETOS PRINCIPAIS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {t.projects.main.map((project, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => {
                        track('Project Click', { project: project.title, type: 'Main' });
                        openProject(project);
                      }}
                      className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-800 transition-colors duration-300 group cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-semibold text-zinc-400 group-hover:text-[#dedede] transition-colors tracking-tight">{project.title}</h4>
                          <div className="p-2 rounded-full bg-[#1c1c1e] text-zinc-500 group-hover:text-[#dedede] transition-colors">
                            <ArrowRight size={16} className="-rotate-45" />
                          </div>
                        </div>
                        {project.period && (
                          <p className="text-xs font-medium text-zinc-500 mb-6 italic">{project.period}</p>
                        )}

                        <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-light line-clamp-3">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.techs.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 border border-white/5 px-2 py-1 rounded-full">
                            {t}
                          </span>
                        ))}
                        {project.techs.length > 3 && (
                          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 border border-white/5 px-2 py-1 rounded-full">
                            +{project.techs.length - 3}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </section>


          {/* --- 4. OUTROS EXPERIMENTOS --- */}
          <section className="mb-40">
            <SectionHeading number="4">{t.sections.otherProjects}</SectionHeading>

            <AnimatePresence mode="wait">
              <motion.div
                key={language}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="divide-y divide-white/5 border-t border-b border-white/5 relative"
              >
                {t.projects.other.map((p, i) => (
                  <HoverProjectRow key={i} project={p} />
                ))}
              </motion.div>
            </AnimatePresence>
          </section>


          {/* --- 5. FORMAÇÃO / EDUCATION --- */}
          <section id="education" className="mb-40">
            <SectionHeading number="5">{t.education.title}</SectionHeading>

            <AnimatePresence mode="wait">
              <motion.div
                key={language}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative space-y-12 pl-4"
              >
                {/* Timeline Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-zinc-800 via-zinc-800 to-transparent" />

                {t.education.items.map((item, i) => {
                  const isExpanded = expandedEducationIndex === i;

                  return (
                    <motion.div
                      key={i}
                      className="relative pl-10"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-[#0e1011] ${item.dotColor} shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10`} />

                      <div className="mb-2 flex items-start gap-5 translate-y-[-8px]">
                        {item.image && (
                          <div className="w-14 h-14 shrink-0 flex items-center justify-center pt-2">
                            <img src={item.image} alt={item.institution} className="w-full h-full object-contain rounded-sm" />
                          </div>
                        )}
                        <div className="flex-1">
                          <span className={`text-xl font-semibold block tracking-tight ${item.textColor}`}>{item.title}</span>
                          <span className="text-zinc-500 text-sm font-medium block mb-2">{item.institution}</span>

                          {/* Expand Description Toggle */}
                          <button
                            onClick={() => setExpandedEducationIndex(isExpanded ? null : i)}
                            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors group outline-none mb-2"
                          >
                            <span>{language === 'pt' ? 'Detalhes' : 'Details'}</span>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-zinc-800/50 p-1 rounded-full group-hover:bg-zinc-800 transition-colors"
                            >
                              <ChevronLeft size={12} className="-rotate-90" />
                            </motion.div>
                          </button>

                          {/* Expandable Description Body */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="pt-2 text-zinc-300 text-sm leading-relaxed max-w-2xl">
                                  {item.description}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </section>


          {/* --- 5. CONTACT CTA --- */}
          <section className="mb-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="py-12 flex flex-col items-center gap-8 relative"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={language}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-8"
                >
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#dedede] mb-4 tracking-tight">
                      {language === 'pt' ? 'Vamos Colaborar?' : "Let's Collaborate"}
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-[500px] mb-2 mx-auto">
                      {language === 'pt'
                        ? 'Tem um projeto interessante em mente? Vamos transformá-lo em realidade.'
                        : "Have an interesting project in mind? Let's turn it into reality."}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4">
                    <Magnetic>
                      <a
                        href="mailto:naicolas.dev@gmail.com"
                        onClick={() => track('Contact CTA Click', { method: 'Email' })}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800/50 hover:bg-[#EA4335]/20 border border-zinc-700/50 hover:border-[#EA4335]/50 transition-all text-zinc-300 hover:text-[#EA4335]"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                        </svg>
                        <span>Email</span>
                      </a>
                    </Magnetic>
                    <Magnetic>
                      <a
                        href="https://wa.me/5538992596855" // Assuming user wants a generic placeholder or replace with his own
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track('Contact CTA Click', { method: 'WhatsApp' })}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800/50 hover:bg-[#25D366]/20 border border-zinc-700/50 hover:border-[#25D366]/50 transition-all text-zinc-300 hover:text-[#25D366]"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                    </Magnetic>
                    <Magnetic>
                      <a
                        href="https://www.linkedin.com/in/naicolas-dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track('Contact CTA Click', { method: 'LinkedIn' })}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800/50 hover:bg-[#0A66C2]/20 border border-zinc-700/50 hover:border-[#0A66C2]/50 transition-all text-zinc-300 hover:text-[#0A66C2]"
                      >
                        <Linkedin size={18} />
                        <span>LinkedIn</span>
                      </a>
                    </Magnetic>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </section>


          {/* --- FOOTER --- */}
          <footer className="border-t border-zinc-800 pt-12 pb-12 flex flex-col items-center justify-center gap-6 text-zinc-600">
            <div className="flex gap-6">
              <a href={language === 'pt' ? '/Nicolas_Viana_Alves_Curriculo.pdf' : '/Nicolas_Viana_Alves_Resume.pdf'} download onClick={() => track('Download CV', { language })} className="hover:text-[#dedede] transition-colors flex p-2"><Download size={20} /></a>
              <a href="https://github.com/naicolas-dev" onClick={() => track('Social Click', { platform: 'Github', location: 'Footer' })} className="hover:text-[#dedede] transition-colors flex p-2"><Github size={20} /></a>
              <a href="https://www.linkedin.com/in/naicolas-dev/" onClick={() => track('Social Click', { platform: 'Linkedin', location: 'Footer' })} className="hover:text-[#dedede] transition-colors flex p-2"><Linkedin size={20} /></a>
              <a href="mailto:naicolas.dev@gmail.com" onClick={() => track('Social Click', { platform: 'Mail', location: 'Footer' })} className="hover:text-[#dedede] transition-colors flex p-2"><Mail size={20} /></a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm">© {new Date().getFullYear()} <a href="https://github.com/naicolas-dev" className="hover:text-zinc-400 transition-colors">Nicolas Viana Alves</a></p>
            </div>
          </footer>

        </div>

        {/* --- MODAL --- */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#0e1011] sm:bg-[#0e1011]/90"
            >
              <motion.div
                initial={isMobile ? { opacity: 0, scale: 0.95, y: "100%" } : { opacity: 0, scale: 0.9, y: 0 }}
                animate={isMobile ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
                exit={isMobile ? { opacity: 0, scale: 0.95, y: "100%" } : { opacity: 0, scale: 0.9, y: 0 }}
                transition={{
                  type: isMobile ? "tween" : "spring",
                  duration: 0.3,
                  ease: "easeOut",
                  damping: 25,
                  stiffness: 300
                }}
                drag="y"
                dragControls={dragControls}
                dragListener={false} // Only drag via controls
                dragConstraints={{ top: 0 }}
                dragElastic={{ top: 0, bottom: 0.2 }}
                dragDirectionLock // Locks drag direction to either x or y, helping prevent diagonal drags
                onDragEnd={(_, info) => {
                  if (info.offset.y > 100 || info.velocity.y > 500) {
                    setSelectedProject(null);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-[2rem] sm:rounded-2xl w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col will-change-transform"
              >
                {/* Mobile Drag Handle Area - Trigger for Drag */}
                <div
                  className="sm:hidden w-full flex justify-center pt-3 pb-1 sticky top-0 bg-zinc-900 z-30 touch-none"
                  onPointerDown={(e) => dragControls.start(e)}
                >
                  <div className="w-12 h-1.5 bg-zinc-700/50 rounded-full" />
                </div>

                {/* Close Button - Hidden on Mobile (Bottom Sheet) */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="hidden sm:block absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-zinc-400 hover:text-[#dedede] transition-colors z-50"
                >
                  <X size={20} />
                </button>

                {/* Carousel Section */}
                <div
                  className="w-full h-auto aspect-video sm:h-96 min-h-[220px] bg-[#121212] relative group flex items-center justify-center overflow-hidden cursor-zoom-in touch-none"
                  onPointerDown={(e) => {
                    // Optional: allow dragging from image too?
                    // No, image has its own drag for swiping.
                    // So we DON'T start dragControls here.
                  }}
                  onClick={() => setIsFullScreen(true)}
                >

                  {/* Blurred Background for Vertical Images */}
                  <div className="absolute inset-0">
                    <motion.img
                      key={`bg-${currentImageIndex}`}
                      src={selectedProject.images[currentImageIndex]}
                      className="w-full h-full object-cover opacity-20 hidden sm:block scale-110"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.img
                      key={currentImageIndex}
                      src={selectedProject.images[currentImageIndex]}
                      alt={`${selectedProject.title} image ${currentImageIndex + 1}`}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 }
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={1}
                      onDragEnd={(_, info) => {
                        const swipe = info.offset.x;
                        if (swipe < -50) {
                          nextImage();
                        } else if (swipe > 50) {
                          prevImage();
                        }
                      }}
                      className="w-full h-full object-contain relative z-10 touch-pan-y"
                    />
                  </AnimatePresence>

                  {/* Gradient Overlay for Controls Visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 via-transparent to-transparent pointer-events-none z-10" />

                  {/* Carousel Controls */}
                  {selectedProject.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-[#dedede] rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-[#dedede] rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <ChevronRight size={24} />
                      </button>

                      {/* Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {selectedProject.images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/30'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <div className="absolute top-4 right-4 bg-black/80 sm:bg-black/50 text-[#dedede] text-xs px-2 py-1 rounded z-20 pointer-events-none md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    {language === 'pt' ? 'Toque para ampliar' : 'Tap to enlarge'}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={language}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <h3 className="text-3xl font-bold text-[#dedede] mb-1">{selectedProject.title}</h3>
                    {selectedProject.period && (
                      <p className="text-sm font-medium text-zinc-500 mb-4 italic">{selectedProject.period}</p>
                    )}
                    <div className="mb-6 flex flex-wrap gap-2">
                      {selectedProject.techs.map(t => {
                        const tech = techMap[t] || { icon: <Code2 size={18} />, color: "bg-zinc-800/10 text-zinc-400 border-zinc-800/20" };
                        return (
                          <StackBadge key={t} name={t} color={tech.color}>
                            {tech.icon}
                          </StackBadge>
                        );
                      })}
                    </div>

                    <div className="prose prose-invert prose-zinc max-w-none mb-8">
                      <p className="text-lg leading-relaxed text-zinc-300">
                        {selectedProject.longDescription || selectedProject.description}
                      </p>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-zinc-800 items-center justify-between">
                      <div className="flex gap-3">
                        {selectedProject.links.github && (
                          <a
                            href={selectedProject.links.github}
                            target="_blank"
                            onClick={() => track('Project Link Click', { project: selectedProject.title, type: 'Github' })}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-800/50 text-zinc-400 hover:text-[#dedede] hover:bg-zinc-800 transition-all text-xs font-medium border border-zinc-700/50"
                          >
                            <Github size={16} /> {t.projects.viewCode}
                          </a>
                        )}
                      </div>

                      {selectedProject.cta && (
                        <a
                          href={selectedProject.cta.link || '#'}
                          target="_blank"
                          onClick={(e) => {
                            if (!selectedProject.cta?.link) {
                              e.preventDefault();
                            } else {
                              track('Project Link Click', { project: selectedProject.title, type: 'CTA' });
                            }
                          }}
                          className={`
                          flex items-center gap-2 px-8 py-2.5 rounded-full font-medium text-sm transition-all duration-300
                          ${selectedProject.cta.link
                              ? 'bg-[#2563EB] hover:bg-[#3B82F6] text-white font-bold hover:-translate-y-0.5 shadow-md shadow-blue-500/10 hover:shadow-blue-600/20 cursor-pointer'
                              : 'bg-zinc-800/50 text-zinc-500 cursor-default opacity-50 border border-zinc-800'}
                        `}
                        >
                          {selectedProject.cta.text}
                          {selectedProject.cta.link && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                        </a>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- FULL SCREEN IMAGE --- */}
        <AnimatePresence>
          {isFullScreen && selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black flex items-center justify-center p-4"
              onClick={() => setIsFullScreen(false)}
            >
              <button
                onClick={() => setIsFullScreen(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-[#dedede] transition-colors z-50"
              >
                <X size={24} />
              </button>

              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.img
                  key={currentImageIndex}
                  src={selectedProject.images[currentImageIndex]}
                  alt="Full screen view"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(_, info) => {
                    const swipe = info.offset.x;
                    if (swipe < -50) {
                      nextImage();
                    } else if (swipe > 50) {
                      prevImage();
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
                />
              </AnimatePresence>

              {selectedProject.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-[#dedede] rounded-full transition-colors z-50 disabled:opacity-50"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-[#dedede] rounded-full transition-colors z-50 disabled:opacity-50"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 sm:bg-black/50 px-4 py-2 rounded-full text-[#dedede] text-sm sm:backdrop-blur-md">
                {currentImageIndex + 1} / {selectedProject.images.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div >
    </main >
  );
}
