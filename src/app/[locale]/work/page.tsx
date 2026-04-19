import { Projects } from '@/components/ui/projects';
import { SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getProjects } from '@/lib/mdx';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Work' });
    const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(t('hero.title'))}`;
    return {
        title: t('title'),
        description: t('description'),
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${SITE_URL}/${locale}/work`,
            images: [{ url: ogImage }],
        },
        alternates: {
            canonical: `${SITE_URL}/${locale}/work`,
            languages: routing.locales.reduce(
                (acc, l) => ({ ...acc, [l]: `${SITE_URL}/${l}/work` }),
                {}
            ),
        },
    };
}

export default async function WorkPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Work' });
    const projects = await getProjects(locale);

    return (
        <main className='container mx-auto px-6 md:px-10 pt-24 pb-16 space-y-12'>
            <header className='space-y-4 max-w-2xl'>
                <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
                    {t('hero.title')}
                </h1>
                <p className='text-lg text-muted-foreground'>
                    {t('hero.subtitle')}
                </p>
            </header>
            <Projects projects={projects} locale={locale} />
        </main>
    );
}
