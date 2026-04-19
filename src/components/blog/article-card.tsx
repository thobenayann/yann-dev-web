'use client';

import { Post, getTagConfig } from '@/lib/blog-types';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Props = { post: Post; locale: string };

export function ArticleCard({ post, locale }: Props) {
    const { metadata, slug, readingTime } = post;
    const tag = getTagConfig(metadata.tag);

    const date = new Date(metadata.publishedAt).toLocaleDateString(
        locale === 'fr' ? 'fr-FR' : 'en-US',
        { year: 'numeric', month: 'short', day: 'numeric' }
    );

    return (
        <motion.div
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className='h-full'
        >
            <Link
                href={`/${locale}/blog/${slug}`}
                className={`group block rounded-xl border bg-white/5 backdrop-blur-sm overflow-hidden hover:bg-white/8 transition-all duration-300 h-full cursor-pointer ${tag.border}`}
            >
                {/* Top gradient bar */}
                <div className={`h-[3px] w-full bg-gradient-to-r ${tag.gradient}`} />

                <div className='p-5 space-y-3'>
                    {/* Meta */}
                    <div className='flex items-center gap-2 flex-wrap'>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tag.badge}`}>
                            {metadata.tag}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                            {readingTime} · {date}
                        </span>
                    </div>

                    {/* Title with animated underline */}
                    <h3 className='text-base md:text-lg font-semibold leading-snug'>
                        <span className='bg-gradient-to-r from-foreground to-foreground bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px] pb-0.5'>
                            {metadata.title}
                        </span>
                    </h3>

                    {/* Excerpt */}
                    <p className='text-base text-muted-foreground line-clamp-3 leading-relaxed'>
                        {metadata.summary}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
