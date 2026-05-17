import { JsonLd } from '@/components/seo/json-ld';
import { CareerTimeline } from '@/components/ui/career-timeline';
import { person } from '@/config/content';
import { SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';
import { breadcrumbSchema, profilePageSchema } from '@/lib/seo/schemas';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Github, Linkedin, Code2, Bot, Users } from 'lucide-react';
import { TypingText, TypingTextCursor } from '@/components/ui/typing-text';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'About' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

// ─── Données statiques compétences ───────────────────────────────────────────

const SKILLS = {
    dev: [
        'React',
        'Next.js',
        'Node.js',
        'NestJS',
        'TypeScript',
        'PostgreSQL',
        'MySQL',
        'Docker',
        'CI/CD',
        'Tailwind CSS',
        'GraphQL',
        'Symfony',
        'PHP',
    ],
    ai: [
        'Prompt Engineering',
        'Claude / Gemini',
        'OpenAI API',
        'RAG / Embeddings',
        'Make',
        'n8n',
        'Cursor',
        'Claude Code',
        'GEMs Workspace',
        'Data Viz Apps',
    ],
    softSkills: [
        'Analyse métier',
        'Gestion projet',
        'Formation équipes',
        'Estimation / Chiffrage',
        'UX / Figma',
        'SEO / Webmarketing',
        'Support multi-niveaux',
        'Avant-vente',
    ],
} as const;

// ─── PillTag ──────────────────────────────────────────────────────────────────

