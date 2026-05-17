import { JsonLd } from '@/components/seo/json-ld';
import { ProjectDetail } from '@/components/work/project-detail';
import { SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getProjectBySlug, getProjectSlugs } from '@/lib/mdx';
import { breadcrumbSchema, softwareAppSchema } from '@/lib/seo/schemas';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
    const all = await Promise.all(
        routing.locales.map(async (locale) => {
            const slugs = await getProjectSlugs(locale);
            return slugs.map((slug) => ({ locale, slug }));
        })
    );
    return all.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const project = await getProjectBySlug(slug, locale);
    if (!project) return { title: 'Not found' };
    const { metadata } = project;
    const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(metadata.title)}&subtitle=${encodeURIComponent(metadata.summary.slice(0, 120))}`;
    return {
        title: `${metadata.title} — Yann THOBENA`,
        description: metadata.summary,
        openGraph: {
            title: metadata.title,
            description: metadata.summary,
            url: `${SITE_URL}/${locale}/work/${slug}`,
            type: 'article',
            publishedTime: metadata.publishedAt,
            images: [{ url: ogImage, alt: metadata.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: metadata.title,
            description: metadata.summary,
            images: [ogImage],
        },
        alternates: {
            canonical: `${SITE_URL}/${locale}/work/${slug}`,
            languages: routing.locales.reduce(
                (acc, l) => ({
                    ...acc,
                    [l]: `${SITE_URL}/${l}/work/${slug}`,
                }),
                {}
            ),
        },
    };
}

export default async function WorkSlugPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    const project = await getProjectBySlug(slug, locale);
    if (!project) notFound();
    const tNav = await getTranslations({ locale, namespace: 'Navigation' });
    const tWork = await getTranslations({ locale, namespace: 'Work' });

    return (
        <>
            <JsonLd
                data={[
                    softwareAppSchema({
                        locale,
                        slug,
                        title: project.metadata.title,
                        summary: project.metadata.summary,
                        datePublished: project.metadata.publishedAt,
                        image: project.metadata.images[0],
                        applicationUrl: project.metadata.link,
                    }),
                    breadcrumbSchema([
                        { name: tNav('home'), url: `${SITE_URL}/${locale}` },
                        {
                            name: tWork('title'),
                            url: `${SITE_URL}/${locale}/work`,
                        },
                        {
                            name: project.metadata.title,
                            url: `${SITE_URL}/${locale}/work/${slug}`,
                        },
                    ]),
                ]}
            />
            <ProjectDetail project={project} locale={locale} />
        </>
    );
}
