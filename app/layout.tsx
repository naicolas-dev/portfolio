import { Sora, JetBrains_Mono } from 'next/font/google'
import "./globals.css";

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['400', '600', '800'] })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${mono.variable}`}>
      <body className="bg-[#050505] text-zinc-200 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}