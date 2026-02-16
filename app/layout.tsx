import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"

import "./globals.css";

export const metadata = {
  title: 'Nicolas Viana Alves',
  description: 'Portfolio of Nicolas Viana Alves',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '600', '800'] })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-[#0e1011] text-[#A1A6B3] antialiased selection:bg-[#A1A6B3]/20 selection:text-[#dedede]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}