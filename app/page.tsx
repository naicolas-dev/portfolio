'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Mail, ArrowRight, X,
  Terminal, Database, Cpu, Globe,
  Smartphone, Zap, Server, Code2, ExternalLink,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  SiPhp, SiLaravel, SiNextdotjs, SiReact,
  SiJavascript, SiTailwindcss, SiTypescript
} from 'react-icons/si';

// --- TYPES ---
interface Project {
  title: string;
  description: string;
  longDescription?: string;
  techs: string[];
  links: { github?: string; demo?: string };
  images: string[]; // Changed from image?: string to images: string[]
  isFeatured?: boolean;
}

// --- DATA SOURCE ---

const featuredProject: Project = {
  title: 'Frequência Certa',
  description: 'Sistema full-stack completo para controle de frequência e gestão acadêmica.',
  longDescription: 'Desenvolvido como trabalho final e evoluído para uma aplicação robusta com painéis administrativos, controle de presença em tempo real, relatórios automatizados em PDF e integração com Google Gemini para análise de desempenho.',
  techs: ['PHP', 'Laravel', 'MySQL', 'Bootstrap', 'MVC'],
  links: { github: 'https://github.com/naicolas-br' },
  images: [
    '/projects/frequencia certa/Captura de tela 2026-02-10 174439.png',
    '/projects/frequencia certa/Captura de tela 2026-02-10 174444.png',
    '/projects/frequencia certa/Captura de tela 2026-02-10 174450.png',
    '/projects/frequencia certa/Captura de tela 2026-02-10 174455.png',
    '/projects/frequencia certa/Captura de tela 2026-02-10 174459.png',
    '/projects/frequencia certa/Captura de tela 2026-02-10 174509.png'
  ],
  isFeatured: true,
};

const mainProjects: Project[] = [
  {
    title: 'Dashboard Financeiro',
    description: 'Sistema em tempo real para gestão de ativos e passivos.',
    longDescription: 'Aplicação complexa de gestão financeira com gráficos interativos, atualizações via WebSocket e suporte a múltiplas moedas.',
    techs: ['React', 'TypeScript', 'Node.js'],
    links: { github: 'https://github.com/naicolas-br' },
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
    techs: ['Java', 'Android SDK', 'API Rest'],
    links: { github: 'https://github.com/naicolas-br' },
    images: [
      '/projects/tiktok downloader/preview.jpeg',
      '/projects/tiktok downloader/preview2.jpeg'
    ],
  },
  {
    title: 'A Ordem RP',
    description: 'Portal imersivo para servidor de DayZ com foco em performance.',
    longDescription: 'Website promocional com alto impacto visual, integrado com status do servidor em tempo real e sistema de whitelist automatizado.',
    techs: ['HTML5', 'CSS3', 'JS'],
    links: { github: 'https://github.com/naicolas-br', demo: '#' },
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
    title: 'Landing Page Eletricidade',
    description: 'Página de alta conversão para serviços elétricos.',
    longDescription: 'Landing page otimizada para SEO e conversão, com formulários de contato integrados e design responsivo moderno.',
    techs: ['Next.js', 'Tailwind'],
    links: { github: 'https://github.com/naicolas-br' },
    images: [
      '/projects/eletricidade/Captura de tela 2026-02-10 174112.png',
      '/projects/eletricidade/Captura de tela 2026-02-10 174117.png',
      '/projects/eletricidade/Captura de tela 2026-02-10 174125.png',
      '/projects/eletricidade/Captura de tela 2026-02-10 174129.png',
      '/projects/eletricidade/Captura de tela 2026-02-10 174140.png'
    ],
  }
];

