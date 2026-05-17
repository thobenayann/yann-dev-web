import { getPosts } from '@/lib/blog';
import { SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

export async function GET() {
    const posts = await getPosts('fr');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yann THOBENA · Blog</title>
    <link>${SITE_URL}/fr/blog</link>
    <description>Articles sur le développement web, l'IA et les retours d'expérience.</description>
    <language>fr-FR</language>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
        .map(
            (post) => `
    <item>
      <title><![CDATA[${post.metadata.title}]]></title>
      <link>${SITE_URL}/fr/blog/${post.slug}</link>
      <guid>${SITE_URL}/fr/blog/${post.slug}</guid>
      <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.metadata.summary}]]></description>
    </item>`
        )
        .join('')}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
