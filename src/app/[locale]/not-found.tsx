'use client';

import { Sparkles } from '@/components/ui/sparkles';
import { motion } from 'framer-motion';
import { Home, MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
    // Derive locale from the URL path — does not depend on NextIntlClientProvider
    const pathname = usePathname();
    const locale = pathname?.startsWith('/en') ? 'en' : 'fr';
    const isFr = locale === 'fr';

    return (
        <main className='relative flex flex-col items-center justify-center min-h-[80vh] px-6 text-center overflow-hidden'>
            {/* Ambient glow blobs */}
            <div
                aria-hidden
                className='pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-purple-600/10 blur-[100px]'
            />
            <div
                aria-hidden
                className='pointer-events-none absolute bottom-0 left-1/4 h-[300px] w-[400px] rounded-full bg-cyan-400/8 blur-[80px]'
            />

            {/* 404 number */}
            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className='relative select-none'
            >
                <span
                    className='text-[clamp(8rem,25vw,16rem)] font-black leading-none tracking-tighter'
                    style={{
                        background:
                            'linear-gradient(135deg, oklch(0.541 0.281 293) 0%, oklch(0.65 0.22 255) 40%, oklch(0.75 0.18 210) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 40px oklch(0.541 0.281 293 / 0.4))',
                    }}
                >
                    404
                </span>
                {/* Sparkles over the number */}
                <Sparkles count={10} className='absolute inset-0 pointer-events-none' />
            </motion.div>

            {/* Text */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className='space-y-3 max-w-md'
            >
                <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>
                    {isFr ? 'Page introuvable' : 'Page not found'}
                </h1>
                <p className='text-base text-muted-foreground leading-relaxed'>
                    {isFr
                        ? "Cette page n'existe pas ou a été déplacée. Revenez sur vos pas."
                        : "This page doesn't exist or has been moved. Let's get you back on track."}
                </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className='flex flex-wrap items-center justify-center gap-3 mt-8'
            >
                <Link
                    href={`/${locale}`}
                    className='inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/15 hover:border-white/25 transition-all duration-200'
                >
                    <Home className='h-4 w-4' />
                    {isFr ? 'Accueil' : 'Home'}
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className='inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer'
                >
                    <MoveLeft className='h-4 w-4' />
                    {isFr ? 'Retour' : 'Go back'}
                </button>
            </motion.div>
        </main>
    );
}
