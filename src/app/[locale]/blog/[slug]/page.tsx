import { AuthorCard } from '@/components/blog/author-card';
import { ReadingProgress } from '@/components/blog/reading-progress';
import { RelatedArticles } from '@/components/blog/related-articles';
import { Toc } from '@/components/blog/toc';
import { JsonLd } from '@/components/seo/json-ld';
import { getMDXComponents } from '@/components/mdx/mdx-components';
import { SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';
import {
    extractHeadings,
    getPostBySlug,
    getPostSlugs,
    getPosts,
    getTagConfig,
} from '@/lib/blog';
import { articleSchema, breadcrumbSchema } from '@/lib/seo/schemas';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { evaluate } from '@mdx-js/mdx';
import * as jsxRuntime from 'react/jsx-runtime';
import * as jsxDevRuntime from 'react/jsx-dev-runtime';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
    const all = await Promise.all(
        routing.locales.map(async (locale) => {
            const slugs = await getPostSlugs(locale);
            return slugs.map((slug) => ({ locale, slug }));
        })
    );
    return all.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = await getPostBySlug(slug, locale);
    if (!post) return { title: 'Not found' };
    const { metadata } = post;
    const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(metadata.title)}&subtitle=${encodeURIComponent(metadata.summary.slice(0, 120))}`;
    return {
        title: `${metadata.title} — Yann THOBENA`,
        description: metadata.summary,
        openGraph: {
            title: metadata.title,
            description: metadata.summary,
            type: 'article',
            publishedTime: metadata.publishedAt,
            url: `${SITE_URL}/${locale}/blog/${slug}`,
            images: [{ url: ogImage, alt: metadata.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: metadata.title,
            description: metadata.summary,
            images: [ogImage],
        },
        alternates: {
            canonical: `${SITE_URL}/${locale}/blog/${slug}`,
            languages: routing.locales.reduce(
                (acc, l) => ({
                    ...acc,
                    [l]: `${SITE_URL}/${l}/blog/${slug}`,
                }),
                {}
            ),
            types: { 'application/rss+xml': `${SITE_URL}/blog/feed.xml` },
        },
    };
}

const isDev = process.env.NODE_ENV === 'development';

const rehypePlugins = [
    rehypeSlug,
    [
        rehypePrettyCode,
        {
            theme: 'github-dark-dimmed',
            keepBackground: true,
        },
    ],
] as never[];

export default async function BlogSlugPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const post = await getPostBySlug(slug, locale);
    if (!post) notFound();

    const { metadata, content, readingTime } = post;
    const tag = getTagConfig(metadata.tag);
    const headings = extractHeadings(content);
    const t = await getTranslations({ locale, namespace: 'Blog' });
    const tNav = await getTranslations({ locale, namespace: 'Navigation' });

    const runtime = isDev
        ? { ...jsxRuntime, ...jsxDevRuntime }
        : jsxRuntime;
    const evaluated = await evaluate(content, {
        ...(runtime as unknown as Parameters<typeof evaluate>[1]),
        development: isDev,
        rehypePlugins,
    });
    const MDXContent = evaluated.default;

    // Related articles: same tag, different slug, max 2
    const allPosts = await getPosts(locale);
    const related = allPosts
        .filter((p) => p.slug !== slug && p.metadata.tag === metadata.tag)
        .slice(0, 2);

    const date = new Date(metadata.publishedAt).toLocaleDateString(
        locale === 'fr' ? 'fr-FR' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );

    return (
        <>
            {/* Reading progress bar */}
            <ReadingProgress color={tag.progressColor} />

            {/* JSON-LD */}
            <JsonLd
                data={[
                    articleSchema({
                        locale,
                        slug,
                        title: metadata.title,
                        summary: metadata.summary,
                        datePublished: metadata.publishedAt,
                        image: metadata.image,
                    }),
                    breadcrumbSchema([
                        { name: tNav('home'), url: `${SITE_URL}/${locale}` },
                        {
                            name: t('title'),
                            url: `${SITE_URL}/${locale}/blog`,
                        },
                        {
                            name: metadata.title,
                            url: `${SITE_URL}/${locale}/blog/${slug}`,
                        },
                    ]),
                ]}
            />

            <div className='container mx-auto px-6 md:px-10 py-16'>
                {/* Back link */}
                <Link
                    href={`/${locale}/blog`}
                    className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10'
                >
                    <ArrowLeft className='h-4 w-4' />
                    {t('article.backToBlog')}
                </Link>

                {/* Article header */}
                <header className='max-w-3xl space-y-4 mb-8'>
                    <div className='flex items-center gap-3 flex-wrap'>
                        <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tag.badge}`}
                        >
                            {metadata.tag}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                            {t('article.readingTime', { time: readingTime })}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                            · {t('article.publishedAt', { date })}
                        </span>
                    </div>
                    <h1 className='text-3xl md:text-5xl font-bold tracking-tight leading-tight'>
                        {metadata.title}
                    </h1>
                </header>

                {/* Cover image */}
                {metadata.image ? (
                    <div className='relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 max-w-3xl'>
                        <Image
                            src={metadata.image}
                            alt={metadata.title}
                            fill
                            className='object-cover'
                            priority
                        />
                    </div>
                ) : (
                    <div
                        className={`w-full max-w-3xl aspect-[16/9] rounded-2xl bg-gradient-to-br ${tag.gradient} opacity-30 mb-10`}
                    />
                )}

                {/* Two-column layout: article + TOC */}
                <div className='flex gap-12 items-start'>
                    {/* Article body */}
                    <article className='min-w-0 flex-1 max-w-2xl space-y-10'>
                        <div className='prose prose-invert max-w-none'>
                            <MDXContent components={getMDXComponents()} />
                        </div>

                        {/* Author card */}
                        <AuthorCard
                            locale={locale}
                            cta={t('authorCard.cta')}
                            contactLabel={t('authorCard.contact')}
                            projectsLabel={t('authorCard.projects')}
                            tag={metadata.tag}
                        />

                        {/* Related articles */}
                        {related.length > 0 && (
                            <RelatedArticles
                                posts={related}
                                locale={locale}
                                title={t('article.relatedTitle')}
                            />
                        )}
                    </article>

                    {/* TOC sidebar (desktop only, hidden via CSS in Toc component) */}
                    <aside className='w-56 flex-shrink-0'>
                        <Toc headings={headings} />
                    </aside>
                </div>
            </div>
        </>
    );
}
