import { defineRouting } from 'next-intl/routing';
import { defaultLocale, localePrefix, locales } from './config';

// Routing config only — navigation utilities live in src/i18n/navigation.ts
export const routing = defineRouting({
    locales,
    defaultLocale,
    localePrefix,
});
