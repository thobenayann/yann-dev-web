import { BlogFilters } from '@/components/blog/blog-filters';
import { SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getPosts } from '@/lib/blog';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Blog' });
    const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(t('hero.title'))}&subtitle=${encodeURIComponent(t('hero.subtitle'))}`;
    return {
        title: t('title'),
        description: t('description'),
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${SITE_URL}/${locale}/blog`,
            images: [{ url: ogImage }],
        },
        alternates: {
            canonical: `${SITE_URL}/${locale}/blog`,
            languages: routing.locales.reduce(
                (acc, l) => ({ ...acc, [l]: `${SITE_URL}/${l}/blog` }),
                {}
            ),
            types: { 'application/rss+xml': `${SITE_URL}/blog/feed.xml` },
        },
    };
}

export default async function BlogPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Blog' });
    const posts = await getPosts(locale);

    // Unique tags from posts
    const tags = [...new Set(posts.map((p) => p.metadata.tag))];

    return (
        <main className='container mx-auto px-6 md:px-10 py-16 space-y-8'>
            {/* Hero header */}
            <header className='space-y-3 max-w-2xl'>
                <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
                    {t('hero.title')}
                </h1>
                <p className='text-lg text-muted-foreground'>
                    {t('hero.subtitle')}
                </p>
                <p className='text-sm text-muted-foreground'>
                    {t('hero.count', { count: posts.length })}
                </p>
            </header>

            {/* Filters + articles */}
            <BlogFilters
                posts={posts}
                locale={locale}
                tags={tags}
                allLabel={t('filters.all')}
                readLabel={t('readMore')}
            />
        </main>
    );
}
