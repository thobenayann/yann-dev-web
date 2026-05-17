/**
 * Root layout — wraps all pages including root-level ones (e.g. not-found.tsx).
 * Owns <html> and <body>. Locale providers live in [locale]/layout.tsx.
 */
import '@/app/globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { fontInter } from '@/config/font';
import { cn } from '@/lib/utils';
import { getLocale } from 'next-intl/server';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // getLocale() reads x-next-intl-locale set by proxy.ts middleware.
    // Falls back to 'fr' when building the static 404 (no real request).
    let locale = 'fr';
    try {
        locale = await getLocale();
    } catch {
        // static-render context (404.html build) — default locale is fine
    }

    return (
        <html
            lang={locale}
            className={cn(fontInter.variable, 'h-full font-family-sans')}
            suppressHydrationWarning
        >
            <body className='antialiased h-full flex flex-col gap-6 bg-background text-foreground'>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
