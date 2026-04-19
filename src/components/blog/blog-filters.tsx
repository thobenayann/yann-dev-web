'use client';

import { SearchBar } from '@/components/ui/search-bar';
import { Post } from '@/lib/blog-types';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ArticleCard } from './article-card';
import { ArticleCardFeatured } from './article-card-featured';

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

/** Strip dangerous chars, limit length — simple XSS guard for URL params */
function sanitizeQ(raw: string | null): string {
    if (!raw) return '';
    return raw.replace(/[<>"'`]/g, '').slice(0, 200);
}

export function BlogFilters({ posts, locale, tags, allLabel, readLabel }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialise from URL — whitelist tag, sanitize q
    const [activeTag, setActiveTag] = useState<string | null>(() => {
        const t = searchParams.get('tag');
        return t && tags.includes(t) ? t : null;
    });
    const [searchQuery, setSearchQuery] = useState(() =>
        sanitizeQ(searchParams.get('q'))
    );

    // Suggestions = post titles + tags (deduplicated)
    const suggestions = [...new Set([...posts.map((p) => p.metadata.title), ...tags])];

    /** Push tag + q to the URL without a full navigation (scroll: false) */
    const syncUrl = useCallback(
        (tag: string | null, q: string) => {
            const params = new URLSearchParams();
            if (tag) params.set('tag', tag);
            const safeQ = sanitizeQ(q);
            if (safeQ) params.set('q', safeQ);
            const qs = params.toString();
            router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
        },
        [pathname, router]
    );

    const handleTagChange = (tag: string | null) => {
        setActiveTag(tag);
        syncUrl(tag, searchQuery);
    };

    /** Called after SearchBar's 300 ms debounce */
    const handleSearch = (q: string) => {
        const safe = sanitizeQ(q);
        setSearchQuery(safe);
        syncUrl(activeTag, safe);
    };

    const filtered = posts.filter((p) => {
        const matchesTag = !activeTag || p.metadata.tag === activeTag;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            !q ||
            p.metadata.title.toLowerCase().includes(q) ||
            (p.metadata.summary ?? '').toLowerCase().includes(q) ||
            (p.metadata.tag ?? '').toLowerCase().includes(q);
        return matchesTag && matchesSearch;
    });

    const featured = filtered[0] ?? null;
    const rest = filtered.slice(1);

    return (
        <div className='space-y-8'>
            {/* Tags (left) + SearchBar (right) — same row */}
            <div className='flex items-center gap-4'>
                {/* Pills */}
                <div className='flex gap-2 flex-wrap flex-1'>
                    <button
                        onClick={() => handleTagChange(null)}
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
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className='relative'>{allLabel}</span>
                    </button>

                    {tags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleTagChange(activeTag === tag ? null : tag)}
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
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className='relative'>{tag}</span>
                        </button>
                    ))}
                </div>

                {/* SearchBar — right-aligned, no shrink */}
                <div className='flex-shrink-0'>
                    <SearchBar
                        placeholder={locale === 'fr' ? 'Rechercher…' : 'Search…'}
                        suggestions={suggestions}
                        defaultValue={searchQuery}
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            {/* Featured */}
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
                            <ArticleCardFeatured post={featured} locale={locale} readLabel={readLabel} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            {/* Grid */}
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
                    {locale === 'fr' ? 'Aucun article trouvé.' : 'No articles found.'}
                </p>
            )}
        </div>
    );
}
