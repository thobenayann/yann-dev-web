'use client';

import { Post, getTagConfig } from '@/lib/blog-types';
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
                className={`group block rounded-2xl border bg-white/5 overflow-hidden hover:bg-white/8 transition-all duration-300 cursor-pointer ${tag.border}`}
            >
                <div className='flex flex-col md:flex-row'>
                    {/* Image / gradient */}
                    <div className='relative md:w-3/5 aspect-[16/9] md:aspect-auto md:min-h-[320px] overflow-hidden flex-shrink-0'>
                        {metadata.image ? (
                            <Image
                                src={metadata.image}
                                alt={metadata.title}
                                fill
                                className='object-cover transition-transform duration-700 group-hover:scale-105'
                                priority
                            />
                        ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${tag.gradient} opacity-60`} />
                        )}
                        {/* Dark overlay on hover for contrast */}
                        <div className='absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300' />
                        {/* Left color line — desktop */}
                        <div className={`hidden md:block absolute right-0 inset-y-0 w-px bg-gradient-to-b ${tag.gradient} opacity-50`} />
                    </div>

                    {/* Content */}
                    <div className='flex-1 p-7 md:p-10 flex flex-col justify-between gap-6'>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-2 flex-wrap'>
                                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tag.badge}`}>
                                    {metadata.tag}
                                </span>
                                <span className='text-sm text-muted-foreground'>
                                    {readingTime} · {date}
                                </span>
                            </div>

                            {/* Title with animated underline */}
                            <h2 className='text-2xl md:text-3xl font-bold tracking-tight leading-snug'>
                                <span className='bg-gradient-to-r from-foreground to-foreground bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px] pb-0.5'>
                                    {metadata.title}
                                </span>
                            </h2>

                            <p className='text-base text-muted-foreground leading-relaxed'>
                                {metadata.summary}
                            </p>
                        </div>

                        <div className='flex items-center gap-2 text-sm font-medium text-foreground/60 group-hover:text-foreground transition-colors duration-200'>
                            <span>{readLabel}</span>
                            <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
