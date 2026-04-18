import { JsonLd } from '@/components/seo/json-ld';
import { CareerTimeline } from '@/components/ui/career-timeline';
import { person } from '@/config/content';
import { SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';
import { breadcrumbSchema, profilePageSchema } from '@/lib/seo/schemas';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Github, Linkedin } from 'lucide-react';
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
        <main className='container mx-auto px-6 md:px-10 py-16 space-y-24'>
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
                            💜 {t('hero.roles.cda')}
                        </span>
                        <span className='inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300'>
                            🤖 {t('hero.roles.ai')}
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
                <h2 className='text-xl font-semibold tracking-tight mb-10'>
                    {t('timeline.title')}
                </h2>
                <CareerTimeline />
            </section>

            {/* ── 3. COMPÉTENCES ───────────────────────────────────── */}
            <section>
                <h2 className='text-xl font-semibold tracking-tight mb-8'>
                    {t('skills.title')}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {/* Dev Stack */}
                    <div className='rounded-xl border border-purple-500/20 bg-white/5 p-5 backdrop-blur-sm'>
                        <h3 className='text-sm font-semibold text-purple-400 mb-4'>
                            💜 {t('skills.dev')}
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                            {SKILLS.dev.map((s) => (
                                <PillTag key={s} label={s} color='purple' />
                            ))}
                        </div>
                    </div>

                    {/* IA & Outils */}
                    <div className='rounded-xl border border-cyan-400/20 bg-white/5 p-5 backdrop-blur-sm'>
                        <h3 className='text-sm font-semibold text-cyan-400 mb-4'>
                            🤖 {t('skills.ai')}
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                            {SKILLS.ai.map((s) => (
                                <PillTag key={s} label={s} color='cyan' />
                            ))}
                        </div>
                    </div>

                    {/* Savoir-faire */}
                    <div className='rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm'>
                        <h3 className='text-sm font-semibold text-muted-foreground mb-4'>
                            🤝 {t('skills.softSkills')}
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                            {SKILLS.softSkills.map((s) => (
                                <PillTag key={s} label={s} color='neutral' />
                            ))}
                        </div>
                    </div>
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
