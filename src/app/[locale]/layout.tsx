import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { JsonLd } from '@/components/seo/json-ld';
import { BackgroundCursor } from '@/components/ui/background-cursor';
import { DEFAULT_SEO } from '@/config/seo';
import { SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';
import { personSchema, websiteSchema } from '@/lib/seo/schemas';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import {
    getMessages,
    getTranslations,
    setRequestLocale,
} from 'next-intl/server';
import { redirect } from 'next/navigation';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    const tSEO = await getTranslations({ locale, namespace: 'SEO' });

    return {
        metadataBase: new URL(SITE_URL),
        ...DEFAULT_SEO,
        openGraph: {
            ...DEFAULT_SEO.openGraph,
            title: tSEO('ogTitle'),
            description: tSEO('ogDescription'),
            siteName: tSEO('ogSiteName'),
            locale: locale === 'fr' ? 'fr_FR' : 'en_US',
        },
        title: tSEO('siteTitle'),
        description: tSEO('siteDescription'),
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        redirect(`/${routing.defaultLocale}`);
    }

    // Enable static rendering
    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <>
            <JsonLd data={[websiteSchema(locale), personSchema(locale)]} />
            <NextIntlClientProvider messages={messages} locale={locale}>
                <BackgroundCursor>
                    <div className='w-full h-full flex flex-col'>
                        <Header />
                        {children}
                        <Footer locale={locale} />
                    </div>
                </BackgroundCursor>
            </NextIntlClientProvider>
        </>
    );
}
