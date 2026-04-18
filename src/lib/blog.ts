import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';
import { calcReadingTime } from './reading-time';

// ── Types ─────────────────────────────────────────────────────────

export type PostMetadata = {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    tag: string;
    lang: string;
};

export type Post = {
    metadata: PostMetadata;
    slug: string;
    content: string; // source MDX brute pour MDXRemote/rsc
    readingTime: string; // ex: "5 min"
};

export type Heading = {
    id: string;
    text: string;
    level: 2 | 3;
};

// ── Tag colors ────────────────────────────────────────────────────

export type TagConfig = {
    gradient: string;
    gradientFrom: string;
    gradientTo: string;
    badge: string;
    border: string;
    progressColor: string;
};

const TAG_CONFIGS: Record<string, TagConfig> = {
    'IA & LLM': {
        gradient: 'from-violet-600 to-indigo-600',
        gradientFrom: '#7c3aed',
        gradientTo: '#4f46e5',
        badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
        border: 'border-violet-500/30',
        progressColor: '#7c3aed',
    },
    Dev: {
        gradient: 'from-cyan-500 to-teal-500',
        gradientFrom: '#06b6d4',
        gradientTo: '#14b8a6',
        badge: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
        border: 'border-cyan-400/30',
        progressColor: '#06b6d4',
    },
    'Web Development': {
        gradient: 'from-cyan-500 to-teal-500',
        gradientFrom: '#06b6d4',
        gradientTo: '#14b8a6',
        badge: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
        border: 'border-cyan-400/30',
        progressColor: '#06b6d4',
    },
    SEO: {
        gradient: 'from-green-500 to-emerald-500',
        gradientFrom: '#22c55e',
        gradientTo: '#10b981',
        badge: 'bg-green-500/10 text-green-300 border-green-500/20',
        border: 'border-green-500/30',
        progressColor: '#22c55e',
    },
    Carrière: {
        gradient: 'from-orange-500 to-rose-500',
        gradientFrom: '#f97316',
        gradientTo: '#f43f5e',
        badge: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
        border: 'border-orange-500/30',
        progressColor: '#f97316',
    },
    Career: {
        gradient: 'from-orange-500 to-rose-500',
        gradientFrom: '#f97316',
        gradientTo: '#f43f5e',
        badge: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
        border: 'border-orange-500/30',
        progressColor: '#f97316',
    },
};

const DEFAULT_TAG_CONFIG: TagConfig = TAG_CONFIGS['Dev'];

export function getTagConfig(tag: string): TagConfig {
    return TAG_CONFIGS[tag] ?? DEFAULT_TAG_CONFIG;
}

// ── Helpers ───────────────────────────────────────────────────────

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export function extractHeadings(content: string): Heading[] {
    const lines = content.split('\n');
    return lines
        .filter((l) => /^#{2,3}\s+/.test(l))
        .map((l) => {
            const level = l.startsWith('### ') ? 3 : 2;
            const text = l.replace(/^#{2,3}\s+/, '').trim();
            return { id: slugify(text), text, level };
        });
}

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
