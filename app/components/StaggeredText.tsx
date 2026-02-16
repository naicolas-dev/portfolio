'use client';

import { motion } from 'framer-motion';

export default function StaggeredText({ text, className = "" }: { text: string, className?: string }) {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.h1
            className={`flex flex-wrap justify-center overflow-hidden ${className}`}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {words.map((word, index) => (
                <motion.span variants={child} key={index} className="mr-[0.25em] last:mr-0 inline-block">
                    {word === "V." ? (
                        <span className="text-[#3B82F6]">{word}</span>
                    ) : (
                        word
                    )}
                </motion.span>
            ))}
        </motion.h1>
    );
}
