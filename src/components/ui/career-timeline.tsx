'use client';

import {
    EXPERIENCE_TRACKS,
    MILESTONES,
    type ExperienceTrack,
    type TimelineMilestone,
    type TimelinePhase,
} from '@/config/timeline';
import { useExperienceCounter } from '@/hooks/use-experience-counter';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';

// ─── Couleurs par phase ───────────────────────────────────────────────────────

const NODE_STYLES: Record<TimelinePhase, string> = {
    formation:
        'bg-teal-400 shadow-[0_0_12px_2px_oklch(0.70_0.15_185/0.7)] border-teal-300',
    'cda-transition':
        'bg-gradient-to-b from-teal-400 to-purple-500 shadow-[0_0_14px_3px_oklch(0.60_0.22_240/0.6)] border-purple-400',
    cda: 'bg-purple-500 shadow-[0_0_14px_3px_oklch(0.541_0.281_293/0.7)] border-purple-400',
    'ai-curious':
        'bg-gradient-to-b from-purple-500 to-cyan-400 shadow-[0_0_16px_4px_oklch(0.65_0.20_255/0.6)] border-cyan-400',
    'ai-expert':
        'bg-cyan-400 shadow-[0_0_20px_6px_oklch(0.75_0.18_210/0.8)] border-cyan-300',
};

const DATE_COLOR: Record<TimelinePhase, string> = {
    formation: 'text-teal-400',
    'cda-transition': 'text-purple-400',
    cda: 'text-purple-400',
    'ai-curious': 'text-cyan-400',
    'ai-expert': 'text-cyan-300',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date, locale: string): string {
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'long',
        year: 'numeric',
    });
}

// ─── TimelineNode ─────────────────────────────────────────────────────────────

function TimelineNode({
    phase,
    size,
    index,
}: {
    phase: TimelinePhase;
    size: 'normal' | 'large';
    index: number;
}) {
    const isLarge = size === 'large';
    return (
        <motion.div
            className={cn(
                'relative z-10 flex-shrink-0 rounded-full border-2',
                NODE_STYLES[phase],
                isLarge ? 'h-6 w-6' : 'h-4 w-4'
            )}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
                delay: index * 0.08,
                duration: 0.4,
                type: 'spring',
                stiffness: 300,
            }}
        >
            {isLarge && (
                <span className='absolute inset-0 rounded-full bg-cyan-400 opacity-40 animate-ping' />
            )}
        </motion.div>
    );
}

// ─── MilestoneCard ────────────────────────────────────────────────────────────

function MilestoneCard({
    milestone,
    index,
    locale,
}: {
    milestone: TimelineMilestone;
    index: number;
    locale: string;
}) {
    const label = locale === 'fr' ? milestone.labelFr : milestone.labelEn;
    const description =
        locale === 'fr' ? milestone.descriptionFr : milestone.descriptionEn;

    return (
        <motion.div
            className={cn(
                'flex-1 rounded-xl border p-4',
                'bg-white/5 backdrop-blur-sm',
                'border-white/10',
                'hover:bg-white/10 transition-colors duration-200',
                milestone.size === 'large' && 'border-cyan-400/30 bg-cyan-950/20'
            )}
            initial={{ x: 24, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
                delay: index * 0.08 + 0.1,
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
        >
            <p
                className={cn(
                    'text-xs font-semibold uppercase tracking-wider mb-1',
                    DATE_COLOR[milestone.phase]
                )}
            >
                {formatDate(milestone.date, locale)}
            </p>
            <h3 className='text-sm font-semibold text-foreground mb-1 leading-snug'>
                {milestone.size === 'large' && <span className='mr-1'>🚀</span>}
                {label}
            </h3>
            <p className='text-xs text-muted-foreground leading-relaxed'>
                {description}
            </p>
        </motion.div>
    );
}

// ─── ExperienceBadge ──────────────────────────────────────────────────────────

function ExperienceBadge({
    track,
    locale,
}: {
    track: ExperienceTrack;
    locale: string;
}) {
    const { years, months } = useExperienceCounter(track.startDate);
    const label = locale === 'fr' ? track.labelFr : track.labelEn;
    const yearsLabel = locale === 'fr' ? 'an' : 'yr';
    const yearsLabelPlural = locale === 'fr' ? 'ans' : 'yrs';
    const monthsLabel = locale === 'fr' ? 'mois' : 'mo';

    const durationStr =
        years > 0
            ? `${years} ${years > 1 ? yearsLabelPlural : yearsLabel}${months > 0 ? ` ${months} ${monthsLabel}` : ''}`
            : `${months} ${monthsLabel}`;

    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-xl border px-4 py-3',
                'bg-white/5 backdrop-blur-sm',
                track.color === 'purple'
                    ? 'border-purple-500/30'
                    : 'border-cyan-400/30'
            )}
        >
            <span className='text-lg'>{track.emoji}</span>
            <div>
                <p
                    className={cn(
                        'text-lg font-bold tabular-nums',
                        track.color === 'purple'
                            ? 'text-purple-400'
                            : 'text-cyan-400'
                    )}
                >
                    {durationStr}
                </p>
                <p className='text-xs text-muted-foreground'>{label}</p>
            </div>
        </div>
    );
}

// ─── CareerTimeline (export principal) ───────────────────────────────────────

export function CareerTimeline() {
    const locale = useLocale();

    return (
        <div className='relative w-full max-w-2xl mx-auto'>
            {/* Ligne de fond */}
            <div className='absolute left-[7px] top-0 bottom-0 w-px bg-white/10' />

            {/* Ligne colorée animée */}
            <motion.div
                className='absolute left-[7px] top-0 w-px origin-top'
                style={{
                    background:
                        'linear-gradient(to bottom, oklch(0.70 0.15 185), oklch(0.541 0.281 293) 45%, oklch(0.65 0.22 255) 70%, oklch(0.75 0.18 210))',
                    filter: 'blur(0.5px)',
                }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />

            {/* Jalons */}
            <div className='space-y-8 relative'>
                {MILESTONES.map((milestone, index) => (
                    <div key={milestone.id} className='flex items-start gap-4'>
                        <TimelineNode
                            phase={milestone.phase}
                            size={milestone.size}
                            index={index}
                        />
                        <MilestoneCard
                            milestone={milestone}
                            index={index}
                            locale={locale}
                        />
                    </div>
                ))}
            </div>

            {/* Badges live */}
            <motion.div
                className='mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3'
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                {EXPERIENCE_TRACKS.map((track) => (
                    <ExperienceBadge key={track.id} track={track} locale={locale} />
                ))}
            </motion.div>
        </div>
    );
}
