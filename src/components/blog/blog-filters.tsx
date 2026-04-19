'use client';

import { ArticleCard } from './article-card';
import { ArticleCardFeatured } from './article-card-featured';
import { Post } from '@/lib/blog-types';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

type Props = {
    posts: Post[];
    locale: string;
    tags: string[];
    allLabel: string;
    readLabel: string;
};

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};
const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function BlogFilters({
    posts,
    locale,
    tags,
    allLabel,
    readLabel,
}: Props) {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const filtered = activeTag
        ? posts.filter((p) => p.metadata.tag === activeTag)
        : posts;

    const featured = filtered[0] ?? null;
    const rest = filtered.slice(1);

    return (
        <div className='space-y-8'>
            {/* Filter pills — clean row, no black bar */}
            <div className='flex gap-2 flex-wrap'>
                <button
                    onClick={() => setActiveTag(null)}
                    className={`relative flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                        activeTag === null
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {activeTag === null && (
                        <motion.span
                            layoutId='filter-pill'
                            className='absolute inset-0 rounded-full bg-white/12 border border-white/20'
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                            }}
                        />
                    )}
                    <span className='relative'>{allLabel}</span>
                </button>

                {tags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() =>
                            setActiveTag(activeTag === tag ? null : tag)
                        }
                        className={`relative flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                            activeTag === tag
                                ? 'text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {activeTag === tag && (
                            <motion.span
                                layoutId='filter-pill'
                                className='absolute inset-0 rounded-full bg-white/12 border border-white/20'
                                transition={{
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 30,
                                }}
                            />
                        )}
                        <span className='relative'>{tag}</span>
                    </button>
                ))}
            </div>

            {/* Featured article */}
            {featured && (
                <div>
                    <p className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-4'>
                        {locale === 'fr' ? 'À la une' : 'Featured'}
                    </p>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={featured.slug}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                        >
                            <ArticleCardFeatured
                                post={featured}
                                locale={locale}
                                readLabel={readLabel}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            {/* Compact grid */}
            {rest.length > 0 && (
                <div>
                    <p className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-4'>
                        {locale === 'fr' ? 'Tous les articles' : 'All articles'}
                    </p>
                <motion.div
                    variants={container}
                    initial='hidden'
                    animate='show'
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                >
                    <AnimatePresence>
                        {rest.map((post) => (
                            <motion.div key={post.slug} variants={item} layout>
                                <ArticleCard post={post} locale={locale} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
                </div>
            )}

            {filtered.length === 0 && (
                <p className='text-center text-muted-foreground py-12'>
                    Aucun article pour ce filtre.
                </p>
            )}
        </div>
    );
}
