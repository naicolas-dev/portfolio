'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Mail, ArrowRight, X,
  Globe,
  Server, Code2,
  ChevronLeft, ChevronRight,
  Plus, Layers
} from 'lucide-react';
import {
  SiPhp, SiLaravel, SiNextdotjs, SiReact,
  SiJavascript, SiTailwindcss, SiTypescript, SiAlpinedotjs,
  SiMysql, SiPostgresql, SiBootstrap, SiNodedotjs, SiHtml5, SiCss3, SiAndroid,
  SiFirebase, SiKotlin, SiJetpackcompose
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

import { TabTitleHandler } from './components/TabTitleHandler';

// --- TYPES ---
interface Project {
  title: string;
  description: string;
  longDescription?: string;
  techs: string[];
  links: { github?: string; demo?: string };
  cta?: { text: string; link?: string };
  images: string[]; // Changed from image?: string to images: string[]
  isFeatured?: boolean;
}

interface Content {
  hero: {
    subtext: string;
    stackTeaser: string;
    stackLabel: string;
  };
  sections: {
    projects: string;
    otherProjects: string;
    featured: string;
  };
  projects: {
    featured: Project;
    main: Project[];
    other: { name: string; tech: string }[];
    viewCode: string;
  };
  education: {
    title: string;
    items: {
      title: string;
      institution: string;
      dotColor: string;
      textColor: string;
    }[];
  };
}

// --- DATA SOURCE ---

const techMap: Record<string, { icon: React.ReactNode; color: string }> = {
  PHP: { icon: <SiPhp size={18} />, color: "bg-[#777BB4]/10 text-[#777BB4] border-[#777BB4]/20" },
  Laravel: { icon: <SiLaravel size={18} />, color: "bg-[#FF2D20]/10 text-[#FF2D20] border-[#FF2D20]/20" },
  MySQL: { icon: <SiMysql size={18} />, color: "bg-[#4479A1]/10 text-[#4479A1] border-[#4479A1]/20" },
  PostgreSQL: { icon: <SiPostgresql size={18} />, color: "bg-[#336791]/10 text-[#336791] border-[#336791]/20" },
  AlpineJS: { icon: <SiAlpinedotjs size={18} />, color: "bg-[#77C1D2]/10 text-[#77C1D2] border-[#77C1D2]/20" },
  Bootstrap: { icon: <SiBootstrap size={18} />, color: "bg-[#7952B3]/10 text-[#7952B3] border-[#7952B3]/20" },
  MVC: { icon: <Code2 size={18} />, color: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20" },
  React: { icon: <SiReact size={18} />, color: "bg-[#61DAFB]/10 text-[#61DAFB] border-[#61DAFB]/20" },
  TypeScript: { icon: <SiTypescript size={18} />, color: "bg-[#3178C6]/10 text-[#3178C6] border-[#3178C6]/20" },
  'Node.js': { icon: <SiNodedotjs size={18} />, color: "bg-[#339933]/10 text-[#339933] border-[#339933]/20" },
  Java: { icon: <FaJava size={18} />, color: "bg-[#007396]/10 text-[#007396] border-[#007396]/20" },
  'Android SDK': { icon: <SiAndroid size={18} />, color: "bg-[#3DDC84]/10 text-[#3DDC84] border-[#3DDC84]/20" },
  'API Rest': { icon: <Server size={18} />, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  HTML5: { icon: <SiHtml5 size={18} />, color: "bg-[#E34F26]/10 text-[#E34F26] border-[#E34F26]/20" },
  CSS3: { icon: <SiCss3 size={18} />, color: "bg-[#1572B6]/10 text-[#1572B6] border-[#1572B6]/20" },
  JavaScript: { icon: <SiJavascript size={18} />, color: "bg-[#F7DF1E]/10 text-[#F7DF1E] border-[#F7DF1E]/20" },
  JS: { icon: <SiJavascript size={18} />, color: "bg-[#F7DF1E]/10 text-[#F7DF1E] border-[#F7DF1E]/20" },
  'Next.js': { icon: <SiNextdotjs size={18} />, color: "bg-zinc-100/10 text-zinc-100 border-zinc-100/20" },
  Tailwind: { icon: <SiTailwindcss size={18} />, color: "bg-[#38B2AC]/10 text-[#38B2AC] border-[#38B2AC]/20" },
  Firebase: { icon: <SiFirebase size={18} />, color: "bg-[#FFCA28]/10 text-[#FFCA28] border-[#FFCA28]/20" },
  Kotlin: { icon: <SiKotlin size={18} />, color: "bg-[#7F52FF]/10 text-[#7F52FF] border-[#7F52FF]/20" },
  'Jetpack Compose': { icon: <SiJetpackcompose size={18} />, color: "bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/20" },
};

// --- STACK DATA ---
const stackItems = [
  { name: "PHP", color: "bg-[#777BB4]/10 text-[#777BB4] border-[#777BB4]/20", icon: <SiPhp size={18} /> },
  { name: "Laravel", color: "bg-[#FF2D20]/10 text-[#FF2D20] border-[#FF2D20]/20", icon: <SiLaravel size={18} /> },
  { name: "PostgreSQL", color: "bg-[#336791]/10 text-[#336791] border-[#336791]/20", icon: <SiPostgresql size={18} /> },
  { name: "Next.js", color: "bg-zinc-100/10 text-zinc-100 border-zinc-100/20", icon: <SiNextdotjs size={18} /> },
  { name: "React", color: "bg-[#61DAFB]/10 text-[#61DAFB] border-[#61DAFB]/20", icon: <SiReact size={18} /> },
  { name: "JavaScript", color: "bg-[#F7DF1E]/10 text-[#F7DF1E] border-[#F7DF1E]/20", icon: <SiJavascript size={18} /> },
  { name: "Tailwind", color: "bg-[#38B2AC]/10 text-[#38B2AC] border-[#38B2AC]/20", icon: <SiTailwindcss size={18} /> },
  { name: "TypeScript", color: "bg-[#3178C6]/10 text-[#3178C6] border-[#3178C6]/20", icon: <SiTypescript size={18} /> },
];

const content: Record<'pt' | 'en', Content> = {
  pt: {
    hero: {
      subtext: "Desenvolvedor focado na criação de aplicações web completas e experiências digitais de alto nível.",
      stackTeaser: "PHP · Javascript · Typescript e mais",
      stackLabel: "Stack Principal",
    },
    sections: {
      projects: "Meus Projetos",
      otherProjects: "Outros Projetos",
      featured: "Destaque"
    },
    projects: {
      featured: {
        title: 'Frequência Certa',
        description: 'Sistema full-stack completo para controle de frequência e gestão acadêmica.',
        longDescription: 'Desenvolvido como trabalho final e evoluído para uma aplicação robusta com painéis administrativos, controle de presença em tempo real, relatórios automatizados em PDF e integração com Google Gemini para análise de desempenho.',
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
      main: [
        {
          title: 'Dashboard Financeiro',
          description: 'Sistema em tempo real para gestão de ativos e passivos.',
          longDescription: 'Um dashboard moderno e interativo para gerenciamento de finanças pessoais, permitindo ao usuário adicionar, visualizar, editar e excluir transações de receitas e despesas. A aplicação conta com resumos financeiros e visualizações gráficas para uma análise clara dos dados.',
          techs: ['React', 'JS', 'Firebase'],
          links: { github: 'https://github.com/naicolas-dev/dashboard-financeiro-irt' },
          cta: { text: "Visitar", link: "https://despesas-trabalho.vercel.app" },
          images: [
            '/projects/dashboard financeiro/WhatsApp Image 2026-01-14 at 19.24.58.jpeg',
            '/projects/dashboard financeiro/WhatsApp Image 2026-01-14 at 19.25.02.jpeg',
            '/projects/dashboard financeiro/WhatsApp Image 2026-01-14 at 19.25.07.jpeg'
          ],
        },
        {
          title: 'TikTok Downloader',
          description: 'App Android para download de vídeos sem marca d\'água.',
          longDescription: 'Aplicativo nativo focado em performance que interage com a API do TikTok para extrair vídeos limpos. Interface minimalista e downloads em background.',
          techs: ['Kotlin', 'Jetpack Compose', 'API Rest'],
          links: { github: 'https://github.com/naicolas-dev/tiktok-downloader' },
          cta: { text: "Baixar", link: "https://github.com/naicolas-dev/tiktok-downloader/releases/tag/v1.2.0" },
          images: [
            '/projects/tiktok downloader/preview.jpeg',
            '/projects/tiktok downloader/preview2.jpeg'
          ],
        },
        {
          title: 'A Ordem Survived',
          description: 'Portal imersivo para servidor de DayZ com foco em performance.',
          longDescription: 'Website promocional com alto impacto visual, demonstrando as principais funcionalidades do servidor.',
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
          description: 'Landing page de alta conversão para serviços elétricos.',
          longDescription: 'Landing page otimizada para SEO e conversão, com formulários de contato integrados e design responsivo moderno.',
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
      other: [
        { name: 'Nutrika', tech: 'Next.js & React' },
        { name: 'Biblioteca API', tech: 'PHP & Laravel' },
        { name: 'WhatsApp Portfolio', tech: 'Next.js & React' },
      ],
      viewCode: 'Abrir no GitHub',
    },
    education: {
      title: "Formação",
      items: [
        {
          title: "Técnico em Desenvolvimento de Sistemas",
          institution: "Proz Educação • 2024 — 2026",
          dotColor: "bg-[#0A84FF]",
          textColor: "text-white"
        },
        {
          title: "Ensino Médio Completo",
          institution: "Escola Estadual Professora Dilma Quadros • 2023 — 2025",
          dotColor: "bg-zinc-800",
          textColor: "text-zinc-400"
        }
      ]
    }
  },
  en: {
    hero: {
      subtext: "Developer focused on building complete web applications and high-level digital experiences.",
      stackTeaser: "PHP · Javascript · Typescript and more",
      stackLabel: "Main Stack",
    },
    sections: {
      projects: "My Projects",
      otherProjects: "Other Projects",
      featured: "Featured"
    },
    projects: {
      featured: {
        title: 'Frequência Certa',
        description: 'Complete full-stack system for attendance control and academic management.',
        longDescription: 'Developed as a final thesis and evolved into a robust application with administrative dashboards, real-time attendance tracking, automated PDF reports, and Google Gemini integration for performance analysis.',
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
      main: [
        {
          title: 'Finance Dashboard',
          description: 'Real-time system for asset and liability management.',
          longDescription: 'A modern and interactive dashboard for personal finance management, allowing users to add, view, edit, and delete income and expense transactions. The application features financial summaries and graphical visualizations for clear data analysis.',
          techs: ['React', 'JS', 'Firebase'],
          links: { github: 'https://github.com/naicolas-dev/dashboard-financeiro-irt' },
          cta: { text: "Visit", link: "https://despesas-trabalho.vercel.app" },
          images: [
            '/projects/dashboard financeiro/WhatsApp Image 2026-01-14 at 19.24.58.jpeg',
            '/projects/dashboard financeiro/WhatsApp Image 2026-01-14 at 19.25.02.jpeg',
            '/projects/dashboard financeiro/WhatsApp Image 2026-01-14 at 19.25.07.jpeg'
          ],
        },
        {
          title: 'TikTok Downloader',
          description: 'Android app for downloading watermak-free videos.',
          longDescription: 'Performance-focused native application interacting with TikTok API to extract clean videos. Minimalist interface and background downloads.',
          techs: ['Kotlin', 'Jetpack Compose', 'API Rest'],
          links: { github: 'https://github.com/naicolas-dev/tiktok-downloader' },
          cta: { text: "Download", link: "https://github.com/naicolas-dev/tiktok-downloader/releases/tag/v1.2.0" },
          images: [
            '/projects/tiktok downloader/preview.jpeg',
            '/projects/tiktok downloader/preview2.jpeg'
          ],
        },
        {
          title: 'A Ordem Survived',
          description: 'Immersive portal for DayZ server focused on performance.',
          longDescription: 'Promotional website with high visual impact, demonstrating key server functionalities.',
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
          description: 'High-conversion landing page for electrical services.',
          longDescription: 'SEO and conversion optimized landing page, with integrated contact forms and modern responsive design.',
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
      other: [
        { name: 'Nutrika', tech: 'Next.js & React' },
        { name: 'Library API', tech: 'PHP & Laravel' },
        { name: 'WhatsApp Portfolio', tech: 'Next.js & React' },
      ],
      viewCode: 'View on GitHub',
    },
    education: {
      title: "Education",
      items: [
        {
          title: "Systems Development Technician",
          institution: "Proz Education • 2024 — 2026",
          dotColor: "bg-[#0A84FF]",
          textColor: "text-white"
        },
        {
          title: "High School Diploma",
          institution: "State School Professora Dilma Quadros • 2023 — 2025",
          dotColor: "bg-zinc-800",
          textColor: "text-zinc-400"
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
    <h2 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-4">
      {children}
      <div className="h-px w-32 bg-zinc-800/50" />
    </h2>
  </motion.div>
);

const StackBadge = ({ name, color, children }: { name: string, color: string, children: React.ReactNode }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-opacity-5 backdrop-blur-sm transition-all hover:scale-105 select-none cursor-default ${color}`}>
    {children}
    <span className="font-medium text-[11px] tracking-wide">{name}</span>
  </div>
);



// --- MAIN PAGE ---

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [isStackHovered, setIsStackHovered] = useState(false);

  const t = content[language];

  // Prevent hydration mismatch for checking local storage or random values if any (none here but good practice)
  useEffect(() => {
    setMounted(true);
  }, []);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };



  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject) return;
    setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
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
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <main className="min-h-screen relative font-sans selection:bg-[#0A84FF]/30 selection:text-blue-100">
      <TabTitleHandler language={language} />
      {/* Background Texture & Lighting - Apple Style */}
      <div className="fixed inset-0 bg-[#000000] -z-20" />
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#0A84FF]/10 blur-[120px] rounded-full -z-10 mix-blend-screen opacity-40" />
      <div className="fixed bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-[#000000] to-transparent z-0 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 relative z-10">

        {/* --- 1. HERO --- */}
        <header className="mb-40 relative flex flex-col items-center text-center">
          <button
            onClick={() => setLanguage(l => l === 'pt' ? 'en' : 'pt')}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-[#151516]/60 border border-[#1d1d1f] backdrop-blur-xl text-xs font-medium text-[#86868b] hover:text-white hover:bg-[#1c1c1e] transition-all hover:scale-105 shadow-xl group overflow-hidden"
          >
            <Globe size={16} />
            <div className="flex items-center overflow-hidden">
              <span className="max-w-[20px] group-hover:max-w-0 opacity-100 group-hover:opacity-0 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden">
                {language.toUpperCase()}
              </span>
              <span className="max-w-0 group-hover:max-w-[200px] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden">
                {language === 'pt' ? 'Português Brasileiro' : 'English US'}
              </span>
            </div>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Apple ease
            className="flex flex-col items-center max-w-3xl"
          >
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-white mb-6 leading-[0.9]">
                Nicolas V. Alves
              </h1>
              <p className="text-[18px] md:text-[22px] text-[#A1A1AA] font-normal leading-relaxed max-w-[600px] mb-12">
                {t.hero.subtext}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mb-16">
              <a
                href="https://github.com/naicolas-dev"
                target="_blank"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-all hover:scale-105"
              >
                <Github size={20} />
                <span>GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/naicolas-dev/"
                target="_blank"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-white transition-all hover:scale-105"
              >
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>

              <a
                href="mailto:naicolas.dev@gmail.com"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-white transition-all hover:scale-105"
              >
                <Mail size={20} />
                <span>Email</span>
              </a>
            </div>

            {/* --- STACK SECTION (INTERACTIVE) --- */}
            <div
              className="h-12 flex items-center justify-center cursor-default"
              onMouseEnter={() => setIsStackHovered(true)}
              onMouseLeave={() => setIsStackHovered(false)}
            >
              <AnimatePresence mode="wait">
                {!isStackHovered ? (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 group cursor-default transition-all"
                  >
                    <Layers size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    <span className="text-zinc-500 text-sm font-medium group-hover:text-zinc-300 transition-colors">{t.hero.stackLabel}:</span>
                    <span className="text-zinc-600 text-sm font-light tracking-wide group-hover:text-zinc-400 transition-colors">
                      {t.hero.stackTeaser}
                    </span>
                    <Plus size={14} className="text-zinc-700 group-hover:text-zinc-500 transition-colors ml-1 opacity-50 group-hover:opacity-100" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="badges"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-wrap gap-2 justify-center"
                  >
                    {stackItems.map((item) => (
                      <StackBadge key={item.name} name={item.name} color={item.color}>
                        {item.icon}
                      </StackBadge>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Remove Old Contact Section from here as it's now minimal buttons above */}

          </motion.div>
        </header>


        {/* --- 2. PROJETOS (Main) --- */}
        <section className="mb-32">
          <SectionHeading number="1">{t.sections.projects}</SectionHeading>

          <div className="space-y-16">

            {/* DESTAQUE: TCC */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative cursor-pointer rounded-3xl overflow-hidden border border-[#1d1d1f] bg-[#151516]/50 backdrop-blur-md hover:border-[#3a3a3c] transition-all duration-500"
              onClick={() => openProject(t.projects.featured)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A84FF]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative p-8 md:p-12 z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-medium text-[#0A84FF] uppercase tracking-widest mb-3 block">{t.sections.featured}</span>
                  <h3 className="text-4xl font-semibold text-[#F5F5F7] mb-4 tracking-tight">{t.projects.featured.title}</h3>
                  <p className="text-[#86868b] leading-relaxed mb-8 text-lg font-light">
                    {t.projects.featured.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {t.projects.featured.techs.map(t => {
                      const tech = techMap[t] || { icon: <Code2 size={18} />, color: "bg-zinc-800/10 text-zinc-400" };
                      return (
                        <StackBadge key={t} name={t} color="bg-white/5 border-white/5 text-zinc-300">
                          {tech.icon}
                        </StackBadge>
                      );
                    })}
                  </div>

                  <div className="flex gap-4">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:text-[#0A84FF] transition-colors">
                      Ver Detalhes <ArrowRight size={14} />
                    </span>
                  </div>
                </div>

                <div className="relative h-64 md:h-full min-h-[250px] rounded-2xl overflow-hidden border border-white/5 bg-black/50">
                  {/* Placeholder for project preview or abstract graphic */}
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                    <Globe size={48} strokeWidth={1} />
                  </div>
                  {/* If images exist, show the first one blurred or specific */}
                  {t.projects.featured.images[0] && (
                    <img
                      src={t.projects.featured.images[0]}
                      alt="Project Preview"
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105 transform"
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
                  onClick={() => openProject(project)}
                  className="p-8 rounded-2xl border border-[#1d1d1f] bg-[#151516]/40 hover:bg-[#1c1c1e] hover:border-[#3a3a3c] transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-xl font-semibold text-[#F5F5F7] group-hover:text-white transition-colors tracking-tight">{project.title}</h4>
                      <div className="p-2 rounded-full bg-[#1c1c1e] text-[#86868b] group-hover:text-white transition-colors">
                        <ArrowRight size={16} className="-rotate-45" />
                      </div>
                    </div>

                    <p className="text-[#86868b] text-sm leading-relaxed mb-6 font-light line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.techs.map(t => (
                      <span key={t} className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 border border-white/5 px-2 py-1 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>


        {/* --- 3. OUTROS EXPERIMENTOS --- */}
        <section className="mb-40">
          <SectionHeading number="2">{t.sections.otherProjects}</SectionHeading>

          <div className="divide-y divide-white/5 border-t border-b border-white/5">
            {t.projects.other.map((p, i) => (
              <motion.div
                key={i}
                className="py-4 flex items-center justify-between group hover:bg-white/5 px-4 rounded-lg -mx-4 transition-colors cursor-default"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <h5 className="text-zinc-300 font-medium text-sm group-hover:text-white transition-colors">{p.name}</h5>
                <p className="text-zinc-600 text-xs font-mono group-hover:text-zinc-400 transition-colors">{p.tech}</p>
              </motion.div>
            ))}
          </div>
        </section>


        {/* --- 4. FORMAÇÃO --- */}
        <section className="mb-40">
          <SectionHeading number="3">{t.education.title}</SectionHeading>

          <div className="relative space-y-12 pl-4">
            {/* Timeline Line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-zinc-800 via-zinc-800 to-transparent" />

            {t.education.items.map((item, i) => (
              <motion.div
                key={i}
                className="relative pl-10"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-[#050505] ${item.dotColor} shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10`} />
                <div className="mb-2">
                  <span className={`text-xl font-semibold block tracking-tight ${item.textColor}`}>{item.title}</span>
                  <span className="text-zinc-500 text-sm font-medium">{item.institution}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* --- FOOTER --- */}
        <footer className="border-t border-white/5 pt-12 pb-12 flex flex-col items-center justify-center gap-6 text-zinc-600">
          <div className="flex gap-6">
            <a href="https://github.com/naicolas-dev" className="hover:text-white transition-colors"><Github size={20} /></a>
            <a href="https://www.linkedin.com/in/naicolas-dev/" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
            <a href="mailto:naicolas.dev@gmail.com" className="hover:text-white transition-colors"><Mail size={20} /></a>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm">© {new Date().getFullYear()} <a href="https://github.com/naicolas-dev" className="hover:text-blue-400 transition-colors">Nicolas Viana Alves</a></p>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#151516] border border-[#1d1d1f] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-full text-zinc-400 hover:text-white transition-colors z-20"
              >
                <X size={20} />
              </button>

              {/* Carousel Section */}
              <div
                className="w-full h-64 sm:h-80 bg-zinc-950 relative group flex items-center justify-center overflow-hidden cursor-zoom-in"
                onClick={() => setIsFullScreen(true)}
              >

                {/* Blurred Background for Vertical Images */}
                <div className="absolute inset-0">
                  <motion.img
                    key={`bg-${currentImageIndex}`}
                    src={selectedProject.images[currentImageIndex]}
                    className="w-full h-full object-cover opacity-20 blur-xl scale-110"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={selectedProject.images[currentImageIndex]}
                    alt={`${selectedProject.title} image ${currentImageIndex + 1}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-contain relative z-10"
                  />
                </AnimatePresence>

                {/* Gradient Overlay for Controls Visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 via-transparent to-transparent pointer-events-none z-10" />

                {/* Carousel Controls */}
                {selectedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
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

                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  Clique para ampliar
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-3xl font-bold text-white mb-2">{selectedProject.title}</h3>
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
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-xs font-medium border border-zinc-700/50"
                      >
                        <Github size={16} /> {t.projects.viewCode}
                      </a>
                    )}
                  </div>

                  {selectedProject.cta && (
                    <a
                      href={selectedProject.cta.link || '#'}
                      target="_blank"
                      onClick={(e) => !selectedProject.cta?.link && e.preventDefault()}
                      className={`
                        flex items-center gap-2 px-8 py-2.5 rounded-full font-medium text-sm transition-all duration-300
                        ${selectedProject.cta.link
                          ? 'bg-[#0A84FF]/10 hover:bg-[#0A84FF]/20 text-[#0A84FF] hover:text-[#409CFF] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer border border-[#0A84FF]/30'
                          : 'bg-zinc-800/50 text-zinc-500 cursor-default opacity-50 border border-zinc-800'}
                      `}
                    >
                      {selectedProject.cta.text}
                      {selectedProject.cta.link && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FULL SCREEN GALLERY --- */}
      <AnimatePresence>
        {isFullScreen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsFullScreen(false)}
          >
            <button
              onClick={() => setIsFullScreen(false)}
              className="absolute top-4 right-4 p-3 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full transition-colors z-50"
            >
              <X size={24} />
            </button>

            <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={selectedProject.images[currentImageIndex]}
                  alt={`${selectedProject.title} full screen ${currentImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-full max-h-full object-contain"
                />
              </AnimatePresence>

              {selectedProject.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-zinc-900/50 hover:bg-zinc-800 text-white rounded-full transition-colors z-50"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-zinc-900/50 hover:bg-zinc-800 text-white rounded-full transition-colors z-50"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm backdrop-blur-md">
                {currentImageIndex + 1} / {selectedProject.images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}