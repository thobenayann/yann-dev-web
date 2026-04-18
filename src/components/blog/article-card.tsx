'use client';

import { Post, getTagConfig } from '@/lib/blog';
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
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            <Link
                href={`/${locale}/blog/${slug}`}
                className={`block rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors h-full`}
            >
                {/* Bande colorée tag */}
                <div
                    className={`h-[4px] w-full bg-gradient-to-r ${tag.gradient}`}
                />
                <div className='p-5 space-y-3'>
                    {/* Meta */}
                    <div className='flex items-center gap-2 flex-wrap'>
                        <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${tag.badge}`}
                        >
                            {metadata.tag}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                            {readingTime}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                            · {date}
                        </span>
                    </div>
                    {/* Titre */}
                    <h3 className='font-semibold text-foreground leading-snug'>
                        {metadata.title}
                    </h3>
                    {/* Excerpt */}
                    <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>
                        {metadata.summary}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
