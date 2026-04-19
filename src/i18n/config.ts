export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';
export const localePrefix = 'always' as const; // SEO: URLs toujours préfixées

export const languages: Record<Locale, string> = {
    en: 'English',
    fr: 'Français',
} as const;
