import { SITE_URL } from '@/config/site';

export function websiteSchema(locale: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Yann THOBENA's Portfolio",
        inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/${locale}/blog?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };
}

export function personSchema(locale: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Yann THOBENA',
        givenName: 'Yann',
        familyName: 'THOBENA',
        url: `${SITE_URL}/${locale}/about`,
        image: `${SITE_URL}/images/avatar.svg`,
        jobTitle:
            locale === 'fr'
                ? "Concepteur Développeur d'Applications & Expert IA"
                : 'Application Designer & Developer, AI Expert',
        worksFor: {
            '@type': 'Organization',
            name: 'IPANOVA',
            url: 'https://www.ipanova.fr',
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Toulouse',
            addressCountry: 'FR',
        },
        knowsAbout: [
            'Next.js',
            'React',
            'TypeScript',
            'NestJS',
            'PostgreSQL',
            'Docker',
            'Artificial Intelligence',
            'Large Language Models',
            'Retrieval Augmented Generation',
            'Prompt Engineering',
        ],
        sameAs: [
            'https://www.linkedin.com/in/yann-thobena/',
            'https://github.com/thobenayann',
        ],
    };
}

export function profilePageSchema(locale: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url: `${SITE_URL}/${locale}/about`,
        mainEntity: { '@id': `${SITE_URL}/#person` },
        inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
    };
}

type SoftwareAppParams = {
    locale: string;
    slug: string;
    title: string;
    summary: string;
    datePublished: string;
    image?: string;
    applicationUrl?: string;
    keywords?: string[];
};

export function softwareAppSchema(params: SoftwareAppParams) {
    const {
        locale,
        slug,
        title,
        summary,
        datePublished,
        image,
        applicationUrl,
        keywords,
    } = params;
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: title,
        description: summary,
        url: `${SITE_URL}/${locale}/work/${slug}`,
        datePublished,
        image: image ? `${SITE_URL}${image}` : undefined,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        author: { '@id': `${SITE_URL}/#person` },
        creator: { '@id': `${SITE_URL}/#person` },
        keywords: keywords?.join(', '),
        sameAs: applicationUrl,
    };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function articleSchema(params: {
    locale: string;
    slug: string;
    title: string;
    summary: string;
    datePublished: string;
    image?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: params.title,
        description: params.summary,
        url: `${SITE_URL}/${params.locale}/blog/${params.slug}`,
        datePublished: params.datePublished,
        image: params.image
            ? `${SITE_URL}${params.image}`
            : `${SITE_URL}/og?title=${encodeURIComponent(params.title)}`,
        inLanguage: params.locale === 'fr' ? 'fr-FR' : 'en-US',
        author: { '@id': `${SITE_URL}/#person` },
        publisher: { '@id': `${SITE_URL}/#person` },
    };
}
