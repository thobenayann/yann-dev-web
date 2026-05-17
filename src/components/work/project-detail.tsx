import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel } from '@/components/ui/carousel';
import { Project } from '@/types/mdx';
import { evaluate } from '@mdx-js/mdx';
import * as jsxDevRuntime from 'react/jsx-dev-runtime';
import * as jsxRuntime from 'react/jsx-runtime';
import { ArrowLeft, ExternalLink, Lock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

type Props = { project: Project; locale: string };

const isDev = process.env.NODE_ENV === 'development';

export async function ProjectDetail({ project, locale }: Props) {
    const { metadata } = project;
    const t = await getTranslations({ locale, namespace: 'Work' });

    const runtime = isDev
        ? { ...jsxRuntime, ...jsxDevRuntime }
        : jsxRuntime;

    type MDXComponent = React.ComponentType<{ components?: Record<string, unknown> }>;
    let MDXContent: MDXComponent | null = null;
    if (project.content.trim().length > 0) {
        const evaluated = await evaluate(project.content, {
            ...(runtime as unknown as Parameters<typeof evaluate>[1]),
            development: isDev,
        });
        MDXContent = evaluated.default as unknown as MDXComponent;
    }

    return (
        <article className='container mx-auto px-6 md:px-10 py-16 max-w-4xl space-y-10'>
            <Link
                href={`/${locale}/work`}
                className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
                <ArrowLeft className='h-4 w-4' />
                {t('backToProjects')}
            </Link>

            <header className='space-y-4'>
                <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
                    {metadata.title}
                </h1>
                {metadata.publishedAt && (
                    <time
                        dateTime={metadata.publishedAt}
                        className='text-sm text-muted-foreground'
                    >
                        {new Date(metadata.publishedAt).toLocaleDateString(
                            locale === 'fr' ? 'fr-FR' : 'en-US',
                            { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                    </time>
                )}
                <p className='text-lg text-muted-foreground leading-relaxed'>
                    {metadata.summary}
                </p>
            </header>

            {metadata.images.length > 0 && (
                <Carousel
                    images={metadata.images.map((image) => ({
                        src: image,
                        alt: metadata.title,
                    }))}
                    priority
                />
            )}

            {metadata.team.length > 0 && (
                <section className='space-y-4'>
                    <h2 className='text-xl font-semibold'>
                        {t('projectDetails.overview')}
                    </h2>
                    <div className='flex flex-wrap gap-3'>
                        {metadata.team.map((member, i) => (
                            <div
                                key={i}
                                className='flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5'
                            >
                                <Avatar className='h-6 w-6'>
                                    <AvatarImage
                                        src={member.avatar}
                                        alt={member.name}
                                    />
                                    <AvatarFallback>
                                        {member.name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <span className='text-xs'>
                                    <span className='font-semibold'>
                                        {member.name}
                                    </span>
                                    <span className='text-muted-foreground'>
                                        {' '}
                                        · {member.role}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {metadata.links && metadata.links.length > 0 && (
                <div className='flex flex-wrap gap-3'>
                    {metadata.links.map((link, i) => {
                        const isPrivate =
                            link.icon === 'lock' || link.url === '#';
                        const Icon = isPrivate ? Lock : ExternalLink;
                        return (
                            <Link
                                key={i}
                                href={isPrivate ? '#' : link.url}
                                target={isPrivate ? undefined : '_blank'}
                                rel={
                                    isPrivate
                                        ? undefined
                                        : 'noopener noreferrer'
                                }
                                className={
                                    'inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium transition-colors ' +
                                    (isPrivate
                                        ? 'text-muted-foreground cursor-not-allowed opacity-60'
                                        : 'hover:bg-white/5')
                                }
                            >
                                <Icon className='h-4 w-4' />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            )}

            {MDXContent && (
                <div className='prose prose-invert max-w-none prose-headings:tracking-tight prose-p:text-muted-foreground prose-a:text-primary'>
                    <MDXContent />
                </div>
            )}
        </article>
    );
}
