import 'server-only';
import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';
import type { Post, PostMetadata } from './blog-types';
import { calcReadingTime } from './reading-time';

// Re-export types & client-safe helpers so existing server-side importers keep working.
export type { Post, PostMetadata, Heading, TagConfig } from './blog-types';
export { getTagConfig, extractHeadings } from './blog-types';

// ── Filesystem helpers (server-only) ──────────────────────────────

function postsDir(locale: string): string {
    return path.join(
        process.cwd(),
        'src',
        'app',
        '[locale]',
        'blog',
        'posts',
        locale
    );
}

async function getMDXFiles(dir: string): Promise<string[]> {
    try {
        const files = await fs.readdir(dir);
        return files.filter((f) => path.extname(f) === '.mdx');
    } catch {
        return [];
    }
}

async function readPost(filePath: string, slug: string): Promise<Post> {
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const metadata: PostMetadata = {
        title: String(data.title ?? ''),
        publishedAt: String(data.publishedAt ?? new Date().toISOString()),
        summary: String(data.summary ?? ''),
        image: data.image ? String(data.image) : undefined,
        tag: String(data.tag ?? 'Dev'),
        lang: String(data.lang ?? 'fr'),
    };
    return { metadata, slug, content, readingTime: calcReadingTime(content) };
}

// ── Public API ────────────────────────────────────────────────────

export async function getPostSlugs(locale: string): Promise<string[]> {
    const files = await getMDXFiles(postsDir(locale));
    return files.map((f) => path.basename(f, '.mdx'));
}

export async function getPostBySlug(
    slug: string,
    locale: string
): Promise<Post | null> {
    // Try requested locale first, fallback to other locale
    const locales = [locale, locale === 'fr' ? 'en' : 'fr'];
    for (const l of locales) {
        const filePath = path.join(postsDir(l), `${slug}.mdx`);
        try {
            await fs.access(filePath);
            return await readPost(filePath, slug);
        } catch {
            // file not found, try next locale
        }
    }
    return null;
}

export async function getPosts(locale: string): Promise<Post[]> {
    const slugs = await getPostSlugs(locale);
    const posts = await Promise.all(
        slugs.map(async (slug) => {
            const filePath = path.join(postsDir(locale), `${slug}.mdx`);
            return readPost(filePath, slug);
        })
    );
    return posts.sort(
        (a, b) =>
            new Date(b.metadata.publishedAt).getTime() -
            new Date(a.metadata.publishedAt).getTime()
    );
}
