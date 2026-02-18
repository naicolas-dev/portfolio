'use client';

import { useLanguage } from '../context/LanguageContext';
import { BOOKS } from '@/app/settings/books';
import { BookOpen, Bookmark, CheckCircle } from 'lucide-react';

export default function BooksSection() {
    const { language } = useLanguage();

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Currently Reading */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[#A1A6B3] px-1">
                    <BookOpen size={14} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">
                        {language === 'pt' ? 'Lendo Atualmente' : 'Currently Reading'}
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {BOOKS.reading.map((book, i) => (
                        <div key={i} className="group relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg bg-[#2a2d31]">
                            <img
                                src={book.image_url}
                                alt={book.title[language as 'pt' | 'en']}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                <span className="text-xs font-bold text-white leading-tight mb-1">{book.title[language as 'pt' | 'en']}</span>
                                <span className="text-[10px] text-zinc-400 leading-tight">{book.author[language as 'pt' | 'en']}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-[#2a2d31]" />

            {/* Plan to Read - Empty State */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[#A1A6B3] px-1">
                    <Bookmark size={14} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">
                        {language === 'pt' ? 'Pretendo Ler' : 'Plan to Read'}
                    </h3>
                </div>

                <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-[#2a2d31] bg-[#1a1d21]/30 text-center gap-2">
                    <div className="p-3 rounded-full bg-[#2a2d31]/50 text-zinc-500">
                        <Bookmark size={20} />
                    </div>
                    <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed">
                        {language === 'pt'
                            ? 'Minha lista de leitura está vazia por enquanto. Aceito sugestões!'
                            : 'My reading list is empty for now. Comparison suggestions are welcome!'}
                    </p>
                </div>
            </div>

            <div className="w-full h-px bg-[#2a2d31]" />

            {/* Read */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[#A1A6B3] px-1">
                    <CheckCircle size={14} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">
                        {language === 'pt' ? 'Lidos' : 'Read'}
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {BOOKS.read.map((book, i) => (
                        <div key={i} className="group relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg bg-[#2a2d31]">
                            <img
                                src={book.image_url}
                                alt={book.title[language as 'pt' | 'en']}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                <span className="text-xs font-bold text-white leading-tight mb-1">{book.title[language as 'pt' | 'en']}</span>
                                <span className="text-[10px] text-zinc-400 leading-tight">{book.author[language as 'pt' | 'en']}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
