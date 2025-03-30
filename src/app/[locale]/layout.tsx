import '@/app/globals.css';
import { Header } from '@/components/layout/header';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { BackgroundCursor } from '@/components/ui/background-cursor';
import { home, person } from '@/config/content';
import { fontInter } from '@/config/font';
import { baseURL } from '@/config/routes';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return {
        metadataBase: new URL(`https://${baseURL}`),
        title: home.title,
        description: home.description,
        openGraph: {
            title: `${person.firstName}'s Portfolio`,
            description: 'Portfolio website showcasing my work.',
            url: baseURL,
            siteName: `${person.firstName}'s Portfolio`,
            locale: locale === 'fr' ? 'fr_FR' : 'en_US',
            type: 'website',
        },
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

export default async function RootLayout({
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

    let messages;
    try {
        messages = (await import(`@messages/${locale}.json`)).default;
    } catch (error) {
        console.error(`Could not load messages for ${locale}`, error);
        messages = (await import(`@messages/${routing.defaultLocale}.json`))
            .default;
    }

    return (
        <html
            lang={locale}
            className={cn(fontInter.variable, 'h-full font-family-sans')}
            suppressHydrationWarning
        >
            <body className='antialiased h-full flex flex-col gap-6'>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem
                        disableTransitionOnChange
                    >
                        <BackgroundCursor>
                            <div className='w-full h-full flex flex-col'>
                                <Header />
                                {children}
                            </div>
                        </BackgroundCursor>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
