import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next.js 16: file renamed proxy.ts, export named `proxy` (default also accepted)
export const proxy = createMiddleware(routing);

export default proxy;

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
