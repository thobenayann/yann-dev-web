import { TranslatedHomeContent } from '@/components/i18n/translated-home-content';
import { getProjects } from '@/lib/mdx';
import { setRequestLocale } from 'next-intl/server';

import { DEFAULT_SEO } from '@/config/seo';
import { SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Home' });

    const title = t('title');
    const description = t('description');
    const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(title)}`;

    return {
        ...DEFAULT_SEO,
        title,
        description,
        openGraph: {
            ...DEFAULT_SEO.openGraph,
            title,
            description,
            images: [
                {
                    url: ogImage,
                    alt: title,
                },
            ],
        },
        twitter: {
            ...DEFAULT_SEO.twitter,
            title,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: SITE_URL,
            languages: routing.locales.reduce(
                (acc, locale) => ({
                    ...acc,
                    [locale]: `${SITE_URL}/${locale}`,
                }),
                {}
            ),
        },
    };
}

export default async function Home({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const projects = await getProjects(locale);

    return <TranslatedHomeContent projects={projects} locale={locale} />;
}
