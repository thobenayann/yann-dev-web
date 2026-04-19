/**
 * Root-level 404 fallback — server component, no locale context.
 * Shown only when a URL slips past the middleware entirely.
 * With next-intl middleware active this should never be reached in practice.
 */
import Link from 'next/link';

export default function RootNotFound() {
    return (
        <main className='flex flex-col items-center justify-center min-h-screen px-6 text-center gap-6'>
            {/* Gradient number */}
            <span
                className='text-[clamp(6rem,20vw,14rem)] font-black leading-none tracking-tighter select-none'
                style={{
                    background:
                        'linear-gradient(135deg, oklch(0.541 0.281 293) 0%, oklch(0.75 0.18 210) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 40px oklch(0.541 0.281 293 / 0.4))',
                }}
            >
                404
            </span>

            <div className='space-y-2 max-w-md'>
                <h1 className='text-2xl font-bold tracking-tight'>
                    Page introuvable / Page not found
                </h1>
                <p className='text-muted-foreground text-base'>
                    Cette page n&apos;existe pas. / This page does not exist.
                </p>
            </div>

            <Link
                href='/fr'
                className='inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/15 transition-all duration-200'
            >
                Retour / Home
            </Link>
        </main>
    );
}