// --- STACK DATA ---
const stackItems = [
  {
    name: "PHP",
    color: "bg-[#777BB4]/10 text-[#777BB4] border-[#777BB4]/20",
    icon: <SiPhp size={18} />
  },
  {
    name: "Laravel",
    color: "bg-[#FF2D20]/10 text-[#FF2D20] border-[#FF2D20]/20",
    icon: <SiLaravel size={18} />
  },
  {
    name: "Next.js",
    color: "bg-zinc-100/10 text-zinc-100 border-zinc-100/20",
    icon: <SiNextdotjs size={18} />
  },
  {
    name: "React",
    color: "bg-[#61DAFB]/10 text-[#61DAFB] border-[#61DAFB]/20",
    icon: <SiReact size={18} />
  },
  {
    name: "JavaScript",
    color: "bg-[#F7DF1E]/10 text-[#F7DF1E] border-[#F7DF1E]/20",
    icon: <SiJavascript size={18} />
  },
  {
    name: "Tailwind",
    color: "bg-[#38B2AC]/10 text-[#38B2AC] border-[#38B2AC]/20",
    icon: <SiTailwindcss size={18} />
  },
  {
    name: "TypeScript",
    color: "bg-[#3178C6]/10 text-[#3178C6] border-[#3178C6]/20",
    icon: <SiTypescript size={18} />
  },
];

