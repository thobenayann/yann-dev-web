'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';

// ─── Types ────────────────────────────────────────────────────────────────────

type Segment = {
    id: string;
    from: Date;
    labelFr: string;
    labelEn: string;
    color: 'purple' | 'cyan' | 'cyan-bright';
};

// ─── Segments data ────────────────────────────────────────────────────────────

const SEGMENTS: Segment[] = [
    {
        id: 'cda',
        from: new Date(2021, 9, 1), // Oct 2021
        labelFr: 'Développeur Fullstack',
        labelEn: 'Fullstack Developer',
        color: 'purple',
    },
    {
        id: 'ai',
        from: new Date(2022, 11, 1), // Dec 2022
        labelFr: 'Intégration & veille IA',
        labelEn: 'AI Integration & Research',
        color: 'cyan',
    },
    {
        id: 'ai-lead',
        from: new Date(2025, 6, 1), // Jul 2025
        labelFr: 'Pôle expertise IA Ipanova',
        labelEn: 'Ipanova AI Expertise Lead',
        color: 'cyan-bright',
    },
];

const STYLE = {
    purple: {
        bar: 'from-purple-700 via-purple-500 to-purple-400',
        glow: 'oklch(0.541 0.281 293 / 0.55)',
        text: 'text-purple-300',
        dot: 'bg-purple-400',
        dotGlow: 'shadow-[0_0_10px_3px_oklch(0.541_0.281_293/0.8)]',
    },
    cyan: {
        bar: 'from-cyan-700 via-cyan-500 to-cyan-400',
        glow: 'oklch(0.65 0.2 210 / 0.5)',
        text: 'text-cyan-400',
        dot: 'bg-cyan-400',
        dotGlow: 'shadow-[0_0_10px_3px_oklch(0.75_0.18_210/0.8)]',
    },
    'cyan-bright': {
        bar: 'from-cyan-400 via-sky-300 to-white',
        glow: 'oklch(0.85 0.15 200 / 0.65)',
        text: 'text-sky-200',
        dot: 'bg-white',
        dotGlow: 'shadow-[0_0_14px_4px_rgba(255,255,255,0.6)]',
    },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function monthsBetween(a: Date, b: Date) {
    return (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth();
}

function fmtDate(d: Date, locale: string) {
    return d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'short',
        year: 'numeric',
    });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HorizontalExpTimeline() {
    const locale = useLocale();
    const now = new Date();
    const origin = SEGMENTS[0].from;
    const total = monthsBetween(origin, now);

    return (
        <motion.div
            className='mt-12 space-y-6'
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
            <p className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50'>
                {locale === 'fr' ? 'Expertise cumulée' : 'Expertise timeline'}
            </p>

            <div className='space-y-6'>
                {SEGMENTS.map((seg, i) => {
                    const offsetM = monthsBetween(origin, seg.from);
                    const durationM = monthsBetween(seg.from, now);
                    const offsetPct = (offsetM / total) * 100;
                    const widthPct = (durationM / total) * 100;
                    const s = STYLE[seg.color];

                    return (
                        <div key={seg.id} className='space-y-2'>
                            {/* Label row */}
                            <div className='flex items-center justify-between'>
                                <span className={`text-sm font-semibold ${s.text}`}>
                                    {locale === 'fr' ? seg.labelFr : seg.labelEn}
                                </span>
                                <span className='text-xs text-muted-foreground/60 tabular-nums'>
                                    {fmtDate(seg.from, locale)}{' '}
                                    <span className='opacity-50'>›</span>{' '}
                                    {locale === 'fr' ? 'présent' : 'present'}
                                </span>
                            </div>

                            {/* Bar track */}
                            <div className='relative h-3 w-full rounded-full bg-white/5'>
                                <motion.div
                                    className={`absolute top-0 h-full rounded-full bg-gradient-to-r ${s.bar}`}
                                    style={{
                                        left: `${offsetPct}%`,
                                        boxShadow: `0 0 14px 3px ${s.glow}`,
                                    }}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${widthPct}%` }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 1.4,
                                        delay: i * 0.25,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                    }}
                                />

                                {/* Pulsing dot — active */}
                                <motion.div
                                    className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 -translate-x-1/2 rounded-full ${s.dot} ${s.dotGlow}`}
                                    style={{ left: `${offsetPct + widthPct}%` }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.25 + 1.3, type: 'spring', stiffness: 300 }}
                                >
                                    <span className='absolute inset-0 rounded-full bg-current opacity-30 animate-ping' />
                                </motion.div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Year scale */}
            <div className='relative h-4 mt-1'>
                {[2022, 2023, 2024, 2025, 2026].map((year) => {
                    const pct = (monthsBetween(origin, new Date(year, 0, 1)) / total) * 100;
                    if (pct < 0 || pct > 100) return null;
                    return (
                        <span
                            key={year}
                            className='absolute -translate-x-1/2 text-[10px] text-muted-foreground/30'
                            style={{ left: `${pct}%` }}
                        >
                            {year}
                        </span>
                    );
                })}
            </div>
        </motion.div>
    );
}
