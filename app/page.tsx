'use client';

import { useState, useEffect } from 'react';
import { track } from '@vercel/analytics';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
  Github, Linkedin, Mail, ArrowRight, X,
  Globe, Check,
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
import { LocationIndicator } from './components/LocationIndicator';
import Magnetic from './components/Magnetic';
import StaggeredText from './components/StaggeredText';

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
    heroCTA: string;
    exploreProject: string;
    letsConnect: string;
  };
  projects: {
    featured: Project;
    main: Project[];
    other: { name: string; tech: string; link: string }[];
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
  PHP: { icon: <SiPhp size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  Laravel: { icon: <SiLaravel size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  MySQL: { icon: <SiMysql size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  PostgreSQL: { icon: <SiPostgresql size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  AlpineJS: { icon: <SiAlpinedotjs size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  Bootstrap: { icon: <SiBootstrap size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  MVC: { icon: <Code2 size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  React: { icon: <SiReact size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  TypeScript: { icon: <SiTypescript size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  'Node.js': { icon: <SiNodedotjs size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  Java: { icon: <FaJava size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  'Android SDK': { icon: <SiAndroid size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  'API Rest': { icon: <Server size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  HTML5: { icon: <SiHtml5 size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  CSS3: { icon: <SiCss3 size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  JavaScript: { icon: <SiJavascript size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  JS: { icon: <SiJavascript size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  'Next.js': { icon: <SiNextdotjs size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  Tailwind: { icon: <SiTailwindcss size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  Firebase: { icon: <SiFirebase size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  Kotlin: { icon: <SiKotlin size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
  'Jetpack Compose': { icon: <SiJetpackcompose size={18} />, color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]" },
};

// --- STACK DATA ---
const stackItems = [
  { name: "PHP", color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]", icon: <SiPhp size={18} /> },
  { name: "Laravel", color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]", icon: <SiLaravel size={18} /> },
  { name: "PostgreSQL", color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]", icon: <SiPostgresql size={18} /> },
  { name: "Next.js", color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]", icon: <SiNextdotjs size={18} /> },
  { name: "React", color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]", icon: <SiReact size={18} /> },
  { name: "JavaScript", color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]", icon: <SiJavascript size={18} /> },
  { name: "Tailwind", color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]", icon: <SiTailwindcss size={18} /> },
  { name: "TypeScript", color: "bg-[#5F6B7C]/10 text-[#5F6B7C] border-[#30363D]", icon: <SiTypescript size={18} /> },
];

const content: Record<'pt' | 'en', Content> = {
  pt: {
    hero: {
      subtext: "Desenvolvedor Full-Stack focado em transformar problemas reais e complexos em sistemas web robustos e escaláveis com Laravel, Next.js e mais.",
      stackTeaser: "PHP · Javascript · Typescript e mais",
      stackLabel: "Stack Principal",
    },
    sections: {
      projects: "Meus Projetos",
      otherProjects: "Outros Projetos",
      featured: "Destaque",
      heroCTA: "ver meus projetos",
      exploreProject: "Explorar Projeto",
      letsConnect: "Vamos Conversar"
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
        { name: 'Nutrika', tech: 'Next.js & React', link: 'https://github.com/naicolas-dev/nutrika' },
        { name: 'WhatsApp Portfolio', tech: 'Next.js & React', link: 'https://whatsapp-portfolio.vercel.app' },
        { name: 'Kanban API', tech: 'PHP & Laravel', link: 'https://github.com/naicolas-dev/kanban-api' },
        { name: 'Biblioteca API', tech: 'PHP & Laravel', link: 'https://github.com/naicolas-dev/biblioteca-api' },
        { name: 'MyAi Recipes', tech: 'PHP & Laravel', link: 'https://github.com/naicolas-dev/api-receitas' },
        { name: 'Gestor de Segurança', tech: 'PHP & CodeIgniter', link: 'https://github.com/naicolas-dev/GestorSeguranca' },
      ],
      viewCode: 'Abrir no GitHub',
    },
    education: {
      title: "Formação Acadêmica",
      items: [
        {
          title: "Bacharelado em Sistemas de Informação",
          institution: "Universidade Estadual de Montes Claros (Unimontes) • 2026 — 2029",
          dotColor: "bg-[#A6ACCD]",
          textColor: "text-white"
        },
        {
          title: "Técnico em Desenvolvimento de Sistemas",
          institution: "Proz Educação • 2024 — 2026",
          dotColor: "bg-zinc-800",
          textColor: "text-zinc-400"
        },
        {
          title: "Ensino Médio",
          institution: "Escola Estadual Professora Dilma Quadros • 2023 — 2025",
          dotColor: "bg-zinc-800",
          textColor: "text-zinc-400"
        }
      ]
    }
  },
  en: {
    hero: {
      subtext: "Full-Stack Developer focused on turning complex and real problems into robust, scalable web systems with Laravel, Next.js and more.",
      stackTeaser: "PHP · Javascript · Typescript and more",
      stackLabel: "Main Stack",
    },
    sections: {
      projects: "My Projects",
      otherProjects: "Other Projects",
      featured: "Featured",
      heroCTA: "view my projects",
      exploreProject: "Explore Project",
      letsConnect: "Let's Connect"
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
        { name: 'Nutrika', tech: 'Next.js & React', link: 'https://github.com/naicolas-dev/nutrika' },
        { name: 'WhatsApp Portfolio', tech: 'Next.js & React', link: 'https://whatsapp-portfolio.vercel.app' },
        { name: 'Kanban API', tech: 'PHP & Laravel', link: 'https://github.com/naicolas-dev/kanban-api' },
        { name: 'Library API', tech: 'PHP & Laravel', link: 'https://github.com/naicolas-dev/biblioteca-api' },
        { name: 'MyAi Recipes', tech: 'PHP & Laravel', link: 'https://github.com/naicolas-dev/api-receitas' },
        { name: 'Security Manager', tech: 'PHP & CodeIgniter', link: 'https://github.com/naicolas-dev/GestorSeguranca' },
      ],
      viewCode: 'View on GitHub',
    },
    education: {
      title: "Education",
      items: [
        {
          title: "Bachelor’s Degree in Information Systems",
          institution: "State University of Montes Claros (Unimontes) • 2026 — 2029",
          dotColor: "bg-[#A6ACCD]",
          textColor: "text-white"
        },
        {
          title: "Technical Degree in Systems Development",
          institution: "Proz Education • 2024 — 2026",
          dotColor: "bg-zinc-800",
          textColor: "text-zinc-400"
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
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#30363D] bg-zinc-800/10 transition-all hover:bg-zinc-800/20 select-none cursor-default ${color}`}>
    {children}
    <span className="font-medium text-[11px] tracking-wide">{name}</span>
  </div>
);



// --- MAIN PAGE ---

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0); // For slide animation direction
  const [isFullScreen, setIsFullScreen] = useState(false);
  const dragControls = useDragControls(); // For controlling bottom sheet drag
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');

  const [isStackHovered, setIsStackHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideLanguageToggle, setHideLanguageToggle] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

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

      // Hide language toggle when reaching projects section
      const projectsSection = document.getElementById('projects-section');
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        // Hide when the top of the projects section reaches the top of the viewport (offset by 100px)
        // "Eu digo dessa parte pra frente" -> From this part (title visible) onwards.
        setHideLanguageToggle(rect.top < 150);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial

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
        const oldMain = content[oldLanguage].projects.main;
        const index = oldMain.findIndex(p => p.links.github === selectedProject.links.github || p.links.demo === selectedProject.links.demo);
        if (index !== -1) {
          setSelectedProject(t.projects.main[index]);
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
    <main className="min-h-screen relative font-sans selection:bg-[#A6ACCD]/30 selection:text-zinc-100 overflow-x-hidden">
      <TabTitleHandler language={language} />
      {/* Background Texture & Lighting - Apple Style */}
      <div className="fixed inset-0 bg-[#0F1115] -z-20" />

      <div className="max-w-5xl mx-auto px-6 py-20 md:py-32 relative z-10">

        {/* --- 1. HERO --- */}
        <header className="mb-32 md:mb-40 relative flex flex-col items-center text-center">
          <div className={`fixed top-4 right-4 md:top-6 md:right-6 z-50 flex flex-col items-end transition-opacity duration-300 ${isMobile && hideLanguageToggle ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <motion.button
              layout={true}
              onClick={() => {
                if (isMobile) {
                  setIsLangMenuOpen(!isLangMenuOpen);
                } else {
                  setLanguage(l => l === 'pt' ? 'en' : 'pt');
                }
              }}
              className={`flex items-center justify-center rounded-full bg-[#161B22] border border-[#30363D] text-xs font-medium text-zinc-100 hover:text-white hover:bg-[#161B22] hover:border-[#30363D] transition-colors shadow-xl group overflow-hidden ${(!isScrolled && isMobile) ? 'px-4 py-2' : 'w-9 h-9 md:w-auto md:h-auto md:px-3 md:py-2 md:justify-start'}`}
              transition={{ layout: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 } }}
            >
              <motion.div layout="position" className="flex-shrink-0">
                <Globe size={16} />
              </motion.div>

              {/* Show text if: Desktop OR (Mobile AND Not Scrolled) */}
              <motion.div
                layout="position"
                className={`flex items-center overflow-hidden`}
                animate={{
                  width: (isMobile && isScrolled) ? 0 : "auto",
                  opacity: (isMobile && isScrolled) ? 0 : 1,
                  marginLeft: (isMobile && isScrolled) ? 0 : 8 // 8px gap manually applied
                }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  {language === 'pt' ? (
                    <motion.div
                      key="pt"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center text-xs whitespace-nowrap"
                    >
                      {/* Mobile Text (Simple) */}
                      <span className="md:hidden">🇧🇷 Português (Brasil)</span>

                      {/* Desktop Text (Animated) */}
                      <div className="hidden md:flex items-center">
                        <span>p</span>
                        <span className="max-w-0 group-hover:max-w-[20px] overflow-hidden transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">or</span>
                        <span>t</span>
                        <span className="max-w-0 group-hover:max-w-[45px] overflow-hidden transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">uguês</span>
                        <span className="max-w-[10px] group-hover:max-w-0 overflow-hidden transition-all duration-500 ease-in-out opacity-100 group-hover:opacity-0">-</span>
                        <span className="max-w-0 group-hover:max-w-[10px] overflow-hidden transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">&nbsp;</span>
                        <span>B</span>
                        <span className="max-w-0 group-hover:max-w-[70px] overflow-hidden transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">rasileiro</span>
                        <span className="max-w-[10px] group-hover:max-w-0 overflow-hidden transition-all duration-500 ease-in-out opacity-100 group-hover:opacity-0">R</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="en"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center text-xs whitespace-nowrap"
                    >
                      {/* Mobile Text (Simple) */}
                      <span className="md:hidden">🇺🇸 English (United States)</span>

                      {/* Desktop Text (Animated) */}
                      <div className="hidden md:flex items-center">
                        <span>en</span>
                        <span className="max-w-[10px] group-hover:max-w-0 overflow-hidden transition-all duration-500 ease-in-out opacity-100 group-hover:opacity-0">-</span>
                        <span className="max-w-0 group-hover:max-w-[40px] overflow-hidden transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">glish&nbsp;</span>
                        <span>US</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.button>

            {/* Language Dropdown Menu (Mobile Only) */}
            <AnimatePresence>
              {isLangMenuOpen && isMobile && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute top-12 right-0 bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden shadow-2xl min-w-[140px] flex flex-col"
                >
                  <button
                    onClick={() => { setLanguage('pt'); setIsLangMenuOpen(false); }}
                    className={`flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-zinc-800 ${language === 'pt' ? 'text-white bg-zinc-800/50' : 'text-zinc-400'}`}
                  >
                    <span>🇧🇷 Português (Brasil)</span>
                    {language === 'pt' && <Check size={14} className="text-[#A6ACCD]" />}
                  </button>
                  <div className="h-px bg-[#30363D]" />
                  <button
                    onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }}
                    className={`flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-zinc-800 ${language === 'en' ? 'text-white bg-zinc-800/50' : 'text-zinc-400'}`}
                  >
                    <span>🇺🇸 English (United States)</span>
                    {language === 'en' && <Check size={14} className="text-[#A6ACCD]" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Apple ease
            className="flex flex-col items-center"
          >
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <StaggeredText
                text="Nicolas V. Alves"
                className="text-7xl md:text-9xl font-extrabold tracking-tighter text-white mb-6 leading-[0.9]"
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={language}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col items-center"
                >
                  <p className="text-[18px] md:text-[22px] text-[#A6ACCD] font-normal leading-relaxed max-w-[600px] mb-6">
                    {t.hero.subtext}
                  </p>

                  <LocationIndicator language={language} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Magnetic>
                <button
                  onClick={() => {
                    track('Hero CTA Click', { action: 'Scroll to Projects' });
                    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative flex items-center gap-2 px-8 py-4 rounded-full bg-[#A6ACCD] text-black font-bold hover:bg-[#A6ACCD] transition-all hover:scale-105 shadow-[0_20px_40px_rgba(166,172,205,0.03)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={language}
                      initial={{ opacity: 0, x: 10 }} // Horizontal slide for button text
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {t.sections.heroCTA}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </Magnetic>

              <div className="flex gap-4">
                <Magnetic>
                  <a
                    href="https://github.com/naicolas-dev"
                    target="_blank"
                    onClick={() => track('Social Click', { platform: 'Github', location: 'Header' })}
                    className="p-4 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all hover:scale-110 flex items-center justify-center"
                  >
                    <Github size={24} />
                  </a>
                </Magnetic>

                <Magnetic>
                  <a
                    href="https://www.linkedin.com/in/naicolas-dev/"
                    target="_blank"
                    onClick={() => track('Social Click', { platform: 'Linkedin', location: 'Header' })}
                    className="p-4 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all hover:scale-110 flex items-center justify-center"
                  >
                    <Linkedin size={24} />
                  </a>
                </Magnetic>

                <Magnetic>
                  <a
                    href="mailto:naicolas.dev@gmail.com"
                    onClick={() => track('Social Click', { platform: 'Mail', location: 'Header' })}
                    className="p-4 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all hover:scale-110 flex items-center justify-center"
                  >
                    <Mail size={24} />
                  </a>
                </Magnetic>
              </div>
            </div>

            {/* --- STACK SECTION (INTERACTIVE) --- */}
            <div
              className="min-h-[3rem] relative flex items-center justify-center cursor-default w-full group"
              onMouseEnter={() => !isMobile && setIsStackHovered(true)}
              onMouseLeave={() => !isMobile && setIsStackHovered(false)}
            >
              {/* Trigger horizontal da esquerda à direita sem afetar o layout */}
              <div className="absolute inset-x-[-100vw] top-0 bottom-0 z-0 bg-transparent" />

              <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                <AnimatePresence mode="wait">
                  {!isStackHovered ? (
                    <>
                      <motion.div
                        key={`text-${language}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 group cursor-pointer transition-all active:scale-95 bg-zinc-800/40 border border-zinc-700/50 px-4 py-2 rounded-full hover:bg-zinc-800/60 hover:border-zinc-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsStackHovered(true);
                        }}
                      >
                        <Layers size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                        <span className="text-zinc-500 text-sm font-medium group-hover:text-zinc-300 transition-colors hidden md:inline">{t.hero.stackLabel}:</span>
                        <span className="text-zinc-400 md:text-zinc-600 text-xs md:text-sm font-medium md:font-light tracking-wide group-hover:text-zinc-300 md:group-hover:text-zinc-400 transition-colors">
                          {t.hero.stackTeaser}
                        </span>
                        <Plus size={14} className="text-zinc-500 md:text-zinc-700 group-hover:text-zinc-300 md:group-hover:text-zinc-500 transition-colors ml-1 opacity-100 md:opacity-50 md:group-hover:opacity-100" />
                      </motion.div>
                    </>
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
            </div>

            {/* Remove Old Contact Section from here as it's now minimal buttons above */}

          </motion.div>
        </header>


        {/* --- 2. PROJETOS (Main) --- */}
        <section id="projects-section" className="mb-32">
          <SectionHeading number="1">{t.sections.projects}</SectionHeading>

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
                className="group relative cursor-pointer rounded-3xl overflow-hidden border border-[#30363D] bg-[#161B22] transition-all duration-300 hover:border-[#30363D]"
                onClick={() => {
                  track('Project Click', { project: t.projects.featured.title, type: 'Featured' });
                  openProject(t.projects.featured);
                }}
              >

                <div className="relative p-8 md:p-12 z-10 grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="text-xs font-medium text-[#A6ACCD] uppercase tracking-widest mb-3 block">{t.sections.featured}</span>
                    <h3 className="text-4xl font-semibold text-[#A6ACCD] mb-4 tracking-tight">{t.projects.featured.title}</h3>
                    <p className="text-[#5F6B7C] leading-relaxed mb-8 text-lg font-light">
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
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#A6ACCD] transition-colors">
                        {language === 'pt' ? 'Explorar Projeto' : 'Explore Project'} <ArrowRight size={14} />
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
                    onClick={() => {
                      track('Project Click', { project: project.title, type: 'Main' });
                      openProject(project);
                    }}
                    className="p-8 rounded-2xl border border-[#30363D] bg-[#161B22]/50 hover:bg-[#161B22] hover:border-[#30363D] transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <h4 className="text-xl font-semibold text-[#A6ACCD] group-hover:text-white transition-colors tracking-tight">{project.title}</h4>
                        <div className="p-2 rounded-full bg-[#1c1c1e] text-[#5F6B7C] group-hover:text-white transition-colors">
                          <ArrowRight size={16} className="-rotate-45" />
                        </div>
                      </div>

                      <p className="text-[#5F6B7C] text-sm leading-relaxed mb-6 font-light line-clamp-3">
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

            </motion.div>
          </AnimatePresence>
        </section>


        {/* --- 3. OUTROS EXPERIMENTOS --- */}
        <section className="mb-40">
          <SectionHeading number="2">{t.sections.otherProjects}</SectionHeading>

          <AnimatePresence mode="wait">
            <motion.div
              key={language}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="divide-y divide-white/5 border-t border-b border-white/5"
            >
              {t.projects.other.map((p, i) => (
                <motion.a
                  key={i}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('Project Click', { project: p.name, type: 'Other' })}
                  className="py-4 flex items-center justify-between group hover:bg-white/5 px-4 rounded-lg -mx-4 transition-colors cursor-pointer block"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <h5 className="text-zinc-300 font-medium text-sm group-hover:text-white transition-colors">{p.name}</h5>
                  <div className="flex items-center gap-3">
                    <p className="text-zinc-600 text-xs font-mono group-hover:text-zinc-400 transition-colors">{p.tech}</p>
                    <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-white transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>


        {/* --- 4. FORMAÇÃO --- */}
        <section className="mb-40">
          <SectionHeading number="3">{t.education.title}</SectionHeading>

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

              {t.education.items.map((item, i) => (
                <motion.div
                  key={i}
                  className="relative pl-10"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-[#0F1115] ${item.dotColor} shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10`} />
                  <div className="mb-2">
                    <span className={`text-xl font-semibold block tracking-tight ${item.textColor}`}>{item.title}</span>
                    <span className="text-zinc-500 text-sm font-medium">{item.institution}</span>
                  </div>
                </motion.div>
              ))}
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
            className="p-12 rounded-3xl border border-[#30363D] bg-[#161B22] flex flex-col items-center gap-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#A6ACCD]/5 blur-[80px] rounded-full -mr-32 -mt-32" />

            <AnimatePresence mode="wait">
              <motion.div
                key={language}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex flex-col items-center gap-8"
              >
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    {language === 'pt' ? 'Vamos Colaborar?' : "Let's Collaborate"}
                  </h2>
                  <p className="text-zinc-400 text-lg max-w-[500px] mb-2 mx-auto">
                    {language === 'pt'
                      ? 'Tem um projeto interessante em mente? Vamos transformá-lo em realidade.'
                      : "Have an interesting project in mind? Let's turn it into reality."}
                  </p>
                </div>

                <Magnetic>
                  <a
                    href="mailto:naicolas.dev@gmail.com"
                    onClick={() => track('Contact CTA Click', { location: 'Footer Section' })}
                    className="px-10 py-4 rounded-full bg-[#A6ACCD] text-black font-bold text-lg hover:bg-[#A6ACCD] transition-all hover:scale-105 shadow-[0_20px_40px_rgba(166,172,205,0.03)] group flex items-center gap-3"
                  >
                    <Mail size={20} />
                    <span>{language === 'pt' ? 'Me Contrate' : 'Hire Me'}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </Magnetic>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </section>


        {/* --- FOOTER --- */}
        <footer className="border-t border-[#30363D] pt-12 pb-12 flex flex-col items-center justify-center gap-6 text-zinc-600">
          <div className="flex gap-6">
            <Magnetic><a href="https://github.com/naicolas-dev" onClick={() => track('Social Click', { platform: 'Github', location: 'Footer' })} className="hover:text-white transition-colors flex p-2"><Github size={20} /></a></Magnetic>
            <Magnetic><a href="https://www.linkedin.com/in/naicolas-dev/" onClick={() => track('Social Click', { platform: 'Linkedin', location: 'Footer' })} className="hover:text-white transition-colors flex p-2"><Linkedin size={20} /></a></Magnetic>
            <Magnetic><a href="mailto:naicolas.dev@gmail.com" onClick={() => track('Social Click', { platform: 'Mail', location: 'Footer' })} className="hover:text-white transition-colors flex p-2"><Mail size={20} /></a></Magnetic>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm">© {new Date().getFullYear()} <a href="https://github.com/naicolas-dev" className="hover:text-[#A6ACCD] transition-colors">Nicolas Viana Alves</a></p>
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
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#0F1115] sm:bg-[#0F1115]/90"
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
              className="bg-[#161B22] border-t sm:border border-[#30363D] rounded-t-[2rem] sm:rounded-2xl w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col will-change-transform"
            >
              {/* Mobile Drag Handle Area - Trigger for Drag */}
              <div
                className="sm:hidden w-full flex justify-center pt-3 pb-1 sticky top-0 bg-[#161B22] z-30 touch-none"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="w-12 h-1.5 bg-zinc-700/50 rounded-full" />
              </div>

              {/* Close Button - Hidden on Mobile (Bottom Sheet) */}
              <button
                onClick={() => setSelectedProject(null)}
                className="hidden sm:block absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-zinc-400 hover:text-white transition-colors z-50"
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

                <div className="absolute top-4 right-4 bg-black/80 sm:bg-black/50 text-white text-xs px-2 py-1 rounded z-20 pointer-events-none md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
                          onClick={() => track('Project Link Click', { project: selectedProject.title, type: 'Github' })}
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
                            ? 'bg-[#A6ACCD]/10 hover:bg-[#A6ACCD]/20 text-[#A6ACCD] hover:text-[#A6ACCD] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-500/10 cursor-pointer border border-[#A6ACCD]/30'
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
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 disabled:opacity-50"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 disabled:opacity-50"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 sm:bg-black/50 px-4 py-2 rounded-full text-white text-sm sm:backdrop-blur-md">
              {currentImageIndex + 1} / {selectedProject.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main >
  );
}