const otherProjects = [
  { name: 'To-Do List API', tech: 'Node.js' },
  { name: 'Chat em Tempo Real', tech: 'Socket.io' },
  { name: 'Portfólio v1', tech: 'HTML/CSS' },
];

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
  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border bg-opacity-10 backdrop-blur-sm transition-all hover:scale-105 select-none cursor-default ${color}`}>
    {children}
    <span className="font-semibold text-xs tracking-wide">{name}</span>
  </div>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm border border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors cursor-default">
    {children}
  </span>
);

// --- MAIN PAGE ---

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

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
  }, [selectedProject]);

  return (
    <main className="min-h-screen relative font-sans selection:bg-indigo-500/20 selection:text-indigo-200">
      {/* Background Texture & Lighting */}
      <div className="fixed inset-0 bg-[#050505] -z-20" />
      <div className="bg-noise fixed inset-0 z-50 pointer-events-none opacity-[0.03]" />

      {/* Atmospheric Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/10 blur-[150px] rounded-full -z-10" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-900/10 blur-[150px] rounded-full -z-10" />

      <div className="max-w-3xl mx-auto px-6 py-20 md:py-32 relative z-10">

        {/* --- 1. HEADER --- */}
        <header className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
              Nicolas Viana Alves
            </h1>

            <div className="h-1 w-24 bg-indigo-500 mb-8" />

            <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-2xl mb-8">
              <strong className="text-zinc-100 font-medium">Full-Stack Developer</strong> construindo aplicações web reais com <span className="text-indigo-400">PHP</span>, <span className="text-cyan-400">React</span> e <span className="text-blue-400">TypeScript</span>.
            </p>

            {/* --- STACK SECTION --- */}
            <div className="mb-10">
              <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
                Tech Stack Principal
              </h3>

              <div className="flex flex-wrap gap-3">
                {stackItems.map((item) => (
                  <StackBadge key={item.name} name={item.name} color={item.color}>
                    {item.icon}
                  </StackBadge>
                ))}
              </div>
            </div>


            <div className="mb-8">
              <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">Vamos Conversar</h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/naicolas-br"
                  target="_blank"
                  className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:bg-zinc-800 hover:scale-105 transition-all duration-300 group"
                >
                  <Github size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
                  <span className="text-zinc-300 font-medium group-hover:text-white">GitHub</span>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:bg-zinc-800 hover:scale-105 transition-all duration-300 group"
                >
                  <Linkedin size={20} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
                  <span className="text-zinc-300 font-medium group-hover:text-white">LinkedIn</span>
                </a>

                <a
                  href="mailto:nicolas.viana.moc@gmail.com"
                  className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:bg-zinc-800 hover:scale-105 transition-all duration-300 group"
                >
                  <Mail size={20} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                  <span className="text-zinc-300 font-medium group-hover:text-white">Email</span>
                </a>
              </div>
            </div>
          </motion.div>
        </header>


        {/* --- 2. PROJETOS (Main) --- */}
        <section className="mb-32">
          <SectionHeading number="1">Meus Projetos</SectionHeading>

          <div className="space-y-16">

            {/* DESTAQUE: TCC */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative cursor-pointer"
              onClick={() => openProject(featuredProject)}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-8 rounded-xl hover:border-zinc-700 transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-2 block">Destaque Principal (TCC)</span>
                    <h3 className="text-3xl font-bold text-white mb-2">{featuredProject.title}</h3>
                  </div>
                  <div className="text-zinc-500 group-hover:text-white transition-colors">
                    <Github size={24} />
                  </div>
                </div>

                <p className="text-zinc-400 leading-relaxed mb-8 max-w-xl text-lg">
                  {featuredProject.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {featuredProject.techs.map(t => <Badge key={t}>{t}</Badge>)}
                </div>

                <div className="flex gap-4">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">
                    Ver Detalhes do Projeto <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </motion.div>


            {/* OUTROS PROJETOS PRINCIPAIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mainProjects.map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => openProject(project)}
                  className="p-6 border border-zinc-900 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40 rounded-lg transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-zinc-200 group-hover:text-indigo-400 transition-colors">{project.title}</h4>
                    <Github size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
                  </div>

                  <p className="text-zinc-500 text-sm leading-relaxed mb-6 h-12 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.techs.map(t => <Badge key={t}>{t}</Badge>)}
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>


        {/* --- 3. OUTROS EXPERIMENTOS --- */}
        <section className="mb-32">
          <SectionHeading number="2">Outros Estudos</SectionHeading>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {otherProjects.map((p, i) => (
              <motion.div
                key={i}
                className="p-4 border border-zinc-900/50 rounded hover:border-zinc-800 transition-colors"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <h5 className="text-zinc-300 font-medium text-sm mb-1">{p.name}</h5>
                <p className="text-zinc-600 text-xs font-mono">{p.tech}</p>
              </motion.div>
            ))}
          </div>
        </section>


        {/* --- 4. FORMAÇÃO --- */}
        <section className="mb-32">
          <SectionHeading number="3">Formação</SectionHeading>

          <div className="border-l border-zinc-800 ml-2 space-y-12">
            <motion.div
              className="relative pl-8"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-4 ring-[#050505]" />
              <div className="mb-1">
                <span className="text-xl font-bold text-white block">Técnico em Desenvolvimento de Sistemas</span>
                <span className="text-zinc-500 text-sm">Proz Educação • 2024 — 2026</span>
              </div>
            </motion.div>

            <motion.div
              className="relative pl-8"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-zinc-800 rounded-full ring-4 ring-[#050505]" />
              <div className="mb-1">
                <span className="text-lg font-medium text-zinc-400 block">Ensino Médio Completo</span>
                <span className="text-zinc-600 text-sm">Escola Estadual Professora Dilma Quadros • 2023 — 2025</span>
              </div>
            </motion.div>
          </div>
        </section>


        {/* --- FOOTER --- */}
        <footer className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-sm">
          <p>© 2026 Nicolas Viana Alves</p>
          <p className="font-mono text-xs">Built with Next.js, Tailwind & Motion</p>
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
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
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
                <p className="text-zinc-500 font-mono text-sm mb-6 flex flex-wrap gap-2">
                  {selectedProject.techs.map(t => <span key={t} className="text-indigo-400">#{t}</span>)}
                </p>

                <div className="prose prose-invert prose-zinc max-w-none mb-8">
                  <p className="text-lg leading-relaxed text-zinc-300">
                    {selectedProject.longDescription || selectedProject.description}
                  </p>
                </div>

                <div className="flex gap-4 pt-6 border-t border-zinc-800">
                  {selectedProject.links.github && (
                    <a
                      href={selectedProject.links.github}
                      target="_blank"
                      className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-white transition-colors font-medium text-sm"
                    >
                      <Github size={18} /> Ver Código
                    </a>
                  )}
                  {selectedProject.links.demo && (
                    <a
                      href={selectedProject.links.demo}
                      target="_blank"
                      className="flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors font-medium text-sm"
                    >
                      <ExternalLink size={18} /> Live Demo
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