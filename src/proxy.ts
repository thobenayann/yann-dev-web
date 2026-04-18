import createMiddleware from 'next-intl/middleware';
import { defaultLocale, localePrefix, locales } from './i18n/config';
import type { NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
    localePrefix,
});

export function proxy(request: NextRequest) {
    return handleI18nRouting(request);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
