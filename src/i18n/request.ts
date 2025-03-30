import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    try {
        // Typically corresponds to the `[locale]` segment
        const requested = await requestLocale;
        const locale = hasLocale(routing.locales, requested)
            ? requested
            : routing.defaultLocale;

        // Charger les messages pour la locale actuelle
        const messages = (await import(`@messages/${locale}.json`)).default;

        return {
            locale,
            messages,
            timeZone: 'Europe/Paris',
        };
    } catch (error) {
        console.error('Error loading messages:', error);
        // Fallback to default locale in case of error
        const fallbackMessages = (
            await import(`@messages/${routing.defaultLocale}.json`)
        ).default;
        return {
            locale: routing.defaultLocale,
            messages: fallbackMessages,
            timeZone: 'Europe/Paris',
        };
    }
});
