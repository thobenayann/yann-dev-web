import { routes as routesConfig } from '@/config/routes';
import { SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getProjects } from '@/lib/mdx';
import { MetadataRoute } from 'next';

/**
 * Generates the sitemap for the website following Next.js 15 standards
 * @returns A sitemap configuration object that Next.js will automatically transform to XML
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Blog posts (none for now) – keep empty array to be extended later
    const blogs: MetadataRoute.Sitemap = [];

    // Work projects per locale
    const worksPerLocale = await Promise.all(
        routing.locales.map(async (locale) => {
            const projects = await getProjects(locale);
            return projects.map((post) => ({
                url: `${SITE_URL}/${locale}/work/${post.slug}`,
                lastModified: post.metadata.publishedAt,
                changeFrequency: 'monthly' as const,
                priority: 0.7,
            }));
        })
    );
    const works = worksPerLocale.flat();

    // Active routes replicated per locale
    const now = new Date().toISOString().split('T')[0];
    const activeRoutes = routing.locales.flatMap((locale) =>
        Object.entries(routesConfig)
            .filter(([, route]) => route.isEnabled)
            .map(([path]) => ({
                url: `${SITE_URL}/${locale}${path === '/' ? '' : path}`,
                lastModified: now,
                changeFrequency: 'daily' as const,
                priority: path === '/' ? 1.0 : 0.9,
            }))
    );

    // Legal pages — noindex but included for completeness
    const legalSlugs = ['mentions-legales', 'confidentialite'];
    const legalPages = routing.locales.flatMap((locale) =>
        legalSlugs.map((slug) => ({
            url: `${SITE_URL}/${locale}/legal/${slug}`,
            lastModified: now,
            changeFrequency: 'yearly' as const,
            priority: 0.1,
        }))
    );

    return [...activeRoutes, ...blogs, ...works, ...legalPages];
}
