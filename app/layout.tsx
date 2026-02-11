import { Sora, JetBrains_Mono } from 'next/font/google'
import "./globals.css";

export const metadata = {
  title: 'Nicolas Viana Alves',
  description: 'Portfolio of Nicolas Viana Alves',
};

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['400', '600', '800'] })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${mono.variable}`}>
      <body className="bg-[#191919] text-zinc-200 antialiased selection:bg-[#E2C17D]/30 selection:text-amber-100">
        {children}
      </body>
    </html>
  );
}