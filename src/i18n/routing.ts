import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

// A list of all locales that are supported
export const locales = ['en', 'fr'] as const;

export type Locale = (typeof locales)[number];

export const routing = defineRouting({
    locales,
    defaultLocale: 'en',
    localePrefix: 'always',
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
