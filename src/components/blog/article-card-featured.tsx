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
        { year: 'numeric', month: 'short', day: 'numeric' }
    );

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            <Link
                href={`/${locale}/blog/${slug}`}
                className={`group block rounded-2xl border bg-white/5 backdrop-blur-sm overflow-hidden hover:bg-white/8 transition-all duration-300 ${tag.border}`}
            >
                <div className='flex flex-col md:flex-row'>
                    {/* Image / gradient — compact, left side on desktop */}
                    <div className='relative md:w-2/5 aspect-[16/9] md:aspect-auto md:min-h-[280px] overflow-hidden flex-shrink-0'>
                        {metadata.image ? (
                            <Image
                                src={metadata.image}
                                alt={metadata.title}
                                fill
                                className='object-cover transition-transform duration-500 group-hover:scale-105'
                                priority
                            />
                        ) : (
                            <div
                                className={`w-full h-full bg-gradient-to-br ${tag.gradient} opacity-70`}
                            />
                        )}
                        {/* Gradient overlay for readability on mobile */}
                        <div className='md:hidden absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
                        {/* Left color accent line on desktop */}
                        <div
                            className={`hidden md:block absolute left-0 inset-y-0 w-0.5 bg-gradient-to-b ${tag.gradient}`}
                        />
                    </div>

                    {/* Content — always visible */}
                    <div className='flex-1 p-6 md:p-8 flex flex-col justify-between gap-5'>
                        <div className='space-y-3'>
                            {/* Meta */}
                            <div className='flex items-center gap-2 flex-wrap'>
                                <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tag.badge}`}
                                >
                                    {metadata.tag}
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                    {readingTime} · {date}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className='text-xl md:text-2xl font-bold tracking-tight leading-snug group-hover:text-white transition-colors'>
                                {metadata.title}
                            </h2>

                            {/* Description — always visible */}
                            <p className='text-sm text-muted-foreground leading-relaxed line-clamp-3'>
                                {metadata.summary}
                            </p>
                        </div>

                        {/* CTA */}
                        <div className='flex items-center gap-2 text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors'>
                            <span>{readLabel}</span>
                            <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
