import { SITE_URL } from './site';

export const DEFAULT_SEO = {
    title: "Yann's Portfolio",
    description: 'Portfolio website showcasing my work.',
    openGraph: {
        type: 'website',
        url: SITE_URL,
        siteName: "Yann's Portfolio",
    },
    twitter: {
        card: 'summary_large_image',
    },
} as const;
