import { baseURL } from '@/config/routes';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/api/'],
        },
        sitemap: `https://${baseURL}/sitemap.xml`,
        host: `https://${baseURL}`,
    };
}
