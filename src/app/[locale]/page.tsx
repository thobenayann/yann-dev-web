import { TranslatedHomeContent } from '@/components/i18n/translated-home-content';
import { getProjects } from '@/lib/mdx';
import { PageParams } from '@/types/next';
import { setRequestLocale } from 'next-intl/server';

import { baseURL } from '@/config/routes';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: PageParams<{ locale: string }>) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Home' });

    const title = t('title');
    const description = t('description');
    const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://${baseURL}`,
            images: [
                {
                    url: ogImage,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: `https://${baseURL}`,
            languages: routing.locales.reduce(
                (acc, locale) => ({
                    ...acc,
                    [locale]: `https://${baseURL}/${locale}`,
                }),
                {}
            ),
        },
    };
}

export default async function Home({ params }: PageParams<{ locale: string }>) {
    const { locale } = await params;
    setRequestLocale(locale);

    const projects = await getProjects(locale);

    return <TranslatedHomeContent projects={projects} locale={locale} />;
}
