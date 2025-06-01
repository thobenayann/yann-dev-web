'use client';

import { cn } from '@/lib/utils';
import { Project } from '@/types/mdx';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Carousel } from './carousel';

type ProjectCardProps = {
    project: Project;
    priority?: boolean;
    locale: string;
};

export function ProjectCard({
    project,
    priority = false,
    locale,
}: ProjectCardProps) {
    const { metadata, slug } = project;
    const href = `/${locale}/work/${slug}`;
    const tHome = useTranslations('Home');
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={cn(
                'group flex flex-col gap-6 w-full max-w-5xl mx-auto relative z-10'
            )}
            style={{ isolation: 'isolate' }}
        >
            <Carousel
                images={metadata.images.map((image) => ({
                    src: image,
                    alt: metadata.title,
                }))}
                priority={priority}
            />

            <div className='flex flex-col lg:flex-row gap-6 px-2 py-6'>
                <div className='flex-[5] space-y-2'>
                    <h2 className='text-2xl font-bold'>{metadata.title}</h2>
                    {metadata.publishedAt && (
                        <time
                            dateTime={metadata.publishedAt}
                            className='text-sm text-muted-foreground'
                        >
                            {new Date(metadata.publishedAt).toLocaleDateString(
                                locale,
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }
                            )}
                        </time>
                    )}
                </div>

                <div className='flex-[7] space-y-4'>
                    {metadata.team && metadata.team.length > 0 && (
                        <div className='flex -space-x-2 rtl:space-x-reverse'>
                            {metadata.team.map((member, index) => (
                                <Avatar
                                    key={index}
                                    className='border-2 border-background'
                                >
                                    <AvatarImage
                                        src={member.avatar}
                                        alt={member.name || ''}
                                    />
                                    <AvatarFallback>
                                        {member.name?.charAt(0) || 'T'}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                    )}

                    {metadata.summary && (
                        <p className='text-sm text-muted-foreground'>
                            {metadata.summary}
                        </p>
                    )}

                    <div className='flex gap-6 flex-wrap'>
                        {project.content && (
                            <Link
                                href={href}
                                className='text-sm inline-flex items-center gap-2 hover:text-primary transition-colors'
                            >
                                {tHome('projects-link-label')}
                                <svg
                                    className='w-4 h-4'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M17 8l4 4m0 0l-4 4m4-4H3'
                                    />
                                </svg>
                            </Link>
                        )}
                        {metadata.link && (
                            <Link
                                href={metadata.link}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-sm inline-flex items-center gap-2 hover:text-primary transition-colors'
                            >
                                Voir le projet
                                <svg
                                    className='w-4 h-4'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                                    />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