function PillTag({
    label,
    color,
}: {
    label: string;
    color: 'purple' | 'cyan' | 'neutral';
}) {
    const colorClass = {
        purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        cyan: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
        neutral: 'bg-white/5 text-muted-foreground border-white/10',
    }[color];

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
        >
            {label}
        </span>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'About' });

    return (
        <main className='container mx-auto px-6 md:px-10 pt-24 pb-16 space-y-24'>
            <JsonLd
                data={[
                    profilePageSchema(locale),
                    breadcrumbSchema([
                        { name: 'Home', url: `${SITE_URL}/${locale}` },
                        {
                            name: t('title'),
                            url: `${SITE_URL}/${locale}/about`,
                        },
                    ]),
                ]}
            />

            {/* ── 1. HERO BIO ────────────────────────────────────────── */}
            <section className='flex flex-col sm:flex-row items-start gap-8'>
                <Image
                    src={person.avatar}
                    alt={person.name}
                    width={80}
                    height={80}
                    className='rounded-full border-2 border-white/10 flex-shrink-0'
                />
                <div className='space-y-3'>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        {person.firstName}{' '}
                        <span className='text-muted-foreground'>
                            {person.lastName}
                        </span>
                    </h1>

                    {/* Badges de rôle */}
                    <div className='flex flex-wrap gap-2'>
                        <span className='inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-300'>
                            <Code2 className='h-3.5 w-3.5' /> {t('hero.roles.cda')}
                        </span>
                        <span className='inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300'>
                            <Bot className='h-3.5 w-3.5' /> {t('hero.roles.ai')}
                            <span className='flex items-center gap-1 ml-1'>
                                <span className='h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse' />
                                <span className='text-xs text-green-400'>
                                    {t('hero.roles.aiStatus')}
                                </span>
                            </span>
                        </span>
                    </div>

                    <p className='text-sm text-muted-foreground'>
                        {t('hero.location')}
                    </p>

                    <p className='text-base text-foreground/80 max-w-xl leading-relaxed'>
                        {t('hero.bio')}
                    </p>

                    {/* Liens sociaux */}
                    <div className='flex items-center gap-4 pt-1'>
                        <Link
                            href='https://www.linkedin.com/in/yann-thobena/'
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label='LinkedIn'
                            className='text-muted-foreground hover:text-foreground transition-colors'
                        >
                            <Linkedin className='h-5 w-5' />
                        </Link>
                        <Link
                            href='https://github.com/thobenayann'
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label='GitHub'
                            className='text-muted-foreground hover:text-foreground transition-colors'
                        >
                            <Github className='h-5 w-5' />
                        </Link>
                        <Link
                            href='mailto:thobena.yann@gmail.com'
                            aria-label='Email'
                            className='text-muted-foreground hover:text-foreground transition-colors'
                        >
                            <Mail className='h-5 w-5' />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── 2. CAREER TIMELINE ───────────────────────────────── */}
            <section>
                <h2 className='text-2xl md:text-3xl font-bold mb-10'>
                    <TypingText text={t('timeline.title')} duration={55}>
                        <TypingTextCursor />
                    </TypingText>
                </h2>
                <CareerTimeline />
            </section>

            {/* ── 3. COMPÉTENCES ───────────────────────────────────── */}
            <section>
                <h2 className='text-2xl md:text-3xl font-bold mb-8'>
                    <TypingText text={t('skills.title')} duration={55} delay={100}>
                        <TypingTextCursor />
                    </TypingText>
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {/* Dev Stack */}
                    <SpotlightCard spotlightColor='rgba(168,85,247,0.15)' className='group relative rounded-2xl border border-purple-500/20 bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent p-6 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-8px_oklch(0.541_0.281_293/0.3)]'>
                        <div className='absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                        <div className='relative flex items-center gap-3 mb-6'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/30 group-hover:bg-purple-500/25 group-hover:shadow-[0_0_20px_oklch(0.541_0.281_293/0.4)] transition-all duration-300'>
                                <Code2 className='h-6 w-6 text-purple-400' />
                            </div>
                            <h3 className='text-base font-semibold text-purple-300'>
                                {t('skills.dev')}
                            </h3>
                        </div>
                        <div className='relative flex flex-wrap gap-2'>
                            {SKILLS.dev.map((s) => (
                                <PillTag key={s} label={s} color='purple' />
                            ))}
                        </div>
                    </SpotlightCard>

                    {/* IA & Outils */}
                    <SpotlightCard spotlightColor='rgba(34,211,238,0.12)' className='group relative rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-cyan-400/10 via-cyan-400/5 to-transparent p-6 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-8px_oklch(0.75_0.18_210/0.3)]'>
                        <div className='absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                        <div className='relative flex items-center gap-3 mb-6'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/15 border border-cyan-400/30 group-hover:bg-cyan-400/25 group-hover:shadow-[0_0_20px_oklch(0.75_0.18_210/0.4)] transition-all duration-300'>
                                <Bot className='h-6 w-6 text-cyan-400' />
                            </div>
                            <h3 className='text-base font-semibold text-cyan-300'>
                                {t('skills.ai')}
                            </h3>
                        </div>
                        <div className='relative flex flex-wrap gap-2'>
                            {SKILLS.ai.map((s) => (
                                <PillTag key={s} label={s} color='cyan' />
                            ))}
                        </div>
                    </SpotlightCard>

                    {/* Savoir-faire */}
                    <SpotlightCard spotlightColor='rgba(255,255,255,0.07)' className='group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/8 via-white/4 to-transparent p-6 backdrop-blur-sm hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-8px_rgba(255,255,255,0.08)]'>
                        <div className='absolute inset-0 rounded-2xl bg-gradient-to-b from-white/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                        <div className='relative flex items-center gap-3 mb-6'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/8 border border-white/15 group-hover:bg-white/15 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300'>
                                <Users className='h-6 w-6 text-muted-foreground group-hover:text-foreground/80 transition-colors' />
                            </div>
                            <h3 className='text-base font-semibold text-foreground/70 group-hover:text-foreground/90 transition-colors'>
                                {t('skills.softSkills')}
                            </h3>
                        </div>
                        <div className='relative flex flex-wrap gap-2'>
                            {SKILLS.softSkills.map((s) => (
                                <PillTag key={s} label={s} color='neutral' />
                            ))}
                        </div>
                    </SpotlightCard>
                </div>
            </section>

            {/* ── 4. CTA CONTACT ───────────────────────────────────── */}
            <section className='text-center space-y-4 py-8'>
                <h2 className='text-2xl font-bold'>{t('cta.title')}</h2>
                <p className='text-muted-foreground'>{t('cta.subtitle')}</p>
                <div className='flex justify-center gap-3 pt-2'>
                    <Link
                        href='https://www.linkedin.com/in/yann-thobena/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors'
                    >
                        <Linkedin className='h-4 w-4' />
                        {t('cta.linkedin')}
                    </Link>
                    <Link
                        href='mailto:thobena.yann@gmail.com'
                        className='inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium hover:bg-white/5 transition-colors'
                    >
                        <Mail className='h-4 w-4' />
                        {t('cta.email')}
                    </Link>
                </div>
            </section>

        </main>
    );
}
