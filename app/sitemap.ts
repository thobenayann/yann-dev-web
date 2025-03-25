import { baseURL, routes as routesConfig, type Route } from '@/config/routes';
import { getPosts } from '@/utils/mdx-content-manager';
import { MetadataRoute } from 'next';

/**
 * Generates the sitemap for the website following Next.js 15 standards
 * @returns A sitemap configuration object that Next.js will automatically transform to XML
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Get all blog posts and their last modification dates
    const blogs = (await getPosts(['src', 'app', 'blog', 'posts'])).map(
        (post) => ({
            url: `https://${baseURL}/blog/${post.slug}`,
            lastModified: post.metadata.publishedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })
    );

    // Get all work projects and their last modification dates
    const works = (await getPosts(['src', 'app', 'work', 'projects'])).map(
        (post) => ({
            url: `https://${baseURL}/work/${post.slug}`,
            lastModified: post.metadata.publishedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })
    );

    // Get all active routes from the configuration
    const activeRoutes = Object.entries(routesConfig)
        .filter(([_, route]: [string, Route]) => route.isEnabled)
        .map(([path]) => ({
            url: `https://${baseURL}${path === '/' ? '' : path}`,
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'daily' as const,
            priority: path === '/' ? 1.0 : 0.9,
        }));

    return [...activeRoutes, ...blogs, ...works];
}
