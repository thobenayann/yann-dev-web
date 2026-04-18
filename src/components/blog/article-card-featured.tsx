'use client';

import { Post, getTagConfig } from '@/lib/blog';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = { post: Post; locale: string; readLabel: string };

export function ArticleCardFeatured({ post, locale, readLabel }: Props) {
    const { metadata, slug, readingTime } = post;
    const tag = getTagConfig(metadata.tag);

    const date = new Date(metadata.publishedAt).toLocaleDateString(
        locale === 'fr' ? 'fr-FR' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            <Link
                href={`/${locale}/blog/${slug}`}
                className='block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors'
            >
                {/* Cover image ou gradient */}
                <div className='relative w-full aspect-[16/9] overflow-hidden'>
                    {metadata.image ? (
                        <Image
                            src={metadata.image}
                            alt={metadata.title}
                            fill
                            className='object-cover'
                            priority
                        />
                    ) : (
                        <div
                            className={`w-full h-full bg-gradient-to-br ${tag.gradient} opacity-80`}
                        />
                    )}
                    {/* Overlay gradient pour lisibilité */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
                </div>

                {/* Content */}
                <div className='p-6 md:p-8 space-y-4'>
                    {/* Meta */}
                    <div className='flex items-center gap-3 flex-wrap'>
                        <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tag.badge}`}
                        >
                            {metadata.tag}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                            {readingTime}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                            · {date}
                        </span>
                    </div>

                    {/* Titre */}
                    <h2 className='text-2xl md:text-4xl font-bold tracking-tight leading-tight'>
                        {metadata.title}
                    </h2>

                    {/* Excerpt */}
                    <p className='text-muted-foreground leading-relaxed max-w-2xl line-clamp-3'>
                        {metadata.summary}
                    </p>

                    {/* CTA */}
                    <div className='flex items-center gap-2 text-sm font-medium text-foreground/80 group-hover:text-foreground'>
                        <span>{readLabel}</span>
                        <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
